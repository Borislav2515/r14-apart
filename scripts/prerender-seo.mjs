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
import { APARTMENT_INFO, FAQ, REVIEW_PLATFORMS } from '../src/data/apartment-data.js';
import { seoPages, blogPosts, faqItems } from '../src/data/seo.js';

const distDir = resolve(process.cwd(), 'dist');
const templatePath = join(distDir, 'index.html');
const template = readFileSync(templatePath, 'utf8');
const renderedAt = new Date().toISOString().slice(0, 10);
const yandexMapUrl = 'https://yandex.ru/maps/org/r14_apart/95912541487/';
const verifiedReviewSchema = {
  '@type': 'Review',
  author: { '@type': 'Person', name: 'Константин' },
  datePublished: '2026-07-15',
  reviewRating: { '@type': 'Rating', ratingValue: '5', bestRating: '5' },
  reviewBody:
    'Апартаменты полностью соответствуют представленным фотографиям. Внутри очень уютно, видно, что хозяева вложили душу в дизайн и ремонт.',
  publisher: { '@type': 'Organization', name: 'Ostrovok.ru' },
};

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const pageUrl = canonicalUrlFor;
const stripBrand = (title) => title.replace(/\s*\|\s*R14-APART.*$/, '');

const blogRoutes = seoRoutes.filter(
  (route) => route.schemaType === 'BlogPosting' && !route.robots?.includes('noindex')
);
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
  const addressId = `${SITE_URL}/#address`;

  return [
    {
      '@type': 'PostalAddress',
      '@id': addressId,
      streetAddress: 'ул. Революции, 14',
      addressLocality: APARTMENT_INFO.city,
      addressRegion: APARTMENT_INFO.region,
      addressCountry: 'RU',
    },
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
      address: { '@id': addressId },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: APARTMENT_INFO.latitude,
        longitude: APARTMENT_INFO.longitude,
      },
      sameAs: REVIEW_PLATFORMS.filter((platform) => platform.sameAs !== false).map((platform) => platform.href),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '21',
        bestRating: '5',
        worstRating: '1',
      },
      review: [verifiedReviewSchema],
      hasMap: yandexMapUrl,
      checkinTime: '14:00',
      checkoutTime: '12:00',
      openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        opens: '00:00',
        closes: '23:59',
      },
      petsAllowed: true,
      currenciesAccepted: 'RUB',
      paymentAccepted: 'Cash, Credit Card',
      amenityFeature: APARTMENT_INFO.amenities.map((amenity) => ({
        '@type': 'LocationFeatureSpecification',
        name: amenity.label,
        value: true,
      })),
    },
    {
      '@type': 'Apartment',
      '@id': apartmentId,
      name: APARTMENT_INFO.name,
      description: APARTMENT_INFO.description,
      url,
      image: [OG_IMAGE],
      address: { '@id': addressId },
      floorSize: {
        '@type': 'QuantitativeValue',
        value: String(APARTMENT_INFO.area),
        unitCode: 'MTK',
      },
      occupancy: {
        '@type': 'QuantitativeValue',
        maxValue: String(APARTMENT_INFO.guests),
      },
      numberOfRooms: 1,
    },
  ];
};

