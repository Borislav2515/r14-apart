#!/usr/bin/env bash
set -euo pipefail

# Запускать на сервере от root (или через: ssh root@IP 'bash -s' < scripts/server-bootstrap.sh).
# Debian/Ubuntu: nginx, статика из /var/www/r14-apart, автозапуск nginx, keepalive для sshd.

WEB_ROOT="/var/www/r14-apart"

if [[ "${EUID:-$(id -u)}" -ne 0 ]]; then
  echo "Запусти от root: sudo bash server-bootstrap.sh"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

if command -v apt-get >/dev/null 2>&1; then
  apt-get update -y
  apt-get install -y nginx
elif command -v dnf >/dev/null 2>&1; then
  dnf install -y nginx
  systemctl enable nginx
elif command -v yum >/dev/null 2>&1; then
  yum install -y nginx
  systemctl enable nginx
else
  echo "Не найден apt-get/dnf/yum. Установи nginx вручную и укажи root ${WEB_ROOT}."
  exit 1
fi

mkdir -p "${WEB_ROOT}"
chown -R root:root "${WEB_ROOT}"
chmod 755 "${WEB_ROOT}"

if [[ -d /etc/nginx/sites-available ]]; then
  cat >/etc/nginx/sites-available/r14-apart <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    root /var/www/r14-apart;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX
  rm -f /etc/nginx/sites-enabled/default
  ln -sf /etc/nginx/sites-available/r14-apart /etc/nginx/sites-enabled/r14-apart
elif [[ -d /etc/nginx/conf.d ]]; then
  if [[ -f /etc/nginx/conf.d/default.conf ]]; then
    mv -f /etc/nginx/conf.d/default.conf /etc/nginx/conf.d/default.conf.bak.$(date +%s) || true
  fi
  cat >/etc/nginx/conf.d/r14-apart.conf <<'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;
    server_name _;
    root /var/www/r14-apart;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
}
NGINX
fi

nginx -t
systemctl enable nginx
systemctl restart nginx

# Дольше держим SSH-сессии при простое (и со стороны сервера).
mkdir -p /etc/ssh/sshd_config.d
cat >/etc/ssh/sshd_config.d/99-keepalive.conf <<'SSHD'
ClientAliveInterval 60
ClientAliveCountMax 3
SSHD

if systemctl is-active --quiet ssh; then
  systemctl reload ssh
elif systemctl is-active --quiet sshd; then
  systemctl reload sshd
fi

echo "Готово: nginx слушает :80, root ${WEB_ROOT}, nginx включён в автозагрузку."
echo "Проверка: curl -sI http://127.0.0.1/ | head -1"
