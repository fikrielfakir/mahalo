import { Smartphone, Apple, Play } from 'lucide-react'

export default function MobileAppSection() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative rounded-4xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #132d52 50%, #1a3a5c 100%)' }}
        >
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gold rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-blue-400 rounded-full blur-3xl" />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 p-10 lg:p-16 items-center">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-gold/20 text-gold text-xs font-semibold px-4 py-2 rounded-xl mb-6 tracking-wide uppercase">
                <Smartphone size={14} />
                Agenz Mobile App
              </div>
              <h2 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Your next home
                <br />
                <span className="text-gold">is in your hands</span>
              </h2>
              <p className="text-white/60 text-base mb-8 leading-relaxed">
                Search, save and contact on the go. Download the app and discover premium properties anywhere, anytime.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-3 bg-white text-navy px-5 py-3.5 rounded-2xl font-semibold hover:bg-gray-100 transition-colors duration-200">
                  <Apple size={20} />
                  <div className="text-left">
                    <div className="text-xs text-navy/50 leading-none mb-0.5">Download on the</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 bg-white/10 text-white border border-white/20 px-5 py-3.5 rounded-2xl font-semibold hover:bg-white/20 transition-colors duration-200">
                  <Play size={20} className="fill-white" />
                  <div className="text-left">
                    <div className="text-xs text-white/50 leading-none mb-0.5">Get it on</div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Phone Mockup */}
            <div className="flex items-center justify-center lg:justify-end gap-8">
              <div className="relative">
                {/* Phone frame */}
                <div className="relative w-52 h-96 bg-white/10 backdrop-blur-sm border border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-navy rounded-b-2xl z-10" />
                  <div className="h-full bg-gradient-to-b from-navy to-navy-dark flex flex-col p-4 pt-10">
                    <div className="text-white/40 text-xs mb-3">Discover</div>
                    <div className="text-white font-semibold text-sm mb-4">New Properties</div>
                    {/* Mini property cards */}
                    {[
                      { name: 'Villa with Pool', price: '3.8M MAD', bg: '#1a3a5c' },
                      { name: 'Modern Apt', price: '2.4M MAD', bg: '#132d52' },
                    ].map((item) => (
                      <div key={item.name} className="bg-white/10 rounded-2xl p-3 mb-3">
                        <div className="w-full h-16 rounded-xl mb-2" style={{ background: item.bg }} />
                        <div className="text-white text-xs font-semibold">{item.name}</div>
                        <div className="text-gold text-xs font-bold">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating notification */}
                <div className="absolute -right-6 top-16 glass rounded-2xl px-4 py-3 shadow-glass w-40">
                  <div className="text-white text-xs font-semibold mb-1">New Match!</div>
                  <div className="text-white/60 text-xs">Villa — Ain Diab</div>
                  <div className="text-gold text-xs font-bold mt-1">3.8M MAD</div>
                </div>
              </div>

              {/* QR Code */}
              <div className="hidden lg:block bg-white rounded-3xl p-5 text-center">
                <div className="w-28 h-28 bg-navy rounded-2xl mb-3 mx-auto flex items-center justify-center">
                  <div className="grid grid-cols-7 gap-0.5 p-2">
                    {Array.from({ length: 49 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 rounded-sm"
                        style={{
                          background: [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48,7,14,21,28,35,42].includes(i) ? '#C8A97E' : '#1a3a5c'
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-navy text-xs font-medium">Scan to download</p>
                <p className="text-navy/40 text-xs">the app</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
