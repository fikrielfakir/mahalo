import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  Home, CheckCircle, ArrowRight, Phone, Mail, User,
  MapPin, Bed, Bath, Maximize2, DollarSign, FileText,
  Building2, X, Video, AlertCircle, Image, ChevronDown, LogIn,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toast, useToast } from '../components/Toast'
import { userListingsApi } from '../api/client'
import LocationPicker from '../components/LocationPicker'
import { useUserAuth } from '../context/UserAuthContext'
import { useAuthModal } from '../context/AuthModalContext'

const EMPTY_FORM = {
  property_name: '',
  property_type: 'sale',
  city_id: '',
  location: '',
  latitude: '', longitude: '',
  bedrooms: '', bathrooms: '', size: '', price: '',
  description: '',
}

const BENEFITS = [
  { icon: CheckCircle, text: 'Listed within 24 hours' },
  { icon: CheckCircle, text: 'Verified badge on your listing' },
  { icon: CheckCircle, text: 'Dedicated agent support' },
  { icon: CheckCircle, text: 'Free professional consultation' },
]

const IMAGE_MAX = 20 * 1024 * 1024
const VIDEO_MAX = 100 * 1024 * 1024

function ProgressBar({ pct, name }) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl">
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-navy/70 truncate mb-1">{name}</p>
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-200"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
      <span className="text-xs font-semibold text-gold shrink-0">{pct}%</span>
    </div>
  )
}

function MediaThumb({ file, onRemove }) {
  const isVideo = file.mime?.startsWith('video/') || /\.(mp4|mov|avi|mkv|webm|m4v)$/i.test(file.url || '')
  return (
    <div className="relative group rounded-xl overflow-hidden aspect-square bg-gray-100">
      {isVideo ? (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-800 gap-1">
          <Video size={22} className="text-gray-400" />
          <span className="text-[9px] text-gray-300 px-1 text-center truncate w-full">
            {file.name}
          </span>
        </div>
      ) : (
        <img
          src={file.previewUrl || (file.url ? `/storage/${file.url}` : '')}
          alt=""
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors pointer-events-none" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow hover:bg-red-600"
      >
        <X size={11} />
      </button>
    </div>
  )
}

function MediaUploader({ files, onChange }) {
  const [uploading, setUploading] = useState([])
  const [errors, setErrors] = useState([])
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef()
  const filesRef = useRef(files)
  filesRef.current = files

  const addError = (msg) => {
    setErrors(prev => [...prev, msg])
    setTimeout(() => setErrors(prev => prev.slice(1)), 5000)
  }

  const uploadFile = useCallback(async (file) => {
    const isVideo = file.type.startsWith('video/')
    const isImage = file.type.startsWith('image/')

    if (!isImage && !isVideo) return
    if (isImage && file.size > IMAGE_MAX) { addError(`${file.name}: images must be under 20 MB`); return }
    if (isVideo && file.size > VIDEO_MAX) { addError(`${file.name}: videos must be under 100 MB`); return }

    const id = Math.random().toString(36).slice(2)
    const previewUrl = isImage ? URL.createObjectURL(file) : null
    setUploading(prev => [...prev, { id, name: file.name, pct: 0 }])

    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', isVideo ? 'videos' : 'media')

    try {
      const res = await axios.post('/api/v1/admin/media/upload', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const pct = Math.round((e.loaded / e.total) * 100)
          setUploading(prev => prev.map(u => u.id === id ? { ...u, pct } : u))
        },
      })
      const path = res.data?.path
      const mime = file.type
      if (path) {
        onChange([...filesRef.current, { path, name: file.name, mime, previewUrl, url: path }])
      }
    } catch {
      addError(`Failed to upload ${file.name}. Please try again.`)
    } finally {
      setUploading(prev => prev.filter(u => u.id !== id))
    }
  }, [onChange])

  const handleFiles = useCallback((fileList) => {
    Array.from(fileList).forEach(uploadFile)
  }, [uploadFile])

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-3">
      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {files.map((f, i) => (
            <MediaThumb
              key={f.path}
              file={f}
              onRemove={() => onChange(files.filter((_, idx) => idx !== i))}
            />
          ))}
        </div>
      )}

      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map(u => <ProgressBar key={u.id} name={u.name} pct={u.pct} />)}
        </div>
      )}

      {errors.map((err, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          <AlertCircle size={13} className="shrink-0" />
          {err}
        </div>
      ))}

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl flex flex-col items-center justify-center py-8 cursor-pointer transition-all select-none ${
          dragging
            ? 'border-gold bg-gold/5'
            : 'border-gray-200 hover:border-gold/50 hover:bg-gray-50'
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <Image size={20} className={dragging ? 'text-gold' : 'text-navy/25'} />
          <Video size={20} className={dragging ? 'text-gold' : 'text-navy/25'} />
        </div>
        <p className="text-sm font-medium text-navy/50">
          {dragging ? 'Drop files to upload' : 'Drag & drop photos or videos'}
        </p>
        <p className="text-xs text-navy/30 mt-1">
          JPG, PNG, WEBP up to 20 MB · MP4, MOV, WEBM up to 100 MB
        </p>
        <button
          type="button"
          className="mt-3 px-4 py-1.5 text-xs font-semibold text-gold border border-gold/30 rounded-xl hover:bg-gold/5 transition-colors"
        >
          Browse files
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4,video/quicktime,video/x-msvideo,video/webm,video/x-matroska"
          multiple
          className="hidden"
          onChange={(e) => { handleFiles(e.target.files); e.target.value = '' }}
        />
      </div>

      {files.length > 0 && (
        <p className="text-xs text-navy/35">
          {files.length} file{files.length !== 1 ? 's' : ''} attached · hover a thumbnail to remove
        </p>
      )}
    </div>
  )
}

