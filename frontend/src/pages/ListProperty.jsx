import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Home, CheckCircle, ArrowRight, ArrowLeft, Phone,
  MapPin, Bed, Bath, Maximize2, DollarSign, FileText,
  Building2, LogIn, User, ChevronDown, Layers,
  CalendarDays, Link2, PhoneCall, MessageCircle,
  Mail, Sparkles, Loader2, RotateCcw, Check,
  Hash, Upload, Eye,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toast, useToast } from '../components/Toast'
import { citiesApi, categoriesApi, featuresApi, facilitiesApi, userListingsApi } from '../api/client'
import LocationPicker from '../components/LocationPicker'
import { useUserAuth } from '../context/UserAuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import ImageUploader from '../admin/components/ImageUploader'

// ─── UI-only constants (no DB equivalent) ────────────────────────────────────

const CONTACT_METHODS = [
  { value: 'phone',    label: 'Phone call', icon: PhoneCall },
  { value: 'whatsapp', label: 'WhatsApp',   icon: MessageCircle },
  { value: 'email',    label: 'Email',      icon: Mail },
]

const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening']

// Map category names to display emojis (presentation layer only)
const CATEGORY_EMOJI = {
  apartment:  '🏢', villa:      '🏡', house:      '🏠',
  riad:       '🕌', land:       '🏗️', office:     '🏬',
  commercial: '🏬', studio:     '🛋️',
}
function getCategoryEmoji(name = '') {
  return CATEGORY_EMOJI[name.toLowerCase()] || '🏘️'
}

const DRAFT_KEY = 'mahalo_list_property_draft'

const EMPTY_FORM = {
  property_name: '',
  category_id:   '',
  listing_intent: 'sale',
  city_id:        '',
  location:       '',
  latitude:       '',
  longitude:      '',
  bedrooms:       '',
  bathrooms:      '',
  size:           '',
  price:          '',
  floor_number:   '',
  total_floors:   '',
  year_built:     '',
  feature_ids:        [],
  facility_distances: [],
  titre_foncier:  '',
  available_immediately: false,
  available_from: '',
  description:    '',
  image_url:      '',
  virtual_tour:   '',
  contact_method: 'whatsapp',
  best_time:      'Morning',
}

