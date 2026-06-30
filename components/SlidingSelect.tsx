'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { Select as SelectPrimitive } from 'radix-ui'

import { cn } from '@/lib/cn'

// Ported from MangaShiftWebsite (shared/ui/lib/SlidingSelect.tsx).
// Only changes: cn import path, and font/icon sizes tuned to our 10px rem scale.
export interface SlidingSelectItem {
  value: string
  label: ReactNode
  endLabel?: ReactNode
  disabled?: boolean
}

interface SlidingSelectProps {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  items: SlidingSelectItem[]
  placeholder?: string
  triggerClassName?: string
  triggerEndAdornment?: ReactNode
  contentClassName?: string
  disabled?: boolean
  ariaLabel?: string
}

export function SlidingSelect({
  value,
  defaultValue,
  onValueChange,
  items,
  placeholder,
  triggerClassName,
  triggerEndAdornment,
  contentClassName,
  disabled,
  ariaLabel,
}: SlidingSelectProps) {
  return (
    <SelectPrimitive.Root value={value} defaultValue={defaultValue} onValueChange={onValueChange} disabled={disabled}>
      <SelectPrimitive.Trigger
        aria-label={ariaLabel}
        className={cn(
          'flex w-fit items-center justify-between gap-2 rounded-full border border-[var(--btn-border)] bg-[var(--btn-bg)] py-1.5 pl-4 pr-3 font-mono text-[1.15rem] whitespace-nowrap text-[var(--text-muted)] transition-[color,box-shadow,background,border-color] duration-150 outline-none hover:bg-[var(--btn-hover)] focus-visible:border-[var(--accent-border)] focus-visible:ring-[3px] focus-visible:ring-[color-mix(in_srgb,var(--accent)_30%,transparent)] disabled:cursor-not-allowed disabled:opacity-40 data-[placeholder]:text-muted-foreground cursor-pointer',
          triggerClassName,
        )}
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        {triggerEndAdornment}
        <SelectPrimitive.Icon asChild>
          <ChevronDownIcon className="size-[1.4rem] opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          position="item-aligned"
          className={cn(
            'relative z-50 max-h-(--radix-select-content-available-height) min-w-[14rem] overflow-x-hidden overflow-y-auto rounded-xl border border-[var(--glass-border)] bg-[var(--glass-bg)] text-foreground shadow-lg backdrop-blur-xl',
            contentClassName,
          )}
          style={{ marginTop: '-1px', marginBottom: '-1px' }}
        >
          <SlidingSelectViewport items={items} />
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
}

interface ViewportProps {
  items: SlidingSelectItem[]
}

function SlidingSelectViewport({ items }: ViewportProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const [pill, setPill] = useState({ x: 0, y: 0, w: 0, h: 0, visible: false, animated: false })

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const pickTarget = (): HTMLElement | null => {
      return (
        viewport.querySelector<HTMLElement>('[data-highlighted]') ??
        viewport.querySelector<HTMLElement>('[data-state="checked"]')
      )
    }

    const update = () => {
      const target = pickTarget()
      if (!target) {
        setPill((p) => ({ ...p, visible: false, animated: false }))
        return
      }
      setPill((prev) => ({
        x: target.offsetLeft,
        y: target.offsetTop,
        w: target.offsetWidth,
        h: target.offsetHeight,
        visible: true,
        animated: prev.visible,
      }))
    }

    const observer = new MutationObserver(update)
    observer.observe(viewport, {
      attributes: true,
      attributeFilter: ['data-highlighted', 'data-state'],
      subtree: true,
    })

    requestAnimationFrame(update)

    return () => observer.disconnect()
  }, [items.length])

  return (
    <SelectPrimitive.Viewport ref={viewportRef} className="relative w-full p-1.5">
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 rounded-lg"
        style={{
          transform: `translate(${pill.x}px, ${pill.y}px)`,
          width: pill.w,
          height: pill.h,
          opacity: pill.visible ? 1 : 0,
          background: 'var(--accent-subtle)',
          transition: pill.animated
            ? 'transform 180ms cubic-bezier(0.4, 0, 0.2, 1), width 180ms cubic-bezier(0.4, 0, 0.2, 1), height 180ms cubic-bezier(0.4, 0, 0.2, 1), opacity 120ms ease-out'
            : 'opacity 120ms ease-out',
        }}
      />
      {items.map((item) => (
        <SelectPrimitive.Item
          key={item.value}
          value={item.value}
          disabled={item.disabled}
          className={cn(
            'relative z-[1] flex w-full cursor-pointer select-none items-center gap-2 rounded-lg py-2 pl-3 pr-9 font-mono text-[1.35rem] outline-none',
            'focus:bg-transparent data-[highlighted]:bg-transparent',
            'data-[disabled]:pointer-events-none data-[disabled]:opacity-40',
          )}
        >
          <span className="absolute right-2.5 flex size-[1.6rem] items-center justify-center text-[var(--accent)]">
            <SelectPrimitive.ItemIndicator>
              <CheckIcon className="size-[1.6rem]" />
            </SelectPrimitive.ItemIndicator>
          </span>
          <SelectPrimitive.ItemText>
            <span className="-mt-px inline-block">{item.label}</span>
          </SelectPrimitive.ItemText>
          {item.endLabel ? <span className="ml-auto pr-6 text-[var(--text-faint)]">{item.endLabel}</span> : null}
        </SelectPrimitive.Item>
      ))}
    </SelectPrimitive.Viewport>
  )
}
