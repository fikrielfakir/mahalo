import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useRef } from 'react'

const NEIGHBORHOODS = [
  {
    name: 'Casablanca',
    count: '1250+ Properties',
    description: 'Morocco\'s economic capital',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop',
  },
  {
    name: 'Marrakech',
    count: '980+ Properties',
    description: 'The Red City\'s luxury havens',
    image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=600&q=80&auto=format&fit=crop',
  },
  {
    name: 'Rabat',
    count: '480+ Properties',
    description: 'Morocco\'s regal capital',
    image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&q=80&auto=format&fit=crop',
  },
  {
    name: 'Tanger',
    count: '380+ Properties',
    description: 'Gateway to Europe',
    image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=600&q=80&auto=format&fit=crop',
  },
  {
    name: 'Agadir',
    count: '220+ Properties',
    description: 'Atlantic coast paradise',
    image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=600&q=80&auto=format&fit=crop',
  },
]

export default function NeighborhoodsSection() {
  const scrollRef = useRef(null)

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction * 320, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-20 bg-surface overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Prime Locations</p>
            <h2 className="section-title text-3xl">Explore Luxury Neighborhoods</h2>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/neighborhoods" className="section-link hidden sm:flex mr-4">
              View All Neighborhoods
              <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => scroll(-1)}
              className="w-10 h-10 rounded-2xl border border-navy/10 flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 text-navy"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-10 h-10 rounded-2xl border border-navy/10 flex items-center justify-center hover:bg-navy hover:text-white hover:border-navy transition-all duration-200 text-navy"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Cards */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {NEIGHBORHOODS.map((n) => (
            <Link
              key={n.name}
              to={`/neighborhoods?city=${n.name}`}
              className="relative shrink-0 w-60 h-72 rounded-3xl overflow-hidden group cursor-pointer snap-start"
            >
              <img
                src={n.image}
                alt={n.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-bold text-xl mb-1">{n.name}</h3>
                <p className="text-white/60 text-xs">{n.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