const STEPS = [
  { label: 'Basic Info'  },
  { label: 'Location'    },
  { label: 'Details'     },
  { label: 'Media & Contact' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateDescription(form, cities, categories, features) {
  const city     = cities.find(c => String(c.id) === String(form.city_id))?.name || ''
  const category = categories.find(c => String(c.id) === String(form.category_id))?.name || 'Property'
  const intent   = form.listing_intent === 'sale' ? 'for sale' : 'for rent'
  const loc      = [form.location, city].filter(Boolean).join(', ')
  const selected = features.filter(f => form.feature_ids.includes(String(f.id)) || form.feature_ids.includes(f.id))

  let desc = `Discover this exceptional ${category.toLowerCase()} ${intent}`
  if (loc) desc += ` in ${loc}`
  desc += '.'

  const specs = []
  if (form.bedrooms)  specs.push(`${form.bedrooms} bedroom${form.bedrooms > 1 ? 's' : ''}`)
  if (form.bathrooms) specs.push(`${form.bathrooms} bathroom${form.bathrooms > 1 ? 's' : ''}`)
  if (form.size)      specs.push(`${form.size} m²`)
  if (specs.length)   desc += ` This property features ${specs.join(', ')}.`

  if (form.floor_number) {
    const n = parseInt(form.floor_number)
    const suffix = n === 1 ? 'st' : n === 2 ? 'nd' : n === 3 ? 'rd' : 'th'
    desc += ` Located on the ${n}${suffix} floor`
    if (form.total_floors) desc += ` of a ${form.total_floors}-floor building`
    desc += '.'
  }

  if (form.year_built) desc += ` Built in ${form.year_built}.`

  if (selected.length) {
    desc += ` Amenities include: ${selected.map(f => f.name).join(', ')}.`
  }

  if (form.price) {
    desc += ` Priced at ${Number(form.price).toLocaleString('fr-MA')} MAD.`
  }

  desc += ' Contact us for more information or to schedule a viewing.'
  return desc
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionLabel({ children }) {
  return <p className="text-navy/40 text-xs font-semibold uppercase tracking-wider mb-3">{children}</p>
}

function InputWrap({ icon: Icon, children, className = '' }) {
  return (
    <div className={`relative ${className}`}>
      {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none z-10" />}
      {children}
    </div>
  )
}

const INPUT  = 'w-full pl-10 pr-4 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-navy/30 transition-all'

function StepIndicator({ step }) {
  return (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 z-0" />
      {STEPS.map((s, i) => {
        const done   = i < step
        const active = i === step
        return (
          <div key={i} className="relative z-10 flex flex-col items-center gap-1.5">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${done   ? 'bg-navy text-white'
              : active ? 'bg-navy text-white ring-4 ring-navy/20'
              :          'bg-gray-100 text-gray-400'}`}>
              {done ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold whitespace-nowrap hidden sm:block
              ${active || done ? 'text-navy' : 'text-gray-400'}`}>
              {s.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

// ─── Step 1: Basic Info ───────────────────────────────────────────────────────

function Step1({ form, setForm, categories, loading }) {
  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))
  return (
    <div className="space-y-6">
      {/* Property Name */}
      <div>
        <SectionLabel>Property Name <span className="normal-case font-normal text-navy/30">(optional)</span></SectionLabel>
        <InputWrap icon={Building2}>
          <input
            type="text"
            placeholder="e.g. Villa with Pool — Ain Diab"
            value={form.property_name}
            onChange={set('property_name')}
            className={INPUT}
          />
        </InputWrap>
      </div>

      {/* Property Type — from DB categories */}
      <div>
        <SectionLabel>Property Type <span className="text-gold">*</span></SectionLabel>
        {loading ? (
          <div className="flex items-center gap-2 text-navy/40 text-sm py-3">
            <Loader2 size={15} className="animate-spin" /> Loading types…
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setForm(prev => ({ ...prev, category_id: String(cat.id) }))}
                className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 text-center transition-all
                  ${form.category_id === String(cat.id)
                    ? 'border-navy bg-navy text-white'
                    : 'border-gray-100 text-navy/60 hover:border-navy/30 hover:bg-navy/5'}`}
              >
                <span className="text-xl leading-none">{getCategoryEmoji(cat.name)}</span>
                <span className="text-[10px] font-semibold leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Listing Intent */}
      <div>
        <SectionLabel>I want to… <span className="text-gold">*</span></SectionLabel>
        <div className="flex gap-3">
          {[['sale', 'Sell my property'], ['rent', 'Rent out my property']].map(([val, label]) => (
            <button
              key={val}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, listing_intent: val }))}
              className={`flex-1 py-3 rounded-2xl text-sm font-semibold border-2 transition-all
                ${form.listing_intent === val
                  ? 'border-navy bg-navy/5 text-navy'
                  : 'border-gray-100 text-navy/50 hover:border-navy/20'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 2: Location ─────────────────────────────────────────────────────────

function Step2({ form, setForm, cities, loadingCities, geocoding }) {
  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>Location <span className="text-gold">*</span></SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {/* City from DB */}
          <InputWrap icon={MapPin}>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none z-10" />
            {loadingCities ? (
              <div className={`${INPUT} flex items-center gap-2 text-navy/40`}>
                <Loader2 size={13} className="animate-spin ml-5" /> Loading cities…
              </div>
            ) : (
              <select
                value={form.city_id}
                onChange={set('city_id')}
                required
                className={`${INPUT} appearance-none pr-9`}
              >
                <option value="">Select city *</option>
                {cities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </InputWrap>

          {/* Neighborhood */}
          <InputWrap icon={MapPin}>
            {geocoding && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-navy font-semibold">auto-filling…</span>
            )}
            <input
              type="text"
              placeholder="Neighborhood / address"
              value={form.location}
              onChange={set('location')}
              className={INPUT}
            />
          </InputWrap>
        </div>

        {/* Map */}
        <div className="rounded-2xl border border-dashed border-navy/15 p-4 bg-surface/50">
          <p className="text-navy/40 text-xs font-semibold mb-2 flex items-center gap-1.5">
            <MapPin size={12} className="text-navy" />
            Pin your property on the map <span className="font-normal">(optional)</span>
          </p>
          <LocationPicker
            lat={form.latitude}
            lng={form.longitude}
            onChange={({ lat, lng }) => setForm(prev => ({ ...prev, latitude: lat, longitude: lng }))}
            height={260}
            restrictToMorocco
          />
        </div>
      </div>
    </div>
  )
}

// ─── Step 3: Property Details ─────────────────────────────────────────────────

function Step3({ form, setForm, features, loadingFeatures, facilities, loadingFacilities }) {
  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))

  // ── Features toggle ───────────────────────────────────────────────────────
  const toggleFeature = id => {
    const sid = String(id)
    setForm(prev => ({
      ...prev,
      feature_ids: prev.feature_ids.includes(sid)
        ? prev.feature_ids.filter(x => x !== sid)
        : [...prev.feature_ids, sid],
    }))
  }

  // ── Facilities: toggle + set distance ────────────────────────────────────
  const getFacilityEntry = id =>
    form.facility_distances.find(fd => String(fd.facility_id) === String(id))

  const toggleFacility = id => {
    const sid = String(id)
    setForm(prev => {
      const exists = prev.facility_distances.find(fd => String(fd.facility_id) === sid)
      return {
        ...prev,
        facility_distances: exists
          ? prev.facility_distances.filter(fd => String(fd.facility_id) !== sid)
          : [...prev.facility_distances, { facility_id: sid, distance: '' }],
      }
    })
  }

  const setFacilityDistance = (id, distance) => {
    const sid = String(id)
    setForm(prev => ({
      ...prev,
      facility_distances: prev.facility_distances.map(fd =>
        String(fd.facility_id) === sid ? { ...fd, distance } : fd
      ),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Specs */}
      <div>
        <SectionLabel>Property Specs</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <InputWrap icon={Bed}>
            <input type="number" placeholder="Bedrooms" min="0" value={form.bedrooms} onChange={set('bedrooms')} className={INPUT} />
          </InputWrap>
          <InputWrap icon={Bath}>
            <input type="number" placeholder="Bathrooms" min="0" value={form.bathrooms} onChange={set('bathrooms')} className={INPUT} />
          </InputWrap>
          <InputWrap icon={Maximize2}>
            <input type="number" placeholder="Size (m²)" min="0" value={form.size} onChange={set('size')} className={INPUT} />
          </InputWrap>
          <InputWrap icon={DollarSign}>
            <input type="number" placeholder="Price (MAD)" min="0" value={form.price} onChange={set('price')} className={INPUT} />
          </InputWrap>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <InputWrap icon={Layers}>
            <input type="number" placeholder="Floor no." min="0" value={form.floor_number} onChange={set('floor_number')} className={INPUT} />
          </InputWrap>
          <InputWrap icon={Building2}>
            <input type="number" placeholder="Total floors" min="0" value={form.total_floors} onChange={set('total_floors')} className={INPUT} />
          </InputWrap>
          <InputWrap icon={CalendarDays}>
            <input type="number" placeholder="Year built" min="1800" max={new Date().getFullYear()} value={form.year_built} onChange={set('year_built')} className={INPUT} />
          </InputWrap>
        </div>
      </div>

      {/* ── Features (from DB re_features) ─────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Features & Amenities</SectionLabel>
          {form.feature_ids.length > 0 && (
            <span className="text-[10px] font-bold text-navy bg-navy/10 px-2 py-0.5 rounded-full">
              {form.feature_ids.length} selected
            </span>
          )}
        </div>
        {loadingFeatures ? (
          <div className="flex items-center gap-2 text-navy/40 text-sm">
            <Loader2 size={14} className="animate-spin" /> Loading features…
          </div>
        ) : features.length === 0 ? (
          <p className="text-navy/30 text-sm">No features available.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {features.map(f => {
              const active = form.feature_ids.includes(String(f.id))
              return (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => toggleFeature(f.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition-all
                    ${active
                      ? 'border-navy bg-navy text-white'
                      : 'border-gray-200 text-navy/60 hover:border-navy/30 hover:bg-navy/5'}`}
                >
                  {f.icon && <i className={f.icon} style={{ fontSize: 13 }} />}
                  {active && !f.icon && <Check size={12} />}
                  {f.name}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Facilities (from DB re_facilities) — with distance ─────────────── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Nearby Facilities</SectionLabel>
          {form.facility_distances.length > 0 && (
            <span className="text-[10px] font-bold text-navy bg-navy/10 px-2 py-0.5 rounded-full">
              {form.facility_distances.length} selected
            </span>
          )}
        </div>
        <p className="text-xs text-navy/40 mb-3 -mt-1">
          Select what's nearby and optionally enter the distance
        </p>
        {loadingFacilities ? (
          <div className="flex items-center gap-2 text-navy/40 text-sm">
            <Loader2 size={14} className="animate-spin" /> Loading facilities…
          </div>
        ) : facilities.length === 0 ? (
          <p className="text-navy/30 text-sm">No facilities available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {facilities.map(fac => {
              const entry  = getFacilityEntry(fac.id)
              const active = !!entry
              return (
                <div
                  key={fac.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all
                    ${active
                      ? 'border-navy bg-navy/4'
                      : 'border-gray-100 bg-white hover:border-navy/20'}`}
                >
                  {/* Checkbox + icon + name */}
                  <button
                    type="button"
                    onClick={() => toggleFacility(fac.id)}
                    className="flex items-center gap-2.5 flex-1 min-w-0 text-left"
                  >
                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all
                      ${active ? 'border-navy bg-navy' : 'border-gray-300'}`}>
                      {active && <Check size={11} className="text-white" />}
                    </div>
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0
                      ${active ? 'bg-navy/10 text-navy' : 'bg-gray-100 text-gray-400'}`}>
                      {fac.icon
                        ? <i className={fac.icon} style={{ fontSize: 15 }} />
                        : <MapPin size={13} />}
                    </div>
                    <span className={`text-sm font-medium truncate ${active ? 'text-navy' : 'text-navy/60'}`}>
                      {fac.name}
                    </span>
                  </button>

                  {/* Distance input — only visible when selected */}
                  {active && (
                    <input
                      type="text"
                      placeholder="e.g. 500m"
                      value={entry.distance || ''}
                      onChange={e => setFacilityDistance(fac.id, e.target.value)}
                      onClick={e => e.stopPropagation()}
                      className="w-20 shrink-0 px-2 py-1 rounded-lg border border-navy/20 bg-white text-xs text-navy outline-none focus:ring-2 focus:ring-navy/20 text-center"
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Ownership & Legal */}
      <div>
        <SectionLabel>Ownership & Legal <span className="normal-case font-normal text-navy/30">(optional)</span></SectionLabel>
        <div className="space-y-3">
          <InputWrap icon={Hash}>
            <input
              type="text"
              placeholder="Titre Foncier number"
              value={form.titre_foncier}
              onChange={set('titre_foncier')}
              className={INPUT}
            />
          </InputWrap>
          <label className="flex items-center gap-3 px-4 py-3 bg-surface rounded-2xl cursor-pointer hover:bg-navy/5 transition-colors border border-dashed border-navy/15">
            <Upload size={16} className="text-navy/40 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-navy/70 font-medium">Upload ownership document</p>
              <p className="text-xs text-navy/35">PDF or image — optional</p>
            </div>
            <input type="file" accept="application/pdf,image/*" className="hidden" />
          </label>
          <p className="text-xs text-navy/35 px-1 flex items-start gap-1.5">
            <span className="mt-0.5">ℹ️</span>
            Providing this helps us verify and list your property faster
          </p>
        </div>
      </div>

      {/* Availability */}
      <div>
        <SectionLabel>Availability</SectionLabel>
        {form.listing_intent === 'sale' ? (
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm(prev => ({ ...prev, available_immediately: !prev.available_immediately }))}
                className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer shrink-0
                  ${form.available_immediately ? 'border-navy bg-navy' : 'border-gray-300'}`}
              >
                {form.available_immediately && <Check size={12} className="text-white" />}
              </div>
              <span className="text-sm text-navy/70">Available immediately</span>
            </label>
            {!form.available_immediately && (
              <InputWrap icon={CalendarDays}>
                <input type="date" value={form.available_from} onChange={set('available_from')} className={INPUT} />
              </InputWrap>
            )}
          </div>
        ) : (
          <InputWrap icon={CalendarDays}>
            <input type="date" placeholder="Available from" value={form.available_from} onChange={set('available_from')} className={INPUT} />
          </InputWrap>
        )}
      </div>
    </div>
  )
}

// ─── Step 4: Media & Contact ──────────────────────────────────────────────────

function Step4({ form, setForm, cities, categories, features, mediaPaths, setMediaPaths }) {
  const [generating, setGenerating] = useState(false)
  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const handleGenerate = async () => {
    setGenerating(true)
    await new Promise(r => setTimeout(r, 700))
    setForm(prev => ({
      ...prev,
      description: generateDescription(prev, cities, categories, features),
    }))
    setGenerating(false)
  }

  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <SectionLabel>Additional Details</SectionLabel>
        <div className="relative">
          <FileText size={15} className="absolute left-3.5 top-3.5 text-navy/30" />
          <textarea
            placeholder="Describe your property — features, condition, nearby amenities..."
            rows={4}
            value={form.description}
            onChange={set('description')}
            className="w-full pl-10 pr-4 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-navy/30 resize-none transition-all"
          />
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={generating}
          className="mt-2 flex items-center gap-2 px-4 py-2 rounded-xl bg-navy/5 hover:bg-navy/10 text-navy text-xs font-semibold transition-all disabled:opacity-50"
        >
          {generating ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
          {generating ? 'Generating…' : 'Generate description ✨'}
        </button>
      </div>

      {/* Photos & Videos */}
      <div>
        <SectionLabel>Photos & Videos <span className="normal-case font-normal text-navy/30">(optional)</span></SectionLabel>
        <ImageUploader
          images={mediaPaths}
          onChange={setMediaPaths}
          folder="media"
          allowVideo={true}
        />
        <p className="text-xs text-navy/35 mt-2 px-1">
          Logo watermark will be applied to all video frames automatically.
        </p>
        <div className="mt-3">
          <InputWrap icon={Link2}>
            <input type="url" placeholder="Add image URL (optional)" value={form.image_url} onChange={set('image_url')} className={INPUT} />
          </InputWrap>
        </div>
      </div>

      {/* Virtual Tour */}
      <div>
        <SectionLabel>Virtual Tour <span className="normal-case font-normal text-navy/30">(optional)</span></SectionLabel>
        <InputWrap icon={Eye}>
          <input type="url" placeholder="e.g. Matterport, YouTube 360, or any tour URL" value={form.virtual_tour} onChange={set('virtual_tour')} className={INPUT} />
        </InputWrap>
        <p className="text-xs text-navy/35 mt-1.5 px-1">Paste a Matterport, YouTube 360, or any 360° tour link</p>
      </div>

      {/* Contact Method */}
      <div>
        <SectionLabel>Preferred Contact Method</SectionLabel>
        <div className="flex gap-3 mb-4">
          {CONTACT_METHODS.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, contact_method: value }))}
              className={`flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl border-2 text-xs font-semibold transition-all
                ${form.contact_method === value
                  ? 'border-navy bg-navy text-white'
                  : 'border-gray-100 text-navy/60 hover:border-navy/30 hover:bg-navy/5'}`}
            >
              <Icon size={18} />
              {label}
            </button>
          ))}
        </div>

        <SectionLabel>Best Time to Reach</SectionLabel>
        <div className="flex gap-2">
          {TIME_SLOTS.map(slot => (
            <button
              key={slot}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, best_time: slot }))}
              className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all
                ${form.best_time === slot
                  ? 'border-navy bg-navy text-white'
                  : 'border-gray-200 text-navy/60 hover:border-navy/30'}`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ListProperty() {
  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      return saved ? { ...EMPTY_FORM, ...JSON.parse(saved) } : EMPTY_FORM
    } catch { return EMPTY_FORM }
  })

  const [step, setStep]             = useState(0)
  const [mediaPaths, setMediaPaths] = useState([])
  const [submitting, setSubmitting]   = useState(false)
  const [submitted, setSubmitted]     = useState(false)
  const [draftSaved, setDraftSaved]   = useState(false)
  const [navigating, setNavigating]   = useState(false)

  // DB data states
  const [cities,      setCities]      = useState([])
  const [categories,  setCategories]  = useState([])
  const [features,    setFeatures]    = useState([])
  const [facilities,  setFacilities]  = useState([])
  const [loadingCities,      setLoadingCities]      = useState(true)
  const [loadingCategories,  setLoadingCategories]  = useState(true)
  const [loadingFeatures,    setLoadingFeatures]    = useState(true)
  const [loadingFacilities,  setLoadingFacilities]  = useState(true)
  const [geocoding, setGeocoding] = useState(false)

  const pendingSubmitRef = useRef(false)
  const doSubmitRef      = useRef(null)
  const prevLatLngRef    = useRef('')
  const prevCityIdRef    = useRef('')
  const draftTimerRef    = useRef(null)

  const { toast, show: showToast, hide: hideToast } = useToast()
  const { isAuthenticated, user, loading: authLoading } = useUserAuth()
  const { openAuthModal } = useAuthModal()

  // ── Fetch DB data in parallel ──────────────────────────────────────────────
  useEffect(() => {
    citiesApi.list()
      .then(res => setCities(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingCities(false))

    categoriesApi.list()
      .then(res => setCategories(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingCategories(false))

    featuresApi.all()
      .then(res => setFeatures(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingFeatures(false))

    facilitiesApi.all()
      .then(res => setFacilities(res.data || []))
      .catch(() => {})
      .finally(() => setLoadingFacilities(false))
  }, [])

  // ── Auto-save draft ────────────────────────────────────────────────────────
  useEffect(() => {
    if (draftTimerRef.current) clearTimeout(draftTimerRef.current)
    draftTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form))
        setDraftSaved(true)
        setTimeout(() => setDraftSaved(false), 2000)
      } catch {}
    }, 800)
    return () => clearTimeout(draftTimerRef.current)
  }, [form])

  // ── Pending submit after auth ──────────────────────────────────────────────
  useEffect(() => {
    if (isAuthenticated && user && pendingSubmitRef.current) {
      pendingSubmitRef.current = false
      setTimeout(() => doSubmitRef.current?.(), 50)
    }
  }, [isAuthenticated, user])

  // ── Map pin → city (reverse geocode) ──────────────────────────────────────
  useEffect(() => {
    const key = `${form.latitude},${form.longitude}`
    if (!form.latitude || !form.longitude || key === prevLatLngRef.current) return
    prevLatLngRef.current = key
    setGeocoding(true)
    fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${form.latitude}&lon=${form.longitude}&format=json&accept-language=en`,
      { headers: { Accept: 'application/json' } }
    )
      .then(r => r.json())
      .then(data => {
        const addr = data.address || {}
        const neighborhood = addr.suburb || addr.neighbourhood || addr.road || addr.village || ''
        const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim()
        const candidates = [
          addr.city, addr.town, addr.municipality, addr.city_district,
          addr.village, addr.county, addr.state_district, addr.province, addr.state,
        ].filter(Boolean).map(norm)
        const matched = cities.find(c => {
          const cn = norm(c.name)
          return candidates.some(cand => cand === cn || cand.includes(cn) || cn.includes(cand))
        })
        setForm(prev => {
          const newId = matched ? String(matched.id) : ''
          prevCityIdRef.current = newId
          return { ...prev, location: neighborhood || prev.location, city_id: newId }
        })
      })
      .catch(() => {})
      .finally(() => setGeocoding(false))
  }, [form.latitude, form.longitude, cities])

  // ── City dropdown → map pan (forward geocode) ─────────────────────────────
  useEffect(() => {
    if (!form.city_id || form.city_id === prevCityIdRef.current) return
    prevCityIdRef.current = form.city_id
    const cityName = cities.find(c => String(c.id) === String(form.city_id))?.name
    if (!cityName) return
    fetch(
      `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(cityName)}&country=Morocco&format=json&limit=1&accept-language=en`,
      { headers: { Accept: 'application/json' } }
    )
      .then(r => r.json())
      .then(data => {
        const hit = data?.[0]
        if (hit?.lat && hit?.lon) {
          prevLatLngRef.current = `${hit.lat},${hit.lon}`
          setForm(prev => ({ ...prev, latitude: hit.lat, longitude: hit.lon }))
        }
      })
      .catch(() => {})
  }, [form.city_id, cities])

  // ── Submit ─────────────────────────────────────────────────────────────────
  const doSubmit = useCallback(async () => {
    const selectedCity = cities.find(c => String(c.id) === String(form.city_id))
    if (!selectedCity) { showToast('Please select a city', 'error'); return }

    setSubmitting(true)
    try {
      await userListingsApi.store({
        name:            form.property_name.trim() || `${selectedCity.name} — ${form.listing_intent === 'sale' ? 'For Sale' : 'For Rent'}`,
        type:            form.listing_intent,
        location:        form.location || '',
        city_id:         parseInt(form.city_id),
        category_id:     form.category_id ? parseInt(form.category_id) : null,
        feature_ids:          form.feature_ids.map(id => parseInt(id)).filter(Boolean),
        facility_distances:   form.facility_distances
          .filter(fd => fd.facility_id)
          .map(fd => ({ facility_id: parseInt(fd.facility_id), distance: fd.distance || null })),
        number_bedroom:  form.bedrooms     ? parseInt(form.bedrooms)    : null,
        number_bathroom: form.bathrooms    ? parseInt(form.bathrooms)   : null,
        number_floor:    form.floor_number ? parseInt(form.floor_number): null,
        square:          form.size         ? parseFloat(form.size)      : null,
        price:           form.price        ? parseFloat(form.price)     : null,
        description:     form.description  || '',
        latitude:        form.latitude     || null,
        longitude:       form.longitude    || null,
        images:          mediaPaths,
        total_floors:    form.total_floors  ? parseInt(form.total_floors) : null,
        year_built:      form.year_built    ? parseInt(form.year_built)   : null,
        titre_foncier:   form.titre_foncier || null,
        available_from:  (!form.available_immediately && form.available_from) ? form.available_from : null,
        virtual_tour:    form.virtual_tour  || null,
        contact_method:  form.contact_method,
        best_time:       form.best_time,
      })
      localStorage.removeItem(DRAFT_KEY)
      setSubmitted(true)
    } catch {
      showToast('Failed to submit. Please try again or call us directly.', 'error')
    } finally {
      setSubmitting(false)
    }
  }, [user, form, mediaPaths, cities])

  useEffect(() => { doSubmitRef.current = doSubmit }, [doSubmit])

  const handleNext = () => {
    if (navigating) return
    if (step === 0 && !form.category_id) {
      showToast('Please select a property type', 'error'); return
    }
    if (step === 1 && !form.city_id) {
      showToast('Please select a city', 'error'); return
    }
    setNavigating(true)
    setStep(s => Math.min(s + 1, STEPS.length - 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setNavigating(false), 600)
  }

  const handleBack = () => {
    if (navigating) return
    setNavigating(true)
    setStep(s => Math.max(s - 1, 0))
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setTimeout(() => setNavigating(false), 600)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (step !== STEPS.length - 1) return
    if (!isAuthenticated) {
      pendingSubmitRef.current = true
      openAuthModal()
      return
    }
    await doSubmit()
  }

  const resetAll = () => {
    setSubmitted(false)
    setForm(EMPTY_FORM)
    setMediaPaths([])
    setStep(0)
    localStorage.removeItem(DRAFT_KEY)
  }

  const cityName = cities.find(c => String(c.id) === String(form.city_id))?.name || ''

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      {toast && <Toast message={toast.message} type={toast.type} onClose={hideToast} />}

      {/* Draft saved toast */}
      {draftSaved && (
        <div className="fixed bottom-6 left-6 z-[9998] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white shadow-card border border-navy/10 text-xs font-semibold text-navy/60 animate-fade-in pointer-events-none">
          <Check size={13} className="text-emerald-500" /> Your progress is saved
        </div>
      )}

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-6 bg-navy overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1600&q=80)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute right-0 top-0 bottom-0 flex items-center pr-8 pointer-events-none select-none">
          <span className="text-[180px] font-black text-white/5 leading-none">74</span>
        </div>
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

      {/* Body */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Sidebar */}
          <div className="space-y-6 lg:order-1 order-2">
            <div className="bg-white rounded-3xl p-6 shadow-card">
              <h3 className="text-navy font-bold text-lg mb-5">Why List with Mahalo?</h3>
              <div className="space-y-3">
                {[
                  'Listed within 24 hours',
                  'Verified badge on your listing',
                  'Dedicated agent support',
                  'Free professional consultation',
                ].map(text => (
                  <div key={text} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-gold shrink-0" />
                    <span className="text-navy/70 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-navy rounded-3xl p-6 shadow-card">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                <Phone size={18} className="text-white" />
              </div>
              <h3 className="text-white font-bold mb-2">Prefer to talk?</h3>
              <p className="text-white/60 text-sm mb-4">Our team is available 7 days a week to help you list your property.</p>
              <a href="tel:+212600000000" className="w-full flex items-center gap-2 justify-center py-2.5 px-4 rounded-2xl bg-white text-navy text-sm font-bold hover:bg-white/90 transition-colors">
                <Phone size={14} /> Call Us Now
              </a>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center">
                  <Building2 size={18} className="text-navy" />
                </div>
                <div>
                  <div className="text-navy font-bold text-sm">15,000+ Listings</div>
                  <div className="text-navy/45 text-xs">Already on our platform</div>
                </div>
              </div>
              <p className="text-navy/55 text-xs leading-relaxed">
                Join thousands of homeowners, developers, and investors who trust Mahalo to reach the right buyers.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 lg:order-2 order-1">
            {submitted ? (
              <div className="bg-white rounded-3xl shadow-card p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={36} className="text-emerald-500" />
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-600 text-xs font-bold uppercase tracking-wide mb-5">
                  Pending Admin Review
                </div>
                <h2 className="text-2xl font-bold text-navy mb-3">Listing Submitted!</h2>
                <p className="text-navy/60 mb-2">
                  Your property listing{cityName ? ` in ${cityName}` : ''} has been submitted for review.
                </p>
                <p className="text-navy/40 text-sm mb-2">
                  An admin will review it within 24 hours. Once approved, it will be visible to all visitors.
                </p>
                <p className="text-navy/40 text-sm mb-8">
                  Track the status in your{' '}
                  <Link to="/profile" className="text-navy font-semibold hover:underline">Profile → My Listings</Link>.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link to="/profile" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-navy text-white text-sm font-bold hover:bg-navy-light transition-colors">
                    View My Listings <ArrowRight size={15} />
                  </Link>
                  <button onClick={resetAll} className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-navy/20 text-navy text-sm font-bold hover:bg-navy/5 transition-colors">
                    <RotateCcw size={14} /> Submit Another
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-card p-8">
                <h2 className="text-xl font-bold text-navy mb-1">Property Details</h2>
                <p className="text-navy/45 text-sm mb-6">
                  Fill in as many details as you can — it helps us match you with the right agent.
                </p>

                <StepIndicator step={step} />

                {/* Auth block */}
                {isAuthenticated && user ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl mb-6">
                    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <User size={14} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-emerald-700">Submitting as</p>
                      <p className="text-sm font-medium text-navy truncate">
                        {user.name}{user.phone ? ` · ${user.phone}` : ''}
                      </p>
                    </div>
                    <CheckCircle size={16} className="text-emerald-500 shrink-0 ml-auto" />
                  </div>
                ) : (
                  <div className="flex items-center gap-4 px-4 py-3.5 bg-navy/4 border border-navy/10 rounded-2xl mb-6">
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
                      className="shrink-0 px-4 py-1.5 text-xs font-semibold text-white bg-navy rounded-xl hover:bg-navy-light transition-colors"
                    >
                      Sign in
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="min-h-[280px]">
                    {step === 0 && (
                      <Step1
                        form={form} setForm={setForm}
                        categories={categories} loading={loadingCategories}
                      />
                    )}
                    {step === 1 && (
                      <Step2
                        form={form} setForm={setForm}
                        cities={cities} loadingCities={loadingCities}
                        geocoding={geocoding}
                      />
                    )}
                    {step === 2 && (
                      <Step3
                        form={form} setForm={setForm}
                        features={features} loadingFeatures={loadingFeatures}
                        facilities={facilities} loadingFacilities={loadingFacilities}
                      />
                    )}
                    {step === 3 && (
                      <Step4
                        form={form} setForm={setForm}
                        cities={cities} categories={categories} features={features}
                        mediaPaths={mediaPaths} setMediaPaths={setMediaPaths}
                      />
                    )}
                  </div>

                  {/* Navigation */}
                  <div className="flex gap-3 mt-8 pt-6 border-t border-gray-100">
                    {step > 0 && (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-navy/20 text-navy text-sm font-bold hover:bg-navy/5 transition-colors"
                      >
                        <ArrowLeft size={16} /> Back
                      </button>
                    )}
                    <div className="flex-1" />
                    {step < STEPS.length - 1 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={navigating}
                        className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-navy text-white text-sm font-bold hover:bg-navy-light transition-colors disabled:opacity-60"
                      >
                        Next <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting || authLoading || navigating}
                        className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-navy text-white text-sm font-bold hover:bg-navy-light transition-colors disabled:opacity-60"
                      >
                        {submitting
                          ? <><Loader2 size={16} className="animate-spin" /> Submitting…</>
                          : <>Submit Listing Request <ArrowRight size={16} /></>}
                      </button>
                    )}
                  </div>

                  {!isAuthenticated && step === STEPS.length - 1 && (
                    <p className="text-center text-navy/30 text-xs mt-3">
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
