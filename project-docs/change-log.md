# Важные изменения

## 2026-08-05: внутренние ссылки и canonical trailing slash

Что сделано:

- Добавлен единый список коммерческих ссылок `commercialPageLinks` в `src/data/seo.js`.
- Добавлен единый список legal-ссылок `legalPageLinks` в `src/data/seo.js`.
- Все три коммерческие страницы теперь ссылаются из подвала.
- Все три коммерческие страницы теперь ссылаются из тела главной через `CommercialLinks`.
- Ссылки в шапке/мобильном меню переведены на канонический вид со слешем.
- Legal-ссылки в подвале и cookie banner переведены на канонический вид со слешем.
- `/privacy/`, `/cookies/`, `/consent/`, `/agreement/` открыты для обхода в `robots.txt`; индексация запрещается meta robots `noindex`.
- `/guest-guide/` оставлена закрытой в `robots.txt`.

Почему так:

- Продакшен уже отдаёт `301` с URL без слеша на URL со слешем.
- Sitemap и canonical helpers уже используют trailing slash.
- Коммит про `SeoPage trailing-slash bug` был про корректное распознавание slug, а не про отмену слеша как canonical.
- Search Console должна увидеть внутренние ссылки на коммерческие страницы, а не только sitemap.

На что смотреть в будущем:

- Не писать `/bez-posrednikov`, `/komandirovka-vladikavkaz`, `/kvartira-posutochno-vladikavkaz-center` вручную в компонентах.
- Использовать `commercialPageLinks` или `canonicalPathFor()`.
- Не закрывать legal-страницы в `robots.txt`, если рассчитываем на meta `noindex`.
