import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NotifKind = 'success' | 'info' | 'warning' | 'danger'

export interface Notification {
  id: string
  kind: NotifKind
  title: string
  body: string
  at: number // timestamp ms
  read: boolean
}

interface NotificationsStore {
  notifications: Notification[]
  add: (n: Omit<Notification, 'id' | 'at' | 'read'>) => void
  markRead: (id: string) => void
  markAllRead: () => void
  dismiss: (id: string) => void
  dismissAll: () => void
}

export const useNotificationsStore = create<NotificationsStore>()(
  persist(
    (set) => ({
      notifications: [],
      add: (n) =>
        set((s) => ({
          notifications: [
            { ...n, id: `notif-${Date.now()}-${Math.random()}`, at: Date.now(), read: false },
            ...s.notifications,
          ].slice(0, 50), // keep last 50
        })),
      markRead: (id) =>
        set((s) => ({ notifications: s.notifications.map((n) => n.id === id ? { ...n, read: true } : n) })),
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      dismiss: (id) =>
        set((s) => ({ notifications: s.notifications.filter((n) => n.id !== id) })),
      dismissAll: () => set({ notifications: [] }),
    }),
    { name: 'pl-notifications' }
  )
)
