import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import FeaturedProperties from '../components/FeaturedProperties'
import RecentlyViewed from '../components/RecentlyViewed'
import NeighborhoodsSection from '../components/NeighborhoodsSection'
import NewProjects from '../components/NewProjects'
import MobileAppSection from '../components/MobileAppSection'
import AgentsSection from '../components/AgentsSection'
import Footer from '../components/Footer'
import { useSiteSettings } from '../context/SiteSettingsContext'

const SITE_URL = 'https://mahalo.ma'

const NAV_SECTIONS = [
  { name: 'Acheter un bien au Maroc',        url: '/properties?type=sale' },
  { name: 'Louer un bien au Maroc',           url: '/properties?type=rent' },
  { name: 'Nouveaux projets immobiliers',     url: '/projects' },
  { name: 'Quartiers au Maroc',               url: '/neighborhoods' },
  { name: 'Agents immobiliers',               url: '/agents' },
  { name: 'Casablanca Immobilier',            url: '/properties?city=casablanca' },
  { name: 'Marrakech Immobilier',             url: '/properties?city=marrakech' },
  { name: 'Rabat Immobilier',                 url: '/properties?city=rabat' },
]

export default function Home() {
  const settings = useSiteSettings()

  const facebookUrl  = settings.facebook_url  || null
  const instagramUrl = settings.instagram_url || null
  const twitterUrl   = settings.twitter_url   || null
  const youtubeUrl   = settings.youtube_url   || null

  const sameAs = [facebookUrl, instagramUrl, twitterUrl, youtubeUrl].filter(Boolean)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        'name': 'Mahalo Immobilier',
        'alternateName': 'Mahalo Real Estate',
        'url': SITE_URL,
        'logo': {
          '@type': 'ImageObject',
          '@id': `${SITE_URL}/#logo`,
          'url': `${SITE_URL}/logo.png`,
          'contentUrl': `${SITE_URL}/logo.png`,
          'width': 1059,
          'height': 407,
          'caption': 'Mahalo Immobilier',
        },
        'image': { '@id': `${SITE_URL}/#logo` },
        'description': settings.seo_description || "La principale plateforme immobilière du Maroc. Des milliers de propriétés et projets vérifiés à Casablanca, Marrakech, Rabat, Tanger, Agadir et partout au Maroc.",
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'MA',
          'addressLocality': 'Casablanca',
        },
        'contactPoint': {
          '@type': 'ContactPoint',
          'contactType': 'customer service',
          'email': settings.contact_email || 'contact@mahalo.ma',
          'availableLanguage': ['French', 'Arabic', 'English'],
        },
        ...(sameAs.length ? { 'sameAs': sameAs } : {}),
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        'url': SITE_URL,
        'name': 'Mahalo Immobilier',
        'alternateName': ['Mahalo Real Estate', 'Mahalo.ma'],
        'description': settings.seo_description || "La principale plateforme immobilière du Maroc.",
        'publisher': { '@id': `${SITE_URL}/#organization` },
        'inLanguage': ['fr-MA', 'ar-MA', 'en'],
        'potentialAction': {
          '@type': 'SearchAction',
          'target': {
            '@type': 'EntryPoint',
            'urlTemplate': `${SITE_URL}/properties?search={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        'url': SITE_URL,
        'name': 'Mahalo Immobilier — Trouvez Votre Bien au Maroc',
        'isPartOf': { '@id': `${SITE_URL}/#website` },
        'about': { '@id': `${SITE_URL}/#organization` },
        'description': "Découvrez des propriétés premium dans les quartiers les plus prestigieux du Maroc.",
        'inLanguage': 'fr-MA',
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Accueil', 'item': SITE_URL },
          ],
        },
      },
      ...NAV_SECTIONS.map((s, i) => ({
        '@type': 'SiteNavigationElement',
        'position': i + 1,
        'name': s.name,
        'url': `${SITE_URL}${s.url}`,
      })),
    ],
  }

  return (
    <div className="min-h-screen">
      <SEOHead
        title="Trouvez Votre Bien au Maroc"
        description="La principale plateforme immobilière du Maroc. Des milliers de propriétés vérifiées à Casablanca, Marrakech, Rabat, Tanger, Agadir et partout au Maroc."
        canonical={SITE_URL}
        ogImage={`${SITE_URL}/og-image.png`}
        jsonLd={jsonLd}
      />
      <Navbar transparent />
      <Hero />
      <FeaturedProperties />
      <RecentlyViewed />
      <NeighborhoodsSection />
      <NewProjects />
      <MobileAppSection />
      <AgentsSection />
      <Footer />
    </div>
  )
}
