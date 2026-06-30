'use client'

import { useEffect, useState } from 'react'
import { analyzeContent, MODELS, DEFAULT_MODEL, type ModelId } from '@/lib/analyzeContent'
import type { Report } from '@/lib/schema'
import { Button } from '@/components/Button'
import { SlidingSelect } from '@/components/SlidingSelect'

const KEY_STORAGE = 'brandlint.apiKey'

const SAMPLE_GUIDELINES = `Marka: Northwind.
Ton głosu: pewny, ciepły, prosty. Brzmimy jak dobrze poinformowany znajomy, nigdy jak sprzedawca.
Zasady:
- Bez WERSALIKÓW, maksymalnie jeden wykrzyknik na wiadomość.
- Bez słów-wydmuszek („rewelacyjny”, „rewolucyjny”, „przełomowy”).
- Zawsze zaczynaj od korzyści dla klienta, nie od funkcji.
- Język włączający, bez żargonu.`

const SAMPLE_DRAFT = `HEJ!!! Nasz REWELACYJNY nowy panel to absolutny przełom!!!
Ma TYLE funkcji, że nie uwierzysz. Zapisz się teraz albo przegapisz na zawsze!!!`

// 0-10 impact scale → colour + label (high impact hurts the post most).
function impactStyle(score: number): string {
  if (score >= 7) return 'bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] text-brand-dark ring-[color-mix(in_srgb,var(--accent)_32%,transparent)]'
  if (score >= 4) return 'bg-[color-mix(in_srgb,var(--color-gold)_16%,transparent)] text-[#8a6a23] ring-[color-mix(in_srgb,var(--color-gold)_32%,transparent)]'
  return 'bg-surface-2 text-faint ring-line'
}

function impactLabel(score: number): string {
  if (score >= 7) return 'duży wpływ'
  if (score >= 4) return 'średni wpływ'
  return 'mały wpływ'
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
    if (status === 429) return 'Limit zapytań (429). Odczekaj chwilę i spróbuj ponownie.'
    if (status === 400) return 'Błędne żądanie (400). Spróbuj skrócić treść.'
  }
  if (e instanceof Error) return e.message
  return 'Coś poszło nie tak.'
}

export default function Page() {
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState<ModelId>(DEFAULT_MODEL)
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
    if (loading) return
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
        model,
        guidelines:
          guidelines.trim() ||
          'Brak jawnych wytycznych marki. Zastosuj ogólne dobre praktyki dla jasnej, profesjonalnej treści.',
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
    <main className="mx-auto w-full max-w-[88rem] px-4 pb-24 pt-8 sm:px-6 sm:pt-14">
      {/* pasek górny */}
      <div className="flex items-center justify-between gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/logo.png`}
          alt="BrandLint — AI brand compliance"
          className="h-16 w-auto sm:h-24"
        />
        <SlidingSelect
          ariaLabel="Model Claude"
          value={model}
          onValueChange={(v) => setModel(v as ModelId)}
          items={MODELS.map((m) => ({
            value: m.id,
            label: (
              <span>
                <span className="font-semibold text-[var(--text)]">{m.label}</span>{' '}
                <span className="text-[var(--text-faint)]">· {m.note}</span>
              </span>
            ),
          }))}
        />
      </div>

      {/* hero */}
      <header className="mt-14 sm:mt-20">
        <span className="section-kicker">AI · Zgodność z marką</span>
        <h1 className="display display-dot mt-5 text-[clamp(3.2rem,8vw,6.4rem)]">
          Sprawdź, czy treść jest <em className="text-brand">on&#8209;brand</em>
        </h1>
        <p className="mt-5 max-w-[46rem] text-pretty text-[1.7rem] leading-relaxed text-muted">
          Wytyczne marki plus szkic. W kilka sekund dostajesz ocenę, problemy i gotową poprawkę.
        </p>
      </header>

      {/* formularz */}
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
          Klucz zostaje tylko w Twojej przeglądarce i leci wprost do Anthropic. Nie trafia do repo ani na serwer.
        </p>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <div>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label className="eyebrow">Wytyczne marki</label>
              <Button
                type="button"
                onClick={loadSample}
                variant="link"
                size="xs"
                className="font-mono text-[1.05rem] font-semibold uppercase tracking-wider text-brand"
              >
                Wstaw przykład
              </Button>
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
                placeholder="Wklej post, e-mail lub opis produktu..."
                className="min-h-40 w-full resize-y text-[1.4rem] leading-relaxed text-ink placeholder:text-faint"
              />
            </div>
          </div>
        </div>

        <div className="mt-7 flex flex-col items-stretch gap-4 sm:flex-row sm:items-center">
          <Button
            type="button"
            onClick={onAnalyze}
            disabled={loading}
            variant="accent"
            size="pill"
            className="w-full font-semibold sm:w-auto"
          >
            {loading ? 'Analizuję…' : 'Analizuj treść'}
          </Button>
          {error && <span className="text-[1.35rem] font-medium text-brand-dark">{error}</span>}
        </div>
      </section>

      {report && (
        <section className="mt-10 space-y-6">
          {/* ocena */}
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
            {/* problemy */}
            <div className="section-card animate-slide-up stagger-1 rounded-[2rem] p-7">
              <div className="mb-4 flex items-center gap-3">
                <span className="eyebrow">Problemy</span>
                <span className="ring-no h-7 w-7 text-[1.1rem]">{report.issues.length}</span>
              </div>
              {report.issues.length === 0 ? (
                <p className="text-[1.45rem] text-emerald-600">Brak problemów, treść jest zgodna z marką. 🎉</p>
              ) : (
                <ul className="space-y-3">
                  {[...report.issues]
                    .sort((a, b) => b.impact_score - a.impact_score)
                    .map((issue, i) => (
                    <li key={i} className="rounded-2xl border border-line bg-surface-2/50 p-4">
                      <div className="flex items-center gap-2.5">
                        <span
                          title={`Wpływ na post: ${issue.impact_score}/10`}
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[1rem] font-semibold uppercase tracking-wider ring-1 ${impactStyle(issue.impact_score)}`}
                        >
                          <span className="tabular-nums">{issue.impact_score}/10</span>
                          <span className="opacity-70">· {impactLabel(issue.impact_score)}</span>
                        </span>
                        <span className="font-display text-[1.5rem] font-bold">{issue.title}</span>
                      </div>
                      <p className="mt-2 text-[1.4rem] leading-relaxed text-muted">{issue.detail}</p>
                      <p className="mt-1.5 text-[1.4rem] leading-relaxed text-ink">
                        <span className="font-mono text-[1.05rem] font-semibold uppercase tracking-wider text-emerald-700">Poprawka</span>{' '}
                        {issue.suggestion}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* lista kontrolna */}
            <div className="section-card animate-slide-up stagger-2 rounded-[2rem] p-7">
              <span className="eyebrow">Lista kontrolna przed publikacją</span>
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

          {/* wersja zgodna z marką */}
          <div className="paper-frame animate-slide-up stagger-3 p-7 sm:p-9">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="section-kicker">Wersja zgodna z marką</span>
              <Button type="button" onClick={copyImproved} variant="secondary" size="sm" className="text-[1.3rem] font-semibold">
                {copied ? 'Skopiowano ✓' : 'Kopiuj'}
              </Button>
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
