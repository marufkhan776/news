import { useEffect, useState } from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import Footer from './Footer';
import BreakingNewsTicker from '../UI/BreakingNewsTicker';
import { sanityFetch, QUERIES } from '../../lib/sanity';

const Layout = ({ 
  children, 
  title = 'বাংলা নিউজ - সর্বশেষ সংবাদ',
  description = 'বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ, রাজনীতি, খেলাধুলা, বিনোদন, ব্যবসা ও অর্থনীতির খবর পান সবার আগে।',
  image,
  url,
  article,
  noIndex = false
}) => {
  const [categories, setCategories] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);

  useEffect(() => {
    // Fetch categories and breaking news for layout
    const fetchLayoutData = async () => {
      try {
        const [categoriesData, breakingNewsData] = await Promise.all([
          sanityFetch(QUERIES.categories),
          sanityFetch(QUERIES.breakingNews)
        ]);

        if (categoriesData) {
          setCategories(categoriesData);
        }
        if (breakingNewsData) {
          setBreakingNews(breakingNewsData);
        }
      } catch (error) {
        console.error('Error fetching layout data:', error);
      }
    };

    fetchLayoutData();
  }, []);

  // Generate structured data for articles
  const generateStructuredData = () => {
    if (!article) return null;

    const structuredData = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": article.title,
      "description": article.excerpt || description,
      "image": article.socialImage || article.mainImage ? [
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://banglanews.com'}${
          article.socialImage || article.mainImage
        }`
      ] : undefined,
      "datePublished": article.publishedAt,
      "dateModified": article._updatedAt || article.publishedAt,
      "author": {
        "@type": "Person",
        "name": article.author?.name || "বাংলা নিউজ"
      },
      "publisher": {
        "@type": "Organization",
        "name": "বাংলা নিউজ",
        "logo": {
          "@type": "ImageObject",
          "url": `${process.env.NEXT_PUBLIC_SITE_URL || 'https://banglanews.com'}/logo.png`
        }
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://banglanews.com'}`
      },
      "articleSection": article.category?.title,
      "keywords": article.tags?.join(', '),
      "inLanguage": "bn-BD"
    };

    return JSON.stringify(structuredData);
  };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://banglanews.com';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = image || `${siteUrl}/og-default.jpg`;

  return (
    <>
      <Head>
        {/* Primary Meta Tags */}
        <title>{title}</title>
        <meta name="title" content={title} />
        <meta name="description" content={description} />
        <meta name="language" content="Bengali" />
        <meta name="robots" content={noIndex ? "noindex,nofollow" : "index,follow"} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content={article ? "article" : "website"} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="বাংলা নিউজ" />
        <meta property="og:locale" content="bn_BD" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={fullUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content={ogImage} />

        {/* Article specific meta tags */}
        {article && (
          <>
            <meta property="article:published_time" content={article.publishedAt} />
            <meta property="article:modified_time" content={article._updatedAt || article.publishedAt} />
            <meta property="article:author" content={article.author?.name || "বাংলা নিউজ"} />
            <meta property="article:section" content={article.category?.title} />
            {article.tags?.map((tag, index) => (
              <meta key={index} property="article:tag" content={tag} />
            ))}
          </>
        )}

        {/* Canonical URL */}
        <link rel="canonical" href={fullUrl} />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+Bengali:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data */}
        {article && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: generateStructuredData() }}
          />
        )}

        {/* Additional meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta httpEquiv="Content-Language" content="bn" />
        <meta name="format-detection" content="telephone=no" />
      </Head>

      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
        {/* Breaking News Ticker */}
        <BreakingNewsTicker breakingNews={breakingNews} />
        
        {/* Navigation */}
        <Navbar categories={categories} />
        
        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>
        
        {/* Footer */}
        <Footer categories={categories} />
      </div>

      {/* Global Styles for Bangla Typography */}
      <style jsx global>{`
        /* Bengali font fallbacks */
        .font-bengali {
          font-family: 'Noto Serif Bengali', 'Kalpurush', 'SolaimanLipi', serif;
        }

        /* Line clamp utilities */
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }

        /* Dark mode scrollbar */
        .dark ::-webkit-scrollbar-track {
          background: #374151;
        }

        .dark ::-webkit-scrollbar-thumb {
          background: #6b7280;
        }

        .dark ::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }

        /* Focus outline for accessibility */
        .focus-visible:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* Typography improvements for Bangla text */
        .prose-bengali {
          line-height: 1.8;
          font-feature-settings: "liga" 1, "calt" 1;
        }

        .prose-bengali h1,
        .prose-bengali h2,
        .prose-bengali h3,
        .prose-bengali h4,
        .prose-bengali h5,
        .prose-bengali h6 {
          font-weight: 600;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
        }

        .prose-bengali p {
          margin-bottom: 1.2em;
        }

        /* Print styles */
        @media print {
          .no-print {
            display: none !important;
          }
          
          body {
            background: white !important;
            color: black !important;
          }
        }
      `}</style>
    </>
  );
};

export default Layout;