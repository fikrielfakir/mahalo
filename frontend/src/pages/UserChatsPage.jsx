import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MessageCircle, Send, Loader2, ChevronLeft, Mail, Phone,
  AlertCircle, Building, Home, Search,
} from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { agentDashboardApi } from '../api/client'
import { useUserAuth } from '../context/UserAuthContext'

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

const MSG_STATUS_STYLES = {
  unread: 'bg-blue-50 text-blue-600',
  read: 'bg-gray-100 text-gray-400',
  processing: 'bg-amber-50 text-amber-600',
  done: 'bg-emerald-50 text-emerald-600',
}

function ChatThread({ consult, onReplied }) {
  const [thread, setThread] = useState(null)
  const [loadingThread, setLoadingThread] = useState(true)
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const [sendError, setSendError] = useState(null)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    setLoadingThread(true)
    setThread(null)
    agentDashboardApi.getThread(consult.id)
      .then(r => setThread(r.data))
      .catch(() => {})
      .finally(() => setLoadingThread(false))
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
        setThread(prev => ({
          ...prev,
          replies: [...(prev.replies || []), r.data],
          status: 'done',
        }))
        setReplyText('')
        onReplied()
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
      .catch(err => setSendError(err?.response?.data?.message || 'Failed to send.'))
      .finally(() => setSending(false))
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  if (loadingThread) return (
    <div className="flex-1 flex items-center justify-center">
      <Loader2 size={24} className="animate-spin text-[#730D26]" />
    </div>
  )

  const messages = []
  if (thread?.content) {
    messages.push({ id: 'original', body: thread.content, sender: 'user', created_at: thread.created_at })
  }
  ;(thread?.replies || []).forEach(r => messages.push(r))

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Chat header */}
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
            {thread.status}
          </span>
        )}
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-[#F7F7F8]">
        {(consult.property?.name || consult.project?.name) && (
          <div className="flex justify-center">
            <span className="text-[11px] text-navy/40 bg-white border border-gray-100 rounded-full px-3 py-1 flex items-center gap-1">
              {consult.property ? <Home size={10} /> : <Building size={10} />}
              Re: {consult.property?.name || consult.project?.name}
            </span>
          </div>
        )}

        {messages.length === 0 && (
          <div className="flex justify-center">
            <span className="text-xs text-navy/30 italic">No message content yet.</span>
          </div>
        )}

        {messages.map((msg) => {
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
                  isAgent
                    ? 'bg-[#730D26] text-white rounded-br-sm'
                    : 'bg-white text-navy border border-gray-100 rounded-bl-sm shadow-sm'
                }`}>
                  {msg.body}
                </div>
                <span className="text-[10px] text-navy/30 px-1">{fmtDate(msg.created_at)}</span>
              </div>
              {isAgent && (
                <div className="w-7 h-7 rounded-lg bg-[#730D26] flex items-center justify-center text-white font-bold text-xs shrink-0 ml-2 mt-0.5">
                  A
                </div>
              )}
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        {sendError && (
          <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 rounded-xl px-3 py-2 mb-2">
            <AlertCircle size={12} />{sendError}
          </div>
        )}
        {!consult.email && (
          <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 rounded-xl px-3 py-2 mb-2">
            <AlertCircle size={12} />No email — reply will be saved but not emailed.
          </div>
        )}
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a reply… (Enter to send, Shift+Enter for new line)"
            rows={2}
            disabled={sending}
            className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-[#730D26] resize-none disabled:opacity-60 bg-white"
          />
          <button
            onClick={handleSend}
            disabled={!replyText.trim() || sending}
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

  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [selected, setSelected] = useState(null)
  const [mobileView, setMobileView] = useState('list')

  useEffect(() => {
    if (!authLoading && !isAuthenticated) navigate('/login')
  }, [authLoading, isAuthenticated, navigate])

  const load = useCallback(() => {
    setLoading(true)
    setError(null)
    agentDashboardApi.messages({ search, status, per_page: 50 })
      .then(r => {
        const data = r.data ?? []
        setRows(data)
        if (!selected && data.length > 0) setSelected(data[0])
      })
      .catch(err => setError(err?.response?.data?.message || 'Failed to load messages.'))
      .finally(() => setLoading(false))
  }, [search, status])

  useEffect(() => {
    if (!isAuthenticated) return
    load()
  }, [isAuthenticated, load])

  const handleSelect = (m) => {
    setSelected(m)
    setMobileView('chat')
    setRows(prev => prev.map(r => r.id === m.id ? { ...r, status: r.status === 'unread' ? 'read' : r.status } : r))
  }

  const handleReplied = () => {
    setRows(prev => prev.map(r => r.id === selected?.id ? { ...r, status: 'done' } : r))
  }

  if (authLoading) return (
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
          <p className="text-sm text-navy/50 mt-1">Your conversations and inquiries</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ height: '600px' }}>
          <div className="flex h-full">

            {/* Left: conversation list */}
            <div className={`flex flex-col border-r border-gray-100 ${mobileView === 'chat' ? 'hidden md:flex' : 'flex'} w-full md:w-72 lg:w-80 shrink-0`}>
              <div className="px-4 py-3 border-b border-gray-100 space-y-2">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/30" />
                  <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search…"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#730D26] bg-white"
                  />
                </div>
                <select
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-[#730D26] bg-white"
                >
                  <option value="">All statuses</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                  <option value="processing">Processing</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="flex-1 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={20} className="animate-spin text-[#730D26]" />
                  </div>
                ) : error ? (
                  <div className="p-4 text-center">
                    <p className="text-xs text-red-500">{error}</p>
                    <button onClick={load} className="mt-2 text-xs text-[#730D26] underline">Retry</button>
                  </div>
                ) : rows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                    <MessageCircle size={28} className="text-navy/20 mb-2" />
                    <p className="text-xs text-navy/40">No messages yet</p>
                  </div>
                ) : (
                  rows.map(m => {
                    const isActive = selected?.id === m.id
                    const isUnread = m.status === 'unread'
                    return (
                      <button
                        key={m.id}
                        onClick={() => handleSelect(m)}
                        className={`w-full text-left px-4 py-3 border-b border-gray-50 transition-colors flex items-start gap-3 ${
                          isActive ? 'bg-[#730D26]/5 border-l-2 border-l-[#730D26]' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${isActive ? 'bg-[#730D26] text-white' : 'bg-[#730D26]/10 text-[#730D26]'}`}>
                          {m.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-sm truncate ${isUnread ? 'font-bold text-navy' : 'font-medium text-navy/70'}`}>{m.name}</p>
                            <span className="text-[10px] text-navy/30 shrink-0">{fmtDate(m.created_at)}</span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-xs text-navy/40 truncate">{m.email || m.phone || '—'}</p>
                            {isUnread && <span className="w-2 h-2 rounded-full bg-[#730D26] shrink-0 ml-1" />}
                          </div>
                        </div>
                      </button>
                    )
                  })
                )}
              </div>
            </div>

            {/* Right: chat thread */}
            <div className={`flex-1 flex flex-col min-w-0 ${mobileView === 'list' ? 'hidden md:flex' : 'flex'}`}>
              {selected ? (
                <>
                  <button onClick={() => setMobileView('list')} className="md:hidden flex items-center gap-2 px-4 py-2 text-xs text-[#730D26] font-semibold border-b border-gray-100">
                    <ChevronLeft size={14} />Back to messages
                  </button>
                  <ChatThread key={selected.id} consult={selected} onReplied={handleReplied} />
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                  <MessageCircle size={40} className="text-navy/15 mb-3" />
                  <p className="text-sm font-semibold text-navy/30">Select a conversation</p>
                  <p className="text-xs text-navy/20 mt-1">Click a message on the left to open the chat</p>
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
