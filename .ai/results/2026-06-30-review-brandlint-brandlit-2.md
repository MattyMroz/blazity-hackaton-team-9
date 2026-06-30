# BrandLint brandlit-2 review

- **status**: conditional pass
- **preset**: Platform
- **risk level**: medium
- **required changes**:
  1. Harden the report contract with explicit quote/rubric fields; cleared by product/engineering owner.
  2. Add a visible before/after proof loop for final edited copy; cleared by product/engineering owner.
  3. Add repeatable demo fixtures or smoke checks for at least one happy path and one malformed/long-output path; cleared by product/engineering owner.
  4. Keep model IDs verified against provider documentation when changed; cleared by product/engineering owner.
- **open questions**:
  - How should the product prove that the edited final version is still on-brand after human changes?
  - Should model choice be a user-facing control or a demo/debug control?
  - What is the minimum evidence set needed for hackathon judging beyond a live demo?
- **evidence**:
  - `git diff brandlint...brandlit-2` inspected: model selector, editable improved result, and two local text-review skills were added.
  - `npm run build` passed on 2026-06-30 with static export output.
  - Official Anthropic model documentation checked for listed model IDs.
- **approval boundaries**:
  - Humans approve publishing, copied output, and any use of a personal Anthropic API key.
  - The app should never publish or send content anywhere except directly to Anthropic for analysis without explicit user action.
- **monitoring plan**:
  - For the MVP, use manual demo smoke checks: sample input, invalid key handling, long draft behavior, and copy/edit flow.
  - If expanded beyond hackathon demo, add lightweight client-side error/event logging without storing API keys or draft text.
- **owner**: Product/engineering owner
- **next review date**: 2026-07-07

## Notes

The pull improves demo agency by letting users choose model quality/cost and edit the final on-brand version before copying. The strongest next product step is not more generation; it is stronger review evidence: exact quotes, rubric breakdown, and proof that the final edited copy still passes.
