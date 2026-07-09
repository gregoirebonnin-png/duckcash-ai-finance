import { create } from 'zustand'
import type { Project, Category, LineItem, Resource } from '../types'
import { MOCK_PROJECTS, MOCK_CATEGORIES, MOCK_LINE_ITEMS, MOCK_RESOURCES } from './mockData'

function generateId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36)
}

interface DemoState {
  projects: Project[]
  categories: Category[]
  lineItems: LineItem[]
  resources: Resource[]

  // Projects
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'user_id'>) => Project
  updateProject: (id: string, updates: Partial<Project>) => void
  deleteProject: (id: string) => void

  // Categories
  addCategory: (category: Omit<Category, 'id'>) => Category
  updateCategory: (id: string, updates: Partial<Category>) => void
  deleteCategory: (id: string) => void

  // LineItems
  addLineItem: (item: Omit<LineItem, 'id'>) => LineItem
  updateLineItem: (id: string, updates: Partial<LineItem>) => void
  deleteLineItem: (id: string) => void

  // Resources
  addResource: (resource: Omit<Resource, 'id'>) => Resource
  updateResource: (id: string, updates: Partial<Resource>) => void
  deleteResource: (id: string) => void
}

export const useDemoStore = create<DemoState>((set, _get) => ({
  projects: [...MOCK_PROJECTS],
  categories: [...MOCK_CATEGORIES],
  lineItems: [...MOCK_LINE_ITEMS],
  resources: [...MOCK_RESOURCES],

  addProject: (data) => {
    const project: Project = {
      ...data,
      id: generateId(),
      created_at: new Date().toISOString(),
      user_id: 'demo-user'
    }
    set((s) => ({ projects: [project, ...s.projects] }))
    return project
  },
  updateProject: (id, updates) =>
    set((s) => ({ projects: s.projects.map((p) => (p.id === id ? { ...p, ...updates } : p)) })),
  deleteProject: (id) =>
    set((s) => ({
      projects: s.projects.filter((p) => p.id !== id),
      categories: s.categories.filter((c) => c.project_id !== id),
      lineItems: s.lineItems.filter((li) => li.project_id !== id),
      resources: s.resources.filter((r) => r.project_id !== id)
    })),

  addCategory: (data) => {
    const category: Category = { ...data, id: generateId() }
    set((s) => ({ categories: [...s.categories, category] }))
    return category
  },
  updateCategory: (id, updates) =>
    set((s) => ({ categories: s.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)) })),
  deleteCategory: (id) =>
    set((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
      lineItems: s.lineItems.filter((li) => li.category_id !== id)
    })),

  addLineItem: (data) => {
    const item: LineItem = { ...data, id: generateId() }
    set((s) => ({ lineItems: [...s.lineItems, item] }))
    return item
  },
  updateLineItem: (id, updates) =>
    set((s) => ({ lineItems: s.lineItems.map((li) => (li.id === id ? { ...li, ...updates } : li)) })),
  deleteLineItem: (id) =>
    set((s) => ({ lineItems: s.lineItems.filter((li) => li.id !== id) })),

  addResource: (data) => {
    const resource: Resource = { ...data, id: generateId() }
    set((s) => ({ resources: [...s.resources, resource] }))
    return resource
  },
  updateResource: (id, updates) =>
    set((s) => ({ resources: s.resources.map((r) => (r.id === id ? { ...r, ...updates } : r)) })),
  deleteResource: (id) =>
    set((s) => ({ resources: s.resources.filter((r) => r.id !== id) }))
}))
