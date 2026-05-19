import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, BarChart2, ArrowRight, Bed, Bath, Maximize2, MapPin, Star, BadgeCheck } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useTranslation } from 'react-i18next'

const FALLBACK = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300&q=80'

function getImg(property) {
  const img = Array.isArray(property?.images) ? property.images[0] : property?.image
  if (img) return img.startsWith('http') ? img : `/storage/${img}`
  return FALLBACK
}

function fmt(price) {
  if (!price) return 'On request'
  const n = parseFloat(price)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M MAD`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K MAD`
  return `${n.toLocaleString()} MAD`
}


export default function CompareBar() {
  const { t } = useTranslation()
  const { list, remove, clear, MAX } = useCompare()
  const [open, setOpen] = useState(false)

  const ROWS = [
    { label: t('compare.rowPrice'),    render: p => fmt(p.price) },
    { label: t('compare.rowType'),     render: p => p.type === 'rent' ? t('property.forRent') : t('property.forSale') },
    { label: t('compare.rowCity'),     render: p => p.city?.name || '—' },
    { label: t('compare.rowCategory'), render: p => p.category?.name || '—' },
    { label: t('property.beds'),       render: p => p.number_bedroom || '—' },
    { label: t('property.baths'),      render: p => p.number_bathroom || '—' },
    { label: t('compare.rowArea'),     render: p => p.square ? `${p.square} m²` : '—' },
    { label: t('compare.rowVerified'), render: p => p.is_verified ? t('compare.yes') : t('compare.no') },
    { label: t('compare.rowFeatured'), render: p => p.is_featured ? t('compare.yes') : t('compare.no') },
    { label: t('compare.rowFeatures'), render: p => p.features?.map(f => f.name).join(', ') || '—' },
  ]

  useEffect(() => {
    const BAR_HEIGHT = '64px'
    if (list.length > 0) {
      document.body.style.paddingBottom = BAR_HEIGHT
    } else {
      document.body.style.paddingBottom = ''
    }
    return () => { document.body.style.paddingBottom = '' }
  }, [list.length])

  if (list.length === 0) return null

  return createPortal(
    <>
      {/* Floating bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-navy border-t border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 text-white font-semibold text-sm shrink-0">
            <BarChart2 size={16} className="text-gold" />
            {t('compare.compare')} ({list.length}/{MAX})
          </div>

          <div className="flex items-center gap-3 flex-1 overflow-x-auto">
            {list.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 shrink-0">
                <img src={getImg(p)} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                <span className="text-white text-xs font-medium max-w-[120px] truncate">{p.name}</span>
                <button onClick={() => remove(p.id)} className="text-white/40 hover:text-white ml-1">
                  <X size={13} />
                </button>
              </div>
            ))}
            {Array.from({ length: MAX - list.length }).map((_, i) => (
              <div key={i} className="w-32 h-10 border border-dashed border-white/20 rounded-xl flex items-center justify-center text-white/25 text-xs shrink-0">
                {t('compare.addMore')}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clear}
              className="px-3 py-2 rounded-xl text-white/50 hover:text-white text-xs font-medium transition-colors"
            >
              {t('compare.clearAll')}
            </button>
            <button
              onClick={() => setOpen(true)}
              disabled={list.length < 2}
              className="flex items-center gap-1.5 px-4 py-2 bg-gold text-white rounded-xl text-sm font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('compare.compare')} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Compare modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <BarChart2 size={18} className="text-gold" />
                <h2 className="font-bold text-navy text-lg">{t('compare.propertyComparison')}</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={18} />
              </button>
            </div>

            <div className="overflow-auto flex-1">
              <table className="w-full">
                {/* Property headers */}
                <thead>
                  <tr>
                    <th className="w-36 p-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide sticky left-0 bg-white">{t('compare.attribute')}</th>
                    {list.map(p => (
                      <th key={p.id} className="p-4 min-w-[220px]">
                        <div className="text-center">
                          <div className="aspect-video rounded-2xl overflow-hidden mb-3">
                            <img src={getImg(p)} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                          <Link
                            to={`/properties/${(typeof p.slug === 'string' ? p.slug : p.slug?.key) || p.id}`}
                            className="font-bold text-navy text-sm hover:text-gold transition-colors line-clamp-1 block"
                            onClick={() => setOpen(false)}
                          >
                            {p.name}
                          </Link>
                          {p.city?.name && (
                            <div className="flex items-center justify-center gap-1 text-navy/40 text-xs mt-1">
                              <MapPin size={10} /> {p.city.name}
                            </div>
                          )}
                          <button onClick={() => remove(p.id)} className="mt-2 text-xs text-red-400 hover:text-red-600 transition-colors">
                            {t('compare.remove')}
                          </button>
                        </div>
                      </th>
                    ))}
                    {/* Empty columns if less than MAX */}
                    {Array.from({ length: MAX - list.length }).map((_, i) => (
                      <th key={i} className="p-4 min-w-[180px]">
                        <div className="aspect-video rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center mb-3">
                          <span className="text-gray-300 text-xs">{t('compare.addProperty')}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                {/* Comparison rows */}
                <tbody>
                  {ROWS.map(({ label, render }, idx) => (
                    <tr key={label} className={idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                      <td className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide sticky left-0 bg-inherit">{label}</td>
                      {list.map(p => (
                        <td key={p.id} className="px-4 py-3 text-sm text-navy text-center font-medium">
                          {render(p)}
                        </td>
                      ))}
                      {Array.from({ length: MAX - list.length }).map((_, i) => (
                        <td key={i} className="px-4 py-3 text-center text-gray-200">—</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  )
}
