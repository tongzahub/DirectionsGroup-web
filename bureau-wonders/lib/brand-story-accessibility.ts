/**
 * Brand Story Accessibility Enhancements
 * Specific accessibility utilities for the brand story page
 */

import { useEffect, useRef } from 'react';
import { accessibilityManager, announceToScreenReader } from './accessibility';

// Enhanced keyboard navigation for brand story sections
export const useBrandStoryKeyboardNavigation = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in an input field
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement || 
          e.target instanceof HTMLSelectElement) {
        return;
      }

      switch (e.key) {
        case '1':
          e.preventDefault();
          navigateToSection('hero', 'Brand Story Introduction');
          break;
        case '2':
          e.preventDefault();
          navigateToSection('success-stories', 'Client Success Stories');
          break;
        case '3':
          e.preventDefault();
          navigateToSection('stakes', 'The Stakes Section');
          break;
        case '4':
          e.preventDefault();
          navigateToSection('call-to-action', 'Call to Action');
          break;
        case 'h':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            navigateToSection('hero', 'Brand Story Introduction');
          }
          break;
        case 'Escape':
          // Clear any modal or overlay focus
          const activeElement = document.activeElement as HTMLElement;
          if (activeElement && activeElement.blur) {
            activeElement.blur();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
};

// Navigate to a specific section with accessibility announcements
const navigateToSection = (sectionId: string, sectionName: string) => {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    
    // Focus the section for screen readers
    setTimeout(() => {
      section.focus();
      announceToScreenReader(`Navigated to ${sectionName}`, 'polite');
    }, 500);
  }
};

// Enhanced carousel accessibility
export const useCarouselAccessibility = (
  currentIndex: number,
  totalItems: number,
  itemTitles: string[]
) => {
  const announceCarouselChange = (newIndex: number) => {
    const itemTitle = itemTitles[newIndex] || `item ${newIndex + 1}`;
    const announcement = `Showing ${itemTitle}, ${newIndex + 1} of ${totalItems}`;
    announceToScreenReader(announcement, 'polite');
  };

  const handleCarouselKeyDown = (e: KeyboardEvent) => {
    if (e.target instanceof HTMLElement && 
        e.target.closest('[role="tabpanel"]')) {
      
      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          const prevIndex = currentIndex === 0 ? totalItems - 1 : currentIndex - 1;
          announceCarouselChange(prevIndex);
          return prevIndex;
        case 'ArrowRight':
          e.preventDefault();
          const nextIndex = currentIndex === totalItems - 1 ? 0 : currentIndex + 1;
          announceCarouselChange(nextIndex);
          return nextIndex;
        case 'Home':
          e.preventDefault();
          announceCarouselChange(0);
          return 0;
        case 'End':
          e.preventDefault();
          announceCarouselChange(totalItems - 1);
          return totalItems - 1;
      }
    }
    return currentIndex;
  };

  return {
    announceCarouselChange,
    handleCarouselKeyDown
  };
};

// Focus management for interactive elements
export const useFocusManagement = () => {
  const focusableElementsSelector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ');

  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    return Array.from(container.querySelectorAll(focusableElementsSelector)) as HTMLElement[];
  };

  const trapFocusInContainer = (container: HTMLElement) => {
    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  };

  return {
    getFocusableElements,
    trapFocusInContainer
  };
};

// Screen reader optimized content announcements
export const useBrandStoryAnnouncements = () => {
  const announceSection = (sectionName: string, content?: string) => {
    let announcement = `Entered ${sectionName} section`;
    if (content) {
      announcement += `. ${content}`;
    }
    announceToScreenReader(announcement, 'polite');
  };

  const announceInteraction = (action: string, element: string) => {
    const announcement = `${action} ${element}`;
    announceToScreenReader(announcement, 'polite');
  };

  const announceError = (error: string) => {
    announceToScreenReader(`Error: ${error}`, 'assertive');
  };

  const announceSuccess = (success: string) => {
    announceToScreenReader(`Success: ${success}`, 'polite');
  };

  const announceLoading = (content: string) => {
    announceToScreenReader(`Loading ${content}`, 'polite');
  };

  return {
    announceSection,
    announceInteraction,
    announceError,
    announceSuccess,
    announceLoading
  };
};

