interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-8 py-6"
      style={{ backgroundColor: '#000000', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
        {subtitle && <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