export default function ListProperty() {
  const [form, setForm]             = useState(EMPTY_FORM)
  const [cities, setCities]         = useState([])
  const [geocoding, setGeocoding]   = useState(false)
  const [mediaFiles, setMediaFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const pendingSubmitRef            = useRef(false)
  const doSubmitRef                 = useRef(null)
  const prevLatLngRef               = useRef('')
  const prevCityIdRef               = useRef('')
  const { toast, show: showToast, hide: hideToast } = useToast()
  const { isAuthenticated, user, loading: authLoading } = useUserAuth()
  const { openAuthModal } = useAuthModal()

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  useEffect(() => {
    fetch('/api/v1/cities')
      .then(r => r.json())
      .then(data => setCities(data?.data || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (isAuthenticated && user && pendingSubmitRef.current) {
      pendingSubmitRef.current = false
      setTimeout(() => doSubmitRef.current?.(), 50)
    }
  }, [isAuthenticated, user])

  /* Map pin → city (reverse geocode) */
  useEffect(() => {
    const key = `${form.latitude},${form.longitude}`
    if (!form.latitude || !form.longitude || key === prevLatLngRef.current) return
    prevLatLngRef.current = key
    setGeocoding(true)
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${form.latitude}&lon=${form.longitude}&format=json&accept-language=en`,
      { headers: { 'Accept': 'application/json' } }
    )
      .then(r => r.json())
      .then(data => {
        const addr = data.address || {}
        const neighborhood = addr.suburb || addr.neighbourhood || addr.road || addr.village || ''
        const rawCity = (addr.city || addr.town || addr.village || addr.county || '').toLowerCase()
        const matchedCity = cities.find(c => {
          const cn = c.name.toLowerCase()
          return cn === rawCity || rawCity.includes(cn) || cn.includes(rawCity)
        })
        setForm(f => {
          const newCityId = matchedCity ? String(matchedCity.id) : f.city_id
          prevCityIdRef.current = newCityId
          return {
            ...f,
            location: neighborhood || f.location,
            city_id:  newCityId,
          }
        })
      })
      .catch(() => {})
      .finally(() => setGeocoding(false))
  }, [form.latitude, form.longitude, cities])

  /* City dropdown → map pin (forward geocode) */
  useEffect(() => {
    if (!form.city_id || form.city_id === prevCityIdRef.current) return
    prevCityIdRef.current = form.city_id
    const cityName = cities.find(c => String(c.id) === String(form.city_id))?.name
    if (!cityName) return
    fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&country=Morocco&format=json&limit=1&accept-language=en`,
      { headers: { 'Accept': 'application/json' } }
    )
      .then(r => r.json())
      .then(data => {
        const hit = data?.[0]
        if (hit?.lat && hit?.lon) {
          const key = `${hit.lat},${hit.lon}`
          prevLatLngRef.current = key
          setForm(f => ({ ...f, latitude: hit.lat, longitude: hit.lon }))
        }
      })
      .catch(() => {})
  }, [form.city_id, cities])

  const doSubmit = useCallback(async () => {
    const selectedCity = cities.find(c => String(c.id) === String(form.city_id))
    if (!selectedCity) {
      showToast('Please select a city', 'error')
      return
    }

    setSubmitting(true)
    try {
      await userListingsApi.store({
        name:             form.property_name.trim() || `${selectedCity.name} — ${form.property_type === 'sale' ? 'For Sale' : 'For Rent'}`,
        type:             form.property_type,
        location:         form.location || '',
        city_id:          parseInt(form.city_id),
        number_bedroom:   form.bedrooms  ? parseInt(form.bedrooms)   : null,
        number_bathroom:  form.bathrooms ? parseInt(form.bathrooms)  : null,
        square:           form.size      ? parseFloat(form.size)     : null,
        price:            form.price     ? parseFloat(form.price)    : null,
        description:      form.description || '',
        latitude:         form.latitude  || null,
        longitude:        form.longitude || null,
        images:           mediaFiles.map(f => f.path),
      })
      setSubmitted(true)
    } catch {
      showToast('Failed to submit. Please try again or call us directly.', 'error')
    } finally {
      setSubmitting(false)
    }
  }, [user, form, mediaFiles, cities])

  useEffect(() => {
    doSubmitRef.current = doSubmit
  }, [doSubmit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      pendingSubmitRef.current = true
      openAuthModal()
      return
    }
    await doSubmit()
  }

  const cityName = cities.find(c => String(c.id) === String(form.city_id))?.name || ''

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

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

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-card">
              <h3 className="text-navy font-bold text-lg mb-5">Why List with Mahalo?</h3>
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
              <p className="text-navy/55 text-xs leading-relaxed">Join thousands of homeowners, developers, and investors who trust Mahalo to reach the right buyers.</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            {submitted ? (
              <div className="bg-white rounded-3xl shadow-card p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold uppercase tracking-wide mb-5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Pending Admin Review
                </div>
                <h2 className="text-2xl font-bold text-navy mb-3">Listing Submitted!</h2>
                <p className="text-navy/60 mb-2">Your property listing in <strong>{cityName}</strong> has been submitted for review.</p>
                <p className="text-navy/40 text-sm mb-2">An admin will review it within 24 hours. Once approved, it will be visible to all visitors.</p>
                <p className="text-navy/40 text-sm mb-8">You can track the status of your listing in your <Link to="/profile" className="text-gold font-semibold hover:underline">Profile → My Listings</Link>.</p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link to="/profile" className="btn-gold flex items-center gap-2">
                    View My Listings <ArrowRight size={15} />
                  </Link>
                  <button onClick={() => { setSubmitted(false); setForm(EMPTY_FORM); setMediaFiles([]) }} className="btn-outline">
                    Submit Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-card p-8">
                <h2 className="text-xl font-bold text-navy mb-1">Property Details</h2>
                <p className="text-navy/45 text-sm mb-7">Fill in as many details as you can — it helps us match you with the right agent.</p>

                <form onSubmit={handleSubmit} className="space-y-6">

                  {/* Account / contact status */}
                  {isAuthenticated && user ? (
                    <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <User size={14} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-emerald-700">Submitting as</p>
                        <p className="text-sm font-medium text-navy truncate">{user.name}{user.phone ? ` · ${user.phone}` : ''}</p>
                      </div>
                      <CheckCircle size={16} className="text-emerald-500 shrink-0 ml-auto" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 px-4 py-3.5 bg-navy/4 border border-navy/10 rounded-2xl">
                      <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                        <LogIn size={14} className="text-navy/60" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-navy/80">Sign in to submit your listing</p>
                        <p className="text-xs text-navy/40">Your contact details will be taken from your account.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => openAuthModal()}
                        className="shrink-0 px-4 py-1.5 text-xs font-semibold text-white bg-navy rounded-xl hover:bg-navy/80 transition-colors"
                      >
                        Sign in
                      </button>
                    </div>
                  )}

                  {/* Property Name */}
                  <div>
                    <p className="text-navy/40 text-xs font-semibold uppercase tracking-wider mb-3">Property Name</p>
                    <div className="relative">
                      <Building2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                      <input
                        type="text"
                        placeholder="e.g. Villa with Pool — Ain Diab (optional)"
                        value={form.property_name}
                        onChange={set('property_name')}
                        className="w-full pl-10 pr-4 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30"
                      />
                    </div>
                  </div>

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

                  <div>
                    <p className="text-navy/40 text-xs font-semibold uppercase tracking-wider mb-3">Location</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none z-10" />
                        <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none z-10" />
                        <select
                          value={form.city_id}
                          onChange={set('city_id')}
                          required
                          className="w-full pl-10 pr-9 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30 appearance-none"
                        >
                          <option value="">City *</option>
                          {cities.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                        {geocoding && (
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-gold font-semibold">
                            auto-filling…
                          </span>
                        )}
                        <input type="text" placeholder="Neighborhood / address" value={form.location} onChange={set('location')}
                          className="w-full pl-10 pr-4 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-gold/30" />
                      </div>
                    </div>
                    <div className="rounded-2xl border border-dashed border-navy/15 p-4 bg-surface/50">
                      <p className="text-navy/40 text-xs font-semibold mb-2 flex items-center gap-1.5">
                        <MapPin size={12} className="text-gold" />
                        Pin your property on the map <span className="font-normal">(optional — city & address will auto-fill from pin)</span>
                      </p>
                      <LocationPicker
                        lat={form.latitude}
                        lng={form.longitude}
                        onChange={({ lat, lng }) => setForm(f => ({ ...f, latitude: lat, longitude: lng }))}
                        height={260}
                        restrictToMorocco
                      />
                    </div>
                  </div>

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

                  <div>
                    <p className="text-navy/40 text-xs font-semibold uppercase tracking-wider mb-3">
                      Photos & Videos <span className="normal-case font-normal">(optional)</span>
                    </p>
                    <MediaUploader files={mediaFiles} onChange={setMediaFiles} />
                  </div>

                  <button type="submit" disabled={submitting || authLoading} className="w-full btn-gold justify-center flex gap-2 py-4 text-base">
                    {submitting ? 'Submitting...' : 'Submit Listing Request'}
                    {!submitting && <ArrowRight size={18} />}
                  </button>

                  {!isAuthenticated && (
                    <p className="text-center text-navy/30 text-xs">
                      You'll be asked to sign in before your listing is submitted.
                    </p>
                  )}
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
