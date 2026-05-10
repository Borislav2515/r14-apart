#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   npm run go
#   npm run go -- "feat: update landing copy"
#
# Required environment variables:
#   DEPLOY_HOST   - server hostname or IP
#   DEPLOY_USER   - ssh username
#   DEPLOY_PATH   - remote directory where built files will be synced
#
# Optional environment variables:
#   DEPLOY_PORT   - ssh port (default: 22)
#   DEPLOY_BRANCH - branch to push (default: current branch)

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

if [ -z "${DEPLOY_HOST:-}" ] || [ -z "${DEPLOY_USER:-}" ] || [ -z "${DEPLOY_PATH:-}" ]; then
  echo "Error: missing deploy env vars."
  echo "Please set DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH (optionally DEPLOY_PORT, DEPLOY_BRANCH)."
  exit 1
fi

if ! command -v rsync >/dev/null 2>&1; then
  echo "Error: rsync is required but not installed."
  exit 1
fi

echo ">> Creating commit (if there are changes)..."
git add -A
if git diff --cached --quiet; then
  echo ">> No changes to commit."
else
  git commit -m "$COMMIT_MESSAGE"
fi

echo ">> Pushing branch '$DEPLOY_BRANCH' to GitHub..."
git push origin "$DEPLOY_BRANCH"

echo ">> Building project..."
npm run build

echo ">> Ensuring remote deploy directory exists..."
ssh -p "$DEPLOY_PORT" "${DEPLOY_USER}@${DEPLOY_HOST}" "mkdir -p \"$DEPLOY_PATH\""

echo ">> Syncing dist/ to server..."
rsync -az --delete -e "ssh -p $DEPLOY_PORT" dist/ "${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/"

echo ">> Deploy completed."
