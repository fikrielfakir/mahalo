import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import FeaturedProperties from '../components/FeaturedProperties'
import NeighborhoodsSection from '../components/NeighborhoodsSection'
import NewProjects from '../components/NewProjects'
import MobileAppSection from '../components/MobileAppSection'
import AgentsSection from '../components/AgentsSection'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar transparent />
      <Hero />
      <FeaturedProperties />
      <NeighborhoodsSection />
      <NewProjects />
      <MobileAppSection />
      <AgentsSection />
      <Footer />
    </div>
  )
}
