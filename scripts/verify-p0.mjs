import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { canonicalUrlFor } from './seo-routes.mjs';

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
  /200 Мбит/,
  /45 м²/,
];

const expectedSitemapPaths = [
  '/',
  '/bez-posrednikov/',
  '/kvartira-posutochno-vladikavkaz-center/',
  '/komandirovka-vladikavkaz/',
  '/faq/',
  '/rules/',
  '/blog/',
  '/blog/dargavs-guide/',
  '/blog/gde-ostanovitsya-vo-vladikavkaze/',
  '/blog/kak-dobratsya-do-vladikavkaza/',
  '/blog/kurtatinskoe-ushchelye-kadarganvanskiy-kanyon/',
  '/blog/2-days-vladikavkaz/',
  '/blog/where-to-stay-vladikavkaz/',
  '/blog/ossetia-mountains-trip/',
  '/blog/best-places-ossetia/',
  '/blog/business-trip-vladikavkaz/',
  '/blog/apartment-with-self-checkin-vladikavkaz/',
];

const redirectOnlyPaths = [
  '/kvartira-posutochno-vladikavkaz/',
  '/snyat-kvartiru-posutochno-vladikavkaz/',
  '/kvartira-na-sutki-vladikavkaz/',
  '/apartments-vladikavkaz/',
  '/center-vladikavkaz/',
  '/family-apartment/',
  '/weekend-vladikavkaz/',
  '/tourism-vladikavkaz/',
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
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);

if (sitemapLocs.length !== expectedSitemapPaths.length) {
  fail(`expected ${expectedSitemapPaths.length} sitemap URLs, found ${sitemapLocs.length}`);
}

for (const path of expectedSitemapPaths) {
  const url = canonicalUrlFor(path);
  if (!sitemapLocs.includes(url)) {
    fail(`${url} is missing from public/sitemap.xml`);
  }
}

for (const path of redirectOnlyPaths) {
  if (sitemap.includes(path)) {
    fail(`${path} must not be present in public/sitemap.xml`);
  }
}

const analytics = read('src/utils/analytics.js');
if (!analytics.includes('tel:+${phoneNumber}') || !analytics.includes('https://wa.me/${phoneNumber}')) {
  fail('phone/WhatsApp helpers are not using normalized international links');
}

if (!process.exitCode) {
  console.log('P0 verification passed');
}
