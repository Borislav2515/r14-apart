# URL и SEO-политика

## Канонический вид URL

Канонический вид всех внутренних страниц — со слешем на конце.

Примеры:

- правильно: `/bez-posrednikov/`
- неправильно для внутренних ссылок: `/bez-posrednikov`

Исключения:

- главная `/`;
- файлы и ассеты: `/favicon.svg`, `/fonts/...`;
- якоря главной: `/#about`, `/#features`;
- внешние ссылки.

## Почему слеш важен

На продакшене nginx сейчас отдаёт `301` с URL без слеша на URL со слешем. Например:

- `/bez-posrednikov` -> `/bez-posrednikov/`
- `/komandirovka-vladikavkaz` -> `/komandirovka-vladikavkaz/`
- `/kvartira-posutochno-vladikavkaz-center` -> `/kvartira-posutochno-vladikavkaz-center/`

Если внутренняя ссылка ведёт без слеша, поисковик и пользователь проходят лишний редирект. Поэтому все выводимые внутренние ссылки должны идти на canonical path.

## Важная история про trailing slash

Коммит `92d3468 fix: SeoPage trailing-slash bug...` не означает, что слеши надо убирать. Он исправил обратную проблему: React-страница раньше могла неверно определять slug при заходе на URL со слешем.

В `SeoPage` используется:

```js
location.pathname.replace(/^\/+|\/+$/g, '')
```

Это позволяет странице корректно работать и с `/slug`, и с `/slug/`. Наружный canonical при этом остаётся со слешем.

## Где брать canonical helpers

В `src/data/seo.js`:

- `canonicalPathFor(path)` — возвращает путь со слешем.
- `canonicalUrlFor(path)` — возвращает абсолютный URL.
- `commercialPageLinks` — готовый список трёх коммерческих страниц.
- `legalPageLinks` — готовый список legal-страниц.

Правило: компоненты должны импортировать готовые списки или helper, а не писать коммерческие/legal URL вручную.

## Robots и noindex

Для `/privacy/`, `/cookies/`, `/consent/`, `/agreement/` выбран вариант:

- не закрывать в `robots.txt`;
- закрывать от индексации через meta robots `noindex`.

Почему так: если URL закрыт в `robots.txt`, поисковик может не зайти на страницу и не увидеть `noindex`.

`/guest-guide/` остаётся закрытой в `robots.txt`, потому что это сервисная инструкция для гостей.

## Sitemap

Sitemap должен содержать только канонические индексируемые URL со слешем. Генерация:

```bash
npm run prebuild
```

Обычно это запускается автоматически перед `npm run build`.
