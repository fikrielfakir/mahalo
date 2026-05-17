import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Building2, FolderKanban, Users, Tag,
  Star, MapPin, MessageSquare, LogOut, X, TrendingUp,
  Image, Settings, UserCog, Globe, Briefcase, PackageOpen,
  BarChart2, Languages
} from 'lucide-react'
import logoLight from '/logo-light.png'

const groups = [
  {
    label: 'Overview',
    links: [
      { to: '/admin/dashboard',  label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/analytics',  label: 'Analytics', icon: BarChart2 },
    ],
  },
  {
    label: 'Listings',
    links: [
      { to: '/admin/properties', label: 'Properties', icon: Building2 },
      { to: '/admin/projects',   label: 'Projects',   icon: FolderKanban },
      { to: '/admin/agents',     label: 'Agents',     icon: Users },
    ],
  },
  {
    label: 'Taxonomy',
    links: [
      { to: '/admin/categories', label: 'Categories', icon: Tag },
      { to: '/admin/features',   label: 'Amenities',  icon: Star },
      { to: '/admin/facilities', label: 'Facilities', icon: MapPin },
      { to: '/admin/investors',  label: 'Investors',  icon: TrendingUp },
      { to: '/admin/cities',     label: 'Cities',     icon: Globe },
    ],
  },
  {
    label: 'Operations',
    links: [
      { to: '/admin/consults', label: 'Inquiries', icon: MessageSquare },
      { to: '/admin/media',    label: 'Media',     icon: Image },
    ],
  },
  {
    label: 'System',
    links: [
      { to: '/admin/users',                     label: 'Users',         icon: UserCog },
      { to: '/admin/professional-applications', label: 'Applications',  icon: Briefcase },
      { to: '/admin/languages',                 label: 'Languages',     icon: Globe },
      { to: '/admin/translations',              label: 'Translations',  icon: Languages },
      { to: '/admin/settings',                  label: 'Settings',      icon: Settings },
      { to: '/admin/app-update',                label: 'App Update',    icon: PackageOpen },
    ],
  },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <>
      {/* Mobile overlay backdrop */}
      {open && (
        <div className="fixed inset-0 z-20 bg-black/40 md:hidden" onClick={onClose} />
      )}

      {/*
        Mobile  (<md):  slide-in overlay (w-64), hidden by default
        Tablet  (md–lg): always-visible icon-only sidebar (w-16)
        Desktop (lg+):   always-visible full sidebar (w-64)
      */}
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
            <span className="text-[#BA1932] text-xs font-semibold bg-[#BA1932]/20 px-1.5 py-0.5 rounded shrink-0 md:hidden lg:block">Admin</span>
          </div>
          <button onClick={onClose} className="md:hidden text-white/40 hover:text-white ml-2">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4 md:px-1.5 lg:px-3">
          {groups.map(({ label, links }, groupIdx) => (
            <div key={label}>
              {/* Group label — visible on desktop; thin divider on tablet */}
              <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 mb-1 md:hidden lg:block">{label}</p>
              {groupIdx > 0 && (
                <div className="hidden md:block lg:hidden border-t border-white/10 mb-2" />
              )}
              {links.map(({ to, label: lbl, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  title={lbl}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150
                    md:justify-center md:px-0 md:py-3 lg:justify-start lg:px-3 lg:py-2.5
                    ${isActive
                      ? 'bg-[#BA1932] text-white shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'}`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  <span className="md:hidden lg:block">{lbl}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="border-t border-white/10 shrink-0 p-4 md:p-2 lg:p-4">
          {/* Full user info — shown on mobile and desktop, hidden on tablet */}
          <div className="flex items-center gap-3 mb-3 md:hidden lg:flex">
            <div className="w-9 h-9 rounded-xl bg-[#BA1932]/20 flex items-center justify-center shrink-0">
              <span className="text-[#BA1932] font-bold text-sm">{user?.name?.[0] ?? 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name ?? 'Admin'}</p>
              <p className="text-white/40 text-xs truncate">{user?.email ?? ''}</p>
            </div>
          </div>

          {/* Avatar only on tablet */}
          <div className="hidden md:flex lg:hidden justify-center mb-2">
            <div className="w-9 h-9 rounded-xl bg-[#BA1932]/20 flex items-center justify-center" title={user?.name}>
              <span className="text-[#BA1932] font-bold text-sm">{user?.name?.[0] ?? 'A'}</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all touch-manip
              md:justify-center md:px-0 lg:justify-start lg:px-3"
          >
            <LogOut size={15} className="shrink-0" />
            <span className="md:hidden lg:block">Sign out</span>
          </button>
        </div>
      </aside>
    </>
  )
}
