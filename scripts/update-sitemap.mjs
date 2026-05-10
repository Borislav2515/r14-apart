import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const sitemapPath = resolve(process.cwd(), "public", "sitemap.xml");
const today = new Date().toISOString().slice(0, 10);

const sitemap = readFileSync(sitemapPath, "utf8");
const lastmodRegex = /<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/g;
const matches = sitemap.match(lastmodRegex);

if (!matches || matches.length === 0) {
  console.log("No <lastmod> tags found in sitemap.xml");
  process.exit(0);
}

const updated = sitemap.replace(lastmodRegex, `<lastmod>${today}</lastmod>`);

if (updated !== sitemap) {
  writeFileSync(sitemapPath, updated, "utf8");
  console.log(`Updated sitemap lastmod to ${today}`);
} else {
  console.log(`Sitemap lastmod is already up to date (${today})`);
}
