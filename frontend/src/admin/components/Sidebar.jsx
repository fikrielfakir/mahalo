import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Building2, FolderKanban, Users, Tag,
  Star, MapPin, MessageSquare, LogOut, X, TrendingUp,
  Image, Settings, UserCog, Globe
} from 'lucide-react'
import logoLight from '/logo-light.png'

const groups = [
  {
    label: 'Overview',
    links: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
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
      { to: '/admin/features',   label: 'Features',   icon: Star },
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
      { to: '/admin/users',    label: 'Users',    icon: UserCog },
      { to: '/admin/settings', label: 'Settings', icon: Settings },
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
      {open && (
        <div className="fixed inset-0 z-20 bg-black/40 lg:hidden" onClick={onClose} />
      )}

      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-[#1A1A1A] flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <img src={logoLight} alt="Mahalo" className="h-8 w-auto object-contain" />
            <span className="text-[#9B1232] text-xs font-semibold bg-[#9B1232]/20 px-1.5 py-0.5 rounded shrink-0">Admin</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white ml-2">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {groups.map(({ label, links }) => (
            <div key={label}>
              <p className="text-white/25 text-[10px] font-bold uppercase tracking-widest px-3 mb-1">{label}</p>
              {links.map(({ to, label: lbl, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150
                    ${isActive
                      ? 'bg-[#9B1232] text-white shadow-md'
                      : 'text-white/60 hover:text-white hover:bg-white/5'}`
                  }
                >
                  <Icon size={16} />
                  {lbl}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#9B1232]/20 flex items-center justify-center">
              <span className="text-[#9B1232] font-bold text-sm">{user?.name?.[0] ?? 'A'}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name ?? 'Admin'}</p>
              <p className="text-white/40 text-xs truncate">{user?.email ?? ''}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white/50 hover:text-white hover:bg-white/5 transition-all"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  )
}
