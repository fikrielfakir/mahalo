import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Loader2, MessageCircle, Sparkles, Maximize2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { aiApi } from '../api/aiApi'

function Message({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <Bot size={12} className="text-white" />
        </div>
      )}
      <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-[13px] leading-relaxed whitespace-pre-wrap ${
        isUser
          ? 'bg-[#BA1932] text-white rounded-br-sm'
          : 'bg-[#f0f0f0] text-gray-900 rounded-bl-sm'
      }`}>
        {content}
      </div>
    </div>
  )
}

const SUGGESTIONS = [
  'Meilleur quartier à Casablanca ?',
  'Comment acheter un bien au Maroc ?',
  'Rentabilité locative à Marrakech ?',
  'Documents pour acheter au Maroc ?',
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
      }, 100)
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
      setHistory(h => [...h, { role: 'assistant', content: 'Désolé, une erreur est survenue.' }])
    } finally {
      setLoading(false)
    }
  }

  const onKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-gradient-to-br from-[#730D26] to-[#BA1932] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
        aria-label="Ouvrir Mahalo AI"
      >
        <MessageCircle size={20} className="text-white" />
        {unread && !open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />
        )}
      </button>

      {/* Floating chat pane */}
      <div
        style={{
          position: 'fixed',
          bottom: '88px',
          right: '16px',
          width: '328px',
          height: '460px',
          zIndex: 49,
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 8px 40px rgba(0,0,0,0.18)',
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          transformOrigin: 'bottom right',
          transform: open ? 'scale(1)' : 'scale(0.85)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'transform 0.22s cubic-bezier(0.22,1,0.36,1), opacity 0.18s ease',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 14px',
            background: 'linear-gradient(135deg, #730D26, #BA1932)',
            flexShrink: 0,
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={15} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, lineHeight: 1.2 }}>Mahalo AI</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Assistant immobilier</div>
          </div>
          <button
            onClick={() => setOpen(false)}
            style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            <X size={14} />
          </button>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {history.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ color: '#888', fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                Bonjour ! Je suis <strong style={{ color: '#730D26' }}>Mahalo AI</strong>. Comment puis-je vous aider ?
              </p>

              <Link
                to="/find-my-property"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 12px', borderRadius: 12,
                  background: 'linear-gradient(135deg, rgba(115,13,38,0.07), rgba(186,25,50,0.07))',
                  border: '1px solid rgba(115,13,38,0.2)',
                  color: '#730D26', fontSize: 12, fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Sparkles size={12} />
                Trouver mon bien idéal avec l'IA
              </Link>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 2 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                  Suggestions
                </p>
                {SUGGESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => { setInput(q); inputRef.current?.focus() }}
                    style={{
                      textAlign: 'left', fontSize: 12, padding: '7px 10px',
                      borderRadius: 10, background: '#f7f7f7',
                      border: '1px solid #ebebeb', color: '#555',
                      cursor: 'pointer', lineHeight: 1.4,
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {history.map((m, i) => <Message key={i} role={m.role} content={m.content} />)}

          {loading && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg,#730D26,#BA1932)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={12} color="#fff" />
              </div>
              <div style={{
                background: '#f0f0f0', borderRadius: 12,
                padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Loader2 size={12} style={{ animation: 'spin 1s linear infinite', color: '#BA1932' }} />
                <span style={{ fontSize: 12, color: '#aaa' }}>En train de répondre…</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{
          padding: '10px 12px',
          borderTop: '1px solid #f0f0f0',
          background: '#fff',
          flexShrink: 0,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: '#f7f7f7', borderRadius: 24,
            padding: '8px 8px 8px 14px',
            border: '1px solid #ebebeb',
          }}>
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKey}
              placeholder="Écrivez un message…"
              style={{
                flex: 1, background: 'transparent',
                fontSize: 13, color: '#222',
                outline: 'none', border: 'none',
              }}
            />
            <button
              onClick={send}
              disabled={!input.trim() || loading}
              style={{
                width: 32, height: 32, borderRadius: '50%',
                background: input.trim() && !loading
                  ? 'linear-gradient(135deg,#730D26,#BA1932)'
                  : '#e5e5e5',
                border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'background 0.2s',
                flexShrink: 0,
              }}
            >
              <Send size={13} color={input.trim() && !loading ? '#fff' : '#bbb'} />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
