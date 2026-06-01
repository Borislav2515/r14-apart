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

const renderHtml = (route) => {
  const title = escapeHtml(route.title);
  const description = escapeHtml(route.description);
  const canonical = pageUrl(route.path);
  const robots = route.robots || 'index, follow';
  const type = route.type || 'website';
  const schema = JSON.stringify(schemaFor(route));

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

  return html.replace(
    '</head>',
    `    <script type="application/ld+json">${schema}</script>\n  </head>`
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

console.log(`Prerendered SEO head for ${routes.length} routes`);

