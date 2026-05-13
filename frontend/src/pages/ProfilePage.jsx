import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Building2, FileText, Check, AlertCircle, ChevronRight } from 'lucide-react'
import { useUserAuth } from '../context/UserAuthContext'
import { authApi } from '../api/client'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const TYPES = [
  {
    id: 'individual',
    label: 'Private Individual',
    description: 'Looking to buy, sell, or rent a property for personal use.',
    icon: User,
  },
  {
    id: 'professional',
    label: 'Professional',
    description: 'Real estate agent, broker, developer, or property investor.',
    icon: Building2,
  },
]

export default function ProfilePage() {
  const { user, isAuthenticated, loading } = useUserAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    phone: '',
    account_type: 'individual',
    company_name: '',
    license_number: '',
  })
  const [saving, setSaving]   = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login', { replace: true })
    }
  }, [loading, isAuthenticated, navigate])

  useEffect(() => {
    if (user) {
      setForm({
        name:           user.name           || '',
        phone:          user.phone          || '',
        account_type:   user.account_type   || 'individual',
        company_name:   user.company_name   || '',
        license_number: user.license_number || '',
      })
    }
  }, [user])

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }))
    setSuccess(false)
    setError('')
  }

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)
    try {
      await authApi.updateProfile(form)
      setSuccess(true)
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to save changes.'
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Navbar />

      <div className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Header card */}
          <div className="bg-white rounded-3xl shadow-card p-6 flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gold flex items-center justify-center text-white text-2xl font-bold shrink-0 shadow-md">
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-navy truncate">{user?.name}</h1>
              <p className="text-sm text-navy/50 truncate">{user?.email}</p>
              <span className={`inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                form.account_type === 'professional'
                  ? 'bg-blue-50 text-blue-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}>
                {form.account_type === 'professional' ? 'Professional' : 'Private Individual'}
              </span>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-6">

            {/* Account type */}
            <div className="bg-white rounded-3xl shadow-card p-6">
              <h2 className="text-sm font-bold text-navy/50 uppercase tracking-wider mb-4">Account Type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {TYPES.map(({ id, label, description, icon: Icon }) => {
                  const active = form.account_type === id
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set('account_type', id)}
                      className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                        active
                          ? 'border-gold bg-gold/5'
                          : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          active ? 'bg-gold text-white' : 'bg-gray-100 text-navy/40'
                        }`}>
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-semibold ${active ? 'text-navy' : 'text-navy/60'}`}>
                              {label}
                            </p>
                            {active && (
                              <div className="w-4 h-4 rounded-full bg-gold flex items-center justify-center shrink-0">
                                <Check size={10} className="text-white" strokeWidth={3} />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-navy/40 mt-0.5 leading-relaxed">{description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Personal info */}
            <div className="bg-white rounded-3xl shadow-card p-6">
              <h2 className="text-sm font-bold text-navy/50 uppercase tracking-wider mb-4">Personal Information</h2>
              <div className="space-y-4">

                <div>
                  <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => set('name', e.target.value)}
                      required
                      placeholder="Your full name"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                    <input
                      type="email"
                      value={user?.email || ''}
                      disabled
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-100 text-sm text-navy/40 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <p className="text-xs text-navy/30 mt-1 ml-1">Email address cannot be changed.</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Professional fields */}
            {form.account_type === 'professional' && (
              <div className="bg-white rounded-3xl shadow-card p-6">
                <h2 className="text-sm font-bold text-navy/50 uppercase tracking-wider mb-4">Professional Details</h2>
                <div className="space-y-4">

                  <div>
                    <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">
                      Company / Agency Name
                    </label>
                    <div className="relative">
                      <Building2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                      <input
                        type="text"
                        value={form.company_name}
                        onChange={(e) => set('company_name', e.target.value)}
                        placeholder="e.g. Mahalo Realty Group"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-navy/50 uppercase tracking-wider mb-1.5">
                      License / Registration Number
                    </label>
                    <div className="relative">
                      <FileText size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-navy/30" />
                      <input
                        type="text"
                        value={form.license_number}
                        onChange={(e) => set('license_number', e.target.value)}
                        placeholder="e.g. RE-2024-00123"
                        className="w-full pl-10 pr-4 py-3 rounded-2xl border border-gray-200 text-sm text-navy focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/15 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback */}
            {success && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium">
                <Check size={16} /> Profile saved successfully.
              </div>
            )}
            {error && (
              <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-red-50 border border-red-100 text-red-600 text-sm">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3.5 rounded-2xl bg-gold hover:bg-gold-dark text-white font-bold text-sm transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Saving…
                </>
              ) : (
                <>Save Changes <ChevronRight size={16} /></>
              )}
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  )
}
