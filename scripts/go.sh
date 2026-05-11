#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   npm run go
#   npm run go -- "feat: update landing copy"
#
# Defaults (override with env):
#   DEPLOY_HOST   - 2.26.67.126
#   DEPLOY_USER   - root
#   DEPLOY_PATH   - /var/www/r14-apart
#   DEPLOY_PORT   - 22
#   DEPLOY_BRANCH - current git branch

DEPLOY_HOST="${DEPLOY_HOST:-2.26.67.126}"
DEPLOY_USER="${DEPLOY_USER:-root}"
DEPLOY_PATH="${DEPLOY_PATH:-/var/www/r14-apart}"
DEPLOY_PORT="${DEPLOY_PORT:-22}"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Error: current folder is not a git repository."
  echo "Run: git init && git remote add origin <your-github-url>"
  exit 1
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  echo "Error: git remote 'origin' is not configured."
  echo "Run: git remote add origin <your-github-url>"
  exit 1
fi

CURRENT_BRANCH="$(git branch --show-current)"
DEPLOY_BRANCH="${DEPLOY_BRANCH:-$CURRENT_BRANCH}"
COMMIT_MESSAGE="${1:-deploy: $(date '+%Y-%m-%d %H:%M:%S')}"

if ! command -v rsync >/dev/null 2>&1; then
  echo "Error: rsync is required but not installed."
  exit 1
fi

if ! command -v ssh >/dev/null 2>&1; then
  echo "Error: ssh is required but not installed."
  exit 1
fi

if ! command -v nc >/dev/null 2>&1; then
  echo "Error: nc (netcat) is required for SSH precheck."
  exit 1
fi

echo ">> Deploy target: ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH} (port ${DEPLOY_PORT})"
echo ">> Checking SSH connectivity..."
if ! nc -z -w 5 "$DEPLOY_HOST" "$DEPLOY_PORT"; then
  echo "Error: cannot reach ${DEPLOY_HOST}:${DEPLOY_PORT} (timeout/refused)."
  echo "Check DEPLOY_HOST/DEPLOY_PORT, server firewall/security group, and VPN/network access."
  exit 1
fi

if ! ssh -o BatchMode=yes -o ConnectTimeout=7 -p "$DEPLOY_PORT" "${DEPLOY_USER}@${DEPLOY_HOST}" "echo connected" >/dev/null 2>&1; then
  echo "Error: TCP port is reachable, but SSH login failed for ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PORT}."
  echo "Check SSH key auth, user name, and authorized_keys on the server."
  exit 1
fi

echo ">> Building project..."
npm run build

echo ">> Creating commit (if there are changes)..."
git add -A
if git diff --cached --quiet; then
  echo ">> No changes to commit."
else
  git commit -m "$COMMIT_MESSAGE"
fi

echo ">> Pushing branch '$DEPLOY_BRANCH' to GitHub..."
git push origin "$DEPLOY_BRANCH"

echo ">> Deploying to ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH} ..."
ssh -p "$DEPLOY_PORT" "${DEPLOY_USER}@${DEPLOY_HOST}" "mkdir -p '$DEPLOY_PATH'"
rsync -az --delete -e "ssh -p $DEPLOY_PORT" dist/ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo ">> Deploy completed."
