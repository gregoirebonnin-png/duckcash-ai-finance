import { useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, TrendingUp, Receipt, Wallet, Target, UserRound, Plus, X, Pencil, Trash2, Settings2 } from 'lucide-react'
import { GlassCard, KpiCard, ProgressBar, StatusBadge } from '../components/ui-bits'
import { fmtMoney } from '../lib/lovable-mock-data'
import { getIcon } from '../lib/category-icons'
import type { CostLine, RevenueLine } from '../lib/lovable-mock-data'
import { useProjectsStore } from '../stores/projects'
import { useCategoriesStore } from '../stores/categories'
import { ResourceModal } from '../components/resource-modal'
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
  Pie, PieChart, Cell,
} from 'recharts'

// ── Modal ajout / édition ligne ──────────────────────────────────
function LineModal({
  lineType,
  projectId,
  categories,
  onClose,
  initial,
}: {
  lineType: 'cost' | 'revenue'
  projectId: string
  categories: { name: string }[]
  onClose: () => void
  initial?: CostLine | RevenueLine
}) {
  const { addCostLine, addRevenueLine, updateCostLine, updateRevenueLine } = useProjectsStore()
  const isEdit = !!initial
  const [label, setLabel] = useState(initial?.label ?? '')
  const [category, setCategory] = useState(initial?.category ?? categories[0]?.name ?? '')
  const [budget, setBudget] = useState(initial?.budget ? String(initial.budget) : '')
  const [actual, setActual] = useState(initial?.actual ? String(initial.actual) : '')
  const [month, setMonth] = useState(initial?.month ?? '')
  const [customCategory, setCustomCategory] = useState(false)
  const [customCatName, setCustomCatName] = useState('')

  const MONTHS = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc']

  const isCost = lineType === 'cost'
  const accentColor = isCost ? '#ec4899' : '#22d3a8'

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const catName = customCategory ? customCatName : category
    const line = {
      id: initial?.id ?? `line-${Date.now()}`,
      label,
      category: catName,
      budget: parseFloat(budget) || 0,
      actual: parseFloat(actual) || 0,
      month: month || undefined,
    }
    if (isEdit) {
      if (isCost) updateCostLine(projectId, line as CostLine)
      else updateRevenueLine(projectId, line as RevenueLine)
    } else {
      if (isCost) addCostLine(projectId, line as CostLine)
      else addRevenueLine(projectId, line as RevenueLine)
    }
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(8,9,12,0.60)' }}
    >
      <div
        className="glass-strong w-full max-w-md rounded-2xl p-6"
        style={{
          animation: 'historyIn 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards',
          boxShadow: `0 0 0 1px ${accentColor}22, 0 20px 60px -20px ${accentColor}44`,
        }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
              {isEdit ? 'Modifier' : (isCost ? 'Nouvelle dépense' : 'Nouveau revenu')}
            </div>
            <div className="mt-0.5 text-[18px] font-semibold">
              {isEdit ? initial!.label : `Ajouter une ligne ${isCost ? 'de coût' : 'de revenu'}`}
            </div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-[12px] text-muted-foreground">Intitulé de la ligne</label>
            <input
              value={label} onChange={(e) => setLabel(e.target.value)}
              placeholder={isCost ? 'ex. Équipe dev, Infra cloud…' : 'ex. Phase 1 — Discovery…'}
              required
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] placeholder:text-muted-foreground/50 focus:border-white/[0.20] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-[12px] text-muted-foreground">Catégorie</label>
              <button type="button" onClick={() => setCustomCategory((v) => !v)} className="text-[11px] text-brand hover:underline">
                {customCategory ? '← Choisir existante' : '+ Nouvelle catégorie'}
              </button>
            </div>
            {customCategory ? (
              <input value={customCatName} onChange={(e) => setCustomCatName(e.target.value)}
                placeholder="Nom de la nouvelle catégorie" required
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] placeholder:text-muted-foreground/50 focus:border-white/[0.20] focus:outline-none transition-colors" />
            ) : categories.length === 0 ? (
              <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-[13px] text-muted-foreground">
                Aucune catégorie — utilisez "Nouvelle catégorie"
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button key={c.name} type="button" onClick={() => setCategory(c.name)}
                    className="rounded-full border px-3 py-1 text-[12px] font-medium transition-all"
                    style={{
                      borderColor: category === c.name ? accentColor + '55' : 'rgba(255,255,255,0.08)',
                      background: category === c.name ? accentColor + '18' : 'rgba(255,255,255,0.02)',
                      color: category === c.name ? accentColor : undefined,
                    }}>
                    {c.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] text-muted-foreground">
              Mois concerné
              <span className="ml-1 text-[11px] opacity-50">(optionnel — pour le graphe mensuel)</span>
            </label>
            <div className="flex flex-wrap gap-1">
              {MONTHS.map((m) => (
                <button
                  key={m} type="button"
                  onClick={() => setMonth(month === m ? '' : m)}
                  className="rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-all"
                  style={{
                    borderColor: month === m ? accentColor + '77' : 'rgba(255,255,255,0.08)',
                    background: month === m ? accentColor + '22' : 'rgba(255,255,255,0.02)',
                    color: month === m ? accentColor : undefined,
                  }}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[12px] text-muted-foreground">Budget (€)</label>
              <input value={budget} onChange={(e) => setBudget(e.target.value)} type="number" placeholder="0"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] placeholder:text-muted-foreground/50 focus:border-white/[0.20] focus:outline-none transition-colors" />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-muted-foreground">Réel (€)</label>
              <input value={actual} onChange={(e) => setActual(e.target.value)} type="number" placeholder="0"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] placeholder:text-muted-foreground/50 focus:border-white/[0.20] focus:outline-none transition-colors" />
            </div>
          </div>

          {(budget || actual) && (
            <div className="flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 text-[13px]">
              <span className="text-muted-foreground">Écart budget / réel</span>
              <span className="font-medium tabular-nums"
                style={{ color: (parseFloat(actual) || 0) > (parseFloat(budget) || 0) ? (isCost ? '#f87171' : '#22d3a8') : (isCost ? '#22d3a8' : '#f87171') }}>
                {((parseFloat(actual) || 0) - (parseFloat(budget) || 0) >= 0 ? '+' : '')}
                {fmtMoney((parseFloat(actual) || 0) - (parseFloat(budget) || 0))}
              </span>
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
              Annuler
            </button>
            <button type="submit"
              className="flex-1 rounded-xl py-2.5 text-[13px] font-medium text-[#0a0b10] transition-transform hover:scale-[1.02]"
              style={{ background: `linear-gradient(110deg, ${isCost ? '#ec4899, #f97316' : '#22d3a8, #00d9ff'})` }}>
              {isEdit ? 'Enregistrer' : 'Ajouter la ligne'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Modal confirmation suppression ───────────────────────────────
function DeleteConfirmModal({
  label,
  onConfirm,
  onClose,
}: {
  label: string
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(8,9,12,0.70)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0e1018] p-6 shadow-2xl"
        style={{ animation: 'historyIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
      >
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/15">
          <Trash2 className="h-5 w-5 text-rose-400" />
        </div>
        <div className="mt-3 text-[17px] font-semibold">Supprimer cette ligne ?</div>
        <div className="mt-1.5 text-[13px] text-muted-foreground">
          <span className="font-medium text-foreground">"{label}"</span> sera définitivement supprimée. Cette action est irréversible.
        </div>
        <div className="mt-5 flex gap-3">
          <button onClick={onClose}
            className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
            Annuler
          </button>
          <button onClick={() => { onClose(); onConfirm() }}
            className="flex-1 rounded-xl bg-rose-500 py-2.5 text-[13px] font-medium text-white hover:bg-rose-400 transition-colors">
            Supprimer
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Camembert coûts ──────────────────────────────────────────────
function CostPieChart({ data, total }: { data: { name: string; value: number; color: string }[]; total: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const onMouseEnter = useCallback((_: unknown, index: number) => setHoveredIndex(index), [])
  const onMouseLeave = useCallback(() => setHoveredIndex(null), [])

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string } }[] }) => {
    if (!active || !payload?.length) return null
    const d = payload[0]
    const pct = total > 0 ? (d.value / total) * 100 : 0
    return (
      <div style={{
        background: 'var(--card)',
        border: `1px solid ${d.payload.color}55`,
        borderRadius: 10,
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: `0 4px 20px ${d.payload.color}33`,
      }}>
        <div style={{ color: d.payload.color, fontWeight: 600, marginBottom: 2 }}>{d.name}</div>
        <div style={{ color: 'var(--foreground)', fontWeight: 500 }}>{fmtMoney(d.value)}</div>
        <div style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>{pct.toFixed(1)}% du total</div>
      </div>
    )
  }

  return (
    <div className="mb-5 flex items-start gap-4">
      <div className="h-[148px] w-[148px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={38} outerRadius={62}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color}
                  opacity={hoveredIndex === null || hoveredIndex === i ? 1 : 0.3}
                  style={{
                    transform: hoveredIndex === i ? 'scale(1.08)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'opacity 0.15s, transform 0.15s',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 min-w-0 flex-1 pt-1">
        {data.map((d, i) => {
          const pct = total > 0 ? (d.value / total) * 100 : 0
          const isHovered = hoveredIndex === i
          return (
            <div
              key={d.name}
              className="flex items-center gap-2 rounded-lg px-2 py-1 text-[12px] transition-all duration-150"
              style={{
                background: isHovered ? d.color + '18' : 'transparent',
                outline: isHovered ? `1px solid ${d.color}44` : '1px solid transparent',
              }}
            >
              <span className="h-2 w-2 shrink-0 rounded-full transition-all duration-150" style={{ background: d.color, transform: isHovered ? 'scale(1.4)' : 'scale(1)' }} />
              <span className="truncate" style={{ color: isHovered ? 'var(--foreground)' : 'var(--muted-foreground)' }}>{d.name}</span>
              <span className="ml-auto tabular-nums font-medium" style={{ color: isHovered ? d.color : 'var(--foreground)' }}>{pct.toFixed(0)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Camembert revenus ────────────────────────────────────────────
function RevenuePieChart({ data, total }: { data: { name: string; value: number; color: string }[]; total: number }) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const onMouseEnter = useCallback((_: unknown, index: number) => setHoveredIndex(index), [])
  const onMouseLeave = useCallback(() => setHoveredIndex(null), [])

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number; payload: { color: string } }[] }) => {
    if (!active || !payload?.length) return null
    const d = payload[0]
    const pct = total > 0 ? (d.value / total) * 100 : 0
    return (
      <div style={{
        background: 'var(--card)',
        border: `1px solid ${d.payload.color}55`,
        borderRadius: 10,
        padding: '8px 12px',
        fontSize: 12,
        boxShadow: `0 4px 20px ${d.payload.color}33`,
      }}>
        <div style={{ color: d.payload.color, fontWeight: 600, marginBottom: 2 }}>{d.name}</div>
        <div style={{ color: 'var(--foreground)', fontWeight: 500 }}>{fmtMoney(d.value)}</div>
        <div style={{ color: 'var(--muted-foreground)', fontSize: 11 }}>{pct.toFixed(1)}% du total</div>
      </div>
    )
  }

  return (
    <div className="mb-5 flex items-start gap-4">
      <div className="h-[148px] w-[148px] shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%" cy="50%"
              innerRadius={38} outerRadius={62}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              onMouseEnter={onMouseEnter}
              onMouseLeave={onMouseLeave}
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.color}
                  opacity={hoveredIndex === null || hoveredIndex === i ? 1 : 0.3}
                  style={{
                    transform: hoveredIndex === i ? 'scale(1.08)' : 'scale(1)',
                    transformOrigin: 'center',
                    transition: 'opacity 0.15s, transform 0.15s',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 min-w-0 flex-1 pt-1">
        {data.map((d, i) => {
          const pct = total > 0 ? (d.value / total) * 100 : 0
          const isHovered = hoveredIndex === i
          return (
            <div
              key={d.name}
              className="flex items-center gap-2 rounded-lg px-2 py-1 text-[12px] transition-all duration-150"
              style={{
                background: isHovered ? d.color + '18' : 'transparent',
                outline: isHovered ? `1px solid ${d.color}44` : '1px solid transparent',
              }}
            >
              <span className="h-2 w-2 shrink-0 rounded-full transition-all duration-150" style={{ background: d.color, transform: isHovered ? 'scale(1.4)' : 'scale(1)' }} />
              <span className="truncate" style={{ color: isHovered ? 'var(--foreground)' : 'var(--muted-foreground)' }}>{d.name}</span>
              <span className="ml-auto tabular-nums font-medium" style={{ color: isHovered ? d.color : 'var(--foreground)' }}>{pct.toFixed(0)}%</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Modal édition projet ─────────────────────────────────────────
function ProjectEditModal({
  project,
  onClose,
}: {
  project: import('../lib/lovable-mock-data').Project
  onClose: () => void
}) {
  const { updateProject } = useProjectsStore()
  const [name, setName] = useState(project.name)
  const [client, setClient] = useState(project.client)
  const [owner, setOwner] = useState(project.owner)
  const [status, setStatus] = useState<'active' | 'at-risk' | 'closed'>(project.status)
  const [startDate, setStartDate] = useState(project.startDate)
  const [endDate, setEndDate] = useState(project.endDate)
  const [revenueBudget, setRevenueBudget] = useState(String(project.revenueBudget))
  const [costBudget, setCostBudget] = useState(String(project.costBudget))

  const STATUS_OPTIONS: { value: 'active' | 'at-risk' | 'closed'; label: string; color: string }[] = [
    { value: 'active',  label: 'En cours', color: '#22d3a8' },
    { value: 'at-risk', label: 'À risque',  color: '#facc15' },
    { value: 'closed',  label: 'Clôturé',   color: 'rgba(255,255,255,0.3)' },
  ]

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    updateProject(project.id, {
      name,
      client,
      owner,
      status,
      startDate,
      endDate,
      revenueBudget: parseFloat(revenueBudget) || 0,
      costBudget: parseFloat(costBudget) || 0,
    })
    onClose()
  }

  const inputCls = "w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] placeholder:text-muted-foreground/50 focus:border-white/[0.20] focus:outline-none transition-colors"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(8,9,12,0.60)' }}
    >
      <div
        className="glass-strong w-full max-w-lg rounded-2xl p-6 overflow-y-auto"
        style={{ animation: 'historyIn 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards', maxHeight: '90vh', boxShadow: '0 0 0 1px rgba(167,139,250,0.2), 0 20px 60px -20px rgba(167,139,250,0.3)' }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Projet</div>
            <div className="mt-0.5 text-[18px] font-semibold">Modifier les informations</div>
          </div>
          <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom du projet */}
          <div>
            <label className="mb-1.5 block text-[12px] text-muted-foreground">Nom du projet</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="ex. Refonte CRM Atlas" className={inputCls} />
          </div>

          {/* Client + Responsable */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[12px] text-muted-foreground">Client</label>
              <input value={client} onChange={(e) => setClient(e.target.value)} placeholder="ex. Banque Helios" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-muted-foreground">Responsable</label>
              <input value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="ex. Léa Moreau" className={inputCls} />
            </div>
          </div>

          {/* Statut */}
          <div>
            <label className="mb-2 block text-[12px] text-muted-foreground">Statut</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className="rounded-xl border py-2.5 text-[13px] font-medium transition-all"
                  style={{
                    borderColor: status === opt.value ? opt.color + '55' : 'rgba(255,255,255,0.08)',
                    background: status === opt.value ? opt.color + '18' : 'rgba(255,255,255,0.02)',
                    color: status === opt.value ? opt.color : undefined,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[12px] text-muted-foreground">Date de début</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputCls} style={{ colorScheme: 'dark' }} />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-muted-foreground">Date de fin</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputCls} style={{ colorScheme: 'dark' }} />
            </div>
          </div>

          {/* Budgets */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-[12px] text-muted-foreground">Budget revenus (€)</label>
              <input type="number" value={revenueBudget} onChange={(e) => setRevenueBudget(e.target.value)} placeholder="ex. 480000" className={inputCls} />
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] text-muted-foreground">Budget coûts (€)</label>
              <input type="number" value={costBudget} onChange={(e) => setCostBudget(e.target.value)} placeholder="ex. 310000" className={inputCls} />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
              Annuler
            </button>
            <button type="submit"
              className="flex-1 rounded-xl bg-gradient-ai py-2.5 text-[13px] font-medium text-[#0a0b10] transition-transform hover:scale-[1.02]">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── Page projet ──────────────────────────────────────────────────
export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>()
  const { projects, removeCostLine, removeRevenueLine, removeResource } = useProjectsStore()
  const { categories } = useCategoriesStore()
  const [addLine, setAddLine] = useState<'cost' | 'revenue' | null>(null)
  const [editLine, setEditLine] = useState<{ type: 'cost' | 'revenue'; line: CostLine | RevenueLine } | null>(null)
  const [showAddResource, setShowAddResource] = useState(false)
  const [editResource, setEditResource] = useState<{ resource: import('../lib/lovable-mock-data').Resource; projectId: string } | null>(null)
  const [deleteLine, setDeleteLine] = useState<{ type: 'cost' | 'revenue'; id: string; label: string } | null>(null)
  const [deleteResourceId, setDeleteResourceId] = useState<{ id: string; label: string } | null>(null)
  const [showEditProject, setShowEditProject] = useState(false)

  const p = projects.find((proj) => proj.id === id)

  if (!p) return (
    <div className="flex h-64 items-center justify-center text-muted-foreground">
      Projet introuvable — <Link to="/projects" className="ml-2 text-brand hover:underline">retour</Link>
    </div>
  )

  const resourcesCost = p.resources.reduce((sum, r) => sum + r.tjm * r.daysActual, 0)
  const totalCostActual = p.costActual + resourcesCost
  const margin = p.revenueActual - totalCostActual
  const marginPct = p.revenueActual > 0 ? (margin / p.revenueActual) * 100 : 0
  const budgetConsumption = p.costBudget > 0 ? (totalCostActual / p.costBudget) * 100 : 0
  const revenueAttainment = p.revenueBudget > 0 ? (p.revenueActual / p.revenueBudget) * 100 : 0

  const costCategories = categories
    .filter((c) => c.type === 'cost')
    .map((c) => ({ name: c.name }))
  const revenueCategories = categories
    .filter((c) => c.type === 'revenue')
    .map((c) => ({ name: c.name }))

  const FALLBACK_COLORS = [
    '#a78bfa', '#00d9ff', '#ec4899', '#f97316',
    '#22d3a8', '#facc15', '#f87171', '#34d399',
    '#60a5fa', '#e879f9', '#fb7185', '#4ade80',
  ]
  const _catColorCache: Record<string, string> = {}
  let _catColorIdx = 0

  function getCatMeta(catName: string): { Icon: ReturnType<typeof getIcon>; color: string } {
    const cat = categories.find((c) => c.name === catName)
    if (cat) return { Icon: getIcon(cat.iconKey), color: cat.color }
    if (!_catColorCache[catName]) {
      _catColorCache[catName] = FALLBACK_COLORS[_catColorIdx % FALLBACK_COLORS.length]
      _catColorIdx++
    }
    return { Icon: getIcon('Tag'), color: _catColorCache[catName] }
  }

  // Catégories uniques depuis les lignes du projet si le store n'en a pas
  const fallbackCostCats = [...new Set(p.costs.map((c) => c.category))].map((n) => ({ name: n }))
  const fallbackRevCats = [...new Set(p.revenues.map((r) => r.category))].map((n) => ({ name: n }))

  return (
    <div>
      {addLine && (
        <LineModal
          lineType={addLine}
          projectId={p.id}
          categories={addLine === 'cost' ? (costCategories.length ? costCategories : fallbackCostCats) : (revenueCategories.length ? revenueCategories : fallbackRevCats)}
          onClose={() => setAddLine(null)}
        />
      )}
      {deleteLine && (
        <DeleteConfirmModal
          label={deleteLine.label}
          onConfirm={() => {
            if (deleteLine.type === 'cost') removeCostLine(p.id, deleteLine.id)
            else removeRevenueLine(p.id, deleteLine.id)
          }}
          onClose={() => setDeleteLine(null)}
        />
      )}
      {editLine && (
        <LineModal
          lineType={editLine.type}
          projectId={p.id}
          categories={editLine.type === 'cost' ? (costCategories.length ? costCategories : fallbackCostCats) : (revenueCategories.length ? revenueCategories : fallbackRevCats)}
          onClose={() => setEditLine(null)}
          initial={editLine.line}
        />
      )}

      {deleteResourceId && (
        <DeleteConfirmModal
          label={deleteResourceId.label}
          onConfirm={() => removeResource(p.id, deleteResourceId.id)}
          onClose={() => setDeleteResourceId(null)}
        />
      )}
      {showEditProject && <ProjectEditModal project={p} onClose={() => setShowEditProject(false)} />}

      {/* Back + Header */}
      <div className="mb-6 flex items-center gap-3">
        <Link to="/" className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-[22px] font-semibold tracking-tight">{p.name}</h1>
            <StatusBadge status={p.status} revenueActual={p.revenueActual} costActual={p.costActual} revenueBudget={p.revenueBudget} costBudget={p.costBudget} />
          </div>
          <div className="mt-0.5 text-[13px] text-muted-foreground">
            {p.client} · {p.owner} · {new Date(p.startDate).toLocaleDateString('fr-FR')} → {new Date(p.endDate).toLocaleDateString('fr-FR')}
          </div>
        </div>
        <button
          onClick={() => setShowEditProject(true)}
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.025] px-3.5 text-[13px] font-medium text-muted-foreground hover:border-white/[0.18] hover:text-foreground transition-colors"
        >
          <Settings2 className="h-3.5 w-3.5" />
          Modifier
        </button>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <KpiCard label="Revenus réalisés" value={fmtMoney(p.revenueActual)} delta={revenueAttainment - 100} hint={`sur ${fmtMoney(p.revenueBudget)} budgétés`} glow="cyan" icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Coûts engagés" value={fmtMoney(totalCostActual)} delta={-(budgetConsumption - 100)} hint={`sur ${fmtMoney(p.costBudget)} budgétés`} glow="orange" icon={<Receipt className="h-4 w-4" />} />
        <KpiCard label="Marge nette" value={fmtMoney(margin)} delta={marginPct - 30} hint={`${marginPct.toFixed(1)}% taux de marge`} glow="green" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard label="Atteinte budget" value={`${revenueAttainment.toFixed(0)}%`} delta={revenueAttainment - 100} hint="revenus vs objectif" glow="violet" icon={<Target className="h-4 w-4" />} />
      </div>

      {/* Charts */}
      {p.monthly.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <GlassCard glow="cyan">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Mensuel</div>
                <div className="mt-1 text-[16px] font-semibold">Revenus vs Coûts</div>
              </div>
              <div className="flex gap-3 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#00d9ff]" />Revenus</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#ec4899]" />Coûts</span>
              </div>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer>
                <AreaChart data={p.monthly} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
                  <defs>
                    <linearGradient id="pdRevFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00d9ff" stopOpacity={0.45} /><stop offset="100%" stopColor="#00d9ff" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="pdCostFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ec4899" stopOpacity={0.35} /><stop offset="100%" stopColor="#ec4899" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: 'rgba(14,15,19,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => fmtMoney(v)} />
                  <Area type="monotone" dataKey="revenue" stroke="#00d9ff" strokeWidth={2} fill="url(#pdRevFill)" />
                  <Area type="monotone" dataKey="cost" stroke="#ec4899" strokeWidth={2} fill="url(#pdCostFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard glow="violet">
            <div className="mb-4">
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Analyse</div>
              <div className="mt-1 text-[16px] font-semibold">Budget vs Réel par poste</div>
            </div>
            <div className="h-[240px]">
              <ResponsiveContainer>
                <BarChart data={p.costs.map((c) => ({ name: c.label.length > 16 ? c.label.slice(0, 14) + '…' : c.label, Budget: c.budget, Réel: c.actual }))} margin={{ top: 8, right: 8, bottom: 0, left: -8 }} barCategoryGap="30%">
                  <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ background: 'rgba(14,15,19,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => fmtMoney(v)} />
                  <Legend wrapperStyle={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }} />
                  <Bar dataKey="Budget" fill="rgba(167,139,250,0.35)" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Réel" fill="#ec4899" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Coûts + Revenus */}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Détail</div>
              <div className="mt-1 text-[16px] font-semibold">Coûts</div>
            </div>
            <button
              onClick={() => setAddLine('cost')}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-[#ec489933] bg-[#ec489910] px-3 text-[12px] font-medium text-[#ec4899] hover:bg-[#ec489920] transition-colors"
            >
              <Plus className="h-3 w-3" /> Ajouter
            </button>
          </div>

          {/* Camembert répartition coûts par catégorie */}
          {p.costs.length > 0 && (() => {
            const byCategory = Object.values(
              p.costs.reduce<Record<string, { name: string; value: number; color: string }>>((acc, c) => {
                const { color } = getCatMeta(c.category)
                if (!acc[c.category]) acc[c.category] = { name: c.category, value: 0, color }
                acc[c.category].value += c.actual
                return acc
              }, {})
            ).filter((d) => d.value > 0).sort((a, b) => b.value - a.value)

            if (byCategory.length < 2) return null

            return <CostPieChart data={byCategory} total={p.costActual} />
          })()}

          {p.costs.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center text-[13px] text-muted-foreground">
              <Receipt className="h-8 w-8 opacity-30" />
              Aucun coût enregistré
              <button onClick={() => setAddLine('cost')} className="inline-flex items-center gap-1 text-[#ec4899] hover:underline">
                <Plus className="h-3.5 w-3.5" /> Ajouter le premier coût
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...p.costs].sort((a, b) => b.actual - a.actual).map((c) => {
                const pct = c.budget > 0 ? (c.actual / c.budget) * 100 : 0
                const ecart = c.actual - c.budget
                const { Icon, color } = getCatMeta(c.category)
                return (
                  <div key={c.id} className="group">
                    <div className="mb-1 flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded" style={{ background: color + '22', color }}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="font-medium">{c.label}</span>
                        <span className="text-[11px] text-muted-foreground">{c.category}</span>
                        {c.month && <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-muted-foreground">{c.month}</span>}
                        <button
                          onClick={() => setEditLine({ type: 'cost', line: c })}
                          className="flex h-5 w-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-white transition-all"
                          title="Modifier"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setDeleteLine({ type: 'cost', id: c.id, label: c.label })}
                          className="flex h-5 w-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-400 transition-all"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right tabular-nums">
                        <span>{fmtMoney(c.actual)}</span>
                        {c.budget > 0 && (
                          <span className={`ml-2 text-[11px] ${ecart > 0 ? 'text-rose-300' : 'text-emerald-300'}`}>
                            {ecart > 0 ? '+' : ''}{fmtMoney(ecart)}
                          </span>
                        )}
                      </div>
                    </div>
                    {c.budget > 0 && (
                      <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/6">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, pct)}%`,
                            background: pct > 100 ? '#f87171' : '#22d3a8',
                            boxShadow: `0 0 8px ${pct > 100 ? '#f87171' : '#22d3a8'}80`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="flex justify-between border-t border-white/[0.08] pt-3 text-[13px]">
                <span className="text-muted-foreground">Total coûts</span>
                <span className="font-semibold tabular-nums">{fmtMoney(p.costActual)}</span>
              </div>
            </div>
          )}
        </GlassCard>

        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Détail</div>
              <div className="mt-1 text-[16px] font-semibold">Revenus</div>
            </div>
            <button
              onClick={() => setAddLine('revenue')}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-[#22d3a833] bg-[#22d3a810] px-3 text-[12px] font-medium text-[#22d3a8] hover:bg-[#22d3a820] transition-colors"
            >
              <Plus className="h-3 w-3" /> Ajouter
            </button>
          </div>
          {/* Camembert répartition revenus par catégorie */}
          {p.revenues.length > 0 && (() => {
            const byCategory = Object.values(
              p.revenues.reduce<Record<string, { name: string; value: number; color: string }>>((acc, r) => {
                const { color } = getCatMeta(r.category)
                if (!acc[r.category]) acc[r.category] = { name: r.category, value: 0, color }
                acc[r.category].value += r.actual
                return acc
              }, {})
            ).filter((d) => d.value > 0).sort((a, b) => b.value - a.value)

            if (byCategory.length < 2) return null

            return <RevenuePieChart data={byCategory} total={p.revenueActual} />
          })()}

          {p.revenues.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center text-[13px] text-muted-foreground">
              <TrendingUp className="h-8 w-8 opacity-30" />
              Aucun revenu enregistré
              <button onClick={() => setAddLine('revenue')} className="inline-flex items-center gap-1 text-[#22d3a8] hover:underline">
                <Plus className="h-3.5 w-3.5" /> Ajouter le premier revenu
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {[...p.revenues].sort((a, b) => b.actual - a.actual).map((r) => {
                const pct = r.budget > 0 ? (r.actual / r.budget) * 100 : 0
                const ecart = r.actual - r.budget
                const { Icon, color } = getCatMeta(r.category)
                return (
                  <div key={r.id} className="group">
                    <div className="mb-1 flex items-center justify-between text-[13px]">
                      <div className="flex items-center gap-2">
                        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded" style={{ background: color + '22', color }}>
                          <Icon className="h-3 w-3" />
                        </div>
                        <span className="font-medium">{r.label}</span>
                        <span className="text-[11px] text-muted-foreground">{r.category}</span>
                        {r.month && <span className="rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-muted-foreground">{r.month}</span>}
                        <button
                          onClick={() => setEditLine({ type: 'revenue', line: r })}
                          className="flex h-5 w-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-white transition-all"
                          title="Modifier"
                        >
                          <Pencil className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => setDeleteLine({ type: 'revenue', id: r.id, label: r.label })}
                          className="flex h-5 w-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-400 transition-all"
                          title="Supprimer"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-right tabular-nums">
                        <span>{fmtMoney(r.actual)}</span>
                        {r.budget > 0 && (
                          <span className={`ml-2 text-[11px] ${ecart >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>
                            {ecart >= 0 ? '+' : ''}{fmtMoney(ecart)}
                          </span>
                        )}
                      </div>
                    </div>
                    {r.budget > 0 && (
                      <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/6">
                        <div
                          className="absolute top-0 left-0 h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, pct)}%`,
                            background: pct >= 100 ? '#22d3a8' : pct >= 80 ? '#facc15' : '#f87171',
                            boxShadow: `0 0 8px ${pct >= 100 ? '#22d3a8' : pct >= 80 ? '#facc15' : '#f87171'}80`,
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
              <div className="flex justify-between border-t border-white/[0.08] pt-3 text-[13px]">
                <span className="text-muted-foreground">Total revenus</span>
                <span className="font-semibold tabular-nums text-brand">{fmtMoney(p.revenueActual)}</span>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* Ressources */}
      {showAddResource && (
        <ResourceModal onClose={() => setShowAddResource(false)} defaultProjectId={p.id} />
      )}
      {editResource && (
        <ResourceModal onClose={() => setEditResource(null)} initial={editResource} />
      )}
      <div className="mt-6">
        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Équipe</div>
              <div className="mt-1 text-[16px] font-semibold">Ressources allouées</div>
            </div>
            <button
              onClick={() => setShowAddResource(true)}
              className="inline-flex h-8 items-center gap-1 rounded-full border border-[#a78bfa33] bg-[#a78bfa10] px-3 text-[12px] font-medium text-[#a78bfa] hover:bg-[#a78bfa20] transition-colors"
            >
              <Plus className="h-3 w-3" /> Ajouter
            </button>
          </div>
          {p.resources.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center text-[13px] text-muted-foreground">
              <UserRound className="h-8 w-8 opacity-30" />
              Aucune ressource allouée
              <button onClick={() => setShowAddResource(true)} className="inline-flex items-center gap-1 text-[#a78bfa] hover:underline">
                <Plus className="h-3.5 w-3.5" /> Ajouter la première ressource
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {p.resources.map((r) => {
                const costActual = r.tjm * r.daysActual
                const pct = r.daysBudget > 0 ? (r.daysActual / r.daysBudget) * 100 : 0
                return (
                  <div key={r.id} className="group grid grid-cols-12 items-center gap-4 py-3">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/[0.06] overflow-hidden">
                        {r.photo ? <img src={r.photo} alt={r.name} className="h-full w-full object-cover" /> : <UserRound className="h-4 w-4 text-muted-foreground" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <div className="text-[14px] font-medium">{r.name}</div>
                          <button
                            onClick={() => setEditResource({ resource: r, projectId: p.id })}
                            className="flex h-5 w-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-white transition-all"
                            title="Modifier"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setDeleteResourceId({ id: r.id, label: r.name })}
                            className="flex h-5 w-5 items-center justify-center rounded opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-rose-400 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                        <div className="text-[11px] text-muted-foreground">{r.role}</div>
                      </div>
                    </div>
                    <div className="col-span-2 text-[13px] text-muted-foreground tabular-nums">{fmtMoney(r.tjm)}/j</div>
                    <div className="col-span-2 text-[13px] tabular-nums">
                      <span>{r.daysActual}j</span>
                      <span className="text-muted-foreground"> / {r.daysBudget}j</span>
                    </div>
                    <div className="col-span-2 text-right text-[13px] tabular-nums">{fmtMoney(costActual)}</div>
                    <div className="col-span-2">
                      <div className="mb-1 flex justify-between text-[10px] text-muted-foreground">
                        <span>Jours</span><span>{pct.toFixed(0)}%</span>
                      </div>
                      <ProgressBar value={pct} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}
