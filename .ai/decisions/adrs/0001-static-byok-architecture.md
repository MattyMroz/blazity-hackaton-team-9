# 0001 — Static hosting + bring-your-own-key

- Status: accepted (reflects the shipped MVP)
- Date: 2026-06-30

## Context

BrandLint is a hackathon MVP that must be live on a public URL with minimal ops.
The team chose **GitHub Pages** for hosting. GitHub Pages serves static files
only — there is no server runtime to hold a secret or run an API route.

Earlier planning had assumed a server-side Claude call (key never exposed to the
client). That assumption does not hold on static hosting.

## Decision

Ship a **fully static** Next.js export (`output: 'export'`) and call the Anthropic
API **directly from the browser** using a **bring-your-own-key (BYOK)** model:

- The user pastes their own `sk-ant-...` key into the UI.
- The key is stored in browser `localStorage` and sent straight to
  `api.anthropic.com` via the Anthropic SDK with `dangerouslyAllowBrowser: true`.
- No shared/organization key is embedded in the code or the published site.

Structured output is obtained via **forced tool use** (a single `report` tool)
and validated with Zod.

## Consequences

- **Pro:** zero backend, deploys to GitHub Pages via Actions, no key custody on
  our side, trivial to demo.
- **Con / accepted risk:** the user's key is exposed to anything running in the
  page (XSS, a compromised dependency) and persists in `localStorage`. This is
  acceptable for a self-serve demo where each user brings their own key; it is
  **not** suitable for a "paste our shared key" scenario.
- The "Claude call is server-side only" invariant from earlier planning is
  **superseded** by this decision.

## Alternative (documented, not chosen)

A serverless API route (`/api/analyze`) on Vercel or Cloudflare would keep the
key server-side. `RUN.md` notes this path is available if requirements change —
it requires moving off GitHub Pages to a host with serverless functions.
