import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PropertyCard, { PropertyCardSkeleton } from './PropertyCard'
import { propertiesApi } from '../api/client'

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    propertiesApi.featured(8)
      .then((res) => {
        const data = res?.data
        setProperties(Array.isArray(data) ? data : [])
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (error) return null

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
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

      {!loading && properties.length === 0 ? (
        <div className="text-center py-16 text-navy/40">No featured properties available.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : properties.slice(0, 8).map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
        </div>
      )}

      <div className="flex sm:hidden justify-center mt-8">
        <Link to="/properties?is_featured=1" className="btn-gold">
          View All Properties
        </Link>
      </div>
    </section>
  )
}
