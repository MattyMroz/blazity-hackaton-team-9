'use client'

import { useEffect, useState } from 'react'
import { analyzeContent, MODEL } from '@/lib/analyzeContent'
import type { Issue, Report } from '@/lib/schema'

const KEY_STORAGE = 'brandlint.apiKey'

const SAMPLE_GUIDELINES = `Brand: Northwind.
Voice: confident, warm, plain-spoken. We sound like a knowledgeable friend, never a salesperson.
Rules:
- No ALL CAPS, no more than one exclamation mark per message.
- No hype words ("amazing", "revolutionary", "game-changer").
- Always lead with the customer benefit, not the feature.
- British English spelling. Inclusive, jargon-free language.`

const SAMPLE_DRAFT = `HEY!!! Our AMAZING new dashboard is a total game-changer!!!
It has SO many features you won't believe it. Sign up now or miss out forever!!!`

const severityStyle: Record<Issue['severity'], string> = {
  high: 'bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-brand-dark ring-[color-mix(in_srgb,var(--accent)_30%,transparent)]',
  medium: 'bg-[color-mix(in_srgb,var(--color-gold)_16%,transparent)] text-[#8a6a23] ring-[color-mix(in_srgb,var(--color-gold)_32%,transparent)]',
  low: 'bg-surface-2 text-faint ring-line',
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-gold'
  return 'text-brand'
}

function humanError(e: unknown): string {
  if (e && typeof e === 'object' && 'status' in e) {
    const status = (e as { status?: number }).status
    if (status === 401) return 'Nieprawidłowy klucz API (401). Sprawdź sk-ant-...'
    if (status === 429) return 'Limit zapytań (429) — odczekaj chwilę i spróbuj ponownie.'
    if (status === 400) return 'Błędne żądanie (400). Spróbuj skrócić treść.'
  }
  if (e instanceof Error) return e.message
  return 'Coś poszło nie tak.'
}

