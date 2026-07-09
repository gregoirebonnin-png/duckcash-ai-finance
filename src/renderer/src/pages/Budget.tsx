import { useState } from 'react'
import { GlassCard, ProgressBar, SectionHeader } from '../components/ui-bits'
import { fmtMoney } from '../lib/lovable-mock-data'
import { useProjectsStore } from '../stores/projects'

export default function Budget() {
  const { projects } = useProjectsStore()
  const [projectId, setProjectId] = useState(() => projects[0]?.id ?? '')
  const p = projects.find((x) => x.id === projectId) ?? projects[0]
  if (!p) return <div className="p-8 text-muted-foreground">Aucun projet disponible.</div>
  const rows = [
    ...p.revenues.map((r) => ({ ...r, kind: 'Revenu' as const })),
    ...p.costs.map((c) => ({ ...c, kind: 'Coût' as const })),
  ]
  return (
    <div>
      <SectionHeader eyebrow="Analyse" title="Budget vs Réel" description="Détectez les dérives ligne à ligne. Les barres rouges hachurées indiquent un dépassement."
        actions={
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)}
            className="h-9 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 text-[13px] focus:outline-none">
            {projects.map((pr) => <option key={pr.id} value={pr.id} className="bg-[#0e0f13]">{pr.name}</option>)}
          </select>
        }
      />
      <GlassCard>
        <table className="w-full text-[13px]">
          <thead className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="pb-3 text-left font-medium">Type</th>
              <th className="pb-3 text-left font-medium">Ligne</th>
              <th className="pb-3 text-left font-medium">Catégorie</th>
              <th className="pb-3 text-right font-medium">Budget</th>
              <th className="pb-3 text-right font-medium">Réel</th>
              <th className="pb-3 text-right font-medium">Écart</th>
              <th className="pb-3 pl-3 font-medium w-48">Avancement</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {rows.map((r, i) => {
              const ecart = r.actual - r.budget
              const pct = (r.actual / r.budget) * 100
              const positive = r.kind === 'Revenu' ? ecart >= 0 : ecart <= 0
              return (
                <tr key={i} className="hover:bg-white/[0.02]">
                  <td className="py-3"><span className={r.kind === 'Revenu' ? 'text-brand' : 'text-pink-300'}>{r.kind}</span></td>
                  <td className="py-3 font-medium">{r.label}</td>
                  <td className="py-3 text-muted-foreground">{r.category}</td>
                  <td className="py-3 text-right tabular-nums text-muted-foreground">{fmtMoney(r.budget)}</td>
                  <td className="py-3 text-right tabular-nums">{fmtMoney(r.actual)}</td>
                  <td className={`py-3 text-right tabular-nums ${positive ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {ecart >= 0 ? '+' : ''}{fmtMoney(ecart)}
                  </td>
                  <td className="py-3 pl-3">
                    <div className="mb-1 flex justify-between text-[11px] text-muted-foreground"><span>{pct.toFixed(0)}%</span></div>
                    <ProgressBar value={pct} />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
