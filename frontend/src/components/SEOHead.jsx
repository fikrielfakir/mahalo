import { Helmet } from 'react-helmet-async'
import { useSiteSettings } from '../context/SiteSettingsContext'

export const SITE     = 'Mahalo Real Estate'
export const SITE_URL = 'https://mahalo.ma'

const DEFAULT_DESC = "Discover premium properties across Morocco's most prestigious neighborhoods. Browse apartments, villas, and real estate projects in Casablanca, Marrakech, Rabat, Tanger, Agadir and more."

const HREFLANG_LOCALES = ['en', 'fr', 'es', 'ar']

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
  alternateLocales = false,
  hreflangs = null,
}) {
  const siteSettings     = useSiteSettings()
  const resolvedKeywords = keywords || siteSettings.seo_keywords || null
  const verificationCode = siteSettings.google_site_verification || null

  const fullTitle     = title ? `${title} | ${SITE}` : (siteSettings.seo_title || SITE)
  const resolvedDesc  = description === DEFAULT_DESC
    ? (siteSettings.seo_description || description)
    : description
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

  const resolvedHreflangs = hreflangs
    || (alternateLocales && canonical
        ? [
            ...HREFLANG_LOCALES.map(l => ({ hreflang: l, href: canonical })),
            { hreflang: 'x-default', href: canonical },
          ]
        : null)

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={resolvedDesc} />
      {resolvedKeywords && <meta name="keywords" content={resolvedKeywords} />}
      <meta name="robots" content={resolvedRobots} />
      {verificationCode && <meta name="google-site-verification" content={verificationCode} />}
      {canonical && <link rel="canonical" href={canonical} />}
      {resolvedHreflangs?.map(({ hreflang, href }) => (
        <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
      ))}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={resolvedDesc} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE} />
      {canonical && <meta property="og:url" content={canonical} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogImage && <meta property="og:image:width" content="1200" />}
      {ogImage && <meta property="og:image:height" content="630" />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={resolvedDesc} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {combinedLd && (
        <script type="application/ld+json">
          {JSON.stringify(combinedLd)}
        </script>
      )}
    </Helmet>
  )
}
