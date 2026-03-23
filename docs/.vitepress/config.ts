import { defineConfig } from 'vitepress'

// Sidebar reflects structure from main mcp-hangar repo
// Docs are fetched at build time from https://github.com/mcp-hangar/mcp-hangar/tree/main/docs

export default defineConfig({
  title: 'MCP Hangar',
  description: 'Parallel MCP Execution — Documentation',

  base: '/docs/',
  outDir: '.vitepress/dist',

  // Force dark mode - this site is always dark
  appearance: 'dark',

  // Ignore dead links during build
  ignoreDeadLinks: [
    /^http:\/\/localhost/,
    /\.py$/,
    /^\.\/\d+-/,
    /^\/docs\//,
    /^\/mcp_hangar\//,
  ],

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
      { text: 'GitHub', link: 'https://github.com/mcp-hangar/mcp-hangar' }
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
        text: 'Cookbook',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/cookbook/' },
          { text: '01 — HTTP Gateway', link: '/cookbook/01-http-gateway' },
          { text: '02 — Health Checks', link: '/cookbook/02-health-checks' },
          { text: '03 — Circuit Breaker', link: '/cookbook/03-circuit-breaker' },
          { text: '04 — Failover', link: '/cookbook/04-failover' },
          { text: '05 — Load Balancing', link: '/cookbook/05-load-balancing' },
          { text: '06 — Rate Limiting', link: '/cookbook/06-rate-limiting' },
          { text: '07 — Observability: Metrics', link: '/cookbook/07-observability-metrics' },
          { text: '08 — Observability: Langfuse', link: '/cookbook/08-observability-langfuse' },
          { text: '09 — Subprocess Providers', link: '/cookbook/09-subprocess-providers' },
          { text: '10 — Discovery: Docker', link: '/cookbook/10-discovery-docker' },
          { text: '11 — Discovery: Kubernetes', link: '/cookbook/11-discovery-kubernetes' },
          { text: '12 — Auth & RBAC', link: '/cookbook/12-auth-rbac' },
          { text: '13 — Production Checklist', link: '/cookbook/13-production-checklist' },
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
          { text: 'Dashboard UI', link: '/guides/DASHBOARD' },
          { text: 'REST API', link: '/guides/REST_API' },
          { text: 'WebSockets', link: '/guides/WEBSOCKETS' },
          { text: 'Facade API', link: '/guides/FACADE_API' },
          { text: 'Log Streaming', link: '/guides/LOG_STREAMING' },
          { text: 'Provider Groups', link: '/guides/PROVIDER_GROUPS' },
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
        text: 'Integrations',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/integrations/' },
          { text: 'OpenLIT (OTLP)', link: '/integrations/openlit-otlp' },
        ]
      },
      {
        text: 'Reference',
        items: [
          { text: 'CLI', link: '/reference/cli' },
          { text: 'Configuration', link: '/reference/configuration' },
          { text: 'REST API Reference', link: '/reference/rest-api' },
          { text: 'MCP Tools', link: '/reference/tools' },
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
          { text: 'Auth Security Audit', link: '/security/AUTH_SECURITY_AUDIT' },
          { text: 'Release Process', link: '/runbooks/RELEASE' },
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mcp-hangar/mcp-hangar' }
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
