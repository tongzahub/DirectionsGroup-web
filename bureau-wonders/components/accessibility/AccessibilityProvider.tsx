/**
 * Accessibility Provider
 * Global accessibility context and management
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { accessibilityManager, focusManager, AccessibilitySettings } from '../../lib/accessibility';

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateFontSize: (size: AccessibilitySettings['fontSize']) => void;
  trapFocus: (container: HTMLElement) => void;
  releaseFocusTrap: () => void;
  saveFocus: () => void;
  restoreFocus: () => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | null>(null);

export const useAccessibilityContext = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibilityContext must be used within AccessibilityProvider');
  }
  return context;
};

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AccessibilitySettings>(
    accessibilityManager.getSettings()
  );

  useEffect(() => {
    // Subscribe to accessibility changes
    const unsubscribe = accessibilityManager.subscribe(setSettings);
    
    // Add skip link to document
    addSkipLink();
    
    // Apply initial font size
    applyFontSize(settings.fontSize);
    
    return () => {
      unsubscribe();
      removeSkipLink();
    };
  }, []);

  useEffect(() => {
    // Apply font size changes
    applyFontSize(settings.fontSize);
    
    // Apply accessibility classes to document
    applyAccessibilityClasses(settings);
  }, [settings]);

  const addSkipLink = () => {
    if (document.getElementById('skip-link')) return;
    
    const skipLink = document.createElement('a');
    skipLink.id = 'skip-link';
    skipLink.className = 'skip-link';
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    
    document.body.insertBefore(skipLink, document.body.firstChild);
  };

  const removeSkipLink = () => {
    const skipLink = document.getElementById('skip-link');
    if (skipLink) {
      skipLink.remove();
    }
  };

  const applyFontSize = (fontSize: AccessibilitySettings['fontSize']) => {
    const root = document.documentElement;
    root.className = root.className.replace(/font-size-\w+/g, '');
    root.classList.add(`font-size-${fontSize}`);
  };

  const applyAccessibilityClasses = (settings: AccessibilitySettings) => {
    const root = document.documentElement;
    
    // Remove existing accessibility classes
    root.classList.remove(
      'prefers-reduced-motion',
      'prefers-high-contrast',
      'keyboard-user',
      'screen-reader-active'
    );
    
    // Add current accessibility classes
    if (settings.prefersReducedMotion) {
      root.classList.add('prefers-reduced-motion');
    }
    
    if (settings.prefersHighContrast) {
      root.classList.add('prefers-high-contrast');
    }
    
    if (settings.isKeyboardUser) {
      root.classList.add('keyboard-user');
    }
    
    if (settings.screenReaderActive) {
      root.classList.add('screen-reader-active');
    }
  };

  const updateFontSize = (size: AccessibilitySettings['fontSize']) => {
    accessibilityManager.setFontSize(size);
  };

  const trapFocus = (container: HTMLElement) => {
    focusManager.trapFocus(container);
  };

  const releaseFocusTrap = () => {
    focusManager.releaseFocusTrap();
  };

  const saveFocus = () => {
    focusManager.saveFocus();
  };

  const restoreFocus = () => {
    focusManager.restoreFocus();
  };

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    accessibilityManager.announce({ message, priority });
  };

  const contextValue: AccessibilityContextType = {
    settings,
    updateFontSize,
    trapFocus,
    releaseFocusTrap,
    saveFocus,
    restoreFocus,
    announce,
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Accessibility toolbar component
export interface AccessibilityToolbarProps {
  className?: string;
}

export const AccessibilityToolbar: React.FC<AccessibilityToolbarProps> = ({ className = '' }) => {
  const { settings, updateFontSize } = useAccessibilityContext();
  const [isOpen, setIsOpen] = useState(false);

  const fontSizes: Array<{ value: AccessibilitySettings['fontSize']; label: string }> = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'extra-large', label: 'Extra Large' },
  ];

  return (
    <div className={`accessibility-toolbar ${className}`}>
      <button
        className="accessibility-toolbar__toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="accessibility-options"
        aria-label="Accessibility options"
      >
        <span className="sr-only">Accessibility Options</span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 5.5C14.8 4.1 13.6 3 12.1 3C10.6 3 9.4 4.1 9.2 5.5L3 7V9L9.2 7.5V10.5L7.5 12L9 13.5L12 10.5L15 13.5L16.5 12L14.8 10.5V7.5L21 9Z"/>
        </svg>
      </button>

      {isOpen && (
        <div
          id="accessibility-options"
          className="accessibility-toolbar__panel"
          role="dialog"
          aria-label="Accessibility Settings"
        >
          <div className="accessibility-toolbar__section">
            <h3 className="accessibility-toolbar__title">Font Size</h3>
            <div className="accessibility-toolbar__options">
              {fontSizes.map(({ value, label }) => (
                <button
                  key={value}
                  className={`accessibility-toolbar__option ${
                    settings.fontSize === value ? 'active' : ''
                  }`}
                  onClick={() => updateFontSize(value)}
                  aria-pressed={settings.fontSize === value}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="accessibility-toolbar__section">
            <h3 className="accessibility-toolbar__title">Current Settings</h3>
            <ul className="accessibility-toolbar__status">
              <li>
                <span className="accessibility-toolbar__label">Reduced Motion:</span>
                <span className={settings.prefersReducedMotion ? 'enabled' : 'disabled'}>
                  {settings.prefersReducedMotion ? 'On' : 'Off'}
                </span>
              </li>
              <li>
                <span className="accessibility-toolbar__label">High Contrast:</span>
                <span className={settings.prefersHighContrast ? 'enabled' : 'disabled'}>
                  {settings.prefersHighContrast ? 'On' : 'Off'}
                </span>
              </li>
              <li>
                <span className="accessibility-toolbar__label">Keyboard Navigation:</span>
                <span className={settings.isKeyboardUser ? 'enabled' : 'disabled'}>
                  {settings.isKeyboardUser ? 'Active' : 'Inactive'}
                </span>
              </li>
            </ul>
          </div>

          <button
            className="accessibility-toolbar__close"
            onClick={() => setIsOpen(false)}
            aria-label="Close accessibility options"
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

// Screen reader announcements component
export const ScreenReaderAnnouncements: React.FC = () => {
  return (
    <div
      id="screen-reader-announcements"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );
};

// Route announcer for single-page applications
export interface RouteAnnouncerProps {
  routeName: string;
}

export const RouteAnnouncer: React.FC<RouteAnnouncerProps> = ({ routeName }) => {
  const { announce, settings } = useAccessibilityContext();

  useEffect(() => {
    if (settings.screenReaderActive) {
      // Announce route changes to screen readers
      const timer = setTimeout(() => {
        announce(`Navigated to ${routeName}`, 'polite');
      }, 100); // Small delay to ensure page content is loaded

      return () => clearTimeout(timer);
    }
  }, [routeName, announce, settings.screenReaderActive]);

  return null;
};