import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import Hero from '../components/Hero'
import FeaturedProperties from '../components/FeaturedProperties'
import RecentlyViewed from '../components/RecentlyViewed'
import NeighborhoodsSection from '../components/NeighborhoodsSection'
import NewProjects from '../components/NewProjects'
import HomepageMapSection from '../components/HomepageMapSection'
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
  { name: 'Marrakech Immobilier',             url: '/properties?city=marrakech' },
  { name: 'Rabat Immobilier',                 url: '/properties?city=rabat' },
]

export default function Home() {
  const { t } = useTranslation()
  const settings = useSiteSettings()

  const pageTitle       = t('home.pageTitle')
  const pageDescription = settings.seo_description || t('home.pageDescription')

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
        'alternateName': 'Mahalo',
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
        'description': pageDescription,
        'address': {
          '@type': 'PostalAddress',
          'addressCountry': 'MA',
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
        'alternateName': ['Mahalo', 'Mahalo.ma'],
        'description': pageDescription,
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
        'name': `Mahalo Immobilier — ${pageTitle}`,
        'isPartOf': { '@id': `${SITE_URL}/#website` },
        'about': { '@id': `${SITE_URL}/#organization` },
        'description': pageDescription,
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
        title={pageTitle}
        description={pageDescription}
        canonical={SITE_URL}
        jsonLd={jsonLd}
      />
      <Navbar transparent />
      <Hero />
      <FeaturedProperties />
      <RecentlyViewed />
      <NeighborhoodsSection />
      <NewProjects />
      <HomepageMapSection />
      <MobileAppSection />
      <AgentsSection />
      <Footer />
    </div>
  )
}
