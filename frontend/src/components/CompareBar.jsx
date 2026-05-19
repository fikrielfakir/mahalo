import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { X, BarChart2, ArrowRight, MapPin, BadgeCheck, Star, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCompare } from '../context/CompareContext'
import { useTranslation } from 'react-i18next'

const FALLBACK = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&q=80'

function getImg(property) {
  const img = Array.isArray(property?.images) ? property.images[0] : property?.image
  if (img) return img.startsWith('http') ? img : `/storage/${img}`
  return FALLBACK
}

function fmt(price) {
  if (!price) return null
  const n = parseFloat(price)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M MAD`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(0)}K MAD`
  return `${n.toLocaleString()} MAD`
}

function getSlug(p) {
  return (typeof p.slug === 'string' ? p.slug : p.slug?.key) || p.id
}

export default function CompareBar() {
  const { t } = useTranslation()
  const { list, remove, clear, MAX } = useCompare()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (list.length > 0) {
      document.body.style.paddingBottom = '68px'
    } else {
      document.body.style.paddingBottom = ''
      setOpen(false)
    }
    return () => { document.body.style.paddingBottom = '' }
  }, [list.length])

  const ROWS = [
    {
      key: 'price',
      label: t('compare.rowPrice'),
      render: p => {
        const price = fmt(p.price)
        return price ? (
          <span className="font-bold text-gold text-base">{price}</span>
        ) : (
          <span className="text-gray-400 text-sm italic">{t('property.onRequest')}</span>
        )
      },
      highlight: true,
    },
    {
      key: 'type',
      label: t('compare.rowType'),
      render: p => (
        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
          p.type === 'rent'
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
        }`}>
          {p.type === 'rent' ? t('property.forRent') : t('property.forSale')}
        </span>
      ),
    },
    {
      key: 'city',
      label: t('compare.rowCity'),
      render: p => p.city?.name
        ? <span className="flex items-center justify-center gap-1"><MapPin size={12} className="text-gray-400" />{p.city.name}</span>
        : <span className="text-gray-300">—</span>,
    },
    {
      key: 'category',
      label: t('compare.rowCategory'),
      render: p => p.category?.name || <span className="text-gray-300">—</span>,
    },
    {
      key: 'beds',
      label: t('compare.rowBedrooms'),
      render: p => p.number_bedroom
        ? <span className="font-semibold text-navy">{p.number_bedroom}</span>
        : <span className="text-gray-300">—</span>,
    },
    {
      key: 'baths',
      label: t('compare.rowBathrooms'),
      render: p => p.number_bathroom
        ? <span className="font-semibold text-navy">{p.number_bathroom}</span>
        : <span className="text-gray-300">—</span>,
    },
    {
      key: 'area',
      label: t('compare.rowArea'),
      render: p => p.square
        ? <span className="font-semibold text-navy">{p.square} m²</span>
        : <span className="text-gray-300">—</span>,
    },
    {
      key: 'verified',
      label: t('compare.rowVerified'),
      render: p => p.is_verified
        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold"><BadgeCheck size={12} /> {t('compare.yes')}</span>
        : <span className="text-gray-400 text-sm">{t('compare.no')}</span>,
    },
    {
      key: 'featured',
      label: t('compare.rowFeatured'),
      render: p => p.is_featured
        ? <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-semibold"><Star size={12} /> {t('compare.yes')}</span>
        : <span className="text-gray-400 text-sm">{t('compare.no')}</span>,
    },
    {
      key: 'features',
      label: t('compare.rowFeatures'),
      render: p => {
        const feats = p.features?.map(f => f.name).filter(Boolean)
        return feats?.length
          ? <div className="flex flex-wrap justify-center gap-1">
              {feats.slice(0, 3).map(f => (
                <span key={f} className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{f}</span>
              ))}
              {feats.length > 3 && <span className="px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded text-xs">+{feats.length - 3}</span>}
            </div>
          : <span className="text-gray-300">—</span>
      },
    },
  ]

  if (list.length === 0) return null

  return createPortal(
    <>
      {/* Fixed floating bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-navy shadow-[0_-4px_24px_rgba(0,0,0,0.25)]">
        <div className="max-w-7xl mx-auto px-4 h-[68px] flex items-center gap-4">

          {/* Label */}
          <div className="flex items-center gap-2 text-white font-semibold text-sm shrink-0">
            <BarChart2 size={16} className="text-gold" />
            <span className="hidden sm:inline">{t('compare.compare')}</span>
            <span className="text-white/50 text-xs font-normal">({list.length}/{MAX})</span>
          </div>

          {/* Property chips */}
          <div className="flex items-center gap-2 flex-1 overflow-x-auto scrollbar-none min-w-0">
            {list.map(p => (
              <div key={p.id} className="flex items-center gap-2 bg-white/10 hover:bg-white/15 rounded-xl px-3 py-1.5 shrink-0 transition-colors">
                <img
                  src={getImg(p)}
                  alt={p.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-white/20"
                  onError={e => { e.target.src = FALLBACK }}
                />
                <span className="text-white text-xs font-medium max-w-[100px] truncate leading-tight">{p.name}</span>
                <button
                  onClick={() => remove(p.id)}
                  className="text-white/40 hover:text-white ml-0.5 transition-colors"
                  aria-label={t('compare.remove')}
                >
                  <X size={12} />
                </button>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: MAX - list.length }).map((_, i) => (
              <div key={i} className="flex items-center gap-1.5 border border-dashed border-white/15 rounded-xl px-3 py-1.5 shrink-0 text-white/25 text-xs">
                <Plus size={11} />
                <span className="hidden sm:inline">{t('compare.addMore')}</span>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={clear}
              className="hidden sm:block px-3 py-1.5 rounded-xl text-white/50 hover:text-white text-xs font-medium transition-colors"
            >
              {t('compare.clearAll')}
            </button>
            <button
              onClick={() => setOpen(true)}
              disabled={list.length < 2}
              className="flex items-center gap-1.5 px-4 py-2 bg-gold text-white rounded-xl text-sm font-semibold hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {t('compare.compare')} <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Compare modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-5xl max-h-[92vh] sm:max-h-[88vh] flex flex-col overflow-hidden">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center">
                  <BarChart2 size={16} className="text-gold" />
                </div>
                <div>
                  <h2 className="font-bold text-navy text-base leading-tight">{t('compare.propertyComparison')}</h2>
                  <p className="text-gray-400 text-xs">{list.length} {list.length === 1 ? t('compare.attribute') : t('compare.rowFeatures').toLowerCase()}</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-xl hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-auto flex-1">
              <table className="w-full border-collapse">
                <thead className="sticky top-0 z-10 bg-white shadow-sm">
                  <tr>
                    {/* Attribute label column */}
                    <th className="w-32 p-4 text-left">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('compare.attribute')}</span>
                    </th>

                    {/* Property columns */}
                    {list.map(p => (
                      <th key={p.id} className="p-4 min-w-[200px] border-l border-gray-100">
                        <div className="flex flex-col items-center gap-2">
                          {/* Image */}
                          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-sm">
                            <img
                              src={getImg(p)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              onError={e => { e.target.src = FALLBACK }}
                            />
                            {p.is_verified && (
                              <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center shadow">
                                <BadgeCheck size={12} className="text-white" />
                              </div>
                            )}
                          </div>
                          {/* Name */}
                          <Link
                            to={`/properties/${getSlug(p)}`}
                            className="font-bold text-navy text-sm hover:text-gold transition-colors text-center line-clamp-2 leading-snug w-full"
                            onClick={() => setOpen(false)}
                          >
                            {p.name}
                          </Link>
                          {/* City */}
                          {p.city?.name && (
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              <MapPin size={10} /> {p.city.name}
                            </div>
                          )}
                          {/* Remove */}
                          <button
                            onClick={() => remove(p.id)}
                            className="text-xs text-red-400 hover:text-red-600 transition-colors font-medium"
                          >
                            {t('compare.remove')}
                          </button>
                        </div>
                      </th>
                    ))}

                    {/* Empty placeholder columns */}
                    {Array.from({ length: MAX - list.length }).map((_, i) => (
                      <th key={i} className="p-4 min-w-[180px] border-l border-gray-100">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-full aspect-video rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50">
                            <div className="text-center">
                              <Plus size={20} className="text-gray-300 mx-auto mb-1" />
                              <span className="text-gray-300 text-xs">{t('compare.addProperty')}</span>
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {ROWS.map(({ key, label, render, highlight }) => (
                    <tr
                      key={key}
                      className={highlight ? 'bg-gold/5 border-y border-gold/10' : 'border-b border-gray-50 hover:bg-gray-50/50 transition-colors'}
                    >
                      <td className="px-4 py-3 sticky left-0 bg-inherit">
                        <span className={`text-xs font-semibold uppercase tracking-wide ${highlight ? 'text-gold' : 'text-gray-400'}`}>
                          {label}
                        </span>
                      </td>
                      {list.map(p => (
                        <td key={p.id} className="px-4 py-3 text-sm text-navy text-center border-l border-gray-100 bg-inherit">
                          {render(p)}
                        </td>
                      ))}
                      {Array.from({ length: MAX - list.length }).map((_, i) => (
                        <td key={i} className="px-4 py-3 text-center border-l border-gray-100 text-gray-200 bg-inherit">—</td>
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
