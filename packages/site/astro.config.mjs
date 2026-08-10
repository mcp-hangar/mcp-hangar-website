import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import ogGate from './integrations/og-gate.mjs';

const SITE_URL = 'https://mcp-hangar.io';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [
    react(),
    mdx(),
    // Strip the trailing slash the sitemap would otherwise emit. This is not
    // cosmetic: vercel.json sets `trailingSlash: false`, so every canonical
    // and og:url on the site is slash-less, and Vercel 308-redirects the
    // slashed form. Without this the sitemap advertised 136 URLs that each
    // redirected, and disagreed with the canonical tag on the page it pointed
    // at. Done in `serialize` rather than with a `trailingSlash` option --
    // this integration version rejects that key, and rejecting it makes it
    // emit no sitemap at all rather than falling back.
    sitemap({
      // The OG contact sheet is a build artefact for humans reviewing cards,
      // not content. It is noindex'd too; this keeps it out of the sitemap so
      // the two surfaces don't contradict each other.
      filter: (page) => !page.startsWith(SITE_URL + '/og-preview'),
      serialize(item) {
        if (item.url !== SITE_URL + '/') item.url = item.url.replace(/\/$/, '');
        return item;
      },
    }),
    ogGate(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
});