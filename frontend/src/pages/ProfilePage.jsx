import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  User, Mail, Phone, Building2, FileText, Check, AlertCircle,
  ChevronRight, Clock, CheckCircle, XCircle, Home, MapPin, Bed, Bath, Maximize2, Heart,
} from 'lucide-react'
import { useUserAuth } from '../context/UserAuthContext'
import { authApi, userListingsApi, favoritesApi } from '../api/client'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyCard from '../components/PropertyCard'

const TYPES = [
  { id: 'individual', label: 'Private Individual', description: 'Looking to buy, sell, or rent a property for personal use.', icon: User },
  { id: 'professional', label: 'Professional', description: 'Real estate agent, broker, developer, or property investor.', icon: Building2 },
]

function formatPrice(price) {
  if (!price) return null
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K MAD`
  return `${num.toLocaleString()} MAD`
}

const MOD_CONFIG = {
  pending:  { label: 'Pending Review', color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
  approved: { label: 'Approved',       color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle },
  rejected: { label: 'Rejected',       color: 'text-red-500 bg-red-50 border-red-200', icon: XCircle },
}

function ListingCard({ listing }) {
  const mod = MOD_CONFIG[listing.moderation_status] || MOD_CONFIG.pending
  const Icon = mod.icon
  const isPending = listing.moderation_status === 'pending'
  const FALLBACK = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80'
  const img = listing.image ? `/storage/${listing.image}` : FALLBACK

  return (
    <div className={`relative bg-white rounded-2xl overflow-hidden border transition-all ${isPending ? 'opacity-60 border-amber-100' : 'border-gray-100'}`}
      style={{ boxShadow: isPending ? 'none' : '0 2px 12px rgba(115,13,38,0.07)' }}>

      {/* Status badge */}
      <div className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold ${mod.color}`}>
        <Icon size={11} />
        {mod.label}
      </div>

      <div className="relative h-40 overflow-hidden">
        <img src={img} alt={listing.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK }} />
        {isPending && (
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />
        )}
      </div>

      <div className="p-4">
        <h3 className="font-bold text-navy text-sm mb-1 line-clamp-1">{listing.name}</h3>

        {listing.location && (
          <div className="flex items-center gap-1 text-navy/45 text-xs mb-3">
            <MapPin size={11} className="shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>
        )}

        <div className="flex items-center gap-3 text-xs text-navy/50 mb-3">
          {listing.number_bedroom > 0 && (
            <span className="flex items-center gap-1"><Bed size={11} /> {listing.number_bedroom} bd</span>
          )}
          {listing.number_bathroom > 0 && (
            <span className="flex items-center gap-1"><Bath size={11} /> {listing.number_bathroom} ba</span>
          )}
          {listing.square && (
            <span className="flex items-center gap-1"><Maximize2 size={11} /> {listing.square} m²</span>
          )}
        </div>

        <div className="flex items-center justify-between">
          {formatPrice(listing.price) ? (
            <span className="font-bold text-navy text-sm">{formatPrice(listing.price)}</span>
          ) : (
            <span className="text-navy/30 text-xs italic">Price not set</span>
          )}
          <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${listing.type === 'sale' ? 'bg-blue-50 text-blue-600' : 'bg-gold/10 text-gold'}`}>
            {listing.type === 'sale' ? 'For Sale' : 'For Rent'}
          </span>
        </div>

        {listing.moderation_status === 'rejected' && listing.reject_reason && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600">
            <strong>Reason:</strong> {listing.reject_reason}
          </div>
        )}

        {isPending && (
          <p className="mt-3 text-[11px] text-amber-600/80 text-center">
            Waiting for admin approval — not yet visible to others
          </p>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useUserAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')

  const [form, setForm] = useState({ name: '', phone: '', account_type: 'individual', company_name: '', license_number: '' })
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const [listings, setListings]       = useState([])
  const [listingsLoading, setListingsLoading] = useState(false)

  const [favorites, setFavorites]         = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/login', { replace: true })
  }, [loading, isAuthenticated, navigate])

  useEffect(() => {
    if (user) {
      setForm({
        name:           user.name           || '',
        phone:          user.phone          || '',
        account_type:   user.account_type   || 'individual',
        company_name:   user.company_name   || '',
        license_number: user.license_number || '',
      })
    }
  }, [user])

  useEffect(() => {
    if (activeTab === 'listings' && isAuthenticated) {
      setListingsLoading(true)
      userListingsApi.myListings()
        .then((r) => setListings(Array.isArray(r?.data) ? r.data : []))
        .catch(() => setListings([]))
        .finally(() => setListingsLoading(false))
    }
  }, [activeTab, isAuthenticated])

  useEffect(() => {
    if (activeTab === 'favorites' && isAuthenticated) {
      setFavoritesLoading(true)
      favoritesApi.list()
        .then((r) => setFavorites(Array.isArray(r?.data) ? r.data : []))
        .catch(() => setFavorites([]))
        .finally(() => setFavoritesLoading(false))
    }
  }, [activeTab, isAuthenticated])

  const set = (key, val) => { setForm((f) => ({ ...f, [key]: val })); setSuccess(false); setError('') }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess(false)
    try { await authApi.updateProfile(form); setSuccess(true) }
    catch (err) { setError(err?.response?.data?.message || 'Failed to save changes.') }
    finally { setSaving(false) }
  }

  const initials = user?.name ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?'
  const pendingCount = listings.filter(l => l.moderation_status === 'pending').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Header card */}
          <div className="bg-white rounded-3xl shadow-card p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-md">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-bold text-navy truncate">{user?.name}</h1>
              <p className="text-sm text-navy/50 truncate">{user?.email}</p>
              <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                form.account_type === 'professional' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {form.account_type === 'professional' ? 'Professional' : 'Private Individual'}
              </span>
            </div>
            <Link to="/list-property" className="shrink-0 btn-gold text-xs flex items-center gap-1.5 py-2 px-4">
              <Home size={13} /> List Property
            </Link>
          </div>

          {/* Tabs */}
          <div className="flex bg-white rounded-2xl shadow-card p-1 gap-1">
            {[
              { key: 'profile', label: 'Profile' },
              { key: 'listings', label: 'My Listings', badge: pendingCount > 0 ? pendingCount : null },
              { key: 'favorites', label: 'Favorites' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  activeTab === tab.key ? 'bg-navy text-white' : 'text-navy/50 hover:text-navy'
                }`}
              >
                {tab.label}
                {tab.badge && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-white text-[10px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <form onSubmit={submit} className="space-y-6">
              <div className="bg-white rounded-3xl shadow-card p-6">
                <h2 className="text-sm font-bold text-navy/50 uppercase tracking-wider mb-4">Account Type</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {TYPES.map(({ id, label, description, icon: Icon }) => {
                    const active = form.account_type === id
                    return (
                      <button key={id} type="button" onClick={() => set('account_type', id)}
                        className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 ${active ? 'border-gold bg-gold/5' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${active ? 'bg-gold text-white' : 'bg-gray-100 text-navy/40'}`}>
                            <Icon size={18} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-2">
                              <p className={`text-sm font-semibold ${active ? 'text-navy' : 'text-navy/60'}`}>{label}</p>
                              {active && <div className="w-4 h-4 rounded-full bg-gold flex items-center justify-center shrink-0"><Check size={10} className="text-white" strokeWidth={3} /></div>}
                            </div>
                            <p className="text-xs text-navy/40 mt-0.5 leading-relaxed">{description}</p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="bg-white rounded-3xl shadow-card p-6">
                <h2 className="text-sm font-bold text-navy/50 uppercase tracking-wider mb-4">Personal Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Full Name</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                      <input type="text" value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Your full name"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                      <input type="email" value={user?.email || ''} disabled
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-100 text-sm text-navy/40 bg-gray-50 cursor-not-allowed" />
                    </div>
                    <p className="text-xs text-navy/30 mt-1 ml-1">Email address cannot be changed.</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Phone Number</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                      <input type="tel" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="+212 6 00 00 00 00"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              {form.account_type === 'professional' && (
                <div className="bg-white rounded-3xl shadow-card p-6">
                  <h2 className="text-sm font-bold text-navy/50 uppercase tracking-wider mb-4">Professional Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">Company / Agency Name</label>
                      <div className="relative">
                        <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input type="text" value={form.company_name} onChange={(e) => set('company_name', e.target.value)} placeholder="e.g. Mahalo Realty Group"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">License / Registration Number</label>
                      <div className="relative">
                        <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                        <input type="text" value={form.license_number} onChange={(e) => set('license_number', e.target.value)} placeholder="e.g. RE-2024-00123"
                          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium">
                  <Check size={16} /> Profile saved successfully.
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button type="submit" disabled={saving}
                className="w-full py-3.5 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-sm transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? (<><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>) : (<>Save Changes <ChevronRight size={16} /></>)}
              </button>
            </form>
          )}

          {/* Favorites tab */}
          {activeTab === 'favorites' && (
            <div>
              {favoritesLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              ) : favorites.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-card p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <Heart size={28} className="text-navy/20" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">No favorites yet</h3>
                  <p className="text-navy/45 text-sm mb-6">Browse properties and tap the heart icon to save them here.</p>
                  <Link to="/properties" className="btn-gold inline-flex items-center gap-2 text-sm">
                    Browse Properties <ChevronRight size={15} />
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-sm text-navy/50 mb-4">{favorites.length} saved propert{favorites.length !== 1 ? 'ies' : 'y'}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map((p) => <PropertyCard key={p.id} property={p} />)}
                  </div>
                </>
              )}
            </div>
          )}

          {/* My Listings tab */}
          {activeTab === 'listings' && (
            <div>
              {listingsLoading ? (
                <div className="flex justify-center py-16">
                  <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
              ) : listings.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-card p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <Home size={28} className="text-navy/20" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">No listings yet</h3>
                  <p className="text-navy/45 text-sm mb-6">Submit your first property and it will appear here once reviewed.</p>
                  <Link to="/list-property" className="btn-gold inline-flex items-center gap-2 text-sm">
                    List a Property <ChevronRight size={15} />
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-navy/50">{listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
                    <Link to="/list-property" className="text-gold text-sm font-semibold hover:underline flex items-center gap-1">
                      <Home size={13} /> Add new
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listings.map((l) => <ListingCard key={l.id} listing={l} />)}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
