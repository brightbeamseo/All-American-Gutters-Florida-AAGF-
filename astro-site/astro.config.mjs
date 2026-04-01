// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

/** Canonical production URL (set PUBLIC_SITE_URL on Vercel and in astro-site/.env) */
const site =
  process.env.PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'http://localhost:4321';

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [sitemap()],
});
