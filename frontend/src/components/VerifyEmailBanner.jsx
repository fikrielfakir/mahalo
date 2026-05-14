import { useState } from 'react'
import { MailCheck, RefreshCw } from 'lucide-react'
import { useUserAuth } from '../context/UserAuthContext'
import { authApi } from '../api/client'

export default function VerifyEmailBanner() {
  const { isAuthenticated, isEmailVerified } = useUserAuth()
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)

  if (!isAuthenticated || isEmailVerified) return null

  const resend = async () => {
    setSending(true)
    try {
      await authApi.resendVerification()
      setSent(true)
    } catch {}
    finally { setSending(false) }
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-white border-b border-amber-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
          <MailCheck size={14} className="text-amber-600" />
        </div>
        <p className="flex-1 text-sm text-navy/70">
          {sent
            ? 'Verification email sent! Check your inbox (and spam folder).'
            : 'Please verify your email address to unlock all features.'}
        </p>
        {!sent && (
          <button
            onClick={resend}
            disabled={sending}
            className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-amber-600 hover:text-amber-700 border border-amber-300 rounded-xl px-3 py-1.5 transition-all hover:bg-amber-50 disabled:opacity-50"
          >
            {sending
              ? <><span className="w-3 h-3 border border-amber-500 border-t-transparent rounded-full animate-spin" /> Sending…</>
              : <><RefreshCw size={11} /> Resend Email</>}
          </button>
        )}
      </div>
    </div>
  )
}
