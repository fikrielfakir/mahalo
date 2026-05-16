import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ProfilePageSkeleton, ProfessionalTabSkeleton } from '../components/Skeletons'
import { PropertyCardSkeleton } from '../components/PropertyCard'
import {
  User, Mail, Phone, Building2, FileText, Check, AlertCircle,
  ChevronRight, Clock, CheckCircle, XCircle, Home, MapPin, Bed, Bath, Maximize2, Heart,
  Briefcase, Star, Send, RotateCcw, LayoutDashboard,
} from 'lucide-react'
import { useUserAuth } from '../context/UserAuthContext'
import { authApi, userListingsApi, favoritesApi, professionalApi } from '../api/client'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PropertyCard from '../components/PropertyCard'
import { isVideoPath } from '../utils/media'

function formatPrice(price) {
  if (!price) return null
  const num = parseFloat(price)
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M MAD`
  if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K MAD`
  return `${num.toLocaleString()} MAD`
}

const SPECIALTIES = [
  'Residential Sales', 'Luxury Properties', 'Commercial Real Estate',
  'Property Management', 'New Developments', 'Rentals', 'Investment Properties',
  'Land & Plots', 'Industrial Properties',
]

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80'

function getListingImageUrl(listing) {
  const images = Array.isArray(listing?.images) ? listing.images : []
  const firstImage = images.find(img => !isVideoPath(img))
  if (firstImage) return firstImage.startsWith('http') ? firstImage : `/storage/${firstImage}`
  const firstVideo = images.find(img => isVideoPath(img))
  if (firstVideo && listing?.video_thumbnails?.[firstVideo]) return listing.video_thumbnails[firstVideo]
  const fallbackImg = listing?.image
  if (fallbackImg && !isVideoPath(fallbackImg)) return fallbackImg.startsWith('http') ? fallbackImg : `/storage/${fallbackImg}`
  return FALLBACK_IMG
}

