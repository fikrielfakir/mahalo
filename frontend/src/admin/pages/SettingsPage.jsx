import { useEffect, useState, useRef } from 'react'
import { adminSettings } from '../api/adminApi'
import { PageHeader, Btn } from '../components/DataTable'
import { FormField, Input, Textarea } from '../components/Modal'
import {
  Save, Globe, Mail, Phone, Instagram, Facebook, Twitter, MapPin,
  CheckCircle, Palette, Upload, Image, Droplets, Eye, EyeOff,
} from 'lucide-react'

const TABS = [
  { id: 'general',  label: 'General',  icon: Globe },
  { id: 'theme',    label: 'Theme',    icon: Palette },
  { id: 'contact',  label: 'Contact',  icon: Mail },
  { id: 'social',   label: 'Social',   icon: Instagram },
  { id: 'seo',      label: 'SEO',      icon: Globe },
]

const DEFAULTS = {
  site_name: 'Homzen',
  tagline: "Morocco's Most Trusted Real Estate Platform",
  contact_email: 'contact@homzen.ma',
  contact_phone: '+212 600 000 000',
  address: 'Casablanca, Morocco',
  whatsapp_number: '',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  youtube_url: '',
  seo_title: 'Homzen — Premium Real Estate in Morocco',
  seo_description: 'Find your dream property in Morocco with Homzen. Browse thousands of verified listings across Casablanca, Marrakech, Rabat and more.',
  google_analytics_id: '',
  currency: 'MAD',
  properties_per_page: '12',
  // Theme
  primary_color: '#C8A97E',
  secondary_color: '#0B1F3A',
  accent_color: '#F7F8FC',
  logo_url: '',
  footer_logo_url: '',
  // Watermark
  watermark_enabled: '0',
  watermark_logo_url: '',
  watermark_position: 'bottom-right',
  watermark_opacity: '60',
  watermark_size: '20',
}

const WATERMARK_POSITIONS = [
  { value: 'top-left',     label: 'Top Left' },
  { value: 'top-right',    label: 'Top Right' },
  { value: 'bottom-left',  label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'center',       label: 'Center' },
]

