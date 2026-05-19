import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Loader2, Sparkles, RefreshCw, ArrowRight, Bookmark, X, Check, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import SEOHead from '../components/SEOHead'
import PropertyCard from '../components/PropertyCard'
import { aiApi } from '../api/aiApi'

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600&q=80'

const OPENING = {
  role: 'assistant',
  content: "Bonjour ! Je suis Mahalo AI, votre assistant immobilier personnel. 🏡\n\nDites-moi ce que vous recherchez — ville, budget, type de bien, nombre de chambres — et je trouverai les meilleures correspondances dans notre base de données. Commençons !",
}

const STARTERS = [
  "Je cherche un appartement à Casablanca, budget 2M MAD",
  "Villa avec piscine à Marrakech pour moins de 5M MAD",
  "Appartement à louer à Rabat, 2 chambres",
  "I'm looking for a 3-bedroom house for sale in Agadir",
]

function Message({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Bot size={16} className="text-white" />
        </div>
      )}
      <div className={`max-w-[75%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? 'bg-navy text-white rounded-tr-sm'
          : 'bg-white text-navy shadow-sm border border-gray-100 rounded-tl-sm'
      }`}>
        {msg.content}
      </div>
    </div>
  )
}

function SaveSearchModal({ preferences, description, onClose }) {
  const [email, setEmail]   = useState('')
  const [name, setName]     = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved]   = useState(false)
  const [error, setError]   = useState('')

  const handleSave = async () => {
    if (!email.trim()) { setError('Veuillez entrer votre adresse email.'); return }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Adresse email invalide.'); return }
    setSaving(true)
    setError('')
    try {
      await aiApi.savedSearches.save({
        email: email.trim(),
        name: name.trim() || null,
        description,
        preferences,
      })
      setSaved(true)
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#730D26]/10 to-[#BA1932]/10 flex items-center justify-center">
                <Bookmark size={18} className="text-[#730D26]" />
              </div>
              <div>
                <h2 className="font-bold text-navy text-base">Sauvegarder la recherche</h2>
                <p className="text-navy/50 text-xs mt-0.5">Recevez un email quand de nouveaux biens correspondent</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100 text-navy/40 hover:text-navy transition-colors">
              <X size={16} />
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          {saved ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                <Check size={26} className="text-green-500" />
              </div>
              <h3 className="font-bold text-navy text-base mb-2">Recherche sauvegardée !</h3>
              <p className="text-navy/55 text-sm leading-relaxed mb-5">
                Vous recevrez un email à <strong>{email}</strong> dès que de nouveaux biens correspondant à vos critères seront disponibles.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-br from-[#730D26] to-[#BA1932] text-white text-sm font-semibold hover:shadow-lg transition-all"
              >
                Parfait !
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Search summary */}
              <div className="px-4 py-3 rounded-2xl bg-gray-50 border border-gray-100">
                <p className="text-xs font-semibold text-navy/40 uppercase tracking-wide mb-1">Votre recherche</p>
                <p className="text-sm text-navy/70 leading-relaxed line-clamp-2">{description}</p>
              </div>

              {/* Name field */}
              <div>
                <label className="block text-xs font-semibold text-navy/50 mb-1.5">Nom de la recherche (optionnel)</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Appartement Casablanca"
                  className="w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-navy outline-none focus:border-[#730D26]/40 transition-colors placeholder-navy/30"
                />
              </div>

              {/* Email field */}
              <div>
                <label className="block text-xs font-semibold text-navy/50 mb-1.5">Votre email <span className="text-[#730D26]">*</span></label>
                <div className="relative">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError('') }}
                    onKeyDown={e => { if (e.key === 'Enter') handleSave() }}
                    placeholder="votre@email.com"
                    className="w-full pl-10 pr-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-navy outline-none focus:border-[#730D26]/40 transition-colors placeholder-navy/30"
                  />
                </div>
                {error && <p className="text-xs text-red-500 mt-1.5 pl-1">{error}</p>}
              </div>

              <p className="text-xs text-navy/40 leading-relaxed">
                Nous vous enverrons un email uniquement quand de nouveaux biens correspondent à vos critères. Pas de spam.
              </p>

              <button
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 rounded-2xl bg-gradient-to-br from-[#730D26] to-[#BA1932] text-white text-sm font-semibold hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {saving ? <><Loader2 size={14} className="animate-spin" /> Sauvegarde…</> : <><Bookmark size={14} /> Sauvegarder et être alerté</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MatchResults({ properties, commentary, preferences, userDescription, onReset }) {
  const [showSave, setShowSave] = useState(false)

  return (
    <div className="space-y-6">
      {commentary && (
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
            <Bot size={16} className="text-white" />
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-navy leading-relaxed shadow-sm max-w-[75%]">
            {commentary}
          </div>
        </div>
      )}

      {properties.length === 0 ? (
        <div className="flex gap-3">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center shrink-0 shadow-sm">
            <Bot size={16} className="text-white" />
          </div>
          <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-navy shadow-sm">
            Aucune propriété ne correspond exactement à vos critères pour le moment. Essayez d'élargir votre recherche ou{' '}
            <Link to="/properties" className="text-[#730D26] font-semibold hover:underline">parcourez toutes nos annonces</Link>.
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Sparkles size={14} className="text-gold" />
            <span className="text-xs font-semibold text-navy/50 uppercase tracking-wide">
              {properties.length} bien{properties.length > 1 ? 's' : ''} correspondant{properties.length > 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {properties.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      )}

      {/* Save search + new search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
        <button
          onClick={() => setShowSave(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-[#730D26]/25 text-[#730D26] text-sm font-semibold hover:bg-[#730D26]/5 transition-all"
        >
          <Bookmark size={14} /> Sauvegarder et être alerté
        </button>
        <div className="flex items-center gap-3">
          <Link
            to="/properties"
            className="flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy transition-colors"
          >
            Toutes les annonces <ArrowRight size={13} />
          </Link>
          <span className="text-navy/20">·</span>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 text-sm text-navy/50 hover:text-navy transition-colors"
          >
            <RefreshCw size={13} /> Nouvelle recherche
          </button>
        </div>
      </div>

      {showSave && (
        <SaveSearchModal
          preferences={preferences}
          description={userDescription}
          onClose={() => setShowSave(false)}
        />
      )}
    </div>
  )
}

export default function PropertyMatchPage() {
  const [history, setHistory]           = useState([OPENING])
  const [input, setInput]               = useState('')
  const [loading, setLoading]           = useState(false)
  const [results, setResults]           = useState(null)
  const [userDescription, setUserDesc]  = useState('')
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, results])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading) return
    if (!userDescription) setUserDesc(msg)
    setInput('')

    const userMsg    = { role: 'user', content: msg }
    const newHistory = [...history, userMsg]
    setHistory(newHistory)
    setLoading(true)

    try {
      const [chatRes, matchRes] = await Promise.all([
        aiApi.generalChat({
          message: msg,
          history: history.filter(m => m.role !== 'system'),
        }),
        aiApi.matchProperties({
          history: newHistory.filter(m => m.role !== 'system').map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content,
          })),
          language: 'the same language the user is using',
        }),
      ])

      setLoading(false)

      if (matchRes.ready) {
        setHistory(h => [...h, { role: 'assistant', content: chatRes.reply }])
        setResults({
          properties:  matchRes.properties || [],
          commentary:  matchRes.commentary,
          preferences: matchRes.preferences || {},
        })
      } else {
        const followUp = matchRes.missing || chatRes.reply
        setHistory(h => [...h, { role: 'assistant', content: followUp }])
      }
    } catch {
      setLoading(false)
      setHistory(h => [...h, { role: 'assistant', content: 'Désolé, une erreur est survenue. Veuillez réessayer.' }])
    }
  }

  const reset = () => {
    setHistory([OPENING])
    setResults(null)
    setInput('')
    setUserDesc('')
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <SEOHead
        title="Trouvez votre bien idéal avec Mahalo AI"
        description="Décrivez votre bien de rêve et notre IA trouve les meilleures correspondances dans notre base de données immobilière au Maroc."
      />
      <Navbar />

      <div className="flex-1 pt-20 pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex flex-col h-full">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#730D26]/10 to-[#BA1932]/10 border border-[#730D26]/20 mb-4">
              <Sparkles size={14} className="text-[#730D26]" />
              <span className="text-xs font-bold text-[#730D26] uppercase tracking-widest">Mahalo AI Matching</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-navy mb-3">
              Trouvez votre bien idéal
            </h1>
            <p className="text-navy/50 text-sm sm:text-base max-w-xl mx-auto">
              Décrivez simplement ce que vous recherchez — notre IA analyse votre besoin et sélectionne les meilleures annonces dans notre base de données.
            </p>
          </div>

          {/* Chat + Results */}
          <div className="flex-1 flex flex-col bg-surface/60 rounded-3xl border border-gray-200/60 overflow-hidden">

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-4 min-h-[300px] max-h-[55vh]">

              {history.map((msg, i) => <Message key={i} msg={msg} />)}

              {loading && (
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center shrink-0 shadow-sm">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin text-[#730D26]" />
                    <span className="text-xs text-navy/40">Analyse en cours…</span>
                  </div>
                </div>
              )}

              {results && !loading && (
                <MatchResults
                  properties={results.properties}
                  commentary={results.commentary}
                  preferences={results.preferences}
                  userDescription={userDescription}
                  onReset={reset}
                />
              )}

              <div ref={bottomRef} />
            </div>

            {/* Starters (only on fresh start) */}
            {history.length === 1 && !results && (
              <div className="px-4 sm:px-6 pb-3 flex flex-wrap gap-2">
                {STARTERS.map(s => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-xs px-3 py-2 rounded-xl bg-white border border-gray-200 text-navy/60 hover:text-[#730D26] hover:border-[#730D26]/30 transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            {!results && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200/60 bg-white">
                <div className="flex items-center gap-3">
                  <div className="flex-1 flex items-center gap-2 bg-surface rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-[#730D26]/40 transition-colors">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={onKey}
                      placeholder="Décrivez votre bien idéal…"
                      className="flex-1 bg-transparent text-sm text-navy outline-none placeholder-navy/30"
                      disabled={loading}
                    />
                  </div>
                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || loading}
                    className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-[#730D26] to-[#BA1932] disabled:opacity-40 hover:shadow-lg hover:scale-105 transition-all shadow-sm"
                  >
                    <Send size={15} className="text-white" />
                  </button>
                </div>
              </div>
            )}

            {/* New search footer when results shown */}
            {results && (
              <div className="px-4 sm:px-6 py-4 border-t border-gray-200/60 bg-white flex justify-center">
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-br from-[#730D26] to-[#BA1932] text-white text-sm font-semibold hover:shadow-lg transition-all"
                >
                  <RefreshCw size={14} /> Nouvelle recherche
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
