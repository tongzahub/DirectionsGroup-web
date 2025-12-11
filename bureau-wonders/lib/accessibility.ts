/**
 * Accessibility Enhancement System
 * Comprehensive support for screen readers, keyboard navigation, and reduced motion
 */

export interface AccessibilitySettings {
  prefersReducedMotion: boolean;
  prefersHighContrast: boolean;
  prefersColorScheme: 'light' | 'dark' | 'no-preference';
  isKeyboardUser: boolean;
  screenReaderActive: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
}

export interface FocusState {
  isFocused: boolean;
  isKeyboardFocus: boolean;
  focusVisible: boolean;
}

export interface AriaAnnouncement {
  message: string;
  priority: 'polite' | 'assertive';
  delay?: number;
}

class AccessibilityManager {
  private settings: AccessibilitySettings = {
    prefersReducedMotion: false,
    prefersHighContrast: false,
    prefersColorScheme: 'no-preference',
    isKeyboardUser: false,
    screenReaderActive: false,
    fontSize: 'medium',
  };

  private observers: Array<(settings: AccessibilitySettings) => void> = [];
  private announcer: HTMLElement | null = null;
  private keyboardDetected = false;
  private mouseDetected = false;

  constructor() {
    this.initializeSettings();
    this.setupEventListeners();
    this.createAriaAnnouncer();
    this.detectScreenReader();
  }

  // Initialize accessibility settings
  private initializeSettings(): void {
    if (typeof window === 'undefined') return;

    // Check media queries
    this.settings.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.settings.prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    
    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.settings.prefersColorScheme = colorSchemeQuery.matches ? 'dark' : 'light';

    // Check font size preference
    const fontSize = localStorage.getItem('accessibility-font-size') as AccessibilitySettings['fontSize'];
    if (fontSize) {
      this.settings.fontSize = fontSize;
    }
  }

  // Setup event listeners for accessibility detection
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Media query listeners
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionQuery.addEventListener('change', (e) => {
      this.updateSettings({ prefersReducedMotion: e.matches });
    });

    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    highContrastQuery.addEventListener('change', (e) => {
      this.updateSettings({ prefersHighContrast: e.matches });
    });

    const colorSchemeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    colorSchemeQuery.addEventListener('change', (e) => {
      this.updateSettings({ prefersColorScheme: e.matches ? 'dark' : 'light' });
    });

    // Keyboard/mouse detection
    document.addEventListener('keydown', this.handleKeyboardInteraction, true);
    document.addEventListener('mousedown', this.handleMouseInteraction, true);
    document.addEventListener('touchstart', this.handleMouseInteraction, true);

    // Focus visibility detection
    document.addEventListener('focusin', this.handleFocusIn, true);
    document.addEventListener('focusout', this.handleFocusOut, true);
  }

  private handleKeyboardInteraction = (e: KeyboardEvent) => {
    if (e.key === 'Tab' || e.key === 'Enter' || e.key === ' ' || e.key.startsWith('Arrow')) {
      this.keyboardDetected = true;
      this.mouseDetected = false;
      this.updateSettings({ isKeyboardUser: true });
    }
  };

  private handleMouseInteraction = () => {
    this.mouseDetected = true;
    this.keyboardDetected = false;
    this.updateSettings({ isKeyboardUser: false });
  };

  private handleFocusIn = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target && this.keyboardDetected) {
      target.setAttribute('data-keyboard-focus', 'true');
    }
  };

  private handleFocusOut = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (target) {
      target.removeAttribute('data-keyboard-focus');
    }
  };

  // Create ARIA live region for announcements
  private createAriaAnnouncer(): void {
    if (typeof document === 'undefined') return;

    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.setAttribute('aria-relevant', 'text');
    this.announcer.style.position = 'absolute';
    this.announcer.style.left = '-10000px';
    this.announcer.style.width = '1px';
    this.announcer.style.height = '1px';
    this.announcer.style.overflow = 'hidden';
    
    document.body.appendChild(this.announcer);
  }

  // Detect screen reader usage
  private detectScreenReader(): void {
    if (typeof window === 'undefined') return;

    // Check for common screen reader indicators
    const indicators = [
      'speechSynthesis' in window,
      navigator.userAgent.includes('NVDA'),
      navigator.userAgent.includes('JAWS'),
      navigator.userAgent.includes('VoiceOver'),
      'webkitSpeechSynthesis' in window,
    ];

    const screenReaderLikely = indicators.some(Boolean);
    
    // Also check for high contrast or reduced motion as indicators
    const accessibilityPreferences = this.settings.prefersReducedMotion || this.settings.prefersHighContrast;
    
    this.updateSettings({ 
      screenReaderActive: screenReaderLikely || accessibilityPreferences 
    });
  }

  // Update settings and notify observers
  private updateSettings(updates: Partial<AccessibilitySettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.notifyObservers();
  }

  // Subscribe to accessibility changes
  subscribe(callback: (settings: AccessibilitySettings) => void): () => void {
    this.observers.push(callback);
    
    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  private notifyObservers(): void {
    this.observers.forEach(callback => {
      try {
        callback(this.settings);
      } catch (error) {
        console.error('Error in accessibility observer:', error);
      }
    });
  }

  // Get current settings
  getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  // Announce message to screen readers
  announce(announcement: AriaAnnouncement): void {
    if (!this.announcer) return;

    const { message, priority, delay = 0 } = announcement;
    
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.setAttribute('aria-live', priority);
        this.announcer.textContent = message;
        
        // Clear after announcement
        setTimeout(() => {
          if (this.announcer) {
            this.announcer.textContent = '';
          }
        }, 1000);
      }
    }, delay);
  }

  // Set font size preference
  setFontSize(size: AccessibilitySettings['fontSize']): void {
    this.updateSettings({ fontSize: size });
    localStorage.setItem('accessibility-font-size', size);
    
    // Apply font size to document
    const root = document.documentElement;
    const sizeMap = {
      'small': '14px',
      'medium': '16px',
      'large': '18px',
      'extra-large': '20px',
    };
    
    root.style.fontSize = sizeMap[size];
  }

  // Check if animations should be disabled
  shouldDisableAnimations(): boolean {
    return this.settings.prefersReducedMotion;
  }

  // Get recommended animation settings for accessibility
  getAccessibleAnimationSettings(): {
    duration: number;
    easing: string;
    respectsReducedMotion: boolean;
  } {
    if (this.settings.prefersReducedMotion) {
      return {
        duration: 0.01,
        easing: 'linear',
        respectsReducedMotion: true,
      };
    }
    
    return {
      duration: 0.3,
      easing: 'ease-out',
      respectsReducedMotion: false,
    };
  }

  // Generate accessibility report
  generateReport(): string {
    const settings = this.getSettings();
    
    return `
Accessibility Report:
- Prefers Reduced Motion: ${settings.prefersReducedMotion}
- Prefers High Contrast: ${settings.prefersHighContrast}
- Color Scheme: ${settings.prefersColorScheme}
- Keyboard User: ${settings.isKeyboardUser}
- Screen Reader Active: ${settings.screenReaderActive}
- Font Size: ${settings.fontSize}

Recommendations:
- Animations: ${settings.prefersReducedMotion ? 'Disabled' : 'Enabled'}
- Focus Indicators: ${settings.isKeyboardUser ? 'Enhanced' : 'Standard'}
- Announcements: ${settings.screenReaderActive ? 'Active' : 'Minimal'}
    `.trim();
  }
}

