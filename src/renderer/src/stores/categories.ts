import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export type Category = {
  id: string
  name: string
  type: 'cost' | 'revenue'
  color: string
  iconKey: string
  total: number
  currency: string
  count: number
  projectIds: string[]
  isOverhead: boolean
}

// ─── Seed categories ──────────────────────────────────────────────────────────

const SEED_VERSION = 'v2-event'

const SEED_CATEGORIES: Category[] = [
  // ── Coûts ──
  { id: 'cat-food-catering',         name: 'Food & Catering',              type: 'cost',    color: '#f97316', iconKey: 'ChefHat',         total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-venue',                 name: 'Venue',                        type: 'cost',    color: '#a78bfa', iconKey: 'Building2',       total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-scenography',           name: 'Scenography & Stage Technics', type: 'cost',    color: '#fb923c', iconKey: 'Drama',           total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-sponsors-space',        name: 'Sponsors space',               type: 'cost',    color: '#ec4899', iconKey: 'Handshake',       total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-production-logistics',  name: 'Production & Logistics',       type: 'cost',    color: '#facc15', iconKey: 'Truck',           total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-agency-fees',           name: 'Agency fees',                  type: 'cost',    color: '#f43f5e', iconKey: 'Briefcase',       total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: true  },
  { id: 'cat-ticketing-app',         name: 'Ticketing & App',              type: 'cost',    color: '#22d3a8', iconKey: 'Ticket',          total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-offline-communication', name: 'Offline Communication',        type: 'cost',    color: '#ef4444', iconKey: 'Megaphone',       total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-speakers',              name: 'Speakers',                     type: 'cost',    color: '#c084fc', iconKey: 'Mic',             total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-other',                 name: 'Other (goodies, ads...)',      type: 'cost',    color: '#60a5fa', iconKey: 'Gift',            total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-marketing',             name: 'Marketing',                    type: 'cost',    color: '#818cf8', iconKey: 'BarChart2',       total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: true  },
  { id: 'cat-technical-platform',    name: 'Technical Platform',           type: 'cost',    color: '#2dd4bf', iconKey: 'Server',          total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  // ── Revenus ──
  { id: 'cat-tickets',               name: 'Tickets',                      type: 'revenue', color: '#22d3a8', iconKey: 'Ticket',          total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-partenariats',          name: 'Partenariats',                 type: 'revenue', color: '#60a5fa', iconKey: 'Handshake',       total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-sponsors',              name: 'Sponsors',                     type: 'revenue', color: '#a78bfa', iconKey: 'BadgeCheck',      total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-forfait',               name: 'Forfait',                      type: 'revenue', color: '#34d399', iconKey: 'Receipt',         total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
  { id: 'cat-regie',                 name: 'Régie',                        type: 'revenue', color: '#facc15', iconKey: 'Clock',           total: 0, currency: 'EUR', count: 0, projectIds: [], isOverhead: false },
]

// ─── Local cache ──────────────────────────────────────────────────────────────

const CACHE_KEY = 'pl-categories-cache'
const DIRTY_KEY = 'pl-categories-dirty'

function saveToCache(cats: Category[]) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(cats)) } catch {}
}

function loadFromCache(): Category[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function markDirty() { localStorage.setItem(DIRTY_KEY, 'true') }
function clearDirty() { localStorage.removeItem(DIRTY_KEY) }

// ─── Supabase helpers ─────────────────────────────────────────────────────────

async function dbUpsertCategories(cats: Category[]): Promise<boolean> {
  try {
    const rows = cats.map((c) => ({
      id: c.id,
      name: c.name,
      type: c.type,
      color: c.color,
      icon_key: c.iconKey,
      total: c.total,
      currency: c.currency,
      count: c.count,
      project_ids: c.projectIds,
      is_overhead: c.isOverhead,
    }))
    const { error } = await supabase.from('categories').upsert(rows, { onConflict: 'id' })
    return !error
  } catch { return false }
}

async function dbDeleteCategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from('categories').delete().eq('id', id)
    return !error
  } catch { return false }
}

async function dbLoadCategories(): Promise<Category[] | null> {
  try {
    const { data, error } = await supabase.from('categories').select('*')
    if (error || !data) return null
    return data.map((r) => ({
      id: r.id,
      name: r.name,
      type: r.type,
      color: r.color,
      iconKey: r.icon_key ?? 'Tag',
      total: r.total ?? 0,
      currency: r.currency ?? 'EUR',
      count: r.count ?? 0,
      projectIds: r.project_ids ?? [],
      isOverhead: r.is_overhead ?? false,
    }))
  } catch { return null }
}

