/**
 * TypeScript Interfaces for Theme System
 * Comprehensive type definitions for theme configuration, tokens, and component theming
 */

// Core theme types
export type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeVariant = 'light' | 'dark';

// Theme configuration interface
export interface ThemeConfig {
  /** Current theme mode setting */
  mode: ThemeMode;
  /** System detected preference */
  systemPreference: ThemeVariant;
  /** Duration for theme transitions in milliseconds */
  transitionDuration: number;
  /** Whether to persist theme preference in localStorage */
  persistPreference: boolean;
  /** Whether user has reduced motion preference */
  reducedMotion: boolean;
  /** Auto-detect system preference changes */
  autoDetectSystemPreference: boolean;
  /** Custom theme transition easing function */
  transitionEasing?: string;
}

// Theme context value interface
export interface ThemeContextValue {
  /** Currently active theme (resolved from mode and system preference) */
  currentTheme: ThemeVariant;
  /** User's theme mode preference */
  themeMode: ThemeMode;
  /** System detected preference */
  systemPreference: ThemeVariant;
  /** Whether theme is currently transitioning */
  isTransitioning: boolean;
  /** Function to set theme mode */
  setTheme: (theme: ThemeMode) => void;
  /** Function to toggle between light and dark */
  toggleTheme: () => void;
  /** Theme configuration object */
  config: ThemeConfig;
  /** Function to update theme configuration */
  updateConfig: (config: Partial<ThemeConfig>) => void;
}

// Color scale interface for design tokens
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950?: string;
}

// Surface color system for theme-aware backgrounds
export interface SurfaceColorScale {
  primary: string;
  secondary: string;
  tertiary: string;
  elevated: string;
  overlay: string;
  inverse?: string;
}

// Text color system for theme-aware typography
export interface TextColorScale {
  primary: string;
  secondary: string;
  tertiary: string;
  inverse: string;
  accent: string;
  muted?: string;
  disabled?: string;
}

// Border color system for theme-aware borders
export interface BorderColorScale {
  primary: string;
  secondary: string;
  tertiary: string;
  focus: string;
  interactive: string;
  disabled?: string;
}

// Interactive state colors
export interface InteractiveColorScale {
  hover: string;
  active: string;
  focus: string;
  disabled: string;
  selected?: string;
}

// Status colors for feedback states
export interface StatusColorScale {
  success: string;
  warning: string;
  error: string;
  info: string;
}

// Accent colors for brand elements
export interface AccentColorScale {
  gold: string;
  goldLight: string;
  copper: string;
  copperLight: string;
  primary: string;
  secondary: string;
}

// Shadow system for theme-aware elevation
export interface ShadowScale {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl'?: string;
  inner?: string;
  none: string;
}

