import { useState } from 'react'
import { X, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react'
import { useUserAuth } from '../context/UserAuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import logo from '/logo.png'

export default function AuthModal() {
  const { isOpen, closeAuthModal, handleSuccess } = useAuthModal()
  const { login, register } = useUserAuth()

  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const [loginForm, setLoginForm] = useState({ email: '', password: '' })
  const [showPwd, setShowPwd] = useState(false)

  const [regForm, setRegForm] = useState({ name: '', email: '', phone: '', password: '', password_confirmation: '' })
  const [showRegPwd, setShowRegPwd] = useState(false)

  if (!isOpen) return null

  const switchTab = (t) => { setTab(t); setError('') }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(loginForm.email, loginForm.password)
      handleSuccess()
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.errors?.email?.[0] ||
        'Invalid email or password.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (regForm.password !== regForm.password_confirmation) {
      setError('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await register(regForm.name, regForm.email, regForm.password, regForm.password_confirmation, regForm.phone)
      handleSuccess()
    } catch (err) {
      const errors = err?.response?.data?.errors
      const first = errors ? Object.values(errors)[0]?.[0] : null
      setError(first || err?.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) closeAuthModal() }}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-navy/40 hover:text-navy hover:bg-gray-100 transition-all z-10"
        >
          <X size={16} />
        </button>

        <div className="px-8 pt-8 pb-2 text-center">
          <img src={logo} alt="Mahalo" className="h-9 w-auto object-contain mx-auto mb-5" />
          <p className="text-navy/50 text-sm">Sign in to save your favorite properties</p>
        </div>

        <div className="flex mx-8 mt-5 border border-gray-100 rounded-2xl p-1 bg-gray-50">
          {['login', 'register'].map((t) => (
            <button
              key={t}
              onClick={() => switchTab(t)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === t
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-navy/40 hover:text-navy/70'
              }`}
            >
              {t === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          ))}
        </div>

        <div className="px-8 py-6">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
              {error}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-3">
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(f => ({ ...f, email: e.target.value }))}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                />
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" />
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(f => ({ ...f, password: e.target.value }))}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                />
                <button type="button" onClick={() => setShowPwd(!showPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60">
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-sm transition-all disabled:opacity-60 mt-1"
              >
                {loading ? 'Signing in…' : 'Sign In'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Full name"
                  value={regForm.name}
                  onChange={(e) => setRegForm(f => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                />
              </div>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={regForm.email}
                  onChange={(e) => setRegForm(f => ({ ...f, email: e.target.value }))}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                />
              </div>
              <div className="relative">
                <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" />
                <input
                  type="tel"
                  placeholder="Phone number"
                  value={regForm.phone}
                  onChange={(e) => setRegForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                />
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" />
                <input
                  type={showRegPwd ? 'text' : 'password'}
                  placeholder="Password"
                  value={regForm.password}
                  onChange={(e) => setRegForm(f => ({ ...f, password: e.target.value }))}
                  required
                  className="w-full pl-10 pr-10 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                />
                <button type="button" onClick={() => setShowRegPwd(!showRegPwd)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-navy/30 hover:text-navy/60">
                  {showRegPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" />
                <input
                  type={showRegPwd ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={regForm.password_confirmation}
                  onChange={(e) => setRegForm(f => ({ ...f, password_confirmation: e.target.value }))}
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-sm transition-all disabled:opacity-60 mt-1"
              >
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
