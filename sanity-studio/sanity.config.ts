import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

/** Fixed IDs used by `scripts/import-content.js` and the Astro site (see DEV_NOTES.md). */
const SITE_SETTINGS_SINGLETON_ID = 'siteSettingsSingleton'
const HOME_PAGE_SINGLETON_ID = 'homePageSingleton'

/** Types edited as a single doc each — hide the generic “list of all X” to avoid duplicate confusion. */
const SINGLETON_SCHEMA_TYPES = new Set(['siteSettings', 'homePage'])
const PINNED_SCHEMA_TYPES = new Set(['locationPage'])

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

if (!projectId) {
  throw new Error(
    'Missing SANITY_STUDIO_PROJECT_ID. Copy sanity-studio/.env.example to .env and set your Sanity project ID.',
  )
}

export default defineConfig({
  name: 'default',
  title: 'All American Gutters Florida',

  projectId,
  dataset,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.listItem()
              .title('Site settings')
              .id(SITE_SETTINGS_SINGLETON_ID)
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId(SITE_SETTINGS_SINGLETON_ID),
              ),
            S.listItem()
              .title('Home page')
              .id(HOME_PAGE_SINGLETON_ID)
              .child(
                S.document().schemaType('homePage').documentId(HOME_PAGE_SINGLETON_ID),
              ),
            S.listItem()
              .title('Location pages')
              .id('locationPages')
              .child(
                S.documentTypeList('locationPage')
                  .title('Location pages')
                  .defaultOrdering([{field: 'title', direction: 'asc'}]),
              ),
            ...S.documentTypeListItems().filter(
              (item) =>
                !SINGLETON_SCHEMA_TYPES.has(String(item.getId())) &&
                !PINNED_SCHEMA_TYPES.has(String(item.getId())),
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },

  /** Prevent “New document → Site settings / Home page” (use the singleton entries above). */
  document: {
    newDocumentOptions: (prev, {creationContext}) => {
      if (creationContext.type === 'global') {
        return prev.filter(
          (templateItem) =>
            templateItem.templateId !== 'siteSettings' &&
            templateItem.templateId !== 'homePage',
        )
      }
      return prev
    },
  },
})
