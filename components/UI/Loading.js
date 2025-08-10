import React from 'react';

const Loading = ({ text = 'লোড হচ্ছে...', size = 'default' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  const textSizeClasses = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-300 border-t-primary-600 mb-4`}></div>
      <p className={`${textSizeClasses[size]} text-gray-600 dark:text-gray-400 font-bengali`}>
        {text}
      </p>
    </div>
  );
};

export const LoadingSpinner = ({ size = 'default', className = '' }) => {
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    default: 'w-6 h-6 border-2',
    large: 'w-8 h-8 border-3'
  };

  return (
    <div 
      className={`
        ${sizeClasses[size]} 
        animate-spin rounded-full border-gray-300 border-t-primary-600 
        ${className}
      `}
    />
  );
};

export const LoadingDots = ({ className = '' }) => {
  return (
    <div className={`flex space-x-1 ${className}`}>
      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
      <div className="w-2 h-2 bg-primary-600 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
    </div>
  );
};

export const PageLoading = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 animate-spin rounded-full border-4 border-gray-300 border-t-primary-600 mb-4 mx-auto"></div>
        <h2 className="text-xl font-bold font-bengali text-gray-900 dark:text-white mb-2">
          লোড হচ্ছে...
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-bengali">
          অনুগ্রহ করে অপেক্ষা করুন
        </p>
      </div>
    </div>
  );
};

export default Loading;