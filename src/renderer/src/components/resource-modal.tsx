import { useState, useRef } from 'react'
import type { Resource } from '../lib/lovable-mock-data'
import { useProjectsStore } from '../stores/projects'
import { UserRound, X, Upload, Trash2, ChevronDown, Search } from 'lucide-react'

export type ResourceModalProps = {
  onClose: () => void
  initial?: { resource: Resource; projectId: string }
  prefill?: Resource
  defaultProjectId?: string
}

export function ResourceModal({ onClose, initial, prefill, defaultProjectId }: ResourceModalProps) {
  const { projects, addResource, updateResource } = useProjectsStore()
  const isEdit = !!initial
  const seed = initial?.resource ?? prefill

  // Collect unique resources across all projects (deduplicated by name)
  const allResources: Resource[] = []
  const seenNames = new Set<string>()
  for (const p of projects) {
    for (const r of p.resources) {
      if (!seenNames.has(r.name)) {
        seenNames.add(r.name)
        allResources.push(r)
      }
    }
  }

  const [projectId, setProjectId] = useState(initial?.projectId ?? defaultProjectId ?? projects[0]?.id ?? '')
  const [name, setName] = useState(seed?.name ?? '')
  const [role, setRole] = useState(seed?.role === '—' ? '' : (seed?.role ?? ''))
  const [tjm, setTjm] = useState(seed?.tjm ? String(seed.tjm) : '')
  const [daysBudget, setDaysBudget] = useState(initial?.resource.daysBudget ? String(initial.resource.daysBudget) : '')
  const [daysActual, setDaysActual] = useState(initial?.resource.daysActual ? String(initial.resource.daysActual) : '')
  const [photo, setPhoto] = useState<string | undefined>(seed?.photo)
  const [salaire, setSalaire] = useState(seed?.salaire ? String(seed.salaire) : '')
  const [showExistingPicker, setShowExistingPicker] = useState(false)
  const [pickerSearch, setPickerSearch] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  function importExisting(r: Resource) {
    setName(r.name)
    setRole(r.role === '—' ? '' : r.role)
    setTjm(r.tjm ? String(r.tjm) : '')
    setSalaire(r.salaire ? String(r.salaire) : '')
    setPhoto(r.photo)
    setShowExistingPicker(false)
    setPickerSearch('')
  }

  const filteredResources = allResources.filter(
    (r) =>
      r.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
      r.role.toLowerCase().includes(pickerSearch.toLowerCase())
  )

  function handleSalaire(val: string) {
    setSalaire(val)
    const annual = parseFloat(val)
    if (annual > 0) setTjm(Math.round(annual / 218).toString())
  }

  function handlePhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setPhoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !projectId) return
    const resource: Resource = {
      id: initial?.resource.id ?? `res-${Date.now()}`,
      name: name.trim(),
      role: role.trim() || '—',
      tjm: parseFloat(tjm) || 0,
      salaire: parseFloat(salaire) || undefined,
      daysBudget: parseFloat(daysBudget) || 0,
      daysActual: parseFloat(daysActual) || 0,
      photo,
    }
    if (isEdit) updateResource(projectId, resource)
    else addResource(projectId, resource)
    onClose()
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(12px)', background: 'rgba(10,11,16,0.6)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        style={{ animation: 'historyIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both', maxHeight: '90vh', overflowY: 'auto' }}
        className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#0e1018] p-6 shadow-2xl"
      >
        <button onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-white"><X className="h-4 w-4" /></button>
        <div className="mb-5">
          <div className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground mb-1">{isEdit ? 'Modifier' : 'Nouvelle affectation'}</div>
          <div className="text-[20px] font-semibold tracking-tight">{isEdit ? name : 'Affecter une ressource'}</div>
        </div>

        {/* Picker ressource existante (uniquement en mode création) */}
        {!isEdit && allResources.length > 0 && (
          <div className="mb-5">
            <button
              type="button"
              onClick={() => setShowExistingPicker((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-[13px] text-muted-foreground hover:border-white/[0.14] hover:text-foreground transition-colors"
            >
              <span>Importer depuis une ressource existante</span>
              <ChevronDown className={`h-4 w-4 transition-transform ${showExistingPicker ? 'rotate-180' : ''}`} />
            </button>

            {showExistingPicker && (
              <div className="mt-2 rounded-xl border border-white/[0.08] bg-[#0a0b10] overflow-hidden">
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2">
                  <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                  <input
                    autoFocus
                    value={pickerSearch}
                    onChange={(e) => setPickerSearch(e.target.value)}
                    placeholder="Rechercher par nom ou rôle…"
                    className="flex-1 bg-transparent text-[13px] placeholder:text-muted-foreground focus:outline-none"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {filteredResources.length === 0 ? (
                    <div className="py-6 text-center text-[12px] text-muted-foreground">Aucune ressource trouvée</div>
                  ) : (
                    filteredResources.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => importExisting(r)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 text-left hover:bg-white/[0.04] transition-colors"
                      >
                        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/[0.08]">
                          {r.photo
                            ? <img src={r.photo} alt={r.name} className="h-full w-full object-cover" />
                            : <div className="flex h-full w-full items-center justify-center bg-white/5"><UserRound className="h-3.5 w-3.5 text-muted-foreground" /></div>
                          }
                        </div>
                        <div className="min-w-0">
                          <div className="truncate text-[13px] font-medium">{r.name}</div>
                          <div className="truncate text-[11px] text-muted-foreground">{r.role === '—' ? '' : r.role}{r.tjm ? ` · ${r.tjm} €/j` : ''}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          {/* Photo */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">Photo</label>
            <div className="flex items-center gap-4">
              <div
                className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 overflow-hidden cursor-pointer group"
                onClick={() => fileRef.current?.click()}
              >
                {photo ? <img src={photo} alt="avatar" className="h-full w-full object-cover" /> : <UserRound className="h-6 w-6 text-muted-foreground" />}
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Upload className="h-4 w-4 text-white" />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[12px] text-muted-foreground hover:text-white hover:bg-white/10 transition-colors">
                  <Upload className="h-3 w-3" /> Importer une photo
                </button>
                {photo && (
                  <button type="button" onClick={() => { setPhoto(undefined); if (fileRef.current) fileRef.current.value = '' }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] px-3 py-1.5 text-[12px] text-muted-foreground hover:text-red-400 transition-colors">
                    <Trash2 className="h-3 w-3" /> Supprimer
                  </button>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
            </div>
          </div>

          {/* Projet */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">Projet *</label>
            <select
              value={projectId} onChange={(e) => setProjectId(e.target.value)} disabled={isEdit}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] focus:outline-none focus:border-brand disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {/* Nom */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">Nom *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="ex. Marie Dupont"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] focus:outline-none focus:border-brand" />
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">Rôle</label>
            <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="ex. Lead Dev"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] focus:outline-none focus:border-brand" />
          </div>

          {/* Salaire → TJM */}
          <div>
            <label className="block text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">Salaire annuel brut (€)</label>
            <input type="number" min="0" value={salaire} onChange={(e) => handleSalaire(e.target.value)} placeholder="ex. 65 000"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] focus:outline-none focus:border-brand" />
            {salaire && parseFloat(salaire) > 0 && (
              <div className="mt-1.5 text-[11px] text-muted-foreground">
                TJM calculé : <span className="text-brand font-medium">{Math.round(parseFloat(salaire) / 218)} €</span>
                <span className="ml-1 opacity-50">(salaire ÷ 218 jours ouvrés)</span>
              </div>
            )}
          </div>

          {/* TJM / Jours */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">TJM (€)</label>
              <input type="number" min="0" value={tjm} onChange={(e) => setTjm(e.target.value)} placeholder="700"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">Jours budget</label>
              <input type="number" min="0" value={daysBudget} onChange={(e) => setDaysBudget(e.target.value)} placeholder="20"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] focus:outline-none focus:border-brand" />
            </div>
            <div>
              <label className="block text-[11px] uppercase tracking-[0.12em] text-muted-foreground mb-1.5">Jours réel</label>
              <input type="number" min="0" value={daysActual} onChange={(e) => setDaysActual(e.target.value)} placeholder="12"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-[13px] focus:outline-none focus:border-brand" />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 rounded-full border border-white/10 py-2.5 text-[13px] text-muted-foreground hover:bg-white/5">Annuler</button>
            <button type="submit" className="flex-1 rounded-full bg-gradient-ai py-2.5 text-[13px] font-medium text-[#0a0b10]">
              {isEdit ? 'Enregistrer' : 'Affecter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
