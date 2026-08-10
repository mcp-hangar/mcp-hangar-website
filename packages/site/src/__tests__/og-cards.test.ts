import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// Build-output gate for the per-page cards. The astro integration checks the
// same properties during `astro build` so a broken card never reaches dist;
// these assert them again from the test suite, which is where anyone changing
// the templates will look first.

const DIST = path.join(process.cwd(), 'dist');
const EXPECTED = { width: 2400, height: 1260 };

/** Width/height out of the IHDR chunk. */
function pngSize(file: string) {
    const head = Buffer.alloc(24);
    const fd = fs.openSync(file, 'r');
    try {
        fs.readSync(fd, head, 0, 24, 0);
    } finally {
        fs.closeSync(fd);
    }
    expect(head.toString('ascii', 1, 4)).toBe('PNG');
    return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) };
}

function* htmlFiles(dir: string): Generator<string> {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* htmlFiles(full);
        else if (entry.name.endsWith('.html')) yield full;
    }
}

type Page = { page: string; og: string; noindex: boolean };

const pages: Page[] = [...htmlFiles(DIST)].map(file => {
    const html = fs.readFileSync(file, 'utf-8');
    return {
        page: '/' + path.relative(DIST, file).replace(/(^|\/)index\.html$/, ''),
        og: (html.match(/property="og:image"\s+content="([^"]+)"/)?.[1] ?? '')
            .replace(/^https?:\/\/[^/]+/, ''),
        noindex: /name="robots"[^>]*noindex/.test(html),
    };
});

const indexable = pages.filter(p => !p.noindex);

describe('per-page OG cards', () => {
    it('builds a page set worth checking', () => {
        expect(indexable.length).toBeGreaterThan(100);
    });

    it('gives every indexable page its own card, never the site-wide fallback', () => {
        const fellBack = indexable.filter(p => p.og === '/og-image.png').map(p => p.page);
        expect(fellBack).toEqual([]);
    });

    it('points every og:image at a file that exists', () => {
        const missing = indexable
            .filter(p => !fs.existsSync(path.join(DIST, p.og)))
            .map(p => `${p.page} → ${p.og}`);
        expect(missing).toEqual([]);
    });

    it('renders every card at 2400×1260', () => {
        const cards = [...new Set(indexable.map(p => p.og))];
        expect(cards.length).toBeGreaterThan(100);
        for (const card of cards) {
            expect({ card, ...pngSize(path.join(DIST, card)) })
                .toEqual({ card, ...EXPECTED });
        }
    });

    // Distinct cards, not one card reused: an early version of the resolver
    // mapped every docs page to /og/docs.png and the build still passed.
    it('gives distinct pages distinct cards', () => {
        const byCard = new Map<string, number>();
        for (const p of indexable) byCard.set(p.og, (byCard.get(p.og) ?? 0) + 1);
        const shared = [...byCard.entries()].filter(([, n]) => n > 1);
        expect(shared).toEqual([]);
    });

    it('keeps twitter:image on the per-page card too', () => {
        const home = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');
        expect(home).toContain('name="twitter:image" content="https://mcp-hangar.io/og/home.png"');
    });
});

describe('OG contact sheet', () => {
    const sheetPath = path.join(DIST, 'og-preview/index.html');

    it('is built', () => {
        expect(fs.existsSync(sheetPath)).toBe(true);
    });

    it('is kept out of search and the sitemap', () => {
        const html = fs.readFileSync(sheetPath, 'utf-8');
        expect(html).toContain('name="robots" content="noindex, nofollow"');

        const sitemap = fs.readFileSync(path.join(DIST, 'sitemap-0.xml'), 'utf-8');
        expect(sitemap).not.toContain('/og-preview');

        const robots = fs.readFileSync(path.join(DIST, 'robots.txt'), 'utf-8');
        expect(robots).toContain('Disallow: /og-preview');
    });

    it('shows every card the build emitted', () => {
        const html = fs.readFileSync(sheetPath, 'utf-8');
        const shown = new Set(html.match(/src="(\/og\/[^"]+\.png)"/g) ?? []);
        expect(shown.size).toBe(new Set(indexable.map(p => p.og)).size);
    });
});
