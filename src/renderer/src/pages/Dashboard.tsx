import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlassCard, KpiCard, ProgressBar, SectionHeader, StatusBadge } from '../components/ui-bits'
import { NewProjectModal } from '../components/new-project-modal'
import { fmtMoney } from '../lib/lovable-mock-data'
import { useProjectsStore } from '../stores/projects'
import { useCategoriesStore } from '../stores/categories'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { TrendingUp, Wallet, Receipt, Target, Plus, ChevronRight, BarChart2 } from 'lucide-react'
import type { Project } from '../lib/lovable-mock-data'

type Alert = { color: string; title: string; text: string; advice: string }

function biggestCostCategory(p: Project): string {
  if (!p.costs.length) return 'vos postes de coûts'
  const byCategory: Record<string, number> = {}
  for (const c of p.costs) byCategory[c.category] = (byCategory[c.category] ?? 0) + c.actual
  const top = Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0]
  return top ? `la catégorie « ${top[0]} » (${fmtMoney(top[1])})` : 'vos postes de coûts'
}

function computeAlerts(projects: Project[]): Alert[] {
  const alerts: Alert[] = []
  const MARGIN_TARGET = 30 // %
  const COST_WARNING = 0.9  // 90% budget consumed = warning
  const COST_CRITICAL = 1.0 // 100%+ = overrun

  for (const p of projects) {
    if (p.status === 'archived') continue

    const costRatio = p.costBudget > 0 ? p.costActual / p.costBudget : 0
    const marginPct = p.revenueActual > 0 ? ((p.revenueActual - p.costActual) / p.revenueActual) * 100 : null
    const marginBudgetPct = p.revenueBudget > 0 ? ((p.revenueBudget - p.costBudget) / p.revenueBudget) * 100 : null
    const revRatio = p.revenueBudget > 0 ? p.revenueActual / p.revenueBudget : 0
    const overrun = p.costActual - p.costBudget
    const topCost = biggestCostCategory(p)
    const marginGap = marginPct !== null ? MARGIN_TARGET - marginPct : null

    if (costRatio > COST_CRITICAL && p.costBudget > 0) {
      alerts.push({
        color: '#f87171',
        title: p.name,
        text: `Surcoût — coûts à ${(costRatio * 100).toFixed(0)}% du budget (${fmtMoney(p.costActual)} / ${fmtMoney(p.costBudget)}).`,
        advice: `Le dépassement atteint ${fmtMoney(overrun)}. Examinez ${topCost} qui pèse le plus lourd. Pour retrouver l'équilibre, renégociez ce poste ou augmentez les revenus du projet d'au moins ${fmtMoney(overrun)}.`,
      })
    } else if (costRatio >= COST_WARNING && p.costBudget > 0) {
      const remaining = p.costBudget - p.costActual
      alerts.push({
        color: '#facc15',
        title: p.name,
        text: `Coûts à ${(costRatio * 100).toFixed(0)}% du budget — surveillance recommandée.`,
        advice: `Il ne reste que ${fmtMoney(remaining)} de marge sur le budget coûts. Vérifiez ${topCost} et anticipez les dépenses restantes pour éviter un dépassement en fin de projet.`,
      })
    }

    if (marginBudgetPct !== null && marginBudgetPct < MARGIN_TARGET && p.revenueBudget > 0) {
      const already = alerts.find((a) => a.title === p.name)
      if (!already) {
        const gapEur = (MARGIN_TARGET / 100) * p.revenueBudget - (p.revenueBudget - p.costBudget)
        alerts.push({
          color: '#facc15',
          title: p.name,
          text: `Marge budgétée à ${marginBudgetPct.toFixed(1)}%, sous l'objectif de ${MARGIN_TARGET}%.`,
          advice: `Pour atteindre 30% de marge, il faudrait réduire les coûts de ${fmtMoney(gapEur)} ou augmenter les revenus dans les mêmes proportions. Commencez par revoir ${topCost}.`,
        })
      }
    }

    if (marginPct !== null && marginPct < MARGIN_TARGET && p.revenueActual > 0) {
      const already = alerts.find((a) => a.title === p.name)
      if (!already) {
        const gapEur = marginGap !== null ? (marginGap / 100) * p.revenueActual : 0
        alerts.push({
          color: '#facc15',
          title: p.name,
          text: `Marge réalisée à ${marginPct.toFixed(1)}%, sous l'objectif de ${MARGIN_TARGET}%.`,
          advice: `Il manque ${marginGap?.toFixed(1)} pts de marge, soit environ ${fmtMoney(gapEur)}. Envisagez de facturer des prestations supplémentaires ou de réduire ${topCost}.`,
        })
      }
    }

    if (revRatio > 1.03 && p.revenueBudget > 0) {
      const already = alerts.find((a) => a.title === p.name && a.color !== '#22d3a8')
      if (!already) {
        alerts.push({
          color: '#22d3a8',
          title: p.name,
          text: `Revenus à ${(revRatio * 100).toFixed(0)}% de l'objectif (+${fmtMoney(p.revenueActual - p.revenueBudget)}). Dans les clous.`,
          advice: `Bonne performance commerciale. Pensez à réévaluer le budget de revenus à la hausse pour les prochaines périodes et vérifiez que les coûts associés restent maîtrisés.`,
        })
      }
    }
  }

  // Sort: red first, then yellow, then green
  const order = { '#f87171': 0, '#facc15': 1, '#22d3a8': 2 }
  alerts.sort((a, b) => (order[a.color as keyof typeof order] ?? 3) - (order[b.color as keyof typeof order] ?? 3))

  return alerts
}

