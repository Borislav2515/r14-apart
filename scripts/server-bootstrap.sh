#!/usr/bin/env bash
set -euo pipefail

# !!! УСТАРЕЛО, НЕ ЗАПУСКАТЬ БЕЗ ПРАВКИ (проверено на проде 2026-08-01) !!!
# Живой /etc/nginx/sites-available/r14-apart давно разошёлся с этим шаблоном:
# на сервере shared VPS (ещё один сайт wb-deals), HTTPS через Certbot для
# r14-apart.com/www и отдельного ha.r14-apart.com (проксирует на Home Assistant,
# порт 18123). Этот скрипт затирает sites-available/r14-apart голым
# HTTP-конфигом без всего перечисленного и рестартует nginx — прямой путь
# уронить HTTPS и ha.r14-apart.com. Redirect-правила для 11->5 SEO-страниц уже
# накатаны точечным патчем на живой конфиг вручную, а не через этот скрипт.
# (Раньше был ещё proxy_pass на /webhooks/realty-calendar/, порт 8010 — сервис
# уведомлений о бронях в Telegram, владелец отключил его сам 2026-08-01, блок
# удалён из живого конфига точечным патчем.)
# Прежде чем запускать npm run setup:server — сначала обнови этот файл под
# реальную живую конфигурацию (или выполняй изменения точечно, как редиректы).

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
    error_page 404 /404.html;

    # 11 -> 5 SEO page consolidation (2026-08). Must be real HTTP 301s, not
    # client-side JS redirects, so crawlers pass link equity to the new URL.
    location = /apartments-vladikavkaz { return 301 /; }
    location = /apartments-vladikavkaz/ { return 301 /; }
    location = /kvartira-posutochno-vladikavkaz { return 301 /; }
    location = /kvartira-posutochno-vladikavkaz/ { return 301 /; }
    location = /snyat-kvartiru-posutochno-vladikavkaz { return 301 /; }
    location = /snyat-kvartiru-posutochno-vladikavkaz/ { return 301 /; }
    location = /kvartira-na-sutki-vladikavkaz { return 301 /; }
    location = /kvartira-na-sutki-vladikavkaz/ { return 301 /; }
    location = /family-apartment { return 301 /; }
    location = /family-apartment/ { return 301 /; }
    location = /weekend-vladikavkaz { return 301 /; }
    location = /weekend-vladikavkaz/ { return 301 /; }
    location = /tourism-vladikavkaz { return 301 /; }
    location = /tourism-vladikavkaz/ { return 301 /; }
    location = /center-vladikavkaz { return 301 /kvartira-posutochno-vladikavkaz-center/; }
    location = /center-vladikavkaz/ { return 301 /kvartira-posutochno-vladikavkaz-center/; }

    location = /404.html {
        add_header Cache-Control "no-cache";
    }

    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "no-cache";
    }

    location ~* \.(?:js|css|png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
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
    error_page 404 /404.html;

    # 11 -> 5 SEO page consolidation (2026-08). Must be real HTTP 301s, not
    # client-side JS redirects, so crawlers pass link equity to the new URL.
    location = /apartments-vladikavkaz { return 301 /; }
    location = /apartments-vladikavkaz/ { return 301 /; }
    location = /kvartira-posutochno-vladikavkaz { return 301 /; }
    location = /kvartira-posutochno-vladikavkaz/ { return 301 /; }
    location = /snyat-kvartiru-posutochno-vladikavkaz { return 301 /; }
    location = /snyat-kvartiru-posutochno-vladikavkaz/ { return 301 /; }
    location = /kvartira-na-sutki-vladikavkaz { return 301 /; }
    location = /kvartira-na-sutki-vladikavkaz/ { return 301 /; }
    location = /family-apartment { return 301 /; }
    location = /family-apartment/ { return 301 /; }
    location = /weekend-vladikavkaz { return 301 /; }
    location = /weekend-vladikavkaz/ { return 301 /; }
    location = /tourism-vladikavkaz { return 301 /; }
    location = /tourism-vladikavkaz/ { return 301 /; }
    location = /center-vladikavkaz { return 301 /kvartira-posutochno-vladikavkaz-center/; }
    location = /center-vladikavkaz/ { return 301 /kvartira-posutochno-vladikavkaz-center/; }

    location = /404.html {
        add_header Cache-Control "no-cache";
    }

    location / {
        try_files $uri $uri/ =404;
        add_header Cache-Control "no-cache";
    }

    location ~* \.(?:js|css|png|jpg|jpeg|gif|webp|avif|svg|ico|woff2?|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
        access_log off;
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
