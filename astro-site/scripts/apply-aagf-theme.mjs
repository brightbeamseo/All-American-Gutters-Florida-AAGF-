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

/** Logo: US-flag-style red + deep navy (matches placeholder artwork). */
const COLORS = {
  background: '#f7f9fc',
  backgroundAlt: '#eef2f7',
  surface: '#ffffff',
  text: '#1a2d4d',
  textMuted: '#4a5a72',
  accent: '#c8102e',
  accentHover: '#a00d25',
  primaryCtaText: '#ffffff',
  secondaryCtaBg: 'transparent',
  secondaryCtaBorder: '#0a2351',
  secondaryCtaText: '#0a2351',
  secondaryCtaHoverBg: '#0a2351',
  secondaryCtaHoverText: '#ffffff',
  formButtonBg: '#c8102e',
  formButtonHover: '#a00d25',
  formButtonText: '#ffffff',
  primary: '#0a2351',
  border: '#d8e0ed',
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
