import { useEffect, useState, useRef, useCallback } from 'react'
import { adminSettings } from '../api/adminApi'
import { PageHeader, Btn } from '../components/DataTable'
import { FormField, Input, Textarea } from '../components/Modal'
import {
  Save, Globe, Mail, Phone, Instagram, Facebook, Twitter, MapPin,
  CheckCircle, Palette, Upload, Image, Droplets, Eye, EyeOff,
  Server, Send, Lock, AlertCircle, KeyRound, Copy, ExternalLink,
  Wrench, Clock, FileText, Shield, Info, RefreshCw, Map, Tag, Cookie,
  Languages, Bot, ChevronDown, Smartphone, Building2,
} from 'lucide-react'
import { useTranslation } from 'react-i18next'

const TRANSLATABLE_TABS = ['general', 'seo', 'site_mode', 'pages', 'cookies']

const LOCALES = [
  { code: 'default', label: 'Default', flag: '🌐' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'fr', label: 'FR', flag: '🇫🇷' },
  { code: 'es', label: 'ES', flag: '🇪🇸' },
  { code: 'ar', label: 'AR', flag: '🇸🇦' },
]

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
  sale_enabled: '1',
  rent_enabled: '1',
  projects_enabled: '1',
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
  const { t } = useTranslation()

  const TABS = [
    { id: 'general',    label: t('admin.settings.tabGeneral'),    icon: Globe },
    { id: 'theme',      label: t('admin.settings.tabTheme'),      icon: Palette },
    { id: 'watermark',  label: t('admin.settings.tabWatermark'),  icon: Droplets },
    { id: 'contact',    label: t('admin.settings.tabContact'),    icon: Mail },
    { id: 'social',     label: t('admin.settings.tabSocial'),     icon: Instagram },
    { id: 'seo',        label: t('admin.settings.tabSeo'),        icon: Globe },
    { id: 'mail',       label: t('admin.settings.tabMail'),       icon: Server },
    { id: 'google',     label: t('admin.settings.tabGoogle'),     icon: KeyRound },
    { id: 'ai',         label: t('admin.settings.tabAi'),         icon: Bot },
    { id: 'site_mode',  label: t('admin.settings.tabSiteMode'),   icon: Wrench },
    { id: 'pages',      label: t('admin.settings.tabPages'),      icon: FileText },
    { id: 'cookies',    label: t('admin.settings.tabCookies'),    icon: Cookie },
    { id: 'mobile_app', label: t('admin.settings.tabMobileApp'),  icon: Smartphone },
    { id: 'listings',   label: 'Listings',                        icon: Building2 },
  ]

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
        try {
          const stored = sessionStorage.getItem('mahalo_settings')
          if (stored) setForm(prev => ({ ...prev, ...JSON.parse(stored) }))
        } catch {}
      })
      .finally(() => setLoading(false))
  }, [])

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

  const tf = (k) => (e) => {
    if (isLocaleMode) setTransForm(p => ({ ...p, [k]: e.target.value }))
    else setForm(p => ({ ...p, [k]: e.target.value }))
  }
  const tv = (k) => { if (isLocaleMode) return transForm[k] ?? ''; return form[k] ?? '' }
  const tp = (k, fallback = '') => { if (isLocaleMode) return transDefaults[k] || form[k] || fallback; return fallback }

  const uploadLogo = async (field, file) => {
    if (!file) return
    setUploading(u => ({ ...u, [field]: true }))
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', 'logos')
      const r = await adminSettings.uploadLogo(fd)
      setForm(p => ({ ...p, [field]: r.url || r.data?.url }))
    } catch (err) { alert(t('admin.settings.logoUploadFailed') + ': ' + (err?.message || 'unknown error')) } finally {
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
        try { sessionStorage.setItem('mahalo_settings', JSON.stringify(form)) } catch {}
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } finally { setSaving(false) }
  }

  if (loading) {
    return (
      <div>
        <PageHeader title={t('admin.settings.pageTitle')} subtitle={t('admin.common.loading')} />
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
      <PageHeader title={t('admin.settings.pageTitle')} subtitle={t('admin.settings.pageSubtitle')}>
        <div className="flex items-center gap-2">
          {(saved || transSaved) && (
            <div className="flex items-center gap-1.5 text-emerald-600 text-sm font-medium">
              <CheckCircle size={15} /> {t('admin.settings.saved')}
            </div>
          )}
          <Btn type="submit" variant="gold" form="settings-form" disabled={saving}>
            <Save size={14} /> {saving ? t('admin.common.saving') : t('admin.settings.saveBtn')}
          </Btn>
        </div>
      </PageHeader>

      <div className="flex flex-wrap gap-1 mb-4 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === id ? 'bg-[#730D26] text-white shadow-sm' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tabHasTranslations && (
        <div className="flex items-center gap-3 mb-6 bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
            <Languages size={14} className="text-[#BA1932]" />
            {t('admin.settings.langLabel')}
          </div>
          <div className="flex gap-1">
            {LOCALES.map(({ code, label, flag }) => (
              <button key={code} type="button" onClick={() => setLocale(code)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  locale === code ? 'bg-[#BA1932] text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50 border border-gray-100'
                }`}
              >
                <span>{flag}</span>
                {label}
              </button>
            ))}
          </div>
          {isLocaleMode && (
            <p className="text-xs text-gray-400 ml-auto">
              {t('admin.settings.editingLang', { lang: LOCALES.find(l => l.code === locale)?.label })}
            </p>
          )}
          {transLoading && (
            <div className="ml-2 w-4 h-4 border-2 border-[#BA1932] border-t-transparent rounded-full animate-spin" />
          )}
        </div>
      )}

      <form id="settings-form" onSubmit={submit} className="space-y-6">

        {tab === 'general' && (
          <>
            <Section title={t('admin.settings.sectionGeneral')} icon={Globe}>
              {isLocaleMode ? (
                <>
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-center gap-2">
                    <Info size={13} className="shrink-0" />
                    {t('admin.settings.translatableNote')}
                  </div>
                  <FormField label={t('admin.settings.fieldTagline')} hint={`${t('admin.settings.defaultHint')}: "${transDefaults.tagline || form.tagline}"`}>
                    <Input value={tv('tagline')} onChange={tf('tagline')} placeholder={tp('tagline', "Morocco's Most Trusted Real Estate Platform")} />
                  </FormField>
                  <FormField label={t('admin.settings.fieldFooterDesc')} hint={`${t('admin.settings.defaultHint')}: "${(transDefaults.footer_description || form.footer_description)?.substring(0, 60)}…"`}>
                    <Textarea value={tv('footer_description')} onChange={tf('footer_description')} rows={3} placeholder={tp('footer_description', 'Premium real estate experiences in Morocco…')} />
                  </FormField>
                </>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label={t('admin.settings.fieldSiteName')} required>
                      <Input value={form.site_name} onChange={f('site_name')} placeholder="Mahalo" />
                    </FormField>
                    <FormField label={t('admin.settings.fieldCurrency')}>
                      <Input value={form.currency} onChange={f('currency')} placeholder="MAD" />
                    </FormField>
                  </div>
                  <FormField label={t('admin.settings.fieldTagline')}>
                    <Input value={form.tagline} onChange={f('tagline')} placeholder="Morocco's Most Trusted Real Estate Platform" />
                  </FormField>
                  <FormField label={t('admin.settings.fieldPropsPerPage')}>
                    <Input type="number" min="4" max="48" value={form.properties_per_page} onChange={f('properties_per_page')} />
                  </FormField>
                  <FormField label={t('admin.settings.fieldFooterDesc')} hint={t('admin.settings.fieldFooterDescHint')}>
                    <Textarea value={form.footer_description} onChange={f('footer_description')} rows={3} placeholder="Premium real estate experiences in Morocco…" />
                  </FormField>
                </>
              )}
            </Section>
          </>
        )}

        {tab === 'theme' && (
          <>
            <Section title={t('admin.settings.sectionBrandColors')} icon={Palette}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ColorField label={t('admin.settings.fieldPrimaryColor')} hint={t('admin.settings.fieldPrimaryColorHint')} value={form.primary_color} onChange={f('primary_color')} />
                <ColorField label={t('admin.settings.fieldSecondaryColor')} hint={t('admin.settings.fieldSecondaryColorHint')} value={form.secondary_color} onChange={f('secondary_color')} />
                <ColorField label={t('admin.settings.fieldBgColor')} hint={t('admin.settings.fieldBgColorHint')} value={form.accent_color} onChange={f('accent_color')} />
              </div>
            </Section>
            <Section title={t('admin.settings.sectionLogos')} icon={Image}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LogoField label={t('admin.settings.fieldMainLogo')} hint={t('admin.settings.fieldMainLogoHint')} value={form.logo_url} field="logo_url" uploading={uploading.logo_url} onChange={uploadLogo} uploadLabel={t('admin.settings.clickToUpload')} />
                <LogoField label={t('admin.settings.fieldFooterLogo')} hint={t('admin.settings.fieldFooterLogoHint')} value={form.footer_logo_url} field="footer_logo_url" uploading={uploading.footer_logo_url} onChange={uploadLogo} uploadLabel={t('admin.settings.clickToUpload')} />
              </div>
            </Section>
          </>
        )}

        {tab === 'watermark' && (
          <>
            <Section title={t('admin.settings.sectionWatermark')} icon={Droplets}>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 flex items-start gap-3 mb-2">
                <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <p className="text-xs text-blue-700">{t('admin.settings.watermarkNote')}</p>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t('admin.settings.watermarkEnable')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t('admin.settings.watermarkEnableHint')}</p>
                </div>
                <div
                  onClick={() => setForm(p => ({ ...p, watermark_enabled: p.watermark_enabled === '1' ? '0' : '1' }))}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${form.watermark_enabled === '1' ? 'bg-[#BA1932]' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.watermark_enabled === '1' ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LogoField label={t('admin.settings.fieldWatermarkLogo')} hint={t('admin.settings.fieldWatermarkLogoHint')} value={form.watermark_logo_url} field="watermark_logo_url" uploading={uploading.watermark_logo_url} onChange={uploadLogo} uploadLabel={t('admin.settings.clickToUpload')} />
                <div className="space-y-4">
                  <FormField label={t('admin.settings.fieldWatermarkPosition')}>
                    <select value={form.watermark_position} onChange={f('watermark_position')} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932]">
                      {WATERMARK_POSITIONS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                    </select>
                  </FormField>
                  <FormField label={t('admin.settings.fieldWatermarkOpacity')} hint={`${form.watermark_opacity}%`}>
                    <input type="range" min="10" max="100" step="5" value={form.watermark_opacity} onChange={f('watermark_opacity')} className="w-full accent-[#BA1932]" />
                  </FormField>
                  <FormField label={t('admin.settings.fieldWatermarkSize')} hint={`${form.watermark_size}% ${t('admin.settings.ofImageWidth')}`}>
                    <input type="range" min="5" max="50" step="5" value={form.watermark_size} onChange={f('watermark_size')} className="w-full accent-[#BA1932]" />
                  </FormField>
                </div>
              </div>
              <WatermarkPreview logo={form.watermark_logo_url} position={form.watermark_position} opacity={form.watermark_opacity} size={form.watermark_size} enabled={form.watermark_enabled === '1'} previewLabel={t('admin.settings.livePreview')} sampleLabel={t('admin.settings.sampleImage')} disabledLabel={t('admin.settings.watermarkDisabled')} posLabel={t('admin.settings.position')} opacityLabel={t('admin.settings.opacity')} sizeLabel={t('admin.settings.size')} />
            </Section>
          </>
        )}

        {tab === 'contact' && (
          <>
            <Section title={t('admin.settings.sectionContact')} icon={Mail}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label={t('admin.settings.fieldContactEmail')}>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input value={form.contact_email} onChange={f('contact_email')} className="pl-9" placeholder="contact@mahalo.ma" />
                  </div>
                </FormField>
                <FormField label={t('admin.settings.fieldContactPhone')}>
                  <div className="relative">
                    <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input value={form.contact_phone} onChange={f('contact_phone')} className="pl-9" placeholder="+212 600 000 000" />
                  </div>
                </FormField>
              </div>
              <FormField label={t('admin.settings.fieldAddress')}>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.address} onChange={f('address')} className="pl-9" placeholder="Casablanca, Morocco" />
                </div>
              </FormField>
              <FormField label={t('admin.settings.fieldWhatsapp')} hint={t('admin.settings.fieldWhatsappHint')}>
                <Input value={form.whatsapp_number} onChange={f('whatsapp_number')} placeholder="+212600000000" />
              </FormField>
            </Section>
          </>
        )}

        {tab === 'social' && (
          <>
            <Section title={t('admin.settings.sectionSocial')} icon={Instagram}>
              <FormField label={t('admin.settings.fieldFacebook')}>
                <div className="relative">
                  <Facebook size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.facebook_url} onChange={f('facebook_url')} className="pl-9" placeholder="https://facebook.com/mahalo" />
                </div>
              </FormField>
              <FormField label={t('admin.settings.fieldInstagram')}>
                <div className="relative">
                  <Instagram size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.instagram_url} onChange={f('instagram_url')} className="pl-9" placeholder="https://instagram.com/mahalo" />
                </div>
              </FormField>
              <FormField label={t('admin.settings.fieldTwitter')}>
                <div className="relative">
                  <Twitter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.twitter_url} onChange={f('twitter_url')} className="pl-9" placeholder="https://twitter.com/mahalo" />
                </div>
              </FormField>
              <FormField label={t('admin.settings.fieldYoutube')}>
                <Input value={form.youtube_url} onChange={f('youtube_url')} placeholder="https://youtube.com/@mahalo" />
              </FormField>
            </Section>
          </>
        )}

        {tab === 'seo' && (
          <>
            <Section title={t('admin.settings.sectionSeo')} icon={Globe}>
              {isLocaleMode ? (
                <>
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-center gap-2 mb-1">
                    <Info size={13} className="shrink-0" />
                    {t('admin.settings.seoTranslatableNote')}
                  </div>
                  <FormField label={t('admin.settings.fieldSeoTitle')} hint={`${t('admin.settings.defaultHint')}: "${transDefaults.seo_title || form.seo_title}"`}>
                    <Input value={tv('seo_title')} onChange={tf('seo_title')} placeholder={tp('seo_title', 'Mahalo — Premium Real Estate in Morocco')} />
                  </FormField>
                  <FormField label={t('admin.settings.fieldMetaDesc')} hint={`${t('admin.settings.defaultHint')}: "${(transDefaults.seo_description || form.seo_description)?.substring(0, 60)}…"`}>
                    <Textarea value={tv('seo_description')} onChange={tf('seo_description')} rows={3} placeholder={tp('seo_description', 'Find your dream property in Morocco...')} />
                  </FormField>
                  <FormField label={t('admin.settings.fieldKeywords')} hint={t('admin.settings.keywordsHint')}>
                    <div className="relative">
                      <Tag size={14} className="absolute left-3.5 top-3 text-gray-400" />
                      <Textarea value={tv('seo_keywords')} onChange={tf('seo_keywords')} rows={2} className="pl-9" placeholder={tp('seo_keywords', 'immobilier maroc, real estate morocco…')} />
                    </div>
                  </FormField>
                </>
              ) : (
                <>
                  <FormField label={t('admin.settings.fieldSeoTitle')} hint={t('admin.settings.fieldSeoTitleHint')}>
                    <Input value={form.seo_title} onChange={f('seo_title')} placeholder="Mahalo — Premium Real Estate in Morocco" />
                  </FormField>
                  <FormField label={t('admin.settings.fieldMetaDesc')}>
                    <Textarea value={form.seo_description} onChange={f('seo_description')} rows={3} placeholder="Find your dream property in Morocco..." />
                  </FormField>
                  <FormField label={t('admin.settings.fieldKeywords')} hint={t('admin.settings.fieldKeywordsHint')}>
                    <div className="relative">
                      <Tag size={14} className="absolute left-3.5 top-3 text-gray-400" />
                      <Textarea value={form.seo_keywords} onChange={f('seo_keywords')} rows={2} className="pl-9" placeholder="immobilier maroc, real estate morocco…" />
                    </div>
                  </FormField>
                  <FormField label={t('admin.settings.fieldGaId')} hint="e.g. G-XXXXXXXXXX or UA-XXXXXXXXX-X">
                    <Input value={form.google_analytics_id} onChange={f('google_analytics_id')} placeholder="G-XXXXXXXXXX" />
                  </FormField>
                  <FormField label={t('admin.settings.fieldGoogleVerify')} hint={t('admin.settings.fieldGoogleVerifyHint')}>
                    <Input value={form.google_site_verification} onChange={f('google_site_verification')} placeholder={t('admin.settings.pasteVerifyCode')} className="font-mono text-sm" />
                  </FormField>
                </>
              )}
            </Section>

            {!isLocaleMode && (
              <Section title={t('admin.settings.sectionSitemap')} icon={Map}>
                <p className="text-sm text-gray-500 mb-4">{t('admin.settings.sitemapNote')} <code className="bg-gray-100 px-1.5 py-0.5 rounded-lg text-xs font-mono">/sitemap.xml</code>.</p>
                <div className="flex flex-wrap items-center gap-3">
                  <Btn type="button" variant="ghost" disabled={pinging} onClick={async () => {
                    setPinging(true); setPingResult(null)
                    try {
                      const r = await adminSettings.sitemapPing()
                      const results = r?.data?.results || {}
                      const lines = Object.entries(results).map(([e, s]) => `${e}: ${s}`).join(' · ')
                      setPingResult({ ok: true, msg: `${t('admin.settings.pinged')} — ${lines}` })
                    } catch (e) {
                      setPingResult({ ok: false, msg: e?.message || t('admin.settings.pingFailed') })
                    } finally { setPinging(false) }
                  }}>
                    <RefreshCw size={14} className={pinging ? 'animate-spin' : ''} />
                    {pinging ? t('admin.settings.pinging') : t('admin.settings.pingBtn')}
                  </Btn>
                  <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-all">
                    <ExternalLink size={13} /> {t('admin.settings.viewSitemap')}
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

        {tab === 'mail' && (
          <>
            <Section title={t('admin.settings.sectionSmtp')} icon={Server}>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 flex items-start gap-3">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <div>
                  <p className="font-semibold mb-1">{t('admin.settings.smtpEnvNote')}</p>
                  <p className="text-xs text-blue-700">
                    {t('admin.settings.smtpEnvNoteDetail')} <code className="bg-blue-100 px-1 rounded">.env</code>.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {[
                  { label: t('admin.settings.smtpMailer'),     value: 'MAIL_MAILER' },
                  { label: t('admin.settings.smtpHost'),       value: 'MAIL_HOST' },
                  { label: t('admin.settings.smtpPort'),       value: 'MAIL_PORT' },
                  { label: t('admin.settings.smtpEncryption'), value: 'MAIL_ENCRYPTION' },
                  { label: t('admin.settings.smtpUsername'),   value: 'MAIL_USERNAME' },
                  { label: t('admin.settings.smtpPassword'),   value: 'MAIL_PASSWORD' },
                  { label: t('admin.settings.smtpFrom'),       value: 'MAIL_FROM_ADDRESS' },
                  { label: t('admin.settings.smtpFromName'),   value: 'MAIL_FROM_NAME' },
                ].map(({ label, value }) => (
                  <div key={value} className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl">
                    <span className="text-xs font-semibold text-gray-500">{label}</span>
                    <code className="text-xs text-gray-700 bg-gray-100 px-2 py-0.5 rounded-lg font-mono">{value}</code>
                  </div>
                ))}
              </div>
            </Section>
            <Section title={t('admin.settings.sectionTestMail')} icon={Send}>
              <p className="text-sm text-gray-500">{t('admin.settings.testMailNote')}</p>
              <div className="flex items-center gap-3 pt-1">
                <Btn type="button" variant="ghost" disabled={testing} onClick={async () => {
                  setTesting(true); setTestResult(null)
                  try {
                    const r = await adminSettings.testMail(form.contact_email || 'test@example.com')
                    setTestResult({ ok: true, msg: r?.message || t('admin.settings.testMailSuccess') })
                  } catch (e) {
                    setTestResult({ ok: false, msg: e?.response?.data?.message || e?.message || t('admin.settings.testMailFailed') })
                  } finally { setTesting(false) }
                }}>
                  <Send size={14} /> {testing ? t('admin.settings.sending') : t('admin.settings.sendTestBtn')}
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

        {tab === 'google' && (
          <>
            <Section title={t('admin.settings.sectionGoogleOAuth')} icon={KeyRound}>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 mb-2 leading-relaxed">
                {t('admin.settings.googleOAuthNote')}{' '}
                <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noreferrer" className="underline font-semibold inline-flex items-center gap-0.5">
                  Google Cloud Console <ExternalLink size={10} />
                </a>
                {' '}→ Create OAuth 2.0 Client ID (Web application).
              </div>
              <div className="mb-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">{t('admin.settings.redirectUri')}</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3.5 py-2.5 text-xs bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-mono truncate">
                    {window.location.origin}/api/v1/auth/google/callback
                  </code>
                  <button type="button" onClick={copyRedirectUri} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-600 transition-all flex-shrink-0">
                    <Copy size={13} /> {copied ? t('admin.settings.copied') : t('admin.settings.copy')}
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1.5">{t('admin.settings.redirectUriHint')}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 pt-1">
                <FormField label={t('admin.settings.fieldClientId')} hint="Ends with .apps.googleusercontent.com">
                  <Input value={form.google_client_id} onChange={f('google_client_id')} placeholder="123456789-xxxxxxxxxxxx.apps.googleusercontent.com" />
                </FormField>
                <FormField label={t('admin.settings.fieldClientSecret')}>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showSecret ? 'text' : 'password'} value={form.google_client_secret} onChange={f('google_client_secret')} placeholder="GOCSPX-xxxxxxxxxxxxxxxx"
                      className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932]" />
                    <button type="button" onClick={() => setShowSecret(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </FormField>
              </div>
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium mt-2 ${form.google_client_id && form.google_client_secret ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                {form.google_client_id && form.google_client_secret
                  ? <><CheckCircle size={15} /> {t('admin.settings.googleConfigured')}</>
                  : <><AlertCircle size={15} /> {t('admin.settings.googleNotConfigured')}</>}
              </div>
            </Section>
          </>
        )}

        {tab === 'ai' && (
          <>
            <Section title={t('admin.settings.sectionGroq')} icon={Bot}>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 mb-2 leading-relaxed">
                {t('admin.settings.groqNote')}{' '}
                <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="underline font-semibold inline-flex items-center gap-0.5">
                  console.groq.com <ExternalLink size={10} />
                </a>.
              </div>
              <FormField label={t('admin.settings.fieldGroqKey')} hint={t('admin.settings.fieldGroqKeyHint')}>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type={showGroqKey ? 'text' : 'password'} value={form.groq_api_key} onChange={f('groq_api_key')} placeholder="gsk_••••••••••••••••••••••••"
                    className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932] font-mono" />
                  <button type="button" onClick={() => setShowGroqKey(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showGroqKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </FormField>
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium ${form.groq_api_key ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                {form.groq_api_key ? <><CheckCircle size={15} /> {t('admin.settings.groqConfigured')}</> : <><AlertCircle size={15} /> {t('admin.settings.groqNotConfigured')}</>}
              </div>
            </Section>
            <Section title={t('admin.settings.sectionAiModel')} icon={Bot}>
              <FormField label={t('admin.settings.fieldAiModel')} hint={t('admin.settings.fieldAiModelHint')}>
                <div className="grid grid-cols-1 gap-2">
                  {GROQ_MODELS.map((m) => (
                    <label key={m.value} className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${form.ai_model === m.value ? 'border-[#BA1932] bg-[#BA1932]/5 ring-1 ring-[#BA1932]/20' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`}>
                      <input type="radio" name="ai_model" value={m.value} checked={form.ai_model === m.value} onChange={f('ai_model')} className="accent-[#BA1932]" />
                      <div className="flex-1">
                        <span className="text-sm font-semibold text-gray-800">{m.label}</span>
                        <span className="text-xs text-gray-400 ml-2 font-mono">{m.value}</span>
                      </div>
                      {m.badge && (
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${m.badge === 'Recommended' ? 'bg-emerald-100 text-emerald-700' : m.badge === 'Fast' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'}`}>
                          {m.badge}
                        </span>
                      )}
                    </label>
                  ))}
                </div>
              </FormField>
              <div className="flex items-center gap-3 pt-1">
                <Btn type="button" variant="ghost" disabled={testingAi} onClick={async () => {
                  setTestingAi(true); setAiTestResult(null)
                  try {
                    const res = await fetch('/api/v1/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'Reply with exactly: OK' }) })
                    const data = await res.json()
                    if (data.reply) setAiTestResult({ ok: true, msg: `${t('admin.settings.modelResponded')}: "${data.reply.substring(0, 60)}"` })
                    else setAiTestResult({ ok: false, msg: data.error || t('admin.settings.noReply') })
                  } catch (e) {
                    setAiTestResult({ ok: false, msg: e.message || t('admin.settings.requestFailed') })
                  } finally { setTestingAi(false) }
                }}>
                  <Bot size={14} /> {testingAi ? t('admin.settings.testing') : t('admin.settings.testAiBtn')}
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

        {tab === 'site_mode' && (
          <>
            <Section title={t('admin.settings.sectionMaintenance')} icon={Wrench}>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-800 flex items-start gap-3 mb-2">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0 text-amber-500" />
                <div>
                  <p className="font-semibold mb-0.5">{t('admin.settings.attention')}</p>
                  <p className="text-xs text-amber-700">{t('admin.settings.maintenanceWarning')} <code className="bg-amber-100 px-1 rounded">?bypass=1</code>.</p>
                </div>
              </div>
              {!isLocaleMode && (
                <>
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{t('admin.settings.enableMaintenance')}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t('admin.settings.enableMaintenanceHint')}</p>
                    </div>
                    <div onClick={() => setForm(p => ({ ...p, maintenance_mode: p.maintenance_mode === '1' ? '0' : '1' }))}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${form.maintenance_mode === '1' ? 'bg-[#BA1932]' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.maintenance_mode === '1' ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                  {form.maintenance_mode === '1' && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 font-medium">
                      <Wrench size={14} /> {t('admin.settings.maintenanceActive')}
                    </div>
                  )}
                </>
              )}
              <FormField label={t('admin.settings.fieldMaintenanceMsg')} hint={isLocaleMode ? `${t('admin.settings.defaultHint')}: "${(transDefaults.maintenance_message || form.maintenance_message)?.substring(0, 60)}…"` : t('admin.settings.fieldMaintenanceMsgHint')}>
                <Textarea value={isLocaleMode ? tv('maintenance_message') : form.maintenance_message} onChange={isLocaleMode ? tf('maintenance_message') : f('maintenance_message')} rows={3} placeholder={isLocaleMode ? tp('maintenance_message', 'Site is temporarily offline…') : 'Notre site est temporairement hors ligne pour maintenance…'} />
              </FormField>
            </Section>
            <Section title={t('admin.settings.sectionComingSoon')} icon={Clock}>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800 flex items-start gap-3 mb-2">
                <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
                <p className="text-xs text-blue-700">{t('admin.settings.comingSoonNote')} <code className="bg-blue-100 px-1 rounded">?bypass=1</code>.</p>
              </div>
              {!isLocaleMode && (
                <>
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{t('admin.settings.enableComingSoon')}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t('admin.settings.enableComingSoonHint')}</p>
                    </div>
                    <div onClick={() => setForm(p => ({ ...p, coming_soon_mode: p.coming_soon_mode === '1' ? '0' : '1' }))}
                      className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${form.coming_soon_mode === '1' ? 'bg-[#BA1932]' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.coming_soon_mode === '1' ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                  </div>
                  {form.coming_soon_mode === '1' && (
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-600 font-medium">
                      <Clock size={14} /> {t('admin.settings.comingSoonActive')}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label={t('admin.settings.fieldLaunchDate')} hint={t('admin.settings.fieldLaunchDateHint')}>
                      <input type="datetime-local" value={form.coming_soon_date} onChange={f('coming_soon_date')} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932]" />
                    </FormField>
                  </div>
                </>
              )}
              <FormField label={t('admin.settings.fieldComingSoonMsg')} hint={isLocaleMode ? `${t('admin.settings.defaultHint')}: "${(transDefaults.coming_soon_message || form.coming_soon_message)?.substring(0, 60)}…"` : t('admin.settings.fieldComingSoonMsgHint')}>
                <Textarea value={isLocaleMode ? tv('coming_soon_message') : form.coming_soon_message} onChange={isLocaleMode ? tf('coming_soon_message') : f('coming_soon_message')} rows={3} placeholder={isLocaleMode ? tp('coming_soon_message', "We're preparing something exceptional…") : "Nous préparons quelque chose d'exceptionnel…"} />
              </FormField>
            </Section>
          </>
        )}

        {tab === 'pages' && (
          <>
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-700 flex items-start gap-3 mb-2">
              <Info size={16} className="mt-0.5 flex-shrink-0 text-blue-500" />
              <p className="text-xs leading-relaxed">{isLocaleMode ? t('admin.settings.pagesTranslatableNote') : t('admin.settings.pagesNote')}</p>
            </div>
            <Section title={t('admin.settings.sectionAbout')} icon={Info}>
              <FormField label={t('admin.settings.fieldAboutContent')} hint={isLocaleMode ? t('admin.settings.leaveEmptyDefault') : t('admin.settings.fieldAboutContentHint')}>
                <textarea value={isLocaleMode ? tv('page_about') : form.page_about} onChange={isLocaleMode ? tf('page_about') : f('page_about')} rows={10} placeholder={isLocaleMode ? (transDefaults.page_about || form.page_about || t('admin.settings.leaveEmptyDefault') + '…') : "Fondée à Casablanca, Mahalo a été créée sur une conviction simple…\n\nNous avons démarré parce que…"} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932] font-mono leading-relaxed resize-y" />
              </FormField>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span>{t('admin.settings.previewOn')}</span>
                <a href="/about" target="_blank" rel="noreferrer" className="text-[#BA1932] hover:underline inline-flex items-center gap-1">/about <ExternalLink size={10} /></a>
              </p>
            </Section>
            <Section title={t('admin.settings.sectionPrivacy')} icon={Shield}>
              <FormField label={t('admin.settings.fieldContent')} hint={isLocaleMode ? t('admin.settings.leaveEmptyDefault') : t('admin.settings.privacyHint')}>
                <textarea value={isLocaleMode ? tv('page_privacy') : form.page_privacy} onChange={isLocaleMode ? tf('page_privacy') : f('page_privacy')} rows={14} placeholder={isLocaleMode ? (transDefaults.page_privacy || form.page_privacy || t('admin.settings.leaveEmptyDefault') + '…') : "## 1. Collecte des données\nNous collectons les informations…\n\n## 2. Utilisation des données\n…"} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932] font-mono leading-relaxed resize-y" />
              </FormField>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span>{t('admin.settings.previewOn')}</span>
                <a href="/privacy" target="_blank" rel="noreferrer" className="text-[#BA1932] hover:underline inline-flex items-center gap-1">/privacy <ExternalLink size={10} /></a>
              </p>
            </Section>
            <Section title={t('admin.settings.sectionTerms')} icon={FileText}>
              <FormField label={t('admin.settings.fieldContent')} hint={isLocaleMode ? t('admin.settings.leaveEmptyDefault') : t('admin.settings.termsHint')}>
                <textarea value={isLocaleMode ? tv('page_terms') : form.page_terms} onChange={isLocaleMode ? tf('page_terms') : f('page_terms')} rows={14} placeholder={isLocaleMode ? (transDefaults.page_terms || form.page_terms || t('admin.settings.leaveEmptyDefault') + '…') : "## 1. Acceptation des conditions\nEn accédant à notre plateforme…\n\n## 2. Description du service\n…"} className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932] font-mono leading-relaxed resize-y" />
              </FormField>
              <p className="text-xs text-gray-400 flex items-center gap-1.5">
                <span>{t('admin.settings.previewOn')}</span>
                <a href="/terms" target="_blank" rel="noreferrer" className="text-[#BA1932] hover:underline inline-flex items-center gap-1">/terms <ExternalLink size={10} /></a>
              </p>
            </Section>
          </>
        )}

        {tab === 'cookies' && (
          <>
            {!isLocaleMode && (
              <Section title={t('admin.settings.sectionCookieBanner')} icon={Cookie}>
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{t('admin.settings.enableCookieBanner')}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{t('admin.settings.enableCookieBannerHint')}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={form.cookie_consent_enabled === '1'} onChange={fBool('cookie_consent_enabled')} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#730D26]" />
                  </label>
                </div>
                <FormField label={t('admin.settings.fieldCookiePolicyUrl')} hint={t('admin.settings.fieldCookiePolicyUrlHint')}>
                  <Input value={form.cookie_policy_url} onChange={f('cookie_policy_url')} placeholder="/privacy" />
                </FormField>
              </Section>
            )}
            <Section title={isLocaleMode ? `${t('admin.settings.bannerTextFor')} — ${LOCALES.find(l => l.code === locale)?.flag} ${LOCALES.find(l => l.code === locale)?.label}` : t('admin.settings.sectionBannerText')} icon={Cookie}>
              {isLocaleMode ? (
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-start gap-2">
                  <Info size={13} className="shrink-0 mt-0.5" />
                  <span>{t('admin.settings.cookieTranslateNote', { lang: LOCALES.find(l => l.code === locale)?.label })}</span>
                </div>
              ) : (
                <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-xs text-gray-500 flex items-start gap-2">
                  <Info size={13} className="shrink-0 mt-0.5" />
                  <span>{t('admin.settings.cookieDefaultNote')}</span>
                </div>
              )}
              <FormField label={t('admin.settings.fieldBannerTitle')} hint={isLocaleMode ? `${t('admin.settings.defaultHint')}: "${transDefaults.cookie_consent_title || form.cookie_consent_title}"` : t('admin.settings.fieldBannerTitleHint')}>
                <Input value={isLocaleMode ? tv('cookie_consent_title') : form.cookie_consent_title} onChange={isLocaleMode ? tf('cookie_consent_title') : f('cookie_consent_title')} placeholder={isLocaleMode ? tp('cookie_consent_title', 'We use cookies') : 'We use cookies'} />
              </FormField>
              <FormField label={t('admin.settings.fieldBannerMessage')} hint={isLocaleMode ? `${t('admin.settings.defaultHint')}: "${(transDefaults.cookie_consent_message || form.cookie_consent_message)?.substring(0, 70)}…"` : t('admin.settings.fieldBannerMessageHint')}>
                <Textarea value={isLocaleMode ? tv('cookie_consent_message') : form.cookie_consent_message} onChange={isLocaleMode ? tf('cookie_consent_message') : f('cookie_consent_message')} rows={3} placeholder={isLocaleMode ? tp('cookie_consent_message', 'We use cookies to enhance your experience…') : 'We use cookies to enhance your experience, analyse traffic, and personalise content.'} />
              </FormField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label={t('admin.settings.fieldAcceptBtn')} hint={isLocaleMode ? `${t('admin.settings.defaultHint')}: "${transDefaults.cookie_accept_text || form.cookie_accept_text}"` : t('admin.settings.fieldAcceptBtnHint')}>
                  <Input value={isLocaleMode ? tv('cookie_accept_text') : form.cookie_accept_text} onChange={isLocaleMode ? tf('cookie_accept_text') : f('cookie_accept_text')} placeholder={isLocaleMode ? tp('cookie_accept_text', 'Accept All') : 'Accept All'} />
                </FormField>
                <FormField label={t('admin.settings.fieldDeclineBtn')} hint={isLocaleMode ? `${t('admin.settings.defaultHint')}: "${transDefaults.cookie_decline_text || form.cookie_decline_text}"` : t('admin.settings.fieldDeclineBtnHint')}>
                  <Input value={isLocaleMode ? tv('cookie_decline_text') : form.cookie_decline_text} onChange={isLocaleMode ? tf('cookie_decline_text') : f('cookie_decline_text')} placeholder={isLocaleMode ? tp('cookie_decline_text', 'Decline') : 'Decline'} />
                </FormField>
              </div>
            </Section>
            <Section title={t('admin.settings.sectionLivePreview')} icon={Eye}>
              <p className="text-xs text-gray-400 -mt-1 mb-3">{t('admin.settings.livePreviewNote')}</p>
              <CookieBannerPreview
                title={isLocaleMode ? (tv('cookie_consent_title') || transDefaults.cookie_consent_title || form.cookie_consent_title) : form.cookie_consent_title}
                message={isLocaleMode ? (tv('cookie_consent_message') || transDefaults.cookie_consent_message || form.cookie_consent_message) : form.cookie_consent_message}
                acceptTxt={isLocaleMode ? (tv('cookie_accept_text') || transDefaults.cookie_accept_text || form.cookie_accept_text) : form.cookie_accept_text}
                declineTxt={isLocaleMode ? (tv('cookie_decline_text') || transDefaults.cookie_decline_text || form.cookie_decline_text) : form.cookie_decline_text}
                policyUrl={form.cookie_policy_url || '/privacy'}
                enabled={form.cookie_consent_enabled === '1'}
                disabledMsg={t('admin.settings.cookieBannerDisabled')}
              />
            </Section>
          </>
        )}

        {tab === 'mobile_app' && (
          <>
            <Section title={t('admin.settings.sectionMobileApp')} icon={Smartphone}>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 flex items-start gap-3">
                <Info size={13} className="shrink-0 mt-0.5" /> {t('admin.settings.mobileAppNote')}
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{t('admin.settings.showMobileApp')}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t('admin.settings.showMobileAppHint')}</p>
                </div>
                <div onClick={() => setForm(p => ({ ...p, mobile_app_enabled: p.mobile_app_enabled === '1' ? '0' : '1' }))}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${form.mobile_app_enabled === '1' ? 'bg-[#BA1932]' : 'bg-gray-200'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.mobile_app_enabled === '1' ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
              {form.mobile_app_enabled === '0' && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-600 font-medium">
                  <AlertCircle size={14} /> {t('admin.settings.mobileAppHidden')}
                </div>
              )}
            </Section>
            <Section title={t('admin.settings.sectionMobileContent')} icon={FileText}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label={t('admin.settings.fieldAppHeading1')} hint={t('admin.settings.fieldAppHeading1Hint')}>
                  <Input value={form.mobile_app_title} onChange={f('mobile_app_title')} placeholder="Your next home" />
                </FormField>
                <FormField label={t('admin.settings.fieldAppHeading2')} hint={t('admin.settings.fieldAppHeading2Hint')}>
                  <Input value={form.mobile_app_subtitle} onChange={f('mobile_app_subtitle')} placeholder="is in your hands" />
                </FormField>
              </div>
              <FormField label={t('admin.settings.fieldAppDesc')} hint={t('admin.settings.fieldAppDescHint')}>
                <Textarea value={form.mobile_app_description} onChange={f('mobile_app_description')} rows={3} placeholder="Search, save and contact agents on the go…" />
              </FormField>
            </Section>
            <Section title={t('admin.settings.sectionStoreLinks')} icon={ExternalLink}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label={t('admin.settings.fieldAppStore')} hint={t('admin.settings.fieldAppStoreHint')}>
                  <Input value={form.mobile_app_appstore_url} onChange={f('mobile_app_appstore_url')} placeholder="https://apps.apple.com/…" />
                </FormField>
                <FormField label={t('admin.settings.fieldPlayStore')} hint={t('admin.settings.fieldPlayStoreHint')}>
                  <Input value={form.mobile_app_playstore_url} onChange={f('mobile_app_playstore_url')} placeholder="https://play.google.com/store/…" />
                </FormField>
              </div>
            </Section>
          </>
        )}

        {tab === 'listings' && (
          <>
            <Section title="Property Types" icon={Building2}>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Enable Sale Properties</p>
                    <p className="text-xs text-gray-500 mt-0.5">Show "For Sale" listings in the navigation and search filters.</p>
                  </div>
                  <div
                    onClick={() => setForm(p => ({ ...p, sale_enabled: p.sale_enabled === '1' ? '0' : '1' }))}
                    className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${form.sale_enabled === '1' ? 'bg-[#BA1932]' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.sale_enabled === '1' ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>
                {form.sale_enabled === '0' && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-600 font-medium">
                    <AlertCircle size={14} /> Sale properties are hidden from navigation and user interface.
                  </div>
                )}
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Enable Rent Properties</p>
                    <p className="text-xs text-gray-500 mt-0.5">Show "For Rent" listings in the navigation and search filters.</p>
                  </div>
                  <div
                    onClick={() => setForm(p => ({ ...p, rent_enabled: p.rent_enabled === '1' ? '0' : '1' }))}
                    className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${form.rent_enabled === '1' ? 'bg-[#BA1932]' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.rent_enabled === '1' ? 'translate-x-6' : 'translate-x-0'}`} />
                  </div>
                </div>
                {form.rent_enabled === '0' && (
                  <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-600 font-medium">
                    <AlertCircle size={14} /> Rent properties are hidden from navigation and user interface.
                  </div>
                )}
              </div>
            </Section>
            <Section title="Projects Section" icon={Building2}>
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Enable Projects</p>
                  <p className="text-xs text-gray-500 mt-0.5">Show the Projects section in the navigation, homepage, and admin sidebar.</p>
                </div>
                <div
                  onClick={() => setForm(p => ({ ...p, projects_enabled: p.projects_enabled === '1' ? '0' : '1' }))}
                  className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer flex-shrink-0 ${form.projects_enabled === '1' ? 'bg-[#BA1932]' : 'bg-gray-200'}`}
                >
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${form.projects_enabled === '1' ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>
              {form.projects_enabled === '0' && (
                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 border border-amber-100 rounded-xl text-sm text-amber-600 font-medium">
                  <AlertCircle size={14} /> Projects section is hidden from admin sidebar and user interface.
                </div>
              )}
            </Section>
          </>
        )}

        <div className="flex justify-end">
          <Btn type="submit" variant="gold" disabled={saving}>
            <Save size={14} />
            {saving ? t('admin.common.saving') : isLocaleMode
              ? t('admin.settings.saveLangBtn', { lang: LOCALES.find(l => l.code === locale)?.label })
              : t('admin.settings.saveAllBtn')}
          </Btn>
        </div>
      </form>
    </div>
  )
}

