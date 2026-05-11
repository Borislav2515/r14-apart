#!/usr/bin/env bash
set -euo pipefail

# Добавляет в ~/.ssh/config запись для VPS: ключ, пользователь, keepalive (сессия не рвётся из‑за простоя).

HOST_IP="${DEPLOY_HOST:-2.26.67.126}"
SSH_USER="${DEPLOY_USER:-root}"
KEY="${HOME}/.ssh/id_ed25519"
CONFIG="${HOME}/.ssh/config"
MARKER="# r14-apart VPS (r14apart/scripts/local-ssh-config.sh)"

if [[ ! -f "${KEY}" ]]; then
  echo "Нет ключа ${KEY}. Создай: ssh-keygen -t ed25519 -C \"\$(whoami)@\$(hostname)\" -f \"${KEY}\""
  exit 1
fi

mkdir -p "${HOME}/.ssh"
chmod 700 "${HOME}/.ssh"

if [[ -f "${CONFIG}" ]] && grep -qF "${MARKER}" "${CONFIG}"; then
  echo "Запись для ${HOST_IP} уже есть в ${CONFIG}"
  exit 0
fi

{
  echo ""
  echo "${MARKER}"
  echo "Host ${HOST_IP}"
  echo "    HostName ${HOST_IP}"
  echo "    User ${SSH_USER}"
  echo "    IdentityFile ${KEY}"
  echo "    IdentitiesOnly yes"
  echo "    ServerAliveInterval 60"
  echo "    ServerAliveCountMax 3"
} >> "${CONFIG}"

chmod 600 "${CONFIG}"
echo "Добавлено в ${CONFIG} (Host ${HOST_IP}, keepalive, ключ ${KEY})."
