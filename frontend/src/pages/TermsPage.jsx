import { useEffect, useState } from 'react'
import { FileText, Loader2 } from 'lucide-react'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import Footer from '../components/Footer'
import { publicSettingsApi } from '../api/client'

const FALLBACK = `
## 1. Acceptation des conditions
En accédant à notre plateforme, vous acceptez ces conditions d'utilisation dans leur intégralité.

## 2. Description du service
Mahalo est une plateforme de mise en relation entre vendeurs, bailleurs et acheteurs de biens immobiliers au Maroc.

## 3. Utilisation autorisée
Vous vous engagez à utiliser la plateforme de manière légale et à ne pas publier de contenu frauduleux, inexact ou trompeur.

## 4. Annonces
Les annonceurs sont responsables de l'exactitude des informations publiées. Mahalo se réserve le droit de supprimer toute annonce ne respectant pas nos standards.

## 5. Propriété intellectuelle
Tout le contenu de la plateforme (logos, textes, design) est la propriété exclusive de Mahalo et ne peut être reproduit sans autorisation.

## 6. Limitation de responsabilité
Mahalo agit en tant qu'intermédiaire et n'est pas responsable des transactions conclues entre les parties.

## 7. Modifications
Nous nous réservons le droit de modifier ces conditions à tout moment. Les modifications entrent en vigueur dès leur publication.

## 8. Droit applicable
Ces conditions sont régies par le droit marocain. Tout litige sera soumis aux juridictions compétentes de Casablanca.
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

export default function TermsPage() {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    publicSettingsApi.get()
      .then(res => setContent(res.data?.page_terms || FALLBACK))
      .catch(() => setContent(FALLBACK))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SEOHead
        title="Terms of Use"
        description="Read the terms and conditions governing your use of the Mahalo Real Estate platform in Morocco."
        robots="noindex,follow"
      />
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-14 px-6 bg-navy text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest mb-5">
          <FileText size={12} /> Conditions d'utilisation
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">Conditions d'utilisation</h1>
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
