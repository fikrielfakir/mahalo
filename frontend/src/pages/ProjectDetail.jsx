import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Heart, Share2, ArrowLeft, Building, Phone, Mail, Calendar } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { projectsApi } from '../api/client'

function formatPrice(price) {
  if (!price) return 'Price on request'
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K MAD`
  return `${num.toLocaleString()} MAD`
}

function imgUrl(path) {
  if (!path) return null
  return path.startsWith('http') ? path : `/storage/${path}`
}

const FALLBACK = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80'

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [activeImg, setActiveImg] = useState(0)

  useEffect(() => {
    projectsApi.bySlug(slug)
      .then((res) => setProject(res?.data || null))
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <Navbar />
        <div className="pt-24 px-6 max-w-7xl mx-auto animate-pulse">
          <div className="h-96 bg-gray-200 rounded-3xl mb-8" />
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 space-y-4">
              <div className="h-8 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/3" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 pt-24">
          <p className="text-navy/50 text-lg">Project not found</p>
          <Link to="/projects" className="btn-gold">Browse Projects</Link>
        </div>
        <Footer />
      </div>
    )
  }

  const images = Array.isArray(project.images) && project.images.length
    ? project.images
    : [project.image].filter(Boolean)

  const mainSrc = images[activeImg] ? imgUrl(images[activeImg]) : FALLBACK

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-20">

        {/* Back */}
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/projects" className="flex items-center gap-2 text-navy/50 hover:text-navy text-sm font-medium transition-colors">
            <ArrowLeft size={16} />
            Back to Projects
          </Link>
        </div>

        {/* Hero Image */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden">
            <img src={mainSrc || FALLBACK} alt={project.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = FALLBACK }} />
            <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={() => setLiked(!liked)}
                className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
              >
                <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-navy'} />
              </button>
              <button className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors">
                <Share2 size={18} className="text-navy" />
              </button>
            </div>
            {project.is_featured && (
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-gold text-navy text-xs font-bold rounded-xl uppercase">Featured</span>
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`shrink-0 w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-gold' : 'border-transparent'}`}
                >
                  <img src={imgUrl(img) || FALLBACK} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = FALLBACK }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Main info */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-gold/10 flex items-center justify-center">
                    <Building size={14} className="text-gold" />
                  </div>
                  <span className="text-navy/50 text-sm">{project.investor?.name || 'Developer'}</span>
                </div>
                <h1 className="text-3xl font-bold text-navy mb-2">{project.name}</h1>
                <div className="flex items-center gap-2 text-navy/50 text-sm mb-4">
                  <MapPin size={15} />
                  <span>{project.location || project.city?.name}</span>
                </div>
                <div className="text-3xl font-bold text-gold mb-6">From {formatPrice(project.price_from)}</div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-5 bg-white rounded-2xl shadow-card">
                  {project.city?.name && (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <MapPin size={20} className="text-gold" />
                      <span className="text-navy font-bold text-sm text-center">{project.city.name}</span>
                      <span className="text-navy/40 text-xs">City</span>
                    </div>
                  )}
                  {project.status && (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Calendar size={20} className="text-gold" />
                      <span className="text-navy font-bold text-sm capitalize">{project.status}</span>
                      <span className="text-navy/40 text-xs">Status</span>
                    </div>
                  )}
                  {project.units_count > 0 && (
                    <div className="flex flex-col items-center gap-2 py-2">
                      <Building size={20} className="text-gold" />
                      <span className="text-navy font-bold">{project.units_count}</span>
                      <span className="text-navy/40 text-xs">Units</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              {project.description && (
                <div>
                  <h2 className="text-navy font-bold text-xl mb-3">Overview</h2>
                  <p className="text-navy/60 leading-relaxed text-sm">{project.description}</p>
                </div>
              )}

              {/* Content */}
              {project.content && (
                <div>
                  <h2 className="text-navy font-bold text-xl mb-3">About This Project</h2>
                  <div className="text-navy/60 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: project.content }} />
                </div>
              )}

              {/* Facilities */}
              {project.facilities?.length > 0 && (
                <div>
                  <h2 className="text-navy font-bold text-xl mb-4">Facilities</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {project.facilities.map((f) => (
                      <div key={f.id} className="flex items-center gap-2 text-navy/70 text-sm">
                        <div className="w-5 h-5 rounded-lg bg-gold/10 flex items-center justify-center">
                          <Building size={11} className="text-gold" />
                        </div>
                        {f.name}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Sidebar */}
            <div className="space-y-5">
              <div className="bg-white rounded-3xl p-6 shadow-card sticky top-24">
                <h3 className="text-navy font-bold text-lg mb-5">Request Information</h3>
                {project.agent && (
                  <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
                    <div className="w-12 h-12 rounded-2xl bg-navy flex items-center justify-center text-white font-bold">
                      {project.agent.name?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <div className="font-semibold text-navy text-sm">{project.agent.name}</div>
                      <div className="text-navy/40 text-xs">Verified Agent</div>
                    </div>
                  </div>
                )}
                <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
                  <input type="text" placeholder="Your name" className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                  <input type="email" placeholder="Your email" className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                  <input type="tel" placeholder="Your phone" className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                  <textarea
                    placeholder="I'm interested in this project..."
                    rows={3}
                    className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                    defaultValue={`I'm interested in ${project.name}`}
                  />
                  <button type="submit" className="w-full btn-gold justify-center flex">
                    Send Message
                  </button>
                </form>

                {project.agent?.phone && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    <a href={`tel:${project.agent.phone}`} className="flex items-center gap-2 text-navy/60 hover:text-navy text-sm transition-colors">
                      <Phone size={14} /> {project.agent.phone}
                    </a>
                    {project.agent.email && (
                      <a href={`mailto:${project.agent.email}`} className="flex items-center gap-2 text-navy/60 hover:text-navy text-sm transition-colors">
                        <Mail size={14} /> {project.agent.email}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
