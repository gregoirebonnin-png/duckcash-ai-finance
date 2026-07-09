import { GlassCard, SectionHeader } from '../components/ui-bits'
import { fmtMoney } from '../lib/lovable-mock-data'
import { useProjectsStore } from '../stores/projects'
import { Bar, BarChart, CartesianGrid, Legend, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export default function Compare() {
  const { projects } = useProjectsStore()
  const barData = projects.map((p) => ({
    name: p.name.split(' ').slice(-1)[0],
    Revenus: p.revenueActual,
    Coûts: p.costActual,
    Marge: p.revenueActual - p.costActual,
  }))

  const radarMetrics = ['Revenus', 'Marge', 'Capacité', 'Maîtrise coûts', 'Avancement']
  const radarData = radarMetrics.map((metric) => {
    const row: Record<string, number | string> = { metric }
    projects.forEach((p) => {
      const map: Record<string, number> = {
        Revenus: (p.revenueActual / p.revenueBudget) * 100,
        Marge: ((p.revenueActual - p.costActual) / p.revenueActual) * 100,
        Capacité: (p.resources.reduce((s, r) => s + r.daysActual, 0) / p.resources.reduce((s, r) => s + r.daysBudget, 0)) * 100,
        'Maîtrise coûts': Math.max(0, 200 - (p.costActual / p.costBudget) * 100),
        Avancement: (p.revenueActual / p.revenueBudget) * 100,
      }
      row[p.name] = Math.round(map[metric])
    })
    return row
  })

  const colors = ['#00d9ff', '#a78bfa', '#ec4899', '#f97316']

  return (
    <div>
      <SectionHeader eyebrow="Multi-projets" title="Comparaison" description="Mettez vos projets côte à côte. Identifiez les meilleurs performeurs et les zones à corriger." />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <GlassCard glow="cyan">
          <div className="mb-4 text-[16px] font-semibold">Revenus, coûts & marge</div>
          <div className="h-[340px]">
            <ResponsiveContainer>
              <BarChart data={barData} barGap={6}>
                <CartesianGrid stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ background: 'rgba(14,15,19,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} formatter={(v: number) => fmtMoney(v)} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Revenus" fill="#00d9ff" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Coûts" fill="#ec4899" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Marge" fill="#a78bfa" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
        <GlassCard glow="violet">
          <div className="mb-4 text-[16px] font-semibold">Profil de performance</div>
          <div className="h-[340px]">
            <ResponsiveContainer>
              <RadarChart data={radarData} outerRadius="75%">
                <PolarGrid stroke="rgba(255,255,255,0.08)" />
                <PolarAngleAxis dataKey="metric" stroke="rgba(255,255,255,0.6)" fontSize={10} />
                <PolarRadiusAxis stroke="rgba(255,255,255,0.2)" fontSize={9} />
                {projects.map((p, i) => (
                  <Radar key={p.id} name={p.name} dataKey={p.name} stroke={colors[i % colors.length]} fill={colors[i % colors.length]} fillOpacity={0.15} strokeWidth={1.5} />
                ))}
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'rgba(14,15,19,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>
      <div className="mt-6">
        <GlassCard>
          <div className="mb-4 text-[16px] font-semibold">Tableau récapitulatif</div>
          <table className="w-full text-[13px]">
            <thead className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="pb-3 text-left font-medium">Projet</th>
                <th className="pb-3 text-left font-medium">Client</th>
                <th className="pb-3 text-right font-medium">Revenus</th>
                <th className="pb-3 text-right font-medium">Coûts</th>
                <th className="pb-3 text-right font-medium">Marge</th>
                <th className="pb-3 text-right font-medium">% marge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((p) => {
                const m = p.revenueActual - p.costActual
                const mp = (m / p.revenueActual) * 100
                return (
                  <tr key={p.id}>
                    <td className="py-3 font-medium">{p.name}</td>
                    <td className="py-3 text-muted-foreground">{p.client}</td>
                    <td className="py-3 text-right tabular-nums">{fmtMoney(p.revenueActual)}</td>
                    <td className="py-3 text-right tabular-nums">{fmtMoney(p.costActual)}</td>
                    <td className="py-3 text-right tabular-nums text-brand">{fmtMoney(m)}</td>
                    <td className="py-3 text-right tabular-nums">{mp.toFixed(1)}%</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </GlassCard>
      </div>
    </div>
  )
}
