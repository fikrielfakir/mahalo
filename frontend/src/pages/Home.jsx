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

export default function Home() {
  return (
    <div className="min-h-screen">
      <SEOHead
        title="Find Your Dream Home in Morocco"
        description="Morocco's premier real estate marketplace. Browse thousands of verified properties and projects in Casablanca, Marrakech, Rabat, Tanger, Agadir and beyond."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          'name': 'Mahalo Real Estate',
          'url': 'https://mahalo.ma',
          'potentialAction': {
            '@type': 'SearchAction',
            'target': 'https://mahalo.ma/properties?search={search_term_string}',
            'query-input': 'required name=search_term_string',
          },
        }}
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
