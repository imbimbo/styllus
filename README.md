# Styllu's Assessoria Contábil — marketing site

Static marketing site for [Styllu's](https://www.stylluscontabil.com.br), built with **Astro + React islands**.

## Stack (Phase 1)

- Astro 7 + TypeScript
- React (`@astrojs/react`) for interactive sections
- Cloudflare Pages hosting
- GitHub for source control

Sanity CMS / blog will be added later (Phase 2), after approval.

## Local development

Requires Node.js **22.12+**.

```bash
nvm use 22
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

Output goes to `dist/`.

## Cloudflare Pages

1. Push this repo to GitHub.
2. In Cloudflare Pages → Create project → Connect GitHub.
3. Settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `NODE_VERSION=22`
4. Custom domain: add `stylluscontabil.com.br` (and `www`) in Pages → Custom domains, then point DNS to Cloudflare.

## React islands

| Component | Role |
|-----------|------|
| `SiteHeader` | Sticky header + mobile menu |
| `IntentPicker` | “O que trouxe você” flow → WhatsApp |
| `PlanQuiz` | Plan recommendation quiz |
| `Testimonials` | Google reviews + show more / less |
| `ContactForm` | Validated form → WhatsApp |

## Project structure

```
src/
  pages/           # index, privacy, terms
  components/      # Astro + react/
  data/            # Google reviews (static)
  layouts/
  styles/
public/            # logo, favicon, _headers, _redirects
```
