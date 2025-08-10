import Link from 'next/link';
import Image from 'next/image';
import { Clock, Eye, User } from 'lucide-react';
import { urlFor } from '../../lib/sanity';
import { getRelativeTime, truncateText, formatViewCount } from '../../lib/utils';

const ArticleCard = ({ 
  article, 
  variant = 'default', 
  showImage = true, 
  showAuthor = true,
  showViews = true,
  showExcerpt = true,
  className = ''
}) => {
  if (!article) return null;

  const {
    title,
    slug,
    excerpt,
    mainImage,
    publishedAt,
    category,
    author,
    views = 0
  } = article;

  const imageUrl = mainImage ? urlFor(mainImage).width(600).height(400).url() : null;
  const categoryColor = category?.color || '#3b82f6';

  // Different card variants
  const variants = {
    default: 'bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow',
    minimal: 'bg-transparent',
    horizontal: 'bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow',
    featured: 'bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-[1.02]'
  };

  const isHorizontal = variant === 'horizontal';

  return (
    <article className={`${variants[variant]} overflow-hidden group ${className}`}>
      <Link href={`/article/${slug.current}`}>
        <div className={`${isHorizontal ? 'flex space-x-4' : 'block'}`}>
          {/* Article Image */}
          {showImage && imageUrl && (
            <div className={`
              relative overflow-hidden bg-gray-200 dark:bg-gray-700
              ${isHorizontal 
                ? 'w-32 h-24 flex-shrink-0' 
                : 'w-full h-48'
              }
              ${variant === 'featured' ? 'h-56' : ''}
            `}>
              <Image
                src={imageUrl}
                alt={mainImage?.alt || title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes={isHorizontal ? '128px' : '(max-width: 768px) 100vw, 50vw'}
                priority={variant === 'featured'}
              />
              
              {/* Category Badge */}
              {category && (
                <div className="absolute top-3 left-3">
                  <span 
                    className="px-2 py-1 text-xs font-medium text-white rounded-md shadow-lg"
                    style={{ backgroundColor: categoryColor }}
                  >
                    {category.title}
                  </span>
                </div>
              )}

              {/* Breaking News Badge */}
              {article.breaking && (
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-md shadow-lg animate-pulse">
                    🚨 ব্রেকিং
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Content */}
          <div className={`
            ${isHorizontal ? 'flex-1 min-w-0' : 'p-4'}
            ${!showImage || !imageUrl ? 'p-4' : ''}
          `}>
            {/* Category (when no image) */}
            {(!showImage || !imageUrl) && category && (
              <div className="mb-2">
                <span 
                  className="inline-block px-2 py-1 text-xs font-medium text-white rounded-md"
                  style={{ backgroundColor: categoryColor }}
                >
                  {category.title}
                </span>
              </div>
            )}

            {/* Title */}
            <h3 className={`
              font-bengali font-bold text-gray-900 dark:text-white 
              group-hover:text-primary-600 dark:group-hover:text-primary-400 
              transition-colors line-clamp-2
              ${variant === 'featured' ? 'text-xl mb-3' : 'text-base mb-2'}
              ${isHorizontal ? 'text-sm' : ''}
            `}>
              {title}
            </h3>

            {/* Excerpt */}
            {showExcerpt && excerpt && !isHorizontal && (
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2 font-bengali">
                {truncateText(excerpt, variant === 'featured' ? 120 : 80)}
              </p>
            )}

            {/* Meta Information */}
            <div className={`
              flex items-center justify-between text-xs text-gray-500 dark:text-gray-400
              ${isHorizontal ? 'mt-1' : 'mt-auto'}
            `}>
              <div className="flex items-center space-x-3">
                {/* Author */}
                {showAuthor && author && (
                  <div className="flex items-center space-x-1">
                    <User className="h-3 w-3" />
                    <span className="font-bengali">{author.name}</span>
                  </div>
                )}

                {/* Published Time */}
                <div className="flex items-center space-x-1">
                  <Clock className="h-3 w-3" />
                  <span>{getRelativeTime(publishedAt)}</span>
                </div>
              </div>

              {/* View Count */}
              {showViews && views > 0 && (
                <div className="flex items-center space-x-1">
                  <Eye className="h-3 w-3" />
                  <span>{formatViewCount(views)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
};

// Skeleton loader for ArticleCard
export const ArticleCardSkeleton = ({ variant = 'default' }) => {
  const isHorizontal = variant === 'horizontal';
  
  return (
    <div className={`
      bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse
      ${variant === 'featured' ? 'rounded-xl shadow-lg' : ''}
    `}>
      <div className={`${isHorizontal ? 'flex space-x-4' : 'block'}`}>
        {/* Image Skeleton */}
        <div className={`
          bg-gray-300 dark:bg-gray-600
          ${isHorizontal 
            ? 'w-32 h-24 flex-shrink-0' 
            : 'w-full h-48'
          }
          ${variant === 'featured' ? 'h-56' : ''}
        `} />

        {/* Content Skeleton */}
        <div className={`
          ${isHorizontal ? 'flex-1 min-w-0 py-2' : 'p-4'}
        `}>
          {/* Title */}
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-2" />
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3 w-3/4" />
          
          {/* Excerpt (for non-horizontal) */}
          {!isHorizontal && (
            <>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-1" />
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded mb-3 w-5/6" />
            </>
          )}

          {/* Meta */}
          <div className="flex justify-between">
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/3" />
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/6" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;