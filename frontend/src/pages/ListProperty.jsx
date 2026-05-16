import { useState, useRef, useCallback, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
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
  property_name:      '',
  category_id:        '',
  listing_intent:     'sale',
  city_id:            '',
  location:           '',
  latitude:           '',
  longitude:          '',
  bedrooms:           '',
  bathrooms:          '',
  size:               '',
  price:              '',
  floor_number:       '',
  total_floors:       '',
  year_built:         '',
  feature_ids:        [],
  facility_distances: [],
  titre_foncier:      '',
  available_immediately: false,
  available_from:     '',
  description:        '',
  image_url:          '',
  virtual_tour:       '',
  contact_method:     'whatsapp',
  best_time:          'Morning',
}

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
  if (selected.length) desc += ` Amenities include: ${selected.map(f => f.name).join(', ')}.`
  if (form.price) desc += ` Priced at ${Number(form.price).toLocaleString('fr-MA')} MAD.`
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

const INPUT = 'w-full pl-10 pr-4 py-3 bg-surface rounded-2xl text-sm text-navy outline-none focus:ring-2 focus:ring-navy/30 transition-all'

function StepIndicator({ step, steps }) {
  return (
    <div className="flex items-center justify-between mb-8 relative">
      <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-100 z-0" />
      {steps.map((s, i) => {
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

function Step1({ form, setForm, categories, loading, t }) {
  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))
  return (
    <div className="space-y-6">
      {/* Property Name */}
      <div>
        <SectionLabel>{t('listProperty.propertyName')} <span className="normal-case font-normal text-navy/30">({t('listProperty.propertyNameOptional')})</span></SectionLabel>
        <InputWrap icon={Building2}>
          <input
            type="text"
            placeholder={t('listProperty.propertyNamePlaceholder')}
            value={form.property_name}
            onChange={set('property_name')}
            className={INPUT}
          />
        </InputWrap>
      </div>

      {/* Property Type — from DB categories */}
      <div>
        <SectionLabel>{t('listProperty.propertyType')} <span className="text-gold">*</span></SectionLabel>
        {loading ? (
          <div className="flex items-center gap-2 text-navy/40 text-sm py-3">
            <Loader2 size={15} className="animate-spin" /> {t('listProperty.loadingTypes')}
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
        <SectionLabel>{t('listProperty.iWantTo')} <span className="text-gold">*</span></SectionLabel>
        <div className="flex gap-3">
          {[['sale', t('listProperty.sellProperty')], ['rent', t('listProperty.rentProperty')]].map(([val, label]) => (
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

function Step2({ form, setForm, cities, loadingCities, geocoding, t }) {
  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))
  return (
    <div className="space-y-6">
      <div>
        <SectionLabel>{t('listProperty.location')} <span className="text-gold">*</span></SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          {/* City from DB */}
          <InputWrap icon={MapPin}>
            <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none z-10" />
            {loadingCities ? (
              <div className={`${INPUT} flex items-center gap-2 text-navy/40`}>
                <Loader2 size={13} className="animate-spin ml-5" /> {t('listProperty.loadingCities')}
              </div>
            ) : (
              <select
                value={form.city_id}
                onChange={set('city_id')}
                required
                className={`${INPUT} appearance-none pr-9`}
              >
                <option value="">{t('listProperty.selectCity')}</option>
                {cities.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            )}
          </InputWrap>

          {/* Neighborhood */}
          <InputWrap icon={MapPin}>
            {geocoding && (
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] text-navy font-semibold">{t('listProperty.autoFilling')}</span>
            )}
            <input
              type="text"
              placeholder={t('listProperty.neighborhoodAddress')}
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
            {t('listProperty.pinOnMap')} <span className="font-normal">({t('listProperty.propertyNameOptional')})</span>
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

function Step3({ form, setForm, features, loadingFeatures, facilities, loadingFacilities, t }) {
  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const toggleFeature = id => {
    const sid = String(id)
    setForm(prev => ({
      ...prev,
      feature_ids: prev.feature_ids.includes(sid)
        ? prev.feature_ids.filter(x => x !== sid)
        : [...prev.feature_ids, sid],
    }))
  }

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
        <SectionLabel>{t('listProperty.propertySpecs')}</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <InputWrap icon={Bed}>
            <input type="number" placeholder={t('listProperty.bedrooms')} min="0" value={form.bedrooms} onChange={set('bedrooms')} className={INPUT} />
          </InputWrap>
          <InputWrap icon={Bath}>
            <input type="number" placeholder={t('listProperty.bathrooms')} min="0" value={form.bathrooms} onChange={set('bathrooms')} className={INPUT} />
          </InputWrap>
          <InputWrap icon={Maximize2}>
            <input type="number" placeholder={t('listProperty.sizeSqm')} min="0" value={form.size} onChange={set('size')} className={INPUT} />
          </InputWrap>
          <InputWrap icon={DollarSign}>
            <input type="number" placeholder={t('listProperty.priceMad')} min="0" value={form.price} onChange={set('price')} className={INPUT} />
          </InputWrap>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <InputWrap icon={Layers}>
            <input type="number" placeholder={t('listProperty.floorNo')} min="0" value={form.floor_number} onChange={set('floor_number')} className={INPUT} />
          </InputWrap>
          <InputWrap icon={Building2}>
            <input type="number" placeholder={t('listProperty.totalFloors')} min="0" value={form.total_floors} onChange={set('total_floors')} className={INPUT} />
          </InputWrap>
          <InputWrap icon={CalendarDays}>
            <input type="number" placeholder={t('listProperty.yearBuilt')} min="1800" max={new Date().getFullYear()} value={form.year_built} onChange={set('year_built')} className={INPUT} />
          </InputWrap>
        </div>
      </div>

      {/* Features */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>{t('listProperty.featuresAmenities')}</SectionLabel>
          {form.feature_ids.length > 0 && (
            <span className="text-[10px] font-bold text-navy bg-navy/10 px-2 py-0.5 rounded-full">
              {form.feature_ids.length} {t('listProperty.selected')}
            </span>
          )}
        </div>
        {loadingFeatures ? (
          <div className="flex items-center gap-2 text-navy/40 text-sm">
            <Loader2 size={14} className="animate-spin" /> {t('listProperty.loadingFeatures')}
          </div>
        ) : features.length === 0 ? (
          <p className="text-navy/30 text-sm">{t('listProperty.noFeaturesAvailable')}</p>
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

      {/* Facilities */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>{t('listProperty.nearbyFacilities')}</SectionLabel>
          {form.facility_distances.length > 0 && (
            <span className="text-[10px] font-bold text-navy bg-navy/10 px-2 py-0.5 rounded-full">
              {form.facility_distances.length} {t('listProperty.selected')}
            </span>
          )}
        </div>
        <p className="text-xs text-navy/40 mb-3 -mt-1">{t('listProperty.selectNearby')}</p>
        {loadingFacilities ? (
          <div className="flex items-center gap-2 text-navy/40 text-sm">
            <Loader2 size={14} className="animate-spin" /> {t('listProperty.loadingFacilities')}
          </div>
        ) : facilities.length === 0 ? (
          <p className="text-navy/30 text-sm">{t('listProperty.noFacilitiesAvailable')}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {facilities.map(fac => {
              const entry  = getFacilityEntry(fac.id)
              const active = !!entry
              return (
                <div
                  key={fac.id}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border transition-all
                    ${active ? 'border-navy bg-navy/4' : 'border-gray-100 bg-white hover:border-navy/20'}`}
                >
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
                      {fac.icon ? <i className={fac.icon} style={{ fontSize: 15 }} /> : <MapPin size={13} />}
                    </div>
                    <span className={`text-sm font-medium truncate ${active ? 'text-navy' : 'text-navy/60'}`}>
                      {fac.name}
                    </span>
                  </button>
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
        <SectionLabel>{t('listProperty.ownershipLegal')} <span className="normal-case font-normal text-navy/30">({t('listProperty.propertyNameOptional')})</span></SectionLabel>
        <div className="space-y-3">
          <InputWrap icon={Hash}>
            <input
              type="text"
              placeholder={t('listProperty.tfNumber')}
              value={form.titre_foncier}
              onChange={set('titre_foncier')}
              className={INPUT}
            />
          </InputWrap>
          <label className="flex items-center gap-3 px-4 py-3 bg-surface rounded-2xl cursor-pointer hover:bg-navy/5 transition-colors border border-dashed border-navy/15">
            <Upload size={16} className="text-navy/40 shrink-0" />
            <div className="flex-1">
              <p className="text-sm text-navy/70 font-medium">{t('listProperty.documentUpload')}</p>
              <p className="text-xs text-navy/35">{t('listProperty.documentUploadDesc')}</p>
            </div>
            <input type="file" accept="application/pdf,image/*" className="hidden" />
          </label>
          <p className="text-xs text-navy/35 px-1 flex items-start gap-1.5">
            <span className="mt-0.5">ℹ️</span>
            {t('listProperty.documentHelp')}
          </p>
        </div>
      </div>

      {/* Availability */}
      <div>
        <SectionLabel>{t('listProperty.availability')}</SectionLabel>
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
              <span className="text-sm text-navy/70">{t('listProperty.availableImmediately')}</span>
            </label>
            {!form.available_immediately && (
              <InputWrap icon={CalendarDays}>
                <input type="date" value={form.available_from} onChange={set('available_from')} className={INPUT} />
              </InputWrap>
            )}
          </div>
        ) : (
          <InputWrap icon={CalendarDays}>
            <input type="date" value={form.available_from} onChange={set('available_from')} className={INPUT} />
          </InputWrap>
        )}
      </div>
    </div>
  )
}

// ─── Step 4: Media & Contact ──────────────────────────────────────────────────

function Step4({ form, setForm, cities, categories, features, mediaPaths, setMediaPaths, t }) {
  const [generating, setGenerating] = useState(false)
  const set = f => e => setForm(prev => ({ ...prev, [f]: e.target.value }))

  const CONTACT_METHODS = [
    { value: 'phone',    label: t('listProperty.phoneCall'), icon: PhoneCall },
    { value: 'whatsapp', label: t('listProperty.whatsapp'),  icon: MessageCircle },
    { value: 'email',    label: t('listProperty.email'),     icon: Mail },
  ]

  const TIME_SLOTS = [
    { value: 'Morning',   label: t('listProperty.morning') },
    { value: 'Afternoon', label: t('listProperty.afternoon') },
    { value: 'Evening',   label: t('listProperty.evening') },
  ]

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
        <SectionLabel>{t('listProperty.additionalDetails')}</SectionLabel>
        <div className="relative">
          <FileText size={15} className="absolute left-3.5 top-3.5 text-navy/30" />
          <textarea
            placeholder={t('listProperty.descPlaceholder')}
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
          {generating ? t('listProperty.generating') : t('listProperty.generateDesc')}
        </button>
      </div>

      {/* Photos & Videos */}
      <div>
        <SectionLabel>{t('listProperty.photosVideos')} <span className="text-gold">*</span></SectionLabel>
        <ImageUploader
          images={mediaPaths}
          onChange={setMediaPaths}
          folder="media"
          allowVideo={true}
        />
        <p className="text-xs text-navy/35 mt-2 px-1">{t('listProperty.logoWatermark')}</p>
        <div className="mt-3">
          <InputWrap icon={Link2}>
            <input type="url" placeholder={t('listProperty.addImageUrl')} value={form.image_url} onChange={set('image_url')} className={INPUT} />
          </InputWrap>
        </div>
      </div>

      {/* Virtual Tour */}
      <div>
        <SectionLabel>{t('listProperty.virtualTour')} <span className="normal-case font-normal text-navy/30">({t('listProperty.virtualTourOptional')})</span></SectionLabel>
        <InputWrap icon={Eye}>
          <input type="url" placeholder={t('listProperty.virtualTourPlaceholder')} value={form.virtual_tour} onChange={set('virtual_tour')} className={INPUT} />
        </InputWrap>
        <p className="text-xs text-navy/35 mt-1.5 px-1">{t('listProperty.virtualTourHint')}</p>
      </div>

      {/* Contact Method */}
      <div>
        <SectionLabel>{t('listProperty.preferredContact')}</SectionLabel>
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

        <SectionLabel>{t('listProperty.bestTime')}</SectionLabel>
        <div className="flex gap-2">
          {TIME_SLOTS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setForm(prev => ({ ...prev, best_time: value }))}
              className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-all
                ${form.best_time === value
                  ? 'border-navy bg-navy text-white'
                  : 'border-gray-200 text-navy/60 hover:border-navy/30'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ListProperty() {
  const { t } = useTranslation()

  const STEPS = [
    { label: t('listProperty.step1') },
    { label: t('listProperty.step2') },
    { label: t('listProperty.step3') },
    { label: t('listProperty.step4') },
  ]

  const [form, setForm] = useState(() => {
    try {
      const saved = localStorage.getItem(DRAFT_KEY)
      return saved ? { ...EMPTY_FORM, ...JSON.parse(saved) } : EMPTY_FORM
    } catch { return EMPTY_FORM }
  })

  const [step, setStep]             = useState(0)
  const [mediaPaths, setMediaPaths] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [draftSaved, setDraftSaved] = useState(false)
  const [navigating, setNavigating] = useState(false)

  const [cities,     setCities]     = useState([])
  const [categories, setCategories] = useState([])
  const [features,   setFeatures]   = useState([])
  const [facilities, setFacilities] = useState([])
  const [loadingCities,     setLoadingCities]     = useState(true)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [loadingFeatures,   setLoadingFeatures]   = useState(true)
  const [loadingFacilities, setLoadingFacilities] = useState(true)
  const [geocoding, setGeocoding] = useState(false)

  const pendingSubmitRef = useRef(false)
  const doSubmitRef      = useRef(null)
  const prevLatLngRef    = useRef('')
  const prevCityIdRef    = useRef('')
  const draftTimerRef    = useRef(null)

  const { toast, show: showToast, hide: hideToast } = useToast()
  const { isAuthenticated, user, loading: authLoading } = useUserAuth()
  const { openAuthModal } = useAuthModal()

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

  useEffect(() => {
    if (isAuthenticated && user && pendingSubmitRef.current) {
      pendingSubmitRef.current = false
      setTimeout(() => doSubmitRef.current?.(), 50)
    }
  }, [isAuthenticated, user])

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

  const doSubmit = useCallback(async () => {
    const selectedCity = cities.find(c => String(c.id) === String(form.city_id))
    if (!selectedCity) { showToast(t('listProperty.selectCityError'), 'error'); return }

    setSubmitting(true)
    try {
      await userListingsApi.store({
        name:               form.property_name.trim() || `${selectedCity.name} — ${form.listing_intent === 'sale' ? 'For Sale' : 'For Rent'}`,
        type:               form.listing_intent,
        location:           form.location || '',
        city_id:            parseInt(form.city_id),
        category_id:        form.category_id ? parseInt(form.category_id) : null,
        feature_ids:        form.feature_ids.map(id => parseInt(id)).filter(Boolean),
        facility_distances: form.facility_distances
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
      showToast(t('listProperty.failedSubmit'), 'error')
    } finally {
      setSubmitting(false)
    }
  }, [user, form, mediaPaths, cities, t])

  useEffect(() => { doSubmitRef.current = doSubmit }, [doSubmit])

  const handleNext = () => {
    if (navigating) return
    if (step === 0 && !form.category_id) {
      showToast(t('listProperty.selectPropertyTypeError'), 'error'); return
    }
    if (step === 1 && !form.city_id) {
      showToast(t('listProperty.selectCityError'), 'error'); return
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
    if (mediaPaths.length === 0) {
      showToast(t('listProperty.uploadPhotoError'), 'error')
      return
    }
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
          <Check size={13} className="text-emerald-500" /> {t('listProperty.draftSaved')}
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
            <Home size={12} /> {t('listProperty.heroBadge')}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('listProperty.heroTitle1')}<br />
            <span className="text-gold">{t('listProperty.heroTitle2')}</span>
          </h1>
          <p className="text-white/65 text-base max-w-xl mx-auto">
            {t('listProperty.heroDesc')}
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Sidebar */}
          <div className="space-y-6 lg:order-1 order-2">
            <div className="bg-white rounded-3xl p-6 shadow-card">
              <h3 className="text-navy font-bold text-lg mb-5">{t('listProperty.whyList')}</h3>
              <div className="space-y-3">
                {[
                  t('listProperty.listed24h'),
                  t('listProperty.verifiedBadge'),
                  t('listProperty.agentSupport'),
                  t('listProperty.freeConsult'),
                ].map(text => (
                  <div key={text} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-gold shrink-0" />
                    <span className="text-navy/70 text-sm">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-navy rounded-3xl p-6 text-white">
              <p className="font-bold text-lg mb-1">{t('listProperty.preferTalk')}</p>
              <p className="text-white/60 text-sm mb-4">{t('listProperty.teamAvailable')}</p>
              <a href="tel:+212522000000"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-gold hover:bg-gold-dark text-white text-sm font-bold transition-colors">
                <Phone size={15} /> {t('listProperty.callNow')}
              </a>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-card">
              <div className="text-3xl font-black text-navy mb-1">{t('listProperty.listingsCount')}</div>
              <p className="text-navy/50 text-sm mb-3">{t('listProperty.alreadyOnPlatform')}</p>
              <p className="text-navy/60 text-sm leading-relaxed">{t('listProperty.joinThousands')}</p>
            </div>
          </div>

          {/* Main form card */}
          <div className="lg:col-span-2 lg:order-2 order-1">
            {submitted ? (
              <div className="bg-white rounded-3xl p-8 shadow-card text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} className="text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-navy mb-2">{t('listProperty.listingSubmitted')}</h2>
                <p className="text-navy/60 mb-1">
                  {t('listProperty.listingInCity', { city: cityName ? ` (${cityName})` : '' })}
                </p>
                <p className="text-navy/50 text-sm mb-2">{t('listProperty.adminReview')}</p>
                <p className="text-navy/40 text-sm mb-6">
                  {t('listProperty.trackStatus')}{' '}
                  <Link to="/profile" className="text-gold font-semibold hover:underline">{t('listProperty.profileListings')}</Link>.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link to="/profile"
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-navy text-white text-sm font-bold hover:bg-navy-light transition-colors">
                    {t('listProperty.viewMyListings')}
                  </Link>
                  <button onClick={resetAll}
                    className="flex items-center gap-2 px-5 py-3 rounded-2xl border-2 border-navy/20 text-navy text-sm font-bold hover:bg-navy/5 transition-colors">
                    <RotateCcw size={15} /> {t('listProperty.submitAnother')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-8 shadow-card">
                {/* Step indicator */}
                <StepIndicator step={step} steps={STEPS} />

                {/* Property Details header */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-navy">{t('listProperty.propertyDetails')}</h2>
                  <p className="text-sm text-navy/45 mt-0.5">{t('listProperty.fillDetails')}</p>
                </div>

                {/* Auth banner */}
                {isAuthenticated ? (
                  <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-100 rounded-2xl mb-6">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                      <User size={14} className="text-emerald-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-emerald-700 truncate">
                        {t('listProperty.submittingAs')} <strong>{user?.name}</strong>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4 px-4 py-3.5 bg-navy/4 border border-navy/10 rounded-2xl mb-6">
                    <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center shrink-0">
                      <LogIn size={14} className="text-navy/60" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy/80">{t('listProperty.signInToSubmit')}</p>
                      <p className="text-xs text-navy/40">{t('listProperty.contactFromAccount')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => openAuthModal()}
                      className="shrink-0 px-4 py-1.5 text-xs font-semibold text-white bg-navy rounded-xl hover:bg-navy-light transition-colors"
                    >
                      {t('listProperty.signIn')}
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="min-h-[280px]">
                    {step === 0 && (
                      <Step1
                        form={form} setForm={setForm}
                        categories={categories} loading={loadingCategories}
                        t={t}
                      />
                    )}
                    {step === 1 && (
                      <Step2
                        form={form} setForm={setForm}
                        cities={cities} loadingCities={loadingCities}
                        geocoding={geocoding}
                        t={t}
                      />
                    )}
                    {step === 2 && (
                      <Step3
                        form={form} setForm={setForm}
                        features={features} loadingFeatures={loadingFeatures}
                        facilities={facilities} loadingFacilities={loadingFacilities}
                        t={t}
                      />
                    )}
                    {step === 3 && (
                      <Step4
                        form={form} setForm={setForm}
                        cities={cities} categories={categories} features={features}
                        mediaPaths={mediaPaths} setMediaPaths={setMediaPaths}
                        t={t}
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
                        <ArrowLeft size={16} /> {t('listProperty.back')}
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
                        {t('listProperty.next')} <ArrowRight size={16} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting || authLoading || navigating}
                        className="flex items-center gap-2 px-7 py-3 rounded-2xl bg-navy text-white text-sm font-bold hover:bg-navy-light transition-colors disabled:opacity-60"
                      >
                        {submitting
                          ? <><Loader2 size={16} className="animate-spin" /> {t('listProperty.submitting')}</>
                          : <>{t('listProperty.submitListing')} <ArrowRight size={16} /></>}
                      </button>
                    )}
                  </div>

                  {!isAuthenticated && step === STEPS.length - 1 && (
                    <p className="text-center text-navy/30 text-xs mt-3">
                      {t('listProperty.signInNote')}
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
