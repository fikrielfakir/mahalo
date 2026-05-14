import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react'
import { authApi, setAuthToken } from '../../api/client'
import { useUserAuth } from '../../context/UserAuthContext'
import logo from '/logo.png'

export default function VerifyEmailPage() {
  const { id, hash }   = useParams()
  const [searchParams] = useSearchParams()
  const expires        = searchParams.get('expires')
  const signature      = searchParams.get('signature')

  const [status,  setStatus]  = useState('loading') // loading | success | error | already
  const [message, setMessage] = useState('')
  const [resent,  setResent]  = useState(false)

  const { token, user } = useUserAuth()

  useEffect(() => {
    if (!id || !hash) { setStatus('error'); setMessage('Invalid verification link.'); return }

    authApi.verifyEmail(id, hash, expires, signature)
      .then((res) => {
        if (res.message === 'Email already verified.') setStatus('already')
        else setStatus('success')
        setMessage(res.message)
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err?.response?.data?.message || 'Verification failed.')
      })
  }, [id, hash, expires, signature])

  const resend = async () => {
    if (!token) return
    setAuthToken(token)
    try {
      await authApi.resendVerification()
      setResent(true)
    } catch {}
  }

  const icons = {
    loading: <Loader2 size={32} className="text-gold animate-spin" />,
    success: <CheckCircle size={32} className="text-green-500" />,
    already: <CheckCircle size={32} className="text-green-500" />,
    error:   <XCircle size={32} className="text-red-400" />,
  }

  const titles = {
    loading: 'Verifying your email…',
    success: 'Email verified!',
    already: 'Already verified',
    error:   'Verification failed',
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="mb-8">
        <img src={logo} alt="Mahalo" className="h-10 w-auto object-contain" />
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
          {icons[status]}
        </div>

        <h2 className="text-xl font-bold text-navy mb-2">{titles[status]}</h2>
        <p className="text-navy/55 text-sm mb-6">{message}</p>

        {(status === 'success' || status === 'already') && (
          <Link to="/"
            className="px-6 py-3 rounded-2xl bg-gold text-white font-bold text-sm hover:bg-gold-dark transition-all inline-block">
            Go to Homepage
          </Link>
        )}

        {status === 'error' && (
          <div className="space-y-3">
            {token && !resent && (
              <button onClick={resend}
                className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-2xl border border-gold text-gold font-semibold text-sm hover:bg-gold/5 transition-all">
                <Mail size={15} /> Resend verification email
              </button>
            )}
            {resent && <p className="text-green-600 text-sm font-medium">Verification email sent!</p>}
            <Link to="/login" className="block text-sm text-navy/40 hover:text-navy transition-colors">
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
