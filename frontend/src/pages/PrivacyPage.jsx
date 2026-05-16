import { useEffect, useState } from 'react'
import { Shield, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { publicSettingsApi } from '../api/client'

const FALLBACK = `
## 1. Collecte des données
Nous collectons les informations que vous nous fournissez directement lors de la création de votre compte, de la soumission d'une annonce ou de l'utilisation de nos services.

## 2. Utilisation des données
Vos données sont utilisées pour :
- Fournir et améliorer nos services
- Vous contacter concernant votre compte ou vos annonces
- Personnaliser votre expérience sur la plateforme

## 3. Partage des données
Nous ne vendons pas vos données personnelles à des tiers. Nous pouvons partager certaines informations avec nos agents partenaires dans le cadre de votre demande.

## 4. Sécurité
Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations contre tout accès non autorisé.

## 5. Vos droits
Vous avez le droit d'accéder, de corriger ou de supprimer vos données personnelles à tout moment en nous contactant.

## 6. Contact
Pour toute question concernant cette politique, contactez-nous à l'adresse indiquée dans nos informations de contact.
`

function renderMarkdown(text) {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-navy mt-7 mb-2">{line.slice(3)}</h2>
      if (line.startsWith('# '))  return <h1 key={i} className="text-2xl font-bold text-navy mt-8 mb-3">{line.slice(2)}</h1>
      if (line.startsWith('- '))  return <li key={i} className="ml-5 list-disc text-navy/70 text-sm leading-relaxed">{line.slice(2)}</li>
      if (line.trim() === '')     return <div key={i} className="h-2" />
      return <p key={i} className="text-navy/70 text-sm leading-relaxed">{line}</p>
    })
}

export default function PrivacyPage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    publicSettingsApi.get()
      .then(res => setContent(res.data?.page_privacy || FALLBACK))
      .catch(() => setContent(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-14 px-6 bg-navy text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest mb-5">
          <Shield size={12} /> Politique de confidentialité
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Politique de confidentialité</h1>
        <p className="text-white/50 text-sm">Dernière mise à jour par l'administrateur</p>
      </section>

      {/* Content */}
      <main className="flex-1 py-14 px-6">
        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-card p-8 sm:p-10">
          {loading ? (
            <div className="flex items-center justify-center gap-3 py-16 text-navy/40">
              <Loader2 size={20} className="animate-spin" /> Chargement…
            </div>
          ) : (
            <div className="space-y-0.5">
              {renderMarkdown(content)}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
