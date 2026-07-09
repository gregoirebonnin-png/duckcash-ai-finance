import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface UserProfile {
  name: string
  email: string
  role: string
  avatarColor: string
  avatarInitials: string
  avatarDataUrl: string | null
}

interface UserStore {
  profile: UserProfile
  updateProfile: (patch: Partial<UserProfile>) => void
}

const DEFAULT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b']

function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export const AVATAR_COLORS = DEFAULT_COLORS

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      profile: {
        name: 'Grégoire Bonnin',
        email: 'gregoire.bonnin@thiga.co',
        role: 'Mode démo',
        avatarColor: '#6366f1',
        avatarInitials: 'GB',
        avatarDataUrl: null,
      },
      updateProfile: (patch) =>
        set((s) => {
          const next = { ...s.profile, ...patch }
          if (patch.name) next.avatarInitials = initials(next.name)
          return { profile: next }
        }),
    }),
    { name: 'pl-user-profile' }
  )
)
