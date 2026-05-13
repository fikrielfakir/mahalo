import { Link } from 'react-router-dom'
import { Award, Users, Building2, Globe, Shield, TrendingUp, Heart, Star, ArrowRight, MapPin } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const STATS = [
  { value: '15K+', label: 'Properties Listed', icon: Building2 },
  { value: '200+', label: 'Verified Agents', icon: Users },
  { value: '8K+', label: 'Happy Clients', icon: Heart },
  { value: '10+', label: 'Cities Covered', icon: Globe },
]

const VALUES = [
  {
    icon: Shield,
    title: 'Trust & Transparency',
    desc: 'Every listing is verified by our team. We show real prices, real photos, and real availability — no surprises at the door.',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    desc: 'We handpick properties that meet our standards for quality, location, and value. Only the best makes it onto Homzen.',
  },
  {
    icon: TrendingUp,
    title: 'Market Expertise',
    desc: 'Our agents live and breathe Moroccan real estate. From Casablanca to Marrakech, we know every neighborhood intimately.',
  },
  {
    icon: Heart,
    title: 'Client-First',
    desc: 'Your dream home is our mission. We listen, we guide, and we stay with you from the first search to the final signature.',
  },
]

const TEAM = [
  { name: 'Youssef Alami', role: 'Founder & CEO', city: 'Casablanca', initial: 'Y', color: '#0B1F3A' },
  { name: 'Fatima Zahra', role: 'Head of Operations', city: 'Rabat', initial: 'F', color: '#C8A97E' },
  { name: 'Karim Benchekroun', role: 'Chief Technology Officer', city: 'Casablanca', initial: 'K', color: '#1a3a5c' },
  { name: 'Nadia El Fassi', role: 'Head of Agent Network', city: 'Marrakech', initial: 'N', color: '#8b6914' },
  { name: 'Omar Tazi', role: 'Head of Sales', city: 'Tangier', initial: 'O', color: '#132d52' },
  { name: 'Salma Haddad', role: 'Marketing Director', city: 'Casablanca', initial: 'S', color: '#a07a3c' },
]

export default function About() {
  return (
    <div className="min-h-screen bg-surface">
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
            <Star size={12} className="fill-gold" /> Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Morocco's Most Trusted<br />
            <span className="text-gold">Real Estate Platform</span>
          </h1>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Founded in Casablanca, Homzen was built on a simple belief: finding your dream property should be exciting,
            not stressful. We connect buyers, renters, and investors with Morocco's finest real estate.
          </p>
          <Link to="/properties" className="inline-flex items-center gap-2 btn-gold">
            Explore Properties <ArrowRight size={16} />
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
            <p className="section-label mb-3">Our Mission</p>
            <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6 leading-tight">
              Making homeownership accessible to every Moroccan
            </h2>
            <p className="text-navy/60 leading-relaxed mb-5">
              We started Homzen because we experienced firsthand how fragmented and opaque the Moroccan
              real estate market was. Finding a property meant dozens of calls, visits to unreliable listings,
              and endless uncertainty about pricing.
            </p>
            <p className="text-navy/60 leading-relaxed mb-8">
              Today, we've built a platform where every listing is verified, every agent is certified, and
              every transaction is supported by our team from first inquiry to final handover.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/properties" className="btn-navy flex items-center gap-2">
                Browse Properties <ArrowRight size={15} />
              </Link>
              <Link to="/agents" className="btn-outline flex items-center gap-2">
                Meet Our Agents
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl overflow-hidden aspect-[4/3] shadow-card-hover">
              <img
                src="https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80"
                alt="Homzen office"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-card">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Award size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-navy font-bold text-sm">Since 2019</div>
                  <div className="text-navy/40 text-xs">Trusted by thousands</div>
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
            <p className="section-label mb-3">Why Choose Homzen</p>
            <h2 className="text-3xl font-bold text-navy">Built on four core values</h2>
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
            <p className="section-label mb-3">The Team</p>
            <h2 className="text-3xl font-bold text-navy">Meet the people behind Homzen</h2>
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
          <h2 className="text-3xl font-bold text-white mb-4">Ready to find your dream property?</h2>
          <p className="text-white/60 mb-8">Browse thousands of verified listings across Morocco's most sought-after locations.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/properties" className="btn-gold flex items-center gap-2">
              Browse Properties <ArrowRight size={15} />
            </Link>
            <Link to="/list-property" className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-white/20 text-white font-semibold text-sm hover:bg-white/10 transition-colors">
              List Your Property
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
