import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { blogPosts } from '../src/data/seo.js';

const root = process.cwd();

const files = [
  'src',
  'scripts',
  'public',
  'index.html',
];

const blockedPatterns = [
  /wa\.me\/89060330014/,
  /tel:89060330014/,
  /booking_submit/,
  /Позже можно/,
  /Место для фото/,
];

const temporarilyNoindex = [
  '/blog/dargavs-guide/',
  '/blog/gde-ostanovitsya-vo-vladikavkaze/',
  '/blog/kak-dobratsya-do-vladikavkaza/',
  '/blog/kurtatinskoe-ushchelye-kadarganvanskiy-kanyon/',
];

const read = (path) => readFileSync(resolve(root, path), 'utf8');

const collectTextFiles = async (entries) => {
  const { readdirSync, statSync } = await import('node:fs');
  const result = [];

  const walk = (entry) => {
    const absolute = resolve(root, entry);
    const stat = statSync(absolute);

    if (stat.isDirectory()) {
      for (const child of readdirSync(absolute)) {
        walk(`${entry}/${child}`);
      }
      return;
    }

    if (entry !== 'scripts/verify-p0.mjs' && /\.(jsx?|mjs|css|html|xml|txt)$/.test(entry)) {
      result.push(entry);
    }
  };

  entries.forEach(walk);
  return result;
};

const fail = (message) => {
  console.error(`P0 verification failed: ${message}`);
  process.exitCode = 1;
};

const textFiles = await collectTextFiles(files);

for (const file of textFiles) {
  const content = read(file);
  for (const pattern of blockedPatterns) {
    if (pattern.test(content)) {
      fail(`${pattern} found in ${file}`);
    }
  }
}

const sitemap = read('public/sitemap.xml');
for (const path of temporarilyNoindex) {
  if (sitemap.includes(path)) {
    fail(`${path} is still present in public/sitemap.xml`);
  }
}

const seoData = read('src/data/seo.js');
const seoRoutes = read('scripts/seo-routes.mjs');
for (const path of temporarilyNoindex) {
  const dataIndex = seoData.indexOf(`path: '${path.replace(/\/$/, '')}'`);
  const routesIndex = seoRoutes.indexOf(`path: '${path.replace(/\/$/, '')}'`);

  if (dataIndex === -1 || !seoData.slice(dataIndex, dataIndex + 220).includes("robots: 'noindex, follow'")) {
    fail(`${path} missing noindex marker in src/data/seo.js`);
  }

  if (routesIndex === -1 || !seoRoutes.slice(routesIndex, routesIndex + 220).includes("robots: 'noindex, follow'")) {
    fail(`${path} missing noindex marker in scripts/seo-routes.mjs`);
  }
}

for (const post of blogPosts.filter((item) => !item.robots?.includes('noindex'))) {
  const serialized = JSON.stringify(post);

  for (const path of temporarilyNoindex.map((item) => item.replace(/\/$/, ''))) {
    if (serialized.includes(path)) {
      fail(`indexable post ${post.slug} links to temporarily noindex page ${path}`);
    }
  }
}

const analytics = read('src/utils/analytics.js');
if (!analytics.includes('tel:+${phoneNumber}') || !analytics.includes('https://wa.me/${phoneNumber}')) {
  fail('phone/WhatsApp helpers are not using normalized international links');
}

if (!process.exitCode) {
  console.log('P0 verification passed');
}
