# BrandLint — run & deploy

Form → Claude → ustrukturyzowany JSON (Zod) → dashboard. **W pełni statyczne**, działa na GitHub Pages.

## Lokalnie (do dewelopki / dema z localhost)

```bash
cd blazity-hackaton
npm install
npm run dev
# http://localhost:3000
```

Wklej w UI: klucz Anthropic (`sk-ant-...`), brand guidelines i draft → **Analizuj**.
Jest przycisk „Wstaw przykład" do szybkiego dema.

## Deploy na GitHub Pages (live URL)

1. Wypchnij na `main` (lub `master`) repo `MattyMroz/blazity-hackaton`.
2. Settings → Pages → **Source: GitHub Actions**.
3. Workflow `.github/workflows/deploy.yml` zbuduje (`next build` → `out/`) i opublikuje.
4. URL: **https://mattymroz.github.io/blazity-hackaton/**

> `next.config.mjs` ustawia `basePath`/`assetPrefix` na `/blazity-hackaton` tylko w buildzie produkcyjnym, więc lokalnie działa pod `/`, a na Pages pod `/blazity-hackaton/`.

## Bezpieczeństwo klucza (ważne)

GitHub Pages to **tylko statyka — brak serwera**, więc nie ma gdzie ukryć klucza po stronie backendu.
Dlatego BrandLint używa modelu **bring-your-own-key**: klucz wklejasz w UI, ląduje tylko w `localStorage`
przeglądarki i leci bezpośrednio do `api.anthropic.com`. **Wspólny klucz Blazity NIE jest wbity w kod ani
publikowany.** Na demo: wklej klucz raz, znika po wyczyszczeniu przeglądarki.

Jeśli wolisz wariant z ukrytym kluczem po stronie serwera (Next.js API route `/api/analyze`), to wymaga
hostingu z funkcjami serverless (Vercel / Cloudflare), nie GitHub Pages — powiedz, zrobię tę wersję.

## Model

`claude-sonnet-4-6` (sweet-spot szybkość/koszt/jakość). Zmiana w jednej linii: `lib/analyzeContent.ts` → `MODEL`.
