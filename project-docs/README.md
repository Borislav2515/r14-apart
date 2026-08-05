# R14-APART: описание проекта

Эта папка хранит рабочее описание сайта: что он делает, как устроены URL, где лежат важные данные и какие правила нельзя случайно сломать при будущих правках.

## Что это за сайт

R14-APART — сайт двухуровневых апартаментов посуточно во Владикавказе на ул. Революции 14. Главная задача сайта — дать гостю доверие к объекту и довести до бронирования через HomeReserve, WhatsApp, Telegram или телефон.

Основная аудитория:

- туристы и пары;
- семьи;
- гости, которые едут в Северную Осетию на несколько дней;
- командировочные, которым важны документы, связь и самостоятельный заезд.

## Технический стек

- React 18.
- React Router.
- Vite.
- Статический prerender SEO-страниц через `scripts/prerender-seo.mjs`.
- Sitemap генерируется через `scripts/update-sitemap.mjs`.
- Продакшен отдаётся nginx за Cloudflare.

## Главные файлы

- `src/pages/Home.jsx` — главная страница.
- `src/pages/SeoPage.jsx` — коммерческие SEO-страницы и FAQ.
- `src/pages/BlogIndex.jsx`, `src/pages/BlogPost.jsx` — блог.
- `src/pages/LegalPage.jsx` — правила, privacy, cookies, consent, agreement.
- `src/data/seo.js` — SEO-данные, canonical helpers, коммерческие ссылки, статьи блога.
- `scripts/seo-routes.mjs` — маршруты для sitemap/prerender.
- `scripts/prerender-seo.mjs` — генерация статических HTML.
- `public/robots.txt` — правила обхода.
- `public/sitemap.xml` — карта сайта.

## Документы в этой папке

- `site-structure.md` — структура страниц и пользовательские сценарии.
- `url-and-seo-policy.md` — канонические URL, trailing slash, robots/noindex.
- `operations.md` — как проверять и деплоить без сюрпризов.
- `change-log.md` — важные изменения и почему они сделаны.
