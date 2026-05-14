import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Lock, Eye, EyeOff, Phone, ArrowLeft } from 'lucide-react'
import { useUserAuth } from '../../context/UserAuthContext'
import { authApi } from '../../api/client'
import logo from '/logo.png'

export default function RegisterPage() {
  const [form,     setForm]     = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '' })
  const [showPwd,  setShowPwd]  = useState(false)
  const [error,    setError]    = useState('')
  const [fieldErr, setFieldErr] = useState({})
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)

  const { register } = useUserAuth()
  const navigate     = useNavigate()
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleGoogleSignUp = async () => {
    setGoogleLoading(true)
    try {
      const res = await authApi.googleRedirectUrl()
      window.location.href = res.data.url
    } catch {
      setError('Failed to connect to Google. Please try again.')
      setGoogleLoading(false)
    }
  }

  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErr({})
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.password_confirmation, form.phone)
      setDone(true)
    } catch (err) {
      const data = err?.response?.data
      if (data?.errors) setFieldErr(data.errors)
      else setError(data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-4 py-12">
        <Link to="/" className="mb-8">
          <img src={logo} alt="Mahalo" className="h-10 w-auto object-contain" />
        </Link>
        <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
            <Mail size={28} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-navy mb-2">Check your inbox!</h2>
          <p className="text-navy/55 text-sm mb-6">
            We've sent a verification link to <span className="font-semibold text-navy">{form.email}</span>.
            Click the link to activate your account.
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-2xl bg-gold text-white font-bold text-sm hover:bg-gold-dark transition-all"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  const fe = (key) => fieldErr[key]?.[0]

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="mb-8">
        <img src={logo} alt="Mahalo" className="h-10 w-auto object-contain" />
      </Link>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-card p-8">
        <h1 className="text-2xl font-bold text-navy mb-1">Create account</h1>
        <p className="text-navy/50 text-sm mb-7">Join Mahalo and find your dream property</p>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-4">
          <Field label="Full Name" error={fe('name')}>
            <User size={16} />
            <input type="text" value={form.name} onChange={f('name')} required placeholder="Your full name"
              className="w-full pl-10 pr-4 py-3 text-sm font-medium text-navy bg-transparent outline-none placeholder-navy/30" />
          </Field>

          <Field label="Email" error={fe('email')}>
            <Mail size={16} />
            <input type="email" value={form.email} onChange={f('email')} required placeholder="you@example.com"
              className="w-full pl-10 pr-4 py-3 text-sm font-medium text-navy bg-transparent outline-none placeholder-navy/30" />
          </Field>

          <Field label="Phone (optional)" error={fe('phone')}>
            <Phone size={16} />
            <input type="tel" value={form.phone} onChange={f('phone')} placeholder="+212 600 000 000"
              className="w-full pl-10 pr-4 py-3 text-sm font-medium text-navy bg-transparent outline-none placeholder-navy/30" />
          </Field>

          <Field label="Password" error={fe('password')}>
            <Lock size={16} />
            <input type={showPwd ? 'text' : 'password'} value={form.password} onChange={f('password')} required placeholder="Min. 8 characters"
              className="w-full pl-10 pr-10 py-3 text-sm font-medium text-navy bg-transparent outline-none placeholder-navy/30" />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60">
              {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </Field>

          <Field label="Confirm Password" error={fe('password_confirmation')}>
            <Lock size={16} />
            <input type="password" value={form.password_confirmation} onChange={f('password_confirmation')} required placeholder="Repeat your password"
              className="w-full pl-10 pr-4 py-3 text-sm font-medium text-navy bg-transparent outline-none placeholder-navy/30" />
          </Field>

          <button
            type="submit" disabled={loading}
            className="w-full py-3.5 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-sm transition-all duration-200 disabled:opacity-60 mt-1"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-navy/40 font-medium">or sign up with</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleSignUp}
          disabled={googleLoading}
          className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-navy text-sm font-semibold transition-all disabled:opacity-60"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          {googleLoading ? 'Redirecting…' : 'Sign up with Google'}
        </button>

        <p className="text-center text-sm text-navy/50 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold font-semibold hover:text-gold-dark transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <Link to="/" className="mt-6 flex items-center gap-1.5 text-sm text-navy/40 hover:text-navy transition-colors">
        <ArrowLeft size={14} /> Back to Mahalo
      </Link>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">{label}</label>
      <div className={`relative flex items-center rounded-2xl border transition-all ${
        error ? 'border-red-300 bg-red-50/30' : 'border-gray-200'
      }`}>
        <span className="absolute left-3.5 text-navy/30">{children[0]}</span>
        {children[1]}
        {children[2]}
      </div>
      {error && <p className="text-xs text-red-500 mt-1 ml-1">{error}</p>}
    </div>
  )
}
