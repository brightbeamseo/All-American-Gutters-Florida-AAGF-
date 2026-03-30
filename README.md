# SunLife Gutters Tampa (SGT)

This is a standalone clone of the Mile High Gutter website stack, prepared for a separate brand/site launch.

## Included projects

- `astro-site/` - public website (Astro)
- `sanity-studio/` - content studio (Sanity)
- `styles.css` - site styling used by Astro layout import
- `api/lead.js` - serverless lead endpoint
- `Media (SGT)/` - copied media assets

## Vercel

Do **not** delete the repo-root **`vercel.json`** or **`package.json`**: they tell Vercel to install/build **`astro-site/`** and publish **`astro-site/dist`**. In the Vercel project, either leave **Root Directory** empty (repo root). If you set **Root Directory** to `astro-site` instead, only `astro-site/vercel.json` counts and output should be **`dist`**.

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
