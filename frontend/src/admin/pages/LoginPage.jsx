import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Building2, Eye, EyeOff, Lock, Mail } from 'lucide-react'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: 'admin@homzen.ma', password: 'admin123' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0B1F3A] via-[#0d2548] to-[#0B1F3A] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#C8A97E] mb-4 shadow-xl">
            <Building2 size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Homzen Admin</h1>
          <p className="text-white/40 text-sm mt-1">Sign in to manage your platform</p>
        </div>

        <form onSubmit={submit} className="bg-white rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-[#C8A97E] focus:ring-2 focus:ring-[#C8A97E]/20 transition-all"
                  placeholder="admin@homzen.ma"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={show ? 'text' : 'password'}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl pl-10 pr-10 py-3 text-sm outline-none focus:border-[#C8A97E] focus:ring-2 focus:ring-[#C8A97E]/20 transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full bg-[#0B1F3A] text-white rounded-xl py-3 text-sm font-semibold hover:bg-[#0B1F3A]/90 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Sign In'}
          </button>

          <p className="text-center text-xs text-gray-400 mt-4">
            Default: admin@homzen.ma / admin123
          </p>
        </form>
      </div>
    </div>
  )
}