export default function SettingsPage() {
  const [form, setForm]       = useState(DEFAULTS)
  const [tab, setTab]         = useState('general')
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState({})

  useEffect(() => {
    adminSettings.get()
      .then((r) => { if (r?.data) setForm(prev => ({ ...prev, ...r.data })) })
      .catch(() => {
        const stored = localStorage.getItem('homzen_settings')
        if (stored) { try { setForm(prev => ({ ...prev, ...JSON.parse(stored) })) } catch {} }
      })
      .finally(() => setLoading(false))
  }, [])

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))
  const fBool = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.checked ? '1' : '0' }))

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
      await adminSettings.update(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      localStorage.setItem('homzen_settings', JSON.stringify(form))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
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
          {saved && (
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
      <div className="flex gap-1 mb-6 bg-white border border-gray-100 rounded-2xl p-1.5 shadow-sm w-fit">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === id
                ? 'bg-[#0B1F3A] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      <form id="settings-form" onSubmit={submit} className="space-y-6">

        {/* ── GENERAL TAB ── */}
        {tab === 'general' && (
          <>
            <Section title="General" icon={Globe}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="App / Site Name" required>
                  <Input value={form.site_name} onChange={f('site_name')} placeholder="Homzen" />
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
                  label="Header Logo"
                  hint="Shown in the top navigation bar"
                  value={form.logo_url}
                  field="logo_url"
                  uploading={uploading.logo_url}
                  onChange={uploadLogo}
                />
                <LogoField
                  label="Footer Logo"
                  hint="Shown in the site footer"
                  value={form.footer_logo_url}
                  field="footer_logo_url"
                  uploading={uploading.footer_logo_url}
                  onChange={uploadLogo}
                />
              </div>
            </Section>

            <Section title="Watermark" icon={Droplets}>
              <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl mb-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => setForm(p => ({ ...p, watermark_enabled: p.watermark_enabled === '1' ? '0' : '1' }))}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
                      form.watermark_enabled === '1' ? 'bg-[#C8A97E]' : 'bg-gray-200'
                    }`}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                      form.watermark_enabled === '1' ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {form.watermark_enabled === '1' ? 'Watermark enabled' : 'Watermark disabled'}
                  </span>
                </label>
                <span className="text-xs text-blue-600 ml-auto">
                  When enabled, your watermark logo is stamped on every uploaded image
                </span>
              </div>

              <LogoField
                label="Watermark Logo"
                hint="PNG with transparent background works best"
                value={form.watermark_logo_url}
                field="watermark_logo_url"
                uploading={uploading.watermark_logo_url}
                onChange={uploadLogo}
              />

              {form.watermark_enabled === '1' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <FormField label="Position">
                    <select
                      value={form.watermark_position}
                      onChange={f('watermark_position')}
                      className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/30 focus:border-[#C8A97E]"
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
                      className="w-full accent-[#C8A97E] mt-2"
                    />
                  </FormField>
                  <FormField label="Size" hint={`${form.watermark_size}% of image width`}>
                    <input
                      type="range" min="5" max="50" step="5"
                      value={form.watermark_size}
                      onChange={f('watermark_size')}
                      className="w-full accent-[#C8A97E] mt-2"
                    />
                  </FormField>
                </div>
              )}

              {form.watermark_enabled === '1' && form.watermark_logo_url && (
                <WatermarkPreview
                  logo={form.watermark_logo_url}
                  position={form.watermark_position}
                  opacity={form.watermark_opacity}
                  size={form.watermark_size}
                />
              )}
            </Section>
          </>
        )}

        {/* ── CONTACT TAB ── */}
        {tab === 'contact' && (
          <Section title="Contact Information" icon={Mail}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Contact Email">
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.contact_email} onChange={f('contact_email')} className="pl-9" placeholder="contact@homzen.ma" />
                </div>
              </FormField>
              <FormField label="Contact Phone">
                <div className="relative">
                  <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.contact_phone} onChange={f('contact_phone')} className="pl-9" placeholder="+212 600 000 000" />
                </div>
              </FormField>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="WhatsApp Number" hint="International format e.g. 212612345001">
                <Input value={form.whatsapp_number} onChange={f('whatsapp_number')} placeholder="212612345001" />
              </FormField>
              <FormField label="Office Address">
                <div className="relative">
                  <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.address} onChange={f('address')} className="pl-9" placeholder="Casablanca, Morocco" />
                </div>
              </FormField>
            </div>
          </Section>
        )}

        {/* ── SOCIAL TAB ── */}
        {tab === 'social' && (
          <Section title="Social Media" icon={Instagram}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Facebook URL">
                <div className="relative">
                  <Facebook size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.facebook_url} onChange={f('facebook_url')} className="pl-9" placeholder="https://facebook.com/homzen" />
                </div>
              </FormField>
              <FormField label="Instagram URL">
                <div className="relative">
                  <Instagram size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.instagram_url} onChange={f('instagram_url')} className="pl-9" placeholder="https://instagram.com/homzen" />
                </div>
              </FormField>
              <FormField label="Twitter / X URL">
                <div className="relative">
                  <Twitter size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input value={form.twitter_url} onChange={f('twitter_url')} className="pl-9" placeholder="https://twitter.com/homzen" />
                </div>
              </FormField>
              <FormField label="YouTube URL">
                <Input value={form.youtube_url} onChange={f('youtube_url')} placeholder="https://youtube.com/@homzen" />
              </FormField>
            </div>
          </Section>
        )}

        {/* ── SEO TAB ── */}
        {tab === 'seo' && (
          <Section title="SEO & Analytics" icon={Globe}>
            <FormField label="Default SEO Title" hint="Used when no page-specific title is set">
              <Input value={form.seo_title} onChange={f('seo_title')} placeholder="Homzen — Premium Real Estate in Morocco" />
            </FormField>
            <FormField label="Default Meta Description">
              <Textarea value={form.seo_description} onChange={f('seo_description')} rows={3} placeholder="Find your dream property in Morocco..." />
            </FormField>
            <FormField label="Google Analytics ID" hint="e.g. G-XXXXXXXXXX or UA-XXXXXXXXX-X">
              <Input value={form.google_analytics_id} onChange={f('google_analytics_id')} placeholder="G-XXXXXXXXXX" />
            </FormField>
          </Section>
        )}

        <div className="flex justify-end">
          <Btn type="submit" variant="gold" disabled={saving}>
            <Save size={14} /> {saving ? 'Saving…' : 'Save All Settings'}
          </Btn>
        </div>
      </form>
    </div>
  )
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <div className="w-8 h-8 rounded-xl bg-[#C8A97E]/10 flex items-center justify-center">
          <Icon size={15} className="text-[#C8A97E]" />
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
            placeholder="#C8A97E"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#C8A97E]/30 focus:border-[#C8A97E] font-mono"
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
        className="relative border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#C8A97E]/50 transition-colors min-h-[100px] bg-gray-50"
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
            <div className="w-5 h-5 border-2 border-[#C8A97E] border-t-transparent rounded-full animate-spin" />
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

function WatermarkPreview({ logo, position, opacity, size }) {
  const posMap = {
    'top-left':     'top-2 left-2',
    'top-right':    'top-2 right-2',
    'bottom-left':  'bottom-2 left-2',
    'bottom-right': 'bottom-2 right-2',
    'center':       'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
  }

  return (
    <div className="mt-4">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Preview</p>
      <div className="relative rounded-xl overflow-hidden bg-gray-200 border border-gray-100" style={{ height: 160 }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400 text-sm">Sample image</span>
        </div>
        <img
          src={logo}
          alt="watermark preview"
          className={`absolute ${posMap[position] || posMap['bottom-right']}`}
          style={{
            opacity: parseInt(opacity, 10) / 100,
            width: `${size}%`,
            objectFit: 'contain',
          }}
          onError={(e) => { e.currentTarget.style.display = 'none' }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1">
        Position: <strong>{position}</strong> · Opacity: <strong>{opacity}%</strong> · Size: <strong>{size}% width</strong>
      </p>
    </div>
  )
}
