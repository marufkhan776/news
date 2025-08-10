import Link from 'next/link';
import Layout from '../components/Layout/Layout';

export default function Custom404() {
  return (
    <Layout 
      title="পৃষ্ঠা পাওয়া যায়নি - বাংলা নিউজ" 
      description="দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি।"
      noIndex={true}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center px-4">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="text-8xl mb-4">🔍</div>
            <div className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              ৪০৪
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl md:text-4xl font-bold font-bengali text-gray-900 dark:text-white mb-4">
            পৃষ্ঠা পাওয়া যায়নি
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 font-bengali mb-8 max-w-md mx-auto">
            দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা পাওয়া যায়নি। 
            এটি সরানো বা মুছে ফেলা হতে পারে।
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary text-center"
            >
              <span className="font-bengali">🏠 হোমপেজে ফিরুন</span>
            </Link>
            
            <Link
              href="/search"
              className="btn-outline text-center"
            >
              <span className="font-bengali">🔍 খবর খুঁজুন</span>
            </Link>
          </div>

          {/* Popular Categories */}
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-bold font-bengali text-gray-900 dark:text-white mb-4">
              জনপ্রিয় বিভাগ
            </h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                { name: 'জাতীয়', slug: 'national' },
                { name: 'আন্তর্জাতিক', slug: 'international' },
                { name: 'রাজনীতি', slug: 'politics' },
                { name: 'খেলা', slug: 'sports' },
                { name: 'ব্যবসা', slug: 'business' },
                { name: 'বিনোদন', slug: 'entertainment' }
              ].map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                           text-gray-700 dark:text-gray-300 rounded-lg text-sm font-bengali 
                           transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 font-bengali">
            <p>যদি আপনি মনে করেন এটি একটি ত্রুটি, তাহলে দয়া করে আমাদের সাথে যোগাযোগ করুন।</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}