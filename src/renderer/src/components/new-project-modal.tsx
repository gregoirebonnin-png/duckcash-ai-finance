import { useState } from 'react'
import { X, CalendarDays, Briefcase, LayoutGrid } from 'lucide-react'
import type { Project } from '../lib/lovable-mock-data'

const PROJECT_TYPES = [
  { value: 'event', label: 'Événement', icon: CalendarDays, color: '#a78bfa' },
  { value: 'mission', label: 'Mission', icon: Briefcase, color: '#00d9ff' },
  { value: 'other', label: 'Autre', icon: LayoutGrid, color: '#ec4899' },
] as const

type ProjectType = typeof PROJECT_TYPES[number]['value']

export function NewProjectModal({ onClose, onAdd }: { onClose: () => void; onAdd: (p: Project) => void }) {
  const [name, setName] = useState('')
  const [client, setClient] = useState('')
  const [duration, setDuration] = useState('')
  const [type, setType] = useState<ProjectType>('mission')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const today = new Date()
    const end = new Date(today)
    end.setMonth(end.getMonth() + (parseInt(duration) || 6))

    onAdd({
      id: `project-${Date.now()}`,
      name,
      client: client || '—',
      status: 'active',
      owner: 'Grégoire Bonnin',
      startDate: today.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      revenueBudget: 0,
      revenueActual: 0,
      costBudget: 0,
      costActual: 0,
      costs: [],
      revenues: [],
      resources: [],
      monthly: [],
    })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      style={{ backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', background: 'rgba(8,9,12,0.60)' }}
    >
      <div
        className="glass-strong w-full max-w-md rounded-2xl p-6 glow-violet"
        style={{ animation: 'historyIn 0.28s cubic-bezier(0.34,1.56,0.64,1) forwards' }}
      >
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">Nouveau projet</div>
            <div className="mt-0.5 text-[18px] font-semibold">Créer un projet P&amp;L</div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-[12px] text-muted-foreground">Type de projet</label>
            <div className="grid grid-cols-3 gap-2">
              {PROJECT_TYPES.map((t) => {
                const Icon = t.icon
                const active = type === t.value
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setType(t.value)}
                    className="flex flex-col items-center gap-1.5 rounded-xl border py-3 text-[12px] font-medium transition-all"
                    style={{
                      borderColor: active ? t.color + '55' : 'rgba(255,255,255,0.08)',
                      background: active ? t.color + '18' : 'rgba(255,255,255,0.02)',
                      color: active ? t.color : undefined,
                      boxShadow: active ? `0 0 16px -4px ${t.color}66` : undefined,
                    }}
                  >
                    <Icon className="h-4 w-4" style={{ color: active ? t.color : undefined }} />
                    {t.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[12px] text-muted-foreground">Nom du projet</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="ex. Refonte CRM Atlas"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] placeholder:text-muted-foreground/50 focus:border-white/[0.20] focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-muted-foreground">Client</label>
            <input
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="ex. Nexora Corp"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] placeholder:text-muted-foreground/50 focus:border-white/[0.20] focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-muted-foreground">Durée (mois)</label>
            <input
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="ex. 6"
              type="number"
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[14px] placeholder:text-muted-foreground/50 focus:border-white/[0.20] focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/[0.08] bg-white/[0.03] py-2.5 text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-ai py-2.5 text-[13px] font-medium text-[#0a0b10] transition-transform hover:scale-[1.02]"
            >
              Créer le projet
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
