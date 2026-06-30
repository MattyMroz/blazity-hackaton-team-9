# Project AI Instructions

## What this repo is

`blazity-hackaton` — the Blazity "AI for Content" hackathon project (2026-06-30).
The product is **BrandLint**: an AI content QA / brand-voice reviewer. A user
supplies their Anthropic key, brand guidelines, and a draft; the app returns a
structured report (score, issues, an improved rewrite, a publish checklist). The
AI is a **reviewer, not a generator**. A working MVP is shipped. See `.ai/memory/`
(`product.md`, `architecture.md`, `stack.md`, `lessons.md`) for stable context.

## Structure

- `app/`, `lib/` — the BrandLint Next.js app (UI, schema, the Anthropic call).
- `.ai/` — Atlas AI workspace. `.ai/config.json` is the source of truth for
  artifact locations (memory, vocabulary, plans, research, decisions, results).
- `AGENTS.md` / `CLAUDE.md` — agent instructions; `CLAUDE.md` imports this file.
- `.agents/`, `.claude/`, `.cursor/` — generated agent surfaces.

## Working rules

- **Stack:** Next.js 15 (static export, `output: 'export'`) + React 19 + TS +
  Tailwind v4; Claude via `@anthropic-ai/sdk` + Zod. Default model
  `claude-opus-4-8` (`MODEL` in `lib/analyzeContent.ts` is the source of truth).
  Details in `.ai/memory/stack.md`.
- **Static + BYOK, no backend.** There is no server or API route; the Claude call
  runs in the browser with the user's own key (`dangerouslyAllowBrowser`). Don't
  add a server-side key path unless the hosting model changes — it's a deliberate
  tradeoff recorded in `.ai/decisions/adrs/0001-static-byok-architecture.md`.
- **The Anthropic SDK is isolated to `lib/analyzeContent.ts`**; the Zod schema in
  `lib/schema.ts` is the report contract.
- **Use the latest Claude models + structured output.** Consult the `claude-api`
  skill before changing SDK code rather than relying on memory.
- Safe commands: `npm install`, `npm run dev|build|lint`, and
  `npx --yes @blazity-atlas/core@latest doctor`. Deploys trigger on push to
  `main`/`master`/`brandlint` (GitHub Pages) — treat pushing as approval-gated.
- Do not edit the `<!-- BEGIN/END ATLAS -->` managed block below by hand.
- Keep durable docs depersonalized (see Atlas Documentation Rules below).

<!-- BEGIN ATLAS: artifact-paths -->
## Atlas Artifact Paths

`.ai/config.json` is the source of truth for AI artifact locations in this repository.
Before writing plans, research, decisions, ADRs, results, memory, vocabulary, or skill outputs, resolve the destination through `artifactRoot`, `paths`, and `pathAliases`.
If an imported skill, template, or instruction mentions a different path, map it through `.ai/config.json` before reading or writing files.
Do not create new documentation roots unless `.ai/config.json` explicitly allows them.

## Atlas Documentation Rules

Durable documentation records needs, decisions, and reasons — never individuals or internal process.
Write "memory was needed to persist context across runs", not "<name> wanted memory".
Keep personal names, private schedules, internal-only references, and absolute local paths out of workspace artifacts.
<!-- END ATLAS: artifact-paths -->
