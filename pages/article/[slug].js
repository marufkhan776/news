import { useEffect } from 'react';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { Clock, Eye, User, Tag, Calendar } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import ArticleCard from '../../components/Article/ArticleCard';
import { InlineSocialShare } from '../../components/UI/SocialShare';
import { sanityFetch, QUERIES, updateArticleViews, urlFor } from '../../lib/sanity';
import { getRelativeTime, formatBanglaDate, calculateReadingTime, extractPlainText } from '../../lib/utils';

// Portable Text components for rich content
const portableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="my-8">
        <Image
          src={urlFor(value).width(800).height(450).url()}
          alt={value.alt || ''}
          width={800}
          height={450}
          className="rounded-lg w-full h-auto"
        />
        {value.caption && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center font-bengali">
            {value.caption}
          </p>
        )}
      </div>
    ),
    code: ({ value }) => (
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-6">
        <code className="text-sm">{value.code}</code>
      </pre>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value.href}
        target={value.blank ? '_blank' : '_self'}
        rel={value.blank ? 'noopener noreferrer' : ''}
        className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
      >
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="text-2xl font-bold font-bengali text-gray-900 dark:text-white mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-bold font-bengali text-gray-900 dark:text-white mt-6 mb-3">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-lg font-bold font-bengali text-gray-900 dark:text-white mt-5 mb-2">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-primary-500 pl-6 py-2 my-6 bg-gray-50 dark:bg-gray-800 italic">
        <div className="font-bengali text-gray-700 dark:text-gray-300">
          {children}
        </div>
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed font-bengali text-gray-800 dark:text-gray-200">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside space-y-2 mb-4 font-bengali">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside space-y-2 mb-4 font-bengali">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="text-gray-800 dark:text-gray-200">{children}</li>,
    number: ({ children }) => <li className="text-gray-800 dark:text-gray-200">{children}</li>,
  },
};

export default function ArticlePage({ article, relatedArticles = [] }) {
  useEffect(() => {
    // Update view count when article is viewed
    if (article?._id) {
      updateArticleViews(article._id);
    }
  }, [article?._id]);

  if (!article) {
    return (
      <Layout title="নিবন্ধ পাওয়া যায়নি" noIndex={true}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold font-bengali text-gray-900 dark:text-white mb-4">
              নিবন্ধ পাওয়া যায়নি
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-bengali mb-6">
              দুঃখিত, আপনি যে নিবন্ধটি খুঁজছেন তা পাওয়া যায়নি।
            </p>
            <a href="/" className="btn-primary">
              হোমপেজে ফিরুন
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  const {
    title,
    excerpt,
    mainImage,
    body,
    publishedAt,
    category,
    author,
    tags = [],
    views = 0
  } = article;

  const imageUrl = mainImage ? urlFor(mainImage).width(1200).height(630).url() : null;
  const plainText = extractPlainText(body);
  const readingTime = calculateReadingTime(plainText);

  return (
    <Layout
      title={`${title} | বাংলা নিউজ`}
      description={excerpt}
      image={imageUrl}
      url={`/article/${article.slug.current}`}
      article={article}
    >
      <article className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Article Header */}
            <header className="mb-8">
              {/* Category Badge */}
              {category && (
                <div className="mb-4">
                  <span 
                    className="inline-block px-3 py-1 text-sm font-medium text-white rounded-md"
                    style={{ backgroundColor: category.color || '#3b82f6' }}
                  >
                    {category.title}
                  </span>
                </div>
              )}

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold font-bengali text-gray-900 dark:text-white mb-6 leading-tight">
                {title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-400 mb-6">
                {author && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span className="font-bengali">{author.name}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatBanglaDate(publishedAt, 'DD MMMM YYYY')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime}</span>
                </div>
                {views > 0 && (
                  <div className="flex items-center space-x-2">
                    <Eye className="h-4 w-4" />
                    <span>{views} বার পড়া হয়েছে</span>
                  </div>
                )}
              </div>

              {/* Social Share */}
              <div className="mb-8">
                <InlineSocialShare 
                  url={`/article/${article.slug.current}`} 
                  title={title} 
                />
              </div>
            </header>

            {/* Featured Image */}
            {imageUrl && (
              <div className="mb-8">
                <Image
                  src={imageUrl}
                  alt={mainImage.alt || title}
                  width={1200}
                  height={630}
                  className="w-full h-auto rounded-lg"
                  priority
                />
                {mainImage.caption && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-3 text-center font-bengali">
                    {mainImage.caption}
                  </p>
                )}
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none prose-bengali">
              <PortableText value={body} components={portableTextComponents} />
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-bengali">
                    ট্যাগসমূহ:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                               text-sm rounded-full font-bengali"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            {author?.bio && (
              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-4">
                  {author.image && (
                    <Image
                      src={urlFor(author.image).width(80).height(80).url()}
                      alt={author.name}
                      width={80}
                      height={80}
                      className="rounded-full"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold font-bengali text-gray-900 dark:text-white mb-2">
                      {author.name}
                    </h3>
                    {author.position && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 font-bengali mb-2">
                        {author.position}
                      </p>
                    )}
                    <div className="prose prose-sm font-bengali text-gray-700 dark:text-gray-300">
                      <PortableText value={author.bio} />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="bg-white dark:bg-gray-800 py-12">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold font-bengali text-gray-900 dark:text-white mb-8">
                  সম্পর্কিত নিবন্ধ
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {relatedArticles.map((relatedArticle) => (
                    <ArticleCard
                      key={relatedArticle._id}
                      article={relatedArticle}
                      variant="default"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </article>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const { slug } = params;
    
    const article = await sanityFetch(QUERIES.articleBySlug(slug));
    
    if (!article) {
      return {
        notFound: true,
      };
    }

    // Fetch related articles
    const relatedArticles = await sanityFetch(
      QUERIES.relatedArticles(article.category._id, article._id, 4)
    );

    return {
      props: {
        article,
        relatedArticles: relatedArticles || [],
      },
    };
  } catch (error) {
    console.error('Error fetching article:', error);
    return {
      notFound: true,
    };
  }
}