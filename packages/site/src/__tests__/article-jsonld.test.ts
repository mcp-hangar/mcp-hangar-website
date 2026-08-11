import { describe, it, expect } from 'vitest';
import { blogPostingSchema, toJsonLd } from '../lib/article-jsonld';

const base = {
  slug: 'a-post',
  title: 'A post',
  description: 'What it is about.',
  date: new Date('2026-04-11T00:00:00.000Z'),
  author: 'MCP Hangar Team',
  siteUrl: 'https://mcp-hangar.io',
};

describe('blogPostingSchema', () => {
  it('emits dateModified even when the post was never revised', () => {
    const schema = blogPostingSchema(base);
    expect(schema.datePublished).toBe('2026-04-11T00:00:00.000Z');
    expect(schema.dateModified).toBe(schema.datePublished);
  });

  it('prefers a revision date when frontmatter carries one', () => {
    const schema = blogPostingSchema({ ...base, updated: new Date('2026-08-01T00:00:00.000Z') });
    expect(schema.dateModified).toBe('2026-08-01T00:00:00.000Z');
    expect(schema.datePublished).toBe('2026-04-11T00:00:00.000Z');
  });

  // The card path comes from ogPathFor, the same resolver the <head> uses.
  it('points image at the post’s own generated OG card, absolutely', () => {
    expect(blogPostingSchema(base).image).toBe('https://mcp-hangar.io/og/blog/a-post.png');
  });

  it('agrees with the canonical URL on url and mainEntityOfPage', () => {
    const schema = blogPostingSchema(base);
    expect(schema.url).toBe('https://mcp-hangar.io/blog/a-post');
    expect(schema.mainEntityOfPage).toBe(schema.url);
  });

  // Typing a team byline as a Person publishes a claim that such a person
  // exists. A name that is not a known group stays a Person.
  it('types a team byline as an Organization and a name as a Person', () => {
    expect(blogPostingSchema(base).author).toEqual({
      '@type': 'Organization',
      name: 'MCP Hangar Team',
    });
    expect(blogPostingSchema({ ...base, author: 'Marcin Pyrka' }).author).toEqual({
      '@type': 'Person',
      name: 'Marcin Pyrka',
    });
  });

  it('names the same publisher as the site-wide block', () => {
    expect(blogPostingSchema(base).publisher).toEqual({
      '@type': 'Organization',
      name: 'MCP Hangar',
      url: 'https://mcp-hangar.io',
    });
  });

  it('carries no empty values', () => {
    const schema = blogPostingSchema(base);
    for (const [key, value] of Object.entries(schema)) {
      expect(value, key).toBeDefined();
      expect(value, key).not.toBeNull();
      expect(value, key).not.toBe('');
    }
  });
});

describe('toJsonLd', () => {
  // The advisory posts are the ones most likely to quote markup.
  it('escapes < so quoted markup cannot close the script block', () => {
    const serialised = toJsonLd({ description: 'quoting </script> inline' });
    expect(serialised).not.toContain('</script>');
    expect(serialised).toContain('\\u003c/script>');
    expect(JSON.parse(serialised).description).toBe('quoting </script> inline');
  });

  it('round-trips a full schema through JSON.parse', () => {
    expect(JSON.parse(toJsonLd(blogPostingSchema(base)))['@type']).toBe('BlogPosting');
  });
});