// ─── Initial state ────────────────────────────────────────────────────────────

function resolveStartState(): Category[] {
  const cached = loadFromCache()
  const seedVersion = localStorage.getItem('pl-categories-seed-version')

  // Already on current seed version → use cache as-is
  if (cached && seedVersion === SEED_VERSION) return cached

  // Migrate: merge seed into cache — seed entries win by id, unknown user entries are kept
  if (cached) {
    const seedIds = new Set(SEED_CATEGORIES.map((c) => c.id))
    // Keep user-created categories that aren't in the seed
    const userOnly = cached.filter((c) => !seedIds.has(c.id) && !SEED_CATEGORIES.some((s) => s.name === c.name))
    const merged = [...SEED_CATEGORIES, ...userOnly]
    localStorage.setItem('pl-categories-seed-version', SEED_VERSION)
    saveToCache(merged)
    return merged
  }

  // First launch: use seed
  localStorage.setItem('pl-categories-seed-version', SEED_VERSION)
  saveToCache(SEED_CATEGORIES)
  return SEED_CATEGORIES
}

const startState = resolveStartState()

// ─── Store ────────────────────────────────────────────────────────────────────

type CategoriesStore = {
  categories: Category[]
  addCategory: (c: Category) => void
  updateCategory: (c: Category) => void
  deleteCategory: (id: string) => void
  assignProject: (categoryId: string, projectId: string) => void
  unassignProject: (categoryId: string, projectId: string) => void
  syncFromDb: () => Promise<void>
}

export const useCategoriesStore = create<CategoriesStore>((set, get) => ({
  categories: startState,

  addCategory: (c) => {
    set((s) => {
      const next = [...s.categories, c]
      saveToCache(next)
      dbUpsertCategories([c]).then((ok) => { if (!ok) markDirty() }).catch(markDirty)
      return { categories: next }
    })
  },

  updateCategory: (c) => {
    set((s) => {
      const next = s.categories.map((x) => x.id === c.id ? c : x)
      saveToCache(next)
      dbUpsertCategories([c]).then((ok) => { if (!ok) markDirty() }).catch(markDirty)
      return { categories: next }
    })
  },

  deleteCategory: (id) => {
    set((s) => {
      const next = s.categories.filter((x) => x.id !== id)
      saveToCache(next)
      dbDeleteCategory(id).then((ok) => { if (!ok) markDirty() }).catch(markDirty)
      return { categories: next }
    })
  },

  assignProject: (categoryId, projectId) => {
    set((s) => {
      const next = s.categories.map((c) =>
        c.id === categoryId && !c.projectIds.includes(projectId)
          ? { ...c, projectIds: [...c.projectIds, projectId] }
          : c
      )
      saveToCache(next)
      const updated = next.find((c) => c.id === categoryId)
      if (updated) dbUpsertCategories([updated]).then((ok) => { if (!ok) markDirty() }).catch(markDirty)
      return { categories: next }
    })
  },

  unassignProject: (categoryId, projectId) => {
    set((s) => {
      const next = s.categories.map((c) =>
        c.id === categoryId
          ? { ...c, projectIds: c.projectIds.filter((id) => id !== projectId) }
          : c
      )
      saveToCache(next)
      const updated = next.find((c) => c.id === categoryId)
      if (updated) dbUpsertCategories([updated]).then((ok) => { if (!ok) markDirty() }).catch(markDirty)
      return { categories: next }
    })
  },

  syncFromDb: async () => {
    const remote = await dbLoadCategories()
    if (remote && remote.length > 0) {
      saveToCache(remote)
      clearDirty()
      set({ categories: remote })
    } else if (localStorage.getItem(DIRTY_KEY) === 'true') {
      const ok = await dbUpsertCategories(get().categories)
      if (ok) clearDirty()
    }
  },
}))

// ─── Boot: try to sync from DB on startup ─────────────────────────────────────
useCategoriesStore.getState().syncFromDb()

// ─── Reconnect sync ───────────────────────────────────────────────────────────
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    if (localStorage.getItem(DIRTY_KEY) === 'true') {
      const cats = useCategoriesStore.getState().categories
      dbUpsertCategories(cats).then((ok) => { if (ok) clearDirty() })
    }
  })
}
