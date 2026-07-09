import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: '',
        secondary: '',
        destructive: '',
        outline: '',
        success: '',
        warning: ''
      }
    },
    defaultVariants: { variant: 'default' }
  }
)

const variantStyles: Record<string, React.CSSProperties> = {
  default: { backgroundColor: 'rgba(99,102,241,0.2)', color: '#818cf8' },
  secondary: { backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' },
  destructive: { backgroundColor: 'rgba(244,63,94,0.2)', color: '#fb7185' },
  outline: { border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' },
  success: { backgroundColor: 'rgba(34,197,94,0.2)', color: '#4ade80' },
  warning: { backgroundColor: 'rgba(245,158,11,0.2)', color: '#fbbf24' }
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant = 'default', style, ...props }: BadgeProps) {
  const vs = variantStyles[variant || 'default'] || variantStyles.default
  return (
    <div
      className={cn(badgeVariants({ variant }), className)}
      style={{ ...vs, ...style }}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
