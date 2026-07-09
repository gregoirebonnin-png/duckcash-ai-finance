import { create } from 'zustand'
import { projects as mockProjects } from '../lib/lovable-mock-data'
import type { Project, CostLine, RevenueLine, Resource } from '../lib/lovable-mock-data'
import { supabase } from '../lib/supabase'

// ─── Local cache ──────────────────────────────────────────────────────────────

const CACHE_KEY = 'pl-projects-cache'
const DIRTY_KEY = 'pl-projects-dirty'
const DELETED_PROJECTS_KEY = 'pl-deleted-projects'
const DELETED_RESOURCES_KEY = 'pl-deleted-resources'

function saveToCache(projects: Project[]) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify(projects)) } catch {}
}

function loadFromCache(): Project[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

function markDirty() { localStorage.setItem(DIRTY_KEY, 'true') }
function clearDirty() { localStorage.removeItem(DIRTY_KEY) }
export function hasPendingSync() { return localStorage.getItem(DIRTY_KEY) === 'true' }

// Tombstone helpers — persist deleted IDs so they survive a reload even if
// the Supabase DELETE hasn't landed yet.
function getTombstoneProjects(): string[] {
  try { return JSON.parse(localStorage.getItem(DELETED_PROJECTS_KEY) || '[]') } catch { return [] }
}
function getTombstoneResources(): string[] {
  try { return JSON.parse(localStorage.getItem(DELETED_RESOURCES_KEY) || '[]') } catch { return [] }
}
function addTombstoneProject(id: string) {
  try {
    const list = getTombstoneProjects()
    if (!list.includes(id)) localStorage.setItem(DELETED_PROJECTS_KEY, JSON.stringify([...list, id]))
  } catch {}
}
function addTombstoneResource(id: string) {
  try {
    const list = getTombstoneResources()
    if (!list.includes(id)) localStorage.setItem(DELETED_RESOURCES_KEY, JSON.stringify([...list, id]))
  } catch {}
}
function removeTombstoneProject(id: string) {
  try {
    const list = getTombstoneProjects().filter((x) => x !== id)
    localStorage.setItem(DELETED_PROJECTS_KEY, JSON.stringify(list))
  } catch {}
}
function removeTombstoneResource(id: string) {
  try {
    const list = getTombstoneResources().filter((x) => x !== id)
    localStorage.setItem(DELETED_RESOURCES_KEY, JSON.stringify(list))
  } catch {}
}

// Apply tombstones to a list coming from Supabase
function applyTombstones(projects: Project[]): Project[] {
  const deletedProjects = getTombstoneProjects()
  const deletedResources = getTombstoneResources()
  return projects
    .filter((p) => !deletedProjects.includes(p.id))
    .map((p) => ({
      ...p,
      resources: p.resources.filter((r) => !deletedResources.includes(r.id)),
    }))
}

type MonthlyEntry = Project['monthly'][number]

function applyMonthly(
  monthly: MonthlyEntry[],
  month: string | undefined,
  delta: { revenue?: number; cost?: number; budgetRevenue?: number; budgetCost?: number }
): MonthlyEntry[] {
  if (!month) return monthly
  const idx = monthly.findIndex((m) => m.month === month)
  if (idx === -1) {
    return [...monthly, {
      month,
      revenue: delta.revenue ?? 0,
      cost: delta.cost ?? 0,
      budgetRevenue: delta.budgetRevenue ?? 0,
      budgetCost: delta.budgetCost ?? 0,
    }]
  }
  return monthly.map((m, i) =>
    i !== idx ? m : {
      ...m,
      revenue: m.revenue + (delta.revenue ?? 0),
      cost: m.cost + (delta.cost ?? 0),
      budgetRevenue: m.budgetRevenue + (delta.budgetRevenue ?? 0),
      budgetCost: m.budgetCost + (delta.budgetCost ?? 0),
    }
  )
}

// ─── DB helpers ───────────────────────────────────────────────────────────────

function dbToProject(row: any): Project {
  return {
    id: row.id,
    name: row.name,
    client: row.client,
    status: row.status,
    owner: row.owner,
    startDate: row.start_date,
    endDate: row.end_date,
    revenueBudget: row.revenue_budget,
    revenueActual: row.revenue_actual,
    costBudget: row.cost_budget,
    costActual: row.cost_actual,
    costs: (row.cost_lines ?? []).map((c: any) => ({
      id: c.id,
      label: c.label,
      category: c.category,
      budget: c.budget,
      actual: c.actual,
      month: c.month ?? undefined,
    })),
    revenues: (row.revenue_lines ?? []).map((r: any) => ({
      id: r.id,
      label: r.label,
      category: r.category,
      budget: r.budget,
      actual: r.actual,
      month: r.month ?? undefined,
    })),
    resources: (row.resources ?? []).map((h: any) => ({
      id: h.id,
      name: h.name,
      role: h.role,
      tjm: h.tjm,
      salaire: h.salaire ?? undefined,
      daysBudget: h.days_budget,
      daysActual: h.days_actual,
      photo: h.photo ?? undefined,
    })),
    monthly: (row.monthly_entries ?? []).map((m: any) => ({
      month: m.month,
      revenue: m.revenue,
      cost: m.cost,
      budgetRevenue: m.budget_revenue,
      budgetCost: m.budget_cost,
    })),
  }
}

async function dbUpsertProject(p: Project) {
  if (!supabase) return
  const { error } = await supabase.from('projects').upsert({
    id: p.id,
    name: p.name,
    client: p.client,
    status: p.status,
    owner: p.owner,
    start_date: p.startDate,
    end_date: p.endDate,
    revenue_budget: p.revenueBudget,
    revenue_actual: p.revenueActual,
    cost_budget: p.costBudget,
    cost_actual: p.costActual,
  })
  if (error) console.error('[supabase] upsert project error:', error)
  else console.log('[supabase] project upserted:', p.id)
}

async function dbUpsertProjectTotals(projectId: string, p: Pick<Project, 'revenueBudget' | 'revenueActual' | 'costBudget' | 'costActual'>) {
  if (!supabase) return
  await supabase.from('projects').update({
    revenue_budget: p.revenueBudget,
    revenue_actual: p.revenueActual,
    cost_budget: p.costBudget,
    cost_actual: p.costActual,
  }).eq('id', projectId)
}

async function dbUpsertCostLine(projectId: string, line: CostLine) {
  if (!supabase) return
  await supabase.from('cost_lines').upsert({
    id: line.id,
    project_id: projectId,
    label: line.label,
    category: line.category,
    budget: line.budget,
    actual: line.actual,
    month: line.month ?? null,
  })
}

async function dbDeleteCostLine(projectId: string, lineId: string) {
  if (!supabase) return
  await supabase.from('cost_lines').delete().eq('project_id', projectId).eq('id', lineId)
}

async function dbUpsertRevenueLine(projectId: string, line: RevenueLine) {
  if (!supabase) return
  await supabase.from('revenue_lines').upsert({
    id: line.id,
    project_id: projectId,
    label: line.label,
    category: line.category,
    budget: line.budget,
    actual: line.actual,
    month: line.month ?? null,
  })
}

async function dbDeleteRevenueLine(projectId: string, lineId: string) {
  if (!supabase) return
  await supabase.from('revenue_lines').delete().eq('project_id', projectId).eq('id', lineId)
}

async function dbUpsertResource(projectId: string, resource: Resource) {
  if (!supabase) return
  await supabase.from('resources').upsert({
    id: resource.id,
    project_id: projectId,
    name: resource.name,
    role: resource.role,
    tjm: resource.tjm,
    salaire: resource.salaire ?? null,
    days_budget: resource.daysBudget,
    days_actual: resource.daysActual,
    photo: resource.photo ?? null,
  })
}

async function dbUpsertMonthlyEntries(projectId: string, monthly: MonthlyEntry[]) {
  if (!supabase) return
  await supabase.from('monthly_entries').upsert(
    monthly.map((m) => ({
      project_id: projectId,
      month: m.month,
      revenue: m.revenue,
      cost: m.cost,
      budget_revenue: m.budgetRevenue,
      budget_cost: m.budgetCost,
    }))
  )
}

async function seedToDb(projects: Project[]) {
  if (!supabase) return
  for (const p of projects) {
    await dbUpsertProject(p)
    for (const c of p.costs) await dbUpsertCostLine(p.id, c)
    for (const r of p.revenues) await dbUpsertRevenueLine(p.id, r)
    for (const h of p.resources) await dbUpsertResource(p.id, h)
    await dbUpsertMonthlyEntries(p.id, p.monthly)
  }
}

// ─── Store ────────────────────────────────────────────────────────────────────

type ProjectsStore = {
  projects: Project[]
  initialized: boolean
  online: boolean
  loadProjects: () => Promise<void>
  syncToSupabase: () => Promise<void>
  addProject: (p: Project) => void
  updateProject: (id: string, patch: Partial<Pick<Project, 'name' | 'client' | 'owner' | 'status' | 'startDate' | 'endDate' | 'revenueBudget' | 'costBudget'>>) => void
  addCostLine: (projectId: string, line: CostLine) => void
  addRevenueLine: (projectId: string, line: RevenueLine) => void
  removeCostLinesByCategory: (projectId: string, category: string) => void
  removeRevenueLinesByCategory: (projectId: string, category: string) => void
  updateCostLine: (projectId: string, line: CostLine) => void
  updateRevenueLine: (projectId: string, line: RevenueLine) => void
  removeCostLine: (projectId: string, lineId: string) => void
  removeRevenueLine: (projectId: string, lineId: string) => void
  addResource: (projectId: string, resource: Resource) => void
  updateResource: (projectId: string, resource: Resource) => void
  removeResource: (projectId: string, resourceId: string) => void
  removeProject: (projectId: string) => void
}

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: [...mockProjects],
  initialized: false,
  online: navigator.onLine,

  loadProjects: async () => {
    // Always try Supabase first
    if (supabase && navigator.onLine) {
      const { data, error } = await supabase
        .from('projects')
        .select(`*, cost_lines(*), revenue_lines(*), resources(*), monthly_entries(*)`)
        .order('id')

      if (!error && data) {
        if (data.length === 0) {
          // DB empty — use cache or mock, then seed
          const cached = loadFromCache()
          const projects = cached ?? [...mockProjects]
          set({ projects, initialized: true, online: true })
          saveToCache(projects)
          seedToDb(projects).catch(console.error)
        } else {
          const projects = applyTombstones(data.map(dbToProject))
          set({ projects, initialized: true, online: true })
          saveToCache(projects)
          clearDirty()
        }
        return
      }
    }

    // Offline or Supabase error — fall back to local cache
    const cached = loadFromCache()
    const projects = cached ?? [...mockProjects]
    console.log('[offline] loaded from cache —', projects.length, 'projects')
    set({ projects, initialized: true, online: false })
    if (!cached) saveToCache(projects)
  },

  syncToSupabase: async () => {
    if (!supabase || !hasPendingSync()) return
    const { projects } = get()
    console.log('[sync] pushing', projects.length, 'projects to Supabase')
    try {
      await seedToDb(projects)
      clearDirty()
      set({ online: true })
      console.log('[sync] done')
    } catch (e) {
      console.error('[sync] failed', e)
    }
  },

  addProject: (p) => {
    set((s) => {
      const projects = [...s.projects, p]
      saveToCache(projects)
      return { projects }
    })
    dbUpsertProject(p)
      .then(() => {
        for (const c of p.costs) dbUpsertCostLine(p.id, c).catch(console.error)
        for (const r of p.revenues) dbUpsertRevenueLine(p.id, r).catch(console.error)
        for (const h of p.resources) dbUpsertResource(p.id, h).catch(console.error)
        dbUpsertMonthlyEntries(p.id, p.monthly).catch(console.error)
      })
      .catch(() => markDirty())
  },

  updateProject: (id, patch) =>
    set((s) => {
      const projects = s.projects.map((p) => {
        if (p.id !== id) return p
        const updated = { ...p, ...patch }
        dbUpsertProject(updated).catch(() => markDirty())
        dbUpsertProjectTotals(id, updated).catch(() => markDirty())
        return updated
      })
      saveToCache(projects)
      return { projects }
    }),

  addCostLine: (projectId, line) =>
    set((s) => {
      const projects = s.projects.map((p) => {
        if (p.id !== projectId) return p
        const updated = {
          ...p,
          costs: [...p.costs, line],
          costActual: p.costActual + line.actual,
          costBudget: p.costBudget + line.budget,
          monthly: applyMonthly(p.monthly, line.month, { cost: line.actual, budgetCost: line.budget }),
        }
        dbUpsertCostLine(projectId, line).catch(() => markDirty())
        dbUpsertProjectTotals(projectId, updated).catch(() => markDirty())
        dbUpsertMonthlyEntries(projectId, updated.monthly).catch(() => markDirty())
        return updated
      })
      saveToCache(projects)
      return { projects }
    }),

  addRevenueLine: (projectId, line) =>
    set((s) => {
      const projects = s.projects.map((p) => {
        if (p.id !== projectId) return p
        const updated = {
          ...p,
          revenues: [...p.revenues, line],
          revenueActual: p.revenueActual + line.actual,
          revenueBudget: p.revenueBudget + line.budget,
          monthly: applyMonthly(p.monthly, line.month, { revenue: line.actual, budgetRevenue: line.budget }),
        }
        dbUpsertRevenueLine(projectId, line).catch(() => markDirty())
        dbUpsertProjectTotals(projectId, updated).catch(() => markDirty())
        dbUpsertMonthlyEntries(projectId, updated.monthly).catch(() => markDirty())
        return updated
      })
      saveToCache(projects)
      return { projects }
    }),

  removeCostLine: (projectId, lineId) =>
    set((s) => {
      const projects = s.projects.map((p) => {
        if (p.id !== projectId) return p
        const line = p.costs.find((c) => c.id === lineId)
        if (!line) return p
        const updated = {
          ...p,
          costs: p.costs.filter((c) => c.id !== lineId),
          costBudget: p.costBudget - line.budget,
          costActual: p.costActual - line.actual,
          monthly: applyMonthly(p.monthly, line.month, { cost: -line.actual, budgetCost: -line.budget }),
        }
        dbDeleteCostLine(projectId, lineId).catch(() => markDirty())
        dbUpsertProjectTotals(projectId, updated).catch(() => markDirty())
        dbUpsertMonthlyEntries(projectId, updated.monthly).catch(() => markDirty())
        return updated
      })
      saveToCache(projects)
      return { projects }
    }),

  removeRevenueLine: (projectId, lineId) =>
    set((s) => {
      const projects = s.projects.map((p) => {
        if (p.id !== projectId) return p
        const line = p.revenues.find((r) => r.id === lineId)
        if (!line) return p
        const updated = {
          ...p,
          revenues: p.revenues.filter((r) => r.id !== lineId),
          revenueBudget: p.revenueBudget - line.budget,
          revenueActual: p.revenueActual - line.actual,
          monthly: applyMonthly(p.monthly, line.month, { revenue: -line.actual, budgetRevenue: -line.budget }),
        }
        dbDeleteRevenueLine(projectId, lineId).catch(() => markDirty())
        dbUpsertProjectTotals(projectId, updated).catch(() => markDirty())
        dbUpsertMonthlyEntries(projectId, updated.monthly).catch(() => markDirty())
        return updated
      })
      saveToCache(projects)
      return { projects }
    }),

  removeCostLinesByCategory: (projectId, category) =>
    set((s) => {
      const projects = s.projects.map((p) => {
        if (p.id !== projectId) return p
        const removed = p.costs.filter((c) => c.category === category)
        removed.forEach((c) => dbDeleteCostLine(projectId, c.id).catch(() => markDirty()))
        const totalBudget = removed.reduce((sum, c) => sum + c.budget, 0)
        const totalActual = removed.reduce((sum, c) => sum + c.actual, 0)
        const updated = {
          ...p,
          costs: p.costs.filter((c) => c.category !== category),
          costBudget: p.costBudget - totalBudget,
          costActual: p.costActual - totalActual,
        }
        dbUpsertProjectTotals(projectId, updated).catch(() => markDirty())
        return updated
      })
      saveToCache(projects)
      return { projects }
    }),

  removeRevenueLinesByCategory: (projectId, category) =>
    set((s) => {
      const projects = s.projects.map((p) => {
        if (p.id !== projectId) return p
        const removed = p.revenues.filter((r) => r.category === category)
        removed.forEach((r) => dbDeleteRevenueLine(projectId, r.id).catch(() => markDirty()))
        const totalBudget = removed.reduce((sum, r) => sum + r.budget, 0)
        const totalActual = removed.reduce((sum, r) => sum + r.actual, 0)
        const updated = {
          ...p,
          revenues: p.revenues.filter((r) => r.category !== category),
          revenueBudget: p.revenueBudget - totalBudget,
          revenueActual: p.revenueActual - totalActual,
        }
        dbUpsertProjectTotals(projectId, updated).catch(() => markDirty())
        return updated
      })
      saveToCache(projects)
      return { projects }
    }),

  updateCostLine: (projectId, line) =>
    set((s) => {
      const projects = s.projects.map((p) => {
        if (p.id !== projectId) return p
        const old = p.costs.find((c) => c.id === line.id)
        if (!old) return p
        let monthly = applyMonthly(p.monthly, old.month, { cost: -old.actual, budgetCost: -old.budget })
        monthly = applyMonthly(monthly, line.month, { cost: line.actual, budgetCost: line.budget })
        const updated = {
          ...p,
          costs: p.costs.map((c) => c.id === line.id ? line : c),
          costBudget: p.costBudget - old.budget + line.budget,
          costActual: p.costActual - old.actual + line.actual,
          monthly,
        }
        dbUpsertCostLine(projectId, line).catch(() => markDirty())
        dbUpsertProjectTotals(projectId, updated).catch(() => markDirty())
        dbUpsertMonthlyEntries(projectId, updated.monthly).catch(() => markDirty())
        return updated
      })
      saveToCache(projects)
      return { projects }
    }),

  updateRevenueLine: (projectId, line) =>
    set((s) => {
      const projects = s.projects.map((p) => {
        if (p.id !== projectId) return p
        const old = p.revenues.find((r) => r.id === line.id)
        if (!old) return p
        let monthly = applyMonthly(p.monthly, old.month, { revenue: -old.actual, budgetRevenue: -old.budget })
        monthly = applyMonthly(monthly, line.month, { revenue: line.actual, budgetRevenue: line.budget })
        const updated = {
          ...p,
          revenues: p.revenues.map((r) => r.id === line.id ? line : r),
          revenueBudget: p.revenueBudget - old.budget + line.budget,
          revenueActual: p.revenueActual - old.actual + line.actual,
          monthly,
        }
        dbUpsertRevenueLine(projectId, line).catch(() => markDirty())
        dbUpsertProjectTotals(projectId, updated).catch(() => markDirty())
        dbUpsertMonthlyEntries(projectId, updated.monthly).catch(() => markDirty())
        return updated
      })
      saveToCache(projects)
      return { projects }
    }),

  addResource: (projectId, resource) => {
    set((s) => {
      const projects = s.projects.map((p) =>
        p.id === projectId ? { ...p, resources: [...p.resources, resource] } : p
      )
      saveToCache(projects)
      return { projects }
    })
    dbUpsertResource(projectId, resource).catch(() => markDirty())
  },

  updateResource: (projectId, resource) => {
    set((s) => {
      const projects = s.projects.map((p) =>
        p.id === projectId
          ? { ...p, resources: p.resources.map((r) => r.id === resource.id ? resource : r) }
          : p
      )
      saveToCache(projects)
      return { projects }
    })
    dbUpsertResource(projectId, resource).catch(() => markDirty())
  },

  removeResource: (projectId, resourceId) => {
    set((s) => {
      const projects = s.projects.map((p) =>
        p.id === projectId
          ? { ...p, resources: p.resources.filter((r) => r.id !== resourceId) }
          : p
      )
      saveToCache(projects)
      return { projects }
    })
    addTombstoneResource(resourceId)
    if (supabase) {
      supabase.from('resources').delete().eq('id', resourceId)
        .then(() => removeTombstoneResource(resourceId))
        .catch(() => markDirty())
    }
  },

  removeProject: (projectId) => {
    set((s) => {
      const projects = s.projects.filter((p) => p.id !== projectId)
      saveToCache(projects)
      return { projects }
    })
    addTombstoneProject(projectId)
    if (supabase) {
      supabase.from('projects').delete().eq('id', projectId)
        .then(() => removeTombstoneProject(projectId))
        .catch(() => markDirty())
    }
  },
}))
