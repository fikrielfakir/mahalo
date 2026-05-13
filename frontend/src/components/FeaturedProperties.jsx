import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import PropertyCard, { PropertyCardSkeleton } from './PropertyCard'
import { propertiesApi } from '../api/client'

export default function FeaturedProperties() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(false)

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
    <section className="py-28 px-5" style={{ background: 'linear-gradient(180deg, #F8F6F4 0%, #F2EDE8 100%)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="section-label mb-3">Curated Selection</p>
            <h2 className="section-title text-4xl mb-3">Featured Properties</h2>
            <p className="text-sm font-medium" style={{ color: 'rgba(115,13,38,0.45)' }}>Hand-picked premium listings just for you</p>
          </div>
          <Link to="/properties?is_featured=1" className="section-link hidden sm:flex shrink-0">
            View All <ArrowRight size={15} />
          </Link>
        </div>

        {!loading && properties.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'rgba(115,13,38,0.35)' }}>No featured properties available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              : properties.slice(0, 8).map((p) => <PropertyCard key={p.id} property={p} />)
            }
          </div>
        )}

        <div className="flex sm:hidden justify-center mt-10">
          <Link to="/properties?is_featured=1" className="btn-gold">
            View All Properties
          </Link>
        </div>
      </div>
    </section>
  )
}
