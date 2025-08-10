import Link from 'next/link';
import { useState } from 'react';
import { Facebook, Twitter, Youtube, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { formatBanglaDate } from '../../lib/utils';

const Footer = ({ categories = [] }) => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsSubscribing(true);
    
    try {
      // Newsletter subscription logic would go here
      // For now, just simulate success
      setTimeout(() => {
        setSubscriptionMessage('সফলভাবে নিউজলেটার সাবস্ক্রাইব করেছেন!');
        setEmail('');
        setIsSubscribing(false);
        setTimeout(() => setSubscriptionMessage(''), 3000);
      }, 1000);
    } catch (error) {
      setSubscriptionMessage('একটি সমস্যা হয়েছে, আবার চেষ্টা করুন।');
      setIsSubscribing(false);
      setTimeout(() => setSubscriptionMessage(''), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="text-2xl">📰</div>
              <div>
                <h3 className="text-xl font-bold font-bengali">বাংলা নিউজ</h3>
                <p className="text-sm text-gray-400">সর্বশেষ সংবাদ</p>
              </div>
            </div>
            <p className="text-gray-300 font-bengali text-sm leading-relaxed">
              বাংলাদেশ ও বিশ্বের সর্বশেষ সংবাদ, রাজনীতি, খেলাধুলা, বিনোদন, 
              ব্যবসা ও অর্থনীতির খবর পান সবার আগে।
            </p>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-sky-500 hover:bg-sky-600 rounded-lg transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-pink-600 hover:bg-pink-700 rounded-lg transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-bengali">দ্রুত লিংক</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors font-bengali"
                >
                  হোম
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-300 hover:text-white transition-colors font-bengali"
                >
                  আমাদের সম্পর্কে
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-300 hover:text-white transition-colors font-bengali"
                >
                  যোগাযোগ
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-300 hover:text-white transition-colors font-bengali"
                >
                  গোপনীয়তা নীতি
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-300 hover:text-white transition-colors font-bengali"
                >
                  ব্যবহারের শর্তাবলী
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-bengali">বিভাগসমূহ</h4>
            <ul className="space-y-2">
              {categories.slice(0, 6).map((category) => (
                <li key={category._id}>
                  <Link
                    href={`/category/${category.slug.current}`}
                    className="text-gray-300 hover:text-white transition-colors font-bengali"
                  >
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold font-bengali">নিউজলেটার</h4>
            <p className="text-gray-300 text-sm font-bengali">
              সর্বশেষ খবর পেতে আমাদের নিউজলেটার সাবস্ক্রাইব করুন।
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="আপনার ইমেইল ঠিকানা"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg 
                           text-white placeholder-gray-400 font-bengali
                           focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isSubscribing}
                className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 
                         text-white font-medium rounded-lg transition-colors font-bengali"
              >
                {isSubscribing ? 'অপেক্ষা করুন...' : 'সাবস্ক্রাইব করুন'}
              </button>
            </form>

            {subscriptionMessage && (
              <p className={`text-sm font-bengali ${
                subscriptionMessage.includes('সফলভাবে') 
                  ? 'text-green-400' 
                  : 'text-red-400'
              }`}>
                {subscriptionMessage}
              </p>
            )}

            {/* Contact Info */}
            <div className="pt-4 space-y-2">
              <h5 className="font-bold font-bengali">যোগাযোগ</h5>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Phone className="h-4 w-4" />
                <span>+৮৮০ ১৭১২ ৩৪৫৬৭২</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300 text-sm">
                <Mail className="h-4 w-4" />
                <span>info@banglanews.com</span>
              </div>
              <div className="flex items-start space-x-2 text-gray-300 text-sm">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span className="font-bengali">ঢাকা, বাংলাদেশ</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm font-bengali">
              © {currentYear} বাংলা নিউজ। সকল অধিকার সংরক্ষিত।
            </div>
            <div className="text-gray-400 text-sm">
              আজ: {formatBanglaDate(new Date(), 'dddd, DD MMMM YYYY')}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;