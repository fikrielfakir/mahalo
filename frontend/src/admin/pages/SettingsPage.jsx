import { useEffect, useState, useRef, useCallback } from 'react'
import { adminSettings } from '../api/adminApi'
import { PageHeader, Btn } from '../components/DataTable'
import { FormField, Input, Textarea } from '../components/Modal'
import {
  Save, Globe, Mail, Phone, Instagram, Facebook, Twitter, MapPin,
  CheckCircle, Palette, Upload, Image, Droplets, Eye, EyeOff,
  Server, Send, Lock, AlertCircle, KeyRound, Copy, ExternalLink,
  Wrench, Clock, FileText, Shield, Info, RefreshCw, Map, Tag, Cookie,
  Languages, Bot, ChevronDown, Smartphone,
} from 'lucide-react'

const TABS = [
  { id: 'general',    label: 'General',     icon: Globe },
  { id: 'theme',      label: 'Theme',       icon: Palette },
  { id: 'watermark',  label: 'Watermark',   icon: Droplets },
  { id: 'contact',    label: 'Contact',     icon: Mail },
  { id: 'social',     label: 'Social',      icon: Instagram },
  { id: 'seo',        label: 'SEO',         icon: Globe },
  { id: 'mail',       label: 'Mail / SMTP', icon: Server  },
  { id: 'google',     label: 'Google Auth', icon: KeyRound },
  { id: 'ai',         label: 'AI',          icon: Bot },
  { id: 'site_mode',  label: 'Site Mode',   icon: Wrench },
  { id: 'pages',      label: 'Pages',       icon: FileText },
  { id: 'cookies',    label: 'Cookies',     icon: Cookie },
  { id: 'mobile_app', label: 'Mobile App',  icon: Smartphone },
]

// Tabs that contain translatable fields
const TRANSLATABLE_TABS = ['general', 'seo', 'site_mode', 'pages', 'cookies']

const LOCALES = [
  { code: 'default', label: 'Default', flag: '🌐' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'ar', label: 'AR', flag: '🇸🇦' },
]

// Keys that are translatable (have per-locale overrides)
const TRANSLATABLE_KEYS = [
  'footer_description', 'tagline',
  'seo_title', 'seo_description', 'seo_keywords',
  'maintenance_message', 'coming_soon_message',
  'cookie_consent_title', 'cookie_consent_message',
  'cookie_accept_text', 'cookie_decline_text',
  'page_about', 'page_privacy', 'page_terms',
]

const DEFAULTS = {
  site_name: 'Mahalo',
  tagline: "Morocco's Most Trusted Real Estate Platform",
  contact_email: 'elfakirfikri@gmail.com',
  contact_phone: '+212 600 000 000',
  address: 'Casablanca, Morocco',
  whatsapp_number: '',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  youtube_url: '',
  seo_title: 'Mahalo — Premium Real Estate in Morocco',
  seo_description: 'Find your dream property in Morocco with Mahalo. Browse thousands of verified listings across Casablanca, Marrakech, Rabat and more.',
  google_analytics_id: '',
  currency: 'MAD',
  properties_per_page: '12',
  primary_color: '#BA1932',
  secondary_color: '#730D26',
  accent_color: '#F5F5F5',
  logo_url: '/logo.png',
  footer_logo_url: '/logo-light.png',
  watermark_enabled: '1',
  watermark_logo_url: '/watermark.png',
  watermark_position: 'center',
  watermark_opacity: '60',
  watermark_size: '20',
  google_client_id: '',
  google_client_secret: '',
  maintenance_mode: '0',
  maintenance_message: 'Notre site est temporairement hors ligne pour maintenance. Nous serons de retour très bientôt.',
  coming_soon_mode: '0',
  coming_soon_date: '',
  coming_soon_message: "Nous préparons quelque chose d'exceptionnel. Restez à l'écoute.",
  page_about: '',
  page_privacy: '',
  page_terms: '',
  footer_description: 'Premium real estate experiences in Morocco. Discover your dream home with our curated selection of exceptional properties.',
  seo_keywords: 'immobilier maroc, real estate morocco, appartement vendre maroc, villa maroc, casablanca immobilier',
  google_site_verification: '',
  cookie_consent_enabled: '1',
  cookie_consent_title: 'We use cookies',
  cookie_consent_message: 'We use cookies to enhance your experience, analyse traffic, and personalise content. You can manage your preferences below.',
  cookie_accept_text: 'Accept All',
  cookie_decline_text: 'Decline',
  cookie_policy_url: '/privacy',
  groq_api_key: '',
  ai_model: 'llama-3.3-70b-versatile',
  mobile_app_enabled: '1',
  mobile_app_title: 'Your next home',
  mobile_app_subtitle: 'is in your hands',
  mobile_app_description: 'Search, save and contact agents on the go. Download the app and discover premium properties anywhere, anytime.',
  mobile_app_appstore_url: '#',
  mobile_app_playstore_url: '#',
}

const GROQ_MODELS = [
  { value: 'llama-3.3-70b-versatile',  label: 'Llama 3.3 70B Versatile',  badge: 'Recommended' },
  { value: 'llama-3.1-8b-instant',      label: 'Llama 3.1 8B Instant',     badge: 'Fast' },
  { value: 'llama3-70b-8192',           label: 'Llama 3 70B',              badge: null },
  { value: 'llama3-8b-8192',            label: 'Llama 3 8B',               badge: 'Lightweight' },
  { value: 'mixtral-8x7b-32768',        label: 'Mixtral 8x7B',             badge: null },
  { value: 'gemma2-9b-it',              label: 'Gemma 2 9B',               badge: null },
]

const WATERMARK_POSITIONS = [
  { value: 'top-left',     label: 'Top Left' },
  { value: 'top-right',    label: 'Top Right' },
  { value: 'bottom-left',  label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'center',       label: 'Center' },
]

