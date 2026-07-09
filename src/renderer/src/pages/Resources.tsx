import { useState } from 'react'
import { GlassCard, ProgressBar, SectionHeader } from '../components/ui-bits'
import { fmtMoney } from '../lib/lovable-mock-data'
import type { Resource } from '../lib/lovable-mock-data'
import { useProjectsStore } from '../stores/projects'
import { Plus, UserRound, Pencil, X } from 'lucide-react'
import { ResourceModal } from '../components/resource-modal'

type Assignment = {
  resource: Resource
  projectId: string
  projectName: string
}

type PersonRow = {
  name: string
  role: string
  photo?: string
  tjm: number
  salaire?: number
  assignments: Assignment[]
  totalDaysActual: number
  totalDaysBudget: number
  totalCost: number
}

// Pill colors cycling through a palette
const TAG_COLORS = [
  'bg-violet-500/15 text-violet-300 border-violet-500/25',
  'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  'bg-rose-500/15 text-rose-300 border-rose-500/25',
  'bg-amber-500/15 text-amber-300 border-amber-500/25',
  'bg-emerald-500/15 text-emerald-300 border-emerald-500/25',
  'bg-pink-500/15 text-pink-300 border-pink-500/25',
  'bg-sky-500/15 text-sky-300 border-sky-500/25',
]

function tagColor(idx: number) {
  return TAG_COLORS[idx % TAG_COLORS.length]
}

export default function Resources() {
  const [showModal, setShowModal] = useState(false)
  const [editTarget, setEditTarget] = useState<{ resource: Resource; projectId: string } | null>(null)
  const [addForPerson, setAddForPerson] = useState<Resource | null>(null)
  const { projects } = useProjectsStore()

  // Build project color index (stable across renders — keyed by projectId)
  const projectColorMap: Record<string, number> = {}
  projects.forEach((p, i) => { projectColorMap[p.id] = i })

  // Group all assignments by person name
  const personMap = new Map<string, PersonRow>()
  for (const p of projects) {
    for (const r of p.resources) {
      const existing = personMap.get(r.name)
      const assignment: Assignment = { resource: r, projectId: p.id, projectName: p.name }
      if (existing) {
        existing.assignments.push(assignment)
        existing.totalDaysActual += r.daysActual
        existing.totalDaysBudget += r.daysBudget
        existing.totalCost += r.tjm * r.daysActual
      } else {
        personMap.set(r.name, {
          name: r.name,
          role: r.role,
          photo: r.photo,
          tjm: r.tjm,
          salaire: r.salaire,
          assignments: [assignment],
          totalDaysActual: r.daysActual,
          totalDaysBudget: r.daysBudget,
          totalCost: r.tjm * r.daysActual,
        })
      }
    }
  }
  const persons = Array.from(personMap.values())

  return (
    <div>
      {showModal && <ResourceModal onClose={() => setShowModal(false)} />}
      {editTarget && <ResourceModal onClose={() => setEditTarget(null)} initial={editTarget} />}
      {addForPerson && (
        <ResourceModal
          onClose={() => setAddForPerson(null)}
          prefill={addForPerson}
        />
      )}

      <SectionHeader
        eyebrow="Capacité"
        title="Ressources"
        description="Vue consolidée des affectations. TJM × jours = coût engagé."
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-ai px-4 text-[13px] font-medium text-[#0a0b10] transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-3.5 w-3.5" /> Affecter une ressource
          </button>
        }
      />
      <GlassCard>
        <table className="w-full text-[13px]">
          <thead className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
            <tr>
              <th className="pb-3 text-left font-medium">Ressource</th>
              <th className="pb-3 text-left font-medium">Projets</th>
              <th className="pb-3 text-right font-medium">TJM</th>
              <th className="pb-3 text-right font-medium">Jours réel / budget</th>
              <th className="pb-3 text-right font-medium">Coût engagé</th>
              <th className="pb-3 pl-3 font-medium w-40">Consommation</th>
              <th className="pb-3 w-10" />
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {persons.length === 0 && (
              <tr>
                <td colSpan={7} className="py-10 text-center text-muted-foreground text-[13px]">
                  Aucune ressource affectée
                </td>
              </tr>
            )}
            {persons.map((person) => {
              const pct = person.totalDaysBudget > 0
                ? (person.totalDaysActual / person.totalDaysBudget) * 100
                : 0

              return (
                <tr key={person.name} className="group hover:bg-white/[0.02]">
                  {/* Identité */}
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full ring-2 ring-white/[0.08]">
                        {person.photo
                          ? <img src={person.photo} alt={person.name} className="h-full w-full object-cover" />
                          : <div className="flex h-full w-full items-center justify-center bg-white/5 text-muted-foreground"><UserRound className="h-4 w-4" /></div>
                        }
                      </div>
                      <div>
                        <div className="font-medium">{person.name}</div>
                        <div className="text-[11px] text-muted-foreground">{person.role === '—' ? '' : person.role}</div>
                      </div>
                    </div>
                  </td>

                  {/* Étiquettes projets */}
                  <td className="py-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {person.assignments.map((a) => {
                        const colorIdx = projectColorMap[a.projectId] ?? 0
                        return (
                          <span
                            key={a.projectId}
                            className={`group/tag inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${tagColor(colorIdx)}`}
                          >
                            {a.projectName}
                            <button
                              type="button"
                              title="Modifier cette affectation"
                              onClick={() => setEditTarget({ resource: a.resource, projectId: a.projectId })}
                              className="ml-0.5 rounded-full p-0.5 opacity-0 group-hover/tag:opacity-100 hover:bg-white/10 transition-all"
                            >
                              <Pencil className="h-2.5 w-2.5" />
                            </button>
                          </span>
                        )
                      })}
                      {/* Ajouter une affectation */}
                      <button
                        type="button"
                        title="Affecter à un autre projet"
                        onClick={() => setAddForPerson({
                          id: `res-${Date.now()}`,
                          name: person.name,
                          role: person.role,
                          tjm: person.tjm,
                          salaire: person.salaire,
                          photo: person.photo,
                          daysBudget: 0,
                          daysActual: 0,
                        })}
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-dashed border-white/20 text-muted-foreground opacity-0 group-hover:opacity-100 hover:border-white/40 hover:text-white transition-all"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </td>

                  {/* TJM */}
                  <td className="py-3 text-right tabular-nums">{fmtMoney(person.tjm)}</td>

                  {/* Jours */}
                  <td className="py-3 text-right tabular-nums">
                    {person.totalDaysActual} / {person.totalDaysBudget}
                  </td>

                  {/* Coût engagé */}
                  <td className="py-3 text-right tabular-nums">{fmtMoney(person.totalCost)}</td>

                  {/* Consommation */}
                  <td className="py-3 pl-3">
                    <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                      <span>{pct.toFixed(0)}%</span>
                    </div>
                    <ProgressBar value={pct} />
                  </td>

                  {/* Actions */}
                  <td className="py-3 text-right">
                    {person.assignments.length === 1 && (
                      <button
                        onClick={() => setEditTarget({
                          resource: person.assignments[0].resource,
                          projectId: person.assignments[0].projectId,
                        })}
                        className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-white transition-all"
                        title="Modifier"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                    )}
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
