import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './sanity/schemas'

export default defineConfig({
  name: 'bangla-newspaper',
  title: 'Bangla Newspaper CMS',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  plugins: [
    deskTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Featured Articles
            S.listItem()
              .title('Featured Articles')
              .child(
                S.documentTypeList('article')
                  .title('Featured Articles')
                  .filter('_type == "article" && featured == true')
              ),
            
            // Breaking News
            S.listItem()
              .title('Breaking News')
              .child(
                S.documentTypeList('article')
                  .title('Breaking News')
                  .filter('_type == "article" && breaking == true')
              ),
            
            // All Articles
            S.documentTypeListItem('article').title('All Articles'),
            
            S.divider(),
            
            // Categories
            S.documentTypeListItem('category').title('Categories'),
            
            // Authors
            S.documentTypeListItem('author').title('Authors'),
          ])
    }),
    visionTool()
  ],

  schema: {
    types: schemaTypes,
  },

  // Document actions
  document: {
    actions: (prev, context) => {
      // Remove duplicate action for articles
      if (context.schemaType === 'article') {
        return prev.filter(action => action.action !== 'duplicate')
      }
      return prev
    },
  },

  // Custom branding
  studio: {
    components: {
      logo: () => (
        <div style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          color: '#2563eb',
          fontFamily: 'Inter, sans-serif'
        }}>
          📰 বাংলা নিউজ
        </div>
      ),
    },
  },
})