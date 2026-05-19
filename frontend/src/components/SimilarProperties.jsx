import { useEffect, useState } from 'react'
import { ArrowRight, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { propertiesApi } from '../api/client'
import PropertyCard, { PropertyCardSkeleton } from './PropertyCard'

function PriceBadge({ current, candidate, t }) {
  if (!current || !candidate || current === 0) return null
  const diff = ((candidate - current) / current) * 100

  if (Math.abs(diff) < 3) {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
        <Minus size={11} /> {t('similar.samePrice', 'Prix similaire')}
      </span>
    )
  }
  if (diff > 0) {
    return (
      <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-red-50 text-red-500">
        <TrendingUp size={11} /> +{Math.round(diff)}%
      </span>
    )
  }
  return (
    <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">
      <TrendingDown size={11} /> {Math.round(diff)}%
    </span>
  )
}

export default function SimilarProperties({ property }) {
  const { t } = useTranslation()
  const [items, setItems]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!property?.id) return
    setLoading(true)
    propertiesApi.similar(property.id)
      .then(r => {
        const all = Array.isArray(r?.data) ? r.data : []
        setItems(all.filter(p => p.id !== property.id).slice(0, 4))
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [property?.id])

  if (!loading && items.length === 0) return null

  return (
    <section className="pt-10 border-t border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy">
            {t('sections.similarProperties', 'Biens similaires')}
          </h2>
          <p className="text-navy/40 text-sm mt-0.5">
            {t('sections.youMightLike', 'Propriétés comparables dans la même zone')}
          </p>
        </div>
        <Link
          to="/properties"
          className="flex items-center gap-1.5 text-sm font-semibold text-gold hover:text-navy transition-colors"
        >
          {t('sections.viewAll', 'Voir tout')} <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)
          : items.map(p => (
            <div key={p.id} className="flex flex-col gap-2">
              <PropertyCard property={p} />
              <div className="flex flex-wrap items-center gap-1.5 px-1">
                <PriceBadge current={property.price} candidate={p.price} t={t} />
                {p.number_bedroom != null && property.number_bedroom != null &&
                  p.number_bedroom !== property.number_bedroom && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-500 font-medium">
                    {p.number_bedroom > property.number_bedroom ? '+' : ''}{p.number_bedroom - property.number_bedroom} {t('similar.beds', 'ch.')}
                  </span>
                )}
                {p.square != null && property.square != null &&
                  p.square > 0 && property.square > 0 &&
                  Math.abs(p.square - property.square) > property.square * 0.05 && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-500 font-medium">
                    {p.square > property.square ? '+' : ''}{Math.round(((p.square - property.square) / property.square) * 100)}% m²
                  </span>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </section>
  )
}
