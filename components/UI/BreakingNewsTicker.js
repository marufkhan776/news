import { useState, useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, X } from 'lucide-react';

const BreakingNewsTicker = ({ breakingNews = [] }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  // Don't render if no breaking news
  if (!breakingNews.length || !isVisible) return null;

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <div className="bg-red-600 text-white py-2 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          {/* Breaking News Label */}
          <div className="flex items-center bg-red-700 px-3 py-1 rounded-md mr-4 flex-shrink-0">
            <AlertCircle className="h-4 w-4 mr-2 animate-pulse" />
            <span className="font-bold text-sm font-bengali">ব্রেকিং নিউজ</span>
          </div>

          {/* Scrolling News Container */}
          <div 
            className="flex-1 overflow-hidden"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className={`
              flex animate-slide-left whitespace-nowrap
              ${isPaused ? 'pause-animation' : ''}
            `}>
              {/* Duplicate the list for seamless infinite scroll */}
              {[...breakingNews, ...breakingNews].map((news, index) => (
                <Link
                  key={`${news._id}-${index}`}
                  href={`/article/${news.slug.current}`}
                  className="inline-block mr-8 hover:text-red-200 transition-colors"
                >
                  <span className="font-bengali text-sm">
                    🔴 {news.title}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="ml-4 p-1 rounded-full hover:bg-red-700 transition-colors flex-shrink-0"
            aria-label="Close breaking news"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakingNewsTicker;