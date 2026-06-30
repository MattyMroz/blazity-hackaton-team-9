'use client'

import { useEffect, useState } from 'react'

// Claude-Code-style "model is thinking" indicator: cycling status lines,
// a pulsing orb and bouncing dots while we wait on the API.
const STEPS = [
  'Czytam wytyczne marki…',
  'Dopasowuję normy platformy…',
  'Analizuję ton głosu…',
  'Wyłapuję słowa-wydmuszki…',
  'Szukam problemów…',
  'Oceniam wpływ na post…',
  'Sprawdzam zgodność z marką…',
  'Piszę wersję on-brand…',
  'Składam listę kontrolną…',
  'Domykam raport…',
]

export function ThinkingLoader() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((p) => (p + 1) % STEPS.length), 1600)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="section-card animate-fade-in flex items-center gap-4 rounded-[2rem] p-7" role="status" aria-live="polite">
      <span className="thinking-orb" aria-hidden />
      <div className="min-w-0">
        <span className="eyebrow">BrandLint myśli</span>
        <p key={i} className="thinking-text mt-1 text-[1.6rem] text-ink">
          {STEPS[i]}
        </p>
      </div>
      <span className="thinking-dots ml-auto" aria-hidden>
        <i />
        <i />
        <i />
      </span>
    </div>
  )
}
