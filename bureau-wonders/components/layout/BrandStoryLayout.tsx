'use client';

import React from 'react';
import { designTokens } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface BrandStoryLayoutProps {
  children: React.ReactNode;
  className?: string;
}

interface SectionContainerProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  variant?: 'default' | 'hero' | 'content' | 'cta';
  background?: 'white' | 'gray' | 'gradient' | 'transparent';
}

/**
 * Main layout container for the brand story page
 * Implements responsive spacing system and proper content flow
 */
export function BrandStoryLayout({ children, className }: BrandStoryLayoutProps) {
  return (
    <div 
      className={cn(
        // Base layout styles
        'min-h-screen bg-white',
        // Responsive spacing system
        'space-y-0', // No default spacing between sections
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Section container with responsive spacing and background options
 * Follows design system spacing: 120px desktop, 80px mobile
 */
export function SectionContainer({ 
  children, 
  className, 
  id,
  variant = 'default',
  background = 'transparent'
}: SectionContainerProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'hero':
        return 'py-16 sm:py-20 md:py-24 lg:py-32'; // Extra padding for hero
      case 'content':
        return 'py-20 sm:py-24 md:py-28 lg:py-32'; // Standard content padding
      case 'cta':
        return 'py-16 sm:py-20 md:py-24 lg:py-28'; // CTA section padding
      default:
        return 'py-12 sm:py-16 md:py-20 lg:py-24'; // Default padding
    }
  };

  const getBackgroundStyles = () => {
    switch (background) {
      case 'white':
        return 'bg-white';
      case 'gray':
        return 'bg-neutral-50';
      case 'gradient':
        return 'bg-gradient-to-br from-neutral-50 to-white';
      default:
        return 'bg-transparent';
    }
  };

  return (
    <section
      id={id}
      className={cn(
        // Base section styles
        'relative w-full',
        // Responsive padding system
        getVariantStyles(),
        // Background styles
        getBackgroundStyles(),
        // Custom styles
        className
      )}
    >
      {children}
    </section>
  );
}

/**
 * Content container with max-width and horizontal padding
 * Implements responsive container system
 */
export function ContentContainer({ 
  children, 
  className,
  maxWidth = 'default'
}: {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'default' | 'full';
}) {
  const getMaxWidthClass = () => {
    switch (maxWidth) {
      case 'sm':
        return 'max-w-2xl';
      case 'md':
        return 'max-w-4xl';
      case 'lg':
        return 'max-w-6xl';
      case 'xl':
        return 'max-w-7xl';
      case '2xl':
        return 'max-w-8xl';
      case 'full':
        return 'max-w-full';
      default:
        return 'max-w-7xl'; // Default container width
    }
  };

  return (
    <div 
      className={cn(
        // Container system
        'container mx-auto',
        // Responsive horizontal padding
        'px-4 sm:px-6 lg:px-8',
        // Max width
        getMaxWidthClass(),
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Grid system for responsive layouts
 */
export function ResponsiveGrid({ 
  children, 
  className,
  columns = { sm: 1, md: 2, lg: 3 },
  gap = 'default'
}: {
  children: React.ReactNode;
  className?: string;
  columns?: { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: 'sm' | 'md' | 'lg' | 'xl' | 'default';
}) {
  const getGapClass = () => {
    switch (gap) {
      case 'sm':
        return 'gap-4';
      case 'md':
        return 'gap-6';
      case 'lg':
        return 'gap-8';
      case 'xl':
        return 'gap-12';
      default:
        return 'gap-6 md:gap-8';
    }
  };

  const getColumnsClass = () => {
    const classes = ['grid'];
    
    if (columns.sm) classes.push(`grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);
    
    return classes.join(' ');
  };

  return (
    <div 
      className={cn(
        getColumnsClass(),
        getGapClass(),
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Flexible layout component for complex arrangements
 */
export function FlexLayout({ 
  children, 
  className,
  direction = 'column',
  align = 'start',
  justify = 'start',
  gap = 'default',
  wrap = false
}: {
  children: React.ReactNode;
  className?: string;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  gap?: 'sm' | 'md' | 'lg' | 'xl' | 'default';
  wrap?: boolean;
}) {
  const getDirectionClass = () => {
    switch (direction) {
      case 'row':
        return 'flex-row';
      case 'column':
        return 'flex-col';
      case 'row-reverse':
        return 'flex-row-reverse';
      case 'column-reverse':
        return 'flex-col-reverse';
      default:
        return 'flex-col';
    }
  };

  const getAlignClass = () => {
    switch (align) {
      case 'start':
        return 'items-start';
      case 'center':
        return 'items-center';
      case 'end':
        return 'items-end';
      case 'stretch':
        return 'items-stretch';
      default:
        return 'items-start';
    }
  };

  const getJustifyClass = () => {
    switch (justify) {
      case 'start':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'end':
        return 'justify-end';
      case 'between':
        return 'justify-between';
      case 'around':
        return 'justify-around';
      case 'evenly':
        return 'justify-evenly';
      default:
        return 'justify-start';
    }
  };

  const getGapClass = () => {
    switch (gap) {
      case 'sm':
        return 'gap-2';
      case 'md':
        return 'gap-4';
      case 'lg':
        return 'gap-6';
      case 'xl':
        return 'gap-8';
      default:
        return 'gap-4';
    }
  };

  return (
    <div 
      className={cn(
        'flex',
        getDirectionClass(),
        getAlignClass(),
        getJustifyClass(),
        getGapClass(),
        wrap && 'flex-wrap',
        className
      )}
    >
      {children}
    </div>
  );
}

export default BrandStoryLayout;