// Luxury shadow variants
export interface LuxuryShadowScale {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

// Interactive shadow states
export interface InteractiveShadowScale {
  hover: string;
  focus: string;
  active: string;
}

// Transition system
export interface TransitionScale {
  theme: string;
  fast: string;
  normal: string;
  slow: string;
  slower?: string;
}

// Easing functions
export interface EasingScale {
  standard: string;
  decelerate: string;
  accelerate: string;
  spring: string;
}

// Complete theme tokens interface
export interface ThemeTokens {
  colors: {
    surface: SurfaceColorScale;
    text: TextColorScale;
    border: BorderColorScale;
    interactive: InteractiveColorScale;
    accent: AccentColorScale;
    status: StatusColorScale;
  };
  shadows: ShadowScale & {
    luxury: LuxuryShadowScale;
    interactive: InteractiveShadowScale;
  };
  transitions: TransitionScale & {
    easing: EasingScale;
  };
}

// Shared design tokens that don't change between themes
export interface SharedTokens {
  typography: {
    fontSizes: Record<string, string>;
    displaySizes: Record<string, string>;
    lineHeights: Record<string, number>;
    letterSpacing: Record<string, string>;
    fontWeights: Record<string, number>;
  };
  spacing: Record<string, string>;
  borderRadius: Record<string, string>;
  zIndex: Record<string, number | string>;
  breakpoints: Record<string, string>;
}

// Responsive tokens for different screen sizes
export interface ResponsiveTokens {
  mobile: {
    containerPadding: string;
    sectionPadding: string;
    cardPadding: string;
    buttonHeight: string;
    touchTarget: string;
  };
  tablet: {
    containerPadding: string;
    sectionPadding: string;
    cardPadding: string;
    buttonHeight: string;
    touchTarget: string;
  };
  desktop: {
    containerPadding: string;
    sectionPadding: string;
    cardPadding: string;
    buttonHeight: string;
    touchTarget: string;
  };
}

// Theme toggle component props
export interface ThemeToggleProps {
  /** Visual variant of the toggle */
  variant?: 'switch' | 'button' | 'icon' | 'dropdown';
  /** Size of the toggle component */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show text label */
  showLabel?: boolean;
  /** Position style of the toggle */
  position?: 'inline' | 'floating' | 'header' | 'footer';
  /** Additional CSS classes */
  className?: string;
  /** Custom aria-label for accessibility */
  ariaLabel?: string;
  /** Animation configuration */
  animation?: {
    type: 'slide' | 'fade' | 'morph' | 'flip';
    duration: number;
    easing: string;
  };
  /** Accessibility options */
  accessibility?: {
    keyboardShortcut?: string;
    announceChanges?: boolean;
  };
  /** Custom styling options */
  styling?: {
    luxury?: boolean;
    gradient?: boolean;
    glow?: boolean;
  };
}

// Component theming props interface
export interface ComponentThemeProps {
  /** Theme variant override */
  theme?: ThemeVariant;
  /** Whether component should adapt to theme changes */
  themeAware?: boolean;
  /** Custom theme tokens for this component */
  themeTokens?: Partial<ThemeTokens>;
  /** Transition behavior during theme changes */
  themeTransition?: {
    enabled: boolean;
    duration?: number;
    easing?: string;
    properties?: string[];
  };
  /** Accessibility considerations for theming */
  themeAccessibility?: {
    respectReducedMotion?: boolean;
    maintainContrast?: boolean;
    announceChanges?: boolean;
  };
}

// Theme-aware component base props
export interface ThemeAwareComponentProps extends ComponentThemeProps {
  /** Additional CSS classes */
  className?: string;
  /** Inline styles */
  style?: React.CSSProperties;
  /** Children elements */
  children?: React.ReactNode;
}

// Theme provider props
export interface ThemeProviderProps {
  /** Child components */
  children: React.ReactNode;
  /** Initial theme configuration */
  config?: Partial<ThemeConfig>;
  /** Custom theme tokens */
  customTokens?: {
    light?: Partial<ThemeTokens>;
    dark?: Partial<ThemeTokens>;
  };
  /** Storage key for persistence */
  storageKey?: string;
  /** Whether to enable theme debugging */
  debug?: boolean;
}

// Theme hook return type
export interface UseThemeReturn extends ThemeContextValue {
  /** Get current theme tokens */
  getTokens: () => ThemeTokens;
  /** Get shared tokens */
  getSharedTokens: () => SharedTokens;
  /** Get responsive tokens */
  getResponsiveTokens: () => ResponsiveTokens;
  /** Generate CSS custom properties */
  getCSSProperties: () => Record<string, string>;
  /** Check if theme is supported */
  isThemeSupported: (theme: ThemeMode) => boolean;
}

// Theme utilities interface
export interface ThemeUtils {
  /** Generate CSS custom properties from tokens */
  generateCSSProperties: (tokens: ThemeTokens) => Record<string, string>;
  /** Get theme tokens for specific variant */
  getThemeTokens: (variant: ThemeVariant) => ThemeTokens;
  /** Merge theme configurations */
  mergeThemeConfig: (base: ThemeConfig, override: Partial<ThemeConfig>) => ThemeConfig;
  /** Validate theme configuration */
  validateThemeConfig: (config: Partial<ThemeConfig>) => boolean;
  /** Get system preference */
  getSystemPreference: () => ThemeVariant;
  /** Check if reduced motion is preferred */
  prefersReducedMotion: () => boolean;
}

// Animation configuration for theme transitions
export interface ThemeAnimationConfig {
  /** Duration in milliseconds */
  duration: number;
  /** CSS easing function */
  easing: string;
  /** Properties to animate */
  properties: string[];
  /** Stagger delay for cascading animations */
  staggerDelay?: number;
  /** Whether to respect reduced motion preference */
  respectReducedMotion: boolean;
}

// Theme event types
export type ThemeChangeEvent = {
  previousTheme: ThemeVariant;
  currentTheme: ThemeVariant;
  mode: ThemeMode;
  timestamp: number;
};

export type ThemeEventHandler = (event: ThemeChangeEvent) => void;

// Theme storage interface
export interface ThemeStorage {
  /** Get stored theme preference */
  getTheme: () => ThemeMode | null;
  /** Set theme preference */
  setTheme: (theme: ThemeMode) => void;
  /** Remove stored theme preference */
  removeTheme: () => void;
  /** Check if storage is available */
  isAvailable: () => boolean;
}

// Theme debugging interface
export interface ThemeDebugInfo {
  currentTheme: ThemeVariant;
  themeMode: ThemeMode;
  systemPreference: ThemeVariant;
  isTransitioning: boolean;
  config: ThemeConfig;
  tokens: ThemeTokens;
  cssProperties: Record<string, string>;
  performance: {
    transitionDuration: number;
    lastChangeTimestamp: number;
  };
}

// All types are already exported above with their declarations