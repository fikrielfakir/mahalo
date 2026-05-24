import { useState, useRef, useEffect } from 'react'
import { Bot, X, Send, Loader2, MessageCircle, Sparkles, MapPin, Bed, Maximize2, Phone, User } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { aiApi } from '../api/aiApi'

function PropertyCard({ property, t }) {
  const price = property.price
    ? Number(property.price).toLocaleString('fr-MA') + ' MAD'
    : 'Prix sur demande'
  const slug = property.slug?.key
  const city = property.city?.name
  const isSale = property.status === 'selling' || property.status === 'sale'

  return (
    <div style={{
      borderRadius: 10, border: '1px solid #e8e8e8',
      background: '#fff', overflow: 'hidden', fontSize: 12,
    }}>
      {property.images?.[0] || property.image ? (
        <img
          src={property.images?.[0] || property.image}
          alt={property.name}
          style={{ width: '100%', height: 68, objectFit: 'cover', display: 'block' }}
          onError={e => { e.currentTarget.style.display = 'none' }}
        />
      ) : (
        <div style={{
          width: '100%', height: 40,
          background: 'linear-gradient(135deg,#730D26,#BA1932)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Maximize2 size={14} color="rgba(255,255,255,0.4)" />
        </div>
      )}
      <div style={{ padding: '7px 9px' }}>
        <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
          <span style={{
            fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em',
            padding: '2px 5px', borderRadius: 4,
            background: isSale ? '#fef3c7' : '#dbeafe',
            color: isSale ? '#92400e' : '#1e40af',
          }}>
            {isSale ? t('aiChat.sale') : t('aiChat.rent')}
          </span>
        </div>
        <p style={{ fontWeight: 700, color: '#1a1a1a', lineHeight: 1.3, marginBottom: 3, fontSize: 11 }}>
          {property.name}
        </p>
        <p style={{ fontWeight: 800, color: '#BA1932', marginBottom: 5, fontSize: 12 }}>
          {price}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, color: '#999', marginBottom: 6, fontSize: 10 }}>
          {city && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <MapPin size={8} /> {city}
            </span>
          )}
          {property.number_bedroom > 0 && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Bed size={8} /> {property.number_bedroom}
            </span>
          )}
          {property.square && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Maximize2 size={8} /> {property.square} m²
            </span>
          )}
        </div>
        {slug && (
          <Link
            to={`/properties/${slug}`}
            style={{
              display: 'block', textAlign: 'center',
              padding: '5px 8px', borderRadius: 7,
              background: 'linear-gradient(135deg,#730D26,#BA1932)',
              color: '#fff', fontWeight: 700, fontSize: 10,
              textDecoration: 'none',
            }}
          >
            {t('aiChat.viewProperty')}
          </Link>
        )}
      </div>
    </div>
  )
}

