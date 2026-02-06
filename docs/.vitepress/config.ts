import { defineConfig } from 'vitepress'

// Sidebar reflects structure from main mcp-hangar repo
// Docs are fetched at build time from https://github.com/mapyr/mcp-hangar/tree/main/docs

export default defineConfig({
  title: 'MCP Hangar',
  description: 'Parallel MCP Execution — Documentation',

  base: '/docs/',
  outDir: '.vitepress/dist',

  // Ignore missing links during build (some may not exist in source repo yet)
  ignoreDeadLinks: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#10b981' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'MCP Hangar Docs' }],
  ],

  themeConfig: {
    logo: '/favicon.svg',

    nav: [
      { text: 'Home', link: 'https://mcp-hangar.io' },
      { text: 'Quick Start', link: '/getting-started/quickstart' },
      { text: 'GitHub', link: 'https://github.com/mapyr/mcp-hangar' }
    ],

    // Sidebar based on fetched docs structure
    sidebar: [
      {
        text: 'Getting Started',
        items: [
          { text: 'Installation', link: '/getting-started/installation' },
          { text: 'Quick Start', link: '/getting-started/quickstart' },
        ]
      },
      {
        text: 'Architecture',
        items: [
          { text: 'Overview', link: '/architecture/OVERVIEW' },
          { text: 'Event Sourcing', link: '/architecture/EVENT_SOURCING' },
        ]
      },
      {
        text: 'Guides',
        items: [
          { text: 'Batch Invocations', link: '/guides/BATCH_INVOCATIONS' },
          { text: 'Observability', link: '/guides/OBSERVABILITY' },
          { text: 'Authentication', link: '/guides/AUTHENTICATION' },
          { text: 'Testing', link: '/guides/TESTING' },
          { text: 'Containers', link: '/guides/CONTAINERS' },
          { text: 'Kubernetes', link: '/guides/KUBERNETES' },
          { text: 'HTTP Transport', link: '/guides/HTTP_TRANSPORT' },
          { text: 'Discovery', link: '/guides/DISCOVERY' },
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'CLI', link: '/reference/cli' },
          { text: 'Hot Reload', link: '/reference/hot-reload' },
        ]
      },
      {
        text: 'Development',
        items: [
          { text: 'Contributing', link: '/development/CONTRIBUTING' },
          { text: 'Code of Conduct', link: '/code-of-conduct' },
        ]
      },
      {
        text: 'Resources',
        items: [
          { text: 'Changelog', link: '/changelog' },
          { text: 'Security', link: '/security' },
          { text: 'Release Process', link: '/runbooks/RELEASE' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mapyr/mcp-hangar' }
    ],

    editLink: {
      pattern: 'https://github.com/mapyr/mcp-hangar/edit/main/docs/:path',
      text: 'Edit this page on GitHub'
    },

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present MCP Hangar Contributors'
    }
  }
})