function ProjectAlerts({ projects }: { projects: Project[] }) {
  const alerts = computeAlerts(projects)
  if (!alerts.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-[13px] text-muted-foreground">
        <span className="mb-2 text-2xl">✅</span>
        Tous les projets sont dans les clous.
      </div>
    )
  }
  return (
    <ul className="space-y-3">
      {alerts.map((a, i) => (
        <li key={i} className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <div className="flex gap-3">
            <span className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: a.color, boxShadow: `0 0 10px ${a.color}` }} />
            <div className="text-[13px]">
              <div className="font-medium">{a.title}</div>
              <div className="text-muted-foreground">{a.text}</div>
            </div>
          </div>
          {a.advice && (
            <div
              className="mt-2.5 rounded-lg px-3 py-2 text-[12px] leading-relaxed"
              style={{ background: `${a.color}0f`, borderLeft: `2px solid ${a.color}55`, color: `${a.color}cc` }}
            >
              💡 {a.advice}
            </div>
          )}
        </li>
      ))}
    </ul>
  )
}

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false)
  const { projects, addProject } = useProjectsStore()
  const { categories } = useCategoriesStore()

  const overheadNames = new Set(
    categories.filter((c) => c.type === 'cost' && c.isOverhead).map((c) => c.name)
  )

  const totals = projects.reduce(
    (a, p) => {
      a.revBudget += p.revenueBudget
      a.revActual += p.revenueActual
      // Split costs into direct vs overhead using category names
      for (const line of p.costs) {
        if (overheadNames.has(line.category)) {
          a.overheadActual += line.actual
          a.overheadBudget += line.budget
        } else {
          a.directActual += line.actual
          a.directBudget += line.budget
        }
      }
      return a
    },
    { revBudget: 0, revActual: 0, directActual: 0, directBudget: 0, overheadActual: 0, overheadBudget: 0 },
  )

  // Marge brute = CA - coûts directs
  const grossMarginActual = totals.revActual - totals.directActual
  const grossMarginBudget = totals.revBudget - totals.directBudget
  const grossMarginPctActual = totals.revActual > 0 ? (grossMarginActual / totals.revActual) * 100 : 0
  const grossMarginPctBudget = totals.revBudget > 0 ? (grossMarginBudget / totals.revBudget) * 100 : 0
  const grossMarginEvol = grossMarginBudget !== 0 ? ((grossMarginActual - grossMarginBudget) / Math.abs(grossMarginBudget)) * 100 : 0

  // Marge nette = marge brute - overhead
  const netMarginActual = grossMarginActual - totals.overheadActual
  const netMarginBudget = grossMarginBudget - totals.overheadBudget
  const netMarginPctActual = totals.revActual > 0 ? (netMarginActual / totals.revActual) * 100 : 0
  const netMarginEvol = netMarginBudget !== 0 ? ((netMarginActual - netMarginBudget) / Math.abs(netMarginBudget)) * 100 : 0

  // Legacy for other cards
  const totalCostActual = totals.directActual + totals.overheadActual
  const totalCostBudget = totals.directBudget + totals.overheadBudget
  const months = projects[0].monthly.map((m, i) => ({
    month: m.month,
    revenue: projects.reduce((s, p) => s + (p.monthly[i]?.revenue ?? 0), 0),
    cost: projects.reduce((s, p) => s + (p.monthly[i]?.cost ?? 0), 0),
  }))

  return (
    <div>
      {showModal && <NewProjectModal onClose={() => setShowModal(false)} onAdd={addProject} />}

      <SectionHeader eyebrow="Vue portefeuille" title="Dashboard" description="Vue consolidée de vos projets. Suivez la marge, les dérives et les ressources clés."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-ai px-4 text-[13px] font-medium text-[#0a0b10] transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-3.5 w-3.5" /> Nouveau projet
          </button>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-5">
        <KpiCard label="Revenus réalisés" value={fmtMoney(totals.revActual)} delta={totals.revBudget > 0 ? ((totals.revActual - totals.revBudget) / totals.revBudget) * 100 : 0} hint={`Budgété : ${fmtMoney(totals.revBudget)}`} glow="cyan" icon={<TrendingUp className="h-4 w-4" />} />
        <KpiCard label="Coûts engagés" value={fmtMoney(totalCostActual)} delta={totalCostBudget > 0 ? ((totalCostActual - totalCostBudget) / totalCostBudget) * 100 : 0} hint={`Budgété : ${fmtMoney(totalCostBudget)}`} glow="orange" icon={<Receipt className="h-4 w-4" />} />
        <KpiCard label="Marge brute" value={fmtMoney(grossMarginActual)} delta={grossMarginEvol} hint={`${grossMarginPctActual.toFixed(1)}% du CA · Budgété : ${fmtMoney(grossMarginBudget)} (${grossMarginPctBudget.toFixed(1)}%)`} glow="cyan" icon={<BarChart2 className="h-4 w-4" />} />
        <KpiCard label="Marge nette" value={fmtMoney(netMarginActual)} delta={netMarginEvol} hint={`${netMarginPctActual.toFixed(1)}% du CA · Budgété : ${fmtMoney(netMarginBudget)}${totals.overheadActual > 0 ? ` · Overhead : ${fmtMoney(totals.overheadActual)}` : ''}`} glow="green" icon={<Wallet className="h-4 w-4" />} />
        <KpiCard label="Atteinte budget" value={`${totals.revBudget > 0 ? ((totals.revActual / totals.revBudget) * 100).toFixed(0) : 0}%`} delta={totals.revBudget > 0 ? ((totals.revActual / totals.revBudget) - 1) * 100 : 0} hint="vs trajectoire planifiée" glow="violet" icon={<Target className="h-4 w-4" />} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" glow="cyan">
          <div className="mb-4 flex items-center justify-between">
            <div><div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Performance mensuelle</div><div className="mt-1 text-[16px] font-semibold">Revenus vs Coûts</div></div>
            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#00d9ff]" />Revenus</span>
              <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-[#ec4899]" />Coûts</span>
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer>
              <AreaChart data={months} margin={{ top: 10, right: 8, bottom: 0, left: -8 }}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#00d9ff" stopOpacity={0.45} /><stop offset="100%" stopColor="#00d9ff" stopOpacity={0} /></linearGradient>
                  <linearGradient id="costFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ec4899" stopOpacity={0.35} /><stop offset="100%" stopColor="#ec4899" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="month" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12, color: 'var(--card-foreground)' }} formatter={(v: number) => fmtMoney(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#00d9ff" strokeWidth={2} fill="url(#revFill)" />
                <Area type="monotone" dataKey="cost" stroke="#ec4899" strokeWidth={2} fill="url(#costFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard glow="violet">
          <div className="mb-4"><div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Alertes IA</div><div className="mt-1 text-[16px] font-semibold">Détections automatiques</div></div>
          <ProjectAlerts projects={projects} />
        </GlassCard>
      </div>
      <div className="mt-6">
        <GlassCard>
          <div className="mb-4 flex items-center justify-between">
            <div><div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Projets actifs</div><div className="mt-1 text-[16px] font-semibold">Avancement budgétaire</div></div>
            <Link to="/projects" className="inline-flex items-center gap-1 text-[12px] text-brand hover:underline">Tous les projets <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="divide-y divide-white/5">
            {projects.map((p) => {
              const consumed = p.costActual / p.costBudget
              return (
                <Link key={p.id} to={`/projects/${p.id}`} className="grid grid-cols-12 items-center gap-4 py-3 transition-colors hover:bg-white/[0.02]">
                  <div className="col-span-4"><div className="text-[14px] font-medium">{p.name}</div><div className="text-[11px] text-muted-foreground">{p.client} · {p.owner}</div></div>
                  <div className="col-span-2"><StatusBadge status={p.status} revenueActual={p.revenueActual} costActual={p.costActual} revenueBudget={p.revenueBudget} costBudget={p.costBudget} /></div>
                  <div className="col-span-2 text-right text-[13px] tabular-nums">{fmtMoney(p.revenueActual)}</div>
                  <div className="col-span-2 text-right text-[13px] tabular-nums text-muted-foreground">{fmtMoney(p.costActual)}</div>
                  <div className="col-span-2">
                    <div className="mb-1 flex justify-between text-[11px] text-muted-foreground"><span>Budget</span><span className="tabular-nums">{(consumed * 100).toFixed(0)}%</span></div>
                    <ProgressBar value={consumed * 100} />
                  </div>
                </Link>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
