import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { seoRoutes, SITE_URL } from './seo-routes.mjs';

const lastmod = new Date().toISOString().slice(0, 10);

const urlEntries = seoRoutes
  .map(({ path, changefreq, priority }) => `  <url>
    <loc>${SITE_URL}${path}</loc>
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
console.log(`Generated sitemap with ${seoRoutes.length} URLs and lastmod ${lastmod}`);
