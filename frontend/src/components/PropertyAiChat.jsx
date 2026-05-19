import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { aiApi } from '../api/aiApi'

const LANG_NAMES = { fr: 'French', en: 'English', ar: 'Arabic', es: 'Spanish', de: 'German' }

const SUGGESTIONS = {
  fr: [
    'Comment est le quartier ?',
    'Est-ce un bon investissement ?',
    'Comment fonctionne l\'achat au Maroc ?',
  ],
  ar: [
    'كيف هو الحي ؟',
    'هل هو استثمار جيد ؟',
    'كيف تتم عملية الشراء في المغرب ؟',
  ],
  en: [
    "What's the neighborhood like?",
    'Is this a good investment?',
    'How does the buying process work in Morocco?',
  ],
  es: [
    '¿Cómo es el vecindario?',
    '¿Es una buena inversión?',
    '¿Cómo funciona el proceso de compra en Marruecos?',
  ],
}

const INTRO = {
  fr: 'Bonjour ! Posez-moi toutes vos questions sur ce bien — prix, quartier, processus d\'achat, ou autre.',
  ar: 'مرحباً ! اسألني أي شيء عن هذا العقار — السعر، الحي، عملية الشراء، أو أي شيء آخر.',
  en: 'Hi! Ask me anything about this property — price, neighborhood, buying process, or anything else.',
  es: '¡Hola! Pregúntame lo que quieras sobre esta propiedad — precio, barrio, proceso de compra, o cualquier cosa.',
}

const PLACEHOLDER = {
  fr: 'Posez une question sur ce bien…',
  ar: 'اسأل عن هذا العقار…',
  en: 'Ask about this property…',
  es: 'Pregunta sobre esta propiedad…',
}

function Message({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center shrink-0 mt-0.5">
          <Bot size={13} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-navy text-white rounded-tr-sm'
            : 'bg-surface text-navy rounded-tl-sm'
        }`}
        style={{ whiteSpace: 'pre-wrap' }}
      >
        {content}
      </div>
    </div>
  )
}

export default function PropertyAiChat({ property }) {
  const { i18n } = useTranslation()
  const langCode  = i18n.language?.split('-')[0] || 'fr'
  const language  = LANG_NAMES[langCode] || 'French'
  const suggestions = SUGGESTIONS[langCode] || SUGGESTIONS.fr
  const intro       = INTRO[langCode]       || INTRO.fr
  const placeholder = PLACEHOLDER[langCode] || PLACEHOLDER.fr

  const [open, setOpen]       = useState(false)
  const [input, setInput]     = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const bottomRef             = useRef(null)
  const inputRef              = useRef(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [open, history])

  const send = async (quickMsg = null) => {
    const msg = (quickMsg ?? input).trim()
    if (!msg || loading) return
    setInput('')
    const userMsg = { role: 'user', content: msg }
    setHistory(h => [...h, userMsg])
    setLoading(true)
    try {
      const res = await aiApi.propertyChat({
        message:  msg,
        history:  history,
        language,
        property: {
          name:             property?.name,
          type:             property?.type,
          price:            property?.price,
          square:           property?.square,
          number_bedroom:   property?.number_bedroom,
          number_bathroom:  property?.number_bathroom,
          location:         property?.location,
          condition:        property?.condition,
          age_range:        property?.age_range,
          city:             property?.city   ? { name: property.city.name }   : null,
          agent:            property?.agent  ? { name: property.agent.name }  : null,
          categories:       property?.categories?.map(c => ({ name: c.name })) ?? [],
          features:         property?.features?.map(f => ({ name: f.name }))  ?? [],
        },
      })
      setHistory(h => [...h, { role: 'assistant', content: res.reply }])
    } catch {
      setHistory(h => [...h, { role: 'assistant', content: langCode === 'ar'
        ? 'عذراً، لم أتمكن من الرد الآن. حاول مرة أخرى.'
        : langCode === 'en'
          ? 'Sorry, I could not respond right now. Please try again.'
          : 'Désolé, je n\'ai pas pu répondre. Veuillez réessayer.' }])
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-gold/30 bg-gold/5 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors"
      >
        <MessageCircle size={15} />
        {langCode === 'ar'
          ? 'اسأل ماهالو AI عن هذا العقار'
          : langCode === 'en'
            ? 'Ask Mahalo AI about this property'
            : 'Demander à Mahalo AI'}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-end sm:p-6 p-0">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm sm:hidden" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col w-full sm:w-96 h-[70vh] sm:h-[520px]">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center">
                <Bot size={15} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-navy text-sm">Mahalo AI</div>
                <div className="text-navy/40 text-xs truncate">{property?.name}</div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-xl hover:bg-surface text-navy/40 hover:text-navy transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {history.length === 0 && (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-3">
                    <Bot size={22} className="text-gold" />
                  </div>
                  <p className="text-navy/50 text-sm px-2">{intro}</p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {suggestions.map(q => (
                      <button
                        key={q}
                        onClick={() => send(q)}
                        className="text-xs px-3 py-1.5 rounded-xl bg-surface text-navy/60 hover:text-navy hover:bg-gray-100 transition-colors text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {history.map((m, i) => <Message key={i} role={m.role} content={m.content} />)}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-gold to-gold/70 flex items-center justify-center shrink-0">
                    <Bot size={13} className="text-white" />
                  </div>
                  <div className="bg-surface px-3.5 py-2.5 rounded-2xl rounded-tl-sm">
                    <Loader2 size={14} className="animate-spin text-navy/40" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="px-4 py-3 border-t border-gray-100 shrink-0">
              <div className="flex items-center gap-2 bg-surface rounded-2xl px-3 py-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={onKey}
                  placeholder={placeholder}
                  className="flex-1 bg-transparent text-sm text-navy outline-none placeholder-navy/30"
                  dir={langCode === 'ar' ? 'rtl' : 'ltr'}
                />
                <button
                  onClick={() => send()}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-xl bg-navy flex items-center justify-center disabled:opacity-30 hover:bg-navy/80 transition-colors"
                >
                  <Send size={13} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
