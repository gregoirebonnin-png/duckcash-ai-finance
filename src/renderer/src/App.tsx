import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './stores/auth'
import { LayoutDashboard, FolderOpen, Tag, Users, PieChart, GitCompare, Sparkles, Bell, Search, Sun, Moon } from 'lucide-react'
import { DuckLogo } from './components/duck-logo'
import { Blobs } from './components/blobs'
import AccountModal from './components/AccountModal'
import NotificationFeed from './components/NotificationFeed'
import NotificationsWatcher from './components/NotificationsWatcher'
import { useUserStore } from './stores/user'
import { useNotificationsStore } from './stores/notifications'
import { useThemeStore } from './stores/theme'
import { useProjectsStore } from './stores/projects'
import Login from './pages/Login'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Categories from './pages/Categories'
import Resources from './pages/Resources'
import Budget from './pages/Budget'
import Compare from './pages/Compare'

const isDemoMode = !supabase

const navItems = [
  { path: '/home',       label: 'Accueil',       icon: Sparkles },
  { path: '/',           label: 'Dashboard',     icon: LayoutDashboard },
  { path: '/projects',   label: 'Projets',       icon: FolderOpen },
  { path: '/categories', label: 'Catégories',    icon: Tag },
  { path: '/resources',  label: 'Ressources',    icon: Users },
  { path: '/budget',     label: 'Budget',        icon: PieChart },
  { path: '/compare',    label: 'Comparaison',   icon: GitCompare },
]

function SlidingNav({ location, navigate }: { location: ReturnType<typeof useLocation>; navigate: ReturnType<typeof useNavigate> }) {
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const navRef = useRef<HTMLElement | null>(null)
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)

  const activeIndex = navItems.findIndex((n) =>
    n.path === '/' ? location.pathname === '/' : location.pathname.startsWith(n.path)
  )

  useLayoutEffect(() => {
    const el = btnRefs.current[activeIndex]
    const nav = navRef.current
    if (!el || !nav) return
    const parentRect = nav.getBoundingClientRect()
    const elRect = el.getBoundingClientRect()
    setPill({ left: elRect.left - parentRect.left, width: elRect.width })
  }, [activeIndex])

  return (
    <nav
      ref={navRef}
      className="relative ml-2 hidden md:flex items-center gap-1 rounded-full p-1"
      style={{
        border: '1px solid var(--border)',
        background: 'var(--input)',
      }}
    >
      {/* Sliding pill */}
      {pill && (
        <span
          className="absolute top-1 bottom-1 rounded-full pointer-events-none pill-spring"
          style={{
            left: pill.left,
            width: pill.width,
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
          }}
        />
      )}
      {navItems.map((n, i) => {
        const isActive = i === activeIndex
        return (
          <button
            key={n.path}
            ref={(el) => { btnRefs.current[i] = el }}
            onClick={() => navigate(n.path)}
            className="relative z-10 flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium cursor-pointer transition-colors duration-150"
            style={{ color: isActive ? '#00d9ff' : undefined }}
          >
            <n.icon
              size={14}
              strokeWidth={isActive ? 2.5 : 2}
              className={isActive ? '' : 'text-muted-foreground'}
            />
            <span className={isActive ? '' : 'text-muted-foreground'}>
              {n.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

function TopNav({ scrolled }: { scrolled: boolean }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { profile } = useUserStore()
  const [showAccount, setShowAccount] = useState(false)
  const [showNotifs, setShowNotifs] = useState(false)
  const unreadCount = useNotificationsStore((s) => s.notifications.filter((n) => !n.read).length)
  const { theme, toggle: toggleTheme } = useThemeStore()

  return (
    <>
      <header
        className="sticky top-0 z-40 transition-all duration-300"
        style={{
          borderBottom: '1px solid var(--border)',
          background: scrolled ? 'color-mix(in srgb, var(--background) 80%, transparent)' : 'color-mix(in srgb, var(--background) 60%, transparent)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-6 px-6">
          {/* Logo */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <DuckLogo size={32} />
            <div className="leading-tight">
              <div className="text-[15px] font-semibold tracking-tight">DuckCash</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">P&amp;L Intelligence</div>
            </div>
          </div>

          {/* Pill nav */}
          <SlidingNav location={location} navigate={navigate} />

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-2">
            <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-muted-foreground hover:text-foreground transition-colors">
              <Search size={15} />
            </button>
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-muted-foreground hover:text-foreground transition-colors"
            >
              {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              onClick={() => setShowNotifs((v) => !v)}
              className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.025] text-muted-foreground hover:text-foreground transition-colors"
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-[0_0_6px_2px_rgba(239,68,68,0.5)]">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setShowAccount(true)}
              className="ml-1 flex h-9 items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] pl-1 pr-3 transition-colors hover:border-white/[0.18] hover:bg-white/[0.05]"
            >
              <div
                className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full text-[11px] font-semibold"
                style={{ background: profile.avatarDataUrl ? 'transparent' : profile.avatarColor, color: '#fff' }}
              >
                {profile.avatarDataUrl
                  ? <img src={profile.avatarDataUrl} alt="avatar" className="h-full w-full object-cover" />
                  : profile.avatarInitials}
              </div>
              <div className="hidden sm:block leading-tight text-left">
                <div className="text-[12px] font-medium">{profile.name}</div>
                <div className="text-[10px] text-muted-foreground">{profile.role}</div>
              </div>
            </button>
          </div>
        </div>
      </header>
      {showAccount && <AccountModal onClose={() => setShowAccount(false)} />}
      {showNotifs && <NotificationFeed onClose={() => setShowNotifs(false)} />}
    </>
  )
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const mainRef = useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = useState(false)
  const theme = useThemeStore((s) => s.theme)
  const { loadProjects, syncToSupabase, initialized } = useProjectsStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
  }, [theme])

  useEffect(() => {
    if (!initialized) loadProjects()
    const handleOnline = () => {
      console.log('[network] back online — syncing')
      syncToSupabase()
    }
    window.addEventListener('online', handleOnline)
    return () => window.removeEventListener('online', handleOnline)
  }, [])

  useEffect(() => {
    const el = mainRef.current
    if (!el) return
    const onScroll = () => setScrolled(el.scrollTop > 10)
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`${theme} relative min-h-screen`}>
      <Blobs density="low" />
      <NotificationsWatcher />
      <div className="relative z-10 flex flex-col min-h-screen">
        <TopNav scrolled={scrolled} />
        <main
          ref={mainRef}
          className="mx-auto w-full max-w-[1400px] px-6 py-8 overflow-y-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  return <AuthenticatedLayout>{children}</AuthenticatedLayout>
}

export default function App() {
  const { setSession, setLoading } = useAuthStore()

  useEffect(() => {
    if (!supabase) {
      setLoading(false)
      return
    }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
        <Route path="/projects/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute><Categories /></ProtectedRoute>} />
        <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
        <Route path="/budget" element={<ProtectedRoute><Budget /></ProtectedRoute>} />
        <Route path="/compare" element={<ProtectedRoute><Compare /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
