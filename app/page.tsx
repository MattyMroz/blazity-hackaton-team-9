'use client'

import { useEffect, useState } from 'react'
import { analyzeContent, MODELS, DEFAULT_MODEL, type ModelId } from '@/lib/analyzeContent'
import { CONTENT_CATEGORIES, type CategoryId } from '@/lib/categories'
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
  high: 'bg-red-100 text-red-700 ring-red-200',
  medium: 'bg-amber-100 text-amber-700 ring-amber-200',
  low: 'bg-stone-100 text-stone-600 ring-stone-200',
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600'
  if (score >= 60) return 'text-amber-600'
  return 'text-red-600'
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
  const [model, setModel] = useState<ModelId>(DEFAULT_MODEL)
  const [category, setCategory] = useState<CategoryId | null>(null)
  const [guidelines, setGuidelines] = useState('')
  const [draft, setDraft] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [report, setReport] = useState<Report | null>(null)
  const [edited, setEdited] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(KEY_STORAGE)
    if (saved) setApiKey(saved)
  }, [])

  // Gdy pojawi się nowy raport, wstaw jego wersję on-brand do edytowalnego pola.
  useEffect(() => {
    if (report) setEdited(report.improved_version)
  }, [report])

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
      const selectedCategory = CONTENT_CATEGORIES.find((c) => c.id === category)
      const result = await analyzeContent({
        apiKey: apiKey.trim(),
        model,
        guidelines:
          guidelines.trim() ||
          'No explicit brand guidelines provided — apply general best practices for clear, professional, on-brand content.',
        draft: draft.trim(),
        categoryContext: selectedCategory?.context,
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
    await navigator.clipboard.writeText(edited)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const isEdited = report !== null && edited !== report.improved_version

  return (
    <main className="mx-auto max-w-5xl px-5 py-10">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Brand<span className="text-brand">Lint</span>
          </h1>
          <p className="mt-1 text-stone-600">
            Wklej wytyczne marki i treść — dostań natychmiastowy audyt zgodności.
          </p>
        </div>
        <div className="relative">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value as ModelId)}
            className="appearance-none rounded-full bg-stone-900 py-1 pl-3 pr-7 text-xs font-medium text-white outline-none cursor-pointer hover:bg-stone-700 transition-colors"
          >
            {MODELS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label} — {m.note}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 text-[10px]">▾</span>
        </div>
      </header>

      <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
        <label className="block text-sm font-medium text-stone-700">Klucz Anthropic API</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => onKeyChange(e.target.value)}
          placeholder="sk-ant-..."
          autoComplete="off"
          className="mt-1.5 w-full rounded-lg border border-stone-300 px-3 py-2 font-mono text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand"
        />
        <p className="mt-1.5 text-xs text-stone-500">
          Klucz zostaje tylko w Twojej przeglądarce (localStorage) i leci wprost do Anthropic. Nie trafia do repo ani na serwer.
        </p>

        <div className="mt-5">
          <p className="mb-2 text-sm font-medium text-stone-700">Kategoria treści <span className="font-normal text-stone-400">(opcjonalna)</span></p>
          <div className="flex flex-wrap gap-2">
            {CONTENT_CATEGORIES.map((cat) => {
              const active = category === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(active ? null : cat.id)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? 'border-stone-900 bg-stone-900 text-white'
                      : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400 hover:bg-stone-50'
                  }`}
                >
                  <span>{cat.emoji}</span>
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-stone-700">Brand guidelines</label>
              <button
                type="button"
                onClick={loadSample}
                className="text-xs font-medium text-brand hover:text-brand-dark"
              >
                Wstaw przykład
              </button>
            </div>
            <textarea
              value={guidelines}
              onChange={(e) => setGuidelines(e.target.value)}
              placeholder="Ton głosu, zasady, czego unikać..."
              className="min-h-40 w-full resize-y rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-stone-700">Treść do sprawdzenia</label>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Wklej post / e-mail / opis produktu..."
              className="min-h-40 w-full resize-y rounded-lg border border-stone-300 px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <button
            type="button"
            onClick={onAnalyze}
            disabled={loading}
            className="rounded-lg bg-brand px-5 py-2.5 font-semibold text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Analizuję…' : 'Analizuj'}
          </button>
          {error && <span className="text-sm font-medium text-red-600">{error}</span>}
        </div>
      </section>

      {report && (
        <section className="mt-8 space-y-6">
          <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
            <div className="flex shrink-0 flex-col items-center">
              <span className={`text-5xl font-bold tabular-nums ${scoreColor(report.score)}`}>
                {report.score}
              </span>
              <span className="text-xs uppercase tracking-wide text-stone-500">/ 100</span>
            </div>
            <p className="text-stone-700">{report.summary}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold">
                Problemy <span className="text-stone-400">({report.issues.length})</span>
              </h2>
              {report.issues.length === 0 ? (
                <p className="text-sm text-emerald-600">Brak problemów — treść jest on-brand. 🎉</p>
              ) : (
                <ul className="space-y-3">
                  {report.issues.map((issue, i) => (
                    <li key={i} className="rounded-lg border border-stone-100 bg-stone-50 p-3">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ring-1 ${severityStyle[issue.severity]}`}
                        >
                          {issue.severity}
                        </span>
                        <span className="font-medium">{issue.title}</span>
                      </div>
                      <p className="mt-1.5 text-sm text-stone-600">{issue.detail}</p>
                      <p className="mt-1 text-sm text-stone-800">
                        <span className="font-medium text-emerald-700">Fix:</span> {issue.suggestion}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
              <h2 className="mb-3 text-lg font-semibold">Checklist przed publikacją</h2>
              {(() => {
                const platformItems = report.publish_checklist.filter((i) => i.platform_check)
                const brandItems = report.publish_checklist.filter((i) => !i.platform_check)
                const CheckItem = ({ item, i }: { item: typeof report.publish_checklist[number]; i: number }) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className={item.passed ? 'text-emerald-600' : 'text-red-500'}>
                      {item.passed ? '✓' : '✗'}
                    </span>
                    <span className={item.passed ? 'text-stone-600' : 'text-stone-800'}>{item.label}</span>
                  </li>
                )
                return (
                  <div className="space-y-4">
                    {platformItems.length > 0 && (
                      <div>
                        <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">Wymagania platformy</p>
                        <ul className="space-y-2">
                          {platformItems.map((item, i) => <CheckItem key={i} item={item} i={i} />)}
                        </ul>
                      </div>
                    )}
                    {brandItems.length > 0 && (
                      <div>
                        {platformItems.length > 0 && (
                          <p className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-stone-400">Zgodność z marką</p>
                        )}
                        <ul className="space-y-2">
                          {brandItems.map((item, i) => <CheckItem key={i} item={item} i={i} />)}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold">Wersja on-brand</h2>
                <span className="text-xs text-stone-400">edytowalna</span>
              </div>
              <div className="flex items-center gap-2">
                {isEdited && (
                  <button
                    type="button"
                    onClick={() => setEdited(report.improved_version)}
                    className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium hover:bg-stone-50"
                  >
                    Przywróć
                  </button>
                )}
                <button
                  type="button"
                  onClick={copyImproved}
                  className="rounded-lg border border-stone-300 px-3 py-1.5 text-sm font-medium hover:bg-stone-50"
                >
                  {copied ? 'Skopiowano ✓' : 'Kopiuj'}
                </button>
              </div>
            </div>
            <textarea
              value={edited}
              onChange={(e) => setEdited(e.target.value)}
              spellCheck={false}
              className="min-h-40 w-full resize-y whitespace-pre-wrap rounded-lg border border-stone-300 px-3 py-2 text-stone-800 outline-none focus-visible:ring-2 focus-visible:ring-brand"
            />
            {isEdited && (
              <p className="mt-1.5 text-xs text-stone-500">Edytujesz wersję wygenerowaną przez model. „Kopiuj" zapisze Twoją wersję.</p>
            )}
          </div>
        </section>
      )}

      <footer className="mt-12 text-center text-xs text-stone-400">
        BrandLint · Next.js + Tailwind + Anthropic SDK + Zod · static (GitHub Pages)
      </footer>
    </main>
  )
}
