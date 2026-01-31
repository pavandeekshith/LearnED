/**
 * Image caching utility for LearnED
 * Preloads and caches images for faster page loads
 */

// List of images to preload
const imagesToPreload = [
  '/rahul.png',
  '/sayan.png',
  '/hrishitha.png',
  '/dharsanya.png',
  '/namrata.png',
  '/Deekshith.jpeg',
  '/LearnED black.png'
];

// Image cache storage
const imageCache = new Map();

/**
 * Preload a single image and store in cache
 */
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    if (imageCache.has(src)) {
      resolve(imageCache.get(src));
      return;
    }

    const img = new Image();
    img.onload = () => {
      imageCache.set(src, img);
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
};

/**
 * Preload all critical images
 */
export const preloadAllImages = async () => {
  try {
    await Promise.all(imagesToPreload.map(preloadImage));
    console.log('All images preloaded successfully');
  } catch (error) {
    console.warn('Some images failed to preload:', error);
  }
};

/**
 * Get cached image or load it
 */
export const getCachedImage = (src) => {
  return imageCache.get(src);
};

/**
 * Check if image is cached
 */
export const isImageCached = (src) => {
  return imageCache.has(src);
};

export default {
  preloadImage,
  preloadAllImages,
  getCachedImage,
  isImageCached
};
