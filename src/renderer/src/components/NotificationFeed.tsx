import { useRef, useEffect } from 'react'
import { X, BellOff, CheckCheck, Trash2 } from 'lucide-react'
import { useNotificationsStore, type Notification, type NotifKind } from '../stores/notifications'

interface Props {
  onClose: () => void
}

const DOT: Record<NotifKind, string> = {
  success: 'bg-emerald-400 shadow-[0_0_6px_2px_rgba(52,211,153,0.6)]',
  info:    'bg-sky-400    shadow-[0_0_6px_2px_rgba(56,189,248,0.5)]',
  warning: 'bg-amber-400  shadow-[0_0_6px_2px_rgba(251,191,36,0.5)]',
  danger:  'bg-red-500    shadow-[0_0_6px_2px_rgba(239,68,68,0.6)]',
}

const STRIP: Record<NotifKind, string> = {
  success: 'border-l-emerald-500/60',
  info:    'border-l-sky-500/60',
  warning: 'border-l-amber-500/60',
  danger:  'border-l-red-500/60',
}

function timeAgo(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return 'à l\'instant'
  if (diff < 3600) return `il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400) return `il y a ${Math.floor(diff / 3600)} h`
  return `il y a ${Math.floor(diff / 86400)} j`
}

function NotifRow({ n }: { n: Notification }) {
  const { markRead, dismiss } = useNotificationsStore()

  return (
    <div
      className={`group relative flex gap-3 border-b border-white/[0.05] border-l-2 px-4 py-3 transition-colors hover:bg-white/[0.03] ${STRIP[n.kind]} ${n.read ? 'opacity-60' : ''}`}
      onClick={() => markRead(n.id)}
    >
      {/* Dot */}
      <div className="mt-1 flex-shrink-0">
        <span className={`block h-2 w-2 rounded-full animate-pulse ${DOT[n.kind]}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-[12px] font-medium leading-snug">{n.title}</p>
        <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">{n.body}</p>
        <p className="mt-1 text-[10px] text-muted-foreground/50">{timeAgo(n.at)}</p>
      </div>

      {/* Dismiss */}
      <button
        onClick={(e) => { e.stopPropagation(); dismiss(n.id) }}
        className="absolute right-3 top-3 hidden h-5 w-5 items-center justify-center rounded text-muted-foreground/50 transition-colors hover:text-muted-foreground group-hover:flex"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}

export default function NotificationFeed({ onClose }: Props) {
  const { notifications, markAllRead, dismissAll } = useNotificationsStore()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50"
      onClick={onClose}
    >
      <div
        ref={ref}
        className="absolute right-4 top-[68px] w-80 overflow-hidden rounded-2xl border border-white/[0.1] shadow-2xl"
        style={{ background: 'var(--card)', backdropFilter: 'blur(16px)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
          <span className="text-[13px] font-semibold">Notifications</span>
          <div className="flex items-center gap-1">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={markAllRead}
                  title="Tout marquer comme lu"
                  className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
                >
                  <CheckCheck className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={dismissAll}
                  title="Tout supprimer"
                  className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Feed */}
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-4 py-10 text-center text-muted-foreground">
              <BellOff className="h-8 w-8 opacity-30" />
              <p className="text-[12px]">Aucune notification pour l'instant.</p>
              <p className="text-[11px] opacity-60">Les modifications sur vos projets apparaîtront ici.</p>
            </div>
          ) : (
            notifications.map((n) => <NotifRow key={n.id} n={n} />)
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t border-white/[0.06] px-4 py-2">
            <p className="text-[10px] text-muted-foreground/40">
              {notifications.filter((n) => !n.read).length} non lue{notifications.filter((n) => !n.read).length > 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
