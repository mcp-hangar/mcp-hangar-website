import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { VERDICT } from '../og/tokens';
import { ogPathFor, OG_FALLBACK } from '../og/resolve';
import { fitTitle } from '../og/render';

// Satori has no CSS custom properties, so the card palette is a second copy of
// the verdict tokens. A second copy is fine as long as it cannot drift, which
// is what this asserts: change a colour in @theme without changing tokens.ts
// and the suite fails rather than the cards quietly rendering last month's red.

const css = fs.readFileSync(
    path.join(process.cwd(), 'src/styles/global.css'),
    'utf-8',
);

const tokenValue = (name: string) =>
    css.match(new RegExp(`--color-${name}:\\s*([^;]+);`))?.[1].trim();

describe('OG palette', () => {
    const pairs: [string, string][] = [
        ['verdict-allow', VERDICT.allow],
        ['verdict-allow-soft', VERDICT.allowSoft],
        ['verdict-deny', VERDICT.deny],
        ['verdict-deny-soft', VERDICT.denySoft],
        ['state-optin', VERDICT.optin],
        ['state-optin-soft', VERDICT.optinSoft],
    ];

    it.each(pairs)('--color-%s matches the satori token', (name, value) => {
        expect(tokenValue(name)).toBe(value);
    });
});

describe('ogPathFor', () => {
    it('maps the sections a card is generated for', () => {
        expect(ogPathFor('/')).toBe('/og/home.png');
        expect(ogPathFor('/blog')).toBe('/og/blog.png');
        expect(ogPathFor('/blog/2026-07-16-security-advisory-cve-2026-59950'))
            .toBe('/og/blog/2026-07-16-security-advisory-cve-2026-59950.png');
        expect(ogPathFor('/docs/adr/ADR-009-independent-release-topology'))
            .toBe('/og/docs/adr/ADR-009-independent-release-topology.png');
        expect(ogPathFor('/privacy')).toBe('/og/privacy.png');
    });

    it('ignores a trailing slash', () => {
        expect(ogPathFor('/learn/')).toBe('/og/learn.png');
        expect(ogPathFor('/learn/more-than-one-hangar/'))
            .toBe('/og/learn/more-than-one-hangar.png');
    });

    it('falls back for anything unmapped', () => {
        expect(ogPathFor('/og-preview')).toBe(OG_FALLBACK);
    });
});

// satori does not honour -webkit-line-clamp, and it will not shrink text to
// fit: whatever comes out of fitTitle is what gets drawn. So the bound has to
// hold on the string itself, which is what these assert.
describe('fitTitle', () => {
    it('drops a size as titles get longer', () => {
        const sizes = ['CLI', 'Deploying the operator to a shared cluster today',
            'Configuring the enforcement plane for multi-tenant clusters with per-namespace egress policy']
            .map(t => fitTitle(t).fontSize);
        expect(sizes).toEqual([...sizes].sort((a, b) => b - a));
        expect(new Set(sizes).size).toBe(3);
    });

    it('never returns a string longer than the smallest tier allows', () => {
        const long = 'Configuring the enforcement plane for multi-tenant clusters where each namespace carries its own egress policy and the operator reconciles admission webhooks across a shared PostgreSQL backed control plane with fencing';
        const fitted = fitTitle(long);
        expect(fitted.truncated).toBe(true);
        expect(fitted.text.length).toBeLessThanOrEqual(105);
        expect(fitted.text.endsWith('…')).toBe(true);
        // Cut between words, not mid-word, and with no dangling punctuation.
        expect(fitted.text).not.toMatch(/[\s,.;:—-]…$/);
        expect(long.startsWith(fitted.text.slice(0, -1))).toBe(true);
    });

    it('leaves a title that fits completely alone', () => {
        const t = 'Two Hangars, one verdict';
        expect(fitTitle(t)).toMatchObject({ text: t, truncated: false });
    });
});
