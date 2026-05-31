import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { authApi } from '../../api/client'
import logo from '/logo.png'

export default function ForgotPasswordPage() {
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [sent,    setSent]    = useState(false)
  const [error,   setError]   = useState('')

  const { t } = useTranslation()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await authApi.forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err?.response?.data?.message || t('errors.generic', 'Something went wrong. Please try again.'))
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
        {sent ? (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={26} className="text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-navy mb-2">{t('auth.checkEmailTitle')}</h2>
            <p className="text-navy/55 text-sm mb-6">
              {t('auth.checkEmailDesc')}
            </p>
            <Link to="/login" className="px-6 py-3 rounded-2xl bg-gold text-white font-bold text-sm hover:bg-gold-dark transition-all inline-block">
              {t('auth.backToSignIn')}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-navy mb-1">{t('auth.forgotPasswordTitle')}</h1>
            <p className="text-navy/50 text-sm mb-7">
              {t('auth.forgotPasswordDesc')}
            </p>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">
                  {t('auth.emailAddressLabel')}
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={t('auth.emailPlaceholder')}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-sm transition-all duration-200 disabled:opacity-60"
              >
                {loading ? t('auth.sending') : t('auth.sendResetLink')}
              </button>
            </form>
          </>
        )}
      </div>

      <Link to="/login" className="mt-6 flex items-center gap-1.5 text-sm text-navy/40 hover:text-navy transition-colors">
        <ArrowLeft size={14} /> {t('auth.backToSignIn')}
      </Link>
    </div>
  )
}
