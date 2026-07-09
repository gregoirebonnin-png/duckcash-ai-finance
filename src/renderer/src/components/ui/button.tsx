import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-xl text-sm font-bold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: '',
        destructive: 'text-white',
        outline: 'text-foreground hover:text-foreground',
        secondary: 'text-foreground hover:opacity-80',
        ghost: 'text-foreground',
        link: 'underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

const variantStyles: Record<string, React.CSSProperties> = {
  default: {
    background: '#00d9ff',
    color: '#040d10',
    boxShadow: '0 0 20px rgba(0,217,255,0.3)',
  },
  destructive: {
    background: '#ff4757',
    color: '#ffffff',
    boxShadow: '0 0 16px rgba(255,71,87,0.3)',
  },
  outline: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.12)',
  },
  secondary: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  ghost: { background: 'transparent' },
  link: { background: 'transparent', color: '#00d9ff' },
}

const hoverStyles: Record<string, Partial<React.CSSProperties>> = {
  default: {
    background: '#33e3ff',
    boxShadow: '0 0 30px rgba(0,217,255,0.45)',
  },
  destructive: {
    background: '#ff6b7a',
    boxShadow: '0 0 24px rgba(255,71,87,0.45)',
  },
  outline: { background: 'rgba(255,255,255,0.07)' },
  ghost: { background: 'rgba(255,255,255,0.06)' },
}

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size, style, onMouseEnter, onMouseLeave, ...props }, ref) => {
    const baseStyle = variantStyles[variant || 'default'] || variantStyles.default
    const hover = hoverStyles[variant || 'default']

    function handleMouseEnter(e: React.MouseEvent<HTMLButtonElement>) {
      if (hover) Object.assign(e.currentTarget.style, hover)
      if (onMouseEnter) onMouseEnter(e)
    }
    function handleMouseLeave(e: React.MouseEvent<HTMLButtonElement>) {
      if (hover) Object.assign(e.currentTarget.style, baseStyle)
      if (onMouseLeave) onMouseLeave(e)
    }

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        style={{ ...baseStyle, ...style }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
