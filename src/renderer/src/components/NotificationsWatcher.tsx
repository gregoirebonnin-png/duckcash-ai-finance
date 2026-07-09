import { useEffect, useRef } from 'react'
import { useProjectsStore } from '../stores/projects'
import { useCategoriesStore } from '../stores/categories'
import { useNotificationsStore } from '../stores/notifications'
import type { Project } from '../lib/lovable-mock-data'
import type { Category } from '../stores/categories'

function fmt(n: number) {
  return n.toLocaleString('fr-FR') + ' €'
}

function checkBudgetAlerts(prev: Project[], next: Project[], add: ReturnType<typeof useNotificationsStore.getState>['add']) {
  for (const p of next) {
    const old = prev.find((x) => x.id === p.id)
    if (!old) continue

    // Just crossed over budget (costActual > costBudget > 0)
    if (p.costBudget > 0 && p.costActual > p.costBudget && old.costActual <= old.costBudget) {
      add({
        kind: 'danger',
        title: `Dépassement de budget — ${p.name}`,
        body: `Les coûts réels (${fmt(p.costActual)}) dépassent le budget (${fmt(p.costBudget)}) de ${fmt(p.costActual - p.costBudget)}.`,
      })
    }

    // Approaching budget (>85%) — only notify once per crossing
    if (
      p.costBudget > 0 &&
      p.costActual / p.costBudget > 0.85 &&
      p.costActual / p.costBudget <= 1 &&
      old.costActual / old.costBudget <= 0.85
    ) {
      add({
        kind: 'warning',
        title: `Budget presque atteint — ${p.name}`,
        body: `Les coûts atteignent ${Math.round((p.costActual / p.costBudget) * 100)} % du budget (${fmt(p.costActual)} / ${fmt(p.costBudget)}).`,
      })
    }

    // Revenue added
    if (p.revenueActual > old.revenueActual) {
      const delta = p.revenueActual - old.revenueActual
      add({
        kind: 'success',
        title: `Revenu ajouté — ${p.name}`,
        body: `${fmt(delta)} de revenus ont été enregistrés sur le projet ${p.name}.`,
      })
    }

    // Cost added
    if (p.costActual > old.costActual && p.costActual <= p.costBudget) {
      const delta = p.costActual - old.costActual
      add({
        kind: 'info',
        title: `Coût enregistré — ${p.name}`,
        body: `${fmt(delta)} de coûts ont été ajoutés au projet ${p.name}.`,
      })
    }

    // Resource added
    if (p.resources.length > old.resources.length) {
      const newRes = p.resources.find((r) => !old.resources.find((o) => o.id === r.id))
      if (newRes) {
        add({
          kind: 'info',
          title: `Ressource ajoutée — ${p.name}`,
          body: `${newRes.name} (${newRes.role}) a été ajouté·e au projet ${p.name}.`,
        })
      }
    }
  }

  // New project
  for (const p of next) {
    if (!prev.find((x) => x.id === p.id)) {
      add({
        kind: 'success',
        title: `Nouveau projet créé`,
        body: `Le projet « ${p.name} » a été créé${p.client !== '—' ? ` (client : ${p.client})` : ''}.`,
      })
    }
  }
}

function checkCategoryAlerts(prev: Category[], next: Category[], add: ReturnType<typeof useNotificationsStore.getState>['add']) {
  for (const c of next) {
    if (!prev.find((x) => x.id === c.id)) {
      add({
        kind: 'info',
        title: `Nouvelle catégorie`,
        body: `La catégorie « ${c.name} » (${c.type === 'cost' ? 'coût' : 'revenu'}) a été créée.`,
      })
    }
  }
}

export default function NotificationsWatcher() {
  const add = useNotificationsStore((s) => s.add)
  const prevProjectsRef = useRef(useProjectsStore.getState().projects)
  const prevCategoriesRef = useRef(useCategoriesStore.getState().categories)

  useEffect(() => {
    const unsubProjects = useProjectsStore.subscribe((state) => {
      const prev = prevProjectsRef.current
      const next = state.projects
      if (prev !== next) {
        checkBudgetAlerts(prev, next, add)
        prevProjectsRef.current = next
      }
    })

    const unsubCategories = useCategoriesStore.subscribe((state) => {
      const prev = prevCategoriesRef.current
      const next = state.categories
      if (prev !== next) {
        checkCategoryAlerts(prev, next, add)
        prevCategoriesRef.current = next
      }
    })

    return () => {
      unsubProjects()
      unsubCategories()
    }
  }, [add])

  return null
}
