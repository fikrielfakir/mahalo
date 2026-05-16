import { Helmet } from 'react-helmet-async'
import { useSiteSettings } from '../context/SiteSettingsContext'

const SITE = 'Mahalo Real Estate'
const SITE_URL = 'https://mahalo.ma'
const DEFAULT_DESC = "Discover premium properties across Morocco's most prestigious neighborhoods. Browse apartments, villas, and real estate projects in Casablanca, Marrakech, Rabat, Tanger, Agadir and more."

function buildBreadcrumbLd(breadcrumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      ...(crumb.url
        ? { item: crumb.url.startsWith('http') ? crumb.url : `${SITE_URL}${crumb.url}` }
        : {}),
    })),
  }
}

export default function SEOHead({
  title,
  description = DEFAULT_DESC,
  keywords,
  canonical,
  ogImage,
  ogType = 'website',
  robots,
  noIndex = false,
  jsonLd = null,
  breadcrumbs = null,
}) {
  const siteSettings = useSiteSettings()
  const resolvedKeywords = keywords || siteSettings.seo_keywords || null

  const fullTitle = title ? `${title} | ${SITE}` : SITE
  const resolvedRobots = noIndex ? 'noindex,nofollow' : (robots || 'index,follow')

  const breadcrumbLd = breadcrumbs?.length ? buildBreadcrumbLd(breadcrumbs) : null

  let combinedLd = null
  if (jsonLd && breadcrumbLd) {
    const { '@context': _c1, ...restMain } = jsonLd
    const { '@context': _c2, ...restCrumb } = breadcrumbLd
    combinedLd = { '@context': 'https://schema.org', '@graph': [restMain, restCrumb] }
  } else {
    combinedLd = jsonLd || breadcrumbLd
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {resolvedKeywords && <meta name="keywords" content={resolvedKeywords} />}
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

      {combinedLd && (
        <script type="application/ld+json">
          {JSON.stringify(combinedLd)}
        </script>
      )}
    </Helmet>
  )
}
