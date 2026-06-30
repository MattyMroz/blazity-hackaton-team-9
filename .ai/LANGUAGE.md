# Project Vocabulary

Canonical terms for BrandLint. Aligned to the shipped code (`lib/schema.ts`,
`lib/analyzeContent.ts`).

## Terms

| Term | Meaning | Avoid |
| --- | --- | --- |
| BrandLint | The product: an AI content QA / brand-voice reviewer. | "brand checker", "the linter app" |
| Report | The full structured result for one draft (`Report` type / `report` tool): score, summary, issues, improved_version, publish_checklist. | "review", "analysis", "output" |
| Brand guidelines | User-supplied tone/voice/brand rules — one of the two content inputs. | "style guide", "brand rules" |
| Draft | The user-supplied content under review — the second input. | "input text", "the content" |
| score | 0–100 brand-alignment score (100 = perfectly on-brand). | "rating", "grade" |
| Issue | One flagged problem: `severity` (low/medium/high), `title`, `detail`, `suggestion`. | "error", "violation", "finding" |
| improved_version | The reviewer's rewrite of the draft, kept close to the original intent. | "rewrite", "corrected text" |
| publish_checklist | Pre-publish checks, each `label` + `passed` boolean. | "todo", "action items" |
| BYOK | Bring-your-own-key: the user supplies their own Anthropic key, stored client-side; no shared/server key. | "API integration" (too vague) |
| Reviewer (the AI) | Claude acting as a QA/review layer — never an author. | "the generator" |