function CookieBannerPreview({ title, message, acceptTxt, declineTxt, policyUrl, enabled, disabledMsg }) {
  const previewTitle      = title      || 'We use cookies'
  const previewMessage    = message    || 'We use cookies to enhance your experience.'
  const previewAcceptTxt  = acceptTxt  || 'Accept All'
  const previewDeclineTxt = declineTxt || 'Decline'

  if (!enabled) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-400">
        <Cookie size={14} /> {disabledMsg || 'Cookie banner is disabled.'}
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
            <div className="flex-1 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 text-center">{previewDeclineTxt}</div>
            <div className="flex-1 py-1.5 rounded-xl bg-[#730D26] text-white text-xs font-semibold text-center">{previewAcceptTxt}</div>
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
        <input type="color" value={value || '#000000'} onChange={onChange} className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer p-1 bg-white" />
        <div className="flex-1">
          <input type="text" value={value || ''} onChange={onChange} placeholder="#BA1932" className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932] font-mono" />
        </div>
      </div>
      <div className="h-8 rounded-xl border border-gray-100" style={{ backgroundColor: value || '#ffffff' }} />
    </div>
  )
}

function LogoField({ label, hint, value, field, uploading, onChange, uploadLabel }) {
  const ref = useRef()
  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-600">{label}</label>
      {hint && <p className="text-xs text-gray-400">{hint}</p>}
      <div onClick={() => ref.current?.click()} className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#BA1932]/50 transition-colors min-h-[100px] bg-gray-50">
        {value ? (
          <img src={value} alt={label} className="max-h-16 max-w-full object-contain" onError={(e) => { e.currentTarget.style.display = 'none' }} />
        ) : (
          <>
            <Upload size={20} className="text-gray-300" />
            <span className="text-xs text-gray-400">{uploadLabel || 'Click to upload'}</span>
          </>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-xl">
            <div className="w-5 h-5 border-2 border-[#BA1932] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => e.target.files[0] && onChange(field, e.target.files[0])} />
      {value && <p className="text-xs text-gray-400 truncate">{value}</p>}
    </div>
  )
}

function WatermarkPreview({ logo, position, opacity, size, enabled, previewLabel, sampleLabel, disabledLabel, posLabel, opacityLabel, sizeLabel }) {
  const posMap = {
    'top-left': 'top-3 left-3', 'top-right': 'top-3 right-3',
    'bottom-left': 'bottom-3 left-3', 'bottom-right': 'bottom-3 right-3',
    'center': 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{previewLabel || 'Live Preview'}</p>
        {!enabled && <span className="text-xs bg-amber-50 text-amber-600 border border-amber-100 rounded-lg px-2 py-0.5">{disabledLabel || 'Watermark is disabled'}</span>}
      </div>
      <div className="relative rounded-xl overflow-hidden border border-gray-100" style={{ height: 200, background: 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 50%, #64748b 100%)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="h-full w-full" style={{ backgroundImage: 'repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 1px,transparent 40px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 1px,transparent 40px)' }} />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/60 text-sm font-medium select-none">{sampleLabel || 'Sample Property Image'}</span>
        </div>
        <img src={logo} alt="watermark preview" className={`absolute ${posMap[position] || posMap['bottom-right']} transition-all duration-200`}
          style={{ opacity: enabled ? parseInt(opacity, 10) / 100 : 0.25, width: `${size}%`, objectFit: 'contain', filter: enabled ? 'none' : 'grayscale(1)' }}
          onError={(e) => { e.currentTarget.style.display = 'none' }} />
      </div>
      <p className="text-xs text-gray-400 mt-1.5">
        {posLabel || 'Position'}: <strong>{position}</strong> · {opacityLabel || 'Opacity'}: <strong>{opacity}%</strong> · {sizeLabel || 'Size'}: <strong>{size}% of width</strong>
      </p>
    </div>
  )
}
