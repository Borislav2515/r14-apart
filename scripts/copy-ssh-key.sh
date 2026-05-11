#!/usr/bin/env bash
set -euo pipefail

# Один раз копирует публичный ключ на сервер (запросит пароль root/VPS).

HOST="${DEPLOY_HOST:-2.26.67.126}"
USER="${DEPLOY_USER:-root}"
PUB="${HOME}/.ssh/id_ed25519.pub"

if [[ ! -f "${PUB}" ]]; then
  echo "Нет ${PUB}. Создай ключ: ssh-keygen -t ed25519 -f ${HOME}/.ssh/id_ed25519"
  exit 1
fi

if ! command -v ssh-copy-id >/dev/null 2>&1; then
  echo "Нужна утилита ssh-copy-id (на macOS обычно есть в составе OpenSSH)."
  exit 1
fi

exec ssh-copy-id -i "${PUB}" -o StrictHostKeyChecking=accept-new "${USER}@${HOST}"
