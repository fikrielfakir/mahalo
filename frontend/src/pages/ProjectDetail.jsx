import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { MapPin, Heart, Share2, ArrowLeft, Building, Phone, Mail, Calendar, Loader2, Video, Play } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toast, useToast } from '../components/Toast'
import { projectsApi, consultsApi } from '../api/client'
import { isVideoPath, mediaUrl as imgUrl } from '../utils/media'
import SEOHead from '../components/SEOHead'

function formatPrice(price) {
  if (!price) return 'Price on request'
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K MAD`
  return `${num.toLocaleString()} MAD`
}

const FALLBACK = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80'
const EMPTY_FORM = { name: '', email: '', phone: '', message: '' }

export default function ProjectDetail() {
  const { slug } = useParams()
  const [project, setProject]   = useState(null)
  const [loading, setLoading]   = useState(true)
  const [liked, setLiked]       = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const [playingVideo, setPlayingVideo] = useState(false)

  const [form, setForm]         = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const { toast, show: showToast, hide: hideToast } = useToast()

  useEffect(() => {
    projectsApi.bySlug(slug)
      .then((res) => setProject(res?.data || null))
      .catch(() => setProject(null))
      .finally(() => setLoading(false))
  }, [slug])

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      showToast('Link copied to clipboard!')
    } catch {
      showToast('Could not copy link', 'error')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      showToast('Please fill in your name and phone', 'error')
      return
    }
    setSubmitting(true)
    try {
      await consultsApi.store({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message || `I'm interested in ${project?.name}`,
        project_id: project?.id,
      })
      showToast('Request sent! An agent will contact you shortly.')
      setForm(EMPTY_FORM)
    } catch {
      showToast('Failed to send message. Please try again.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface">
        <SEOHead
          title="Real Estate Project in Morocco"
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'New Projects', url: '/projects' },
            { name: 'Project Details', url: '' },
          ]}
        />
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
      <SEOHead
        title={project.name}
        description={`${project.name}${project.city ? ` in ${project.city.name}` : ''}, Morocco. ${project.description?.slice(0, 200) || 'Discover this premium real estate project with modern amenities and prime location.'}`.trim()}
        ogImage={project.image ? (project.image.startsWith('http') ? project.image : `/storage/${project.image}`) : undefined}
        ogType="article"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'RealEstateListing',
          'name': project.name,
          'description': project.description?.slice(0, 500),
          'url': `https://mahalo.ma/projects/${project.slug?.key ?? project.id}`,
          ...(project.price_from ? { offers: { '@type': 'Offer', price: project.price_from, priceCurrency: 'MAD' } } : {}),
        }}
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'New Projects', url: '/projects' },
          { name: project.name, url: `/projects/${project.slug?.key ?? project.id}` },
        ]}
      />
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link to="/projects" className="flex items-center gap-2 text-navy/50 hover:text-navy text-sm font-medium transition-colors">
            <ArrowLeft size={16} /> Back to Projects
          </Link>
        </div>

        {/* Hero Image / Video */}
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden bg-gray-900">
            {isVideoPath(images[activeImg]) ? (
              playingVideo ? (
                <video
                  key={mainSrc}
                  src={mainSrc}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              ) : (
                <div
                  className="relative w-full h-full cursor-pointer group"
                  onClick={() => setPlayingVideo(true)}
                >
                  <video
                    src={mainSrc}
                    poster={project.thumbnail_url || ''}
                    preload="none"
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/45 transition-colors flex flex-col items-center justify-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-white/15 border-2 border-white/50 flex items-center justify-center group-hover:bg-white/25 group-hover:border-white/80 transition-all duration-200 shadow-lg">
                      <Play size={34} className="text-white fill-white ml-1" />
                    </div>
                    <span className="text-white/80 text-sm font-semibold tracking-wide drop-shadow">Tap to play video</span>
                  </div>
                </div>
              )
            ) : (
              <img src={mainSrc || FALLBACK} alt={project.name} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = FALLBACK }} />
            )}
            {!playingVideo && (
              <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent pointer-events-none" />
            )}
            {/* Watermark — shown when video is playing */}
            {isVideoPath(images[activeImg]) && playingVideo && (
              <div className="absolute bottom-14 right-4 pointer-events-none select-none">
                <span className="text-white/30 font-bold text-base tracking-widest uppercase" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>MAHALO</span>
              </div>
            )}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button
                onClick={() => setLiked(l => !l)}
                className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
              >
                <Heart size={18} className={liked ? 'fill-red-500 text-red-500' : 'text-navy'} />
              </button>
              <button
                onClick={handleShare}
                className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur flex items-center justify-center hover:bg-white transition-colors"
                title="Copy link"
              >
                <Share2 size={18} className="text-navy" />
              </button>
            </div>
            {project.is_featured && (
              <div className="absolute top-4 left-4 z-10">
                <span className="px-3 py-1 bg-gold text-navy text-xs font-bold rounded-xl uppercase">Featured</span>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => { setActiveImg(i); setPlayingVideo(false); }}
                  className={`relative shrink-0 w-20 h-16 rounded-2xl overflow-hidden border-2 transition-all ${i === activeImg ? 'border-gold' : 'border-transparent'}`}
                >
                  {isVideoPath(img) ? (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <div className="w-7 h-7 rounded-full bg-white/20 border border-white/40 flex items-center justify-center">
                        <Play size={10} className="text-white fill-white ml-0.5" />
                      </div>
                    </div>
                  ) : (
                    <img src={imgUrl(img) || FALLBACK} alt="" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = FALLBACK }} />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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

              {project.description && (
                <div>
                  <h2 className="text-navy font-bold text-xl mb-3">Overview</h2>
                  <p className="text-navy/60 leading-relaxed text-sm">{project.description}</p>
                </div>
              )}

              {project.content && (
                <div>
                  <h2 className="text-navy font-bold text-xl mb-3">About This Project</h2>
                  <div className="text-navy/60 leading-relaxed text-sm" dangerouslySetInnerHTML={{ __html: project.content }} />
                </div>
              )}

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
            <div>
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
                <form className="space-y-3" onSubmit={handleSubmit}>
                  <input
                    type="text" placeholder="Your name *"
                    value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                    required
                  />
                  <input
                    type="email" placeholder="Your email"
                    value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                  />
                  <input
                    type="tel" placeholder="Your phone *"
                    value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                    required
                  />
                  <textarea
                    placeholder="Your message..."
                    rows={3}
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full bg-surface rounded-xl px-4 py-3 text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                  />
                  <button type="submit" disabled={submitting} className="w-full btn-gold justify-center flex gap-2 disabled:opacity-60">
                    {submitting ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : 'Send Message'}
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
