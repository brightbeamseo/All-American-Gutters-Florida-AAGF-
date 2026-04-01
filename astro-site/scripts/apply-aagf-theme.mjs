#!/usr/bin/env node
/**
 * Writes All American Gutters logo-aligned colors into Sanity site settings (singleton).
 *
 * Requires in astro-site/.env:
 *   PUBLIC_SANITY_PROJECT_ID
 *   PUBLIC_SANITY_DATASET (optional, default production)
 *   SANITY_API_WRITE_TOKEN — Editor token from sanity.io/manage → API → Tokens
 *
 * Run: cd astro-site && npm run theme:aagf
 * Then open Studio → Site settings → Publish if a draft appears.
 */

import { createClient } from '@sanity/client'
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

function loadDotEnv() {
  const p = resolve(root, '.env')
  if (!existsSync(p)) return
  const text = readFileSync(p, 'utf8')
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (process.env[key] === undefined) process.env[key] = val
  }
}

loadDotEnv()

const projectId = (process.env.PUBLIC_SANITY_PROJECT_ID || '').trim()
const dataset = (process.env.PUBLIC_SANITY_DATASET || 'production').trim()
const token = (process.env.SANITY_API_WRITE_TOKEN || '').trim()
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
    console.error('Missing PUBLIC_SANITY_PROJECT_ID or SANITY_API_WRITE_TOKEN in astro-site/.env')
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
