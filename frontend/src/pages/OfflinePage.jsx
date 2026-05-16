import { Link } from 'react-router-dom'
import { WifiOff, RotateCcw, Home } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl w-full text-center">

          {/* Icon */}
          <div className="relative inline-block mb-8 select-none">
            <span
              className="text-[160px] sm:text-[200px] font-black leading-none"
              style={{ color: '#730D26', opacity: 0.07 }}
            >
              —
            </span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 rounded-3xl bg-navy flex items-center justify-center shadow-2xl">
                <WifiOff size={36} className="text-white" />
              </div>
            </div>
          </div>

          {/* Message */}
          <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
            Hors ligne
          </h1>
          <p className="text-navy/55 text-base mb-2">
            Impossible de se connecter au réseau.
          </p>
          <p className="text-navy/35 text-sm mb-10">
            Vérifiez votre connexion internet et réessayez.
          </p>

          {/* CTA */}
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-navy text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              <RotateCcw size={16} /> Réessayer
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-navy/20 text-navy text-sm font-bold hover:bg-navy/5 transition-colors"
            >
              <Home size={16} /> Accueil
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
