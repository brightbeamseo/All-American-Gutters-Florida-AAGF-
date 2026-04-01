/**
 * Shared env loading for Sanity patch scripts.
 * Merges repo-root `.env` then `astro-site/.env` (later wins on duplicate keys).
 *
 * Token: `SANITY_API_WRITE_TOKEN` or `SANITY_API_TOKEN`.
 * Project: `PUBLIC_SANITY_PROJECT_ID` or `SANITY_PROJECT_ID`.
 * Dataset: `PUBLIC_SANITY_DATASET` or `SANITY_DATASET` (default production).
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

/** @param {string} content */
function parseEnvContent(content) {
  /** @type {Record<string, string>} */
  const out = {}
  for (const line of content.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const eq = t.indexOf('=')
    if (eq === -1) continue
    const key = t.slice(0, eq).trim()
    let val = t.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    out[key] = val
  }
  return out
}

/** @param {string} astroSiteRoot */
export function loadPatchDotEnv(astroSiteRoot) {
  const paths = [
    resolve(astroSiteRoot, '..', '.env'),
    resolve(astroSiteRoot, '.env'),
  ]
  const merged = {}
  for (const p of paths) {
    if (!existsSync(p)) continue
    Object.assign(merged, parseEnvContent(readFileSync(p, 'utf8')))
  }
  for (const [key, val] of Object.entries(merged)) {
    process.env[key] = val
  }
}

export function getSanityPatchCredentials() {
  const projectId = (
    process.env.PUBLIC_SANITY_PROJECT_ID ||
    process.env.SANITY_PROJECT_ID ||
    ''
  ).trim()
  const dataset = (
    process.env.PUBLIC_SANITY_DATASET ||
    process.env.SANITY_DATASET ||
    'production'
  ).trim()
  const token = (
    process.env.SANITY_API_WRITE_TOKEN ||
    process.env.SANITY_API_TOKEN ||
    ''
  ).trim()
  return { projectId, dataset, token }
}