// Color contrast validation
export const validateColorContrast = (foreground: string, background: string): boolean => {
  // This is a simplified version - in production, you'd use a proper color contrast library
  // Returns true if contrast ratio meets WCAG AA standards (4.5:1 for normal text)
  
  const getLuminance = (color: string): number => {
    // Convert hex to RGB and calculate relative luminance
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;
    
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  try {
    const fgLuminance = getLuminance(foreground);
    const bgLuminance = getLuminance(background);
    
    const contrast = (Math.max(fgLuminance, bgLuminance) + 0.05) / 
                    (Math.min(fgLuminance, bgLuminance) + 0.05);
    
    return contrast >= 4.5; // WCAG AA standard
  } catch {
    return true; // Assume valid if we can't parse colors
  }
};

// Reduced motion detection and handling
export const useReducedMotionHandling = () => {
  const settings = accessibilityManager.getSettings();
  
  const getAnimationProps = (defaultProps: any) => {
    if (settings.prefersReducedMotion) {
      return {
        ...defaultProps,
        transition: { duration: 0.01 },
        initial: defaultProps.animate || {},
        animate: defaultProps.animate || {}
      };
    }
    return defaultProps;
  };

  const shouldDisableParallax = () => settings.prefersReducedMotion;
  const shouldDisableAutoplay = () => settings.prefersReducedMotion;
  const shouldUseInstantTransitions = () => settings.prefersReducedMotion;

  return {
    getAnimationProps,
    shouldDisableParallax,
    shouldDisableAutoplay,
    shouldUseInstantTransitions
  };
};

// Touch accessibility for mobile devices
export const useTouchAccessibility = () => {
  const enhanceTouchTarget = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    const minSize = 44; // Minimum touch target size in pixels
    
    if (rect.width < minSize || rect.height < minSize) {
      element.style.minWidth = `${minSize}px`;
      element.style.minHeight = `${minSize}px`;
      element.style.display = 'inline-flex';
      element.style.alignItems = 'center';
      element.style.justifyContent = 'center';
    }
  };

  const addTouchFeedback = (element: HTMLElement) => {
    element.style.transition = 'transform 0.1s ease-out, background-color 0.1s ease-out';
    
    const handleTouchStart = () => {
      element.style.transform = 'scale(0.95)';
    };
    
    const handleTouchEnd = () => {
      element.style.transform = 'scale(1)';
    };
    
    element.addEventListener('touchstart', handleTouchStart, { passive: true });
    element.addEventListener('touchend', handleTouchEnd, { passive: true });
    element.addEventListener('touchcancel', handleTouchEnd, { passive: true });
    
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchEnd);
    };
  };

  return {
    enhanceTouchTarget,
    addTouchFeedback
  };
};

// Accessibility testing utilities
export const runAccessibilityAudit = () => {
  const issues: string[] = [];
  
  // Check for missing alt text
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (!img.alt && !img.getAttribute('aria-hidden')) {
      issues.push(`Image ${index + 1} missing alt text`);
    }
  });
  
  // Check for missing form labels
  const inputs = document.querySelectorAll('input, textarea, select');
  inputs.forEach((input, index) => {
    const hasLabel = input.id && document.querySelector(`label[for="${input.id}"]`);
    const hasAriaLabel = input.getAttribute('aria-label');
    const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
    
    if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
      issues.push(`Form field ${index + 1} missing label`);
    }
  });
  
  // Check for missing heading hierarchy
  const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let previousLevel = 0;
  headings.forEach((heading, index) => {
    const level = parseInt(heading.tagName.charAt(1));
    if (level > previousLevel + 1) {
      issues.push(`Heading ${index + 1} skips levels (h${previousLevel} to h${level})`);
    }
    previousLevel = level;
  });
  
  // Check for missing focus indicators
  const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
  focusableElements.forEach((element, index) => {
    const styles = window.getComputedStyle(element, ':focus');
    if (styles.outline === 'none' && !styles.boxShadow && !styles.border) {
      issues.push(`Focusable element ${index + 1} missing focus indicator`);
    }
  });
  
  return issues;
};