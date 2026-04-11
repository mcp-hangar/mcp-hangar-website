#!/usr/bin/env node

/**
 * Sitemap Generator
 *
 * Scans dist/ after build and generates a sitemap.xml with all pages.
 * Run after `npm run build` to include both site and docs pages.
 *
 * Usage:
 *   node scripts/generate-sitemap.mjs
 */

import { readdirSync, statSync, writeFileSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST_DIR = join(__dirname, '..', 'dist');
const BASE_URL = 'https://mcp-hangar.io';
const TODAY = new Date().toISOString().split('T')[0];

function findHtmlFiles(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      // Skip asset directories
      if (entry.name === 'assets' || entry.name === '.vitepress') continue;
      findHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith('.html') && entry.name !== '404.html') {
      files.push(fullPath);
    }
  }
  return files;
}

function pathToUrl(filePath) {
  let rel = relative(DIST_DIR, filePath);
  // index.html → /
  if (rel === 'index.html') return '/';
  // docs/index.html → /docs/
  if (rel.endsWith('/index.html')) return '/' + rel.replace('/index.html', '/');
  // foo/bar.html → /foo/bar.html
  return '/' + rel;
}

function priorityForUrl(url) {
  if (url === '/') return '1.0';
  if (url === '/pricing') return '0.9';
  if (url.includes('/docs/cloud/')) return '0.8';
  if (url.includes('/getting-started/')) return '0.8';
  if (url.includes('/cookbook/')) return '0.7';
  if (url.includes('/guides/')) return '0.7';
  if (url.includes('/docs/oss/')) return '0.7';
  if (url.includes('/reference/')) return '0.6';
  if (url.includes('/architecture/')) return '0.6';
  return '0.5';
}

const htmlFiles = findHtmlFiles(DIST_DIR);
const urls = htmlFiles.map(pathToUrl).sort();

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${BASE_URL}${url}</loc>
    <lastmod>${TODAY}</lastmod>
    <priority>${priorityForUrl(url)}</priority>
  </url>`).join('\n')}
</urlset>
`;

const outputPath = join(DIST_DIR, 'sitemap.xml');
writeFileSync(outputPath, xml);
console.log(`[sitemap] Generated ${urls.length} URLs → dist/sitemap.xml`);

