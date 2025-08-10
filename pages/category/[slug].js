import { useState } from 'react';
import { useRouter } from 'next/router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../../components/Layout/Layout';
import ArticleCard, { ArticleCardSkeleton } from '../../components/Article/ArticleCard';
import { sanityFetch, QUERIES, getArticleCountByCategory } from '../../lib/sanity';
import { generatePagination } from '../../lib/utils';

const ARTICLES_PER_PAGE = 12;

export default function CategoryPage({ 
  category, 
  articles: initialArticles = [], 
  currentPage = 1, 
  totalPages = 1,
  totalCount = 0
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const loadPage = async (page) => {
    if (page === currentPage) return;
    
    setLoading(true);
    try {
      const newArticles = await sanityFetch(
        QUERIES.articlesByCategory(category.slug.current, page - 1, ARTICLES_PER_PAGE)
      );
      
      if (newArticles) {
        setArticles(newArticles);
        // Update URL without page reload
        router.push(`/category/${category.slug.current}?page=${page}`, undefined, { shallow: true });
      }
    } catch (error) {
      console.error('Error loading articles:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!category) {
    return (
      <Layout title="বিভাগ পাওয়া যায়নি" noIndex={true}>
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold font-bengali text-gray-900 dark:text-white mb-4">
              বিভাগ পাওয়া যায়নি
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-bengali mb-6">
              দুঃখিত, আপনি যে বিভাগটি খুঁজছেন তা পাওয়া যায়নি।
            </p>
            <a href="/" className="btn-primary">
              হোমপেজে ফিরুন
            </a>
          </div>
        </div>
      </Layout>
    );
  }

  const paginationPages = generatePagination(currentPage, totalPages);

  return (
    <Layout
      title={`${category.title} - বাংলা নিউজ`}
      description={category.description || `${category.title} বিভাগের সর্বশেষ সংবাদ ও নিবন্ধসমূহ`}
      url={`/category/${category.slug.current}`}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Category Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div 
                className="w-2 h-12 rounded-full"
                style={{ backgroundColor: category.color || '#3b82f6' }}
              ></div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold font-bengali text-gray-900 dark:text-white">
                  {category.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  মোট {totalCount}টি নিবন্ধ
                </p>
              </div>
            </div>
            
            {category.description && (
              <p className="text-gray-700 dark:text-gray-300 font-bengali max-w-2xl">
                {category.description}
              </p>
            )}
          </div>

          {/* Articles Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(ARTICLES_PER_PAGE)].map((_, index) => (
                <ArticleCardSkeleton key={index} />
              ))}
            </div>
          ) : articles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {articles.map((article) => (
                  <ArticleCard
                    key={article._id}
                    article={article}
                    variant="default"
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <nav className="flex items-center space-x-2">
                    {/* Previous Button */}
                    <button
                      onClick={() => loadPage(currentPage - 1)}
                      disabled={currentPage === 1 || loading}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 
                               bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                               disabled:opacity-50 disabled:cursor-not-allowed
                               dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" />
                      পূর্ববর্তী
                    </button>

                    {/* Page Numbers */}
                    <div className="flex items-center space-x-1">
                      {paginationPages.map((page, index) => {
                        if (page === '...') {
                          return (
                            <span key={index} className="px-3 py-2 text-gray-500">
                              ...
                            </span>
                          );
                        }

                        return (
                          <button
                            key={page}
                            onClick={() => loadPage(page)}
                            disabled={loading}
                            className={`
                              px-3 py-2 text-sm font-medium rounded-md transition-colors
                              ${page === currentPage
                                ? 'bg-primary-600 text-white'
                                : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700'
                              }
                              ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    {/* Next Button */}
                    <button
                      onClick={() => loadPage(currentPage + 1)}
                      disabled={currentPage === totalPages || loading}
                      className="flex items-center px-3 py-2 text-sm font-medium text-gray-500 
                               bg-white border border-gray-300 rounded-md hover:bg-gray-50 
                               disabled:opacity-50 disabled:cursor-not-allowed
                               dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      পরবর্তী
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </nav>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📰</div>
              <h2 className="text-xl font-bold font-bengali text-gray-900 dark:text-white mb-2">
                কোনো নিবন্ধ পাওয়া যায়নি
              </h2>
              <p className="text-gray-600 dark:text-gray-400 font-bengali mb-6">
                এই বিভাগে এখনো কোনো নিবন্ধ প্রকাশিত হয়নি।
              </p>
              <a href="/" className="btn-primary">
                হোমপেজে ফিরুন
              </a>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params, query }) {
  try {
    const { slug } = params;
    const page = parseInt(query.page) || 1;
    
    // Fetch category
    const categories = await sanityFetch(QUERIES.categories);
    const category = categories?.find(cat => cat.slug.current === slug);
    
    if (!category) {
      return {
        notFound: true,
      };
    }

    // Fetch articles and count
    const [articles, totalCount] = await Promise.all([
      sanityFetch(QUERIES.articlesByCategory(slug, page - 1, ARTICLES_PER_PAGE)),
      getArticleCountByCategory(slug)
    ]);

    const totalPages = Math.ceil(totalCount / ARTICLES_PER_PAGE);

    return {
      props: {
        category,
        articles: articles || [],
        currentPage: page,
        totalPages,
        totalCount,
      },
    };
  } catch (error) {
    console.error('Error fetching category data:', error);
    return {
      notFound: true,
    };
  }
}