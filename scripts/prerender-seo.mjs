import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import {
  OG_IMAGE,
  SITE_URL,
  canonicalPathFor,
  canonicalUrlFor,
  seoRoutes,
  serviceRoutes,
} from './seo-routes.mjs';
import { APARTMENT_INFO, REVIEW_PLATFORMS } from '../src/data/apartment-data.js';
import { seoPages, blogPosts, faqItems } from '../src/data/seo.js';

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

const pageUrl = canonicalUrlFor;
const stripBrand = (title) => title.replace(/\s*\|\s*R14-APART.*$/, '');

const blogRoutes = seoRoutes.filter((route) => route.schemaType === 'BlogPosting');
const commercialRoutes = seoRoutes.filter(
  (route) => route.type !== 'article' && !['/blog', '/rules'].includes(route.path)
);

const replaceTag = (html, pattern, replacement) => {
  if (pattern.test(html)) return html.replace(pattern, replacement);
  return html.replace('</head>', `    ${replacement}\n  </head>`);
};

const removeJsonLd = (html) =>
  html.replace(/\s*<script type="application\/ld\+json"[^>]*>.*?<\/script>/gs, '');

const lodgingGraphFor = (route) => {
  const url = pageUrl(route.path);
  const lodgingId = `${SITE_URL}/#lodging`;
  const apartmentId = `${SITE_URL}/#apartment`;
  const offerId = `${url}#offer`;

  return [
    {
      '@type': 'LodgingBusiness',
      '@id': lodgingId,
      name: APARTMENT_INFO.name,
      description: APARTMENT_INFO.description,
      url: SITE_URL,
      image: [OG_IMAGE],
      telephone: `+7${APARTMENT_INFO.phone.slice(1)}`,
      email: APARTMENT_INFO.email,
      priceRange: `от ${APARTMENT_INFO.priceFrom} RUB`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Революции, 14',
        addressLocality: APARTMENT_INFO.city,
        addressRegion: APARTMENT_INFO.region,
        addressCountry: 'RU',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: APARTMENT_INFO.latitude,
        longitude: APARTMENT_INFO.longitude,
      },
      sameAs: REVIEW_PLATFORMS.map((platform) => platform.href),
      petsAllowed: true,
      amenityFeature: APARTMENT_INFO.amenities.map((amenity) => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity.label,
        value: true,
      })),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: String(APARTMENT_INFO.rating),
        reviewCount: String(APARTMENT_INFO.reviewCount),
      },
    },
    {
      '@type': 'Apartment',
      '@id': apartmentId,
      name: APARTMENT_INFO.name,
      description: APARTMENT_INFO.description,
      url,
      image: [OG_IMAGE],
      address: { '@id': lodgingId },
      floorSize: {
        '@type': 'QuantitativeValue',
        value: String(APARTMENT_INFO.area),
        unitCode: 'MTK',
      },
      occupancy: {
        '@type': 'QuantitativeValue',
        maxValue: String(APARTMENT_INFO.guests),
      },
      numberOfRooms: '2',
    },
    {
      '@type': 'Offer',
      '@id': offerId,
      url,
      priceCurrency: 'RUB',
      price: String(APARTMENT_INFO.priceFrom),
      availability: 'https://schema.org/InStock',
      itemOffered: { '@id': apartmentId },
      offeredBy: { '@id': lodgingId },
    },
  ];
};

const faqSchemaFor = (route) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${pageUrl(route.path)}#faq`,
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
});

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
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.a,
        },
      })),
    };
  }

  if (commercialRoutes.some((item) => item.path === route.path)) {
    return {
      '@context': 'https://schema.org',
      '@graph': [
        { ...base, mainEntity: { '@id': `${SITE_URL}/#apartment` } },
        ...lodgingGraphFor(route),
      ],
    };
  }

  return base;
};

const linkList = (routes) =>
  routes
    .map((item) => `<li><a href="${canonicalPathFor(item.path)}">${escapeHtml(stripBrand(item.title))}</a></li>`)
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

