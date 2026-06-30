'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/cn'

// Ported 1:1 from MangaShiftWebsite (shared/ui/Button/Button.tsx).
// Only change: dropped radix Slot / `asChild` (not needed here), so no radix dep.
const buttonVariants = cva(
  "group relative inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius)] font-medium tracking-tight outline-none btn-press transition-[color,background-color,border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04] disabled:pointer-events-none disabled:opacity-50 disabled:hover:scale-100 focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.2em]",
  {
    variants: {
      variant: {
        default: 'bg-[var(--btn-bg)] border border-[var(--btn-border)] text-foreground hover:bg-[var(--btn-hover)]',
        accent: 'bg-[var(--accent)] text-[var(--accent-fg)] shadow-[0_12px_30px_-16px_var(--accent)] hover:brightness-110',
        primary: 'bg-[var(--text)] text-[var(--bg)] hover:brightness-110',
        destructive: 'bg-[var(--destructive)] text-white hover:brightness-110',
        outline: 'bg-transparent border border-[var(--line-strong)] text-foreground hover:border-[var(--text)]',
        secondary: 'bg-[var(--surface)] border border-[var(--line)] text-foreground hover:bg-[var(--surface-2)]',
        ghost: 'text-foreground hover:bg-[var(--overlay-hover)]',
        link: 'rounded-none text-[var(--accent-text)] underline-offset-4 hover:underline',
      },
      size: {
        xs: 'px-2.5 py-1 text-[length:var(--tiny-font-size)]',
        sm: 'px-4 py-2 text-[length:var(--small-font-size)]',
        default: 'px-6 py-3 text-[length:var(--normal-font-size)]',
        lg: 'px-8 py-3.5 md:px-10 md:py-4 text-[length:var(--h3-font-size)]',
        pill: 'rounded-full px-8 py-3.5 md:px-10 md:py-4 text-[length:var(--h3-font-size)]',
        'pill-sm': 'rounded-full px-6 py-2.5 text-[length:var(--small-font-size)]',
        icon: 'size-11',
        'icon-xs': 'size-7',
        'icon-sm': 'size-9',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

type ButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button
      data-slot="button"
      data-variant={variant ?? 'default'}
      data-size={size ?? 'default'}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
