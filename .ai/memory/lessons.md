# Lessons

Proven, non-obvious pitfalls for BrandLint. Keep this short — only durable gotchas.

- **No backend by design.** The app is a static export on GitHub Pages, so there
  is intentionally no API route and no server-held key. Don't "fix" the
  browser-side Anthropic call (`dangerouslyAllowBrowser`) by adding a server
  unless the hosting model changes — it's a deliberate BYOK tradeoff. See
  [[0001-static-byok-architecture]].
- **`max_tokens: 4000` can truncate long reviews.** A long draft → long
  `improved_version` can hit the cap (`stop_reason: "max_tokens"`); the truncated
  tool input then fails `reportSchema.parse` and surfaces as a generic error.
  Raise `max_tokens` or check `stop_reason` before parsing if this shows up.
- **Keep the model id in sync across code and docs.** The source of truth is
  `MODEL` in `lib/analyzeContent.ts`; `RUN.md` has drifted from it before.
