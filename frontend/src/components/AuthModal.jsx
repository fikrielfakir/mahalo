import { useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Mail, Lock, Eye, EyeOff, User, Phone } from 'lucide-react'
import { useUserAuth } from '../context/UserAuthContext'
import { useAuthModal } from '../context/AuthModalContext'
import { authApi } from '../api/client'
import logo from '/logo.png'
import { useTranslation } from 'react-i18next'

export default function AuthModal() {
  const { t } = useTranslation()
  const { isOpen, closeAuthModal, handleSuccess } = useAuthModal()
  const { login, register } = useUserAuth()

  const [tab, setTab] = useState('login')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    try {
      const res = await authApi.googleRedirectUrl()
      window.location.href = res.data.url
    } catch {
      setError(t('auth.googleError'))
      setGoogleLoading(false)
    }
  }

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
        t('auth.invalidCredentials')
      )
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (regForm.password !== regForm.password_confirmation) {
      setError(t('auth.passwordMismatch'))
      return
    }
    setLoading(true)
    try {
      await register(regForm.name, regForm.email, regForm.password, regForm.password_confirmation, regForm.phone)
      handleSuccess()
    } catch (err) {
      const errors = err?.response?.data?.errors
      const first = errors ? Object.values(errors)[0]?.[0] : null
      setError(first || err?.response?.data?.message || t('auth.registerFailed'))
    } finally {
      setLoading(false)
    }
  }

  return createPortal(
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
          <p className="text-navy/50 text-sm">{t('auth.signInPrompt')}</p>
        </div>

        <div className="flex mx-8 mt-5 border border-gray-100 rounded-2xl p-1 bg-gray-50">
          {['login', 'register'].map((tabKey) => (
            <button
              key={tabKey}
              onClick={() => switchTab(tabKey)}
              className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === tabKey
                  ? 'bg-white text-navy shadow-sm'
                  : 'text-navy/40 hover:text-navy/70'
              }`}
            >
              {tabKey === 'login' ? t('auth.signIn') : t('auth.createAccount')}
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
                  placeholder={t('auth.emailPlaceholder')}
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
                  placeholder={t('auth.passwordPlaceholder')}
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
                {loading ? t('auth.signingIn') : t('auth.signIn')}
              </button>

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-navy/40 font-medium">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-navy text-sm font-semibold transition-all disabled:opacity-60"
              >
                <svg width="16" height="16" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                {googleLoading ? t('auth.redirecting') : t('auth.continueGoogle')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" />
                <input
                  type="text"
                  placeholder={t('auth.fullName')}
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
                  placeholder={t('auth.emailPlaceholder')}
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
                  placeholder={t('auth.phonePlaceholder')}
                  value={regForm.phone}
                  onChange={(e) => setRegForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                />
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30 pointer-events-none" />
                <input
                  type={showRegPwd ? 'text' : 'password'}
                  placeholder={t('auth.passwordPlaceholder')}
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
                  placeholder={t('auth.confirmPassword')}
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
                {loading ? t('auth.creating') : t('auth.createAccount')}
              </button>

              <div className="relative my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-xs text-navy/40 font-medium">or</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-navy text-sm font-semibold transition-all disabled:opacity-60"
              >
                <svg width="16" height="16" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                {googleLoading ? t('auth.redirecting') : t('auth.signUpGoogle')}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
