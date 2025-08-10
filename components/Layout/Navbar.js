import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import SearchBar from '../UI/SearchBar';

const Navbar = ({ categories = [] }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [router.pathname]);

  const isActiveCategory = (categorySlug) => {
    return router.pathname === '/category/[slug]' && router.query.slug === categorySlug;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-lg' 
          : 'bg-white dark:bg-gray-900'
      }`}>
        {/* Top Bar */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  📰
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold font-bengali text-gray-900 dark:text-white">
                    বাংলা নিউজ
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    সর্বশেষ সংবাদ
                  </p>
                </div>
              </Link>

              {/* Desktop Actions */}
              <div className="hidden md:flex items-center space-x-4">
                <SearchBar />
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>

              {/* Mobile Actions */}
              <div className="md:hidden flex items-center space-x-2">
                <button
                  onClick={toggleSearch}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                  aria-label="Menu"
                >
                  {isMenuOpen ? (
                    <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Menu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            <div className="container mx-auto px-4 py-3">
              <SearchBar onClose={() => setIsSearchOpen(false)} />
            </div>
          </div>
        )}

        {/* Categories Navigation */}
        <div className="hidden lg:block border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex items-center space-x-8 py-2 overflow-x-auto">
              <Link
                href="/"
                className={`text-sm font-medium whitespace-nowrap py-2 border-b-2 transition-colors ${
                  router.pathname === '/'
                    ? 'text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400'
                    : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                হোম
              </Link>
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/category/${category.slug.current}`}
                  className={`text-sm font-medium font-bengali whitespace-nowrap py-2 border-b-2 transition-colors ${
                    isActiveCategory(category.slug.current)
                      ? 'text-primary-600 dark:text-primary-400 border-primary-600 dark:border-primary-400'
                      : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {category.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={toggleMenu} />
          <div className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-gray-900 shadow-xl transform transition-transform duration-300 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold font-bengali text-gray-900 dark:text-white">
                  মেনু
                </h2>
                <button
                  onClick={toggleMenu}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
                >
                  <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                </button>
              </div>

              <div className="space-y-2">
                <Link
                  href="/"
                  className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                    router.pathname === '/'
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  🏠 হোম
                </Link>
                {categories.map((category) => (
                  <Link
                    key={category._id}
                    href={`/category/${category.slug.current}`}
                    className={`block px-4 py-3 rounded-lg font-medium font-bengali transition-colors ${
                      isActiveCategory(category.slug.current)
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {category.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Spacer for fixed navbar */}
      <div className="h-16 lg:h-24" />
    </>
  );
};

export default Navbar;