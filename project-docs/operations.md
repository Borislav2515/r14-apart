# Эксплуатация и проверки

## Локальная проверка

Основные команды:

```bash
npm run verify:p0
npm run verify:data
npm run build
```

`npm run build` сначала обновляет sitemap, затем собирает Vite, затем запускает prerender.

## Проверка продакшен URL

Проверять canonical redirect можно так:

```bash
curl -I https://r14-apart.com/bez-posrednikov
curl -I https://r14-apart.com/bez-posrednikov/
```

Ожидаемо:

- без слеша: `301`;
- со слешем: `200`.

Так же проверяются:

- `/komandirovka-vladikavkaz/`
- `/kvartira-posutochno-vladikavkaz-center/`

## Важное про nginx

`scripts/server-bootstrap.sh` помечен как устаревший и опасный для прямого запуска. Живой nginx-конфиг на сервере разошёлся с этим шаблоном. Не запускать `npm run setup:server` без ручной проверки.

Редиректы старых SEO-страниц на продакшене уже были накатаны точечно на живой nginx-конфиг.

## Search Console

Цель текущей SEO-правки: чтобы для трёх коммерческих страниц Search Console перестал показывать в поле «Ссылающаяся страница» значение «Не найдено».

После деплоя:

1. Открыть Search Console.
2. Проверить URL:
   - `https://r14-apart.com/kvartira-posutochno-vladikavkaz-center/`
   - `https://r14-apart.com/komandirovka-vladikavkaz/`
   - `https://r14-apart.com/bez-posrednikov/`
3. Запросить переобход, если нужно.
4. Дождаться обновления данных. Это не мгновенный процесс.
