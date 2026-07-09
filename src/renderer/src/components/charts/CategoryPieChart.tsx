import { useState } from 'react'
import { PieChart, Pie, Cell, Sector, Tooltip, ResponsiveContainer } from 'recharts'

interface PieData {
  name: string
  value: number
  color: string
}

interface CategoryPieChartProps {
  data: PieData[]
  currency?: string
  onActiveColorChange?: (color: string | null) => void
}

function formatAmount(v: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v)
}

function ActiveShape(props: {
  cx: number; cy: number; innerRadius: number; outerRadius: number
  startAngle: number; endAngle: number; fill: string; payload: PieData; value: number
}) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props
  const id = `glow-${fill.replace('#', '')}`
  return (
    <g>
      <defs>
        <filter id={id} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feColorMatrix in="blur" type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius - 3}
        outerRadius={outerRadius + 8}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        filter={`url(#${id})`}
      />
    </g>
  )
}

export default function CategoryPieChart({ data, currency = 'EUR', onActiveColorChange }: CategoryPieChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  function setActive(index: number | null) {
    setActiveIndex(index)
    onActiveColorChange?.(index !== null ? data[index]?.color ?? null : null)
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
        Aucune donnée à afficher
      </div>
    )
  }

  const total = data.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex gap-4 items-center">
      <div className="flex-shrink-0" style={{ width: 180, height: 180 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
              activeIndex={activeIndex ?? undefined}
              activeShape={ActiveShape as never}
              onMouseEnter={(_, index) => setActive(index)}
              onMouseLeave={() => setActive(null)}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [formatAmount(value, currency)]}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.1)',
                backgroundColor: '#1a1a1a',
                color: '#ffffff',
                fontSize: 12,
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              itemStyle={{ color: '#ffffff' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex-1 space-y-2 min-w-0">
        {data.map((entry, index) => {
          const pct = total > 0 ? ((entry.value / total) * 100).toFixed(1) : '0'
          const isActive = activeIndex === index
          return (
            <div
              key={entry.name}
              className="flex items-center gap-2 text-sm rounded-md px-1 py-0.5 cursor-default transition-all"
              style={{ transition: 'background 0.15s' }}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0 transition-all"
                style={{
                  backgroundColor: entry.color,
                  boxShadow: isActive ? `0 0 8px ${entry.color}cc, 0 0 16px ${entry.color}66` : 'none',
                  transform: isActive ? 'scale(1.3)' : 'scale(1)'
                }}
              />
              <span
                className="truncate flex-1 transition-colors"
                style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)' }}
              >{entry.name}</span>
              <span
                className="text-xs transition-colors"
                style={{ color: isActive ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.35)' }}
              >{pct}%</span>
              <span
                className="font-medium text-xs tabular-nums transition-all"
                style={{
                  color: isActive ? entry.color : '#ffffff',
                  textShadow: isActive ? `0 0 10px ${entry.color}88` : 'none'
                }}
              >
                {formatAmount(entry.value, currency)}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
