import { useProjectsStore } from '../stores/projects'
import { useCategoriesStore } from '../stores/categories'
import type { Project, CostLine, RevenueLine } from './lovable-mock-data'
import type { Category } from '../stores/categories'

export interface AgentResponse {
  text: string
}

export function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Bonjour'
  if (h < 18) return 'Bon après-midi'
  return 'Bonsoir'
}

type ChatMessage = { role: 'user' | 'assistant'; content: string }

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractAmount(text: string): number | null {
  const m = text.match(/(\d[\d\s]*)[\s]*(k|K)?\s*(€|eur|euro)?/i)
  if (!m) return null
  let n = parseFloat(m[1].replace(/\s/g, ''))
  if (m[2]) n *= 1000
  return isNaN(n) ? null : n
}

function findProject(msg: string, projects: Project[]): Project | null {
  const sorted = [...projects].sort((a, b) => b.name.length - a.name.length)
  for (const p of sorted) {
    if (msg.toLowerCase().includes(p.name.toLowerCase())) return p
  }
  return null
}

function extractQuotedOrKeyword(text: string, keyword: string): string {
  const quoted = text.match(/[«"'"]([^«"'"]+)[»"'"]/)
  if (quoted) return quoted[1].trim()
  const re = new RegExp(keyword + '\\s+([A-ZÀ-Üa-zà-ü0-9][^,\\.\\n]+)', 'i')
  const m = text.match(re)
  return m ? m[1].trim() : ''
}

function buildProjectsContext(): string {
  const { projects } = useProjectsStore.getState()
  if (!projects.length) return 'Aucun projet.'
  return projects.map((p) => {
    const margin = p.revenueActual - p.costActual
    const marginPct = p.revenueActual > 0 ? ((margin / p.revenueActual) * 100).toFixed(1) : '—'
    return [
      `Projet: ${p.name} (statut: ${p.status}, client: ${p.client})`,
      `  Revenus — budget: ${p.revenueBudget}€, réalisé: ${p.revenueActual}€`,
      `  Coûts — budget: ${p.costBudget}€, réalisé: ${p.costActual}€`,
      `  Marge réalisée: ${margin}€ (${marginPct}%)`,
    ].join('\n')
  }).join('\n\n')
}

async function callOllama(userMessage: string, history: ChatMessage[]): Promise<AgentResponse> {
  const projectsContext = buildProjectsContext()
  const messages: ChatMessage[] = [...history, { role: 'user', content: userMessage }]
  try {
    const result = await window.electron.ipcRenderer.invoke('claude-chat', { messages, projectsContext })
    if (result.error) return { text: result.error }
    return { text: result.text ?? '' }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    return { text: `Erreur de communication avec l'assistant : ${msg}` }
  }
}

// ── Agent principal ───────────────────────────────────────────────────────────

