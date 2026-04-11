import { defineConfig } from 'vitepress'

// Docs are split into two trees:
//   /docs/cloud/  — Hangar Cloud (managed platform)
//   /docs/oss/    — OSS Agent (fetched from github.com/mcp-hangar/mcp-hangar at build time)

export default defineConfig({
  title: 'MCP Hangar',
  description: 'MCP Hangar v1.0 — OSS agent documentation and reference',

  base: '/docs/',
  outDir: '.vitepress/dist',
  cleanUrls: true,

  // Force dark mode
  appearance: 'dark',

  ignoreDeadLinks: [
    /^http:\/\/localhost/,
    /\.py$/,
    /^\.\/\d+-/,
    /^\/docs\//,
    /^\/mcp_hangar\//,
    /^\/pricing/,
    /^\/plans/,
    /^\/cla/,
    /^\/observability\//,
    // OSS docs fetched at build time — some cross-links may not resolve in all envs
    /^\/oss\//,
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
      { text: 'Docs', link: '/oss/' },
      { text: 'Plans', link: 'https://mcp-hangar.io/plans' },
      { text: 'Blog', link: '/blog/' },
      { text: 'Cloud Waitlist', link: 'https://mcp-hangar.io/waitlist' },
      { text: 'GitHub', link: 'https://github.com/mcp-hangar/mcp-hangar' },
    ],

    // Multi-sidebar: different sidebar per path prefix
    sidebar: {
      // ── Cloud docs ─────────────────────────────────────
      '/cloud/': [
        {
          text: 'Hangar Cloud',
          items: [
            { text: 'Overview', link: '/cloud/' },
            { text: 'Onboarding', link: '/cloud/onboarding' },
            { text: 'Dashboard', link: '/cloud/dashboard' },
            { text: 'Agent Connection', link: '/cloud/agent-connection' },
          ],
        },
        {
          text: 'Platform',
          items: [
            { text: 'Teams & Roles', link: '/cloud/teams' },
            { text: 'API Keys', link: '/cloud/api-keys' },
            { text: 'Billing', link: '/cloud/billing' },
            { text: 'SLA & Uptime', link: '/cloud/sla' },
          ],
        },
        {
          text: 'Resources',
          items: [
            { text: 'OSS Agent Docs ↗', link: '/oss/' },
            { text: 'Blog', link: '/blog/' },
          ],
        },
      ],

      // ── OSS agent docs ─────────────────────────────────
      '/oss/': [
        {
          text: 'Getting Started',
          items: [
            { text: 'Overview', link: '/oss/' },
            { text: 'Installation', link: '/oss/getting-started/installation' },
            { text: 'Quick Start', link: '/oss/getting-started/quickstart' },
          ],
        },
        {
          text: 'Cookbook',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/oss/cookbook/' },
            { text: '01 — HTTP Gateway', link: '/oss/cookbook/01-http-gateway' },
            { text: '02 — Health Checks', link: '/oss/cookbook/02-health-checks' },
            { text: '03 — Circuit Breaker', link: '/oss/cookbook/03-circuit-breaker' },
            { text: '04 — Failover', link: '/oss/cookbook/04-failover' },
            { text: '05 — Load Balancing', link: '/oss/cookbook/05-load-balancing' },
            { text: '06 — Rate Limiting', link: '/oss/cookbook/06-rate-limiting' },
            { text: '07 — Observability: Metrics', link: '/oss/cookbook/07-observability-metrics' },
            { text: '08 — Observability: Langfuse', link: '/oss/cookbook/08-observability-langfuse' },
            { text: '09 — Subprocess Providers', link: '/oss/cookbook/09-subprocess-providers' },
            { text: '10 — Discovery: Docker', link: '/oss/cookbook/10-discovery-docker' },
            { text: '11 — Discovery: Kubernetes', link: '/oss/cookbook/11-discovery-kubernetes' },
            { text: '12 — Auth & RBAC', link: '/oss/cookbook/12-auth-rbac' },
            { text: '13 — Production Checklist', link: '/oss/cookbook/13-production-checklist' },
          ],
        },
        {
          text: 'Architecture',
          items: [
            { text: 'Overview', link: '/oss/architecture/OVERVIEW' },
            { text: 'Event Sourcing', link: '/oss/architecture/EVENT_SOURCING' },
          ],
        },
        {
          text: 'Guides',
          items: [
            { text: 'Dashboard UI', link: '/oss/guides/DASHBOARD' },
            { text: 'REST API', link: '/oss/guides/REST_API' },
            { text: 'WebSockets', link: '/oss/guides/WEBSOCKETS' },
            { text: 'Facade API', link: '/oss/guides/FACADE_API' },
            { text: 'Log Streaming', link: '/oss/guides/LOG_STREAMING' },
            { text: 'Provider Groups', link: '/oss/guides/PROVIDER_GROUPS' },
            { text: 'Batch Invocations', link: '/oss/guides/BATCH_INVOCATIONS' },
            { text: 'Observability', link: '/oss/guides/OBSERVABILITY' },
            { text: 'Authentication', link: '/oss/guides/AUTHENTICATION' },
            { text: 'Testing', link: '/oss/guides/TESTING' },
            { text: 'Containers', link: '/oss/guides/CONTAINERS' },
            { text: 'Kubernetes', link: '/oss/guides/KUBERNETES' },
            { text: 'HTTP Transport', link: '/oss/guides/HTTP_TRANSPORT' },
            { text: 'Discovery', link: '/oss/guides/DISCOVERY' },
          ],
        },
        {
          text: 'Integrations',
          collapsed: false,
          items: [
            { text: 'Overview', link: '/oss/integrations/' },
            { text: 'Splunk (HEC)', link: '/oss/integrations/siem-splunk-hec' },
            { text: 'Datadog', link: '/oss/integrations/siem-datadog' },
            { text: 'Microsoft Sentinel', link: '/oss/integrations/siem-microsoft-sentinel' },
            { text: 'OpenLIT (OTLP)', link: '/oss/integrations/openlit-otlp' },
          ],
        },
        {
          text: 'Reference',
          items: [
            { text: 'CLI', link: '/oss/reference/cli' },
            { text: 'Configuration', link: '/oss/reference/configuration' },
            { text: 'REST API Reference', link: '/oss/reference/rest-api' },
            { text: 'MCP Tools', link: '/oss/reference/tools' },
            { text: 'Hot Reload', link: '/oss/reference/hot-reload' },
          ],
        },
        {
          text: 'Development',
          items: [
            { text: 'Contributing', link: '/oss/development/CONTRIBUTING' },
            { text: 'Code of Conduct', link: '/oss/code-of-conduct' },
          ],
        },
        {
          text: 'Resources',
          items: [
            { text: 'Upgrade Guide', link: '/oss/upgrade' },
            { text: 'Changelog', link: '/oss/changelog' },
            { text: 'Security', link: '/oss/security' },
            { text: 'Auth Security Audit', link: '/oss/security/AUTH_SECURITY_AUDIT' },
            { text: 'Release Process', link: '/oss/runbooks/RELEASE' },
          ],
        },
      ],

      // ── Blog (top-level, shared) ───────────────────────
      '/blog/': [
        {
          text: 'Blog',
          items: [
            { text: 'All Posts', link: '/blog/' },
            { text: 'v1.0 Production Release', link: '/blog/2026-04-11-v1-production-release' },
          ],
        },
        {
          text: 'Docs',
          items: [
            { text: 'OSS Agent Docs ↗', link: '/oss/' },
          ],
        },
      ],
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/mcp-hangar/mcp-hangar' },
    ],

    editLink: {
      pattern: 'https://github.com/mcp-hangar/mcp-hangar-website/edit/main/docs/:path',
      text: 'Edit this page on GitHub',
    },

    search: {
      provider: 'local',
    },

    footer: {
      message: 'MCP Hangar · Released under MIT License.',
      copyright: 'Copyright © 2025-present MCP Hangar',
    },
  },
})
