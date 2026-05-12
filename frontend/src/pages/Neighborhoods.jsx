import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const NEIGHBORHOODS = [
  { name: 'Casablanca', count: '1250+ Properties', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', description: "Morocco's bustling economic capital with world-class amenities." },
  { name: 'Marrakech', count: '980+ Properties', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', description: 'The Red City with a perfect blend of tradition and luxury.' },
  { name: 'Rabat', count: '480+ Properties', image: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&q=80', description: "Morocco's regal capital with prestigious neighborhoods." },
  { name: 'Tanger', count: '380+ Properties', image: 'https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=800&q=80', description: 'Gateway to Europe with stunning sea views.' },
  { name: 'Agadir', count: '220+ Properties', image: 'https://images.unsplash.com/photo-1512632578888-169bbbc64f33?w=800&q=80', description: 'Atlantic coast paradise with beautiful beaches.' },
  { name: 'Fès', count: '160+ Properties', image: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80', description: 'The cultural capital with ancient medina charm.' },
]

export default function Neighborhoods() {
  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      <div className="pt-24 pb-20 px-6 max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-gold text-xs font-semibold uppercase tracking-widest mb-2">Prime Locations</p>
          <h1 className="text-3xl font-bold text-navy">Explore Neighborhoods</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {NEIGHBORHOODS.map((n) => (
            <Link
              key={n.name}
              to={`/properties?search=${n.name}`}
              className="group relative rounded-3xl overflow-hidden h-72 cursor-pointer"
            >
              <img src={n.image} alt={n.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-bold text-2xl mb-1">{n.name}</h3>
                <p className="text-white/60 text-sm mb-2">{n.count}</p>
                <p className="text-white/40 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{n.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  )
}
