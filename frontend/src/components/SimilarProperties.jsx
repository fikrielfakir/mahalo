import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { propertiesApi } from '../api/client'
import PropertyCard, { PropertyCardSkeleton } from './PropertyCard'

export default function SimilarProperties({ property }) {
  const { t } = useTranslation()
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!property) return
    const params = {
      per_page: 5,
      ...(property.city_id       && { city_id: property.city_id }),
      ...(property.category_id   && { category_id: property.category_id }),
    }
    propertiesApi.list(params)
      .then(r => {
        const all = Array.isArray(r?.data) ? r.data : []
        setItems(all.filter(p => p.id !== property.id).slice(0, 4))
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [property])

  if (!loading && items.length === 0) return null

  return (
    <section className="pt-10 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy">{t('sections.similarProperties')}</h2>
          <p className="text-navy/40 text-sm mt-0.5">{t('sections.youMightLike')}</p>
        </div>
        <Link
          to="/properties"
          className="flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-navy transition-colors"
        >
          {t('sections.viewAll')} <ArrowRight size={14} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)
          : items.map(p => <PropertyCard key={p.id} property={p} />)
        }
      </div>
    </section>
  )
}
