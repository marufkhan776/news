import { useState, useEffect } from 'react';
import { Eye, TrendingUp, Clock } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import ArticleCard, { ArticleCardSkeleton } from '../components/Article/ArticleCard';
import { sanityFetch, QUERIES } from '../lib/sanity';
import { getRelativeTime } from '../lib/utils';

export default function HomePage({ 
  featuredArticles: initialFeatured = [], 
  trendingArticles: initialTrending = [],
  categoriesData: initialCategoriesData = {},
  categories: initialCategories = []
}) {
  const [featuredArticles, setFeaturedArticles] = useState(initialFeatured);
  const [trendingArticles, setTrendingArticles] = useState(initialTrending);
  const [categoriesData, setCategoriesData] = useState(initialCategoriesData);
  const [loading, setLoading] = useState(false);

  // Load more articles for categories
  const loadMoreCategoryArticles = async (categorySlug) => {
    setLoading(true);
    try {
      const currentArticles = categoriesData[categorySlug] || [];
      const currentCount = currentArticles.length;
      const moreArticles = await sanityFetch(
        QUERIES.latestByCategory(categorySlug, currentCount + 6)
      );

      if (moreArticles?.length > currentCount) {
        setCategoriesData(prev => ({
          ...prev,
          [categorySlug]: moreArticles
        }));
      }
    } catch (error) {
      console.error('Error loading more articles:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="বাংলা নিউজ - সর্বশেষ সংবাদ"
      description="বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ, রাজনীতি, খেলাধুলা, বিনোদন, ব্যবসা ও অর্থনীতির খবর পান সবার আগে।"
      url="/"
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-12">
              {/* Featured Articles Section */}
              {featuredArticles.length > 0 && (
                <section className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-1 h-8 bg-primary-600 rounded-full"></div>
                    <h2 className="text-2xl font-bold font-bengali text-gray-900 dark:text-white">
                      ফিচার্ড নিউজ
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredArticles.slice(0, 6).map((article, index) => (
                      <ArticleCard
                        key={article._id}
                        article={article}
                        variant={index === 0 ? 'featured' : 'default'}
                        className={index === 0 ? 'md:col-span-2' : ''}
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* Category Sections */}
              {initialCategories.map((category) => {
                const categoryArticles = categoriesData[category.slug.current] || [];
                
                return (
                  <section key={category._id} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-1 h-8 rounded-full"
                          style={{ backgroundColor: category.color || '#3b82f6' }}
                        ></div>
                        <h2 className="text-2xl font-bold font-bengali text-gray-900 dark:text-white">
                          {category.title}
                        </h2>
                      </div>
                      <a
                        href={`/category/${category.slug.current}`}
                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 
                                 dark:hover:text-primary-300 font-medium font-bengali text-sm
                                 transition-colors"
                      >
                        সব দেখুন →
                      </a>
                    </div>

                    {categoryArticles.length > 0 ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {categoryArticles.slice(0, 6).map((article) => (
                            <ArticleCard
                              key={article._id}
                              article={article}
                              variant="default"
                            />
                          ))}
                        </div>

                        {categoryArticles.length >= 6 && (
                          <div className="text-center">
                            <button
                              onClick={() => loadMoreCategoryArticles(category.slug.current)}
                              disabled={loading}
                              className="btn-outline"
                            >
                              {loading ? 'লোড হচ্ছে...' : 'আরো দেখুন'}
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                      // Skeleton loader
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                          <ArticleCardSkeleton key={index} />
                        ))}
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8">
              {/* Trending Articles */}
              {trendingArticles.length > 0 && (
                <div className="card">
                  <div className="card-header">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="h-5 w-5 text-red-500" />
                      <h3 className="text-lg font-bold font-bengali text-gray-900 dark:text-white">
                        ট্রেন্ডিং
                      </h3>
                    </div>
                  </div>
                  <div className="card-body space-y-4">
                    {trendingArticles.slice(0, 5).map((article, index) => (
                      <div key={article._id} className="group">
                        <div className="flex space-x-3">
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center justify-center w-8 h-8 
                                           bg-primary-100 dark:bg-primary-900 text-primary-600 
                                           dark:text-primary-400 rounded-full text-sm font-bold">
                              {index + 1}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <a 
                              href={`/article/${article.slug.current}`}
                              className="block group-hover:text-primary-600 dark:group-hover:text-primary-400 
                                       transition-colors"
                            >
                              <h4 className="text-sm font-medium font-bengali text-gray-900 
                                           dark:text-white line-clamp-2 mb-1">
                                {article.title}
                              </h4>
                              <div className="flex items-center space-x-3 text-xs text-gray-500 
                                            dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-3 w-3" />
                                  <span>{getRelativeTime(article.publishedAt)}</span>
                                </div>
                                {article.views > 0 && (
                                  <div className="flex items-center space-x-1">
                                    <Eye className="h-3 w-3" />
                                    <span>{article.views}</span>
                                  </div>
                                )}
                              </div>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Newsletter Signup */}
              <div className="card bg-gradient-to-br from-primary-50 to-primary-100 
                            dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 
                            dark:border-primary-800">
                <div className="card-body text-center">
                  <div className="mb-4">
                    <div className="text-3xl mb-2">📧</div>
                    <h3 className="text-lg font-bold font-bengali text-gray-900 dark:text-white mb-2">
                      নিউজলেটার
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-bengali">
                      সর্বশেষ খবর সরাসরি আপনার ইনবক্সে পান
                    </p>
                  </div>
                  <form className="space-y-3">
                    <input
                      type="email"
                      placeholder="আপনার ইমেইল ঠিকানা"
                      className="input text-sm font-bengali"
                      required
                    />
                    <button type="submit" className="btn-primary w-full text-sm font-bengali">
                      সাবস্ক্রাইব করুন
                    </button>
                  </form>
                </div>
              </div>

              {/* Categories Quick Links */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-bold font-bengali text-gray-900 dark:text-white">
                    বিভাগসমূহ
                  </h3>
                </div>
                <div className="card-body">
                  <div className="space-y-2">
                    {initialCategories.map((category) => (
                      <a
                        key={category._id}
                        href={`/category/${category.slug.current}`}
                        className="flex items-center justify-between p-2 rounded-lg 
                                 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors group"
                      >
                        <span className="font-bengali text-sm text-gray-700 dark:text-gray-300 
                                       group-hover:text-primary-600 dark:group-hover:text-primary-400">
                          {category.title}
                        </span>
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: category.color || '#3b82f6' }}
                        ></div>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  try {
    const [featuredArticles, trendingArticles, categories] = await Promise.all([
      sanityFetch(QUERIES.featuredArticles),
      sanityFetch(QUERIES.trendingArticles),
      sanityFetch(QUERIES.categories)
    ]);

    // Fetch latest articles for each category
    const categoriesData = {};
    if (categories?.length) {
      await Promise.all(
        categories.map(async (category) => {
          const articles = await sanityFetch(
            QUERIES.latestByCategory(category.slug.current, 6)
          );
          categoriesData[category.slug.current] = articles || [];
        })
      );
    }

    return {
      props: {
        featuredArticles: featuredArticles || [],
        trendingArticles: trendingArticles || [],
        categoriesData,
        categories: categories || []
      }
    };
  } catch (error) {
    console.error('Error fetching homepage data:', error);
    return {
      props: {
        featuredArticles: [],
        trendingArticles: [],
        categoriesData: {},
        categories: []
      }
    };
  }
}