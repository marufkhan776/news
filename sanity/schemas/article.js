export default {
  name: 'article',
  title: 'Article',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title (Bangla)',
      type: 'string',
      validation: Rule => Rule.required().min(10).max(150),
      description: 'Article headline in Bangla',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => {
          // Custom slugify function for Bangla text
          const transliteration = {
            'জাতীয়': 'national',
            'আন্তর্জাতিক': 'international',
            'রাজনীতি': 'politics',
            'খেলা': 'sports',
            'ব্যবসা': 'business',
            'বিনোদন': 'entertainment',
            'প্রযুক্তি': 'technology',
            'লাইফস্টাইল': 'lifestyle',
            'মতামত': 'opinion'
          };
          
          let slug = input.toLowerCase();
          
          // Replace common Bangla words with English equivalents
          Object.keys(transliteration).forEach(bangla => {
            slug = slug.replace(new RegExp(bangla, 'g'), transliteration[bangla]);
          });
          
          // Clean up the slug
          return slug
            .replace(/[^a-z0-9\u0980-\u09FF]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
        }
      },
      validation: Rule => Rule.required(),
      description: 'URL-friendly version of the title',
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().min(50).max(300),
      description: 'Brief summary of the article (50-300 characters)',
    },
    {
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
          description: 'Important for SEO and accessibility.',
          validation: Rule => Rule.required(),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption',
          description: 'Image caption in Bangla',
        }
      ],
      validation: Rule => Rule.required(),
    },
    {
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          title: 'Block',
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: Rule => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean'
                  }
                ]
              },
            ]
          }
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              validation: Rule => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            }
          ]
        },
        {
          type: 'code',
          title: 'Code Block',
        }
      ],
      validation: Rule => Rule.required(),
      description: 'Main content of the article in Bangla',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: Rule => Rule.required(),
      description: 'Select the category for this article',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: Rule => Rule.required(),
      description: 'Select the author of this article',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: Rule => Rule.required(),
      description: 'Date and time when the article was published',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      description: 'Tags for better searchability and categorization',
    },
    {
      name: 'featured',
      title: 'Featured Article',
      type: 'boolean',
      description: 'Mark as featured to display prominently on homepage',
      initialValue: false,
    },
    {
      name: 'breaking',
      title: 'Breaking News',
      type: 'boolean',
      description: 'Mark as breaking news to show in breaking news ticker',
      initialValue: false,
    },
    {
      name: 'views',
      title: 'Views',
      type: 'number',
      description: 'Number of times this article has been viewed',
      initialValue: 0,
      readOnly: true,
    },
    {
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
      validation: Rule => Rule.max(60),
      description: 'SEO title (max 60 characters)',
    },
    {
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      validation: Rule => Rule.max(160),
      description: 'SEO description (max 160 characters)',
    },
    {
      name: 'socialImage',
      title: 'Social Media Image',
      type: 'image',
      description: 'Image for social media sharing (Facebook, Twitter, etc.)',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative Text',
        }
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'mainImage',
      category: 'category.title',
      featured: 'featured',
      breaking: 'breaking',
    },
    prepare(selection) {
      const { author, category, featured, breaking } = selection;
      const badges = [];
      if (featured) badges.push('⭐ Featured');
      if (breaking) badges.push('🚨 Breaking');
      
      return Object.assign({}, selection, {
        subtitle: [author, category, ...badges].filter(Boolean).join(' • '),
      });
    },
  },
  orderings: [
    {
      title: 'Published Date (Latest First)',
      name: 'publishedDateDesc',
      by: [
        { field: 'publishedAt', direction: 'desc' }
      ]
    },
    {
      title: 'Published Date (Oldest First)',
      name: 'publishedDateAsc',
      by: [
        { field: 'publishedAt', direction: 'asc' }
      ]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [
        { field: 'title', direction: 'asc' }
      ]
    },
    {
      title: 'Views (Most Popular)',
      name: 'viewsDesc',
      by: [
        { field: 'views', direction: 'desc' }
      ]
    }
  ]
};