import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2, FolderKanban, Users } from 'lucide-react'

const CONFIG = {
  property: {
    icon: Building2,
    title: 'Property Not Found',
    subtitle: 'This listing may have been sold, removed, or the link might be incorrect.',
    browseTo: '/properties',
    browseLabel: 'Browse Properties',
    color: '#730D26',
  },
  project: {
    icon: FolderKanban,
    title: 'Project Not Found',
    subtitle: 'This project may no longer be available or the link might be incorrect.',
    browseTo: '/projects',
    browseLabel: 'Browse Projects',
    color: '#730D26',
  },
  agent: {
    icon: Users,
    title: 'Agent Not Found',
    subtitle: 'This agent profile may have been removed or the link might be incorrect.',
    browseTo: '/agents',
    browseLabel: 'Browse Agents',
    color: '#730D26',
  },
}

export default function NotFoundState({ type = 'property' }) {
  const navigate  = useNavigate()
  const cfg       = CONFIG[type] || CONFIG.property
  const Icon      = cfg.icon

  return (
    <main className="flex-1 flex items-center justify-center px-6 py-24">
      <div className="max-w-lg w-full text-center">

        {/* Icon with faded backdrop */}
        <div className="relative inline-flex items-center justify-center mb-8 select-none">
          <span
            className="text-[180px] font-black leading-none pointer-events-none"
            style={{ color: cfg.color, opacity: 0.06 }}
          >
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl"
              style={{ background: cfg.color }}
            >
              <Icon size={32} className="text-white" />
            </div>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-2xl sm:text-3xl font-bold text-navy mb-3">
          {cfg.title}
        </h1>
        <p className="text-navy/50 text-sm sm:text-base leading-relaxed mb-8 max-w-sm mx-auto">
          {cfg.subtitle}
        </p>

        {/* Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl border-2 border-navy/20 text-navy text-sm font-bold hover:bg-navy/5 transition-colors"
          >
            <ArrowLeft size={15} /> Go Back
          </button>
          <Link
            to={cfg.browseTo}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white text-sm font-bold hover:opacity-90 transition-opacity shadow-sm"
            style={{ background: cfg.color }}
          >
            <Icon size={15} /> {cfg.browseLabel}
          </Link>
        </div>

        {/* Hint */}
        <p className="text-navy/30 text-xs mt-8">
          If you followed a link, it may be outdated. Try searching from the listings page.
        </p>

      </div>
    </main>
  )
}