function ListingCard({ listing }) {
  const { t } = useTranslation()

  const MOD_CONFIG = {
    pending:  { label: t('profile.statusPending'), color: 'text-amber-600 bg-amber-50 border-amber-200', icon: Clock },
    approved: { label: t('profile.statusApproved'), color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle },
    rejected: { label: t('profile.statusRejected'), color: 'text-red-500 bg-red-50 border-red-200', icon: XCircle },
  }

  const mod = MOD_CONFIG[listing.moderation_status] || MOD_CONFIG.pending
  const Icon = mod.icon
  const isPending = listing.moderation_status === 'pending'
  const img = getListingImageUrl(listing)
  const slug = listing.slug || listing.id

  const inner = (
    <div className={`relative bg-white rounded-2xl overflow-hidden border transition-all ${isPending ? 'opacity-60 border-amber-100' : 'border-gray-100 hover:-translate-y-1'}`}
      style={{ boxShadow: isPending ? 'none' : '0 2px 12px rgba(115,13,38,0.07)' }}>
      <div className={`absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-bold ${mod.color}`}>
        <Icon size={11} />{mod.label}
      </div>
      <div className="relative h-40 overflow-hidden">
        <img src={img} alt={listing.name} className="w-full h-full object-cover" onError={(e) => { e.target.src = FALLBACK_IMG }} />
        {isPending && <div className="absolute inset-0 bg-white/30 backdrop-blur-[1px]" />}
      </div>
      <div className="p-4">
        <h3 className="font-bold text-navy text-sm mb-1 line-clamp-1">{listing.name}</h3>
        {listing.location && (
          <div className="flex items-center gap-1 text-navy/45 text-xs mb-3">
            <MapPin size={11} className="shrink-0" /><span className="truncate">{listing.location}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-xs text-navy/50 mb-3">
          {listing.number_bedroom > 0 && <span className="flex items-center gap-1"><Bed size={11} /> {listing.number_bedroom} bd</span>}
          {listing.number_bathroom > 0 && <span className="flex items-center gap-1"><Bath size={11} /> {listing.number_bathroom} ba</span>}
          {listing.square && <span className="flex items-center gap-1"><Maximize2 size={11} /> {listing.square} m²</span>}
        </div>
        <div className="flex items-center justify-between">
          {formatPrice(listing.price) ? (
            <span className="font-bold text-navy text-sm">{formatPrice(listing.price)}</span>
          ) : (
            <span className="text-navy/30 text-xs italic">{t('profile.priceNotSet')}</span>
          )}
          <span className={`px-2 py-0.5 rounded-lg text-[11px] font-semibold ${listing.type === 'sale' ? 'bg-blue-50 text-blue-600' : 'bg-gold/10 text-gold'}`}>
            {listing.type === 'sale' ? t('profile.forSale') : t('profile.forRent')}
          </span>
        </div>
        {listing.moderation_status === 'rejected' && listing.reject_reason && (
          <div className="mt-3 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-xs text-red-600">
            <strong>{t('profile.reason')}:</strong> {listing.reject_reason}
          </div>
        )}
        {isPending && (
          <p className="mt-3 text-[11px] text-amber-600/80 text-center">{t('profile.waitingApproval')}</p>
        )}
      </div>
    </div>
  )

  if (!isPending) return <Link to={`/properties/${slug}`} className="block">{inner}</Link>
  return inner
}

function ProfessionalStatus({ status, specialty, appliedAt, rejectReason, onReapply }) {
  const { t } = useTranslation()

  if (status === 'approved') {
    return (
      <div className="bg-white rounded-3xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center">
            <CheckCircle size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-navy">{t('profile.approvedTitle')}</h2>
            <p className="text-xs text-navy/50">{t('profile.approvedDesc')}</p>
          </div>
        </div>
        {specialty && (
          <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100">
            <Star size={14} className="text-emerald-600" />
            <span className="text-sm text-emerald-700 font-medium">{specialty}</span>
          </div>
        )}
        <Link to="/agents" className="mt-4 flex items-center gap-2 text-sm text-gold font-semibold hover:underline">
          {t('profile.viewAgentProfile')} <ChevronRight size={14} />
        </Link>
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className="bg-white rounded-3xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div>
            <h2 className="font-bold text-navy">{t('profile.pendingTitle')}</h2>
            <p className="text-xs text-navy/50">
              {t('profile.submitted')} {appliedAt ? new Date(appliedAt).toLocaleDateString() : ''}
            </p>
          </div>
        </div>
        <p className="text-sm text-navy/60 mt-1">{t('profile.pendingDesc')}</p>
      </div>
    )
  }

  if (status === 'rejected') {
    return (
      <div className="bg-white rounded-3xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center">
            <XCircle size={20} className="text-red-500" />
          </div>
          <div>
            <h2 className="font-bold text-navy">{t('profile.rejectedTitle')}</h2>
            <p className="text-xs text-navy/50">{t('profile.rejectedDesc')}</p>
          </div>
        </div>
        {rejectReason && (
          <div className="mt-2 px-3 py-2 rounded-xl bg-red-50 border border-red-100 text-sm text-red-600">
            <strong>{t('profile.reason')}:</strong> {rejectReason}
          </div>
        )}
        <button onClick={onReapply} className="mt-4 flex items-center gap-2 text-sm text-gold font-semibold hover:underline">
          <RotateCcw size={14} /> {t('profile.reapply')}
        </button>
      </div>
    )
  }

  return null
}

function ProfessionalApplicationForm({ user, onSuccess }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({
    bio: '',
    specialty: '',
    experience_years: '',
    phone: user?.phone || '',
    city_id: '',
    company_name: user?.company_name || '',
    license_number: user?.license_number || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setError('') }

  const submit = async (e) => {
    e.preventDefault()
    if (form.bio.length < 50) { setError(t('profile.bioError')); return }
    setSaving(true)
    try {
      await professionalApi.apply(form)
      onSuccess()
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || t('profile.submitError'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <div className="bg-white rounded-3xl shadow-card p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-2xl bg-gold/10 flex items-center justify-center">
            <Briefcase size={18} className="text-gold" />
          </div>
          <div>
            <h2 className="font-bold text-navy">{t('profile.applicationTitle')}</h2>
            <p className="text-xs text-navy/50">{t('profile.applicationDesc')}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">{t('profile.specialty')} <span className="text-red-400">*</span></label>
            <select value={form.specialty} onChange={e => set('specialty', e.target.value)} required
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all">
              <option value="">{t('profile.selectSpecialty')}</option>
              {SPECIALTIES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">{t('profile.yearsExp')} <span className="text-red-400">*</span></label>
            <input type="number" min="0" max="60" value={form.experience_years} onChange={e => set('experience_years', e.target.value)} required
              placeholder="e.g. 5"
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all" />
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">{t('profile.profPhone')} <span className="text-red-400">*</span></label>
            <div className="relative">
              <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
              <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} required
                placeholder="+212 6 00 00 00 00"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">{t('profile.companyName')}</label>
            <div className="relative">
              <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
              <input type="text" value={form.company_name} onChange={e => set('company_name', e.target.value)}
                placeholder="e.g. Mahalo Realty Group"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">{t('profile.licenseNumber')}</label>
            <div className="relative">
              <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
              <input type="text" value={form.license_number} onChange={e => set('license_number', e.target.value)}
                placeholder="e.g. RE-2024-00123"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">
              {t('profile.bio')} <span className="text-red-400">*</span>
              <span className="text-navy/30 normal-case font-normal ml-1">{t('profile.bioMin')}</span>
            </label>
            <textarea value={form.bio} onChange={e => set('bio', e.target.value)} required rows={5}
              placeholder={t('profile.bioPlaceholder')}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all resize-none" />
            <p className={`text-xs mt-1 ml-1 ${form.bio.length < 50 ? 'text-navy/30' : 'text-emerald-500'}`}>
              {form.bio.length} / 50 minimum characters
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
          <AlertCircle size={16} /> {error}
        </div>
      )}

      <button type="submit" disabled={saving}
        className="w-full py-3.5 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-sm transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
        {saving ? (
          <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('profile.submitting')}</>
        ) : (
          <><Send size={15} /> {t('profile.submitApplication')}</>
        )}
      </button>
    </form>
  )
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const { user, isAuthenticated, loading } = useUserAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('profile')

  const [form, setForm] = useState({ name: '', phone: '' })
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  const [profStatus, setProfStatus] = useState(null)
  const [showAppForm, setShowAppForm] = useState(false)
  const [profLoading, setProfLoading] = useState(false)

  const [listings, setListings]               = useState([])
  const [listingsLoading, setListingsLoading] = useState(false)
  const [favorites, setFavorites]             = useState([])
  const [favoritesLoading, setFavoritesLoading] = useState(false)

  useEffect(() => {
    if (!loading && !isAuthenticated) navigate('/login', { replace: true })
  }, [loading, isAuthenticated, navigate])

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || '', phone: user.phone || '' })
      setProfStatus({
        status:       user.professional_status,
        specialty:    user.professional_specialty,
        appliedAt:    user.professional_applied_at,
        rejectReason: user.professional_reject_reason,
      })
    }
  }, [user])

  useEffect(() => {
    if (activeTab === 'professional' && isAuthenticated && !profStatus?.status) {
      setProfLoading(true)
      professionalApi.status()
        .then(r => setProfStatus({
          status:       r.data?.professional_status,
          specialty:    r.data?.professional_specialty,
          appliedAt:    r.data?.professional_applied_at,
          rejectReason: r.data?.professional_reject_reason,
        }))
        .catch(() => {})
        .finally(() => setProfLoading(false))
    }
  }, [activeTab, isAuthenticated, profStatus?.status])

  useEffect(() => {
    if (activeTab === 'listings' && isAuthenticated) {
      setListingsLoading(true)
      userListingsApi.myListings()
        .then(r => setListings(Array.isArray(r?.data) ? r.data : []))
        .catch(() => setListings([]))
        .finally(() => setListingsLoading(false))
    }
  }, [activeTab, isAuthenticated])

  useEffect(() => {
    if (activeTab === 'favorites' && isAuthenticated) {
      setFavoritesLoading(true)
      favoritesApi.list()
        .then(r => setFavorites(Array.isArray(r?.data) ? r.data : []))
        .catch(() => setFavorites([]))
        .finally(() => setFavoritesLoading(false))
    }
  }, [activeTab, isAuthenticated])

  const set = (key, val) => { setForm(f => ({ ...f, [key]: val })); setSuccess(false); setError('') }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true); setError(''); setSuccess(false)
    try { await authApi.updateProfile(form); setSuccess(true) }
    catch (err) { setError(err?.response?.data?.message || t('profile.submitError')) }
    finally { setSaving(false) }
  }

  const onApplicationSuccess = () => {
    setProfStatus(s => ({ ...s, status: 'pending', appliedAt: new Date().toISOString() }))
    setShowAppForm(false)
  }

  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '?'
  const pendingCount = listings.filter(l => l.moderation_status === 'pending').length
  const isProfessional = profStatus?.status === 'approved'

  const TABS = [
    { key: 'profile',   label: t('profile.tabProfile') },
    ...(isProfessional ? [{ key: 'listings', label: t('profile.tabListings'), badge: pendingCount > 0 ? pendingCount : null }] : []),
    { key: 'favorites', label: t('profile.tabFavorites') },
  ]

  if (loading) return <ProfilePageSkeleton />

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
                isProfessional ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
              }`}>
                {isProfessional ? t('profile.verifiedProfessional') : t('profile.privateIndividual')}
              </span>
            </div>
            <div className="shrink-0 flex flex-col items-end gap-2">
              <Link to="/list-property" className="btn-gold text-xs flex items-center gap-1.5 py-2 px-4">
                <Home size={13} /> {t('profile.listProperty')}
              </Link>
              {isProfessional ? (
                <Link to="/agent-dashboard"
                  className="text-xs flex items-center gap-1.5 py-2 px-4 rounded-2xl bg-navy text-white font-semibold hover:opacity-90 transition-all">
                  <LayoutDashboard size={13} /> {t('profile.agentDashboard')}
                </Link>
              ) : (
                <button onClick={() => setActiveTab('professional')}
                  className="text-xs flex items-center gap-1.5 py-2 px-4 rounded-2xl border border-gold text-gold font-semibold hover:bg-gold/5 transition-all">
                  <Briefcase size={13} /> {t('profile.upgradeAccount')}
                </button>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="flex bg-white rounded-2xl shadow-card p-1 gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-max py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 px-3 ${
                  activeTab === tab.key ? 'bg-navy text-white' : 'text-navy/50 hover:text-navy'
                }`}>
                {tab.label}
                {tab.badge && typeof tab.badge === 'number' && (
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-white text-[10px] font-bold flex items-center justify-center">{tab.badge}</span>
                )}
              </button>
            ))}
          </div>

          {/* Profile tab */}
          {activeTab === 'profile' && (
            <form onSubmit={submit} className="space-y-6">
              <div className="bg-white rounded-3xl shadow-card p-6">
                <h2 className="text-sm font-bold text-navy/50 uppercase tracking-wider mb-4">{t('profile.personalInfo')}</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">{t('profile.fullName')}</label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                      <input type="text" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Your full name"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">{t('profile.email')}</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                      <input type="email" value={user?.email || ''} disabled
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-100 text-sm text-navy/40 bg-gray-50 cursor-not-allowed" />
                    </div>
                    <p className="text-xs text-navy/30 mt-1 ml-1">{t('profile.emailCannotChange')}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">{t('profile.phoneNumber')}</label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                      <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+212 6 00 00 00 00"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all" />
                    </div>
                  </div>
                </div>
              </div>

              {success && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium">
                  <Check size={16} /> {t('profile.savedSuccess')}
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  <AlertCircle size={16} /> {error}
                </div>
              )}

              <button type="submit" disabled={saving}
                className="w-full py-3.5 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-sm transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2">
                {saving
                  ? (<><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />{t('profile.saving')}</>)
                  : (<>{t('profile.saveChanges')} <ChevronRight size={16} /></>)}
              </button>
            </form>
          )}

          {/* Professional tab */}
          {activeTab === 'professional' && (
            <div className="space-y-6">
              {profLoading ? (
                <ProfessionalTabSkeleton />
              ) : profStatus?.status && !showAppForm ? (
                <ProfessionalStatus
                  status={profStatus.status}
                  specialty={profStatus.specialty}
                  appliedAt={profStatus.appliedAt}
                  rejectReason={profStatus.rejectReason}
                  onReapply={() => setShowAppForm(true)}
                />
              ) : showAppForm || !profStatus?.status ? (
                <>
                  {!profStatus?.status && (
                    <div className="bg-white rounded-3xl shadow-card p-6">
                      <h2 className="text-sm font-bold text-navy/50 uppercase tracking-wider mb-3">{t('profile.becomeProTitle')}</h2>
                      <p className="text-sm text-navy/60 leading-relaxed">{t('profile.becomeProDesc')}</p>
                      <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                        {[t('profile.proStep1'), t('profile.proStep2'), t('profile.proStep3')].map((step, i) => (
                          <div key={step} className="flex flex-col items-center gap-1.5">
                            <div className="w-8 h-8 rounded-full bg-gold/10 text-gold font-bold text-sm flex items-center justify-center">{i + 1}</div>
                            <p className="text-xs text-navy/60 font-medium">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <ProfessionalApplicationForm user={user} onSuccess={onApplicationSuccess} />
                  {showAppForm && (
                    <button onClick={() => setShowAppForm(false)} className="w-full text-navy/40 text-sm hover:text-navy">
                      {t('profile.cancel')}
                    </button>
                  )}
                </>
              ) : null}
            </div>
          )}

          {/* Favorites tab */}
          {activeTab === 'favorites' && (
            <div>
              {favoritesLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
                </div>
              ) : favorites.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-card p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <Heart size={28} className="text-navy/20" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{t('profile.noFavoritesYet')}</h3>
                  <p className="text-navy/45 text-sm mb-6">{t('profile.noFavoritesDesc')}</p>
                  <Link to="/properties" className="btn-gold inline-flex items-center gap-2 text-sm">
                    {t('profile.browseProperties')} <ChevronRight size={15} />
                  </Link>
                </div>
              ) : (
                <>
                  <p className="text-sm text-navy/50 mb-4">{favorites.length} saved propert{favorites.length !== 1 ? 'ies' : 'y'}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map(p => <PropertyCard key={p.id} property={p} />)}
                  </div>
                </>
              )}
            </div>
          )}

          {/* My Listings tab */}
          {activeTab === 'listings' && (
            <div>
              {listingsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => <PropertyCardSkeleton key={i} />)}
                </div>
              ) : listings.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-card p-12 text-center">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
                    <Home size={28} className="text-navy/20" />
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{t('profile.noListingsYet')}</h3>
                  <p className="text-navy/45 text-sm mb-6">{t('profile.noListingsDesc')}</p>
                  <Link to="/list-property" className="btn-gold inline-flex items-center gap-2 text-sm">
                    {t('profile.listAProperty')} <ChevronRight size={15} />
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-navy/50">{listings.length} listing{listings.length !== 1 ? 's' : ''}</p>
                    <Link to="/list-property" className="text-gold text-sm font-semibold hover:underline flex items-center gap-1">
                      <Home size={13} /> {t('profile.addNew')}
                    </Link>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {listings.map(l => <ListingCard key={l.id} listing={l} />)}
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