function AgentCard({ agent, t }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '8px 10px', borderRadius: 10,
      border: '1px solid #e8e8e8', background: '#fff',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: 'linear-gradient(135deg,#730D26,#BA1932)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {agent.avatar
          ? <img src={agent.avatar} alt={agent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => { e.currentTarget.style.display = 'none' }} />
          : <User size={13} color="#fff" />
        }
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontWeight: 700, fontSize: 12, color: '#1a1a1a', margin: 0, lineHeight: 1.2 }}>{agent.name}</p>
        {agent.city && <p style={{ fontSize: 10, color: '#888', margin: 0 }}>{agent.city}</p>}
      </div>
      {agent.phone && (
        <a
          href={`tel:${agent.phone}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '5px 8px', borderRadius: 7,
            background: '#f0fdf4', border: '1px solid #bbf7d0',
            color: '#15803d', fontSize: 10, fontWeight: 700,
            textDecoration: 'none', flexShrink: 0,
          }}
        >
          <Phone size={9} /> {t('aiChat.call')}
        </a>
      )}
    </div>
  )
}

function Message({ role, content, properties, agents, t }) {
  const isUser  = role === 'user'
  const hasCards = !isUser && ((properties?.length > 0) || (agents?.length > 0))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: isUser ? 'flex-end' : 'flex-start' }}>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flexDirection: isUser ? 'row-reverse' : 'row', maxWidth: '86%' }}>
        {!isUser && (
          <div style={{
            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg,#730D26,#BA1932)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 2,
          }}>
            <Bot size={11} color="#fff" />
          </div>
        )}
        <div style={{
          padding: '9px 12px',
          borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
          background: isUser ? 'linear-gradient(135deg,#730D26,#BA1932)' : '#f0f0f0',
          color: isUser ? '#fff' : '#222',
          fontSize: 13, lineHeight: 1.55, whiteSpace: 'pre-wrap',
        }}>
          {content}
        </div>
      </div>

      {hasCards && (
        <div style={{ paddingLeft: 34, width: '100%', boxSizing: 'border-box' }}>
          {properties?.length > 0 && (
            <>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '2px 0 6px' }}>
                {t('aiChat.propertiesLabel')}
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                {properties.map(p => <PropertyCard key={p.id} property={p} t={t} />)}
              </div>
            </>
          )}
          {agents?.length > 0 && (
            <>
              <p style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '8px 0 6px' }}>
                {t('aiChat.agentsLabel')}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {agents.map(a => <AgentCard key={a.id} agent={a} t={t} />)}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default function GlobalAiChat() {
  const { t } = useTranslation()
  const [open, setOpen]       = useState(false)
  const [input, setInput]     = useState('')
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [unread, setUnread]   = useState(false)
  const bottomRef             = useRef(null)
  const inputRef              = useRef(null)

  const SUGGESTIONS = [
    t('aiChat.s1'),
    t('aiChat.s2'),
    t('aiChat.s3'),
    t('aiChat.s4'),
  ]

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

  const send = async (quickMsg = null) => {
    const text = (quickMsg ?? input).trim()
    if (!text || loading) return
    setInput('')
    const userMsg = { role: 'user', content: text }
    setHistory(h => [...h, userMsg])
    setLoading(true)
    try {
      const res = await aiApi.generalChat({
        message: text,
        history: history.map(m => ({ role: m.role, content: m.content })),
      })
      setHistory(h => [...h, {
        role:       'assistant',
        content:    res.reply,
        properties: res.properties || [],
        agents:     res.agents     || [],
      }])
    } catch {
      setHistory(h => [...h, { role: 'assistant', content: t('aiChat.error') }])
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
        aria-label={t('aiChat.open')}
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
          width: '360px',
          height: '520px',
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
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 14px',
          background: 'linear-gradient(135deg, #730D26, #BA1932)',
          flexShrink: 0,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Bot size={15} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, color: '#fff', fontSize: 13, lineHeight: 1.2 }}>Mahalo AI</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{t('aiChat.subtitle')}</div>
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
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {history.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ color: '#888', fontSize: 13, lineHeight: 1.55, margin: 0 }}>
                {t('aiChat.greeting')}
              </p>

              <Link
                to="/find-my-property"
                onClick={() => setOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: '9px 12px', borderRadius: 12,
                  background: 'linear-gradient(135deg,rgba(115,13,38,0.07),rgba(186,25,50,0.07))',
                  border: '1px solid rgba(115,13,38,0.2)',
                  color: '#730D26', fontSize: 12, fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                <Sparkles size={12} />
                {t('aiChat.findIdeal')}
              </Link>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 2 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: '#bbb', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                  {t('aiChat.suggestions')}
                </p>
                {SUGGESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => send(q)}
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

          {history.map((m, i) => (
            <Message
              key={i}
              role={m.role}
              content={m.content}
              properties={m.properties}
              agents={m.agents}
              t={t}
            />
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'linear-gradient(135deg,#730D26,#BA1932)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={11} color="#fff" />
              </div>
              <div style={{
                background: '#f0f0f0', borderRadius: 12,
                padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 6,
              }}>
                <Loader2 size={12} style={{ animation: 'spin 1s linear infinite', color: '#BA1932' }} />
                <span style={{ fontSize: 12, color: '#aaa' }}>{t('aiChat.searching')}</span>
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
              placeholder={t('aiChat.placeholder')}
              style={{
                flex: 1, background: 'transparent',
                fontSize: 13, color: '#222',
                outline: 'none', border: 'none',
              }}
            />
            <button
              onClick={() => send()}
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
