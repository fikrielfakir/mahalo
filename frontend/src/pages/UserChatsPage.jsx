import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import {
  MessageCircle, Send, Loader2, ChevronLeft, Mail, Phone,
  AlertCircle, Building, Home, Search, UserCircle,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { userChatsApi } from '../api/client'
import { useUserAuth } from '../context/UserAuthContext'

function fmtDate(str) {
  if (!str) return ''
  const d = new Date(str)
  const now = new Date()
  const diff = now - d
  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function agentName(agent) {
  if (!agent) return 'Agent'
  return agent.display_name || `${agent.first_name || ''} ${agent.last_name || ''}`.trim() || 'Agent'
}

function agentInitials(agent) {
  const name = agentName(agent)
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function AgentAvatar({ agent, size = 10 }) {
  const src = agent?.avatar?.url || agent?.avatar_url
  const cls = `w-${size} h-${size} rounded-xl flex items-center justify-center text-sm font-bold shrink-0 bg-[#730D26]/10 text-[#730D26] overflow-hidden`
  if (src) return <div className={cls}><img src={src} alt="" className="w-full h-full object-cover" /></div>
  return <div className={cls}>{agentInitials(agent)}</div>
}

function ChatPane({ chat, onMessageSent }) {
  const [thread, setThread] = useState(null)
  const [loading, setLoading] = useState(true)
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(null)
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

  if (loading) return (
    <div className="flex-1 flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-[#730D26]" />
    </div>
  )

  const agent = thread?.agent || chat?.agent
  const messages = []
  if (thread?.content) messages.push({ id: 'orig', body: thread.content, sender: 'user', created_at: thread.created_at })
  ;(thread?.replies || []).forEach(r => messages.push(r))

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100 bg-white flex items-center gap-3">
        <AgentAvatar agent={agent} size={10} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-navy text-sm truncate">{agentName(agent)}</p>
          <p className="text-xs text-navy/40">Real Estate Agent</p>
        </div>
        {agent?.id && (
          <Link to={`/agents/${agent.id}`} className="text-xs text-[#730D26] font-semibold hover:underline shrink-0">
            View Profile
          </Link>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#F7F7F8]">
        {messages.length === 0 && (
          <div className="flex justify-center">
            <span className="text-xs text-navy/30 italic bg-white px-4 py-2 rounded-full border border-gray-100">
              Chat started — say hello!
            </span>
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
                  isUser
                    ? 'bg-[#730D26] text-white rounded-br-sm'
                    : 'bg-white text-navy border border-gray-100 rounded-bl-sm shadow-sm'
                }`}>
                  {msg.body}
                </div>
                <span className="text-[10px] text-navy/30 px-1">{fmtDate(msg.created_at)}</span>
              </div>
              {isUser && <div className="w-2" />}
              {isUser && (
                <div className="w-7 h-7 rounded-xl bg-[#730D26] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                  Me
                </div>
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        {error && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-2">
            <AlertCircle size={12} />{error}
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a message… (Enter to send)"
            rows={2}
            disabled={sending}
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-[#730D26] resize-none disabled:opacity-60"
          />
          <button
            onClick={handleSend}
            disabled={!text.trim() || sending}
            className="w-10 h-10 rounded-xl bg-[#730D26] text-white flex items-center justify-center hover:bg-[#5a0a1e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UserChatsPage() {
  const { isAuthenticated, loading: authLoading } = useUserAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const agentIdParam = searchParams.get('agent_id')
  const chatIdParam  = searchParams.get('id')

  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [mobileView, setMobileView] = useState('list')
  const [search, setSearch] = useState('')
  const [starting, setStarting] = useState(false)

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login')
  }, [authLoading, isAuthenticated, navigate])

  const loadChats = useCallback(() => {
    setLoading(true)
    userChatsApi.list()
      .then(r => setChats(r.data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { if (isAuthenticated) loadChats() }, [isAuthenticated, loadChats])

  useEffect(() => {
    if (loading) return
    if (chatIdParam) {
      const found = chats.find(c => String(c.id) === chatIdParam)
      if (found) { setSelected(found); setMobileView('chat') }
    } else if (agentIdParam) {
      const found = chats.find(c => String(c.agent_id) === agentIdParam)
      if (found) { setSelected(found); setMobileView('chat') }
      else {
        setStarting(true)
        userChatsApi.startChat({ agent_id: parseInt(agentIdParam) })
          .then(r => {
            setChats(prev => {
              const exists = prev.find(c => c.id === r.data.id)
              return exists ? prev : [r.data, ...prev]
            })
            setSelected(r.data)
            setMobileView('chat')
          })
          .catch(() => {})
          .finally(() => setStarting(false))
      }
    } else if (!selected && chats.length > 0) {
      setSelected(chats[0])
    }
  }, [loading, chats.length, agentIdParam, chatIdParam])

  const handleMessageSent = (chatId) => {
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
    const name = agentName(c.agent).toLowerCase()
    return name.includes(search.toLowerCase())
  })

  if (authLoading || starting) return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-[#730D26]" />
    </div>
  )

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-6xl mx-auto w-full px-4 pt-24 pb-10">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-navy">My Messages</h1>
          <p className="text-sm text-navy/50 mt-1">Your conversations with real estate agents</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">

            {/* Left list */}
            <div className={`flex flex-col border-r border-gray-100 w-full md:w-72 lg:w-80 shrink-0 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'}`}>
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
                  <input
                    value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search agent…"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#730D26] bg-white"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 size={20} className="animate-spin text-[#730D26]" /></div>
                ) : filtered.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <MessageCircle size={28} className="text-navy/20 mb-2" />
                    <p className="text-xs text-navy/40 font-medium">No conversations yet</p>
                    <p className="text-xs text-navy/30 mt-1">Visit an agent's profile to start chatting</p>
                    <Link to="/agents" className="mt-3 text-xs text-[#730D26] font-semibold hover:underline">
                      Browse agents →
                    </Link>
                  </div>
                ) : (
                  filtered.map(chat => {
                    const isActive = selected?.id === chat.id
                    const lastReply = chat.replies?.[chat.replies.length - 1]
                    const preview = lastReply?.body || chat.content || 'No messages yet'
                    return (
                      <button key={chat.id} onClick={() => { setSelected(chat); setMobileView('chat') }}
                        className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors flex items-start gap-3 ${
                          isActive ? 'bg-[#730D26]/5 border-l-2 border-l-[#730D26]' : 'hover:bg-gray-50'
                        }`}
                      >
                        <AgentAvatar agent={chat.agent} size={9} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className="text-sm font-semibold text-navy truncate">{agentName(chat.agent)}</p>
                            <span className="text-[10px] text-navy/30 shrink-0">{fmtDate(chat.updated_at || chat.created_at)}</span>
                          </div>
                          <p className="text-xs text-navy/40 truncate mt-0.5">{preview}</p>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>

              <div className="px-4 py-3 border-t border-gray-100">
                <Link to="/agents"
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-[#730D26]/8 text-[#730D26] text-xs font-semibold hover:bg-[#730D26]/15 transition-colors">
                  <UserCircle size={13} /> Chat with a new agent
                </Link>
              </div>
            </div>

            {/* Right chat */}
            <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
              {selected ? (
                <>
                  <button onClick={() => setMobileView('list')} className="md:hidden flex items-center gap-2 px-4 py-2 text-xs text-[#730D26] font-semibold border-b border-gray-100">
                    <ChevronLeft size={14} />Back
                  </button>
                  <ChatPane key={selected.id} chat={selected} onMessageSent={handleMessageSent} />
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                  <MessageCircle size={44} className="text-navy/15 mb-4" />
                  <p className="text-sm font-bold text-navy/30">No conversation selected</p>
                  <p className="text-xs text-navy/20 mt-1">Pick one from the list, or start a new chat from any agent's profile</p>
                  <Link to="/agents" className="mt-4 px-5 py-2 rounded-xl text-sm font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg,#730D26,#BA1932)' }}>
                    Browse Agents
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
