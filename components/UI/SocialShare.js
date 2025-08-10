import { useState } from 'react';
import { Share2, Facebook, Twitter, MessageCircle, Copy, Check } from 'lucide-react';
import { getSocialShareUrls } from '../../lib/utils';

const SocialShare = ({ url, title, className = '' }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
  const shareUrls = getSocialShareUrls(fullUrl, title);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleShare = (platform, shareUrl) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
    setShowShareMenu(false);
  };

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: shareUrls.facebook,
      bgColor: 'bg-blue-600 hover:bg-blue-700',
      label: 'ফেসবুকে শেয়ার করুন'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: shareUrls.twitter,
      bgColor: 'bg-sky-500 hover:bg-sky-600',
      label: 'টুইটারে শেয়ার করুন'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: shareUrls.whatsapp,
      bgColor: 'bg-green-500 hover:bg-green-600',
      label: 'হোয়াটসঅ্যাপে শেয়ার করুন'
    }
  ];

  return (
    <div className={`relative ${className}`}>
      {/* Share Button */}
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 
                 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg transition-colors"
        aria-label="Share article"
      >
        <Share2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-bengali">
          শেয়ার করুন
        </span>
      </button>

      {/* Share Menu */}
      {showShareMenu && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowShareMenu(false)}
          />
          
          {/* Share Options */}
          <div className="absolute top-full mt-2 right-0 z-50 w-64 bg-white dark:bg-gray-800 
                        rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 
                        animate-fade-in">
            <div className="p-4">
              <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-3 font-bengali">
                শেয়ার করুন
              </h3>
              
              {/* Social Share Buttons */}
              <div className="space-y-2 mb-3">
                {shareOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => handleShare(option.name, option.url)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg 
                      text-white transition-colors ${option.bgColor}
                    `}
                  >
                    <option.icon className="h-5 w-5" />
                    <span className="text-sm font-bengali">{option.label}</span>
                  </button>
                ))}
              </div>

              {/* Copy Link */}
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg 
                           bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 
                           text-gray-700 dark:text-gray-300 transition-colors"
                >
                  {copied ? (
                    <Check className="h-5 w-5 text-green-600" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                  <span className="text-sm font-bengali">
                    {copied ? 'কপি হয়েছে!' : 'লিংক কপি করুন'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Simplified inline social share for article pages
export const InlineSocialShare = ({ url, title }) => {
  const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
  const shareUrls = getSocialShareUrls(fullUrl, title);

  const socialButtons = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: shareUrls.facebook,
      bgColor: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: shareUrls.twitter,
      bgColor: 'bg-sky-500 hover:bg-sky-600'
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      url: shareUrls.whatsapp,
      bgColor: 'bg-green-500 hover:bg-green-600'
    }
  ];

  const handleShare = (platform, shareUrl) => {
    window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300 font-bengali mr-2">
        শেয়ার:
      </span>
      {socialButtons.map((button) => (
        <button
          key={button.name}
          onClick={() => handleShare(button.name, button.url)}
          className={`
            p-2 rounded-lg text-white transition-colors ${button.bgColor}
          `}
          aria-label={`Share on ${button.name}`}
        >
          <button.icon className="h-4 w-4" />
        </button>
      ))}
    </div>
  );
};

export default SocialShare;