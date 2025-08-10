import Link from 'next/link';
import Layout from '../components/Layout/Layout';

export default function Custom500() {
  return (
    <Layout 
      title="সার্ভার ত্রুটি - বাংলা নিউজ" 
      description="দুঃখিত, সার্ভারে একটি সমস্যা হয়েছে।"
      noIndex={true}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center px-4">
          {/* Error Icon */}
          <div className="mb-8">
            <div className="text-8xl mb-4">⚠️</div>
            <div className="text-6xl font-bold text-red-600 dark:text-red-400 mb-4">
              ৫০০
            </div>
          </div>

          {/* Error Message */}
          <h1 className="text-3xl md:text-4xl font-bold font-bengali text-gray-900 dark:text-white mb-4">
            সার্ভার ত্রুটি
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 font-bengali mb-8 max-w-md mx-auto">
            দুঃখিত, সার্ভারে একটি সমস্যা হয়েছে। 
            আমরা এই সমস্যাটি ঠিক করার চেষ্টা করছি।
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="btn-primary text-center"
            >
              <span className="font-bengali">🏠 হোমপেজে ফিরুন</span>
            </Link>
            
            <button
              onClick={() => window.location.reload()}
              className="btn-outline text-center"
            >
              <span className="font-bengali">🔄 পৃষ্ঠা রিফ্রেশ করুন</span>
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 font-bengali">
            <p>সমস্যা অব্যাহত থাকলে, দয়া করে কিছুক্ষণ পর আবার চেষ্টা করুন।</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}