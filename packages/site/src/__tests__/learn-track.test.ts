import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { READING_ORDER, DEEPER_READING, trackPosition } from '../lib/learn-track';

const readDist = (p: string) =>
  fs.readFileSync(path.join(process.cwd(), 'dist', p), 'utf-8');

describe('Learn track', () => {
  it('gives every page in the spine a position and a way onward', () => {
    READING_ORDER.forEach((slug, i) => {
      const t = trackPosition(slug);
      expect(t.index).toBe(i + 1);
      expect(t.total).toBe(READING_ORDER.length);
      // Only the ends are allowed to be dead ends, and only in one direction.
      if (i > 0) expect(t.prev).toBe(READING_ORDER[i - 1]);
      else expect(t.prev).toBeNull();
      if (i < READING_ORDER.length - 1) expect(t.next).toBe(READING_ORDER[i + 1]);
      else expect(t.next).toBeNull();
    });
  });

  it('hands every page off to the docs', () => {
    // The gap this closes: docs linked back to Learn from nothing, and eight
    // pages linked to no sibling. Every stop now names its deeper reading.
    for (const slug of READING_ORDER) {
      expect(DEEPER_READING[slug]?.length ?? 0).toBeGreaterThan(0);
    }
  });

  it('renders the track footer on every built Learn page', () => {
    const slugs = fs
      .readdirSync(path.join(process.cwd(), 'dist', 'learn'), { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);
    expect(slugs.length).toBeGreaterThan(0);
    for (const slug of slugs) {
      const html = readDist(path.join('learn', slug, 'index.html'));
      expect(html).toContain('Learn track');
      expect(html).toContain('Go deeper in the docs');
    }
  });

  it('points the first and last stops the right way', () => {
    const first = readDist(path.join('learn', READING_ORDER[0], 'index.html'));
    expect(first).toContain('Step 1 of');
    expect(first).not.toContain('Previous');

    const last = READING_ORDER[READING_ORDER.length - 1];
    const lastHtml = readDist(path.join('learn', last, 'index.html'));
    expect(lastHtml).not.toContain('>Next<');
  });

  it('never publishes a draft, by any route', () => {
    // A draft is an outline waiting for an author. The guarantee is not "it is
    // not linked" but "it is not reachable": no page, no markdown mirror, and
    // nothing in the machine index a crawler would follow.
    const slug = 'a-registry-is-not-an-enforcement-plane';
    const distDir = path.join(process.cwd(), 'dist');
    expect(fs.existsSync(path.join(distDir, 'learn', slug))).toBe(false);
    expect(fs.existsSync(path.join(distDir, 'learn', `${slug}.md`))).toBe(false);
    expect(readDist('llms.txt')).not.toContain(slug);
    expect(readDist('llms-full.txt')).not.toContain(slug);
    expect(readDist(path.join('learn', 'index.html'))).not.toContain(slug);
  });
});
