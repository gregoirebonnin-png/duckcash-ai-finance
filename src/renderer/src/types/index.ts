export interface Project {
  id: string
  name: string
  description?: string
  type: 'event' | 'project'
  currency: string
  image?: string
  created_at: string
  user_id: string
}

export interface Category {
  id: string
  project_id: string
  name: string
  type: 'cost' | 'revenue'
  color: string
  icon?: string
  budget?: number
}

export interface LineItem {
  id: string
  category_id: string
  project_id: string
  description: string
  amount: number
  date: string
  notes?: string
}

export interface Resource {
  id: string
  project_id: string
  name: string
  role?: string
  daily_rate: number
  days: number
  currency: string
  category_id?: string
}

export interface PLSummary {
  totalRevenue: number
  totalCosts: number
  netPL: number
  marginPercent: number
}