export async function runAgent(userMessage: string, history: ChatMessage[]): Promise<AgentResponse> {
  const projectsStore = useProjectsStore.getState()
  const categoriesStore = useCategoriesStore.getState()
  const { projects, addProject, addCostLine, addRevenueLine } = projectsStore
  const { categories, addCategory } = categoriesStore

  const msg = userMessage.toLowerCase()

  // ── BILAN / RÉSUMÉ ────────────────────────────────────────────────
  if (msg.includes('résumé') || msg.includes('bilan') || msg.includes('résultat') ||
      msg.includes('comment se porte') || msg.includes('situation') || msg.includes('p&l')) {
    const target = findProject(msg, projects)
    const scope = target ? [target] : projects
    const lines = scope.map((p) => {
      const m = p.revenueActual - p.costActual
      const pct = p.revenueActual > 0 ? ((m / p.revenueActual) * 100).toFixed(1) : '—'
      return `**${p.name}** — Revenus : ${p.revenueActual.toLocaleString('fr-FR')} € | Coûts : ${p.costActual.toLocaleString('fr-FR')} € | Marge : ${m >= 0 ? '+' : ''}${m.toLocaleString('fr-FR')} € (${pct}%)`
    })
    return { text: `Voici le bilan :\n\n${lines.join('\n\n')}` }
  }

  // ── CRÉER UN PROJET ───────────────────────────────────────────────
  const isCreate = msg.includes('créer') || msg.includes('crée') || msg.includes('nouveau projet') ||
    msg.includes('nouvel') || msg.includes('créer un projet') || msg.includes('ajouter un projet') ||
    (msg.includes('nouveau') && (msg.includes('projet') || msg.includes('mission') || msg.includes('événement')))

  if (isCreate) {
    let name = extractQuotedOrKeyword(userMessage, '(?:projet|mission|événement|event)')
    if (!name) {
      const m = userMessage.match(/(?:projet|mission|événement|event)\s+(.+)/i)
      name = m ? m[1].replace(/[«»"']/g, '').trim() : ''
    }
    // Supprimer les mots d'introduction éventuels ("nommé", "appelé", "intitulé", ":")
    name = name.replace(/^(?:nommé|appelé|intitulé|dit|:\s*)\s*/i, '').trim()
    if (!name) return { text: 'Quel nom souhaitez-vous donner à ce projet ?' }

    if (projects.find((p) => p.name.toLowerCase() === name.toLowerCase())) {
      return { text: `Le projet **${name}** existe déjà. Voulez-vous y ajouter des coûts ou des revenus ?` }
    }

    const today = new Date()
    const end = new Date(today)
    end.setMonth(end.getMonth() + 6)

    const clientMatch = userMessage.match(/(?:client|pour)\s+([A-ZÀ-Üa-zà-ü][^\s,\.]+(?:\s+[A-ZÀ-Üa-zà-ü][^\s,\.]+)?)/i)
    const client = clientMatch ? clientMatch[1].trim() : '—'

    const revMatch = userMessage.match(/(\d[\d\s]*)\s*(?:k|K)?\s*(?:€|eur|euro)?\s*(?:de\s+)?(?:revenu|ca|chiffre)/i)
    const revBudget = revMatch ? extractAmount(revMatch[0]) ?? 0 : 0

    const newProject: Project = {
      id: `project-${Date.now()}`,
      name,
      client,
      status: 'active',
      owner: 'Grégoire Bonnin',
      startDate: today.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      revenueBudget: revBudget,
      revenueActual: 0,
      costBudget: 0,
      costActual: 0,
      costs: [],
      revenues: [],
      resources: [],
      monthly: [],
    }

    addProject(newProject)
    return {
      text: `✅ Projet **${name}** créé${client !== '—' ? ` (client : ${client})` : ''}${revBudget > 0 ? `, budget revenus : ${revBudget.toLocaleString('fr-FR')} €` : ''}.\n\nVoulez-vous ajouter des coûts ou des revenus ? Ex : _"Ajoute 5 000 € de coût 'Prestataires' au projet ${name}"_`,
    }
  }

  // ── AJOUTER PLUSIEURS LIGNES D'UN COUP ───────────────────────────
  // Détecte les patterns "label (montant€)" ou "label : montant€" répétés
  const multiMatches = [
    ...userMessage.matchAll(/([A-ZÀ-Üa-zà-ü][^:(,\n]{1,40}?)\s*[:(]\s*(\d[\d\s]*)\s*(?:k|K)?\s*(?:€|eur|euro)?[)]/gi),
    ...userMessage.matchAll(/([A-ZÀ-Üa-zà-ü][^:(,\n]{1,40}?)\s*:\s*(\d[\d\s]*)\s*(?:k|K)?\s*(?:€|eur|euro)/gi),
  ].filter((m, i, arr) => arr.findIndex((x) => x[1].trim() === m[1].trim()) === i) // déduplique

  const isMultiLine = multiMatches.length >= 2 &&
    (msg.includes('ajoute') || msg.includes('ajouter') || msg.includes('enregistre'))

  if (isMultiLine) {
    const project = findProject(msg, projects)
    if (!project) {
      const names = projects.map((p) => `**${p.name}**`).join(', ')
      return { text: `Sur quel projet ? Projets disponibles : ${names || 'aucun'}` }
    }

    const lineType: 'cost' | 'revenue' =
      msg.includes('revenu') || msg.includes('recette') || msg.includes('vente') ? 'revenue' : 'cost'

    const created: string[] = []
    for (const match of multiMatches) {
      const catName = match[1].replace(/^(?:cout|coût|revenu|ligne)\s*\d*\s*:?\s*/i, '').trim()
      let amount = parseFloat(match[2].replace(/\s/g, ''))
      if (/k/i.test(match[0])) amount *= 1000
      if (!catName || isNaN(amount) || amount <= 0) continue

      const catExists = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase() && c.type === lineType)
      if (!catExists) {
        addCategory({
          id: `cat-${Date.now()}-${Math.random()}`,
          name: catName,
          type: lineType,
          color: lineType === 'cost' ? '#ec4899' : '#22d3a8',
          iconKey: 'Tag',
          total: amount,
          currency: 'EUR',
          count: 1,
          projectIds: [project.id],
        })
      }

      const line = { id: `line-${Date.now()}-${Math.random()}`, label: catName, category: catName, budget: amount, actual: amount }
      if (lineType === 'cost') addCostLine(project.id, line as CostLine)
      else addRevenueLine(project.id, line as RevenueLine)
      created.push(`${catName} : ${amount.toLocaleString('fr-FR')} €`)
    }

    if (!created.length) return { text: 'Je n\'ai pas réussi à extraire les montants. Essayez : _"technique (60€), Prod (50€)"_' }
    return {
      text: `✅ ${created.length} ${lineType === 'cost' ? 'coûts' : 'revenus'} ajoutés au projet **${project.name}** :\n${created.map((l) => `• ${l}`).join('\n')}`,
    }
  }

  // ── AJOUTER UN COÛT / REVENU ──────────────────────────────────────
  const isAddLine = msg.includes('ajoute') || msg.includes('ajouter') || msg.includes('enregistre') ||
    msg.includes('saisir') || msg.includes('rajoute')

  if (isAddLine) {
    const amount = extractAmount(userMessage)
    if (!amount) {
      return { text: 'Je n\'ai pas trouvé de montant. Précisez : _"Ajoute 3 500 € de coût \'Location salle\' au projet Summit"_' }
    }

    const project = findProject(msg, projects)
    if (!project) {
      const names = projects.map((p) => `**${p.name}**`).join(', ')
      return { text: `Sur quel projet souhaitez-vous enregistrer ce montant ? Projets disponibles : ${names || 'aucun — créez d\'abord un projet'}` }
    }

    const lineType: 'cost' | 'revenue' =
      msg.includes('revenu') || msg.includes('recette') || msg.includes('ca ') || msg.includes('vente') || msg.includes('facturation')
        ? 'revenue' : 'cost'

    let catName = ''
    const quoted = userMessage.match(/[«"'"]([^«"'"]+)[»"'"]/)
    if (quoted) catName = quoted[1].trim()
    if (!catName) {
      const storeMatch = categories.find((c) => c.type === lineType && msg.includes(c.name.toLowerCase()))
      if (storeMatch) catName = storeMatch.name
    }
    if (!catName) {
      const afterDe = userMessage.match(/\d[\d\s]*(?:k|K)?\s*(?:€|eur|euro)?\s+(?:de\s+)?([A-ZÀ-Üa-zà-ü][^,\.\n]{2,40}?)(?:\s+(?:au|sur|dans|pour)\s+|$)/i)
      catName = afterDe ? afterDe[1].trim() : (lineType === 'cost' ? 'Divers' : 'Revenus divers')
    }

    const catExists = categories.find((c) => c.name.toLowerCase() === catName.toLowerCase() && c.type === lineType)
    if (!catExists) {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: catName,
        type: lineType,
        color: lineType === 'cost' ? '#ec4899' : '#22d3a8',
        iconKey: 'Tag',
        total: amount,
        currency: 'EUR',
        count: 1,
        projectIds: [project.id],
      }
      addCategory(newCat)
    }

    const line: CostLine | RevenueLine = {
      id: `line-${Date.now()}`,
      label: catName,
      category: catName,
      budget: amount,
      actual: amount,
    }

    if (lineType === 'cost') addCostLine(project.id, line as CostLine)
    else addRevenueLine(project.id, line as RevenueLine)

    return {
      text: `✅ **${amount.toLocaleString('fr-FR')} €** enregistrés en ${lineType === 'cost' ? 'coût' : 'revenu'} (_${catName}_) sur le projet **${project.name}**.`,
    }
  }

  // ── FALLBACK → Ollama pour les questions d'analyse ────────────────
  return callOllama(userMessage, history)
}
