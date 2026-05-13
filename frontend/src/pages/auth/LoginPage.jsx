import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import { useUserAuth } from '../../context/UserAuthContext'
import logo from '/logo.png'

export default function LoginPage() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const { login }  = useUserAuth()
  const navigate   = useNavigate()
  const location   = useLocation()
  const from       = location.state?.from || '/'

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err) {
      const msg = err?.response?.data?.message
        || err?.response?.data?.errors?.email?.[0]
        || 'Invalid email or password.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="mb-8">
        <img src={logo} alt="Mahalo" className="h-10 w-auto object-contain" />
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-navy mb-1">Welcome back</h1>
        <p className="text-navy/50 text-sm mb-7">Sign in to your Mahalo account</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">
              Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-semibold text-navy/50 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-xs text-gold font-medium hover:text-gold-dark transition-colors">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
              <input
                type={showPwd ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60"
              >
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-sm transition-all duration-200 disabled:opacity-60 mt-2"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-sm text-navy/50 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold font-semibold hover:text-gold-dark transition-colors">
            Create one
          </Link>
        </p>
      </div>

      <Link to="/" className="mt-6 flex items-center gap-1.5 text-sm text-navy/40 hover:text-navy transition-colors">
        <ArrowLeft size={14} /> Back to Mahalo
      </Link>
    </div>
  )
}
