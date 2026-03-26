# SunLife Gutters Tampa (SGT)

This is a standalone clone of the Mile High Gutter website stack, prepared for a separate brand/site launch.

## Included projects

- `astro-site/` - public website (Astro)
- `sanity-studio/` - content studio (Sanity)
- `styles.css` - site styling used by Astro layout import
- `api/lead.js` - serverless lead endpoint
- `Media (SGT)/` - copied media assets

## Vercel (Git repo root = this folder)

If the GitHub repo contains **both** `astro-site/` and `sanity-studio/` (no app at the repository root), Vercel must know where the website lives.

**Option A (recommended):** In the Vercel project: **Settings → General → Root Directory** = `astro-site`. Then leave **Output Directory** empty (Astro preset uses `dist`) or set **`dist`**. **Framework Preset:** Astro.

**Option B:** Leave **Root Directory** empty (repo root). Install and build **inside** `astro-site` (do not run `npm install` only at the repo root — there is no root `package.json`). An npm **workspace** at the repo root is intentionally **not** used here: it can break Rollup’s optional native binaries on Vercel Linux (`Cannot find module @rollup/rollup-linux-x64-gnu`). Set:

- **Install Command:** `cd astro-site && npm ci`
- **Build Command:** `cd astro-site && npm run build`
- **Output Directory:** `astro-site/dist`
- **Framework Preset:** Astro (or Other)

Redeploy after changing these. If the root URL still shows Vercel’s plain `404 NOT_FOUND`, the deployment output is still not pointing at `astro-site/dist`.

## Required setup before first run

1. Create a new Sanity project/dataset for SunLife Gutters Tampa.
2. Replace placeholders in:
   - `sanity-studio/sanity.config.ts` (`projectId`)
   - `sanity-studio/sanity.cli.ts` (`projectId`, `appId`)
   - `astro-site/src/lib/sanity.js` (`projectId`, optionally `dataset`)
3. Replace `GTM-XXXXXXX` in `astro-site/src/layouts/BaseLayout.astro`.
4. Set your reCAPTCHA and Zapier values for deployment:
   - `PUBLIC_RECAPTCHA_SITE_KEY`
   - `RECAPTCHA_SECRET_KEY`
   - `ZAPIER_WEBHOOK_URL`

## Run locally

- Website:
  - `cd astro-site`
  - `npm install`
  - `npm run dev`
- Sanity Studio:
  - `cd sanity-studio`
  - `npm install`
  - `npm run dev`
