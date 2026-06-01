import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const SITE_URL = 'https://r14-apart.com';
const lastmod = new Date().toISOString().slice(0, 10);

const routes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/apartments-vladikavkaz', changefreq: 'monthly', priority: '0.9' },
  { path: '/center-vladikavkaz', changefreq: 'monthly', priority: '0.85' },
  { path: '/family-apartment', changefreq: 'monthly', priority: '0.85' },
  { path: '/weekend-vladikavkaz', changefreq: 'monthly', priority: '0.8' },
  { path: '/tourism-vladikavkaz', changefreq: 'monthly', priority: '0.8' },
  { path: '/faq', changefreq: 'monthly', priority: '0.75' },
  { path: '/blog', changefreq: 'weekly', priority: '0.8' },
  { path: '/blog/where-to-stay-vladikavkaz', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/2-days-vladikavkaz', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/ossetia-mountains-trip', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/dargavs-guide', changefreq: 'monthly', priority: '0.7' },
  { path: '/blog/best-places-ossetia', changefreq: 'monthly', priority: '0.7' },
  { path: '/rules', changefreq: 'monthly', priority: '0.3' },
];

const urlEntries = routes
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
console.log(`Generated sitemap with ${routes.length} URLs and lastmod ${lastmod}`);

