import React, { useState, useEffect, memo } from 'react';

/**
 * Optimized Image component with lazy loading and caching
 */
const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = '', 
  fallbackInitials = '',
  fallbackClassName = '',
  loading = 'lazy',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Reset state when src changes
    setIsLoaded(false);
    setHasError(false);
  }, [src]);

  if (!src || hasError) {
    // Show initials fallback
    if (fallbackInitials) {
      return (
        <div 
          className={`flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 ${fallbackClassName || className}`}
          {...props}
        >
          <span className="text-2xl font-bold text-gray-600">
            {fallbackInitials}
          </span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="relative">
      {!isLoaded && (
        <div 
          className={`absolute inset-0 bg-gray-200 animate-pulse ${className}`}
          style={{ borderRadius: 'inherit' }}
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding="async"
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        {...props}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

export default OptimizedImage;
