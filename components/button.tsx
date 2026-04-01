'use client'

import { type ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-accent text-parchment hover:opacity-90 active:opacity-80',
  secondary:
    'border border-accent/50 text-accent bg-transparent hover:bg-accent/10 active:bg-accent/15',
  ghost:
    'text-ink-muted hover:text-ink active:text-ink',
  danger:
    'text-red-900/50 hover:text-red-900 active:text-red-900',
}

const sizes: Record<Size, string> = {
  sm: 'px-4 py-1.5 text-xs tracking-wide',
  md: 'px-6 py-2.5 text-sm tracking-wide',
  lg: 'px-6 py-3.5 text-sm tracking-widest',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  ...props
}: Props) {
  return (
    <button
      className={[
        'rounded-lg font-medium transition-all duration-300',
        'cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    >
      {children}
    </button>
  )
}