export default function Page() {
  const [apiKey, setApiKey] = useState('')
  const [guidelines, setGuidelines] = useState('')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<Report | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(KEY_STORAGE)
    if (saved) setApiKey(saved)
  }, [])

  function onKeyChange(value: string) {
    setApiKey(value)
    localStorage.setItem(KEY_STORAGE, value)
  }

  function loadSample() {
    setGuidelines(SAMPLE_GUIDELINES)
    setDraft(SAMPLE_DRAFT)
  }

  async function onAnalyze() {
    setError(null)
    setReport(null)
    if (!apiKey.trim()) {
      setError('Wklej swój klucz Anthropic (sk-ant-...) powyżej.')
      return
    }
    if (!draft.trim()) {
      setError('Wklej treść do sprawdzenia.')
      return
    }
    setLoading(true)
    try {
      const result = await analyzeContent({
        apiKey: apiKey.trim(),
        guidelines:
          guidelines.trim() ||
          'No explicit brand guidelines provided — apply general best practices for clear, professional, on-brand content.',
        draft: draft.trim(),
      })
      setReport(result)
    } catch (e) {
      setError(humanError(e))
    } finally {
      setLoading(false)
    }
  }

  async function copyImproved() {
    if (!report) return
    await navigator.clipboard.writeText(report.improved_version)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <main className="mx-auto max-w-5xl px-5 pb-24 pt-10 sm:pt-14">
      {/* top bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo slot — drop your file at public/logo.svg and swap this span for:
              <img src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/logo.svg`} alt="BrandLint" className="h-9 w-9" /> */}
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand font-display text-sm font-extrabold text-white shadow-sm">
            BL
          </span>
          <span className="font-display text-lg font-extrabold tracking-tight">
            Brand<span className="text-brand">Lint</span>
          </span>
        </div>
        <span className="rounded-full border border-line bg-surface px-3 py-1 font-mono text-[1.05rem] text-muted">
          {MODEL}
        </span>
      </div>

      {/* hero */}
      <header className="mt-14 sm:mt-20">
        <span className="section-kicker">AI · Brand compliance</span>
        <h1 className="display display-dot mt-5 text-[clamp(3.2rem,8vw,6.4rem)]">
          Sprawdź, czy treść jest <em>on&#8209;brand</em>
        </h1>
        <p className="mt-5 max-w-xl text-[1.7rem] leading-relaxed text-muted">
          Wklej wytyczne marki i draft — dostajesz natychmiastowy audyt:
          ocenę, listę problemów, gotową wersję on-brand i checklistę przed publikacją.
        </p>
      </header>

      {/* form */}
      <section className="section-card mt-12 rounded-[2rem] p-6 sm:p-8">
        <label className="eyebrow">Klucz Anthropic API</label>
        <div className="field mt-2 px-4 py-3">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => onKeyChange(e.target.value)}
            placeholder="sk-ant-..."
            autoComplete="off"
            className="w-full font-mono text-[1.4rem] text-ink placeholder:text-faint"
          />
        </div>
        <p className="mt-2 text-[1.25rem] text-faint">
          Klucz zostaje tylko w Twojej przeglądarce (localStorage) i leci wprost do Anthropic — nie do repo ani na serwer.
        </p>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="eyebrow">Brand guidelines</label>
              <button type="button" onClick={loadSample} className="font-mono text-[1.1rem] font-semibold uppercase tracking-wider text-brand hover:text-brand-dark">
                Wstaw przykład
              </button>
            </div>
            <div className="field px-4 py-3">
              <textarea
                value={guidelines}
                onChange={(e) => setGuidelines(e.target.value)}
                placeholder="Ton głosu, zasady, czego unikać..."
                className="min-h-40 w-full resize-y text-[1.4rem] leading-relaxed text-ink placeholder:text-faint"
              />
            </div>
          </div>
          <div>
            <label className="eyebrow mb-2 block">Treść do sprawdzenia</label>
            <div className="field px-4 py-3">
              <textarea
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Wklej post / e-mail / opis produktu..."
                className="min-h-40 w-full resize-y text-[1.4rem] leading-relaxed text-ink placeholder:text-faint"
              />
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={loading}
            className="btn-accent rounded-xl px-7 py-3 text-[1.5rem] font-semibold"
          >
            {loading ? 'Analizuję…' : 'Analizuj treść'}
          </button>
          {error && <span className="text-[1.35rem] font-medium text-brand-dark">{error}</span>}
        </div>
      </section>

      {report && (
        <section className="mt-10 space-y-6">
          {/* score */}
          <div className="section-card animate-slide-up flex flex-col gap-6 rounded-[2rem] p-7 sm:flex-row sm:items-center sm:p-9">
            <div className="flex shrink-0 items-baseline gap-2">
              <span className={`font-display text-[6.4rem] font-extrabold leading-none tabular-nums ${scoreColor(report.score)}`}>
                {report.score}
              </span>
              <span className="font-mono text-[1.2rem] uppercase tracking-widest text-faint">/ 100</span>
            </div>
            <div className="hairline h-px w-full sm:h-16 sm:w-px sm:self-stretch" />
            <p className="text-[1.6rem] leading-relaxed text-ink">{report.summary}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* issues */}
            <div className="section-card animate-slide-up stagger-1 rounded-[2rem] p-7">
              <div className="mb-4 flex items-center gap-3">
                <span className="eyebrow">Problemy</span>
                <span className="ring-no h-7 w-7 text-[1.1rem]">{report.issues.length}</span>
              </div>
              {report.issues.length === 0 ? (
                <p className="text-[1.45rem] text-emerald-600">Brak problemów — treść jest on-brand. 🎉</p>
              ) : (
                <ul className="space-y-3">
                  {report.issues.map((issue, i) => (
                    <li key={i} className="rounded-2xl border border-line bg-surface-2/50 p-4">
                      <div className="flex items-center gap-2.5">
                        <span className={`rounded-full px-2.5 py-0.5 font-mono text-[1rem] font-semibold uppercase tracking-wider ring-1 ${severityStyle[issue.severity]}`}>
                          {issue.severity}
                        </span>
                        <span className="font-display text-[1.5rem] font-bold">{issue.title}</span>
                      </div>
                      <p className="mt-2 text-[1.4rem] leading-relaxed text-muted">{issue.detail}</p>
                      <p className="mt-1.5 text-[1.4rem] leading-relaxed text-ink">
                        <span className="font-mono text-[1.05rem] font-semibold uppercase tracking-wider text-emerald-700">Fix</span>{' '}
                        {issue.suggestion}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* checklist */}
            <div className="section-card animate-slide-up stagger-2 rounded-[2rem] p-7">
              <span className="eyebrow">Checklist przed publikacją</span>
              <ul className="mt-4 space-y-2.5">
                {report.publish_checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-[1.45rem]">
                    <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-[1.2rem] font-bold ${item.passed ? 'bg-emerald-100 text-emerald-700' : 'bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] text-brand-dark'}`}>
                      {item.passed ? '✓' : '✗'}
                    </span>
                    <span className={item.passed ? 'text-muted' : 'text-ink'}>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* improved version */}
          <div className="paper-frame animate-slide-up stagger-3 p-7 sm:p-9">
            <div className="mb-4 flex items-center justify-between">
              <span className="section-kicker">Wersja on-brand</span>
              <button type="button" onClick={copyImproved} className="btn-surface rounded-xl px-4 py-2 text-[1.3rem] font-semibold">
                {copied ? 'Skopiowano ✓' : 'Kopiuj'}
              </button>
            </div>
            <p className="whitespace-pre-wrap text-[1.6rem] leading-relaxed text-ink">{report.improved_version}</p>
          </div>
        </section>
      )}

      <footer className="mt-20 border-t border-line pt-6 text-center font-mono text-[1.1rem] uppercase tracking-widest text-faint">
        BrandLint · Next.js · Tailwind · Anthropic SDK · Zod
      </footer>
    </main>
  )
}
