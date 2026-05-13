import { useEffect, useState } from 'react'
import { adminSettings } from '../api/adminApi'
import { PageHeader, Btn } from '../components/DataTable'
import { FormField, Input, Textarea } from '../components/Modal'
import { Save, Globe, Mail, Phone, Instagram, Facebook, Twitter, MapPin, CheckCircle } from 'lucide-react'

const DEFAULTS = {
  site_name: 'Homzen',
  tagline: "Morocco's Most Trusted Real Estate Platform",
  contact_email: 'contact@homzen.ma',
  contact_phone: '+212 600 000 000',
  address: 'Casablanca, Morocco',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  youtube_url: '',
  seo_title: 'Homzen — Premium Real Estate in Morocco',
  seo_description: 'Find your dream property in Morocco with Homzen. Browse thousands of verified listings across Casablanca, Marrakech, Rabat and more.',
  google_analytics_id: '',
  whatsapp_number: '',
  currency: 'MAD',
  properties_per_page: '12',
}

export default function SettingsPage() {
  const [form, setForm]       = useState(DEFAULTS)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [loading, setLoading] = useState(true)
  const [apiNote, setApiNote] = useState(false)

  useEffect(() => {
    adminSettings.get()
      .then((r) => {
        if (r?.data) setForm(prev => ({ ...prev, ...r.data }))
      })
      .catch(() => {
        setApiNote(true)
        const stored = localStorage.getItem('homzen_settings')
        if (stored) {
          try { setForm(prev => ({ ...prev, ...JSON.parse(stored) })) } catch {}
        }
      })
      .finally(() => setLoading(false))
  }, [])

  const f = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }))

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
      <PageHeader title="Site Settings" subtitle="Global configuration for Homzen">
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

      {apiNote && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-700 text-sm">
          <strong>Note:</strong> Settings API not available on this backend yet. Settings are saved locally in your browser until the endpoint is deployed.
        </div>
      )}

      <form id="settings-form" onSubmit={submit} className="space-y-6">

        {/* General */}
        <Section title="General" icon={Globe}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Site Name" required>
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

        {/* Contact */}
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

        {/* Social */}
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

        {/* SEO */}
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

        <div className="flex justify-end">
          <Btn type="submit" variant="gold" form="settings-form" disabled={saving}>
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
