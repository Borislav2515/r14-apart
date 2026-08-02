import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { extname, join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { canonicalPathFor, canonicalUrlFor, seoRoutes } from './seo-routes.mjs';

const root = process.cwd();
const distDir = resolve(root, 'dist');
const port = Number(process.env.VERIFY_HYDRATION_PORT || 4187);
const baseUrl = `http://127.0.0.1:${port}`;
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const contentTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const fail = (message) => {
  throw new Error(`Hydration verification failed: ${message}`);
};

const htmlPathFor = (path) => {
  const canonicalPath = canonicalPathFor(path);
  if (canonicalPath === '/') return join(distDir, 'index.html');
  return join(distDir, canonicalPath.replace(/^\/+/, ''), 'index.html');
};

const textBetween = (html, pattern, label, routePath) => {
  const match = html.match(pattern);
  if (!match) fail(`${label} missing in source HTML for ${routePath}`);
  return match[1].replace(/\s+/g, ' ').trim();
};

const sourceSnapshotFor = (route) => {
  const htmlPath = htmlPathFor(route.path);
  if (!existsSync(htmlPath)) fail(`missing prerendered HTML for ${route.path}: ${htmlPath}`);

  const html = readFileSync(htmlPath, 'utf8');

  return {
    title: textBetween(html, /<title>(.*?)<\/title>/s, 'title', route.path),
    h1: textBetween(html, /<h1[^>]*>(.*?)<\/h1>/s, 'h1', route.path).replace(/<[^>]+>/g, ''),
    canonical: textBetween(html, /<link\s+rel="canonical"\s+href="([^"]+)"/s, 'canonical', route.path),
  };
};

const server = createServer((request, response) => {
  const url = new URL(request.url, baseUrl);
  const pathname = decodeURIComponent(url.pathname);
  let filePath = join(distDir, pathname);

  if (existsSync(filePath) && statSync(filePath).isDirectory()) {
    filePath = join(filePath, 'index.html');
  }

  if (!existsSync(filePath)) {
    filePath = htmlPathFor(pathname);
  }

  if (!existsSync(filePath)) {
    response.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    response.end('Not found');
    return;
  }

  response.writeHead(200, { 'content-type': contentTypes[extname(filePath)] || 'application/octet-stream' });
  response.end(readFileSync(filePath));
});

await new Promise((resolveStart) => server.listen(port, '127.0.0.1', resolveStart));

let browser;
try {
  const launchOptions = existsSync(chromePath)
    ? { executablePath: chromePath }
    : { channel: 'chrome' };

  browser = await chromium.launch(launchOptions);
  const page = await browser.newPage();

  for (const route of seoRoutes.filter((item) => !item.robots?.includes('noindex'))) {
    const source = sourceSnapshotFor(route);
    const canonicalPath = canonicalPathFor(route.path);
    const expectedCanonical = canonicalUrlFor(route.path);

    await page.goto(`${baseUrl}${canonicalPath}`, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('h1');
    await page.waitForTimeout(250);

    const hydrated = await page.evaluate(() => ({
      title: document.title.trim(),
      h1: document.querySelector('h1')?.innerText.replace(/\s+/g, ' ').trim() || '',
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
    }));

    for (const field of ['title', 'h1', 'canonical']) {
      if (source[field] !== hydrated[field]) {
        fail(`${route.path} ${field} mismatch: source "${source[field]}" vs hydrated "${hydrated[field]}"`);
      }
    }

    if (hydrated.canonical !== expectedCanonical) {
      fail(`${route.path} canonical ${hydrated.canonical} does not match ${expectedCanonical}`);
    }

    const parsed = new URL(hydrated.canonical);
    if (parsed.hostname !== 'r14-apart.com' || parsed.hostname.startsWith('www.')) {
      fail(`${route.path} canonical host must be r14-apart.com without www`);
    }

    if (parsed.pathname !== canonicalPath) {
      fail(`${route.path} canonical pathname must be ${canonicalPath}`);
    }
  }

  console.log(`Hydration verification passed for ${seoRoutes.filter((item) => !item.robots?.includes('noindex')).length} routes`);
} finally {
  await browser?.close();
  await new Promise((resolveClose) => server.close(resolveClose));
}
