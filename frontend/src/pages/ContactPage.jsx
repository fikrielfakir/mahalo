import { Mail, Phone, MapPin, MessageCircle, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import Footer from '../components/Footer'
import { useSiteSettings } from '../context/SiteSettingsContext'
import { consultsApi } from '../api/client'

export default function ContactPage() {
  const settings = useSiteSettings()
  const [form, setForm]       = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus]   = useState(null) // null | 'loading' | 'success' | 'error'
  const [errMsg, setErrMsg]   = useState('')

  const f = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (status === 'loading' || status === 'success') return
    setStatus('loading')
    setErrMsg('')
    try {
      await consultsApi.store({
        name:    form.name,
        email:   form.email,
        phone:   form.phone,
        message: form.message,
      })
      setStatus('success')
      setForm({ name: '', email: '', phone: '', message: '' })
    } catch (err) {
      setStatus('error')
      setErrMsg(err?.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.')
    }
  }

  const contactItems = [
    settings.contact_email   && { Icon: Mail,          label: 'E-mail',    value: settings.contact_email,   href: `mailto:${settings.contact_email}` },
    settings.contact_phone   && { Icon: Phone,         label: 'Téléphone', value: settings.contact_phone,   href: `tel:${settings.contact_phone}` },
    settings.whatsapp_number && { Icon: MessageCircle, label: 'WhatsApp',  value: settings.whatsapp_number, href: `https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}` },
    settings.address         && { Icon: MapPin,        label: 'Adresse',   value: settings.address,         href: null },
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SEOHead
        title="Contact — Mahalo Immobilier"
        description="Contactez l'équipe Mahalo Immobilier pour toute question sur nos biens immobiliers au Maroc."
      />
      <Navbar />

      <section className="pt-28 pb-14 px-6 bg-navy text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest mb-5">
          <Mail size={12} /> Contact
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Contactez-nous</h1>
        <p className="text-white/50 text-sm max-w-md mx-auto">Notre équipe est disponible pour répondre à toutes vos questions.</p>
      </section>

      <main className="flex-1 py-14 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

          {/* Contact info */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-navy mb-6">Nos coordonnées</h2>
            {contactItems.length > 0 ? contactItems.map(({ Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-card border border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-[#BA1932]/10 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-[#BA1932]" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                       className="text-navy font-medium text-sm hover:text-[#BA1932] transition-colors">
                      {value}
                    </a>
                  ) : (
                    <p className="text-navy font-medium text-sm">{value}</p>
                  )}
                </div>
              </div>
            )) : (
              <div className="bg-white rounded-2xl p-8 shadow-card border border-gray-100 text-center text-navy/40 text-sm">
                Coordonnées non configurées — veuillez contacter l'administrateur.
              </div>
            )}
          </div>

          {/* Contact form */}
          <div className="bg-white rounded-3xl shadow-card border border-gray-100 p-7 sm:p-8">
            <h2 className="text-xl font-bold text-navy mb-6">Envoyez-nous un message</h2>

            {status === 'success' ? (
              <div className="flex flex-col items-center gap-4 py-12 text-center">
                <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle size={28} className="text-emerald-600" />
                </div>
                <p className="font-semibold text-navy">Message envoyé !</p>
                <p className="text-sm text-navy/50">Notre équipe vous répondra dans les plus brefs délais.</p>
                <button onClick={() => setStatus(null)}
                  className="mt-2 text-sm text-[#BA1932] font-medium hover:underline">
                  Envoyer un autre message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Nom complet *</label>
                    <input required value={form.name} onChange={f('name')} placeholder="Votre nom"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/20 focus:border-[#BA1932]/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5">Téléphone</label>
                    <input value={form.phone} onChange={f('phone')} placeholder="+212 6XX XXX XXX"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/20 focus:border-[#BA1932]/50" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">E-mail *</label>
                  <input required type="email" value={form.email} onChange={f('email')} placeholder="votre@email.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#BA1932]/20 focus:border-[#BA1932]/50" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Message *</label>
                  <textarea required value={form.message} onChange={f('message')} rows={5}
                    placeholder="Comment pouvons-nous vous aider ?"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-navy placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#BA1932]/20 focus:border-[#BA1932]/50" />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-100 rounded-xl px-4 py-2.5">
                    <AlertCircle size={14} className="shrink-0" /> {errMsg}
                  </div>
                )}

                <button type="submit" disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#BA1932] hover:bg-[#730D26] text-white font-semibold text-sm transition-colors disabled:opacity-60">
                  {status === 'loading'
                    ? <><Loader2 size={16} className="animate-spin" /> Envoi en cours…</>
                    : <><Send size={15} /> Envoyer le message</>
                  }
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
