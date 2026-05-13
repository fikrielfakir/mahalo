import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react'
import { authApi } from '../../api/client'
import logo from '/logo.png'

export default function ResetPasswordPage() {
  const [searchParams]                    = useSearchParams()
  const token                             = searchParams.get('token') || ''
  const email                             = searchParams.get('email') || ''

  const [password,     setPassword]     = useState('')
  const [confirmation, setConfirmation] = useState('')
  const [showPwd,      setShowPwd]      = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [done,         setDone]         = useState(false)

  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    if (password !== confirmation) { setError('Passwords do not match.'); return }
    setError('')
    setLoading(true)
    try {
      await authApi.resetPassword({
        token,
        email,
        password,
        password_confirmation: confirmation,
      })
      setDone(true)
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to reset password. The link may have expired.')
    } finally {
      setLoading(false)
    }
  }

  if (!token || !email) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-4 py-12">
        <Link to="/" className="mb-8"><img src={logo} alt="Mahalo" className="h-10 w-auto" /></Link>
        <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-8 text-center">
          <p className="text-navy/60 text-sm mb-4">Invalid or missing reset link.</p>
          <Link to="/forgot-password" className="text-gold font-semibold text-sm hover:text-gold-dark">
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-4 py-12">
        <Link to="/" className="mb-8"><img src={logo} alt="Mahalo" className="h-10 w-auto" /></Link>
        <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={26} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Password updated!</h2>
          <p className="text-navy/55 text-sm mb-6">Your password has been reset. You can now sign in.</p>
          <button onClick={() => navigate('/login')}
            className="px-6 py-3 rounded-2xl bg-gold text-white font-bold text-sm hover:bg-gold-dark transition-all">
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="mb-8">
        <img src={logo} alt="Mahalo" className="h-10 w-auto object-contain" />
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-navy mb-1">Set new password</h1>
        <p className="text-navy/50 text-sm mb-7">
          Resetting password for <span className="font-semibold text-navy">{email}</span>
        </p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">
              New Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
              <input
                type={showPwd ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)} required minLength={8}
                placeholder="Min. 8 characters"
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60">
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
              <input
                type="password" value={confirmation}
                onChange={(e) => setConfirmation(e.target.value)} required
                placeholder="Repeat your password"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
              />
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-sm transition-all duration-200 disabled:opacity-60 mt-1"
          >
            {loading ? 'Saving…' : 'Reset Password'}
          </button>
        </form>
      </div>

      <Link to="/login" className="mt-6 flex items-center gap-1.5 text-sm text-navy/40 hover:text-navy transition-colors">
        <ArrowLeft size={14} /> Back to Sign In
      </Link>
    </div>
  )
}
