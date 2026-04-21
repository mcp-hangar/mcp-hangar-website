import fs from 'node:fs'
import path from 'node:path'

const dirname = new URL('.', import.meta.url).pathname
const distDir = dirname + '../dist'
const templateFile = distDir + '/index.html'

// Note: Using Node's path properly to avoid bugs on different OSes
const resolvedDist = path.resolve(process.cwd(), 'dist')
const resolvedTemplate = path.resolve(resolvedDist, 'index.html')

const routes = [
  {
    path: '/',
    dir: resolvedDist,
    title: 'MCP Hangar -- MCP Governance Platform',
    description: 'Runtime security, audit logging, and governance for Model Context Protocol servers. Control what AI assistants can access in your environment.',
    text: 'MCP Hangar is a governance platform for Model Context Protocol servers. We provide runtime security, audit logging, and access control for AI assistants.',
    type: 'SoftwareApplication',
  },
  {
    path: '/plans',
    dir: path.resolve(resolvedDist, 'plans'),
    title: 'Pricing -- MCP Hangar',
    description: 'Flexible pricing for the Model Context Protocol governance platform. Choose the right plan for your agents.',
    text: 'MCP Hangar pricing plans. We offer flexible pricing for the Model Context Protocol governance platform to fit your agent infrastructure needs.',
    type: 'WebSite',
  },
  {
    path: '/waitlist',
    dir: path.resolve(resolvedDist, 'waitlist'),
    title: 'Join the Waitlist -- MCP Hangar',
    description: 'Get early access to the MCP Hangar cloud platform. Manage, secure, and govern your AI agent infrastructure.',
    text: 'Join the MCP Hangar waitlist for early access to our cloud platform for AI agent governance and security.',
    type: 'WebSite',
  },
  {
    path: '/privacy',
    dir: path.resolve(resolvedDist, 'privacy'),
    title: 'Privacy Policy -- MCP Hangar',
    description: 'Privacy Policy for MCP Hangar. Learn how we handle your data.',
    text: 'Privacy Policy for MCP Hangar. This page details how we handle and protect your personal data.',
    type: 'WebSite',
  },
  {
    path: '/terms',
    dir: path.resolve(resolvedDist, 'terms'),
    title: 'Terms of Service -- MCP Hangar',
    description: 'Terms of Service governing the use of MCP Hangar\'s cloud services and website.',
    text: 'Terms of Service for MCP Hangar. These terms govern your use of our cloud platform and website.',
    type: 'WebSite',
  }
]

function generateHtml(template, route) {
  let html = template
  const url = `https://mcp-hangar.io${route.path === '/' ? '' : route.path}`

  // Replace Title
  html = html.replace(/<title>.*?<\/title>/, `<title>${route.title}</title>`)

  // Replace Description
  html = html.replace(/<meta[^>]*name="description"[^>]*>/i, `<meta name="description" content="${route.description}"/>`)
  html = html.replace(/<meta[^>]*property="og:description"[^>]*>/i, `<meta property="og:description" content="${route.description}"/>`)
  html = html.replace(/<meta[^>]*name="twitter:description"[^>]*>/i, `<meta name="twitter:description" content="${route.description}"/>`)

  // Replace Title in OG/Twitter
  html = html.replace(/<meta[^>]*property="og:title"[^>]*>/i, `<meta property="og:title" content="${route.title}"/>`)
  html = html.replace(/<meta[^>]*name="twitter:title"[^>]*>/i, `<meta name="twitter:title" content="${route.title}"/>`)

  // Replace Canonical URL
  html = html.replace(/<link[^>]*rel="canonical"[^>]*>/i, `<link rel="canonical" href="${url}" />`)

  // Replace URL in OG
  html = html.replace(/<meta[^>]*property="og:url"[^>]*>/i, `<meta property="og:url" content="${url}"/>`)

  // Update JSON-LD structure
  const schemaRegex = /<script type="application\/ld\+json">[\s\S]*?<\/script>/
  const jsonLd = route.type === 'SoftwareApplication' ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "MCP Hangar",
    "url": url,
    "description": route.description,
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Any"
  } : {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "MCP Hangar",
    "url": url,
    "description": route.description
  }
  html = html.replace(schemaRegex, `<script type="application/ld+json">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`)

  // Inject noscript block before the root div
  const noscript = `
<noscript>
  <div style="padding: 2rem; font-family: sans-serif;">
    <h1>${route.title}</h1>
    <p>${route.description}</p>
    <p>${route.text}</p>
    <a href="/">Home</a>
    <a href="/plans">Pricing</a>
    <a href="/waitlist">Waitlist</a>
  </div>
</noscript>
<div class="prerender-content" style="display: none;" aria-hidden="true">
  <h1>${route.title}</h1>
  <p>${route.description}</p>
  <p>${route.text}</p>
</div>
`
  html = html.replace('<div id="root"></div>', `${noscript}\n<div id="root"></div>`)

  return html
}

function run() {
  if (!fs.existsSync(resolvedTemplate)) {
    console.error('Template file not found:', resolvedTemplate)
    process.exit(1)
  }

  const template = fs.readFileSync(resolvedTemplate, 'utf-8')

  for (const route of routes) {
    if (!fs.existsSync(route.dir)) {
      fs.mkdirSync(route.dir, { recursive: true })
    }
    const outPath = path.resolve(route.dir, 'index.html')
    const html = generateHtml(template, route)
    fs.writeFileSync(outPath, html, 'utf-8')
    console.log(`Generated ${outPath}`)
  }
}

run()
