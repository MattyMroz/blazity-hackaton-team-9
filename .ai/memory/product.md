# Product

**BrandLint** — an AI-powered content QA / brand-voice review tool. Built for the
Blazity "AI for Content" hackathon (2026-06-30). Shipped as a working MVP.

## Problem

Teams publish lots of content (social posts, emails, landing copy, product
descriptions) and reviewing each draft for brand-voice consistency, risky/hype
claims, vague wording, and weak CTAs is slow, manual, and subjective. BrandLint
automates that review pass.

## What it does (as built)

A single-screen web app. The user provides three things — their Anthropic API
key, brand guidelines, and a draft — and gets back a structured **report**:

- **score** — 0–100 brand-alignment score
- **summary** — one short verdict paragraph
- **issues[]** — each with `severity` (low/medium/high), `title`, `detail`
  (what's wrong, quoting the draft), and `suggestion` (how to fix)
- **improved_version** — the draft rewritten to be fully on-brand
- **publish_checklist[]** — pre-publish checks, each with `label` + `passed`

The AI is a **reviewer, not a generator** — it audits a draft against the
guidelines; it does not author new content from scratch.

## Shipped behavior notes

- **Bring-your-own-key (BYOK):** there is no backend. The user pastes their own
  `sk-ant-...` key; it is stored in browser `localStorage` and sent directly to
  the Anthropic API from the browser. See [[0001-static-byok-architecture]].
- A "load sample" action fills in an off-brand example for instant demos.
- UI copy is in Polish; code, identifiers, and these workspace docs are English.

## Known gaps vs. the original product principles

- **Exact-quote grounding is prompt-only.** The principle was that every issue
  cites the exact offending fragment as a *required, structured* field. As built,
  the quote lives inside the free-text `detail` field, enforced by the prompt but
  not by the schema. A dedicated required `quote` field would harden this.

## Out of scope (MVP)

Accounts/auth, persistence/history, multi-document libraries, integrations, team
collaboration.
