import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Loader2, Sparkles, MapPin, Bed, Bath, Maximize2, RefreshCw, ArrowRight } from 'lucide-react'
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

function formatPrice(price) {
  if (!price) return 'Sur demande'
  const n = parseFloat(price)
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M MAD`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K MAD`
  return `${n.toLocaleString()} MAD`
}

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

function MatchResults({ properties, commentary, onReset }) {
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
          <div className="flex items-center justify-between pt-2">
            <Link
              to="/properties"
              className="flex items-center gap-2 text-sm text-[#730D26] font-semibold hover:underline"
            >
              Voir toutes les annonces <ArrowRight size={14} />
            </Link>
            <button
              onClick={onReset}
              className="flex items-center gap-2 text-sm text-navy/50 hover:text-navy transition-colors"
            >
              <RefreshCw size={13} /> Nouvelle recherche
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function PropertyMatchPage() {
  const [history, setHistory]     = useState([OPENING])
  const [input, setInput]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [results, setResults]     = useState(null)
  const [searching, setSearching] = useState(false)
  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, results])

  const send = async (text) => {
    const msg = (text || input).trim()
    if (!msg || loading || searching) return
    setInput('')

    const userMsg  = { role: 'user', content: msg }
    const newHistory = [...history, userMsg]
    setHistory(newHistory)
    setLoading(true)

    try {
      // Ask AI to respond naturally AND check if we have enough info to search
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
        // We have enough info — show results
        setHistory(h => [...h, { role: 'assistant', content: chatRes.reply }])
        setResults({
          properties: matchRes.properties || [],
          commentary: matchRes.commentary,
        })
      } else {
        // Keep asking questions
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
                      disabled={loading || searching}
                    />
                  </div>
                  <button
                    onClick={() => send()}
                    disabled={!input.trim() || loading || searching}
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
