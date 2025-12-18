/**
 * Theme-Aware Animation System Demo
 * Demonstrates all the theme-aware animation capabilities
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  useThemeAwareEntrance,
  useThemeAwareScrollReveal,
  useThemeAwareMicroInteractions,
  useThemeTransitionAnimation,
} from '../../hooks/useThemeAwareAnimations';
import { useTheme } from '../../hooks/useTheme';
import { useThemePerformanceMonitor } from '../../lib/theme-performance-monitor';

const ThemeAwareAnimationDemo: React.FC = () => {
  const { currentTheme, toggleTheme, isTransitioning } = useTheme();
  const { metrics, getPerformanceSummary } = useThemePerformanceMonitor();
  const [showPerformanceInfo, setShowPerformanceInfo] = useState(false);
  
  // Entrance animation example
  const entranceAnimation = useThemeAwareEntrance('fadeIn', {
    delay: 0.2,
    themeAdaptive: true,
  });
  
  // Scroll reveal example
  const scrollReveal = useThemeAwareScrollReveal(4, {
    stagger: 0.1,
    direction: 'up',
    themeAdaptive: true,
  });
  
  // Micro-interactions example
  const buttonInteraction = useThemeAwareMicroInteractions('button', {
    themeAdaptive: true,
  });
  
  const cardInteraction = useThemeAwareMicroInteractions('card', {
    themeAdaptive: true,
  });
  
  // Theme transition animation
  const themeTransition = useThemeTransitionAnimation();
  
  const performanceSummary = getPerformanceSummary();
  
  return (
    <div className="min-h-screen theme-surface theme-transition">
      {/* Header Section with Entrance Animation */}
      <motion.section
        ref={entranceAnimation.ref}
        initial="hidden"
        animate={entranceAnimation.isVisible ? "visible" : "hidden"}
        variants={entranceAnimation.variants}
        className="py-20 px-6 text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold theme-text-primary mb-6">
          Theme-Aware Animation System
        </h1>
        <p className="text-xl theme-text-secondary max-w-3xl mx-auto mb-8">
          Experience smooth, performance-optimized animations that adapt beautifully 
          to both light and dark themes with Apple-inspired sophistication.
        </p>
        
        {/* Theme Toggle Button */}
        <motion.button
          {...buttonInteraction.handlers}
          variants={buttonInteraction.variants}
          animate={buttonInteraction.currentState}
          onClick={toggleTheme}
          disabled={isTransitioning}
          className="theme-luxury-button px-8 py-4 text-lg font-semibold rounded-xl"
        >
          {isTransitioning ? 'Switching...' : `Switch to ${currentTheme === 'dark' ? 'Light' : 'Dark'} Theme`}
        </motion.button>
      </motion.section>
      
      {/* Performance Metrics Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="theme-luxury-card p-8 mb-8"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold theme-text-primary">
                Performance Metrics
              </h2>
              <button
                onClick={() => setShowPerformanceInfo(!showPerformanceInfo)}
                className="theme-interactive px-4 py-2 rounded-lg theme-border border"
              >
                {showPerformanceInfo ? 'Hide' : 'Show'} Details
              </button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-3xl font-bold theme-text-accent">
                  {Math.round(metrics.currentFPS)}
                </div>
                <div className="text-sm theme-text-secondary">Current FPS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold theme-text-accent">
                  {Math.round(metrics.averageFPS)}
                </div>
                <div className="text-sm theme-text-secondary">Average FPS</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold theme-text-accent">
                  {performanceSummary.performanceLevel}
                </div>
                <div className="text-sm theme-text-secondary">Performance</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold theme-text-accent">
                  {currentTheme}
                </div>
                <div className="text-sm theme-text-secondary">Current Theme</div>
              </div>
            </div>
            
            {showPerformanceInfo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="theme-surface-secondary p-4 rounded-lg"
              >
                <h3 className="font-semibold theme-text-primary mb-2">
                  Performance Recommendations:
                </h3>
                <ul className="space-y-1">
                  {performanceSummary.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm theme-text-secondary">
                      • {rec}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
      
      {/* Scroll Reveal Animation Examples */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold theme-text-primary text-center mb-12">
            Scroll-Triggered Animations
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }, (_, index) => (
              <motion.div
                key={index}
                ref={(el) => {
                  if (el) scrollReveal.refs.current[index] = el;
                }}
                initial="hidden"
                animate={scrollReveal.revealedElements[index] ? "visible" : "hidden"}
                variants={scrollReveal.createDirectionalVariants(index)}
                {...cardInteraction.handlers}
                className="theme-luxury-card p-6 cursor-pointer"
              >
                <div className="w-12 h-12 theme-surface-secondary rounded-lg mb-4 flex items-center justify-center">
                  <div className="w-6 h-6 bg-gradient-to-br from-accent-gold to-accent-copper rounded"></div>
                </div>
                <h3 className="text-lg font-semibold theme-text-primary mb-2">
                  Animation Card {index + 1}
                </h3>
                <p className="theme-text-secondary text-sm">
                  This card demonstrates theme-aware scroll-triggered animations 
                  with staggered reveals and performance optimization.
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Interactive Elements Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold theme-text-primary text-center mb-12">
            Interactive Elements
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Button Examples */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold theme-text-primary">Buttons</h3>
              <motion.button
                {...buttonInteraction.handlers}
                variants={buttonInteraction.variants}
                animate={buttonInteraction.currentState}
                className="w-full theme-luxury-button py-3 px-6 rounded-lg"
              >
                Primary Button
              </motion.button>
              <motion.button
                {...buttonInteraction.handlers}
                variants={buttonInteraction.variants}
                animate={buttonInteraction.currentState}
                className="w-full theme-surface-secondary theme-border border py-3 px-6 rounded-lg theme-text-primary"
              >
                Secondary Button
              </motion.button>
            </div>
            
            {/* Card Examples */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold theme-text-primary">Cards</h3>
              <motion.div
                {...cardInteraction.handlers}
                variants={cardInteraction.variants}
                animate={cardInteraction.currentState}
                className="theme-luxury-card p-6 cursor-pointer"
              >
                <h4 className="font-semibold theme-text-primary mb-2">
                  Interactive Card
                </h4>
                <p className="theme-text-secondary text-sm">
                  Hover or tap to see theme-aware micro-interactions.
                </p>
              </motion.div>
            </div>
            
            {/* Form Examples */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold theme-text-primary">Forms</h3>
              <input
                type="text"
                placeholder="Theme-aware input"
                className="w-full theme-input"
              />
              <textarea
                placeholder="Theme-aware textarea"
                rows={3}
                className="w-full theme-input resize-none"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Theme Transition Progress */}
      {isTransitioning && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-6 right-6 theme-luxury-card p-4 z-50"
        >
          <div className="flex items-center space-x-3">
            <div className="w-4 h-4 border-2 border-accent-gold border-t-transparent rounded-full animate-spin"></div>
            <span className="theme-text-primary text-sm font-medium">
              Switching to {currentTheme === 'dark' ? 'Light' : 'Dark'} Theme...
            </span>
          </div>
          <div className="mt-2 w-full bg-surface-secondary rounded-full h-1">
            <motion.div
              className="bg-accent-gold h-1 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${themeTransition.transitionProgress * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ThemeAwareAnimationDemo;