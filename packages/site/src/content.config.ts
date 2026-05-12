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

export const collections = { blog, cloud };
