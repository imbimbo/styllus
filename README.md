# Styllu's Assessoria Contábil — marketing site

Static marketing site for [Styllu's](https://www.stylluscontabil.com.br), built with **Astro + React islands**.

## Stack (Phase 1)

- Astro 7 + TypeScript
- React (`@astrojs/react`) for interactive sections
- GitHub Pages (preview for stakeholders)
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

## GitHub Pages (current preview)

The site deploys automatically on push to `main` via GitHub Actions.

**Preview URL:** https://imbimbo.github.io/styllus/

### One-time setup

1. Push this repo to GitHub.
2. In the repo → **Settings → Pages → Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main` (or run the workflow manually under **Actions**).

For production with a custom domain (`stylluscontabil.com.br`), you can later use GitHub Pages with a `CNAME` file or switch to Cloudflare Pages — the Astro setup stays the same.

## Cloudflare Pages (optional, production)

If you prefer Cloudflare for the live domain later:

1. Connect this repo in Cloudflare Pages.
2. Settings:
   - **Framework preset:** Astro
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Environment variable:** `NODE_VERSION=22`
3. Custom domain: add `stylluscontabil.com.br` (and `www`) in Pages → Custom domains, then point DNS to Cloudflare.

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
