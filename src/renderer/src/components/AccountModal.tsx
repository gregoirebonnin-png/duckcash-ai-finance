import { useState, useRef, useCallback } from 'react'
import { X, Camera, Check, Trash2 } from 'lucide-react'
import { useUserStore, AVATAR_COLORS } from '../stores/user'

interface Props {
  onClose: () => void
}

export default function AccountModal({ onClose }: Props) {
  const { profile, updateProfile } = useUserStore()

  const [name, setName] = useState(profile.name)
  const [email, setEmail] = useState(profile.email)
  const [role, setRole] = useState(profile.role)
  const [avatarColor, setAvatarColor] = useState(profile.avatarColor)
  const [avatarDataUrl, setAvatarDataUrl] = useState<string | null>(profile.avatarDataUrl)
  const [saved, setSaved] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

  function handleSave() {
    updateProfile({ name, email, role, avatarColor, avatarDataUrl })
    setSaved(true)
    setTimeout(() => { setSaved(false); onClose() }, 900)
  }

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setAvatarDataUrl(ev.target?.result as string)
    reader.readAsDataURL(file)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/[0.1] shadow-2xl"
        style={{ background: 'var(--card)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-4">
          <h2 className="text-[15px] font-semibold">Paramètres du compte</h2>
          <button
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Avatar section */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <div
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full text-[22px] font-bold text-white shadow-lg"
                style={{ background: avatarDataUrl ? 'transparent' : avatarColor }}
              >
                {avatarDataUrl
                  ? <img src={avatarDataUrl} alt="avatar" className="h-full w-full object-cover" />
                  : initials}
              </div>
              <button
                onClick={() => fileRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full border border-white/[0.15] bg-[#1a1b22] text-muted-foreground transition-colors hover:text-foreground"
              >
                <Camera className="h-3 w-3" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>

            <div className="flex-1 space-y-2">
              <p className="text-[12px] text-muted-foreground">Couleur de l'avatar</p>
              <div className="flex gap-2">
                {AVATAR_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setAvatarColor(c)}
                    className="h-6 w-6 rounded-full transition-transform hover:scale-110"
                    style={{ background: c, outline: avatarColor === c ? `2px solid ${c}` : 'none', outlineOffset: 2 }}
                  />
                ))}
              </div>
              {avatarDataUrl && (
                <button
                  onClick={() => setAvatarDataUrl(null)}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground transition-colors hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" /> Supprimer la photo
                </button>
              )}
            </div>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Nom complet</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-white/[0.2] placeholder:text-muted-foreground/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Adresse e-mail</label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="vous@exemple.com"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-white/[0.2] placeholder:text-muted-foreground/50"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[12px] font-medium text-muted-foreground">Rôle / titre</label>
              <input
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Ex : Directeur de compte, Chef de projet…"
                className="w-full rounded-xl border border-white/[0.08] bg-white/[0.03] px-3.5 py-2.5 text-[14px] outline-none transition-colors focus:border-white/[0.2] placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-white/[0.08] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl border border-white/[0.08] px-4 py-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            disabled={!name.trim()}
            className="flex items-center gap-2 rounded-xl px-5 py-2 text-[13px] font-medium text-white transition-all disabled:opacity-40"
            style={{ background: saved ? '#10b981' : 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
          >
            {saved ? <><Check className="h-3.5 w-3.5" /> Enregistré</> : 'Sauvegarder'}
          </button>
        </div>
      </div>
    </div>
  )
}
