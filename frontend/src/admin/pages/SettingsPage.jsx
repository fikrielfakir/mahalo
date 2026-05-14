import { useEffect, useState, useRef } from 'react'
import { adminSettings } from '../api/adminApi'
import { PageHeader, Btn } from '../components/DataTable'
import { FormField, Input, Textarea } from '../components/Modal'
import {
  Save, Globe, Mail, Phone, Instagram, Facebook, Twitter, MapPin,
  CheckCircle, Palette, Upload, Image, Droplets, Eye, EyeOff,
  Server, Send, Lock, AlertCircle, KeyRound, Copy, ExternalLink,
} from 'lucide-react'

const TABS = [
  { id: 'general',    label: 'General',     icon: Globe },
  { id: 'theme',      label: 'Theme',       icon: Palette },
  { id: 'watermark',  label: 'Watermark',   icon: Droplets },
  { id: 'contact',    label: 'Contact',     icon: Mail },
  { id: 'social',     label: 'Social',      icon: Instagram },
  { id: 'seo',        label: 'SEO',         icon: Globe },
  { id: 'mail',       label: 'Mail / SMTP', icon: Server },
  { id: 'google',     label: 'Google Auth', icon: KeyRound },
]

const DEFAULTS = {
  site_name: 'Mahalo',
  tagline: "Morocco's Most Trusted Real Estate Platform",
  contact_email: 'contact@mahalo.ma',
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
  // Theme
  primary_color: '#BA1932',
  secondary_color: '#730D26',
  accent_color: '#F5F5F5',
  logo_url: '/logo.png',
  footer_logo_url: '/logo-light.png',
  // Watermark
  watermark_enabled: '1',
  watermark_logo_url: '/watermark.png',
  watermark_position: 'center',
  watermark_opacity: '60',
  watermark_size: '20',
  // SMTP Mail
  mail_mailer: 'smtp',
  mail_host: '',
  mail_port: '587',
  mail_username: '',
  mail_password: '',
  mail_encryption: 'tls',
  mail_from_address: '',
  mail_from_name: 'Agentz',
  // Google OAuth
  google_client_id: '',
  google_client_secret: '',
}

const WATERMARK_POSITIONS = [
  { value: 'top-left',     label: 'Top Left' },
  { value: 'top-right',    label: 'Top Right' },
  { value: 'bottom-left',  label: 'Bottom Left' },
  { value: 'bottom-right', label: 'Bottom Right' },
  { value: 'center',       label: 'Center' },
]

