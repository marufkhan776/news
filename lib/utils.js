import moment from 'moment';

// Configure moment for Bangla locale
moment.updateLocale('bn', {
  months: [
    'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
    'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
  ],
  monthsShort: [
    'জানু', 'ফেব', 'মার্চ', 'এপ্র', 'মে', 'জুন',
    'জুলাই', 'আগ', 'সেপ্ট', 'অক্ট', 'নভে', 'ডিসে'
  ],
  weekdays: [
    'রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'
  ],
  weekdaysShort: ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'],
  weekdaysMin: ['র', 'সো', 'ম', 'বু', 'বৃ', 'শু', 'শ'],
});

// Convert English numbers to Bangla numbers
export function toBanglaNumber(number) {
  const banglaDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return number.toString().replace(/\d/g, (digit) => banglaDigits[parseInt(digit)]);
}

// Format date in Bangla
export function formatBanglaDate(date, format = 'DD MMMM YYYY') {
  const formattedDate = moment(date).locale('bn').format(format);
  return toBanglaNumber(formattedDate);
}

// Get relative time in Bangla
export function getRelativeTime(date) {
  const now = moment();
  const target = moment(date);
  const diffInMinutes = now.diff(target, 'minutes');
  const diffInHours = now.diff(target, 'hours');
  const diffInDays = now.diff(target, 'days');

  if (diffInMinutes < 1) {
    return 'এখনই';
  } else if (diffInMinutes < 60) {
    return `${toBanglaNumber(diffInMinutes)} মিনিট আগে`;
  } else if (diffInHours < 24) {
    return `${toBanglaNumber(diffInHours)} ঘন্টা আগে`;
  } else if (diffInDays < 7) {
    return `${toBanglaNumber(diffInDays)} দিন আগে`;
  } else {
    return formatBanglaDate(date, 'DD MMMM YYYY');
  }
}

// Truncate text with proper Bangla word boundaries
export function truncateText(text, maxLength = 150) {
  if (!text || text.length <= maxLength) return text;
  
  const truncated = text.substring(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.substring(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

// Extract plain text from Portable Text (Sanity rich text)
export function extractPlainText(portableText) {
  if (!portableText) return '';
  
  return portableText
    .map((block) => {
      if (block._type !== 'block' || !block.children) {
        return '';
      }
      return block.children.map((child) => child.text).join('');
    })
    .join(' ');
}

// Generate reading time estimate
export function calculateReadingTime(text) {
  const wordsPerMinute = 200; // Average reading speed
  const words = text.trim().split(/\s+/).length;
  const readingTime = Math.ceil(words / wordsPerMinute);
  
  return `${toBanglaNumber(readingTime)} মিনিট পড়ার সময়`;
}

// Generate excerpt from content
export function generateExcerpt(content, maxLength = 200) {
  let text = '';
  
  if (typeof content === 'string') {
    text = content;
  } else if (Array.isArray(content)) {
    text = extractPlainText(content);
  }
  
  return truncateText(text, maxLength);
}

// Sanitize and format search query
export function sanitizeSearchQuery(query) {
  if (!query) return '';
  
  return query
    .trim()
    .replace(/[^\u0980-\u09FF\w\s]/g, '') // Allow Bangla characters, English letters, and spaces
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
}

// Category mapping for URL generation
export const categoryMapping = {
  'জাতীয়': 'national',
  'আন্তর্জাতিক': 'international',
  'রাজনীতি': 'politics',
  'খেলা': 'sports',
  'ব্যবসা': 'business',
  'বিনোদন': 'entertainment',
  'প্রযুক্তি': 'technology',
  'লাইফস্টাইল': 'lifestyle',
  'মতামত': 'opinion'
};

// Generate SEO-friendly URL slug
export function generateSlug(title) {
  if (!title) return '';
  
  let slug = title.toLowerCase();
  
  // Replace Bangla category names with English equivalents
  Object.keys(categoryMapping).forEach(bangla => {
    slug = slug.replace(new RegExp(bangla, 'g'), categoryMapping[bangla]);
  });
  
  // Clean up the slug
  return slug
    .replace(/[^a-z0-9\u0980-\u09FF]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Format view count
export function formatViewCount(views) {
  if (!views || views === 0) return '০';
  
  if (views < 1000) {
    return toBanglaNumber(views);
  } else if (views < 100000) {
    const thousands = Math.floor(views / 1000);
    return `${toBanglaNumber(thousands)}হাজার`;
  } else if (views < 10000000) {
    const lakhs = Math.floor(views / 100000);
    return `${toBanglaNumber(lakhs)}লাখ`;
  } else {
    const crores = Math.floor(views / 10000000);
    return `${toBanglaNumber(crores)}কোটি`;
  }
}

// Check if string contains Bangla characters
export function containsBangla(text) {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
}

// Theme utilities
export function getSystemTheme() {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

export function setTheme(theme) {
  if (typeof window !== 'undefined') {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }
}

export function getStoredTheme() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('theme') || getSystemTheme();
  }
  return 'light';
}

// Social share URLs
export function getSocialShareUrls(url, title) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
  };
}

// Pagination utilities
export function generatePagination(currentPage, totalPages, delta = 2) {
  const pages = [];
  const rangeStart = Math.max(2, currentPage - delta);
  const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

  if (totalPages <= 1) return [1];

  // Always include first page
  pages.push(1);

  // Add ellipsis if there's a gap
  if (rangeStart > 2) {
    pages.push('...');
  }

  // Add pages in range
  for (let i = rangeStart; i <= rangeEnd; i++) {
    pages.push(i);
  }

  // Add ellipsis if there's a gap
  if (rangeEnd < totalPages - 1) {
    pages.push('...');
  }

  // Always include last page if there's more than one page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}