export default function SettingsPage() {
  const [form, setForm]                   = useState(DEFAULTS)
  const [tab, setTab]                     = useState('general')
  const [saving, setSaving]               = useState(false)
  const [saved, setSaved]                 = useState(false)
  const [loading, setLoading]             = useState(true)
  const [uploading, setUploading]         = useState({})
  const [showPwd, setShowPwd]             = useState(false)
  const [showSecret, setShowSecret]       = useState(false)
  const [testing, setTesting]             = useState(false)
  const [testResult, setTestResult]       = useState(null)
  const [copied, setCopied]               = useState(false)
  const [pinging, setPinging]             = useState(false)
  const [pingResult, setPingResult]       = useState(null)
  const [showGroqKey, setShowGroqKey]     = useState(false)
  const [testingAi, setTestingAi]         = useState(false)
  const [aiTestResult, setAiTestResult]   = useState(null)

  // Locale state
  const [locale, setLocale]               = useState('default')
  const [transForm, setTransForm]         = useState({})
  const [transDefaults, setTransDefaults] = useState({})
  const [transLoading, setTransLoading]   = useState(false)
  const [transSaved, setTransSaved]       = useState(false)

  const isLocaleMode = locale !== 'default'
  const tabHasTranslations = TRANSLATABLE_TABS.includes(tab)

  const copyRedirectUri = () => {
    const uri = `${window.location.origin}/api/v1/auth/google/callback`
    navigator.clipboard.writeText(uri)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    adminSettings.get()
      .then((r) => { if (r?.data) setForm(prev => ({ ...prev, ...r.data })) })
      .catch(() => {
        const stored = localStorage.getItem('mahalo_settings')
        if (stored) { try { setForm(prev => ({ ...prev, ...JSON.parse(stored) })) } catch {} }
      })
      .finally(() => setLoading(false))
  }, [])

  // Load locale-specific translations when locale changes
  useEffect(() => {
    if (locale === 'default') {
      setTransForm({})
      setTransDefaults({})
      return
    }
    setTransLoading(true)
    adminSettings.getTranslations(locale)
      .then(r => {
        if (r?.data) {
          const vals = {}
          const defs = {}
          Object.entries(r.data).forEach(([key, meta]) => {
            vals[key] = meta.value ?? ''
            defs[key] = meta.default ?? ''
          })
          setTransForm(vals)
          setTransDefaults(defs)
        }
      })
      .catch(() => {})
      .finally(() => setTransLoading(false))
  }, [locale])

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const fBool = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.checked ? '1' : '0' }))

  // For translatable fields: change in transForm when locale active, else form
  const tf = (k) => (e) => {
    if (isLocaleMode) {
      setTransForm(p => ({ ...p, [k]: e.target.value }))
    } else {
      setForm(p => ({ ...p, [k]: e.target.value }))
    }
  }

  // Get value for a translatable field
  const tv = (k) => {
    if (isLocaleMode) return transForm[k] ?? ''
    return form[k] ?? ''
  }

  // Get placeholder for translatable field (shows default when in locale mode)
  const tp = (k, fallback = '') => {
    if (isLocaleMode) return transDefaults[k] || form[k] || fallback
    return fallback
  }

  const uploadLogo = async (field, file) => {
    if (!file) return
    setUploading(u => ({ ...u, [field]: true }))
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'logos')
      const r = await adminSettings.uploadLogo(fd)
      setForm(p => ({ ...p, [field]: r.url || r.data?.url }))
    } catch (err) {
      alert('Logo upload failed: ' + (err?.message || 'unknown error'))
    } finally {
      setUploading(u => ({ ...u, [field]: false }))
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (isLocaleMode) {
        await adminSettings.updateTranslations(locale, transForm)
        setTransSaved(true)
        setTimeout(() => setTransSaved(false), 3000)
      } else {
        await adminSettings.update(form)
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      if (!isLocaleMode) {
        localStorage.setItem('mahalo_settings', JSON.stringify(form))
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Site Settings" subtitle="Loading…" />
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Site Settings" subtitle="Global configuration">
        <div className="flex items-center gap-2">
          {(saved || transSaved) && (
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
              <CheckCircle size={15} /> Saved!
            </div>
          )}
          <Btn type="submit" variant="gold" form="settings-form" disabled={saving}>
            <Save size={14} /> {saving ? 'Saving…' : 'Save Settings'}
          </Btn>
        </div>
      </PageHeader>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 mb-4 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === id
                ? 'bg-[#730D26] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {/* Locale Switcher — shown only on tabs with translatable content */}
      {tabHasTranslations && (
        <div className="flex items-center gap-3 mb-6 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Languages size={14} className="text-[#BA1932]" />
            Language
          </div>
          <div className="flex gap-1">
            {LOCALES.map(({ code, label, flag }) => (
              <button
                key={code}
                type="button"
                onClick={() => setLocale(code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  locale === code
                    ? 'bg-[#BA1932] text-white shadow-sm'
                    : 'text-gray-500 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                <span>{flag}</span>
                {label}
              </button>
            ))}
          </div>
          {isLocaleMode && (
            <p className="text-xs text-gray-400 ml-auto">
              Editing <strong>{LOCALES.find(l => l.code === locale)?.label}</strong> translations — leave a field blank to use the Default value
            </p>
          )}
          {transLoading && (
            <div className="ml-2 w-4 h-4 border-2 border-[#BA1932] border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}

      <form id="settings-form" onSubmit={submit} className="space-y-6">

        {/* ── GENERAL TAB ── */}
        {tab === 'general' && (
          <>
            <Section title="General" icon={Globe}>
              {isLocaleMode ? (
                <>
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-center gap-2">
                    <Info size={13} className="shrink-0" />
                    Only text fields below can be translated. Settings like site name, currency, and display options are shared across all languages.
                  </div>
                  <FormField label="Tagline" hint={`Default: "${transDefaults.tagline || form.tagline}"`}>
                    <Input value={tv('tagline')} onChange={tf('tagline')} placeholder={tp('tagline', "Morocco's Most Trusted Real Estate Platform")} />
                  </FormField>
                  <FormField label="Footer Description" hint={`Default: "${(transDefaults.footer_description || form.footer_description)?.substring(0, 60)}…"`}>
                    <Textarea value={tv('footer_description')} onChange={tf('footer_description')} rows={3} placeholder={tp('footer_description', 'Premium real estate experiences in Morocco…')} />
                  </FormField>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="App / Site Name" required>
                      <Input value={form.site_name} onChange={f('site_name')} placeholder="Mahalo" />
                    </FormField>
                    <FormField label="Currency">
                      <Input value={form.currency} onChange={f('currency')} placeholder="MAD" />
                    </FormField>
                  </div>
                  <FormField label="Tagline">
                    <Input value={form.tagline} onChange={f('tagline')} placeholder="Morocco's Most Trusted Real Estate Platform" />
                  </FormField>
                  <FormField label="Properties per page">
                    <Input type="number" min="4" max="48" value={form.properties_per_page} onChange={f('properties_per_page')} />
                  </FormField>
                  <FormField label="Footer Description" hint="Short blurb shown below the logo in the site footer">
                    <Textarea value={form.footer_description} onChange={f('footer_description')} rows={3} placeholder="Premium real estate experiences in Morocco…" />
                  </FormField>
                </>
              )}
            </Section>
          </>
        )}

        {/* ── THEME TAB ── */}
        {tab === 'theme' && (
          <>
            <Section title="Brand Colors" icon={Palette}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ColorField
                  label="Primary Color"
                  hint="Main accent (buttons, highlights)"
                  value={form.primary_color}
                  onChange={f('primary_color')}
                />
                <ColorField
                  label="Secondary Color"
                  hint="Dark backgrounds, navbar"
                  value={form.secondary_color}
                  onChange={f('secondary_color')}
                />
                <ColorField
                  label="Background Color"
                  hint="Page background"
                  value={form.accent_color}
                  onChange={f('accent_color')}
                />
              </div>
            </Section>

            <Section title="Logos" icon={Image}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LogoField
                  label="Main Logo"
                  hint="Shown in header and light backgrounds"
                  value={form.logo_url}
                  field="logo_url"
                  uploading={uploading.logo_url}
                  onChange={uploadLogo}
                />
                <LogoField
                  label="Footer Logo"
                  hint="Shown in the dark footer — use a light/white version"
                  value={form.footer_logo_url}
                  field="footer_logo_url"
                  uploading={uploading.footer_logo_url}
                  onChange={uploadLogo}
                />
              </div>
            </Section>
          </>
        )}

        {/* ── WATERMARK TAB ── */}
        {tab === 'watermark' && (
          <>
            <Section title="Property Image Watermark" icon={Droplets}>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 flex items-start gap-3 mb-2">
                <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <p className="text-xs text-blue-700">
                  When enabled, every property image will automatically be stamped with your logo during upload.
                  The watermark is applied server-side and does not affect original files.
                </p>
              </div>

              {/* Enable toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Enable Watermark</p>
                  <p className="text-xs text-gray-500 mt-0.5">Stamp uploaded property images with your logo</p>
                </div>
                <div
                  onClick={() => setForm(p => ({ ...p, watermark_enabled: p.watermark_enabled === '1' ? '0' : '1' }))}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                    form.watermark_enabled === '1' ? 'bg-[#BA1932]' : 'bg-gray-200'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    form.watermark_enabled === '1' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LogoField
                  label="Watermark Logo"
                  hint="Use a transparent PNG for best results"
                  value={form.watermark_logo_url}
                  field="watermark_logo_url"
                  uploading={uploading.watermark_logo_url}
                  onChange={uploadLogo}
                />
                <div className="space-y-4">
                  <FormField label="Position">
                    <select
                      value={form.watermark_position}
                      onChange={f('watermark_position')}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932]"
                    >
                      {WATERMARK_POSITIONS.map(p => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </FormField>
                  <FormField label="Opacity" hint={`${form.watermark_opacity}%`}>
                    <input
                      type="range" min="10" max="100" step="5"
                      value={form.watermark_opacity}
                      onChange={f('watermark_opacity')}
                      className="w-full accent-[#BA1932]"
                    />
                  </FormField>
                  <FormField label="Size" hint={`${form.watermark_size}% of image width`}>
                    <input
                      type="range" min="5" max="50" step="5"
                      value={form.watermark_size}
                      onChange={f('watermark_size')}
                      className="w-full accent-[#BA1932]"
                    />
                  </FormField>
                </div>
              </div>

              <WatermarkPreview
                logo={form.watermark_logo_url}
                position={form.watermark_position}
                opacity={form.watermark_opacity}
                size={form.watermark_size}
                enabled={form.watermark_enabled === '1'}
              />
            </Section>
          </>
        )}

        {/* ── CONTACT TAB ── */}
        {tab === 'contact' && (
          <>
            <Section title="Contact Information" icon={Mail}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Contact Email">
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input value={form.contact_email} onChange={f('contact_email')} className="pl-9" placeholder="contact@mahalo.ma" />
                  </div>
                </FormField>
                <FormField label="Contact Phone">
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input value={form.contact_phone} onChange={f('contact_phone')} className="pl-9" placeholder="+212 600 000 000" />
                  </div>
                </FormField>
              </div>
              <FormField label="Address">
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.address} onChange={f('address')} className="pl-9" placeholder="Casablanca, Morocco" />
                </div>
              </FormField>
              <FormField label="WhatsApp Number" hint="Include country code, e.g. +212600000000">
                <Input value={form.whatsapp_number} onChange={f('whatsapp_number')} placeholder="+212600000000" />
              </FormField>
            </Section>
          </>
        )}

        {/* ── SOCIAL TAB ── */}
        {tab === 'social' && (
          <>
            <Section title="Social Media Links" icon={Instagram}>
              <FormField label="Facebook URL">
                <div className="relative">
                  <Facebook size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.facebook_url} onChange={f('facebook_url')} className="pl-9" placeholder="https://facebook.com/mahalo" />
                </div>
              </FormField>
              <FormField label="Instagram URL">
                <div className="relative">
                  <Instagram size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.instagram_url} onChange={f('instagram_url')} className="pl-9" placeholder="https://instagram.com/mahalo" />
                </div>
              </FormField>
              <FormField label="Twitter / X URL">
                <div className="relative">
                  <Twitter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.twitter_url} onChange={f('twitter_url')} className="pl-9" placeholder="https://twitter.com/mahalo" />
                </div>
              </FormField>
              <FormField label="YouTube URL">
                <Input value={form.youtube_url} onChange={f('youtube_url')} placeholder="https://youtube.com/@mahalo" />
              </FormField>
            </Section>
          </>
        )}

        {/* ── SEO TAB ── */}
        {tab === 'seo' && (
          <>
            <Section title="SEO & Analytics" icon={Globe}>
              {isLocaleMode ? (
                <>
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-center gap-2 mb-1">
                    <Info size={13} className="shrink-0" />
                    Leave a field empty to use the Default value. Only content fields are translatable — Google Analytics ID and verification code are shared.
                  </div>
                  <FormField label="Default SEO Title" hint={`Default: "${transDefaults.seo_title || form.seo_title}"`}>
                    <Input value={tv('seo_title')} onChange={tf('seo_title')} placeholder={tp('seo_title', 'Mahalo — Premium Real Estate in Morocco')} />
                  </FormField>
                  <FormField label="Default Meta Description" hint={`Default: "${(transDefaults.seo_description || form.seo_description)?.substring(0, 60)}…"`}>
                    <Textarea value={tv('seo_description')} onChange={tf('seo_description')} rows={3} placeholder={tp('seo_description', 'Find your dream property in Morocco...')} />
                  </FormField>
                  <FormField label="SEO Keywords" hint="Comma-separated keywords — leave blank to use Default">
                    <div className="relative">
                      <Tag size={14} className="absolute left-3.5 top-3 text-gray-400" />
                      <Textarea
                        value={tv('seo_keywords')}
                        onChange={tf('seo_keywords')}
                        rows={2}
                        className="pl-9"
                        placeholder={tp('seo_keywords', 'immobilier maroc, real estate morocco…')}
                      />
                    </div>
                  </FormField>
                </>
              ) : (
                <>
                  <FormField label="Default SEO Title" hint="Used when no page-specific title is set">
                    <Input value={form.seo_title} onChange={f('seo_title')} placeholder="Mahalo — Premium Real Estate in Morocco" />
                  </FormField>
                  <FormField label="Default Meta Description">
                    <Textarea value={form.seo_description} onChange={f('seo_description')} rows={3} placeholder="Find your dream property in Morocco..." />
                  </FormField>
                  <FormField label="SEO Keywords" hint="Comma-separated keywords injected into the global meta keywords tag">
                    <div className="relative">
                      <Tag size={14} className="absolute left-3.5 top-3 text-gray-400" />
                      <Textarea
                        value={form.seo_keywords}
                        onChange={f('seo_keywords')}
                        rows={2}
                        className="pl-9"
                        placeholder="immobilier maroc, real estate morocco, appartement vendre maroc…"
                      />
                    </div>
                  </FormField>
                  <FormField label="Google Analytics ID" hint="e.g. G-XXXXXXXXXX or UA-XXXXXXXXX-X">
                    <Input value={form.google_analytics_id} onChange={f('google_analytics_id')} placeholder="G-XXXXXXXXXX" />
                  </FormField>
                  <FormField
                    label="Google Search Console Verification"
                    hint="Paste the content value from the HTML tag method — e.g. abc123XYZ. Once saved, Google will verify your site ownership automatically."
                  >
                    <Input
                      value={form.google_site_verification}
                      onChange={f('google_site_verification')}
                      placeholder="Paste verification code from Google Search Console"
                      className="font-mono text-sm"
                    />
                  </FormField>
                </>
              )}
            </Section>

            {!isLocaleMode && (
              <Section title="Sitemap" icon={Map}>
                <p className="text-sm text-gray-500 mb-4">
                  Notify Google and Bing about your latest sitemap so they re-crawl your listings faster.
                  The sitemap index is always available at <code className="bg-gray-100 px-1.5 py-0.5 rounded-lg text-xs font-mono">/sitemap.xml</code>.
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Btn
                    type="button"
                    variant="ghost"
                    disabled={pinging}
                    onClick={async () => {
                      setPinging(true)
                      setPingResult(null)
                      try {
                        const r = await adminSettings.sitemapPing()
                        const results = r?.data?.results || {}
                        const lines = Object.entries(results).map(([e, s]) => `${e}: ${s}`).join(' · ')
                        setPingResult({ ok: true, msg: `Pinged — ${lines}` })
                      } catch (e) {
                        setPingResult({ ok: false, msg: e?.message || 'Ping failed.' })
                      } finally {
                        setPinging(false)
                      }
                    }}
                  >
                    <RefreshCw size={14} className={pinging ? 'animate-spin' : ''} />
                    {pinging ? 'Pinging search engines…' : 'Ping Google & Bing'}
                  </Btn>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-all"
                  >
                    <ExternalLink size={13} /> View sitemap.xml
                  </a>
                </div>
                {pingResult && (
                  <div className={`mt-3 flex items-start gap-2 text-sm font-medium ${pingResult.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                    {pingResult.ok ? <CheckCircle size={15} className="mt-0.5 shrink-0" /> : <AlertCircle size={15} className="mt-0.5 shrink-0" />}
                    <span>{pingResult.msg}</span>
                  </div>
                )}
              </Section>
            )}
          </>
        )}

        {/* ── MAIL TAB ── */}
        {tab === 'mail' && (
          <>
            <Section title="SMTP Mail Configuration" icon={Server}>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 flex items-start gap-3">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <p className="font-semibold mb-1">Mail settings are managed via environment variables</p>
                  <p className="text-xs text-blue-700">
                    SMTP credentials are configured directly in your server's <code className="bg-blue-100 px-1 rounded">.env</code> file.
                    Changes here have no effect — edit the <code className="bg-blue-100 px-1 rounded">.env</code> on your server to update mail settings.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {[
                  { label: 'Mailer',       value: 'MAIL_MAILER' },
                  { label: 'Host',         value: 'MAIL_HOST' },
                  { label: 'Port',         value: 'MAIL_PORT' },
                  { label: 'Encryption',   value: 'MAIL_ENCRYPTION' },
                  { label: 'Username',     value: 'MAIL_USERNAME' },
                  { label: 'Password',     value: 'MAIL_PASSWORD' },
                  { label: 'From Address', value: 'MAIL_FROM_ADDRESS' },
                  { label: 'From Name',    value: 'MAIL_FROM_NAME' },
                ].map(({ label, value }) => (
                  <div key={value} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                    <span className="text-xs font-semibold text-gray-500">{label}</span>
                    <code className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg font-mono">{value}</code>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Send Test Email" icon={Send}>
              <p className="text-sm text-gray-500">Verify your current SMTP configuration is working correctly.</p>
              <div className="flex items-center gap-3 pt-1">
                <Btn
                  type="button"
                  variant="ghost"
                  disabled={testing}
                  onClick={async () => {
                    setTesting(true)
                    setTestResult(null)
                    try {
                      const r = await adminSettings.testMail(form.contact_email || 'test@example.com')
                      setTestResult({ ok: true, msg: r?.message || 'Test email sent successfully!' })
                    } catch (e) {
                      setTestResult({ ok: false, msg: e?.response?.data?.message || e?.message || 'Failed to send test email.' })
                    } finally {
                      setTesting(false)
                    }
                  }}
                >
                  <Send size={14} /> {testing ? 'Sending…' : 'Send Test Email'}
                </Btn>
                {testResult && (
                  <span className={`text-sm font-medium flex items-center gap-1.5 ${testResult.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                    {testResult.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    {testResult.msg}
                  </span>
                )}
              </div>
            </Section>
          </>
        )}

        {/* ── GOOGLE AUTH TAB ── */}
        {tab === 'google' && (
          <>
            <Section title="Google OAuth Credentials" icon={KeyRound}>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 mb-2 leading-relaxed">
                These credentials enable "Sign in with Google" for users and managers. Get them from{' '}
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="underline font-semibold inline-flex items-center gap-0.5">
                  Google Cloud Console <ExternalLink size={10} />
                </a>
                {' '}→ Create OAuth 2.0 Client ID (Web application).
              </div>

              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Authorized Redirect URI</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-mono truncate">
                    {window.location.origin}/api/v1/auth/google/callback
                  </code>
                  <button
                    type="button"
                    onClick={copyRedirectUri}
                    className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-all flex-shrink-0"
                  >
                    <Copy size={13} />
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">Add this exact URL to your Google OAuth app's authorized redirect URIs.</p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-1">
                <FormField label="Client ID" hint="Ends with .apps.googleusercontent.com">
                  <Input
                    value={form.google_client_id}
                    onChange={f('google_client_id')}
                    placeholder="123456789-xxxxxxxxxxxx.apps.googleusercontent.com"
                  />
                </FormField>
                <FormField label="Client Secret">
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showSecret ? 'text' : 'password'}
                      value={form.google_client_secret}
                      onChange={f('google_client_secret')}
                      placeholder="GOCSPX-xxxxxxxxxxxxxxxx"
                      className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </FormField>
              </div>

              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium mt-2 ${
                form.google_client_id && form.google_client_secret
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  : 'bg-amber-50 border-amber-100 text-amber-700'
              }`}>
                {form.google_client_id && form.google_client_secret ? (
                  <><CheckCircle size={15} /> Google OAuth is configured — users and managers can sign in with Google.</>
                ) : (
                  <><AlertCircle size={15} /> Google OAuth is not configured. Enter your Client ID and Secret above and save.</>
                )}
              </div>
            </Section>
          </>
        )}

        {/* ── AI TAB ── */}
        {tab === 'ai' && (
          <>
            <Section title="Groq API Configuration" icon={Bot}>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 mb-2 leading-relaxed">
                The AI chat, property descriptions, and valuation features all use Groq. Get a free API key at{' '}
                <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="underline font-semibold inline-flex items-center gap-0.5">
                  console.groq.com <ExternalLink size={10} />
                </a>
                . Your key is stored securely in the database and never exposed to the frontend.
              </div>

              <FormField label="Groq API Key" hint="Starts with gsk_">
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type={showGroqKey ? 'text' : 'password'}
                    value={form.groq_api_key}
                    onChange={f('groq_api_key')}
                    placeholder="gsk_••••••••••••••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932] font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowGroqKey(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showGroqKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </FormField>

              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium ${
                form.groq_api_key
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  : 'bg-amber-50 border-amber-100 text-amber-700'
              }`}>
                {form.groq_api_key
                  ? <><CheckCircle size={15} /> Groq API key is configured.</>
                  : <><AlertCircle size={15} /> No API key set — AI features will be disabled.</>
                }
              </div>
            </Section>

            <Section title="AI Model" icon={Bot}>
              <FormField label="Active Model" hint="Select the Groq model used for all AI features on the platform">
                <div className="grid grid-cols-1 gap-2">
                  {GROQ_MODELS.map((m) => (
                    <label
                      key={m.value}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                        form.ai_model === m.value
                          ? 'border-[#BA1932] bg-[#BA1932]/5 ring-1 ring-[#BA1932]/20'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="ai_model"
                        value={m.value}
                        checked={form.ai_model === m.value}
                        onChange={f('ai_model')}
                        className="accent-[#BA1932]"
                      />
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-gray-800">{m.label}</span>
                        <span className="text-xs text-gray-400 ml-2 font-mono">{m.value}</span>
                      </div>
                      {m.badge && (
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${
                          m.badge === 'Recommended'
                            ? 'bg-emerald-100 text-emerald-700'
                            : m.badge === 'Fast'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-500'
                        }`}>
                          {m.badge}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </FormField>

              <div className="flex items-center gap-3 pt-1">
                <Btn
                  type="button"
                  variant="ghost"
                  disabled={testingAi}
                  onClick={async () => {
                    setTestingAi(true)
                    setAiTestResult(null)
                    try {
                      const res = await fetch('/api/v1/ai/chat', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ message: 'Reply with exactly: OK' }),
                      })
                      const data = await res.json()
                      if (data.reply) {
                        setAiTestResult({ ok: true, msg: `Model responded: "${data.reply.substring(0, 60)}"` })
                      } else {
                        setAiTestResult({ ok: false, msg: data.error || 'No reply received.' })
                      }
                    } catch (e) {
                      setAiTestResult({ ok: false, msg: e.message || 'Request failed.' })
                    } finally {
                      setTestingAi(false)
                    }
                  }}
                >
                  <Bot size={14} /> {testingAi ? 'Testing…' : 'Test AI Connection'}
                </Btn>
                {aiTestResult && (
                  <span className={`text-sm font-medium flex items-center gap-1.5 ${aiTestResult.ok ? 'text-emerald-600' : 'text-red-500'}`}>
                    {aiTestResult.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                    {aiTestResult.msg}
                  </span>
                )}
              </div>
            </Section>
          </>
        )}

        {/* ── SITE MODE TAB ── */}
        {tab === 'site_mode' && (
          <>
            <Section title="Mode Maintenance" icon={Wrench}>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 flex items-start gap-3 mb-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold mb-0.5">Attention</p>
                  <p className="text-xs text-amber-700">
                    Activer le mode maintenance bloquera tous les visiteurs (sauf les admins qui peuvent accéder via <code className="bg-amber-100 px-1 rounded">?bypass=1</code>).
                  </p>
                </div>
              </div>

              {!isLocaleMode && (
                <>
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Activer le mode maintenance</p>
                      <p className="text-xs text-gray-500 mt-0.5">Affiche la page de maintenance à tous les visiteurs</p>
                    </div>
                    <div
                      onClick={() => setForm(p => ({ ...p, maintenance_mode: p.maintenance_mode === '1' ? '0' : '1' }))}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                        form.maintenance_mode === '1' ? 'bg-[#BA1932]' : 'bg-gray-200'
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        form.maintenance_mode === '1' ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                  {form.maintenance_mode === '1' && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
                      <Wrench size={14} /> Le site est actuellement en mode maintenance
                    </div>
                  )}
                </>
              )}

              <FormField
                label="Message de maintenance"
                hint={isLocaleMode ? `Default: "${(transDefaults.maintenance_message || form.maintenance_message)?.substring(0, 60)}…"` : 'Affiché sur la page de maintenance'}
              >
                <Textarea
                  value={isLocaleMode ? tv('maintenance_message') : form.maintenance_message}
                  onChange={isLocaleMode ? tf('maintenance_message') : f('maintenance_message')}
                  rows={3}
                  placeholder={isLocaleMode ? tp('maintenance_message', 'Notre site est temporairement hors ligne…') : 'Notre site est temporairement hors ligne pour maintenance…'}
                />
              </FormField>
            </Section>

            <Section title="Mode Bientôt disponible" icon={Clock}>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 flex items-start gap-3 mb-2">
                <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <p className="text-xs text-blue-700">
                  Le mode "Bientôt disponible" est prioritaire sur la maintenance.
                  Accès admin via <code className="bg-blue-100 px-1 rounded">?bypass=1</code>.
                </p>
              </div>

              {!isLocaleMode && (
                <>
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">Activer "Bientôt disponible"</p>
                      <p className="text-xs text-gray-500 mt-0.5">Affiche une page coming soon avec un compte à rebours</p>
                    </div>
                    <div
                      onClick={() => setForm(p => ({ ...p, coming_soon_mode: p.coming_soon_mode === '1' ? '0' : '1' }))}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                        form.coming_soon_mode === '1' ? 'bg-[#BA1932]' : 'bg-gray-200'
                      }`}
                    >
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        form.coming_soon_mode === '1' ? 'translate-x-6' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                  {form.coming_soon_mode === '1' && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-600 font-medium">
                      <Clock size={14} /> Le mode "Bientôt disponible" est actif
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Date de lancement" hint="Affichée dans le compte à rebours">
                      <input
                        type="datetime-local"
                        value={form.coming_soon_date}
                        onChange={f('coming_soon_date')}
                        className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932]"
                      />
                    </FormField>
                  </div>
                </>
              )}

              <FormField
                label="Message"
                hint={isLocaleMode ? `Default: "${(transDefaults.coming_soon_message || form.coming_soon_message)?.substring(0, 60)}…"` : 'Affiché sur la page bientôt disponible'}
              >
                <Textarea
                  value={isLocaleMode ? tv('coming_soon_message') : form.coming_soon_message}
                  onChange={isLocaleMode ? tf('coming_soon_message') : f('coming_soon_message')}
                  rows={3}
                  placeholder={isLocaleMode ? tp('coming_soon_message', "Nous préparons quelque chose d'exceptionnel…") : "Nous préparons quelque chose d'exceptionnel…"}
                />
              </FormField>
            </Section>
          </>
        )}

        {/* ── PAGES TAB ── */}
        {tab === 'pages' && (
          <>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 flex items-start gap-3 mb-2">
              <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
              <p className="text-xs leading-relaxed">
                {isLocaleMode
                  ? 'Editing translated content for this language. Leave empty to show the Default text.'
                  : 'Le contenu ci-dessous est rendu sur les pages publiques correspondantes. Vous pouvez utiliser des titres avec ## Titre, des listes avec - item, et des paragraphes séparés par une ligne vide.'}
              </p>
            </div>

            <Section title="Page À propos" icon={Info}>
              <FormField
                label="Contenu de la section Notre Mission"
                hint={isLocaleMode ? `Leave empty to use Default content` : 'Affiché dans la section mission de la page /about. Séparez les paragraphes par une ligne vide.'}
              >
                <textarea
                  value={isLocaleMode ? tv('page_about') : form.page_about}
                  onChange={isLocaleMode ? tf('page_about') : f('page_about')}
                  rows={10}
                  placeholder={isLocaleMode ? (transDefaults.page_about || form.page_about || 'Leave empty to use Default…') : "Fondée à Casablanca, Mahalo a été créée sur une conviction simple…\n\nNous avons démarré parce que…"}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932] font-mono leading-relaxed resize-y"
                />
              </FormField>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span>Prévisualiser sur</span>
                <a href="/about" target="_blank" rel="noreferrer" className="text-[#BA1932] hover:underline inline-flex items-center gap-1">
                  /about <ExternalLink size={10} />
                </a>
              </p>
            </Section>

            <Section title="Politique de confidentialité" icon={Shield}>
              <FormField label="Contenu" hint={isLocaleMode ? 'Leave empty to use Default content' : 'Affiché sur la page /privacy.'}>
                <textarea
                  value={isLocaleMode ? tv('page_privacy') : form.page_privacy}
                  onChange={isLocaleMode ? tf('page_privacy') : f('page_privacy')}
                  rows={14}
                  placeholder={isLocaleMode ? (transDefaults.page_privacy || form.page_privacy || 'Leave empty to use Default…') : "## 1. Collecte des données\nNous collectons les informations…\n\n## 2. Utilisation des données\n…"}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932] font-mono leading-relaxed resize-y"
                />
              </FormField>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span>Prévisualiser sur</span>
                <a href="/privacy" target="_blank" rel="noreferrer" className="text-[#BA1932] hover:underline inline-flex items-center gap-1">
                  /privacy <ExternalLink size={10} />
                </a>
              </p>
            </Section>

            <Section title="Conditions d'utilisation" icon={FileText}>
              <FormField label="Contenu" hint={isLocaleMode ? 'Leave empty to use Default content' : "Affiché sur la page /terms."}>
                <textarea
                  value={isLocaleMode ? tv('page_terms') : form.page_terms}
                  onChange={isLocaleMode ? tf('page_terms') : f('page_terms')}
                  rows={14}
                  placeholder={isLocaleMode ? (transDefaults.page_terms || form.page_terms || 'Leave empty to use Default…') : "## 1. Acceptation des conditions\nEn accédant à notre plateforme…\n\n## 2. Description du service\n…"}
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932] font-mono leading-relaxed resize-y"
                />
              </FormField>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span>Prévisualiser sur</span>
                <a href="/terms" target="_blank" rel="noreferrer" className="text-[#BA1932] hover:underline inline-flex items-center gap-1">
                  /terms <ExternalLink size={10} />
                </a>
              </p>
            </Section>
          </>
        )}

        {/* ── COOKIES TAB ── */}
        {tab === 'cookies' && (
          <>
            {/* ── Enable / URL row (default mode only) ── */}
            {!isLocaleMode && (
              <Section title="Cookie Consent Banner" icon={Cookie}>
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Enable Cookie Banner</p>
                    <p className="text-xs text-gray-400 mt-0.5">Show a cookie consent popup to all new visitors</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={form.cookie_consent_enabled === '1'}
                      onChange={fBool('cookie_consent_enabled')}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#730D26]" />
                  </label>
                </div>

                <FormField label="Cookie Policy URL" hint="Link shown at the bottom of the banner">
                  <Input value={form.cookie_policy_url} onChange={f('cookie_policy_url')} placeholder="/privacy" />
                </FormField>
              </Section>
            )}

            {/* ── Translatable text fields ── */}
            <Section title={isLocaleMode ? `Banner Text — ${LOCALES.find(l => l.code === locale)?.flag} ${LOCALES.find(l => l.code === locale)?.label}` : 'Banner Text'} icon={Cookie}>
              {isLocaleMode ? (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-start gap-2">
                  <Info size={13} className="shrink-0 mt-0.5" />
                  <span>
                    Translate the cookie banner for <strong>{LOCALES.find(l => l.code === locale)?.label}</strong> visitors.
                    Leave a field blank to fall back to the site's built-in translation for that language.
                  </span>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-500 flex items-start gap-2">
                  <Info size={13} className="shrink-0 mt-0.5" />
                  <span>
                    These are the <strong>default</strong> (fallback) texts. Switch to a language tab above to provide per-language translations — the banner automatically shows the visitor's language.
                  </span>
                </div>
              )}

              <FormField
                label="Banner Title"
                hint={isLocaleMode ? `Default: "${transDefaults.cookie_consent_title || form.cookie_consent_title}"` : 'Shown in the banner header'}
              >
                <Input
                  value={isLocaleMode ? tv('cookie_consent_title') : form.cookie_consent_title}
                  onChange={isLocaleMode ? tf('cookie_consent_title') : f('cookie_consent_title')}
                  placeholder={isLocaleMode ? tp('cookie_consent_title', 'We use cookies') : 'We use cookies'}
                />
              </FormField>

              <FormField
                label="Banner Message"
                hint={isLocaleMode ? `Default: "${(transDefaults.cookie_consent_message || form.cookie_consent_message)?.substring(0, 70)}…"` : 'Short explanation shown below the title'}
              >
                <Textarea
                  value={isLocaleMode ? tv('cookie_consent_message') : form.cookie_consent_message}
                  onChange={isLocaleMode ? tf('cookie_consent_message') : f('cookie_consent_message')}
                  rows={3}
                  placeholder={isLocaleMode ? tp('cookie_consent_message', 'We use cookies to enhance your experience…') : 'We use cookies to enhance your experience, analyse traffic, and personalise content.'}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Accept Button"
                  hint={isLocaleMode ? `Default: "${transDefaults.cookie_accept_text || form.cookie_accept_text}"` : 'Primary action button'}
                >
                  <Input
                    value={isLocaleMode ? tv('cookie_accept_text') : form.cookie_accept_text}
                    onChange={isLocaleMode ? tf('cookie_accept_text') : f('cookie_accept_text')}
                    placeholder={isLocaleMode ? tp('cookie_accept_text', 'Accept All') : 'Accept All'}
                  />
                </FormField>
                <FormField
                  label="Decline Button"
                  hint={isLocaleMode ? `Default: "${transDefaults.cookie_decline_text || form.cookie_decline_text}"` : 'Secondary action button'}
                >
                  <Input
                    value={isLocaleMode ? tv('cookie_decline_text') : form.cookie_decline_text}
                    onChange={isLocaleMode ? tf('cookie_decline_text') : f('cookie_decline_text')}
                    placeholder={isLocaleMode ? tp('cookie_decline_text', 'Decline') : 'Decline'}
                  />
                </FormField>
              </div>
            </Section>

            {/* ── Live preview ── */}
            <Section title="Live Preview" icon={Eye}>
              <p className="text-xs text-gray-400 -mt-1 mb-3">
                This is how the banner looks to visitors. Text reflects the current fields above.
              </p>
              <CookieBannerPreview
                title={isLocaleMode ? (tv('cookie_consent_title') || transDefaults.cookie_consent_title || form.cookie_consent_title) : form.cookie_consent_title}
                message={isLocaleMode ? (tv('cookie_consent_message') || transDefaults.cookie_consent_message || form.cookie_consent_message) : form.cookie_consent_message}
                acceptTxt={isLocaleMode ? (tv('cookie_accept_text') || transDefaults.cookie_accept_text || form.cookie_accept_text) : form.cookie_accept_text}
                declineTxt={isLocaleMode ? (tv('cookie_decline_text') || transDefaults.cookie_decline_text || form.cookie_decline_text) : form.cookie_decline_text}
                policyUrl={form.cookie_policy_url || '/privacy'}
                enabled={form.cookie_consent_enabled === '1'}
              />
            </Section>
          </>
        )}

        {/* ── MOBILE APP TAB ── */}
        {tab === 'mobile_app' && (
          <>
            <Section title="Mobile App Section" icon={Smartphone}>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-start gap-3">
                <Info size={13} className="shrink-0 mt-0.5" />
                Controls the "Agentz Mobile App" banner shown on the homepage. Toggle it on or off and customise the text and store links.
              </div>

              {/* Enable/disable toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Show Mobile App Section</p>
                  <p className="text-xs text-gray-500 mt-0.5">Display the app download banner on the homepage</p>
                </div>
                <div
                  onClick={() => setForm(p => ({ ...p, mobile_app_enabled: p.mobile_app_enabled === '1' ? '0' : '1' }))}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${
                    form.mobile_app_enabled === '1' ? 'bg-[#BA1932]' : 'bg-gray-200'
                  }`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    form.mobile_app_enabled === '1' ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              </div>

              {form.mobile_app_enabled === '0' && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-600 font-medium">
                  <AlertCircle size={14} /> Section is hidden on the homepage
                </div>
              )}
            </Section>

            <Section title="Content" icon={FileText}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Heading Line 1" hint="e.g. Your next home">
                  <Input value={form.mobile_app_title} onChange={f('mobile_app_title')} placeholder="Your next home" />
                </FormField>
                <FormField label="Heading Line 2 (highlighted)" hint="Shown in red gradient">
                  <Input value={form.mobile_app_subtitle} onChange={f('mobile_app_subtitle')} placeholder="is in your hands" />
                </FormField>
              </div>
              <FormField label="Description" hint="Short paragraph shown below the heading">
                <Textarea value={form.mobile_app_description} onChange={f('mobile_app_description')} rows={3} placeholder="Search, save and contact agents on the go…" />
              </FormField>
            </Section>

            <Section title="Store Links" icon={ExternalLink}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="App Store URL" hint="iOS — Apple App Store link">
                  <Input value={form.mobile_app_appstore_url} onChange={f('mobile_app_appstore_url')} placeholder="https://apps.apple.com/…" />
                </FormField>
                <FormField label="Google Play URL" hint="Android — Google Play Store link">
                  <Input value={form.mobile_app_playstore_url} onChange={f('mobile_app_playstore_url')} placeholder="https://play.google.com/store/…" />
                </FormField>
              </div>
            </Section>
          </>
        )}

        <div className="flex justify-end">
          <Btn type="submit" variant="gold" disabled={saving}>
            <Save size={14} /> {saving ? 'Saving…' : isLocaleMode ? `Save ${LOCALES.find(l => l.code === locale)?.label} Translations` : 'Save All Settings'}
          </Btn>
        </div>
      </form>
    </div>
  )
}

function CookieBannerPreview({ title, message, acceptTxt, declineTxt, policyUrl, enabled }) {
  const previewTitle      = title      || 'We use cookies'
  const previewMessage    = message    || 'We use cookies to enhance your experience, analyse traffic, and personalise content.'
  const previewAcceptTxt  = acceptTxt  || 'Accept All'
  const previewDeclineTxt = declineTxt || 'Decline'

  if (!enabled) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400">
        <Cookie size={14} />
        Cookie banner is disabled — enable it above to preview.
      </div>
    )
  }

  return (
    <div className="max-w-sm">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-[#730D26] to-[#BA1932] px-3 py-2.5 flex items-center gap-2">
          <Cookie size={14} className="text-white shrink-0" />
          <h3 className="text-white font-bold text-sm flex-1 leading-none">{previewTitle}</h3>
          <div className="text-white/60 -mr-0.5 cursor-default">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </div>
        </div>
        <div className="px-3 py-3">
          <p className="text-gray-500 text-xs leading-relaxed mb-2.5">{previewMessage}</p>
          <div className="text-[11px] text-[#730D26] font-semibold flex items-center gap-1 mb-2.5">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"/></svg>
            Manage preferences
          </div>
          <div className="flex gap-2 mb-2">
            <div className="flex-1 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 text-center">
              {previewDeclineTxt}
            </div>
            <div className="flex-1 py-1.5 rounded-xl bg-[#730D26] text-white text-xs font-semibold text-center">
              {previewAcceptTxt}
            </div>
          </div>
          <p className="text-center text-[10px] text-gray-400">
            <span className="text-[#730D26]">{policyUrl === '/privacy' ? 'Cookie Policy' : policyUrl}</span>
            {' · '}
            <span className="text-[#730D26]">Privacy Policy</span>
          </p>
        </div>
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center">↑ Actual banner shown bottom-right to visitors</p>
    </div>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="w-8 h-8 rounded-xl bg-[#BA1932]/10 flex items-center justify-center">
          <Icon size={15} className="text-[#BA1932]" />
        </div>
        <h2 className="font-bold text-gray-800 text-sm">{title}</h2>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  )
}

function ColorField({ label, hint, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-600">{label}</label>
      {hint && <p className="text-xs text-gray-400 -mt-1">{hint}</p>}
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || '#000000'}
          onChange={onChange}
          className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer p-1 bg-white"
        />
        <div className="flex-1">
          <input
            type="text"
            value={value || ''}
            onChange={onChange}
            placeholder="#BA1932"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932] font-mono"
          />
        </div>
      </div>
      <div
        className="h-8 rounded-xl border border-gray-100"
        style={{ backgroundColor: value || '#ffffff' }}
      />
    </div>
  )
}

function LogoField({ label, hint, value, field, uploading, onChange }) {
  const ref = useRef()
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-600">{label}</label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}

      <div
        onClick={() => ref.current?.click()}
        className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#BA1932]/50 transition-colors min-h-[100px] bg-gray-50"
      >
        {value ? (
          <img
            src={value}
            alt={label}
            className="max-h-16 max-w-full object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <>
            <Upload size={20} className="text-gray-300" />
            <span className="text-xs text-gray-400">Click to upload</span>
          </>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
            <div className="w-5 h-5 border-2 border-[#BA1932] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => e.target.files[0] && onChange(field, e.target.files[0])}
      />

      {value && (
        <p className="text-xs text-gray-400 truncate">{value}</p>
      )}
    </div>
  )
}

function WatermarkPreview({ logo, position, opacity, size, enabled }) {
  const posMap = {
    'top-left':     'top-3 left-3',
    'top-right':    'top-3 right-3',
    'bottom-left':  'bottom-3 left-3',
    'bottom-right': 'bottom-3 right-3',
    'center':       'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Live Preview</p>
        {!enabled && (
          <span className="text-xs bg-amber-50 text-amber-600 border border-amber-100 rounded-lg px-2 py-0.5">
            Watermark is disabled — enable above to activate
          </span>
        )}
      </div>
      <div
        className="relative rounded-xl overflow-hidden border border-gray-100"
        style={{ height: 200, background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)' }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{
            backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)'
          }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/60 text-sm font-medium select-none">Sample Property Image</span>
        </div>
        <img
          src={logo}
          alt="watermark preview"
          className={`absolute ${posMap[position] || posMap['bottom-right']} transition-all duration-200`}
          style={{
            opacity: enabled ? parseInt(opacity, 10) / 100 : 0.25,
            width: `${size}%`,
            objectFit: 'contain',
            filter: enabled ? 'none' : 'grayscale(1)',
          }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1.5">
        Position: <strong>{position}</strong> · Opacity: <strong>{opacity}%</strong> · Size: <strong>{size}% of width</strong>
      </p>
    </div>
  )
}
