import { useState, useRef, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import { Menu, Globe, Check, ChevronDown } from 'lucide-react'
import { AdminLayoutSkeleton } from '../../components/Skeletons'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LOCALES, ADMIN_LANG_KEY } from '../../i18n.js'

const LANG_LABELS = {
  en: { label: 'English',  short: 'EN', flag: '🇬🇧' },
  fr: { label: 'Français', short: 'FR', flag: '🇫🇷' },
  es: { label: 'Español',  short: 'ES', flag: '🇪🇸' },
  ar: { label: 'العربية',  short: 'AR', flag: '🇲🇦' },
}

export default function AdminLayout() {
  const { user, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)
  const { i18n } = useTranslation()

  const activeLng = i18n.resolvedLanguage?.split('-')[0] || 'en'

  useEffect(() => {
    const handler = (e) => {
      if (langRef.current && !langRef.current.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const changeAdminLanguage = async (lng) => {
    localStorage.setItem(ADMIN_LANG_KEY, lng)
    await i18n.changeLanguage(lng)
    setLangOpen(false)
  }

  if (loading) return <AdminLayoutSkeleton />

  if (!user) return <Navigate to="/admin/login" replace />

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-3 sm:px-4 gap-3 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2.5 rounded-xl hover:bg-gray-100 text-gray-600 touch-manip"
          >
            <Menu size={18} />
          </button>
          <div className="flex-1" />

          {/* Admin language switcher */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen(o => !o)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-medium transition-colors"
            >
              <Globe size={14} />
              <span>{LANG_LABELS[activeLng]?.short ?? activeLng.toUpperCase()}</span>
              <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-40 bg-white border border-gray-100 rounded-2xl shadow-xl py-1.5 z-50">
                {SUPPORTED_LOCALES.map(lng => (
                  <button
                    key={lng}
                    onClick={() => changeAdminLanguage(lng)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <span className="text-base">{LANG_LABELS[lng]?.flag}</span>
                    <span className="flex-1 text-left">{LANG_LABELS[lng]?.label}</span>
                    {activeLng === lng && <Check size={13} className="text-[#730D26]" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-8 h-8 rounded-xl bg-[#730D26] flex items-center justify-center">
            <span className="text-white text-xs font-bold">{user?.name?.[0] ?? 'A'}</span>
          </div>
        </header>

        {/* Page content — adaptive padding */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
