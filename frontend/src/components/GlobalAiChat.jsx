import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Loader2, MessageCircle, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { aiApi } from '../api/aiApi'

function Message({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center shrink-0 mt-0.5">
          <Bot size={13} className="text-white" />
        </div>
      )}
      <div
        className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-navy text-white rounded-tr-sm'
            : 'bg-surface text-navy rounded-tl-sm'
        }`}
      >
        {content}
      </div>
    </div>
  )
}

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
      setTimeout(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); inputRef.current?.focus() }, 50)
    }
  }, [open])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (!open && history.length > 0 && history[history.length - 1].role === 'assistant') {
      setUnread(true)
    }
  }, [history])

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
      setHistory(h => [...h, { role: 'assistant', content: 'Sorry, I could not respond right now. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const SUGGESTIONS = [
    'Meilleur quartier à Casablanca ?',
    'Comment acheter un bien au Maroc ?',
    'Quelle est la rentabilité locative à Marrakech ?',
    'What documents do I need to buy in Morocco?',
  ]

  return (
    <>
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-2xl bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        aria-label="Open Mahalo AI"
      >
        {open ? <X size={22} className="text-white" /> : <MessageCircle size={22} className="text-white" />}
        {unread && !open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-gold rounded-full border-2 border-white" />
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-40 w-full max-w-sm bg-white rounded-3xl shadow-2xl flex flex-col h-[480px] border border-gray-100">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0 bg-gradient-to-r from-[#730D26] to-[#BA1932] rounded-t-3xl">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-white text-sm">Mahalo AI</div>
              <div className="text-white/60 text-xs">Assistant immobilier Maroc</div>
            </div>
            <button onClick={() => setOpen(false)} className="p-1 rounded-xl hover:bg-white/20 text-white/70 hover:text-white transition-colors">
              <X size={15} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {history.length === 0 && (
              <div className="text-center py-4">
                <p className="text-navy/50 text-sm mb-4">Bonjour ! Je suis Mahalo AI. Comment puis-je vous aider dans votre projet immobilier au Maroc ?</p>
                <Link
                  to="/find-my-property"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-gradient-to-r from-[#730D26]/10 to-[#BA1932]/10 border border-[#730D26]/20 text-[#730D26] text-xs font-semibold hover:from-[#730D26]/20 hover:to-[#BA1932]/20 transition-colors mb-3"
                >
                  <Sparkles size={13} />
                  Trouver mon bien idéal avec l'IA
                </Link>
                <div className="space-y-2">
                  {SUGGESTIONS.map(q => (
                    <button key={q} onClick={() => { setInput(q); inputRef.current?.focus() }}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-surface text-navy/60 hover:text-navy hover:bg-gray-100 transition-colors text-left">
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {history.map((m, i) => <Message key={i} role={m.role} content={m.content} />)}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center shrink-0">
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
                placeholder="Posez votre question…"
                className="flex-1 bg-transparent text-sm text-navy outline-none placeholder-navy/30"
              />
              <button
                onClick={send}
                disabled={!input.trim() || loading}
                className="w-7 h-7 rounded-xl bg-[#730D26] flex items-center justify-center disabled:opacity-30 hover:bg-[#BA1932] transition-colors"
              >
                <Send size={13} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
