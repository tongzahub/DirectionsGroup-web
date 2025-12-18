/**
 * Theme Toggle Component
 * Apple-inspired theme toggle with smooth morphing animation between light and dark states
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '@/hooks/useTheme';

export interface ThemeToggleProps {
  variant?: 'switch' | 'button' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  position?: 'inline' | 'floating';
  className?: string;
  ariaLabel?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  variant = 'switch',
  size = 'md',
  showLabel = false,
  position = 'inline',
  className = '',
  ariaLabel,
}) => {
  const { currentTheme, themeMode, toggleTheme, isTransitioning } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div 
        className={`theme-toggle-skeleton ${getSizeClasses(size)} ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = currentTheme === 'dark';
  const isSystem = themeMode === 'system';

  const handleToggle = () => {
    toggleTheme();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggle();
    }
  };

  const baseClasses = `
    theme-toggle
    ${getVariantClasses(variant)}
    ${getSizeClasses(size)}
    ${getPositionClasses(position)}
    ${isTransitioning ? 'transitioning' : ''}
    ${className}
  `.trim();

  const label = getThemeLabel(themeMode, currentTheme);
  const accessibilityLabel = ariaLabel || `Switch to ${isDark ? 'light' : 'dark'} theme`;

  if (variant === 'switch') {
    return (
      <div className={baseClasses}>
        {showLabel && (
          <span className="theme-toggle-label">
            {label}
          </span>
        )}
        <button
          type="button"
          role="switch"
          aria-checked={isDark}
          aria-label={accessibilityLabel}
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          className="theme-toggle-switch"
          disabled={isTransitioning}
        >
          <span className="theme-toggle-track">
            <span className="theme-toggle-thumb">
              <SunIcon className="theme-toggle-sun" />
              <MoonIcon className="theme-toggle-moon" />
            </span>
          </span>
          <span className="sr-only">{accessibilityLabel}</span>
        </button>
      </div>
    );
  }

  if (variant === 'icon') {
    return (
      <button
        type="button"
        aria-label={accessibilityLabel}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={baseClasses}
        disabled={isTransitioning}
      >
        <div className="theme-toggle-icon-container">
          <SunIcon className="theme-toggle-sun" />
          <MoonIcon className="theme-toggle-moon" />
        </div>
        {showLabel && (
          <span className="theme-toggle-label">
            {label}
          </span>
        )}
      </button>
    );
  }

  // Button variant
  return (
    <button
      type="button"
      aria-label={accessibilityLabel}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      className={baseClasses}
      disabled={isTransitioning}
    >
      <div className="theme-toggle-icon-container">
        <SunIcon className="theme-toggle-sun" />
        <MoonIcon className="theme-toggle-moon" />
      </div>
      {showLabel && (
        <span className="theme-toggle-label">
          {label}
        </span>
      )}
    </button>
  );
};

// Helper functions
function getVariantClasses(variant: string): string {
  const variants = {
    switch: 'theme-toggle--switch',
    button: 'theme-toggle--button',
    icon: 'theme-toggle--icon',
  };
  return variants[variant as keyof typeof variants] || variants.switch;
}

function getSizeClasses(size: string): string {
  const sizes = {
    sm: 'theme-toggle--sm',
    md: 'theme-toggle--md',
    lg: 'theme-toggle--lg',
  };
  return sizes[size as keyof typeof sizes] || sizes.md;
}

function getPositionClasses(position: string): string {
  const positions = {
    inline: 'theme-toggle--inline',
    floating: 'theme-toggle--floating',
  };
  return positions[position as keyof typeof positions] || positions.inline;
}

function getThemeLabel(themeMode: string, currentTheme: string): string {
  if (themeMode === 'system') {
    return `Auto (${currentTheme})`;
  }
  return currentTheme === 'dark' ? 'Dark' : 'Light';
}

// Icon components with smooth morphing animations
const SunIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={`theme-icon theme-icon-sun ${className}`}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g className="sun-rays">
      <path
        d="M10 2V4M10 16V18M4 10H2M18 10H16M5.636 5.636L4.222 4.222M15.778 4.222L14.364 5.636M14.364 14.364L15.778 15.778M4.222 15.778L5.636 14.364"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <circle
      className="sun-center"
      cx="10"
      cy="10"
      r="3"
      stroke="currentColor"
      strokeWidth="1.5"
      fill="none"
    />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={`theme-icon theme-icon-moon ${className}`}
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      className="moon-shape"
      d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="currentColor"
      fillOpacity="0.1"
    />
  </svg>
);

export default ThemeToggle;