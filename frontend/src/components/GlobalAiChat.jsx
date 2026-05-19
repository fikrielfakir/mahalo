import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Loader2, MessageCircle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { aiApi } from '../api/aiApi'

function Message({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div className={`max-w-[78%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
        isUser
          ? 'bg-navy text-white rounded-tr-sm'
          : 'bg-gray-50 text-navy border border-gray-100 rounded-tl-sm'
      }`}>
        {content}
      </div>
    </div>
  )
}

const SUGGESTIONS = [
  'Meilleur quartier à Casablanca ?',
  'Comment acheter un bien au Maroc ?',
  'Quelle est la rentabilité locative à Marrakech ?',
  'What documents do I need to buy in Morocco?',
]

export default function GlobalAiChat() {
  const [open, setOpen]       = useState(false)
  const [input, setInput]     = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [unread, setUnread]   = useState(false)
  const bottomRef             = useRef(null)
  const inputRef              = useRef(null)

  useEffect(() => {
    if (open) {
      setUnread(false)
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        inputRef.current?.focus()
      }, 80)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (!open && history.length > 0 && history[history.length - 1].role === 'assistant') {
      setUnread(true)
    }
  }, [history])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const send = async () => {
    const msg = input.trim()
    if (!msg || loading) return
    setInput('')
    const userMsg = { role: 'user', content: msg }
    setHistory(h => [...h, userMsg])
    setLoading(true)
    try {
      const res = await aiApi.generalChat({ message: msg, history })
      setHistory(h => [...h, { role: 'assistant', content: res.reply }])
    } catch {
      setHistory(h => [...h, { role: 'assistant', content: 'Désolé, une erreur est survenue. Veuillez réessayer.' }])
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-transform"
        aria-label="Ouvrir Mahalo AI"
      >
        {open
          ? <X size={22} className="text-white" />
          : <MessageCircle size={22} className="text-white" />
        }
        {unread && !open && (
          <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      {/* Right-side panel */}
      <div
        className="fixed top-0 right-0 z-40 h-full w-full sm:w-[380px] bg-white shadow-2xl flex flex-col"
        style={{
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 shrink-0 bg-gradient-to-r from-[#730D26] to-[#BA1932]">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Bot size={17} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-white text-sm">Mahalo AI</div>
            <div className="text-white/65 text-xs">Assistant immobilier · Maroc</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {history.length === 0 && (
            <div className="space-y-4">
              <p className="text-navy/55 text-sm leading-relaxed">
                Bonjour ! Je suis Mahalo AI. Comment puis-je vous aider dans votre projet immobilier au Maroc ?
              </p>

              <Link
                to="/find-my-property"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-[#730D26]/8 to-[#BA1932]/8 border border-[#730D26]/20 text-[#730D26] text-sm font-semibold hover:from-[#730D26]/15 hover:to-[#BA1932]/15 transition-colors"
              >
                <Sparkles size={14} />
                Trouver mon bien idéal avec l'IA
              </Link>

              <div className="space-y-2">
                <p className="text-xs font-semibold text-navy/30 uppercase tracking-wide">Suggestions</p>
                {SUGGESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus() }}
                    className="w-full text-left text-sm px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-100 text-navy/60 hover:text-navy hover:border-gray-200 transition-colors"
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
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center shrink-0 shadow-sm">
                <Bot size={14} className="text-white" />
              </div>
              <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-[#730D26]" />
                <span className="text-xs text-navy/40">En train de répondre…</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-5 py-4 border-t border-gray-100 shrink-0 bg-white">
          <div className="flex items-center gap-2 bg-gray-50 rounded-2xl px-4 py-3 border border-gray-200 focus-within:border-[#730D26]/40 transition-colors">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Posez votre question…"
              className="flex-1 bg-transparent text-sm text-navy outline-none placeholder-navy/35"
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center disabled:opacity-30 hover:shadow-md transition-all"
            >
              <Send size={13} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop (mobile only) */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/30 sm:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}
