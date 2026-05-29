import { useEffect, useState } from 'react'
import { Cookie, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import Footer from '../components/Footer'
import { publicSettingsApi } from '../api/client'

const FALLBACK = `
## 1. Qu'est-ce qu'un cookie ?
Un cookie est un petit fichier texte déposé sur votre appareil lorsque vous visitez notre site. Il permet de mémoriser vos préférences et d'améliorer votre expérience de navigation.

## 2. Cookies que nous utilisons
- **Cookies essentiels** : nécessaires au bon fonctionnement du site (session, authentification).
- **Cookies analytiques** : nous aident à comprendre comment vous utilisez notre plateforme (statistiques anonymisées).
- **Cookies de préférences** : mémorisent vos choix (langue, devise, filtres de recherche).

## 3. Cookies tiers
Nous pouvons utiliser des services tiers (Google Analytics, etc.) qui déposent leurs propres cookies. Ces cookies sont régis par les politiques de confidentialité des prestataires concernés.

## 4. Gestion des cookies
Vous pouvez à tout moment accepter ou refuser les cookies non essentiels via la bannière affichée lors de votre première visite. Vous pouvez également gérer les cookies directement depuis les paramètres de votre navigateur.

## 5. Durée de conservation
Les cookies essentiels expirent à la fin de votre session. Les cookies analytiques et de préférences sont conservés pour une durée maximale de 13 mois.

## 6. Contact
Pour toute question relative à notre utilisation des cookies, contactez-nous à l'adresse indiquée dans nos informations de contact.
`

function renderMarkdown(text) {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} className="text-lg font-bold text-navy mt-7 mb-2">{line.slice(3)}</h2>
      if (line.startsWith('# '))  return <h1 key={i} className="text-2xl font-bold text-navy mt-8 mb-3">{line.slice(2)}</h1>
      if (line.startsWith('- '))  return <li key={i} className="ml-5 list-disc text-navy/70 text-sm leading-relaxed">{line.slice(2)}</li>
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <p key={i} className="text-navy/70 text-sm leading-relaxed">
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j} className="text-navy font-semibold">{part}</strong> : part)}
          </p>
        )
      }
      if (line.trim() === '') return <div key={i} className="h-2" />
      return <p key={i} className="text-navy/70 text-sm leading-relaxed">{line}</p>
    })
}

export default function CookiePolicyPage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    publicSettingsApi.get()
      .then(res => setContent(res.data?.page_cookie || FALLBACK))
      .catch(() => setContent(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SEOHead
        title="Politique de cookies"
        description="Découvrez comment Mahalo Immobilier utilise les cookies pour améliorer votre expérience sur notre plateforme immobilière au Maroc."
        robots="noindex,follow"
      />
      <Navbar />

      <section className="pt-28 pb-14 px-6 bg-navy text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest mb-5">
          <Cookie size={12} /> Politique de cookies
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Politique de cookies</h1>
        <p className="text-white/50 text-sm">Dernière mise à jour par l'administrateur</p>
      </section>

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