// Singleton instance
export const accessibilityManager = new AccessibilityManager();

// Enhanced focus management
export class FocusManager {
  private focusStack: HTMLElement[] = [];
  private trapActive = false;
  private trapContainer: HTMLElement | null = null;

  // Trap focus within a container
  trapFocus(container: HTMLElement): void {
    this.trapContainer = container;
    this.trapActive = true;
    
    const focusableElements = this.getFocusableElements(container);
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

    // Store cleanup function
    (container as any)._focusTrapCleanup = () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }

  // Release focus trap
  releaseFocusTrap(): void {
    if (this.trapContainer && (this.trapContainer as any)._focusTrapCleanup) {
      (this.trapContainer as any)._focusTrapCleanup();
      delete (this.trapContainer as any)._focusTrapCleanup;
    }
    
    this.trapActive = false;
    this.trapContainer = null;
  }

  // Save current focus
  saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusStack.push(activeElement);
    }
  }

  // Restore previous focus
  restoreFocus(): void {
    const element = this.focusStack.pop();
    if (element && element.focus) {
      element.focus();
    }
  }

  // Get focusable elements within a container
  private getFocusableElements(container: HTMLElement): HTMLElement[] {
    const selector = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(container.querySelectorAll(selector)) as HTMLElement[];
  }

  // Check if element is focusable
  isFocusable(element: HTMLElement): boolean {
    const focusableElements = this.getFocusableElements(document.body);
    return focusableElements.includes(element);
  }
}

export const focusManager = new FocusManager();

// Utility functions
export const getAccessibilitySettings = (): AccessibilitySettings => {
  return accessibilityManager.getSettings();
};

export const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite'): void => {
  accessibilityManager.announce({ message, priority });
};

export const shouldDisableAnimations = (): boolean => {
  return accessibilityManager.shouldDisableAnimations();
};

// React hooks
import { useState, useEffect } from 'react';

export const useAccessibilitySettings = () => {
  const [settings, setSettings] = useState<AccessibilitySettings>(
    accessibilityManager.getSettings()
  );
  
  useEffect(() => {
    const unsubscribe = accessibilityManager.subscribe(setSettings);
    return unsubscribe;
  }, []);
  
  return settings;
};

export const useFocusState = (elementRef: React.RefObject<HTMLElement>) => {
  const [focusState, setFocusState] = useState<FocusState>({
    isFocused: false,
    isKeyboardFocus: false,
    focusVisible: false,
  });

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleFocus = () => {
      const isKeyboardFocus = element.hasAttribute('data-keyboard-focus');
      setFocusState({
        isFocused: true,
        isKeyboardFocus,
        focusVisible: isKeyboardFocus,
      });
    };

    const handleBlur = () => {
      setFocusState({
        isFocused: false,
        isKeyboardFocus: false,
        focusVisible: false,
      });
    };

    element.addEventListener('focus', handleFocus);
    element.addEventListener('blur', handleBlur);

    return () => {
      element.removeEventListener('focus', handleFocus);
      element.removeEventListener('blur', handleBlur);
    };
  }, [elementRef]);

  return focusState;
};

export const useScreenReaderAnnouncements = () => {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    accessibilityManager.announce({ message, priority });
  };

  const announceNavigation = (pageName: string) => {
    announce(`Navigated to ${pageName}`, 'polite');
  };

  const announceLoading = (content: string) => {
    announce(`Loading ${content}`, 'polite');
  };

  const announceError = (error: string) => {
    announce(`Error: ${error}`, 'assertive');
  };

  const announceSuccess = (action: string) => {
    announce(`Success: ${action}`, 'polite');
  };

  return {
    announce,
    announceNavigation,
    announceLoading,
    announceError,
    announceSuccess,
  };
};