#!/usr/bin/env bash
set -euo pipefail

# Выполняет server-bootstrap.sh на VPS по SSH (нужен уже настроенный вход по ключу).

HOST="${DEPLOY_HOST:-2.26.67.126}"
USER="${DEPLOY_USER:-root}"
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

ssh -o StrictHostKeyChecking=accept-new "${USER}@${HOST}" bash -s <"${ROOT_DIR}/scripts/server-bootstrap.sh"