export default function SettingsPage() {
  const [form, setForm]           = useState(DEFAULTS)
  const [tab, setTab]             = useState('general')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [loading, setLoading]     = useState(true)
  const [uploading, setUploading] = useState({})
  const [showPwd, setShowPwd]         = useState(false)
  const [showSecret, setShowSecret]   = useState(false)
  const [testing, setTesting]         = useState(false)
  const [testResult, setTestResult]   = useState(null)
  const [copied, setCopied]           = useState(false)

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
      localStorage.setItem('mahalo_settings', JSON.stringify(form))
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
                ? 'bg-[#730D26] text-white shadow-sm'
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

          </>
        )}

        {/* ── WATERMARK TAB ── */}
        {tab === 'watermark' && (
          <>
            <Section title="Watermark Settings" icon={Droplets}>
              {/* Enable / Disable toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-gray-800">Auto-watermark on upload</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    When enabled, the Mahalo logo is stamped on every image as it is uploaded
                  </p>
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

              {/* Logo upload */}
              <LogoField
                label="Watermark Logo"
                hint="PNG with transparent background works best. Leave empty to use the default Mahalo logo."
                value={form.watermark_logo_url}
                field="watermark_logo_url"
                uploading={uploading.watermark_logo_url}
                onChange={uploadLogo}
              />

              {/* Position / Opacity / Size — always visible */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
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
                    className="w-full accent-[#BA1932] mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>10%</span><span>100%</span>
                  </div>
                </FormField>

                <FormField label="Size" hint={`${form.watermark_size}% of image width`}>
                  <input
                    type="range" min="5" max="50" step="5"
                    value={form.watermark_size}
                    onChange={f('watermark_size')}
                    className="w-full accent-[#BA1932] mt-2"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>5%</span><span>50%</span>
                  </div>
                </FormField>
              </div>

              {/* Live preview — always visible */}
              <WatermarkPreview
                logo={form.watermark_logo_url || '/watermark.png'}
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
            </div>
          </Section>
        )}

        {/* ── SEO TAB ── */}
        {tab === 'seo' && (
          <Section title="SEO & Analytics" icon={Globe}>
            <FormField label="Default SEO Title" hint="Used when no page-specific title is set">
              <Input value={form.seo_title} onChange={f('seo_title')} placeholder="Mahalo — Premium Real Estate in Morocco" />
            </FormField>
            <FormField label="Default Meta Description">
              <Textarea value={form.seo_description} onChange={f('seo_description')} rows={3} placeholder="Find your dream property in Morocco..." />
            </FormField>
            <FormField label="Google Analytics ID" hint="e.g. G-XXXXXXXXXX or UA-XXXXXXXXX-X">
              <Input value={form.google_analytics_id} onChange={f('google_analytics_id')} placeholder="G-XXXXXXXXXX" />
            </FormField>
          </Section>
        )}

        {/* ── MAIL TAB ── */}
        {tab === 'mail' && (
          <>
            <Section title="SMTP Mail Configuration" icon={Server}>
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-blue-700 mb-2">
                Configure your outgoing mail server. These settings are used to send contact form notifications, consultation confirmations, and admin alerts.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Mailer Driver">
                  <select
                    value={form.mail_mailer}
                    onChange={f('mail_mailer')}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932]"
                  >
                    <option value="smtp">SMTP</option>
                    <option value="sendmail">Sendmail</option>
                    <option value="log">Log (testing only)</option>
                  </select>
                </FormField>
                <FormField label="Encryption">
                  <select
                    value={form.mail_encryption}
                    onChange={f('mail_encryption')}
                    className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932]"
                  >
                    <option value="tls">TLS (recommended)</option>
                    <option value="ssl">SSL</option>
                    <option value="">None</option>
                  </select>
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <FormField label="SMTP Host">
                    <div className="relative">
                      <Server size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input value={form.mail_host} onChange={f('mail_host')} className="pl-9" placeholder="smtp.gmail.com" />
                    </div>
                  </FormField>
                </div>
                <FormField label="SMTP Port">
                  <Input type="number" value={form.mail_port} onChange={f('mail_port')} placeholder="587" />
                </FormField>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="SMTP Username">
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input value={form.mail_username} onChange={f('mail_username')} className="pl-9" placeholder="you@gmail.com" />
                  </div>
                </FormField>
                <FormField label="SMTP Password">
                  <div className="relative">
                    <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={showPwd ? 'text' : 'password'}
                      value={form.mail_password}
                      onChange={f('mail_password')}
                      placeholder="App password or SMTP password"
                      className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/30 focus:border-[#BA1932]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </FormField>
              </div>
            </Section>

            <Section title="From Address" icon={Send}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="From Email Address">
                  <div className="relative">
                    <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input value={form.mail_from_address} onChange={f('mail_from_address')} className="pl-9" placeholder="no-reply@mahalo.ma" />
                  </div>
                </FormField>
                <FormField label="From Name">
                  <Input value={form.mail_from_name} onChange={f('mail_from_name')} placeholder="Mahalo Real Estate" />
                </FormField>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Btn
                  type="button"
                  variant="ghost"
                  disabled={testing || !form.mail_host}
                  onClick={async () => {
                    setTesting(true)
                    setTestResult(null)
                    try {
                      const r = await adminSettings.testMail(form.mail_from_address || form.contact_email)
                      setTestResult({ ok: true, msg: r?.message || 'Test email sent successfully!' })
                    } catch (e) {
                      setTestResult({ ok: false, msg: e?.message || e?.error || 'Failed to send test email.' })
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

              {/* Redirect URI copy box */}
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

              {/* Status indicator */}
              <div className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium mt-2 ${
                form.google_client_id && form.google_client_secret
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700'
                  : 'bg-amber-50 border-amber-100 text-amber-700'
              }`}>
                {form.google_client_id && form.google_client_secret ? (
                  <>
                    <CheckCircle size={15} />
                    Google OAuth is configured — users and managers can sign in with Google.
                  </>
                ) : (
                  <>
                    <AlertCircle size={15} />
                    Google OAuth is not configured. Enter your Client ID and Secret above and save.
                  </>
                )}
              </div>
            </Section>
          </>
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
        {/* Fake property image grid lines */}
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
