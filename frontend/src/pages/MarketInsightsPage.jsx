import { TrendingUp, BarChart2, MapPin, Home, ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const CITIES = [
  { name: 'Casablanca', trend: 'up',   change: '+4.2%', avg: '18 500 MAD/m²', desc: 'Marché dynamique porté par la demande locative.' },
  { name: 'Marrakech',  trend: 'up',   change: '+6.8%', avg: '14 200 MAD/m²', desc: 'Fort intérêt des acheteurs étrangers et nationaux.' },
  { name: 'Rabat',      trend: 'up',   change: '+3.1%', avg: '16 000 MAD/m²', desc: 'Stabilité et progression régulière du marché résidentiel.' },
  { name: 'Tanger',     trend: 'up',   change: '+8.4%', avg: '12 500 MAD/m²', desc: 'Croissance soutenue liée au développement économique.' },
  { name: 'Agadir',     trend: 'flat', change: '+1.2%', avg: '11 000 MAD/m²', desc: 'Marché stable avec une belle demande saisonnière.' },
  { name: 'Fès',        trend: 'down', change: '-0.8%', avg: '8 500 MAD/m²',  desc: 'Légère correction après une période de hausse.' },
]

const INSIGHTS = [
  { title: 'Demande en hausse', body: 'Le volume de transactions au Maroc a augmenté de 12 % au cours des 12 derniers mois, porté par une forte demande dans les grandes métropoles.', Icon: TrendingUp },
  { title: 'Location longue durée', body: 'La demande de location longue durée progresse de 18 % dans les villes universitaires et les centres d\'affaires, en particulier Casablanca et Rabat.', Icon: Home },
  { title: 'Projets neufs', body: 'Les projets résidentiels neufs séduisent de plus en plus d\'acheteurs : +22 % de transactions sur le segment des nouvelles constructions sur 12 mois.', Icon: BarChart2 },
]

function TrendIcon({ trend }) {
  if (trend === 'up')   return <ArrowUpRight   size={16} className="text-emerald-600" />
  if (trend === 'down') return <ArrowDownRight size={16} className="text-red-500" />
  return <Minus size={16} className="text-amber-500" />
}

function TrendBadge({ trend, change }) {
  const colors = {
    up:   'bg-emerald-50 text-emerald-700 border-emerald-100',
    down: 'bg-red-50 text-red-600 border-red-100',
    flat: 'bg-amber-50 text-amber-700 border-amber-100',
  }
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-bold border rounded-lg px-2 py-0.5 ${colors[trend]}`}>
      <TrendIcon trend={trend} /> {change}
    </span>
  )
}

export default function MarketInsightsPage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SEOHead
        title="Insights marché — Mahalo Immobilier"
        description="Découvrez les tendances du marché immobilier marocain : prix, demande et opportunités par ville."
      />
      <Navbar />

      <section className="pt-28 pb-14 px-6 bg-navy text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest mb-5">
          <TrendingUp size={12} /> Insights marché
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Tendances du marché immobilier</h1>
        <p className="text-white/50 text-sm max-w-md mx-auto">Données et analyses sur le marché immobilier marocain pour vous aider à prendre les meilleures décisions.</p>
      </section>

      <main className="flex-1 py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto space-y-10">

          {/* Key insights */}
          <div>
            <h2 className="text-lg font-bold text-navy mb-5">Tendances clés</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {INSIGHTS.map(({ title, body, Icon }) => (
                <div key={title} className="bg-white rounded-2xl shadow-card border border-gray-100 p-6">
                  <div className="w-10 h-10 rounded-xl bg-[#BA1932]/10 flex items-center justify-center mb-4">
                    <Icon size={18} className="text-[#BA1932]" />
                  </div>
                  <h3 className="font-bold text-navy text-sm mb-2">{title}</h3>
                  <p className="text-navy/55 text-xs leading-relaxed">{body}</p>
                </div>
              ))}
            </div>
          </div>

          {/* City prices */}
          <div>
            <h2 className="text-lg font-bold text-navy mb-5">Prix par ville</h2>
            <div className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
              <div className="grid grid-cols-4 text-xs font-semibold text-gray-400 uppercase tracking-wide px-6 py-3 border-b border-gray-100 bg-gray-50/50">
                <span className="col-span-1 flex items-center gap-1"><MapPin size={11} /> Ville</span>
                <span className="col-span-1 text-right">Tendance</span>
                <span className="col-span-1 text-right">Prix moyen</span>
                <span className="col-span-1 hidden sm:block text-right">Note</span>
              </div>
              {CITIES.map(({ name, trend, change, avg, desc }) => (
                <div key={name} className="grid grid-cols-4 items-center px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <span className="col-span-1 font-semibold text-navy text-sm">{name}</span>
                  <span className="col-span-1 text-right"><TrendBadge trend={trend} change={change} /></span>
                  <span className="col-span-1 text-right text-sm text-navy font-medium">{avg}</span>
                  <span className="col-span-1 hidden sm:block text-right text-xs text-navy/40">{desc}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-navy/30 mt-3 text-right">* Données indicatives — mises à jour périodiquement</p>
          </div>

          {/* CTA */}
          <div className="bg-navy rounded-3xl p-8 text-center">
            <h2 className="text-xl font-bold text-white mb-3">Prêt à investir ?</h2>
            <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">Parcourez nos annonces vérifiées et trouvez le bien qui correspond à votre projet.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/properties?type=sale"
                className="px-6 py-2.5 rounded-xl bg-[#BA1932] text-white font-semibold text-sm hover:bg-[#730D26] transition-colors">
                Voir les biens à vendre
              </Link>
              <Link to="/contact"
                className="px-6 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-sm hover:bg-white/20 transition-colors border border-white/20">
                Parler à un expert
              </Link>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