const blogBlockHtml = (block) => {
  if (block.type === 'photo') {
    return `
      <figure>
        <div><span>${escapeHtml(block.title)}</span><small>${escapeHtml(block.fileHint || '')}</small></div>
        <figcaption>${escapeHtml(block.caption || '')}</figcaption>
      </figure>`;
  }

  if (block.type === 'heading') {
    const texts = (block.texts || []).map((text) => `<p>${escapeHtml(text)}</p>`).join('');
    const list = block.list
      ? `<ul>${block.list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      : '';
    return `<section><h2>${escapeHtml(block.title)}</h2>${texts}${list}</section>`;
  }

  if (block.type === 'links') {
    const items = block.items.map((item) => `<a href="${canonicalPathFor(item.to)}">${escapeHtml(item.label)}</a>`).join('');
    return `<section><h2>${escapeHtml(block.title)}</h2><div>${items}</div></section>`;
  }

  if (block.type === 'faq') {
    const items = block.items
      .map((item) => `<article><h3>${escapeHtml(item.q)}</h3><p>${escapeHtml(item.a)}</p></article>`)
      .join('');
    return `<section><h2>${escapeHtml(block.title)}</h2><div>${items}</div></section>`;
  }

  if (block.type === 'table') {
    const headers = block.headers.map((header) => `<th>${escapeHtml(header)}</th>`).join('');
    const rows = block.rows
      .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`)
      .join('');
    return `<section><h2>${escapeHtml(block.title)}</h2><table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table></section>`;
  }

  if (block.type === 'cta') {
    return `<section><p>${escapeHtml(block.text)}</p><a href="/">Проверить даты и забронировать апартаменты</a></section>`;
  }

  return `<section><p>${escapeHtml(block.text)}</p></section>`;
};

const staticArticle = (route) => {
  const post = blogPosts.find((item) => item.path === route.path);
  if (!post) return staticService(route);

  const body = post.blocks
    ? post.blocks.map(blogBlockHtml).join('')
    : post.sections
        .map(([title, text]) => `<section><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p></section>`)
        .join('');

  const related = post.related?.length
    ? `
      <nav aria-label="Читайте также">
        <h2>Читайте также</h2>
        <div>${post.related.map((item) => `<a href="${canonicalPathFor(item.to)}">${escapeHtml(item.label)}</a>`).join('')}</div>
      </nav>`
    : '';

  return `
    <article>
      <p>Блог R14-APART</p>
      <h1>${escapeHtml(post.h1)}</h1>
      <p>${escapeHtml(post.excerpt)}</p>
      ${body}
      ${related}
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

const priceCompareHtml = (compare) => {
  if (!compare) return '';

  const rows = compare.rows
    .map((row) => {
      const sourceCell = row.href
        ? `<a href="${row.href}">${escapeHtml(row.source)}</a>`
        : escapeHtml(row.source);
      return `<tr><td>${sourceCell}</td><td>${escapeHtml(row.price)}</td><td>${escapeHtml(row.note)}</td></tr>`;
    })
    .join('');

  return `
      <section>
        <h2>${escapeHtml(compare.title)}</h2>
        <p>${escapeHtml(compare.intro)}</p>
        <table>
          <thead><tr><th>Площадка</th><th>Цена</th><th>Комментарий</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${compare.note ? `<p>${escapeHtml(compare.note)}</p>` : ''}
      </section>`;
};

const staticCommercialPage = (route) => {
  const page = seoPages.find((item) => item.path === route.path);
  if (!page) return staticService(route);

  const related = commercialRoutes.filter((item) => item.path !== route.path).slice(0, 8);
  const isFaqPage = page.slug === 'faq';

  const body = isFaqPage
    ? faqItems
        .map((item) => `<section><h2>${escapeHtml(item.q)}</h2><p>${escapeHtml(item.a)}</p></section>`)
        .join('')
    : page.sections.map((section) => `<section><h2>${escapeHtml(section.title)}</h2><p>${escapeHtml(section.text)}</p></section>`).join('') +
      priceCompareHtml(page.priceCompare) +
      `
      <section>
        <h2>Почему выбирают R14-APART</h2>
        <ul>${APARTMENT_INFO.features.map((feature) => `<li>${escapeHtml(feature.title)}: ${escapeHtml(feature.text)}</li>`).join('')}</ul>
      </section>`;

  return `
    <main>
      <p>R14-APART · Владикавказ, ул. Революции, 14</p>
      <h1>${escapeHtml(page.h1)}</h1>
      <p>${escapeHtml(page.lead)}</p>
      ${body}
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
          <li><a href="/bez-posrednikov">Об апартаментах</a></li>
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
  const shouldAddFaqSchema = route.path === '/' && route.robots !== 'noindex, nofollow';
  const faqSchema = shouldAddFaqSchema ? JSON.stringify(faqSchemaFor(route)) : '';

  let html = removeJsonLd(template);

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
    `    <script type="application/ld+json" data-prerender-schema="true">${schema}</script>\n    <script type="application/ld+json" data-prerender-schema="true">${breadcrumbs}</script>${faqSchema ? `\n    <script type="application/ld+json" data-prerender-schema="true">${faqSchema}</script>` : ''}\n  </head>`
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
