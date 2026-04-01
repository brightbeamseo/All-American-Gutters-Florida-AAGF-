# All American Gutters Florida (AAGF)

Astro + Sanity site forked from the SunLife Gutters Tampa template. This repo is the single source of truth for the AAGF brand.

The Git remote **`sunlife`** still points at the original template (`brightbeamseo/sunlife-gutters-tampa`) for reference only. There is no **`origin`** until you add your new GitHub repository (see below).

## Included projects

- `astro-site/` — public website (Astro)
- `sanity-studio/` — Sanity Studio (content)
- `styles.css` — site styling used by Astro layout import
- `api/lead.js` — serverless lead endpoint (Vercel)
- `Media (AAGF)/` — media assets (paths unchanged; rename later if you want)

## 1. GitHub

1. Create a **new empty** repository (for example `all-american-gutters-florida`) under your org. Do not reuse the SunLife repo.
2. Add it as **`origin`** and push:

```bash
cd "/path/to/All American Gutters Florida (AAGF)"
git remote add origin https://github.com/YOUR_ORG/YOUR_NEW_REPO.git
git push -u origin main
```

Optional: keep **`sunlife`** as a read-only reference to the template, or remove it with `git remote remove sunlife` once you no longer need it.

## 2. Sanity (new project)

This site must use a **dedicated Sanity project** for All American Gutters Florida. Do not point it at the SunLife project (`04s0hjml`) in production.

1. In [Sanity manage](https://www.sanity.io/manage), create a project (for example **“All American Gutters Florida”**) in your org.
2. Ensure dataset **`production`** exists (default).
3. **CORS:** In Project settings → API → CORS origins, add:
   - `http://localhost:3333` (Sanity Studio local)
   - `http://localhost:4321` (Astro local)
   - `https://*.vercel.app` (preview deployments)
   - Your production domain when you have it (for example `https://www.your-domain.com`)
4. Copy IDs into env files:
   - `sanity-studio/.env.example` → `sanity-studio/.env` — set `SANITY_STUDIO_PROJECT_ID` (and `SANITY_STUDIO_DATASET` if not `production`).
   - `astro-site/.env.example` → `astro-site/.env` — set `PUBLIC_SANITY_PROJECT_ID` to the **same** project ID, plus `PUBLIC_SITE_URL` (your canonical `https://…` URL).
5. Deploy the schema and run Studio:

```bash
cd sanity-studio
npm install
npm run dev
```

From the same folder, after you are ready for hosted Studio: `npm run deploy` (follow the CLI prompts; this creates a new `sanity.cli` deployment entry if needed).

6. **Content:** The new dataset starts empty. Copy or re-enter content from Studio (or export/import scripts if you add them). Do not publish the SunLife dataset to this project by mistake.

## 3. Vercel

1. Import the **new** GitHub repo into Vercel (not the SunLife repo).
2. Leave **Root Directory** empty so the repo-root `vercel.json` is used (`install` / `build` run inside `astro-site/`).
3. **Environment variables** (Production and Preview as needed):

| Variable | Notes |
|----------|--------|
| `PUBLIC_SANITY_PROJECT_ID` | Same as `SANITY_STUDIO_PROJECT_ID` |
| `PUBLIC_SANITY_DATASET` | Usually `production` |
| `PUBLIC_SITE_URL` | Canonical URL, e.g. `https://www.your-domain.com` |
| `ZAPIER_WEBHOOK_URL` | HTTPS webhook for lead form (`api/lead.js`) |
| `PUBLIC_RECAPTCHA_SITE_KEY` | Optional locally; set in production |
| `RECAPTCHA_SECRET_KEY` | Required for `/api/lead` in production |

4. **Domain:** Attach your production domain in Vercel; when it is final, add a **redirect** in `vercel.json` if you need apex → `www` (the old SunLife apex redirect was removed).

5. Optional: enable **Analytics** and **Speed Insights** in the Vercel project (the Astro app already includes the packages).

## 4. Other checklist

- **Google Tag Manager:** Replace `GTM-XXXXXXX` in `astro-site/src/layouts/BaseLayout.astro` with the AAGF container ID.
- **robots.txt:** Uncomment or add the `Sitemap:` line in `astro-site/public/robots.txt` when the live URL is decided.
- **reCAPTCHA / Zapier:** Match keys and webhooks to the AAGF Google Cloud project and Zap, not SunLife.

## Run locally

**Website**

```bash
cd astro-site
npm install
cp .env.example .env   # fill in PUBLIC_* and optional keys
npm run dev
```

**Sanity Studio**

```bash
cd sanity-studio
npm install
cp .env.example .env   # SANITY_STUDIO_PROJECT_ID, etc.
npm run dev
```

## Vercel layout

Do **not** delete the repo-root **`vercel.json`**: it installs and builds **`astro-site/`** and publishes **`astro-site/dist`**. If you set **Root Directory** to `astro-site` in the Vercel UI, only `astro-site/vercel.json` applies and output should be **`dist`**.
