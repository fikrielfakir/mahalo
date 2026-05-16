import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  MessageCircle, Send, Loader2, ChevronLeft, Mail, Phone,
  AlertCircle, Building, Home, Search, UserCircle,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { agentDashboardApi, userChatsApi } from '../api/client'
import { useUserAuth } from '../context/UserAuthContext'

/* ─── shared helpers ───────────────────────────────────────────────────── */

function fmtDate(str, t) {
  if (!str) return ''
  const d = new Date(str)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return t('messages.justNow')
  if (diff < 3600000) return `${Math.floor(diff / 60000)}${t('messages.mAgo')}`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}${t('messages.hAgo')}`
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
}

const MSG_STATUS_STYLES = {
  unread:     'bg-blue-50 text-blue-600',
  read:       'bg-gray-100 text-gray-400',
  processing: 'bg-amber-50 text-amber-600',
  done:       'bg-emerald-50 text-emerald-600',
}

/* ══════════════════════════════════════════════════════════════════════════
   AGENT VIEW  — same logic as MessagesTab in /agent-dashboard
   ══════════════════════════════════════════════════════════════════════════ */

function AgentChatThread({ consult, onReplied }) {
  const { t } = useTranslation()
  const [thread, setThread]       = useState(null)
  const [loading, setLoading]     = useState(true)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending]     = useState(false)
  const [sendError, setSendError] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setThread(null)
    agentDashboardApi.getThread(consult.id)
      .then(r => setThread(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [consult.id])

  useEffect(() => {
    if (thread) bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [thread])

  const handleSend = () => {
    const body = replyText.trim()
    if (!body || sending) return
    setSending(true)
    setSendError(null)
    agentDashboardApi.replyMessage(consult.id, { reply: body })
      .then(r => {
        setThread(prev => ({ ...prev, replies: [...(prev.replies || []), r.data], status: 'done' }))
        setReplyText('')
        onReplied()
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
      .catch(err => setSendError(err?.response?.data?.message || 'Failed to send.'))
      .finally(() => setSending(false))
  }

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-[#730D26]" /></div>

  const messages = []
  if (thread?.content) messages.push({ id: 'original', body: thread.content, sender: 'user', created_at: thread.created_at })
  ;(thread?.replies || []).forEach(r => messages.push(r))

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#730D26]/10 flex items-center justify-center text-[#730D26] font-bold text-sm shrink-0">
          {consult.name?.[0]?.toUpperCase() || '?'}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-navy text-sm truncate">{consult.name}</p>
          <div className="flex items-center gap-3 flex-wrap">
            {consult.email && <span className="flex items-center gap-1 text-xs text-navy/45"><Mail size={10} />{consult.email}</span>}
            {consult.phone && <span className="flex items-center gap-1 text-xs text-navy/45"><Phone size={10} />{consult.phone}</span>}
          </div>
        </div>
        {thread?.status && (
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg shrink-0 ${MSG_STATUS_STYLES[thread.status] || 'bg-gray-100 text-gray-500'}`}>
            {t(`messages.${thread.status}`) || thread.status}
          </span>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#F7F7F8]">
        {(consult.property?.name || consult.project?.name) && (
          <div className="flex justify-center">
            <span className="text-[11px] text-navy/40 bg-white border border-gray-100 rounded-full px-3 py-1 flex items-center gap-1">
              {consult.property ? <Home size={10} /> : <Building size={10} />}
              {t('messages.reLabel')} {consult.property?.name || consult.project?.name}
            </span>
          </div>
        )}
        {messages.length === 0 && (
          <div className="flex justify-center">
            <span className="text-xs text-navy/30 italic">{t('messages.noContent')}</span>
          </div>
        )}
        {messages.map(msg => {
          const isAgent = msg.sender === 'agent'
          return (
            <div key={msg.id} className={`flex ${isAgent ? 'justify-end' : 'justify-start'}`}>
              {!isAgent && (
                <div className="w-7 h-7 rounded-lg bg-[#730D26]/10 flex items-center justify-center text-[#730D26] font-bold text-xs shrink-0 mr-2 mt-0.5">
                  {consult.name?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className={`max-w-[72%] ${isAgent ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  isAgent ? 'bg-[#730D26] text-white rounded-br-sm' : 'bg-white text-navy border border-gray-100 rounded-bl-sm shadow-sm'
                }`}>{msg.body}</div>
                <span className="text-[10px] text-navy/30 px-1">{fmtDate(msg.created_at, t)}</span>
              </div>
              {isAgent && (
                <div className="w-7 h-7 rounded-lg bg-[#730D26] flex items-center justify-center text-white font-bold text-xs shrink-0 ml-2 mt-0.5">A</div>
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        {sendError && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-2">
            <AlertCircle size={12} />{sendError}
          </div>
        )}
        {!consult.email && (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-2">
            <AlertCircle size={12} />{t('messages.noEmail')}
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={replyText} onChange={e => setReplyText(e.target.value)} onKeyDown={handleKey}
            placeholder={t('messages.typeReply')}
            rows={2} disabled={sending}
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-[#730D26] resize-none disabled:opacity-60 bg-white"
          />
          <button onClick={handleSend} disabled={!replyText.trim() || sending}
            className="w-10 h-10 rounded-xl bg-[#730D26] text-white flex items-center justify-center hover:bg-[#5a0a1e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}

function AgentMessagesView() {
  const { t } = useTranslation()
  const [rows, setRows]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [error, setError]           = useState(null)
  const [search, setSearch]         = useState('')
  const [status, setStatus]         = useState('')
  const [selected, setSelected]     = useState(null)
  const [mobileView, setMobileView] = useState('list')

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    agentDashboardApi.messages({ search, status, per_page: 50 })
      .then(r => {
        const data = r.data ?? []
        setRows(data)
        if (!selected && data.length > 0) setSelected(data[0])
      })
      .catch(err => setError(err?.response?.data?.message || t('messages.failedLoad')))
      .finally(() => setLoading(false))
  }, [search, status])

  useEffect(() => { load() }, [load])

  const handleSelect = m => {
    setSelected(m)
    setMobileView('chat')
    setRows(prev => prev.map(r => r.id === m.id ? { ...r, status: r.status === 'unread' ? 'read' : r.status } : r))
  }

  const handleReplied = () => {
    setRows(prev => prev.map(r => r.id === selected?.id ? { ...r, status: 'done' } : r))
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: '600px' }}>
      <div className="flex h-full">
        {/* Left list */}
        <div className={`flex flex-col border-r border-gray-100 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} w-full md:w-72 lg:w-80 shrink-0`}>
          <div className="px-4 py-3 border-b border-gray-100 space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('messages.searchConversations')}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#730D26] bg-white" />
            </div>
            <select value={status} onChange={e => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#730D26] bg-white">
              <option value="">{t('messages.allStatuses')}</option>
              <option value="unread">{t('messages.unread')}</option>
              <option value="read">{t('messages.read')}</option>
              <option value="processing">{t('messages.processing')}</option>
              <option value="done">{t('messages.done')}</option>
            </select>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 size={20} className="animate-spin text-[#730D26]" /></div>
            ) : error ? (
              <div className="p-4 text-center">
                <p className="text-xs text-red-500">{error}</p>
                <button onClick={load} className="mt-2 text-xs text-[#730D26] underline">{t('messages.retry')}</button>
              </div>
            ) : rows.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <MessageCircle size={28} className="text-navy/20 mb-2" />
                <p className="text-xs text-navy/40">{t('messages.noMessages')}</p>
              </div>
            ) : rows.map(m => {
              const isActive = selected?.id === m.id
              const isUnread = m.status === 'unread'
              return (
                <button key={m.id} onClick={() => handleSelect(m)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors flex items-start gap-3 ${
                    isActive ? 'bg-[#730D26]/5 border-l-2 border-l-[#730D26]' : 'hover:bg-gray-50'
                  }`}>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${isActive ? 'bg-[#730D26] text-white' : 'bg-[#730D26]/10 text-[#730D26]'}`}>
                    {m.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-sm truncate ${isUnread ? 'font-bold text-navy' : 'font-medium text-navy/70'}`}>{m.name}</p>
                      <span className="text-[10px] text-navy/30 shrink-0">{fmtDate(m.created_at, t)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-navy/40 truncate">{m.email || m.phone || '—'}</p>
                      {isUnread && <span className="w-2 h-2 rounded-full bg-[#730D26] shrink-0 ml-1" />}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Right thread */}
        <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
          {selected ? (
            <>
              <button onClick={() => setMobileView('list')} className="md:hidden flex items-center gap-2 px-4 py-2 text-xs text-[#730D26] font-semibold border-b border-gray-100">
                <ChevronLeft size={14} />{t('messages.backToMessages')}
              </button>
              <AgentChatThread key={selected.id} consult={selected} onReplied={handleReplied} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <MessageCircle size={40} className="text-navy/15 mb-3" />
              <p className="text-sm font-semibold text-navy/30">{t('messages.selectConversation')}</p>
              <p className="text-xs text-navy/20 mt-1">{t('messages.clickToOpen')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   USER VIEW  — regular users see their own chats with agents
   ══════════════════════════════════════════════════════════════════════════ */

function agentName(agent) {
  if (!agent) return 'Agent'
  return agent.display_name || `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Agent'
}

function AgentAvatar({ agent, size = 10 }) {
  const src = agent?.avatar?.url || agent?.avatar_url
  const initials = agentName(agent).split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const cls = `w-${size} h-${size} rounded-xl flex items-center justify-center text-sm font-bold shrink-0 bg-[#730D26]/10 text-[#730D26] overflow-hidden`
  if (src) return <div className={cls}><img src={src} alt="" className="w-full h-full object-cover" /></div>
  return <div className={cls}>{initials}</div>
}

function UserChatPane({ chat, onMessageSent }) {
  const { t } = useTranslation()
  const [thread, setThread]   = useState(null)
  const [loading, setLoading] = useState(true)
  const [text, setText]       = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    setLoading(true)
    setThread(null)
    userChatsApi.getThread(chat.id)
      .then(r => setThread(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [chat.id])

  useEffect(() => {
    if (thread) setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }, [thread])

  const handleSend = () => {
    const body = text.trim()
    if (!body || sending) return
    setSending(true)
    setError(null)
    userChatsApi.sendMessage(chat.id, { message: body })
      .then(r => {
        setThread(prev => ({ ...prev, replies: [...(prev.replies || []), r.data] }))
        setText('')
        onMessageSent(chat.id)
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
      .catch(err => setError(err?.response?.data?.message || 'Failed to send.'))
      .finally(() => setSending(false))
  }

  const handleKey = e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 size={24} className="animate-spin text-[#730D26]" /></div>

  const agent = thread?.agent || chat?.agent
  const messages = []
  if (thread?.content) messages.push({ id: 'orig', body: thread.content, sender: 'user', created_at: thread.created_at })
  ;(thread?.replies || []).forEach(r => messages.push(r))

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center gap-3">
        <AgentAvatar agent={agent} size={10} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-navy text-sm truncate">{agentName(agent)}</p>
          <div className="flex items-center gap-3 flex-wrap">
            {agent?.email && <span className="flex items-center gap-1 text-xs text-navy/45"><Mail size={10} />{agent.email}</span>}
            {agent?.phone && <span className="flex items-center gap-1 text-xs text-navy/45"><Phone size={10} />{agent.phone}</span>}
          </div>
        </div>
        {agent?.id && (
          <Link to={`/agents/${agent.id}`} className="text-xs text-[#730D26] font-semibold hover:underline shrink-0">{t('messages.viewProfile')}</Link>
        )}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#F7F7F8]">
        {messages.length === 0 && (
          <div className="flex justify-center">
            <span className="text-xs text-navy/30 italic bg-white px-4 py-2 rounded-full border border-gray-100">{t('messages.chatStarted')}</span>
          </div>
        )}
        {messages.map(msg => {
          const isUser = msg.sender === 'user'
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
              {!isUser && <AgentAvatar agent={agent} size={7} />}
              {!isUser && <div className="w-2" />}
              <div className={`flex flex-col gap-1 max-w-[72%] ${isUser ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser ? 'bg-[#730D26] text-white rounded-br-sm' : 'bg-white text-navy border border-gray-100 rounded-bl-sm shadow-sm'
                }`}>{msg.body}</div>
                <span className="text-[10px] text-navy/30 px-1">{fmtDate(msg.created_at, t)}</span>
              </div>
              {isUser && <div className="w-2" />}
              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-[#730D26] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">{t('messages.me')}</div>
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="px-4 py-3 bg-white border-t border-gray-100">
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-2">
            <AlertCircle size={12} />{error}
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea value={text} onChange={e => setText(e.target.value)} onKeyDown={handleKey}
            placeholder={t('messages.typeMessageEnter')} rows={2} disabled={sending}
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-[#730D26] resize-none disabled:opacity-60" />
          <button onClick={handleSend} disabled={!text.trim() || sending}
            className="w-10 h-10 rounded-xl bg-[#730D26] text-white flex items-center justify-center hover:bg-[#5a0a1e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0">
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}

function UserChatsView() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const agentIdParam = searchParams.get('agent_id')
  const chatIdParam  = searchParams.get('id')

  const [chats, setChats]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [selected, setSelected]     = useState(null)
  const [mobileView, setMobileView] = useState('list')
  const [search, setSearch]         = useState('')

  const loadChats = useCallback(() => {
    setLoading(true)
    return userChatsApi.list()
      .then(r => { setChats(r.data || []); return r.data || [] })
      .catch(() => [])
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    loadChats().then(data => {
      if (chatIdParam) {
        const found = data.find(c => String(c.id) === chatIdParam)
        if (found) { setSelected(found); setMobileView('chat') }
      } else if (agentIdParam) {
        const found = data.find(c => String(c.agent_id) === agentIdParam)
        if (found) { setSelected(found); setMobileView('chat') }
        else {
          userChatsApi.startChat({ agent_id: parseInt(agentIdParam) })
            .then(r => {
              setChats(prev => prev.find(c => c.id === r.data.id) ? prev : [r.data, ...prev])
              setSelected(r.data)
              setMobileView('chat')
            })
            .catch(() => {})
        }
      } else if (data.length > 0) {
        setSelected(data[0])
      }
    })
  }, [chatIdParam, agentIdParam])

  const handleMessageSent = chatId => {
    setChats(prev => {
      const idx = prev.findIndex(c => c.id === chatId)
      if (idx === -1) return prev
      const updated = [...prev]
      updated[idx] = { ...updated[idx], updated_at: new Date().toISOString() }
      return updated
    })
  }

  const filtered = chats.filter(c => {
    if (!search) return true
    return agentName(c.agent).toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: '600px' }}>
      <div className="flex h-full">
        <div className={`flex flex-col border-r border-gray-100 w-full md:w-72 lg:w-80 shrink-0 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder={t('messages.searchAgent')}
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#730D26] bg-white" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12"><Loader2 size={20} className="animate-spin text-[#730D26]" /></div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <MessageCircle size={28} className="text-navy/20 mb-2" />
                <p className="text-xs text-navy/40 font-medium">{t('messages.noConversations')}</p>
                <p className="text-xs text-navy/30 mt-1">{t('messages.visitAgent')}</p>
                <Link to="/agents" className="mt-3 text-xs text-[#730D26] font-semibold hover:underline">{t('messages.browseAgents')} →</Link>
              </div>
            ) : filtered.map(chat => {
              const isActive = selected?.id === chat.id
              const lastReply = chat.replies?.[chat.replies.length - 1]
              const preview = lastReply?.body || chat.content || t('messages.noMessages')
              const hasAgentReply = chat.replies?.some(r => r.sender === 'agent')
              return (
                <button key={chat.id} onClick={() => { setSelected(chat); setMobileView('chat') }}
                  className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors flex items-start gap-3 ${
                    isActive ? 'bg-[#730D26]/5 border-l-2 border-l-[#730D26]' : 'hover:bg-gray-50'
                  }`}>
                  <AgentAvatar agent={chat.agent} size={9} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-sm font-semibold text-navy truncate">{agentName(chat.agent)}</p>
                      <span className="text-[10px] text-navy/30 shrink-0">{fmtDate(chat.updated_at || chat.created_at, t)}</span>
                    </div>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-xs text-navy/40 truncate">{preview}</p>
                      {hasAgentReply && <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 ml-1" title="Agent replied" />}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
          <div className="px-4 py-3 border-t border-gray-100">
            <Link to="/agents" className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#730D26]/8 text-[#730D26] text-xs font-semibold hover:bg-[#730D26]/15 transition-colors">
              <UserCircle size={13} /> {t('messages.chatNewAgent')}
            </Link>
          </div>
        </div>

        <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
          {selected ? (
            <>
              <button onClick={() => setMobileView('list')} className="md:hidden flex items-center gap-2 px-4 py-2 text-xs text-[#730D26] font-semibold border-b border-gray-100">
                <ChevronLeft size={14} />{t('messages.backToMessages')}
              </button>
              <UserChatPane key={selected.id} chat={selected} onMessageSent={handleMessageSent} />
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
              <MessageCircle size={44} className="text-navy/15 mb-4" />
              <p className="text-sm font-bold text-navy/30">{t('messages.selectConversation')}</p>
              <p className="text-xs text-navy/20 mt-1">{t('messages.clickToOpen')}</p>
              <Link to="/agents" className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: 'linear-gradient(135deg,#730D26,#BA1932)' }}>{t('messages.browseAgents')}</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════
   PAGE SHELL  — detects role and renders the right view
   ══════════════════════════════════════════════════════════════════════════ */

export default function UserChatsPage() {
  const { t } = useTranslation()
  const { user, isAuthenticated, loading: authLoading } = useUserAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login')
  }, [authLoading, isAuthenticated, navigate])

  if (authLoading) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-[#730D26]" />
    </div>
  )

  const isAgent = !!(user?.professional_agent_id || user?.role === 'agent')

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 pt-24 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">{t('messages.myMessages')}</h1>
          <p className="text-sm text-navy/50 mt-1">
            {isAgent ? t('messages.clientInquiries') : t('messages.userConversations')}
          </p>
        </div>
        {isAgent ? <AgentMessagesView /> : <UserChatsView />}
      </div>
      <Footer />
    </div>
  )
}
