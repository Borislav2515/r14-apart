import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { FAQ, REVIEW_PLATFORMS } from '../src/data/apartment-data.js';

const root = process.cwd();
const read = (path) => readFileSync(resolve(root, path), 'utf8');
const fail = (message) => {
  console.error(`DATA verification failed: ${message}`);
  process.exitCode = 1;
};

const indexHtml = read('dist/index.html');
const faqHtml = read('dist/faq/index.html');

if (indexHtml.includes('"aggregateRating"')) {
  fail('aggregateRating is still present on the home page schema');
}

if (indexHtml.includes('"availability"')) {
  fail('static Offer availability is still present on the home page schema');
}

if (!indexHtml.includes('"@id":"https://r14-apart.com/#address"')) {
  fail('PostalAddress @id is missing from the home page schema');
}

if (!indexHtml.includes('"address":{"@id":"https://r14-apart.com/#address"}')) {
  fail('Apartment/LodgingBusiness address is not linked to PostalAddress');
}

for (const platform of REVIEW_PLATFORMS.filter((item) => item.sameAs !== false)) {
  if (!indexHtml.includes(platform.href)) {
    fail(`${platform.name} exact sameAs link is missing from schema`);
  }
}

for (const platform of REVIEW_PLATFORMS.filter((item) => item.sameAs === false)) {
  if (indexHtml.includes(platform.href)) {
    fail(`${platform.name} non-exact link is still present in sameAs schema`);
  }
}

const faqMatches = indexHtml.match(/"@type":"Question"/g) || [];
if (faqMatches.length !== FAQ.length) {
  fail(`home FAQ schema has ${faqMatches.length} questions; expected ${FAQ.length}`);
}

if (!faqHtml.includes('"@type":"FAQPage"')) {
  fail('/faq page is missing FAQPage schema');
}

if (!process.exitCode) {
  console.log('DATA verification passed');
}
