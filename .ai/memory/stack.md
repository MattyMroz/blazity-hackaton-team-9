# Stack

As built in the BrandLint MVP. Architecture rationale: [[0001-static-byok-architecture]].

## Decided & in use

- **Framework:** Next.js 15 (App Router) configured for a **fully static export**
  (`output: 'export'` in `next.config.mjs`) — there is no server runtime.
- **UI:** React 19, TypeScript (strict).
- **Styling:** Tailwind CSS v4 (`@import "tailwindcss"`), with brand color tokens
  in `app/globals.css` `@theme` (`--color-brand`, `--color-brand-dark`).
- **AI provider:** Claude via the Anthropic TypeScript SDK (`@anthropic-ai/sdk`,
  `^0.65.0`), called **from the browser** with `dangerouslyAllowBrowser: true`.
- **Validation:** Zod (`^4`) — `lib/schema.ts` validates the model's tool output.
- **Model:** `claude-opus-4-8` (set as `MODEL` in `lib/analyzeContent.ts`; the UI
  badge shows it). NOTE: `RUN.md` currently says `claude-sonnet-4-6` — a stale
  doc mismatch; the code is the source of truth. Switching model = edit `MODEL`.

## How the AI call works (as built)

- **Forced tool use** for structured output: a single `report` tool with
  `tool_choice: { type: 'tool', name: 'report' }`, then `reportSchema.parse()` on
  the returned `tool_use` input. (This predates / substitutes for `messages.parse`
  + structured outputs — it's a valid, reliable approach.)
- `max_tokens: 4000`, no `thinking` config (adaptive thinking isn't combined with
  forced tool choice here).
- The Anthropic SDK is imported in exactly one module: `lib/analyzeContent.ts`.

## Commands

- `npm install`
- `npm run dev` → http://localhost:3000 (local dev/demo; basePath is `/` in dev)
- `npm run build` → static site in `out/` (prod build sets basePath
  `/blazity-hackaton`)
- `npm run start`, `npm run lint`
- Deploy: push to `main` / `master` / `brandlint` → GitHub Actions
  (`.github/workflows/deploy.yml`) builds and publishes to GitHub Pages.
- Atlas health: `npx --yes @blazity-atlas/core@latest doctor`

## Notes / open items

- Package manager not pinned (a `package-lock.json` is committed → npm).
- `max_tokens: 4000` can truncate long drafts → see [[lessons]].
- An earlier plan chose Python/FastAPI, then Next.js with a **server-side** key;
  the shipped MVP went static + BYOK instead. See [[0001-static-byok-architecture]].
