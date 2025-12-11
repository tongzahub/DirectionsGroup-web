/**
 * Smooth Scroll Utilities
 * Enhanced smooth scrolling with performance optimization
 */

export interface SmoothScrollOptions {
  duration?: number;
  easing?: 'linear' | 'easeInOut' | 'easeOut' | 'easeIn';
  offset?: number;
  callback?: () => void;
}

// Easing functions
const easingFunctions = {
  linear: (t: number) => t,
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOut: (t: number) => t * (2 - t),
  easeIn: (t: number) => t * t,
};

/**
 * Smooth scroll to element
 */
export const scrollToElement = (
  element: HTMLElement | string,
  options: SmoothScrollOptions = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const {
      duration = 800,
      easing = 'easeInOut',
      offset = 0,
      callback,
    } = options;

    const targetElement = typeof element === 'string' 
      ? document.querySelector(element) as HTMLElement
      : element;

    if (!targetElement) {
      console.warn('Target element not found');
      resolve();
      return;
    }

    const startPosition = window.pageYOffset;
    const targetPosition = targetElement.offsetTop - offset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    const easingFunction = easingFunctions[easing];

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easingFunction(progress);
      
      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        callback?.();
        resolve();
      }
    };

    requestAnimationFrame(animateScroll);
  });
};

/**
 * Smooth scroll to top
 */
export const scrollToTop = (options: SmoothScrollOptions = {}): Promise<void> => {
  return new Promise((resolve) => {
    const {
      duration = 600,
      easing = 'easeOut',
      callback,
    } = options;

    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    const easingFunction = easingFunctions[easing];

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easingFunction(progress);
      
      window.scrollTo(0, startPosition * (1 - easedProgress));

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        callback?.();
        resolve();
      }
    };

    requestAnimationFrame(animateScroll);
  });
};

/**
 * Smooth scroll by distance
 */
export const scrollByDistance = (
  distance: number,
  options: SmoothScrollOptions = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const {
      duration = 400,
      easing = 'easeInOut',
      callback,
    } = options;

    const startPosition = window.pageYOffset;
    const startTime = performance.now();
    const easingFunction = easingFunctions[easing];

    const animateScroll = (currentTime: number) => {
      const timeElapsed = currentTime - startTime;
      const progress = Math.min(timeElapsed / duration, 1);
      const easedProgress = easingFunction(progress);
      
      window.scrollTo(0, startPosition + distance * easedProgress);

      if (progress < 1) {
        requestAnimationFrame(animateScroll);
      } else {
        callback?.();
        resolve();
      }
    };

    requestAnimationFrame(animateScroll);
  });
};

/**
 * Check if element is in viewport
 */
export const isElementInViewport = (
  element: HTMLElement,
  threshold: number = 0
): boolean => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
};

/**
 * Get scroll progress of element
 */
export const getElementScrollProgress = (element: HTMLElement): number => {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  
  if (rect.top > windowHeight) return 0;
  if (rect.bottom < 0) return 1;
  
  const elementHeight = rect.height;
  const visibleHeight = Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);
  
  return visibleHeight / elementHeight;
};

/**
 * Throttle scroll events for performance
 */
export const throttleScroll = (
  callback: () => void,
  delay: number = 16
): (() => void) => {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  
  return () => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      callback();
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        callback();
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
};

/**
 * Debounce scroll events
 */
export const debounceScroll = (
  callback: () => void,
  delay: number = 100
): (() => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(callback, delay);
  };
};

/**
 * Create table of contents from headings
 */
export const generateTableOfContents = (
  container: HTMLElement,
  headingSelectors: string = 'h1, h2, h3, h4, h5, h6'
): Array<{
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}> => {
  const headings = container.querySelectorAll(headingSelectors) as NodeListOf<HTMLElement>;
  
  return Array.from(headings).map((heading, index) => {
    // Ensure heading has an ID
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }
    
    const level = parseInt(heading.tagName.charAt(1));
    
    return {
      id: heading.id,
      text: heading.textContent || '',
      level,
      element: heading,
    };
  });
};

/**
 * Auto-scroll to hash on page load
 */
export const handleHashScroll = (offset: number = 80): void => {
  if (typeof window === 'undefined') return;
  
  const hash = window.location.hash;
  if (!hash) return;
  
  const element = document.querySelector(hash) as HTMLElement;
  if (!element) return;
  
  // Wait for page to load
  setTimeout(() => {
    scrollToElement(element, { offset, duration: 800, easing: 'easeInOut' });
  }, 100);
};

/**
 * Performance-aware scroll utilities
 */
export class PerformanceScrollManager {
  private isLowEndDevice: boolean;
  private preferredDuration: number;
  
  constructor(isLowEndDevice: boolean = false) {
    this.isLowEndDevice = isLowEndDevice;
    this.preferredDuration = isLowEndDevice ? 400 : 800;
  }
  
  scrollToElement(
    element: HTMLElement | string,
    options: SmoothScrollOptions = {}
  ): Promise<void> {
    const adaptedOptions = {
      ...options,
      duration: this.isLowEndDevice 
        ? Math.min(options.duration || this.preferredDuration, 400)
        : options.duration || this.preferredDuration,
      easing: this.isLowEndDevice ? 'linear' : (options.easing || 'easeInOut'),
    };
    
    return scrollToElement(element, adaptedOptions);
  }
  
  scrollToTop(options: SmoothScrollOptions = {}): Promise<void> {
    const adaptedOptions = {
      ...options,
      duration: this.isLowEndDevice 
        ? Math.min(options.duration || 300, 300)
        : options.duration || 600,
      easing: this.isLowEndDevice ? 'linear' : (options.easing || 'easeOut'),
    };
    
    return scrollToTop(adaptedOptions);
  }
}