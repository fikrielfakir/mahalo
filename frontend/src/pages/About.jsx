import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, Users, Building2, Globe, Shield, TrendingUp, Heart, Star, ArrowRight, MapPin } from 'lucide-react'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import Footer from '../components/Footer'
import { propertiesApi, agentsApi, publicSettingsApi } from '../api/client'
import { useTranslation } from 'react-i18next'

const TEAM = [
  { name: 'Youssef Alami',      role: 'Founder & CEO',           city: 'Casablanca', initial: 'Y', color: '#730D26' },
  { name: 'Fatima Zahra',       role: 'Head of Operations',       city: 'Rabat',       initial: 'F', color: '#BA1932' },
  { name: 'Karim Benchekroun',  role: 'Chief Technology Officer', city: 'Casablanca', initial: 'K', color: '#1a3a5c' },
  { name: 'Nadia El Fassi',     role: 'Head of Agent Network',    city: 'Marrakech',   initial: 'N', color: '#8b6914' },
  { name: 'Omar Tazi',          role: 'Head of Sales',            city: 'Tangier',     initial: 'O', color: '#132d52' },
  { name: 'Salma Haddad',       role: 'Marketing Director',       city: 'Casablanca',  initial: 'S', color: '#a07a3c' },
]

function fmtCount(n, fallback) {
  if (n == null) return fallback
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K+`
  return `${n}+`
}

const DEFAULT_ABOUT = `Fondée à Casablanca, Mahalo a été créée sur une conviction simple : trouver votre propriété idéale devrait être excitant, pas stressant. Nous mettons en relation acheteurs, locataires et investisseurs avec les meilleurs biens immobiliers du Maroc.

Nous avons démarré parce que nous avons vécu de première main à quel point le marché immobilier marocain était fragmenté et opaque. Trouver une propriété nécessitait des dizaines d'appels, des visites d'annonces peu fiables, et une incertitude interminable sur les prix.

Aujourd'hui, nous avons construit une plateforme où chaque annonce est vérifiée, chaque agent est certifié, et chaque transaction est accompagnée par notre équipe — du premier contact jusqu'à la remise des clés.`

function renderAboutText(text) {
  return text.split('\n\n').filter(p => p.trim()).map((para, i) => (
    <p key={i} className="text-navy/60 leading-relaxed mb-5">{para.trim()}</p>
  ))
}

export default function About() {
  const { t } = useTranslation()
  const [propertiesCount, setPropertiesCount] = useState(null)
  const [agentsCount, setAgentsCount]         = useState(null)
  const [citiesCount, setCitiesCount]         = useState(null)
  const [aboutText, setAboutText]             = useState(DEFAULT_ABOUT)

  useEffect(() => {
    propertiesApi.list({ per_page: 1 })
      .then(r => { const t = r?.meta?.total ?? r?.total; if (t != null) setPropertiesCount(t) })
      .catch(() => {})

    agentsApi.list({ per_page: 1 })
      .then(r => { const t = r?.meta?.total ?? r?.total; if (t != null) setAgentsCount(t) })
      .catch(() => {})

    propertiesApi.filters()
      .then(r => { if (Array.isArray(r?.data?.cities)) setCitiesCount(r.data.cities.length) })
      .catch(() => {})

    publicSettingsApi.get()
      .then(r => { if (r?.data?.page_about) setAboutText(r.data.page_about) })
      .catch(() => {})
  }, [])

  const VALUES = [
    { icon: Shield,    title: t('about.value1Title'), desc: t('about.value1Desc') },
    { icon: Award,     title: t('about.value2Title'), desc: t('about.value2Desc') },
    { icon: TrendingUp,title: t('about.value3Title'), desc: t('about.value3Desc') },
    { icon: Heart,     title: t('about.value4Title'), desc: t('about.value4Desc') },
  ]

  const STATS = [
    { value: fmtCount(propertiesCount, '1K+'), label: t('about.propertiesListed'), icon: Building2 },
    { value: fmtCount(agentsCount, '50+'),     label: t('about.verifiedAgents'),   icon: Users },
    { value: '8K+',                            label: t('about.happyClients'),     icon: Heart },
    { value: citiesCount ? `${citiesCount}+` : '10+', label: t('about.citiesCovered'), icon: Globe },
  ]

  return (
    <div className="min-h-screen bg-surface">
      <SEOHead
        title="About Mahalo Real Estate"
        description="Mahalo Real Estate is Morocco's leading property marketplace. We connect buyers, sellers, renters and investors with verified listings and expert local agents."
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateAgent',
          'name': 'Mahalo Real Estate',
          'url': 'https://mahalo.ma',
          'description': 'Morocco\'s premier real estate marketplace connecting buyers, sellers and investors.',
          'areaServed': 'MA',
        }}
      />
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy/95 to-navy/80" />
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur text-gold text-xs font-semibold uppercase tracking-widest mb-6">
            <Star size={12} className="fill-gold" /> {t('about.ourStory')}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            {t('about.mostTrusted')}<br />
            <span className="text-gold">{t('about.realEstatePlatform')}</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            {t('about.heroSubtitle')}
          </p>
          <Link to="/properties" className="inline-flex items-center gap-2 btn-gold">
            {t('about.exploreProperties')} <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
                <Icon size={22} className="text-gold" />
              </div>
              <div className="text-4xl font-bold text-navy mb-1">{value}</div>
              <div className="text-navy/50 text-sm font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="section-label mb-3">{t('about.missionLabel')}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 leading-tight">
              {t('about.missionTitle')}
            </h2>
            <div className="mb-8">
              {renderAboutText(aboutText)}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/properties" className="btn-navy flex items-center gap-2">
                {t('about.browseProperties')} <ArrowRight size={15} />
              </Link>
              <Link to="/agents" className="btn-outline flex items-center gap-2">
                {t('about.meetAgents')}
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-card-hover">
              <img
                src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
                alt="Agenz office"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Award size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-navy font-bold text-sm">{t('about.since')}</div>
                  <div className="text-navy/40 text-xs">{t('about.trustedBy')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">{t('about.whyChoose')}</p>
            <h2 className="text-3xl font-bold text-navy">{t('about.coreValues')}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-3xl bg-surface hover:shadow-card transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-navy group-hover:bg-gold transition-colors duration-300 flex items-center justify-center mb-5">
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-navy font-bold mb-2">{title}</h3>
                <p className="text-navy/55 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="section-label mb-3">{t('about.theTeam')}</p>
            <h2 className="text-3xl font-bold text-navy">{t('about.meetPeople')}</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {TEAM.map(({ name, role, city, initial, color }) => (
              <div key={name} className="text-center group">
                <div
                  className="w-full aspect-square rounded-3xl flex items-center justify-center text-white font-bold text-3xl mb-4 group-hover:scale-105 transition-transform duration-300 shadow-card"
                  style={{ background: color }}
                >
                  {initial}
                </div>
                <div className="text-navy font-bold text-sm">{name}</div>
                <div className="text-navy/50 text-xs mt-0.5">{role}</div>
                <div className="flex items-center justify-center gap-1 text-navy/35 text-xs mt-1">
                  <MapPin size={10} /> {city}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-navy">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t('about.readyToFind')}</h2>
          <p className="text-white/60 mb-8">{t('about.browseVerified')}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/properties" className="btn-gold flex items-center gap-2">
              {t('about.browseProperties')} <ArrowRight size={15} />
            </Link>
            <Link to="/list-property" className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
              {t('about.listProperty')}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
