import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, Upload, CheckCircle, ArrowRight, Phone, Mail, User, MapPin, Bed, Bath, Maximize2, DollarSign, FileText, Building2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toast, useToast } from '../components/Toast'
import { consultsApi } from '../api/client'

const EMPTY = {
  name: '', email: '', phone: '',
  property_type: 'sale', listing_type: '',
  city: '', location: '',
  bedrooms: '', bathrooms: '', size: '', price: '',
  description: '',
}

const BENEFITS = [
  { icon: CheckCircle, text: 'Listed within 24 hours' },
  { icon: CheckCircle, text: 'Verified badge on your listing' },
  { icon: CheckCircle, text: 'Dedicated agent support' },
  { icon: CheckCircle, text: 'Free professional consultation' },
]

export default function ListProperty() {
  const [form, setForm]           = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast, show: showToast, hide: hideToast } = useToast()

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.city.trim()) {
      showToast('Please fill in name, phone, and city', 'error')
      return
    }
    setSubmitting(true)
    try {
      const message = [
        `Property listing request from ${form.name}`,
        `Type: ${form.property_type === 'sale' ? 'For Sale' : 'For Rent'}`,
        form.listing_type && `Category: ${form.listing_type}`,
        `City: ${form.city}`,
        form.location && `Location: ${form.location}`,
        form.bedrooms && `Bedrooms: ${form.bedrooms}`,
        form.bathrooms && `Bathrooms: ${form.bathrooms}`,
        form.size && `Size: ${form.size} m²`,
        form.price && `Price: ${form.price} MAD`,
        form.description && `Details: ${form.description}`,
      ].filter(Boolean).join('\n')

      await consultsApi.store({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message,
      })
      setSubmitted(true)
    } catch {
      showToast('Failed to submit. Please try again or call us directly.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-6 bg-navy overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-gold text-xs font-semibold uppercase tracking-widest mb-5">
            <Home size={12} /> List Your Property
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Sell or Rent Your Property<br />
            <span className="text-gold">With Confidence</span>
          </h1>
          <p className="text-white/65 text-base max-w-xl mx-auto">
            Tell us about your property and one of our expert agents will contact you within 24 hours to get you listed.
          </p>
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-card">
              <h3 className="text-navy font-bold text-lg mb-5">Why List with Homzen?</h3>
              <div className="space-y-3">
                {BENEFITS.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3">
                    <Icon size={16} className="text-gold shrink-0" />
                    <span className="text-navy/70 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-navy rounded-3xl p-6 shadow-card">
              <div className="w-10 h-10 rounded-xl bg-gold/20 flex items-center justify-center mb-4">
                <Phone size={18} className="text-gold" />
              </div>
              <h3 className="text-white font-bold mb-2">Prefer to talk?</h3>
              <p className="text-white/60 text-sm mb-4">Our team is available 7 days a week to help you list your property.</p>
              <a href="tel:+212600000000" className="btn-gold text-sm flex items-center gap-2 justify-center">
                <Phone size={14} /> Call Us Now
              </a>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gold/10 flex items-center justify-center">
                  <Building2 size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-navy font-bold text-sm">15,000+ Listings</div>
                  <div className="text-navy/45 text-xs">Already on our platform</div>
                </div>
              </div>
              <p className="text-navy/55 text-xs leading-relaxed">Join thousands of homeowners, developers, and investors who trust Homzen to reach the right buyers.</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-3xl shadow-card p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={36} className="text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-navy mb-3">Request Received!</h2>
                <p className="text-navy/60 mb-2">Thank you, <strong>{form.name}</strong>. One of our agents will call you at <strong>{form.phone}</strong> within 24 hours.</p>
                <p className="text-navy/40 text-sm mb-8">In the meantime, feel free to browse our current listings.</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link to="/properties" className="btn-gold flex items-center gap-2">
                    Browse Properties <ArrowRight size={15} />
                  </Link>
                  <button onClick={() => { setSubmitted(false); setForm(EMPTY) }} className="btn-outline">
                    Submit Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-card p-8">
                <h2 className="text-xl font-bold text-navy mb-1">Property Details</h2>
                <p className="text-navy/45 text-sm mb-7">Fill in as many details as you can — it helps us match you with the right agent.</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Contact info */}
                  <div>
                    <p className="text-navy/40 text-xs font-semibold uppercase tracking-wider mb-3">Your Contact Info</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="relative">
                        <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input type="text" placeholder="Full name *" value={form.name} onChange={set('name')} required
                          className="w-full pl-10 pr-4 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                      </div>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input type="tel" placeholder="Phone *" value={form.phone} onChange={set('phone')} required
                          className="w-full pl-10 pr-4 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                      </div>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input type="email" placeholder="Email" value={form.email} onChange={set('email')}
                          className="w-full pl-10 pr-4 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                      </div>
                    </div>
                  </div>

                  {/* Listing type */}
                  <div>
                    <p className="text-navy/40 text-xs font-semibold uppercase tracking-wider mb-3">I want to...</p>
                    <div className="flex gap-3">
                      {[['sale', 'Sell my property'], ['rent', 'Rent out my property']].map(([val, label]) => (
                        <button
                          key={val} type="button"
                          onClick={() => setForm(f => ({ ...f, property_type: val }))}
                          className={`flex-1 py-3 rounded-2xl text-sm font-semibold border-2 transition-all ${
                            form.property_type === val
                              ? 'border-gold bg-gold/5 text-gold'
                              : 'border-gray-100 text-navy/50 hover:border-navy/20'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <p className="text-navy/40 text-xs font-semibold uppercase tracking-wider mb-3">Location</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input type="text" placeholder="City *" value={form.city} onChange={set('city')} required
                          className="w-full pl-10 pr-4 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                      </div>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input type="text" placeholder="Neighborhood / address" value={form.location} onChange={set('location')}
                          className="w-full pl-10 pr-4 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                      </div>
                    </div>
                  </div>

                  {/* Property specs */}
                  <div>
                    <p className="text-navy/40 text-xs font-semibold uppercase tracking-wider mb-3">Property Specs</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="relative">
                        <Bed size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input type="number" placeholder="Bedrooms" min="0" value={form.bedrooms} onChange={set('bedrooms')}
                          className="w-full pl-10 pr-3 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                      </div>
                      <div className="relative">
                        <Bath size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input type="number" placeholder="Bathrooms" min="0" value={form.bathrooms} onChange={set('bathrooms')}
                          className="w-full pl-10 pr-3 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                      </div>
                      <div className="relative">
                        <Maximize2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input type="number" placeholder="Size (m²)" min="0" value={form.size} onChange={set('size')}
                          className="w-full pl-10 pr-3 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                      </div>
                      <div className="relative">
                        <DollarSign size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input type="number" placeholder="Price (MAD)" min="0" value={form.price} onChange={set('price')}
                          className="w-full pl-10 pr-3 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-navy/40 text-xs font-semibold uppercase tracking-wider mb-3">Additional Details</p>
                    <div className="relative">
                      <FileText size={15} className="absolute left-3.5 top-3.5 text-navy/30" />
                      <textarea
                        placeholder="Describe your property — features, condition, nearby amenities..."
                        rows={4}
                        value={form.description}
                        onChange={set('description')}
                        className="w-full pl-10 pr-4 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30 resize-none"
                      />
                    </div>
                  </div>

                  {/* Photo upload note */}
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-6 text-center">
                    <Upload size={24} className="text-navy/25 mx-auto mb-2" />
                    <p className="text-navy/40 text-sm font-medium">Photos can be shared with your agent directly</p>
                    <p className="text-navy/30 text-xs mt-1">WhatsApp or email — they'll guide you through it</p>
                  </div>

                  <button type="submit" disabled={submitting} className="w-full btn-gold justify-center flex gap-2 py-4 text-base">
                    {submitting ? 'Submitting...' : 'Submit Listing Request'}
                    {!submitting && <ArrowRight size={18} />}
                  </button>

                  <p className="text-center text-navy/30 text-xs">
                    By submitting you agree to be contacted by a Homzen agent. No spam, ever.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
