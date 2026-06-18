import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { OG_IMAGE, SITE_URL, seoRoutes, serviceRoutes } from './seo-routes.mjs';

const distDir = resolve(process.cwd(), 'dist');
const templatePath = join(distDir, 'index.html');
const template = readFileSync(templatePath, 'utf8');
const renderedAt = new Date().toISOString().slice(0, 10);

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const pageUrl = (path) => new URL(path, SITE_URL).toString();
const stripBrand = (title) => title.replace(/\s*\|\s*R14-APART.*$/, '');

const blogRoutes = seoRoutes.filter((route) => route.schemaType === 'BlogPosting');
const commercialRoutes = seoRoutes.filter(
  (route) => route.type !== 'article' && !['/blog', '/rules'].includes(route.path)
);

const replaceTag = (html, pattern, replacement) => {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace('</head>', `    ${replacement}\n  </head>`);
};

const schemaFor = (route) => {
  const url = pageUrl(route.path);
  const base = {
    '@context': 'https://schema.org',
    '@type': route.schemaType || 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: route.title,
    description: route.description,
    dateModified: renderedAt,
    isPartOf: {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: 'R14-APART',
      url: SITE_URL,
    },
  };

  if (route.schemaType === 'BlogPosting') {
    return {
      ...base,
      '@type': 'BlogPosting',
      headline: route.title.replace(' | R14-APART', ''),
      image: OG_IMAGE,
      datePublished: renderedAt,
      author: {
        '@type': 'Organization',
        name: 'R14-APART',
      },
      publisher: {
        '@type': 'Organization',
        name: 'R14-APART',
      },
      mainEntityOfPage: url,
    };
  }

  if (route.schemaType === 'FAQPage') {
    return {
      ...base,
      '@type': 'FAQPage',
    };
  }

  return base;
};

const linkList = (routes) =>
  routes
    .map((item) => `<li><a href="${item.path}">${escapeHtml(stripBrand(item.title))}</a></li>`)
    .join('');

const breadcrumbItemsFor = (route) => {
  if (route.path === '/') {
    return [{ label: 'Главная', path: '/' }];
  }

  if (route.path === '/blog') {
    return [
      { label: 'Главная', path: '/' },
      { label: 'Блог', path: '/blog' },
    ];
  }

  if (route.type === 'article') {
    return [
      { label: 'Главная', path: '/' },
      { label: 'Блог', path: '/blog' },
      { label: stripBrand(route.title), path: route.path },
    ];
  }

  return [
    { label: 'Главная', path: '/' },
    { label: stripBrand(route.title), path: route.path },
  ];
};

const breadcrumbSchemaFor = (route) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: breadcrumbItemsFor(route).map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.label,
    item: pageUrl(item.path),
  })),
});

const staticArticle = (route) => {
  const title = escapeHtml(stripBrand(route.title));
  const description = escapeHtml(route.description);

  return `
    <article>
      <p>Блог R14-APART</p>
      <h1>${title}</h1>
      <p>${description}</p>
      <section>
        <h2>Главное для поездки</h2>
        <p>Материал помогает быстро сориентироваться перед поездкой во Владикавказ: выбрать район, понять бытовые детали и заранее оценить, какой формат проживания будет удобнее.</p>
      </section>
      <section>
        <h2>База в центре города</h2>
        <p>R14-APART находится на ул. Революции, 14 в историческом центре Владикавказа. Формат подходит туристам, семейным поездкам, командировкам и маршрутам по Северной Осетии.</p>
      </section>
      <section>
        <h2>Условия проживания</h2>
        <p>Апартаменты рассчитаны на размещение до 4 гостей: 45 м², отдельный вход, кухня, Wi-Fi, парковка рядом, самостоятельное заселение 24/7 и прямое онлайн-бронирование.</p>
      </section>
      <nav aria-label="Другие статьи">
        <h2>Другие материалы</h2>
        <ul>${linkList(blogRoutes.filter((item) => item.path !== route.path).slice(0, 6))}</ul>
      </nav>
    </article>`;
};

const staticBlogIndex = () => `
    <main>
      <p>Блог R14-APART</p>
      <h1>Владикавказ и Северная Осетия</h1>
      <p>Гиды по проживанию, маршрутам выходного дня, поездкам в горы и удобной базе в центре Владикавказа.</p>
      <section>
        <h2>Статьи</h2>
        <ul>${linkList(blogRoutes)}</ul>
      </section>
      <section>
        <h2>Апартаменты в центре</h2>
        <p>R14-APART — двухуровневые апартаменты посуточно на ул. Революции, 14: до 4 гостей, кухня, Wi-Fi, парковка рядом и самостоятельное заселение.</p>
      </section>
    </main>`;

const staticCommercialPage = (route) => {
  const title = escapeHtml(stripBrand(route.title));
  const description = escapeHtml(route.description);
  const related = commercialRoutes.filter((item) => item.path !== route.path).slice(0, 8);

  return `
    <main>
      <p>R14-APART · Владикавказ, ул. Революции, 14</p>
      <h1>${title}</h1>
      <p>${description}</p>
      <section>
        <h2>Коротко об апартаментах</h2>
        <p>Двухуровневые апартаменты площадью 45 м² в историческом центре Владикавказа. Подходят для пары, семьи, туристической поездки и командировки.</p>
        <ul>
          <li>До 4 гостей</li>
          <li>Стоимость от 7500 ₽ в сутки</li>
          <li>Wi-Fi, кухня, кондиционер, ванная и стиральная машина</li>
          <li>Отдельный вход и бесконтактное заселение 24/7 по коду</li>
          <li>Парковка рядом и отчётные документы по запросу</li>
        </ul>
      </section>
      <section>
        <h2>Бронирование</h2>
        <p>Можно забронировать даты онлайн на сайте, написать в WhatsApp или Telegram, либо позвонить по телефону +7 906 033 00 14.</p>
      </section>
      <nav aria-label="Полезные страницы">
        <h2>Полезные страницы</h2>
        <ul>${linkList(related)}</ul>
      </nav>
      <nav aria-label="Статьи о поездке">
        <h2>Статьи о Владикавказе</h2>
        <ul>${linkList(blogRoutes.slice(0, 5))}</ul>
      </nav>
    </main>`;
};

