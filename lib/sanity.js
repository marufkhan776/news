import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity client configuration
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-12-01',
  useCdn: false, // Set to false for fresh data in production
  token: process.env.SANITY_TOKEN,
});

// Image URL builder
const builder = imageUrlBuilder(client);

export function urlFor(source) {
  return builder.image(source);
}

// Common GROQ queries
export const QUERIES = {
  // Get all categories
  categories: `*[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description
  }`,

  // Get featured articles for homepage
  featuredArticles: `*[_type == "article" && featured == true] | order(_createdAt desc)[0...5] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    category->{_id, title, slug},
    author->{_id, name, image},
    tags
  }`,

  // Get latest articles by category
  latestByCategory: (categorySlug, limit = 6) => `*[_type == "article" && category->slug.current == "${categorySlug}"] | order(publishedAt desc)[0...${limit}] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    category->{_id, title, slug},
    author->{_id, name, image}
  }`,

  // Get breaking news
  breakingNews: `*[_type == "article" && breaking == true] | order(_createdAt desc)[0...10] {
    _id,
    title,
    slug,
    category->{_id, title, slug}
  }`,

  // Get trending articles
  trendingArticles: `*[_type == "article"] | order(views desc, _createdAt desc)[0...5] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    category->{_id, title, slug},
    author->{_id, name, image},
    views
  }`,

  // Get single article by slug
  articleBySlug: (slug) => `*[_type == "article" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    body,
    publishedAt,
    category->{_id, title, slug},
    author->{_id, name, image, bio},
    tags,
    views,
    featured,
    breaking
  }`,

  // Get articles by category
  articlesByCategory: (categorySlug, page = 0, limit = 12) => `*[_type == "article" && category->slug.current == "${categorySlug}"] | order(publishedAt desc)[${page * limit}...${(page + 1) * limit}] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    category->{_id, title, slug},
    author->{_id, name, image}
  }`,

  // Search articles
  searchArticles: (searchTerm) => `*[_type == "article" && (title match "${searchTerm}*" || body[].children[].text match "${searchTerm}*")] | order(publishedAt desc)[0...20] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    category->{_id, title, slug},
    author->{_id, name, image}
  }`,

  // Get related articles
  relatedArticles: (categoryId, currentArticleId, limit = 4) => `*[_type == "article" && category._ref == "${categoryId}" && _id != "${currentArticleId}"] | order(publishedAt desc)[0...${limit}] {
    _id,
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    category->{_id, title, slug},
    author->{_id, name, image}
  }`,

  // Get all articles for sitemap
  allArticleSlugs: `*[_type == "article"] {
    slug,
    publishedAt
  }`,

  // Get all category slugs
  allCategorySlugs: `*[_type == "category"] {
    slug
  }`,
};

// Helper functions for data fetching
export const sanityFetch = async (query, params = {}) => {
  try {
    const data = await client.fetch(query, params);
    return data;
  } catch (error) {
    console.error('Sanity fetch error:', error);
    return null;
  }
};

// Update article views
export const updateArticleViews = async (articleId) => {
  try {
    await client
      .patch(articleId)
      .inc({ views: 1 })
      .commit();
  } catch (error) {
    console.error('Error updating views:', error);
  }
};

// Get article count by category
export const getArticleCountByCategory = async (categorySlug) => {
  try {
    const count = await client.fetch(
      `count(*[_type == "article" && category->slug.current == "${categorySlug}"])`
    );
    return count;
  } catch (error) {
    console.error('Error getting article count:', error);
    return 0;
  }
};