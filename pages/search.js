import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search, Clock } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import ArticleCard, { ArticleCardSkeleton } from '../components/Article/ArticleCard';
import { sanityFetch, QUERIES } from '../lib/sanity';
import { sanitizeSearchQuery } from '../lib/utils';

export default function SearchPage({ initialResults = [], initialQuery = '' }) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const router = useRouter();

  useEffect(() => {
    // Update state when URL query changes
    const { q } = router.query;
    if (q && q !== searchQuery) {
      setSearchQuery(q);
      setHasSearched(true);
      performSearch(q);
    }
  }, [router.query]);

  const performSearch = async (query) => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const cleanQuery = sanitizeSearchQuery(query);
      const results = await sanityFetch(QUERIES.searchArticles(cleanQuery));
      setSearchResults(results || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    
    if (query) {
      setHasSearched(true);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    router.push('/search');
  };

  return (
    <Layout
      title={hasSearched ? `"${searchQuery}" - অনুসন্ধান ফলাফল` : 'অনুসন্ধান - বাংলা নিউজ'}
      description={hasSearched ? `"${searchQuery}" এর জন্য অনুসন্ধান ফলাফল` : 'বাংলা নিউজে খবর ও নিবন্ধ অনুসন্ধান করুন'}
      url="/search"
      noIndex={hasSearched}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Search Header */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔍</div>
              <h1 className="text-3xl font-bold font-bengali text-gray-900 dark:text-white mb-2">
                অনুসন্ধান করুন
              </h1>
              <p className="text-gray-600 dark:text-gray-400 font-bengali">
                সংবাদ ও নিবন্ধ খুঁজে পেতে বাংলা বা ইংরেজিতে লিখুন
              </p>
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
                  placeholder="খবর খুঁজুন... (যেমন: রাজনীতি, খেলা, অর্থনীতি)"
                  className="w-full pl-12 pr-24 py-4 text-lg border border-gray-300 dark:border-gray-600 
                           rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                           placeholder-gray-500 dark:placeholder-gray-400
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                           font-bengali shadow-sm"
                  autoComplete="off"
                  autoFocus
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={clearSearch}
                      className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-sm font-bengali"
                    >
                      পরিষ্কার করুন
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!searchQuery.trim() || loading}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 
                             disabled:opacity-50 disabled:cursor-not-allowed font-bengali text-sm
                             transition-colors"
                  >
                    {loading ? 'খুঁজছি...' : 'খুঁজুন'}
                  </button>
                </div>
              </div>
            </form>

            {/* Search Suggestions */}
            {!hasSearched && (
              <div className="mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400 font-bengali mb-3">
                  জনপ্রিয় অনুসন্ধান:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['রাজনীতি', 'খেলাধুলা', 'অর্থনীতি', 'প্রযুক্তি', 'বিনোদন'].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        setSearchQuery(suggestion);
                        router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                      }}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                               rounded-full text-sm hover:bg-gray-200 dark:hover:bg-gray-600 
                               transition-colors font-bengali"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Search Results */}
          {hasSearched && (
            <div className="max-w-6xl mx-auto">
              {/* Results Header */}
              <div className="mb-6">
                <h2 className="text-xl font-bold font-bengali text-gray-900 dark:text-white mb-2">
                  "{searchQuery}" এর অনুসন্ধান ফলাফল
                </h2>
                {!loading && (
                  <p className="text-gray-600 dark:text-gray-400 font-bengali">
                    {searchResults.length > 0 
                      ? `${searchResults.length}টি ফলাফল পাওয়া গেছে`
                      : 'কোনো ফলাফল পাওয়া যায়নি'
                    }
                  </p>
                )}
              </div>

              {/* Loading State */}
              {loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, index) => (
                    <ArticleCardSkeleton key={index} />
                  ))}
                </div>
              )}

              {/* Search Results */}
              {!loading && searchResults.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {searchResults.map((article) => (
                    <ArticleCard
                      key={article._id}
                      article={article}
                      variant="default"
                    />
                  ))}
                </div>
              )}

              {/* No Results */}
              {!loading && hasSearched && searchResults.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold font-bengali text-gray-900 dark:text-white mb-2">
                    কোনো ফলাফল পাওয়া যায়নি
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 font-bengali mb-6 max-w-md mx-auto">
                    "{searchQuery}" এর জন্য কোনো নিবন্ধ পাওয়া যায়নি। 
                    অন্য শব্দ দিয়ে চেষ্টা করুন বা বানান পরীক্ষা করুন।
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300 font-bengali mb-2">
                        পরামর্শ:
                      </p>
                      <ul className="text-sm text-gray-600 dark:text-gray-400 font-bengali space-y-1">
                        <li>• বানান পরীক্ষা করুন</li>
                        <li>• আরো সাধারণ শব্দ ব্যবহার করুন</li>
                        <li>• সমার্থক শব্দ চেষ্টা করুন</li>
                        <li>• কম শব্দ ব্যবহার করুন</li>
                      </ul>
                    </div>
                    
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        document.querySelector('input[type="text"]').focus();
                      }}
                      className="btn-outline"
                    >
                      নতুন অনুসন্ধান করুন
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Recent Articles (when no search performed) */}
          {!hasSearched && (
            <div className="max-w-6xl mx-auto mt-12">
              <h2 className="text-2xl font-bold font-bengali text-gray-900 dark:text-white mb-6">
                সাম্প্রতিক নিবন্ধ
              </h2>
              {/* This would show recent articles - placeholder for now */}
              <div className="text-center py-8 text-gray-500 dark:text-gray-400 font-bengali">
                সাম্প্রতিক নিবন্ধগুলি এখানে দেখানো হবে
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ query }) {
  const searchQuery = query.q || '';

  if (!searchQuery) {
    return {
      props: {
        initialResults: [],
        initialQuery: '',
      },
    };
  }

  try {
    const cleanQuery = sanitizeSearchQuery(searchQuery);
    const results = await sanityFetch(QUERIES.searchArticles(cleanQuery));

    return {
      props: {
        initialResults: results || [],
        initialQuery: searchQuery,
      },
    };
  } catch (error) {
    console.error('Search error:', error);
    return {
      props: {
        initialResults: [],
        initialQuery: searchQuery,
      },
    };
  }
}