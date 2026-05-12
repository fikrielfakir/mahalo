import { Smartphone, Apple, Play } from 'lucide-react'

export default function MobileAppSection() {
  return (
    <section className="py-20 px-5">
      <div className="max-w-7xl mx-auto">
        <div
          className="relative rounded-4xl overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0B1F3A 0%, #132d52 60%, #1a3a5c 100%)' }}
        >
          {/* Background blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20"
              style={{ background: 'radial-gradient(circle, #C8A97E 0%, transparent 70%)' }} />
            <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, #4f9ef8 0%, transparent 70%)' }} />
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 p-10 lg:p-16 items-center">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 text-gold text-xs font-bold px-4 py-2 rounded-full mb-6 tracking-widest uppercase"
                style={{ background: 'rgba(200,169,126,0.15)', border: '1px solid rgba(200,169,126,0.25)' }}>
                <Smartphone size={13} />
                Agenz Mobile App
              </div>

              <h2 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Your next home
                <br />
                <span className="text-gold">is in your hands</span>
              </h2>
              <p className="text-white/55 text-base mb-8 leading-relaxed max-w-sm">
                Search, save and contact agents on the go. Download the app and discover premium properties anywhere, anytime.
              </p>

              <div className="flex flex-wrap gap-3">
                <button className="flex items-center gap-3 bg-white text-navy px-5 py-3.5 rounded-2xl font-semibold hover:bg-gray-50 transition-colors duration-200 shadow-sm">
                  <Apple size={19} />
                  <div className="text-left">
                    <div className="text-[10px] text-navy/50 leading-none mb-0.5">Download on the</div>
                    <div className="text-sm font-bold">App Store</div>
                  </div>
                </button>
                <button className="flex items-center gap-3 px-5 py-3.5 rounded-2xl font-semibold transition-colors duration-200 text-white"
                  style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.18)' }}>
                  <Play size={19} className="fill-white" />
                  <div className="text-left">
                    <div className="text-[10px] text-white/50 leading-none mb-0.5">Get it on</div>
                    <div className="text-sm font-bold">Google Play</div>
                  </div>
                </button>
              </div>
            </div>

            {/* Phone mockup */}
            <div className="flex items-center justify-center lg:justify-end gap-8">
              <div className="relative">
                <div
                  className="relative w-52 h-[400px] rounded-[2.5rem] overflow-hidden shadow-float"
                  style={{ background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)' }}
                >
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-navy/90 rounded-b-2xl z-10" />
                  <div className="h-full flex flex-col p-4 pt-10"
                    style={{ background: 'linear-gradient(180deg, rgba(11,31,58,0.9) 0%, rgba(7,22,40,0.98) 100%)' }}>
                    <div className="text-white/35 text-[10px] mb-1 uppercase tracking-widest">Discover</div>
                    <div className="text-white font-semibold text-sm mb-4">New Properties</div>
                    {[
                      { name: 'Villa with Pool', price: '3.8M MAD', color: '#1a3a5c' },
                      { name: 'Modern Apartment', price: '2.4M MAD', color: '#132d52' },
                    ].map((item) => (
                      <div key={item.name}
                        className="rounded-2xl p-3 mb-3"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div className="w-full h-14 rounded-xl mb-2" style={{ background: item.color }} />
                        <div className="text-white text-xs font-semibold mb-0.5">{item.name}</div>
                        <div className="text-gold text-xs font-bold">{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating notification */}
                <div className="absolute -right-8 top-14 w-40 rounded-2xl px-4 py-3 shadow-float"
                  style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <div className="text-white text-xs font-bold mb-0.5">New Match! 🏠</div>
                  <div className="text-white/55 text-[11px]">Villa — Ain Diab</div>
                  <div className="text-gold text-xs font-bold mt-1">3.8M MAD</div>
                </div>
              </div>

              {/* QR */}
              <div className="hidden lg:block bg-white/95 backdrop-blur-sm rounded-3xl p-5 text-center shadow-float">
                <div className="w-28 h-28 bg-navy rounded-2xl mb-3 mx-auto flex items-center justify-center">
                  <div className="grid grid-cols-7 gap-0.5 p-2">
                    {Array.from({ length: 49 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="w-2 h-2 rounded-sm"
                        style={{
                          background: [0,1,2,3,4,5,6,7,13,14,20,21,27,28,34,35,41,42,43,44,45,46,47,48,7,14,21,28,35,42].includes(idx) ? '#C8A97E' : '#1a3a5c'
                        }}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-navy text-xs font-semibold">Scan to download</p>
                <p className="text-navy/40 text-[11px] mt-0.5">the Agenz app</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