const staticRules = () => `
    <main>
      <h1>Правила дома</h1>
      <p>Правила проживания в R14-APART помогают сохранить спокойствие гостей и аккуратное состояние апартаментов.</p>
      <section>
        <h2>Основные условия</h2>
        <p>Заселение проходит самостоятельно по коду, выезд до 12:00. Апартаменты рассчитаны на размещение до 4 гостей. Проживание с животными возможно по предварительному согласованию.</p>
      </section>
    </main>`;

const staticService = (route) => `
    <main>
      <h1>${escapeHtml(stripBrand(route.title))}</h1>
      <p>${escapeHtml(route.description)}</p>
    </main>`;

const staticNotFound = () => `
    <main>
      <p>404</p>
      <h1>Страница не найдена</h1>
      <p>Такой страницы на сайте R14-APART нет. Можно вернуться на главную, открыть блог или проверить даты для бронирования.</p>
      <nav aria-label="Полезные ссылки">
        <ul>
          <li><a href="/">Главная</a></li>
          <li><a href="/blog">Блог</a></li>
          <li><a href="/apartments-vladikavkaz">Об апартаментах</a></li>
        </ul>
      </nav>
    </main>`;

const staticContentFor = (route) => {
  const content =
    route.schemaType === 'BlogPosting'
      ? staticArticle(route)
      : route.path === '/blog'
        ? staticBlogIndex()
        : route.path === '/rules'
          ? staticRules()
          : route.robots?.includes('noindex')
            ? staticService(route)
            : staticCommercialPage(route);

  return `<div class="prerender-content" data-prerender="true">${content}</div>`;
};

const notFoundRoute = {
  path: '/404',
  title: 'Страница не найдена | R14-APART',
  description: 'Такой страницы на сайте R14-APART нет. Можно вернуться на главную, открыть блог или проверить даты для бронирования.',
  robots: 'noindex, nofollow',
};

const renderHtml = (route) => {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const canonical = pageUrl(route.path);
  const robots = route.robots || 'index, follow';
  const type = route.type || 'website';
  const schema = JSON.stringify(schemaFor(route));
  const breadcrumbs = JSON.stringify(breadcrumbSchemaFor(route));

  let html = template;

  html = replaceTag(html, /<title>.*?<\/title>/s, `<title>${title}</title>`);
  html = replaceTag(
    html,
    /<meta name="description" content=".*?"\s*\/>/s,
    `<meta name="description" content="${description}" />`
  );
  html = replaceTag(
    html,
    /<meta name="robots" content=".*?"\s*\/>/s,
    `<meta name="robots" content="${robots}" />`
  );
  html = replaceTag(
    html,
    /<link rel="canonical" href=".*?"\s*\/>/s,
    `<link rel="canonical" href="${canonical}" />`
  );
  html = replaceTag(
    html,
    /<meta property="og:type" content=".*?"\s*\/>/s,
    `<meta property="og:type" content="${type}" />`
  );
  html = replaceTag(
    html,
    /<meta property="og:title" content=".*?"\s*\/>/s,
    `<meta property="og:title" content="${title}" />`
  );
  html = replaceTag(
    html,
    /<meta property="og:description" content=".*?"\s*\/>/s,
    `<meta property="og:description" content="${description}" />`
  );
  html = replaceTag(
    html,
    /<meta property="og:url" content=".*?"\s*\/>/s,
    `<meta property="og:url" content="${canonical}" />`
  );
  html = replaceTag(
    html,
    /<meta property="og:image" content=".*?"\s*\/>/s,
    `<meta property="og:image" content="${OG_IMAGE}" />`
  );
  html = replaceTag(
    html,
    /<meta name="twitter:title" content=".*?"\s*\/>/s,
    `<meta name="twitter:title" content="${title}" />`
  );
  html = replaceTag(
    html,
    /<meta name="twitter:description" content=".*?"\s*\/>/s,
    `<meta name="twitter:description" content="${description}" />`
  );
  html = replaceTag(
    html,
    /<meta name="twitter:image" content=".*?"\s*\/>/s,
    `<meta name="twitter:image" content="${OG_IMAGE}" />`
  );

  html = html.replace(
    '</head>',
    `    <script type="application/ld+json">${schema}</script>\n    <script type="application/ld+json">${breadcrumbs}</script>\n  </head>`
  );

  return html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${staticContentFor(route)}</div>`
  );
};

const outputPathFor = (path) => {
  if (path === '/') return templatePath;
  return join(distDir, path.replace(/^\/+/, ''), 'index.html');
};

const routes = [...seoRoutes, ...serviceRoutes];

routes.forEach((route) => {
  const outputPath = outputPathFor(route.path);
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, renderHtml(route), 'utf8');
});

writeFileSync(
  join(distDir, '404.html'),
  renderHtml(notFoundRoute).replace(
    /<div id="root">.*?<\/div>/s,
    `<div id="root"><div class="prerender-content" data-prerender="true">${staticNotFound()}</div></div>`
  ),
  'utf8'
);

console.log(`Prerendered SEO head and static content for ${routes.length} routes plus 404.html`);
