import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Build-output gate for per-article structured data.
 *
 * Asserted on `dist/`, not on the source: what a crawler reads is the emitted
 * HTML, and the failure this guards against — a block that renders nowhere, or
 * renders twice, or leaks onto pages that are not articles — is invisible in
 * the component.
 */

const DIST = path.join(process.cwd(), 'dist');

function* htmlFiles(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* htmlFiles(full);
    else if (entry.name.endsWith('.html')) yield full;
  }
}

/** `dist/blog/<slug>/index.html`, excluding the listing at `dist/blog/index.html`. */
const postFiles = [...htmlFiles(path.join(DIST, 'blog'))].filter(
  file => path.relative(DIST, file) !== path.join('blog', 'index.html'),
);

const otherFiles = [...htmlFiles(DIST)].filter(file => !postFiles.includes(file));

const jsonLdBlocks = (html: string): unknown[] =>
  [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(m =>
    JSON.parse(m[1]),
  );

const blogPostings = (html: string): any[] =>
  jsonLdBlocks(html).filter((o: any) => o?.['@type'] === 'BlogPosting');

describe('BlogPosting structured data', () => {
  it('builds the posts this gate is supposed to cover', () => {
    expect(postFiles.length).toBeGreaterThanOrEqual(16);
  });

  it('emits exactly one BlogPosting on every post — all of them, not a sample', () => {
    const wrong = postFiles
      .map(file => ({
        page: path.relative(DIST, file),
        count: (fs.readFileSync(file, 'utf-8').match(/"@type":"BlogPosting"/g) ?? []).length,
      }))
      .filter(p => p.count !== 1);
    expect(wrong).toEqual([]);
  });

  it('emits none anywhere else, including the blog listing', () => {
    const leaked = otherFiles
      .filter(file => fs.readFileSync(file, 'utf-8').includes('"@type":"BlogPosting"'))
      .map(file => path.relative(DIST, file));
    expect(leaked).toEqual([]);
  });

  it('parses, and carries the required fields with no empty values', () => {
    for (const file of postFiles) {
      const page = path.relative(DIST, file);
      const [article] = blogPostings(fs.readFileSync(file, 'utf-8'));

      for (const key of [
        'headline',
        'description',
        'datePublished',
        'dateModified',
        'url',
        'mainEntityOfPage',
        'image',
        'author',
        'publisher',
        'inLanguage',
      ]) {
        expect(article[key], `${page} → ${key}`).toBeTruthy();
        expect(String(article[key]), `${page} → ${key}`).not.toMatch(/undefined|null/);
      }

      // Absolute, and pointing at this post's own generated card.
      const slug = path.dirname(page).replace(/^blog[\\/]/, '');
      expect(article.image, page).toBe(`https://mcp-hangar.io/og/blog/${slug}.png`);
      expect(article.url, page).toBe(`https://mcp-hangar.io/blog/${slug}`);
      expect(article.mainEntityOfPage, page).toBe(article.url);

      // Always present, so an unrevised post is not read as undated.
      expect(article.dateModified, page).toBeTruthy();
      expect(Number.isNaN(Date.parse(article.dateModified)), page).toBe(false);
      expect(Number.isNaN(Date.parse(article.datePublished)), page).toBe(false);

      // The headline is the post's own title, not the page title with its suffix.
      expect(article.headline, page).not.toContain('| MCP Hangar');
    }
  });

  // The product block describes the product; the article block describes the
  // article. Both belong on the page, and neither is nested in the other.
  it('leaves the site-wide SoftwareApplication block intact on posts', () => {
    for (const file of postFiles) {
      const page = path.relative(DIST, file);
      const types = jsonLdBlocks(fs.readFileSync(file, 'utf-8')).map((o: any) => o['@type']);
      expect(types, page).toContain('SoftwareApplication');
      expect(types, page).toContain('BlogPosting');

      const app: any = jsonLdBlocks(fs.readFileSync(file, 'utf-8')).find(
        (o: any) => o['@type'] === 'SoftwareApplication',
      );
      expect(app.mainEntity, page).toBeUndefined();
      expect(app.blogPost, page).toBeUndefined();
      expect(app.publisher, page).toBeUndefined();
    }
  });

  it('names the same publisher the product block names as author', () => {
    const html = fs.readFileSync(postFiles[0], 'utf-8');
    const app: any = jsonLdBlocks(html).find((o: any) => o['@type'] === 'SoftwareApplication');
    const [article] = blogPostings(html);
    expect(article.publisher.name).toBe(app.author.name);
    expect(article.publisher.url).toBe(app.author.url);
  });
});
