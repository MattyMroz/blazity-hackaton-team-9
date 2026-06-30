# Architecture

As built in the BrandLint MVP. Stack: [[stack]]. Decision record:
[[0001-static-byok-architecture]].

## Shape

A **fully static** Next.js app (`output: 'export'`) — no server, no datastore.
All logic, including the Claude call, runs in the browser.

```
Browser (single page)
   ├─ user enters: Anthropic API key, brand guidelines, draft
   ├─ key persisted in localStorage ("brandlint.apiKey")
   └─ analyzeContent() calls api.anthropic.com DIRECTLY from the browser
        (Anthropic SDK, dangerouslyAllowBrowser: true)
   ▼
Claude (forced `report` tool) → tool_use JSON
   ▼
Zod validates (reportSchema.parse) → render report (score, summary,
   issues, improved_version, publish_checklist)
```

## Modules

- `app/page.tsx` — client component: all UI + state, the API-key input
  (localStorage), sample loader, submit, and the rendered report. No SDK import.
- `lib/analyzeContent.ts` — **the only module that imports `@anthropic-ai/sdk`**.
  Holds the system prompt, the `report` tool schema, the model id (`MODEL`), and
  the single `messages.create` call; returns a Zod-validated `Report`.
- `lib/schema.ts` — the Zod contract (`reportSchema`) + inferred types (`Report`,
  `Issue`, `ChecklistItem`). Single source of truth for the report shape.
- `app/layout.tsx` — root layout + metadata. `app/globals.css` — Tailwind import +
  brand theme tokens.
- `next.config.mjs` — static export, `basePath`/`assetPrefix` for GitHub Pages.
- `.github/workflows/deploy.yml` — build (`next build` → `out/`) and Pages deploy.

## Invariants (as built)

- **No server.** Static export only; there is no API route. Any feature needing a
  secret kept off the client requires changing the hosting model (see the ADR).
- **The SDK is isolated to `lib/analyzeContent.ts`.** No other module imports it.
- **The Zod schema is the contract.** Model output (via forced tool use) and the
  UI both derive from `reportSchema`; malformed output fails loudly at
  `reportSchema.parse`.
- **The API key is the user's own and lives client-side** (localStorage +
  direct browser→Anthropic request). This is a deliberate tradeoff of the static
  hosting choice — see [[0001-static-byok-architecture]].

## Deployment

GitHub Pages via GitHub Actions on push to `main`/`master`/`brandlint`. Prod build
serves under `/blazity-hackaton/`; local dev serves under `/`.
