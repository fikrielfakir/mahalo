import { useState } from 'react'
import { HelpCircle, ChevronDown, Search, Home, User, FileText, CreditCard, Phone } from 'lucide-react'
import Navbar from '../components/Navbar'
import SEOHead from '../components/SEOHead'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'

const CATEGORIES = [
  {
    icon: Home,
    title: 'Acheter un bien',
    items: [
      { q: 'Comment rechercher un bien immobilier ?', a: 'Utilisez la barre de recherche en haut de la page ou la page "Acheter". Vous pouvez filtrer par ville, type, prix, nombre de chambres et bien plus.' },
      { q: 'Comment contacter un agent pour visiter un bien ?', a: 'Sur chaque annonce, cliquez sur "Contacter l\'agent" ou "Demander une visite". L\'agent vous répondra directement par e-mail ou téléphone.' },
      { q: 'Les annonces sont-elles vérifiées ?', a: 'Oui. Chaque annonce est vérifiée par notre équipe de modération avant d\'être publiée. Nos agents sont également certifiés.' },
    ],
  },
  {
    icon: User,
    title: 'Mon compte',
    items: [
      { q: 'Comment créer un compte ?', a: 'Cliquez sur "Se connecter" puis "Créer un compte". Vous pouvez vous inscrire avec votre e-mail ou via Google.' },
      { q: 'Comment réinitialiser mon mot de passe ?', a: 'Cliquez sur "Se connecter" puis "Mot de passe oublié". Un lien de réinitialisation vous sera envoyé par e-mail.' },
      { q: 'Comment modifier mes informations personnelles ?', a: 'Connectez-vous et accédez à votre profil via le menu en haut à droite. Vous pourrez y modifier vos informations.' },
    ],
  },
  {
    icon: FileText,
    title: 'Publier une annonce',
    items: [
      { q: 'Comment publier un bien ?', a: 'Connectez-vous, puis cliquez sur "Publier un bien" dans le menu. Remplissez le formulaire et soumettez votre annonce. Elle sera examinée sous 24 h.' },
      { q: 'Combien coûte la publication d\'une annonce ?', a: 'Contactez notre équipe pour connaître nos tarifs actuels. Certaines options de base peuvent être gratuites.' },
      { q: 'Pourquoi mon annonce est-elle en attente de validation ?', a: 'Notre équipe vérifie chaque annonce pour garantir la qualité. Ce processus prend généralement moins de 24 h.' },
    ],
  },
  {
    icon: Phone,
    title: 'Support',
    items: [
      { q: 'Comment contacter le support ?', a: 'Utilisez notre page de contact ou envoyez-nous un e-mail. Notre équipe vous répondra dans les plus brefs délais.' },
      { q: 'Quels sont les horaires du support ?', a: 'Notre support est disponible du lundi au vendredi de 9 h à 18 h (heure du Maroc).' },
    ],
  },
]

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button type="button" onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between gap-4 py-4 text-left">
        <span className="text-sm font-semibold text-navy leading-snug">{q}</span>
        <ChevronDown size={16} className={`text-[#BA1932] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="text-sm text-navy/60 leading-relaxed pb-4 pr-6">{a}</p>
      )}
    </div>
  )
}

export default function HelpCenterPage() {
  const [query, setQuery] = useState('')

  const filtered = CATEGORIES.map(cat => ({
    ...cat,
    items: cat.items.filter(
      ({ q, a }) => !query || q.toLowerCase().includes(query.toLowerCase()) || a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter(cat => cat.items.length > 0)

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SEOHead
        title="Centre d'aide — Mahalo Immobilier"
        description="Trouvez des réponses à vos questions sur l'utilisation de la plateforme Mahalo Immobilier au Maroc."
      />
      <Navbar />

      <section className="pt-28 pb-14 px-6 bg-navy text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/70 text-xs font-semibold uppercase tracking-widest mb-5">
          <HelpCircle size={12} /> Centre d'aide
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Comment pouvons-nous vous aider ?</h1>
        <div className="max-w-md mx-auto relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Rechercher une question…"
            className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 text-sm focus:outline-none focus:bg-white/15 focus:border-white/40 transition-all"
          />
        </div>
      </section>

      <main className="flex-1 py-14 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-navy/40">
              <HelpCircle size={40} className="mx-auto mb-4 opacity-30" />
              <p className="font-medium">Aucun résultat pour "{query}"</p>
              <p className="text-sm mt-1">Essayez d'autres mots-clés ou <Link to="/contact" className="text-[#BA1932] hover:underline">contactez-nous</Link>.</p>
            </div>
          ) : filtered.map(({ icon: Icon, title, items }) => (
            <div key={title} className="bg-white rounded-3xl shadow-card border border-gray-100 overflow-hidden">
              <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <div className="w-8 h-8 rounded-xl bg-[#BA1932]/10 flex items-center justify-center">
                  <Icon size={15} className="text-[#BA1932]" />
                </div>
                <h2 className="font-bold text-gray-800 text-sm">{title}</h2>
              </div>
              <div className="px-6">
                {items.map(item => <FAQItem key={item.q} {...item} />)}
              </div>
            </div>
          ))}

          <div className="text-center pt-4">
            <p className="text-navy/50 text-sm mb-3">Vous n'avez pas trouvé votre réponse ?</p>
            <Link to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#BA1932] text-white font-semibold text-sm hover:bg-[#730D26] transition-colors">
              <Phone size={14} /> Contactez-nous
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
