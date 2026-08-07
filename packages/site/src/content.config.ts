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

export const collections = { blog, learn, oss };
