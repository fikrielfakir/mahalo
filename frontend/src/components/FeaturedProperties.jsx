import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PropertyCard, { PropertyCardSkeleton } from './PropertyCard'
import { propertiesApi } from '../api/client'

const MOCK_PROPERTIES = [
  { id: 1, name: 'Villa with Pool — Ain Diab', price: 3800000, number_bedroom: 4, number_bathroom: 3, square: 320, is_featured: true, city: { name: 'Casablanca' } },
  { id: 2, name: 'Modern Apartment — Maarif', price: 2450000, number_bedroom: 3, number_bathroom: 2, square: 150, is_new: true, city: { name: 'Casablanca' } },
  { id: 3, name: 'Luxury Villa — Hivernage', price: 5600000, number_bedroom: 5, number_bathroom: 4, square: 450, is_verified: true, city: { name: 'Marrakech' } },
  { id: 4, name: 'Contemporary Apartment', price: 1950000, number_bedroom: 2, number_bathroom: 2, square: 120, city: { name: 'Casablanca' } },
  { id: 5, name: 'Penthouse — Hassan II', price: 4200000, number_bedroom: 4, number_bathroom: 3, square: 280, is_featured: true, city: { name: 'Casablanca' } },
  { id: 6, name: 'Riad — Médina', price: 3100000, number_bedroom: 5, number_bathroom: 4, square: 380, is_verified: true, city: { name: 'Marrakech' } },
  { id: 7, name: 'Sea View Apartment', price: 2800000, number_bedroom: 3, number_bathroom: 2, square: 170, city: { name: 'Tanger' } },
  { id: 8, name: 'Modern Villa — Souissi', price: 6500000, number_bedroom: 6, number_bathroom: 5, square: 520, is_featured: true, city: { name: 'Rabat' } },
]

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    propertiesApi.featured(8)
      .then((res) => {
        const data = res?.data
        if (Array.isArray(data) && data.length > 0) {
          setProperties(data)
        } else {
          setProperties(MOCK_PROPERTIES)
        }
      })
      .catch(() => setProperties(MOCK_PROPERTIES))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Curated Selection</p>
          <h2 className="section-title text-3xl">Featured Properties</h2>
        </div>
        <Link to="/properties?is_featured=1" className="section-link hidden sm:flex">
          View All Properties
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)
          : properties.slice(0, 8).map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
      </div>

      {/* Mobile link */}
      <div className="flex sm:hidden justify-center mt-8">
        <Link to="/properties?is_featured=1" className="btn-gold">
          View All Properties
        </Link>
      </div>
    </section>
  )
}
