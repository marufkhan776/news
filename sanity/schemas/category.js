export default {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Category Name (Bangla)',
      type: 'string',
      validation: Rule => Rule.required(),
      description: 'Category name in Bangla (e.g., জাতীয়, আন্তর্জাতিক)',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input
          .toLowerCase()
          .replace(/[^a-z0-9\u0980-\u09FF]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '')
      },
      validation: Rule => Rule.required(),
      description: 'URL-friendly version of the category name',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Brief description of this category',
    },
    {
      name: 'color',
      title: 'Category Color',
      type: 'string',
      options: {
        list: [
          { title: 'Red', value: '#ef4444' },
          { title: 'Blue', value: '#3b82f6' },
          { title: 'Green', value: '#10b981' },
          { title: 'Yellow', value: '#f59e0b' },
          { title: 'Purple', value: '#8b5cf6' },
          { title: 'Pink', value: '#ec4899' },
          { title: 'Orange', value: '#f97316' },
          { title: 'Teal', value: '#14b8a6' },
          { title: 'Indigo', value: '#6366f1' },
        ],
        layout: 'radio',
      },
      initialValue: '#3b82f6',
    },
    {
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this category appears in navigation',
      initialValue: 1,
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'description',
    },
  },
  orderings: [
    {
      title: 'Order',
      name: 'orderAsc',
      by: [
        { field: 'order', direction: 'asc' }
      ]
    },
    {
      title: 'Title A-Z',
      name: 'titleAsc',
      by: [
        { field: 'title', direction: 'asc' }
      ]
    }
  ]
};