/**
 * Enhanced Components Index
 * Export all enhanced components for easy importing
 */

// Base components
export { 
  createEnhancedComponent,
  EnhancedDiv,
  EnhancedSection,
  EnhancedArticle,
  EnhancedHeader,
  EnhancedFooter,
  EnhancedMain,
  ResponsiveWrapper,
  createComponentClasses
} from './BaseComponent';

// Re-export enhanced UI components
export { default as Button } from '../ui/Button';
export { default as Card } from '../ui/Card';
export { default as Input } from '../ui/Input';

// Re-export animation components
export { default as FadeIn } from '../animations/FadeIn';
export { default as ScrollReveal } from '../animations/ScrollReveal';
export { default as SlideUp } from '../animations/SlideUp';
export { default as StaggerContainer } from '../animations/StaggerContainer';
export { default as StaggerItem } from '../animations/StaggerItem';

// Types
export type * from '../../types/enhanced-components';