import { useState, useEffect } from 'react'
import { MapPin, Building, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { projectsApi } from '../api/client'

const MOCK_PROJECTS = [
  { id: 1, name: 'The View Anfa', description: 'Luxury living in Casablanca', price_from: 1450000, investor: { name: 'Horizon Group' }, city: { name: 'Casablanca' } },
  { id: 2, name: 'Résidences Mascotte', description: 'Premium Apartments — Hivernage, Marrakech', price_from: 980000, investor: { name: 'Addoha' }, city: { name: 'Marrakech' } },
  { id: 3, name: 'Noria Golf City', description: 'Villas by the Golf Course', price_from: 3900000, investor: { name: 'Noria' }, city: { name: 'Casablanca' } },
  { id: 4, name: 'Marina Living', description: 'Waterfront Apartments', price_from: 2100000, investor: { name: 'Emaar' }, city: { name: 'Rabat' } },
]

const PROJECT_IMAGES = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=700&q=80',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=700&q=80',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=700&q=80',
]

function formatPrice(price) {
  if (!price) return 'Price on request'
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  return `${(num / 1_000).toFixed(0)}K MAD`
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    projectsApi.list({ per_page: 12 })
      .then((res) => {
        const data = res?.data
        if (Array.isArray(data) && data.length > 0) setProjects(data)
        else setProjects(MOCK_PROJECTS)
      })
      .catch(() => setProjects(MOCK_PROJECTS))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Off-Plan & New</p>
          <h1 className="text-3xl font-bold text-navy">New Projects</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-3xl overflow-hidden bg-white shadow-card animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-5 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))
            : projects.map((project, i) => {
                const imgUrl = project.image
                  ? (project.image.startsWith('http') ? project.image : `/storage/${project.image}`)
                  : PROJECT_IMAGES[i % PROJECT_IMAGES.length]
                return (
                  <Link
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-video overflow-hidden relative">
                      <img src={imgUrl} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-lg bg-gold/10 flex items-center justify-center">
                          <Building size={12} className="text-gold" />
                        </div>
                        <span className="text-navy/50 text-xs">{project.investor?.name || 'Developer'}</span>
                      </div>
                      <h3 className="text-navy font-bold text-lg mb-1 group-hover:text-gold transition-colors duration-200">{project.name}</h3>
                      <p className="text-navy/50 text-sm mb-4 line-clamp-1">{project.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-navy/40 text-xs">From</span>
                          <div className="text-gold font-bold">{formatPrice(project.price_from)}</div>
                        </div>
                        <div className="flex items-center gap-1 text-navy/40 text-xs">
                          <MapPin size={12} />
                          {project.city?.name}
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })}
        </div>
      </div>
      <Footer />
    </div>
  )
}
