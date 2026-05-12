import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  LayoutDashboard, Building2, FolderKanban, Users, Tag,
  Star, MapPin, MessageSquare, LogOut, ChevronRight, X, TrendingUp
} from 'lucide-react'

const links = [
  { to: '/admin/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { to: '/admin/properties',  label: 'Properties',  icon: Building2 },
  { to: '/admin/projects',    label: 'Projects',    icon: FolderKanban },
  { to: '/admin/agents',      label: 'Agents',      icon: Users },
  { to: '/admin/categories',  label: 'Categories',  icon: Tag },
  { to: '/admin/features',    label: 'Features',    icon: Star },
  { to: '/admin/facilities',  label: 'Facilities',  icon: MapPin },
  { to: '/admin/investors',   label: 'Investors',   icon: TrendingUp },
  { to: '/admin/consults',    label: 'Inquiries',   icon: MessageSquare },
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
      {/* Overlay on mobile */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed top-0 left-0 z-30 h-full w-64 bg-[#0B1F3A] flex flex-col
        transition-transform duration-300 ease-in-out
        ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#C8A97E] flex items-center justify-center">
              <Building2 size={16} className="text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-tight">Homzen</span>
            <span className="text-[#C8A97E] text-xs font-semibold bg-[#C8A97E]/10 px-1.5 py-0.5 rounded">Admin</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-sm font-medium transition-all duration-150
                ${isActive
                  ? 'bg-[#C8A97E] text-white shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/5'}`
              }
            >
              <Icon size={17} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-[#C8A97E]/20 flex items-center justify-center">
              <span className="text-[#C8A97E] font-bold text-sm">{user?.name?.[0] ?? 'A'}</span>
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
