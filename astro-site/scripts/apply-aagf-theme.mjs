#!/usr/bin/env node
/**
 * Writes All American Gutters logo-aligned colors into Sanity site settings (singleton).
 *
 * Env: same as other patch scripts — see `patch-env.mjs` (repo-root + astro-site `.env`, token aliases).
 *
 * Run: cd astro-site && npm run theme:aagf
 * Then open Studio → Site settings → Publish if a draft appears.
 */

import { createClient } from '@sanity/client'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { getSanityPatchCredentials, loadPatchDotEnv } from './patch-env.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

loadPatchDotEnv(root)

const { projectId, dataset, token } = getSanityPatchCredentials()
const documentId = 'siteSettingsSingleton'

/**
 * Sampled from `public/Media (AAGF)/Logo Suite (AAGF)/all-american-gutters-logo-placeholder.jpg`
 * (median red stripe + blue field); text/border tuned for contrast on light backgrounds.
 */
const COLORS = {
  background: '#f7f9fc',
  backgroundAlt: '#eef2f7',
  surface: '#ffffff',
  text: '#142f52',
  textMuted: '#4a5f7a',
  accent: '#c8021b',
  accentHover: '#a00117',
  primaryCtaText: '#ffffff',
  secondaryCtaBg: 'transparent',
  secondaryCtaBorder: '#94a3b8',
  secondaryCtaText: '#475569',
  secondaryCtaHoverBg: '#f1f5f9',
  secondaryCtaHoverText: '#334155',
  formButtonBg: '#c8021b',
  formButtonHover: '#a00117',
  formButtonText: '#ffffff',
  primary: '#0e407d',
  border: '#cdd8e6',
}

async function main() {
  if (!projectId || !token) {
    console.error(
      'Missing Sanity credentials: set PUBLIC_SANITY_PROJECT_ID or SANITY_PROJECT_ID, and SANITY_API_WRITE_TOKEN or SANITY_API_TOKEN (repo-root or astro-site/.env).',
    )
    process.exit(1)
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: '2024-01-01',
    token,
    useCdn: false,
  })

  const set = Object.fromEntries(
    Object.entries(COLORS).map(([k, v]) => [`theme.colors.${k}`, v]),
  )

  await client.patch(documentId).set(set).commit()

  console.log(`Patched ${documentId} theme.colors (${Object.keys(COLORS).length} fields).`)
  console.log('If Studio shows a draft on Site settings, review and Publish.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
