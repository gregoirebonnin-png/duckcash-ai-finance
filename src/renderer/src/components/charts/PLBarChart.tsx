import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface PLBarChartData {
  name: string
  revenues: number
  costs: number
}

interface PLBarChartProps {
  data: PLBarChartData[]
  currency?: string
}

function shortAmount(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(0)}k €`
  return `${v} €`
}

function tooltipAmount(v: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency, maximumFractionDigits: 0 }).format(v)
}

export default function PLBarChart({ data, currency = 'EUR' }: PLBarChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-sm" style={{ color: 'rgba(255,255,255,0.25)' }}>
        Aucune donnée à afficher
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }} barCategoryGap="30%">
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.35)' }} axisLine={false} tickLine={false} />
        <YAxis
          tickFormatter={shortAmount}
          tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.35)' }}
          axisLine={false}
          tickLine={false}
          width={55}
        />
        <Tooltip
          cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 4 }}
          formatter={(value: number) => [tooltipAmount(value, currency)]}
          contentStyle={{
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.1)',
            backgroundColor: '#1a1a1a',
            color: '#ffffff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
          }}
          labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
          itemStyle={{ color: '#ffffff' }}
        />
        <Legend wrapperStyle={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }} />
        <Bar dataKey="revenues" name="Revenus" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="costs" name="Coûts" fill="#f43f5e" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
