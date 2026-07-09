import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlassCard, SectionHeader, StatusBadge, ProgressBar, computeHealth } from '../components/ui-bits'
import { NewProjectModal } from '../components/new-project-modal'
import { fmtMoney } from '../lib/lovable-mock-data'
import { useProjectsStore } from '../stores/projects'
import { Search, Plus, ArrowRight, Trash2, X } from 'lucide-react'

function DeleteProjectModal({ name, onConfirm, onClose }: { name: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(8,9,12,0.70)' }}
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0e1018] p-6 shadow-2xl"
        style={{ animation: 'historyIn 0.25s cubic-bezier(0.34,1.56,0.64,1) forwards' }}>
        <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/15">
          <Trash2 className="h-5 w-5 text-rose-400" />
        </div>
        <div className="mt-3 text-[17px] font-semibold">Supprimer ce projet ?</div>
        <div className="mt-1.5 text-[13px] text-muted-foreground">
          <span className="font-medium text-foreground">"{name}"</span> et toutes ses données (coûts, revenus, ressources) seront définitivement supprimés.
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

export default function Projects() {
  const [showModal, setShowModal] = useState(false)
  const [deleteProject, setDeleteProject] = useState<{ id: string; name: string } | null>(null)
  const { projects, addProject, removeProject } = useProjectsStore()

  return (
    <div>
      {showModal && <NewProjectModal onClose={() => setShowModal(false)} onAdd={addProject} />}
      {deleteProject && (
        <DeleteProjectModal
          name={deleteProject.name}
          onConfirm={() => removeProject(deleteProject.id)}
          onClose={() => setDeleteProject(null)}
        />
      )}
      <SectionHeader eyebrow="Portefeuille" title="Projets" description="Gérez vos engagements clients, suivez la marge et identifiez les dérives."
        actions={
          <>
            <div className="hidden md:flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[12px] text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
              <input placeholder="Rechercher un projet, client…" className="w-56 bg-transparent focus:outline-none" />
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-ai px-4 text-[13px] font-medium text-[#0a0b10] transition-transform hover:scale-[1.02]"
            >
              <Plus className="h-3.5 w-3.5" /> Nouveau projet
            </button>
          </>
        }
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((p) => {
          const margin = p.revenueActual - p.costActual
          const marginPct = p.revenueActual > 0 ? (margin / p.revenueActual) * 100 : 0
          const health = computeHealth(p.revenueActual, p.costActual, p.revenueBudget, p.costBudget)
          const glowColor = p.status === 'closed' ? 'none' : health.level === 'good' ? 'cyan' : health.level === 'warning' ? 'violet' : 'pink'
          return (
            <Link key={p.id} to={`/projects/${p.id}`} className="group">
              <GlassCard glow={glowColor} className="transition-transform group-hover:-translate-y-0.5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{p.client}</div>
                    <div className="mt-1 text-[18px] font-semibold tracking-tight">{p.name}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} revenueActual={p.revenueActual} costActual={p.costActual} revenueBudget={p.revenueBudget} costBudget={p.costBudget} />
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteProject({ id: p.id, name: p.name }) }}
                      className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-muted-foreground opacity-0 group-hover:opacity-100 hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-400 transition-all"
                      title="Supprimer le projet"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-3 text-[12px]">
                  <div><div className="text-muted-foreground">Revenus</div><div className="mt-0.5 text-[15px] font-medium tabular-nums">{fmtMoney(p.revenueActual)}</div></div>
                  <div><div className="text-muted-foreground">Coûts</div><div className="mt-0.5 text-[15px] font-medium tabular-nums">{fmtMoney(p.costActual)}</div></div>
                  <div><div className="text-muted-foreground">Marge</div><div className="mt-0.5 text-[15px] font-medium tabular-nums text-brand">{marginPct.toFixed(0)}%</div></div>
                </div>
                <div className="mt-5">
                  <div className="mb-1.5 flex justify-between text-[11px] text-muted-foreground">
                    <span>Santé financière</span>
                    <span className="tabular-nums" style={{ color: health.color }}>{Math.min(100, health.score).toFixed(0)}%</span>
                  </div>
                  <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/6">
                    <div className="absolute top-0 left-0 h-full rounded-full transition-all" style={{ width: `${Math.min(100, health.score)}%`, background: health.color, boxShadow: `0 0 8px ${health.color}80` }} />
                  </div>
                </div>
                <div className="mt-5 flex items-center justify-between text-[12px] text-muted-foreground">
                  <span>{p.owner} · {p.resources.length} ressources</span>
                  <span className="inline-flex items-center gap-1 text-brand">Ouvrir <ArrowRight className="h-3 w-3" /></span>
                </div>
              </GlassCard>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
