import { useState } from 'react'
import { MailCheck, X, RefreshCw, ShieldCheck } from 'lucide-react'
import { useVerifyEmail } from '../context/VerifyEmailContext'
import { useUserAuth } from '../context/UserAuthContext'
import { authApi } from '../api/client'

export default function VerifyEmailPopup() {
  const { isOpen, closePopup } = useVerifyEmail()
  const { user } = useUserAuth()
  const [sending, setSending] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  if (!isOpen) return null

  const resend = async () => {
    setSending(true); setError('')
    try {
      await authApi.resendVerification()
      setSent(true)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closePopup} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-7 flex flex-col items-center text-center">
        <button onClick={closePopup} className="absolute top-4 right-4 text-navy/30 hover:text-navy/60 transition-colors">
          <X size={18} />
        </button>

        <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center mb-4">
          <MailCheck size={28} className="text-amber-600" />
        </div>

        <h2 className="text-lg font-bold text-navy mb-1">Verify your email</h2>
        <p className="text-sm text-navy/55 leading-relaxed mb-5">
          We sent a confirmation link to <strong className="text-navy font-semibold">{user?.email}</strong>. Please verify your email to use this feature.
        </p>

        {sent ? (
          <div className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium mb-4">
            <ShieldCheck size={16} /> Email sent! Check your inbox and spam folder.
          </div>
        ) : (
          <button
            onClick={resend}
            disabled={sending}
            className="w-full py-3 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-sm transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2 mb-3"
          >
            {sending
              ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Sending…</>
              : <><RefreshCw size={14} /> Resend Verification Email</>}
          </button>
        )}

        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}

        <button onClick={closePopup} className="text-xs text-navy/35 hover:text-navy/60 transition-colors mt-1">
          Dismiss
        </button>
      </div>
    </div>
  )
}