const faqSchemaFor = (route) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  '@id': `${pageUrl(route.path)}#faq`,
  mainEntity: (route.path === '/' ? FAQ : faqItems).map((item) => ({
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
    const post = blogPosts.find((item) => item.path === route.path);
    return {
      ...base,
      '@type': 'BlogPosting',
      headline: route.title.replace(' | R14-APART', ''),
      image: OG_IMAGE,
      ...(post?.publishedAt ? { datePublished: post.publishedAt } : {}),
      ...(post?.modifiedAt ? { dateModified: post.modifiedAt } : {}),
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
      '@id': `${url}#faq`,
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
        .map(([title, text]) => {
          const paragraphs = Array.isArray(text) ? text : [text];
          return `<section><h2>${escapeHtml(title)}</h2>${paragraphs
            .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
            .join('')}</section>`;
        })
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

const distancesHtml = (distances) => {
  if (!distances) return '';

  const rows = distances.rows
    .map((row) => `<tr><td>${escapeHtml(row.place)}</td><td>${escapeHtml(row.distance)}</td></tr>`)
    .join('');

  return `
      <section>
        <h2>${escapeHtml(distances.title)}</h2>
        <p>${escapeHtml(distances.intro)}</p>
        <table>
          <thead><tr><th>Куда</th><th>Расстояние</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
        ${distances.note ? `<p>${escapeHtml(distances.note)}</p>` : ''}
      </section>`;
};

const staticCommercialPage = (route) => {
  const page = seoPages.find((item) => item.path === route.path);
  if (!page) return staticService(route);

  const related = commercialRoutes.filter((item) => item.path !== route.path).slice(0, 8);
  const isFaqPage = page.slug === 'faq';
  const sectionHtml = (section) => {
    const paragraphs = Array.isArray(section.text) ? section.text : [section.text];
    return `<section><h2>${escapeHtml(section.title)}</h2>${paragraphs.map((text) => `<p>${escapeHtml(text)}</p>`).join('')}</section>`;
  };

  const body = isFaqPage
    ? faqItems
        .map((item) => `<section><h2>${escapeHtml(item.q)}</h2><p>${escapeHtml(item.a)}</p></section>`)
        .join('')
    : page.sections.map(sectionHtml).join('') +
      priceCompareHtml(page.priceCompare) +
      distancesHtml(page.distances) +
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
      <p>Правила проживания в R14-APART помогают сохранить спокойствие гостей и аккуратное состояние апартаментов. Мы просим соблюдать их не ради формальности: апартаменты небольшие, камерные и рассчитаны на спокойный формат поездки, поэтому бережное отношение напрямую влияет на комфорт следующих гостей.</p>
      <section>
        <h2>Заезд и выезд</h2>
        <p>Стандартное время заезда — с 14:00. Апартаменты доступны 24/7 по индивидуальному коду от смарт-замка, поэтому поздний приезд возможен без встречи с администратором. Код передаётся гостю после подтверждения бронирования и подготовки апартаментов.</p>
        <p>Стандартное время выезда — до 12:00. Поздний выезд возможен только по предварительному согласованию, потому что после каждого проживания требуется время на уборку и подготовку пространства для следующих гостей. Перед выездом проверьте личные вещи, выключите воду и бытовую технику, закройте окна и дверь.</p>
      </section>
      <section>
        <h2>Проживание и тишина</h2>
        <p>Максимальное размещение — до ${APARTMENT_INFO.guests} гостей. В бронировании должен быть указан фактический состав гостей. Дополнительные гости, ночёвки знакомых и передача апартаментов другим людям возможны только по согласованию.</p>
        <p>Курение внутри апартаментов запрещено, включая электронные сигареты и кальяны. Вечеринки, шумные мероприятия и профессиональные съёмки без согласования не допускаются. Дом находится в центре города, но это жилое пространство, и нам важно сохранять спокойный формат проживания.</p>
      </section>
      <section>
        <h2>Дети, питомцы и имущество</h2>
        <p>С детьми проживать можно. Пожалуйста, учитывайте, что апартаменты двухуровневые: взрослые отвечают за безопасность детей на лестнице и рядом с мебелью. Проживание с воспитанными животными возможно по предварительному согласованию.</p>
        <p>Гость отвечает за сохранность имущества во время проживания, включая текстиль, мебель, посуду и технику. Если что-то сломалось или работает не так, лучше сразу написать — большинство вопросов проще решить быстро, пока гость находится на месте.</p>
      </section>
      <section>
        <h2>Оплата, документы и связь</h2>
        <p>Стоимость проживания зависит от дат, срока и количества гостей. Актуальная цена отображается в модуле бронирования до оплаты. Для командировок по запросу предоставляются отчётные документы. Собственник работает как самозанятый, поэтому НДС в стоимости нет.</p>
        <p>Если документы нужны на организацию или для авансового отчёта, предупредите об этом до оплаты и заранее отправьте реквизиты или требования бухгалтерии. По бытовым вопросам во время проживания лучше писать в WhatsApp или Telegram: так проще отправить фото, уточнить ситуацию и быстро получить ответ.</p>
      </section>
      <section>
        <h2>Безопасность</h2>
        <p>Не используйте открытый огонь, свечи и пиротехнику внутри апартаментов. Не оставляйте включённую плиту, утюг и другие нагревательные приборы без присмотра. Если вы заметили протечку, запах дыма, проблему с электричеством или замком, сразу свяжитесь с нами по телефону.</p>
      </section>
      <section>
        <h2>Как эти правила помогают гостям</h2>
        <p>Правила нужны не для усложнения бронирования, а для предсказуемости. Гость заранее понимает, когда можно заехать, когда нужно выехать, как получить доступ, какие документы запросить и какие ограничения важны внутри апартаментов.</p>
        <p>Если у вас нестандартный сценарий — поздний рейс, животное, ребёнок, командировочные документы, дополнительный гость или необходимость оставить вещи — лучше написать до оплаты. Часть вопросов можно согласовать заранее, а часть зависит от занятости апартаментов и графика уборки.</p>
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
