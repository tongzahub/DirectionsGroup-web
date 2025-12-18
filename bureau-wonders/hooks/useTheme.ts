/**
 * Theme Management Hook
 * Handles theme state, system preference detection, and persistence
 */

'use client';

import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { 
  ThemeMode, 
  ThemeVariant, 
  ThemeConfig, 
  ThemeContextValue, 
  UseThemeReturn,
  ThemeProviderProps,
  ThemeChangeEvent,
  ThemeEventHandler
} from '@/types/theme';
import { 
  getThemeTokens, 
  sharedTokens, 
  responsiveTokens, 
  generateCSSCustomProperties,
  defaultThemeConfig 
} from '@/lib/theme-tokens';

// Theme context
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

// Theme event listeners
const themeEventListeners = new Set<ThemeEventHandler>();

// Custom hook to use theme context
export const useTheme = (): UseThemeReturn => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  // Extended functionality
  const getTokens = useCallback(() => {
    return getThemeTokens(context.currentTheme);
  }, [context.currentTheme]);
  
  const getSharedTokens = useCallback(() => {
    return sharedTokens;
  }, []);
  
  const getResponsiveTokens = useCallback(() => {
    return responsiveTokens;
  }, []);
  
  const getCSSProperties = useCallback(() => {
    const tokens = getThemeTokens(context.currentTheme);
    return generateCSSCustomProperties(tokens);
  }, [context.currentTheme]);
  
  const isThemeSupported = useCallback((theme: ThemeMode) => {
    return ['light', 'dark', 'system'].includes(theme);
  }, []);
  
  return {
    ...context,
    getTokens,
    getSharedTokens,
    getResponsiveTokens,
    getCSSProperties,
    isThemeSupported,
  };
};

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  config: initialConfig,
  customTokens,
  storageKey = 'theme-preference',
  debug = false
}) => {
  const [config, setConfig] = useState<ThemeConfig>({
    ...defaultThemeConfig,
    ...initialConfig,
  });
  const [themeMode, setThemeMode] = useState<ThemeMode>(config.mode);
  const [systemPreference, setSystemPreference] = useState<ThemeVariant>('light');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Determine current theme based on mode and system preference
  const currentTheme: ThemeVariant = themeMode === 'system' ? systemPreference : themeMode as ThemeVariant;
  
  // Detect system preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches ? 'dark' : 'light');
    };
    
    // Set initial value
    setSystemPreference(mediaQuery.matches ? 'dark' : 'light');
    
    // Listen for changes
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);
  
  // Load saved theme preference
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    if (config.persistPreference) {
      try {
        const savedTheme = localStorage.getItem(storageKey) as ThemeMode;
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        if (debug) {
          console.warn('Failed to load theme preference from localStorage:', error);
        }
      }
    }
  }, [config.persistPreference, storageKey, debug]);
  
  // Apply theme to document
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    const previousTheme = root.getAttribute('data-theme') as ThemeVariant | null;
    
    // Start transition
    setIsTransitioning(true);
    
    // Apply theme attribute
    root.setAttribute('data-theme', currentTheme);
    
    // Apply CSS custom properties if custom tokens are provided
    if (customTokens) {
      const tokens = customTokens[currentTheme];
      if (tokens) {
        const cssProperties = generateCSSCustomProperties(tokens as any);
        Object.entries(cssProperties).forEach(([property, value]) => {
          root.style.setProperty(property, value);
        });
      }
    }
    
    // Emit theme change event
    if (previousTheme && previousTheme !== currentTheme) {
      const event: ThemeChangeEvent = {
        previousTheme,
        currentTheme,
        mode: themeMode,
        timestamp: Date.now(),
      };
      
      themeEventListeners.forEach(listener => {
        try {
          listener(event);
        } catch (error) {
          if (debug) {
            console.error('Theme event listener error:', error);
          }
        }
      });
    }
    
    // End transition after animation duration
    const transitionTimeout = setTimeout(() => {
      setIsTransitioning(false);
    }, config.transitionDuration);
    
    return () => {
      clearTimeout(transitionTimeout);
    };
  }, [currentTheme, themeMode, config.transitionDuration, customTokens, debug]);
  
  // Set theme function
  const setTheme = useCallback((theme: ThemeMode) => {
    setThemeMode(theme);
    
    if (typeof window !== 'undefined' && config.persistPreference) {
      try {
        localStorage.setItem(storageKey, theme);
      } catch (error) {
        if (debug) {
          console.warn('Failed to save theme preference to localStorage:', error);
        }
      }
    }
  }, [config.persistPreference, storageKey, debug]);
  
  // Toggle theme function
  const toggleTheme = useCallback(() => {
    if (themeMode === 'system') {
      // If system, switch to opposite of current system preference
      setTheme(systemPreference === 'dark' ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    }
  }, [themeMode, systemPreference, currentTheme, setTheme]);
  
  // Update config function
  const updateConfig = useCallback((newConfig: Partial<ThemeConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const value: ThemeContextValue = {
    currentTheme,
    themeMode,
    systemPreference,
    isTransitioning,
    setTheme,
    toggleTheme,
    config,
    updateConfig,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme event utilities
export const addThemeEventListener = (listener: ThemeEventHandler): (() => void) => {
  themeEventListeners.add(listener);
  return () => {
    themeEventListeners.delete(listener);
  };
};

export const removeThemeEventListener = (listener: ThemeEventHandler): void => {
  themeEventListeners.delete(listener);
};

// Theme utilities
export const getSystemPreference = (): ThemeVariant => {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export { ThemeContext };