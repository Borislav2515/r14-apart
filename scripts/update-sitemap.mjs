import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { canonicalUrlFor, seoRoutes } from './seo-routes.mjs';

const sitemapRoutes = seoRoutes.filter((route) => !route.robots?.includes('noindex'));

const urlEntries = sitemapRoutes
  .map(({ path, changefreq, priority, lastmod }) => `  <url>
    <loc>${canonicalUrlFor(path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`)
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>
`;

writeFileSync(resolve(process.cwd(), 'public', 'sitemap.xml'), sitemap, 'utf8');
console.log(`Generated sitemap with ${sitemapRoutes.length} URLs`);
