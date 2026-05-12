import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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

const cloud = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cloud' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sidebar: z.object({
      label: z.string(),
      order: z.number(),
    }).optional(),
    prev: z.string().optional(),
    next: z.string().optional(),
  }),
});

/**
 * OSS docs collection — stub.
 *
 * TODO: Replace the local glob loader with a custom loader that reads
 * from the `@mcp-hangar/docs` npm package once mcp-hangar/docs#3 ships.
 * The custom loader will:
 *   1. Resolve `@mcp-hangar/docs` from node_modules
 *   2. Glob `*.md` from the package
 *   3. Validate frontmatter against this schema
 *   4. Return entries for Astro content collections
 *
 * Until then, content lives in ./src/content/oss/ as local markdown.
 */
const oss = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/oss' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    sidebar: z.object({
      label: z.string(),
      order: z.number(),
    }).optional(),
  }),
});

export const collections = { blog, cloud, oss };
