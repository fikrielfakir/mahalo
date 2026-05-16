import { Helmet } from 'react-helmet-async'

const SITE = 'Mahalo Real Estate'
const DEFAULT_DESC = "Discover premium properties across Morocco's most prestigious neighborhoods. Browse apartments, villas, and real estate projects in Casablanca, Marrakech, Rabat, Tanger, Agadir and more."

export default function SEOHead({
  title,
  description = DEFAULT_DESC,
  canonical,
  ogImage,
  ogType = 'website',
  robots,
  noIndex = false,
  jsonLd = null,
}) {
  const fullTitle = title ? `${title} | ${SITE}` : SITE
  const resolvedRobots = noIndex ? 'noindex,nofollow' : (robots || 'index,follow')

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={resolvedRobots} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE} />
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )
}
