import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Search, X } from 'lucide-react';
import { sanitizeSearchQuery } from '../../lib/utils';

const SearchBar = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    if (isExpanded && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isExpanded]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanQuery = sanitizeSearchQuery(query);
    
    if (cleanQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(cleanQuery)}`);
      setQuery('');
      setIsExpanded(false);
      if (onClose) onClose();
    }
  };

  const handleClear = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const expandSearch = () => {
    setIsExpanded(true);
  };

  const collapseSearch = () => {
    setIsExpanded(false);
    setQuery('');
  };

  // Mobile version
  if (onClose) {
    return (
      <form onSubmit={handleSubmit} className="relative w-full">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="খবর খুঁজুন..."
            className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                     placeholder-gray-500 dark:placeholder-gray-400
                     focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                     font-bengali"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 
                       text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </form>
    );
  }

  // Desktop version
  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className={`transition-all duration-300 ${
        isExpanded ? 'w-80' : 'w-10'
      }`}>
        {!isExpanded ? (
          <button
            type="button"
            onClick={expandSearch}
            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
                     flex items-center justify-center transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        ) : (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onBlur={() => {
                if (!query) {
                  setTimeout(() => setIsExpanded(false), 150);
                }
              }}
              placeholder="খবর খুঁজুন..."
              className="w-full pl-10 pr-10 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                       font-bengali text-sm"
              autoComplete="off"
            />
            <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={collapseSearch}
                className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </form>
  );
};

export default SearchBar;