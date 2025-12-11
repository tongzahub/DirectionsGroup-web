/**
 * Enhanced Component Types
 * TypeScript interfaces for all enhanced component props and animation configurations
 */

import { ReactNode, HTMLAttributes, CSSProperties } from 'react';
import { Variants, Transition } from 'framer-motion';

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Animation configuration types
export interface AnimationProps {
  animate?: boolean;
  animationType?: 'fadeIn' | 'slideUp' | 'scaleIn' | 'staggerReveal';
  animationDelay?: number;
  animationDuration?: number;
  animationEasing?: string;
  variants?: Variants;
  transition?: Transition;
  initial?: string | object;
  whileHover?: object;
  whileTap?: object;
  whileInView?: object;
}

// Responsive breakpoint configuration
export interface ResponsiveProps {
  responsive?: {
    mobile?: Partial<CSSProperties>;
    tablet?: Partial<CSSProperties>;
    desktop?: Partial<CSSProperties>;
  };
}

// Enhanced component base interface
export interface EnhancedComponentProps extends BaseComponentProps, AnimationProps, ResponsiveProps {
  luxury?: boolean;
  performanceOptimized?: boolean;
  accessibilityEnhanced?: boolean;
}

// Button component types
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'luxury';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type ButtonState = 'default' | 'hover' | 'active' | 'disabled' | 'loading';

export interface EnhancedButtonProps extends EnhancedComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  state?: ButtonState;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  href?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  ariaLabel?: string;
}

// Card component types
export type CardVariant = 'default' | 'elevated' | 'outlined' | 'luxury' | 'interactive';
export type CardSize = 'sm' | 'md' | 'lg' | 'xl';

export interface EnhancedCardProps extends EnhancedComponentProps {
  variant?: CardVariant;
  size?: CardSize;
  interactive?: boolean;
  hoverable?: boolean;
  clickable?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'luxury';
  onClick?: () => void;
  href?: string;
}

// Input component types
export type InputVariant = 'default' | 'luxury' | 'minimal';
export type InputSize = 'sm' | 'md' | 'lg';
export type InputState = 'default' | 'focus' | 'error' | 'success' | 'disabled';

export interface EnhancedInputProps extends EnhancedComponentProps {
  variant?: InputVariant;
  size?: InputSize;
  state?: InputState;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

// Typography component types
export type TypographyVariant = 
  | 'display-xl' | 'display-lg' | 'display-md' | 'display-sm'
  | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  | 'body-xl' | 'body-lg' | 'body-md' | 'body-sm' | 'body-xs'
  | 'caption' | 'overline';

export type TypographyWeight = 'thin' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
export type TypographyAlign = 'left' | 'center' | 'right' | 'justify';
export type TypographyColor = 'primary' | 'secondary' | 'accent' | 'neutral' | 'success' | 'warning' | 'error';

export interface EnhancedTypographyProps extends EnhancedComponentProps {
  variant?: TypographyVariant;
  weight?: TypographyWeight;
  align?: TypographyAlign;
  color?: TypographyColor;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  truncate?: boolean;
  maxLines?: number;
  as?: keyof React.JSX.IntrinsicElements;
}

// Container component types
export type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
export type ContainerPadding = 'none' | 'sm' | 'md' | 'lg' | 'xl';

export interface EnhancedContainerProps extends EnhancedComponentProps {
  size?: ContainerSize;
  padding?: ContainerPadding;
  centered?: boolean;
  fluid?: boolean;
}

// Grid component types
export interface EnhancedGridProps extends EnhancedComponentProps {
  columns?: number | { mobile?: number; tablet?: number; desktop?: number };
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  autoFit?: boolean;
  minItemWidth?: string;
}

// Animation component types
export interface EnhancedAnimationProps extends EnhancedComponentProps {
  trigger?: 'load' | 'scroll' | 'hover' | 'click' | 'manual';
  threshold?: number;
  once?: boolean;
  stagger?: boolean;
  staggerDelay?: number;
  parallax?: boolean;
  parallaxSpeed?: number;
}

// Navigation component types
export type NavigationVariant = 'primary' | 'secondary' | 'mobile' | 'breadcrumb';
export type NavigationOrientation = 'horizontal' | 'vertical';

export interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
  disabled?: boolean;
  icon?: ReactNode;
  children?: NavigationItem[];
}

export interface EnhancedNavigationProps extends EnhancedComponentProps {
  variant?: NavigationVariant;
  orientation?: NavigationOrientation;
  items: NavigationItem[];
  activeItem?: string;
  onItemClick?: (item: NavigationItem) => void;
  collapsible?: boolean;
  sticky?: boolean;
}

// Modal component types
export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalPlacement = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface EnhancedModalProps extends EnhancedComponentProps {
  open: boolean;
  onClose: () => void;
  size?: ModalSize;
  placement?: ModalPlacement;
  title?: string;
  description?: string;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
  trapFocus?: boolean;
}

// Form component types
export interface EnhancedFormProps extends EnhancedComponentProps {
  onSubmit: (data: Record<string, any>) => void;
  validation?: Record<string, any>;
  loading?: boolean;
  disabled?: boolean;
  autoComplete?: boolean;
  noValidate?: boolean;
}

// Image component types
export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
export type ImagePosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface EnhancedImageProps extends EnhancedComponentProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  fit?: ImageFit;
  position?: ImagePosition;
  lazy?: boolean;
  placeholder?: string;
  fallback?: string;
  quality?: number;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
}

// Breakpoint configuration
export interface BreakpointConfig {
  mobile: {
    minWidth: number;
    maxWidth: number;
  };
  tablet: {
    minWidth: number;
    maxWidth: number;
  };
  desktop: {
    minWidth: number;
    maxWidth?: number;
  };
}

// Theme configuration
export interface ThemeConfig {
  colors: Record<string, string>;
  typography: Record<string, any>;
  spacing: Record<string, string>;
  shadows: Record<string, string>;
  borderRadius: Record<string, string>;
  animations: Record<string, any>;
  breakpoints: BreakpointConfig;
}

// Component factory types
export interface ComponentFactoryOptions {
  defaultProps?: Record<string, any>;
  variants?: Record<string, any>;
  animations?: Record<string, any>;
  responsive?: boolean;
  accessibility?: boolean;
  performance?: boolean;
}

// Performance optimization types
export interface PerformanceConfig {
  lazyLoad?: boolean;
  virtualizeList?: boolean;
  memoize?: boolean;
  debounceMs?: number;
  throttleMs?: number;
  maxConcurrentAnimations?: number;
}

// Accessibility configuration
export interface AccessibilityConfig {
  ariaLabels?: Record<string, string>;
  keyboardNavigation?: boolean;
  screenReaderSupport?: boolean;
  highContrast?: boolean;
  reducedMotion?: boolean;
  focusManagement?: boolean;
}