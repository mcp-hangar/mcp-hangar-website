import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { ossDocsLoader } from './content/loaders/oss-docs';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    author: z.string(),
    tags: z.array(z.string()).optional(),
    draft: z.boolean().optional().default(false),
    coverImage: z.string().optional(),
  }),
});

const learn = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/learn' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.string().optional(),
    updated: z.coerce.date(),
    tags: z.array(z.string()).optional(),
    // Discovery-first hub facets (see /learn hub).
    type: z.enum(['Concept', 'Tutorial', 'Why', 'Visual']),
    level: z.enum(['Intro', 'Core', 'Deep']),
    time: z.string(),
    theme: z.enum(['foundations', 'enforcement', 'async', 'observability']),
    // The release this page's subject became true in. A version, not a state:
    // whether it reads as "Since" or "Landing in" is decided against the
    // advertised VERSION at render time (see lib/version-badge).
    since: z.string().regex(/^\d+\.\d+\.\d+/, 'a release, e.g. "2.5.0"'),
    // An outline waiting for its author. Drafts are built by nothing: not the
    // hub, not a route, not llms.txt — so a half-written page cannot be reached
    // by guessing its URL or by a crawler following the machine index.
    draft: z.boolean().optional().default(false),
  }),
});

// Security posture pages: the CVE ledger and the OWASP MCP Top 10 mapping.
//
// A collection rather than hardcoded `.astro` pages, because every `.md` mirror
// route on this site is collection-backed — a static page would ship with no
// markdown twin and appear in no llms.txt section. It also makes "adding a CVE
// entry is one markdown block" true by construction.
//
// The schema is deliberately thinner than `learn`'s: these pages are evergreen
// reference, so they carry no reading-time, level, or `since` facets. `order`
// is the listing order on /security, nothing more.
const security = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/security' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    updated: z.coerce.date(),
    order: z.number(),
  }),
});

const oss = defineCollection({
  loader: ossDocsLoader(),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sidebar: z.object({
      label: z.string(),
      order: z.number(),
    }).optional(),
  }),
});

export const collections = { blog, learn, security, oss };
