import { Link, useLocation } from 'react-router-dom'
import { LayoutDashboard, FolderOpen, Tag, Users, LogOut, TrendingUp } from 'lucide-react'
import { useAuthStore } from '../../stores/auth'
import { supabase } from '../../lib/supabase'

const isDemoMode = !supabase

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/projects', icon: FolderOpen, label: 'Projets' },
  { path: '/categories', icon: Tag, label: 'Catégories' },
  { path: '/resources', icon: Users, label: 'Ressources' }
]

export default function Sidebar() {
  const location = useLocation()
  const { user, signOut } = useAuthStore()

  return (
    <div className="glass w-64 flex-shrink-0 flex flex-col h-screen" style={{ backgroundColor: 'rgba(4,4,4,0.7)' }}>
      <div className="flex items-center gap-3 px-6 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <span className="text-white font-bold text-lg">P&L Tool</span>
        {isDemoMode && (
          <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full tracking-wide" style={{ backgroundColor: 'rgba(99,102,241,0.3)', color: '#818cf8' }}>DEMO</span>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path
          return (
            <Link
              key={path}
              to={path}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={
                isActive
                  ? { backgroundColor: '#ffffff', color: '#000000' }
                  : { color: 'rgba(255,255,255,0.4)' }
              }
              onMouseEnter={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'
              }}
              onMouseLeave={(e) => {
                if (!isActive) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'
              }}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
            {isDemoMode ? 'G' : (user?.email?.[0]?.toUpperCase() || 'U')}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {isDemoMode ? 'Grégoire Bonnin' : user?.email}
            </p>
            {isDemoMode && <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>Mode démo</p>}
          </div>
        </div>
        {!isDemoMode && (
          <button
            onClick={() => signOut()}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm font-medium transition-all"
            style={{ color: 'rgba(255,255,255,0.4)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)'; (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255,255,255,0.06)' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.4)'; (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent' }}
          >
            <LogOut className="w-4 h-4" />
            Se déconnecter
          </button>
        )}
      </div>
    </div>
  )
}
