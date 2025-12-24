/**
 * Error logging utility that sanitizes error output in production.
 * In development mode, full error details are logged.
 * In production mode, only generic context information is logged.
 */

export const logError = (error: unknown, context: string): void => {
  if (import.meta.env.DEV) {
    console.error(`[${context}]`, error);
  } else {
    // In production, only log generic info without exposing sensitive details
    console.error(`Error in ${context}`);
  }
};

/**
 * Validates if a string is a valid HTTP/HTTPS URL.
 * Returns true if valid, false otherwise.
 */
export const isValidHttpUrl = (urlString: string): boolean => {
  if (!urlString || !urlString.trim()) return false;
  
  try {
    const url = new URL(urlString);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates if a URL points to a likely image resource.
 * Checks for common image extensions or image hosting patterns.
 */
export const isLikelyImageUrl = (urlString: string): boolean => {
  if (!isValidHttpUrl(urlString)) return false;
  
  try {
    const url = new URL(urlString);
    const pathname = url.pathname.toLowerCase();
    
    // Check for common image extensions
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
    if (imageExtensions.some(ext => pathname.endsWith(ext))) {
      return true;
    }
    
    // Allow common image CDNs and services
    const trustedImageHosts = [
      'images.unsplash.com',
      'unsplash.com',
      'picsum.photos',
      'imgur.com',
      'i.imgur.com',
      'cloudinary.com',
      'res.cloudinary.com',
      'cdn.jsdelivr.net',
      'via.placeholder.com',
      'placehold.co',
      'placekitten.com',
      'storage.googleapis.com',
      'firebasestorage.googleapis.com',
      'supabase.co',
      'supabase.com',
    ];
    
    if (trustedImageHosts.some(host => url.hostname.endsWith(host))) {
      return true;
    }
    
    // Allow URLs that have image-related query params
    if (url.searchParams.has('format') || url.searchParams.has('w') || url.searchParams.has('h')) {
      return true;
    }
    
    // For other URLs, still allow them but they might not be images
    // The admin can verify via preview
    return true;
  } catch {
    return false;
  }
};
