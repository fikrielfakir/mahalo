import { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  Home, CheckCircle, ArrowRight, Phone, Mail, User,
  MapPin, Bed, Bath, Maximize2, DollarSign, FileText,
  Building2, Upload, X, Video, AlertCircle, Image,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toast, useToast } from '../components/Toast'
import { consultsApi } from '../api/client'
import LocationPicker from '../components/LocationPicker'

const EMPTY = {
  name: '', email: '', phone: '',
  property_type: 'sale', listing_type: '',
  city: '', location: '',
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
      {/* Thumbnails */}
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

      {/* Upload progress */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map(u => <ProgressBar key={u.id} name={u.name} pct={u.pct} />)}
        </div>
      )}

      {/* Errors */}
      {errors.map((err, i) => (
        <div key={i} className="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
          <AlertCircle size={13} className="shrink-0" />
          {err}
        </div>
      ))}

      {/* Drop zone */}
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
  const [form, setForm]             = useState(EMPTY)
  const [mediaFiles, setMediaFiles] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
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
      const mediaList = mediaFiles.map(f => f.path).join(', ')
      const message = [
        `Property listing request from ${form.name}`,
        `Type: ${form.property_type === 'sale' ? 'For Sale' : 'For Rent'}`,
        form.listing_type && `Category: ${form.listing_type}`,
        `City: ${form.city}`,
        form.location && `Location: ${form.location}`,
        (form.latitude && form.longitude) && `Coordinates: ${form.latitude}, ${form.longitude}`,
        form.bedrooms && `Bedrooms: ${form.bedrooms}`,
        form.bathrooms && `Bathrooms: ${form.bathrooms}`,
        form.size && `Size: ${form.size} m²`,
        form.price && `Price: ${form.price} MAD`,
        form.description && `Details: ${form.description}`,
        mediaFiles.length > 0 && `Attached files: ${mediaList}`,
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
                  <button onClick={() => { setSubmitted(false); setForm(EMPTY); setMediaFiles([]) }} className="btn-outline">
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
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
                    <div className="rounded-2xl border border-dashed border-navy/15 p-4 bg-surface/50">
                      <p className="text-navy/40 text-xs font-semibold mb-2 flex items-center gap-1.5">
                        <MapPin size={12} className="text-gold" />
                        Pin your property on the map <span className="font-normal">(optional — click to place, drag to adjust)</span>
                      </p>
                      <LocationPicker
                        lat={form.latitude}
                        lng={form.longitude}
                        onChange={({ lat, lng }) => setForm(f => ({ ...f, latitude: lat, longitude: lng }))}
                        height={260}
                      />
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

                  {/* Media upload */}
                  <div>
                    <p className="text-navy/40 text-xs font-semibold uppercase tracking-wider mb-3">
                      Photos & Videos <span className="normal-case font-normal">(optional)</span>
                    </p>
                    <MediaUploader files={mediaFiles} onChange={setMediaFiles} />
                  </div>

                  <button type="submit" disabled={submitting} className="w-full btn-gold justify-center flex gap-2 py-4 text-base">
                    {submitting ? 'Submitting...' : 'Submit Listing Request'}
                    {!submitting && <ArrowRight size={18} />}
                  </button>

                  <p className="text-center text-navy/30 text-xs">
                    By submitting you agree to be contacted by a Mahalo agent. No spam, ever.
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
