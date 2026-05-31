import { useState, useEffect } from 'react'
import { TrendingUp, BarChart2, MapPin, Home, Loader2, AlertCircle, Building2, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import { marketInsightsApi } from '../api/client'

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#BA1932]/10 flex items-center justify-center shrink-0">
        <Icon size={20} className="text-[#BA1932]" />
      </div>
      <div>
        <p className="text-xs text-navy/40 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-xl font-bold text-navy mt-0.5">{value}</p>
      </div>
    </div>
  )
}

function formatPrice(n) {
  if (!n) return '—'
  return new Intl.NumberFormat('fr-MA').format(n) + ' MAD'
}

export default function MarketInsightsPage() {
  const { t } = useTranslation()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    marketInsightsApi.get()
      .then(res => setData(res.data ?? null))
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const cities = data?.cities ?? []

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SEOHead
        title={t('marketInsights.seoTitle')}
        description={t('marketInsights.seoDesc')}
      />
      <Navbar />

      <section className="pt-28 pb-14 px-6 bg-navy text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest mb-5">
          <TrendingUp size={12} /> {t('marketInsights.badge')}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">{t('marketInsights.heroTitle')}</h1>
        <p className="text-white/50 text-sm max-w-md mx-auto">{t('marketInsights.heroDesc')}</p>
      </section>

      <main className="flex-1 py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-10">

          {loading && (
            <div className="flex items-center justify-center gap-3 py-24 text-navy/40">
              <Loader2 size={22} className="animate-spin" />
              <span className="text-sm">{t('marketInsights.loading')}</span>
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-3 py-24 text-navy/40">
              <AlertCircle size={36} className="opacity-40" />
              <p className="text-sm font-medium">{t('marketInsights.loadError')}</p>
            </div>
          )}

          {!loading && !error && !data && (
            <div className="flex flex-col items-center gap-3 py-24 text-navy/40">
              <BarChart2 size={40} className="opacity-30" />
              <p className="text-sm font-medium">{t('marketInsights.noData')}</p>
            </div>
          )}

          {!loading && !error && data && (
            <>
              {/* Global stats */}
              <div className="grid sm:grid-cols-3 gap-5">
                <StatCard icon={Home}      label={t('marketInsights.statActiveListings')} value={data.total_properties.toLocaleString()} />
                <StatCard icon={Building2} label={t('marketInsights.statAvgPrice')}       value={formatPrice(data.global_avg_price)} />
                <StatCard icon={Users}     label={t('marketInsights.statAgents')}          value={data.total_agents.toLocaleString()} />
              </div>

              {/* City table */}
              {cities.length > 0 ? (
                <div>
                  <h2 className="text-lg font-bold text-navy mb-5">{t('marketInsights.cityTableTitle')}</h2>
                  <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
                    <div className="grid grid-cols-5 text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                      <span className="col-span-1 flex items-center gap-1"><MapPin size={11} /> {t('marketInsights.colCity')}</span>
                      <span className="col-span-1 text-right">{t('marketInsights.colListings')}</span>
                      <span className="col-span-1 text-right">{t('marketInsights.colAvgPrice')}</span>
                      <span className="col-span-1 text-right hidden sm:block">{t('marketInsights.colForSale')}</span>
                      <span className="col-span-1 text-right hidden sm:block">{t('marketInsights.colForRent')}</span>
                    </div>
                    {cities.map(row => (
                      <div key={row.city_id} className="grid grid-cols-5 items-center px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                        <span className="col-span-1 font-semibold text-navy text-sm">{row.city_name}</span>
                        <span className="col-span-1 text-right text-sm text-navy/60">{row.total_listings}</span>
                        <span className="col-span-1 text-right text-sm text-navy font-medium">{formatPrice(row.avg_price)}</span>
                        <span className="col-span-1 text-right text-xs text-emerald-600 hidden sm:block font-medium">{row.for_sale}</span>
                        <span className="col-span-1 text-right text-xs text-blue-600 hidden sm:block font-medium">{row.for_rent}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-navy/30 mt-3 text-right">{t('marketInsights.realtimeNote')}</p>
                </div>
              ) : (
                <div className="text-center py-12 text-navy/40">
                  <MapPin size={36} className="mx-auto mb-3 opacity-30" />
                  <p className="text-sm">{t('marketInsights.noCityData')}</p>
                </div>
              )}

              {/* CTA */}
              <div className="bg-navy rounded-3xl p-8 text-center">
                <h2 className="text-xl font-bold text-white mb-3">{t('marketInsights.ctaTitle')}</h2>
                <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">{t('marketInsights.ctaDesc')}</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link to="/properties?type=sale"
                    className="px-6 py-2.5 rounded-xl bg-[#BA1932] text-white font-semibold text-sm hover:bg-[#730D26] transition-colors">
                    {t('marketInsights.ctaBtnSale')}
                  </Link>
                  <Link to="/contact"
                    className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors border border-white/20">
                    {t('marketInsights.ctaBtnContact')}
                  </Link>
                </div>
              </div>
            </>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
