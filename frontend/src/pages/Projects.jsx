import { useState, useEffect, useRef } from 'react'
import { MapPin, Building, LayoutGrid, Map } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import MapView from '../components/MapView'
import { projectsApi } from '../api/client'
import SEOHead from '../components/SEOHead'

const FALLBACK_IMAGES = [
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

function CompactProjectCard({ project, imgUrl, isActive, onClick, cardRef }) {
  const hasCoords = project.latitude && project.longitude
  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`flex gap-3 p-3 border-b border-gray-100 cursor-pointer transition-colors ${
        isActive ? 'bg-[#BA1932]/8 border-l-4 border-l-[#BA1932]' : 'hover:bg-gray-50'
      }`}
    >
      <img src={imgUrl} alt={project.name} className="w-16 h-16 rounded-xl object-cover shrink-0"
        onError={e => e.target.style.display = 'none'} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-navy text-sm truncate leading-tight">{project.name}</p>
        <p className="text-navy/45 text-xs truncate mt-0.5">{project.city?.name}</p>
        <p className="text-[#BA1932] font-bold text-sm mt-1">{formatPrice(project.price_from)}</p>
        {!hasCoords && <span className="text-[10px] text-gray-300 block">No map location</span>}
      </div>
      <Link
        to={`/projects/${project.slug || project.id}`}
        onClick={e => e.stopPropagation()}
        className="shrink-0 self-center text-xs text-navy/40 hover:text-[#BA1932] transition-colors"
      >→</Link>
    </div>
  )
}

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const [activeId, setActiveId] = useState(null)
  const cardRefs = useRef({})

  useEffect(() => {
    projectsApi.list({ per_page: 100 })
      .then((res) => { setProjects(Array.isArray(res?.data) ? res.data : []) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const mapMarkers = projects
    .filter(p => p.latitude && p.longitude)
    .map((p, i) => {
      const imgUrl = p.image
        ? (p.image.startsWith('http') ? p.image : `/storage/${p.image}`)
        : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]
      return {
        id: p.id,
        lat: parseFloat(p.latitude),
        lng: parseFloat(p.longitude),
        title: p.name,
        subtitle: p.city?.name || '',
        rawPrice: p.price_from,
        image: imgUrl,
        href: `/projects/${p.slug}`,
      }
    })

  const handleMarkerClick = (id) => {
    setActiveId(id)
    const ref = cardRefs.current[id]
    if (ref) ref.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  if (viewMode === 'map') {
    return (
      <div className="flex flex-col" style={{ height: '100vh' }}>
        <SEOHead
          title="New Real Estate Projects in Morocco"
          description="Discover off-plan and new real estate projects across Morocco. Browse residential and mixed-use developments in Casablanca, Marrakech, Rabat, Tanger and more."
          breadcrumbs={[
            { name: 'Home', url: '/' },
            { name: 'New Projects', url: '/projects' },
          ]}
        />
        <Navbar />
        <div className="pt-20 pb-3 px-6 bg-surface">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-0.5">Off-Plan & New</p>
              <h1 className="text-2xl font-bold text-navy">New Projects</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-navy/45 text-sm">{mapMarkers.length} on map · {projects.length} total</span>
              <div className="flex gap-1 p-1 rounded-2xl bg-white shadow-sm">
                <button onClick={() => setViewMode('grid')} title="Grid view"
                  className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-navy text-white' : 'text-navy/40 hover:text-navy'}`}>
                  <LayoutGrid size={16} />
                </button>
                <button onClick={() => setViewMode('map')} title="Map view"
                  className={`p-2 rounded-xl transition-all ${viewMode === 'map' ? 'bg-navy text-white' : 'text-navy/40 hover:text-navy'}`}>
                  <Map size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-80 flex-shrink-0 overflow-y-auto bg-white border-r border-gray-100 shadow-sm">
            {loading ? (
              <div className="p-4 space-y-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-16 h-16 rounded-xl bg-gray-200 shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-3 bg-gray-200 rounded w-4/5" />
                      <div className="h-2 bg-gray-200 rounded w-2/5" />
                    </div>
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="p-8 text-center text-navy/40 text-sm">No projects available</div>
            ) : (
              projects.map((p, i) => {
                const imgUrl = p.image
                  ? (p.image.startsWith('http') ? p.image : `/storage/${p.image}`)
                  : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]
                return (
                  <CompactProjectCard
                    key={p.id}
                    project={p}
                    imgUrl={imgUrl}
                    isActive={activeId === p.id}
                    onClick={() => setActiveId(p.id === activeId ? null : p.id)}
                    cardRef={el => { cardRefs.current[p.id] = el }}
                  />
                )
              })
            )}
          </div>

          <div className="flex-1">
            <MapView
              markers={mapMarkers}
              activeId={activeId}
              onMarkerClick={handleMarkerClick}
              height="100%"
              zoom={6}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface">
      <SEOHead
        title="New Real Estate Projects in Morocco"
        description="Discover off-plan and new real estate projects across Morocco. Browse residential and mixed-use developments in Casablanca, Marrakech, Rabat, Tanger and more."
        breadcrumbs={[
          { name: 'Home', url: '/' },
          { name: 'New Projects', url: '/projects' },
        ]}
      />
      <Navbar />
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Off-Plan & New</p>
            <h1 className="text-3xl font-bold text-navy">New Projects</h1>
          </div>
          <div className="flex gap-1 p-1 rounded-2xl bg-white shadow-sm">
            <button onClick={() => setViewMode('grid')} title="Grid view"
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-navy text-white' : 'text-navy/40 hover:text-navy'}`}>
              <LayoutGrid size={16} />
            </button>
            <button onClick={() => setViewMode('map')} title="Map view"
              className={`p-2 rounded-xl transition-all ${viewMode === 'map' ? 'bg-navy text-white' : 'text-navy/40 hover:text-navy'}`}>
              <Map size={16} />
            </button>
          </div>
        </div>

        {error ? (
          <div className="text-center py-24">
            <p className="text-navy/40 text-lg">Failed to load projects. Please try again.</p>
          </div>
        ) : (
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
              : projects.length === 0 ? (
                  <div className="col-span-3 text-center py-24 text-navy/40">No projects available.</div>
                )
              : projects.map((project, i) => {
                  const imgUrl = project.image
                    ? (project.image.startsWith('http') ? project.image : `/storage/${project.image}`)
                    : FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]
                  return (
                    <Link key={project.id} to={`/projects/${project.slug || project.id}`}
                      className="group bg-white rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1">
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
                            <MapPin size={12} />{project.city?.name}
                          </div>
                        </div>
                      </div>
                    </Link>
                  )
                })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
