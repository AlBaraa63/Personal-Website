// Error handling utilities for the portfolio application

export interface ApiError extends Error {
  status?: number;
  code?: string;
}

/**
 * Creates a standardized error with additional context
 */
export const createError = (message: string, status?: number, code?: string): ApiError => {
  const error = new Error(message) as ApiError;
  error.status = status;
  error.code = code;
  return error;
};

/**
 * Handles image loading errors with fallback
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackSrc?: string
) => {
  const img = event.currentTarget;
  
  if (img.src !== (fallbackSrc || '/assets/images/placeholder.svg')) {
    img.src = fallbackSrc || '/assets/images/placeholder.svg';
    img.onerror = null; // Prevent infinite loop
  }
};

/**
 * Retry function with exponential backoff
 */
export const withRetry = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
};

/**
 * Safe async operation wrapper
 */
export const safeAsync = async <T>(
  operation: () => Promise<T>,
  fallback?: T
): Promise<T | undefined> => {
  try {
    return await operation();
  } catch (error) {
    console.error('Safe async operation failed:', error);
    return fallback;
  }
};

/**
 * Network status checker
 */
export const isOnline = (): boolean => {
  return navigator.onLine;
};

/**
 * Local storage safe operations
 */
export const safeLocalStorage = {
  get: (key: string, fallback?: string): string | undefined => {
    try {
      return localStorage.getItem(key) || fallback;
    } catch {
      return fallback;
    }
  },
  
  set: (key: string, value: string): boolean => {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key: string): boolean => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

/**
 * Email validation with better error messages
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  
  // Check for common typos
  const commonDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
  const domain = email.split('@')[1]?.toLowerCase();
  
  if (domain && !commonDomains.includes(domain) && domain.includes('.co')) {
    // Suggest common domain if it looks like a typo
    const suggestion = commonDomains.find(d => 
      domain.replace('.co', '.com') === d
    );
    if (suggestion) {
      return { 
        isValid: false, 
        error: `Did you mean ${email.replace(domain, suggestion)}?` 
      };
    }
  }
  
  return { isValid: true };
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Performance monitoring utility
 */
export const measurePerformance = (name: string, fn: () => void): number => {
  const start = performance.now();
  fn();
  const end = performance.now();
  const duration = end - start;
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`${name} took ${duration.toFixed(2)}ms`);
  }
  
  return duration;
};
