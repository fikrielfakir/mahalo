import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Bot, ChevronDown } from 'lucide-react'
import { aiApi } from '../api/aiApi'

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
      >
        {content}
      </div>
    </div>
  )
}

export default function PropertyAiChat({ property }) {
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

  const send = async () => {
    const msg = input.trim()
    if (!msg || loading) return
    setInput('')
    const userMsg = { role: 'user', content: msg }
    setHistory(h => [...h, userMsg])
    setLoading(true)
    try {
      const res = await aiApi.propertyChat({
        message:  msg,
        history:  history,
        property: property,
      })
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

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl border border-gold/30 bg-gold/5 text-gold font-semibold text-sm hover:bg-gold/10 transition-colors"
      >
        <MessageCircle size={15} />
        Ask Mahalo AI about this property
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
                  <p className="text-navy/50 text-sm">Hi! Ask me anything about this property — price, neighborhood, buying process, or anything else.</p>
                  <div className="mt-4 flex flex-wrap gap-2 justify-center">
                    {["What's the neighborhood like?", 'Is this a good investment?', 'How does the buying process work in Morocco?'].map(q => (
                      <button key={q} onClick={() => { setInput(q); inputRef.current?.focus() }}
                        className="text-xs px-3 py-1.5 rounded-xl bg-surface text-navy/60 hover:text-navy hover:bg-gray-100 transition-colors text-left">
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
                  placeholder="Ask about this property…"
                  className="flex-1 bg-transparent text-sm text-navy outline-none placeholder-navy/30"
                />
                <button
                  onClick={send}
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
