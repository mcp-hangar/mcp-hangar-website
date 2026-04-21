import { Helmet } from 'react-helmet-async'

interface SEOProps {
  title: string
  description: string
  path: string
  type?: string
  keywords?: string[]
}

const SITE_NAME = 'MCP Hangar'
const SITE_URL = 'https://mcp-hangar.io'
// Placeholder for future og:image
// const OG_IMAGE = `${SITE_URL}/og-image.png`

export function SEO({
  title,
  description,
  path,
  type = 'website',
  keywords = []
}: SEOProps) {
  const url = `${SITE_URL}${path}`
  
  // Decide JSON-LD type based on path
  const isLanding = path === '/' || path === ''
  const schemaOrgJSONLD = isLanding
    ? {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        name: SITE_NAME,
        url: url,
        description: description,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any'
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: SITE_NAME,
        url: url,
        description: description
      }

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(schemaOrgJSONLD)}
      </script>
    </Helmet>
  )
}
