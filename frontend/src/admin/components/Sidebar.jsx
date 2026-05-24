import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, Building2, FolderKanban, Users, Tag,
  Star, MapPin, MessageSquare, LogOut, X, TrendingUp,
  Image, Settings, UserCog, Globe, Briefcase, PackageOpen,
  BarChart2, Languages
} from 'lucide-react'
import logoLight from '/logo-light.png'

const groups = [
  {
    labelKey: 'admin.sidebar.overview',
    links: [
      { to: '/admin/dashboard',  labelKey: 'admin.sidebar.dashboard', icon: LayoutDashboard },
      { to: '/admin/analytics',  labelKey: 'admin.sidebar.analytics', icon: BarChart2 },
    ],
  },
  {
    labelKey: 'admin.sidebar.listings',
    links: [
      { to: '/admin/properties', labelKey: 'admin.sidebar.properties', icon: Building2 },
      { to: '/admin/projects',   labelKey: 'admin.sidebar.projects',   icon: FolderKanban },
      { to: '/admin/agents',     labelKey: 'admin.sidebar.agents',     icon: Users },
    ],
  },
  {
    labelKey: 'admin.sidebar.taxonomy',
    links: [
      { to: '/admin/categories', labelKey: 'admin.sidebar.categories', icon: Tag },
      { to: '/admin/features',   labelKey: 'admin.sidebar.amenities',  icon: Star },
      { to: '/admin/facilities', labelKey: 'admin.sidebar.facilities', icon: MapPin },
      { to: '/admin/investors',  labelKey: 'admin.sidebar.investors',  icon: TrendingUp },
      { to: '/admin/cities',     labelKey: 'admin.sidebar.cities',     icon: Globe },
    ],
  },
  {
    labelKey: 'admin.sidebar.operations',
    links: [
      { to: '/admin/consults', labelKey: 'admin.sidebar.inquiries', icon: MessageSquare },
      { to: '/admin/media',    labelKey: 'admin.sidebar.media',     icon: Image },
    ],
  },
  {
    labelKey: 'admin.sidebar.system',
    links: [
      { to: '/admin/users',                     labelKey: 'admin.sidebar.users',         icon: UserCog },
      { to: '/admin/professional-applications', labelKey: 'admin.sidebar.applications',  icon: Briefcase },
      { to: '/admin/languages',                 labelKey: 'admin.sidebar.languages',     icon: Globe },
      { to: '/admin/translations',              labelKey: 'admin.sidebar.translations',  icon: Languages },
      { to: '/admin/settings',                  labelKey: 'admin.sidebar.settings',      icon: Settings },
      { to: '/admin/app-update',                labelKey: 'admin.sidebar.appUpdate',     icon: PackageOpen },
    ],
  },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 z-30 h-full bg-[#730D26] flex flex-col
        transition-all duration-300 ease-in-out
        w-64
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-auto md:w-16
        lg:w-64
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0 md:px-0 md:justify-center md:py-4 lg:px-5 lg:justify-between">
          <div className="flex items-center gap-3 min-w-0 md:justify-center lg:justify-start">
            <img src={logoLight} alt="Mahalo" className="h-8 w-auto object-contain shrink-0" />
            <span className="text-[#BA1932] text-xs font-semibold bg-[#BA1932]/20 px-1.5 py-0.5 rounded shrink-0 md:hidden lg:block">{t('admin.sidebar.admin')}</span>
          </div>
          <button onClick={onClose} className="md:hidden text-white/40 hover:text-white ml-2">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 md:px-1.5 lg:px-3">
          {groups.map(({ labelKey, links }, groupIdx) => (
            <div key={labelKey}>
              <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 mb-1 md:hidden lg:block">{t(labelKey)}</p>
              {groupIdx > 0 && (
                <div className="hidden md:block lg:hidden border-t border-white/10 mb-2" />
              )}
              {links.map(({ to, labelKey: lk, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  title={t(lk)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150
                    md:justify-center md:px-0 md:py-3 lg:justify-start lg:px-3 lg:py-2.5
                    ${isActive
                      ? 'bg-[#BA1932] text-white shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'}`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="md:hidden lg:block">{t(lk)}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/10 shrink-0 p-4 md:p-2 lg:p-4">
          <div className="flex items-center gap-3 mb-3 md:hidden lg:flex">
            <div className="w-9 h-9 rounded-xl bg-[#BA1932]/20 flex items-center justify-center shrink-0">
              <span className="text-[#BA1932] font-bold text-sm">{user?.name?.[0] ?? 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name ?? t('admin.sidebar.admin')}</p>
              <p className="text-white/40 text-xs truncate">{user?.email ?? ''}</p>
            </div>
          </div>

          <div className="hidden md:flex lg:hidden justify-center mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#BA1932]/20 flex items-center justify-center" title={user?.name}>
              <span className="text-[#BA1932] font-bold text-sm">{user?.name?.[0] ?? 'A'}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title={t('admin.sidebar.signOut')}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all touch-manip
              md:justify-center md:px-0 lg:justify-start lg:px-3"
          >
            <LogOut size={15} className="shrink-0" />
            <span className="md:hidden lg:block">{t('admin.sidebar.signOut')}</span>
          </button>
        </div>
      </aside>
    </>
  )
}
