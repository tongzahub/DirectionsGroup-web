'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDeviceType } from '@/lib/responsive';
import { useTouchHover, useTouchFeedback } from '@/hooks/useTouchInteractions';
import { 
  ChevronUpIcon, 
  ChevronDownIcon,
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface NavigationSection {
  id: string;
  title: string;
  shortTitle?: string;
  description?: string;
}

interface MobileBrandStoryNavigationProps {
  sections: NavigationSection[];
  currentSection: string;
  onSectionChange: (sectionId: string) => void;
  className?: string;
}

const MobileBrandStoryNavigation: React.FC<MobileBrandStoryNavigationProps> = ({
  sections,
  currentSection,
  onSectionChange,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const deviceType = useDeviceType();
  const { triggerFeedback } = useTouchFeedback();

  // Auto-hide navigation on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down
        setIsVisible(false);
        setIsExpanded(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Touch hover for navigation items
  const menuHover = useTouchHover({ touchDelay: 100 });

  const handleSectionClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsExpanded(false);
    triggerFeedback('light');
    
    // Smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    }
  };

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    triggerFeedback('medium');
  };

  const currentSectionIndex = sections.findIndex(section => section.id === currentSection);
  const currentSectionData = sections[currentSectionIndex];

  // Don't render on desktop
  if (deviceType === 'desktop') {
    return null;
  }

  return (
    <>
      {/* Fixed Navigation Bar */}
      <motion.div
        className={cn(
          'fixed bottom-4 left-4 right-4 z-50 bg-white/90 backdrop-blur-md border border-neutral-200 rounded-2xl shadow-luxury-lg',
          className
        )}
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : 100, 
          opacity: isVisible ? 1 : 0 
        }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        {/* Compact Navigation Header */}
        <div className="flex items-center justify-between p-4">
          {/* Current Section Info */}
          <div className="flex-1 min-w-0">
            <div className="text-xs text-neutral-500 uppercase tracking-wide">
              {currentSectionIndex + 1} of {sections.length}
            </div>
            <div className="text-sm font-semibold text-neutral-900 truncate">
              {currentSectionData?.shortTitle || currentSectionData?.title}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2">
            {/* Previous/Next Buttons */}
            <button
              onClick={() => {
                if (currentSectionIndex > 0) {
                  handleSectionClick(sections[currentSectionIndex - 1].id);
                }
              }}
              disabled={currentSectionIndex === 0}
              className={cn(
                'p-2 rounded-lg transition-colors touch-target',
                currentSectionIndex === 0
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-primary-600 hover:bg-primary-50 active:bg-primary-100'
              )}
            >
              <ChevronUpIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => {
                if (currentSectionIndex < sections.length - 1) {
                  handleSectionClick(sections[currentSectionIndex + 1].id);
                }
              }}
              disabled={currentSectionIndex === sections.length - 1}
              className={cn(
                'p-2 rounded-lg transition-colors touch-target',
                currentSectionIndex === sections.length - 1
                  ? 'text-neutral-300 cursor-not-allowed'
                  : 'text-primary-600 hover:bg-primary-50 active:bg-primary-100'
              )}
            >
              <ChevronDownIcon className="w-5 h-5" />
            </button>

            {/* Menu Toggle */}
            <motion.button
              onClick={toggleExpanded}
              className={cn(
                'p-2 rounded-lg transition-colors touch-target',
                'text-primary-600 hover:bg-primary-50 active:bg-primary-100',
                isExpanded && 'bg-primary-100'
              )}
              whileTap={{ scale: 0.95 }}
              {...menuHover.touchProps}
              {...(deviceType !== 'mobile' ? menuHover.mouseProps : {})}
            >
              <AnimatePresence mode="wait">
                {isExpanded ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Bars3Icon className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Expanded Section List */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              className="border-t border-neutral-200"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <div className="max-h-64 overflow-y-auto p-2">
                {sections.map((section, index) => (
                  <motion.button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={cn(
                      'w-full text-left p-3 rounded-lg transition-all duration-200 touch-target',
                      'hover:bg-neutral-50 active:bg-neutral-100',
                      section.id === currentSection
                        ? 'bg-primary-50 border border-primary-200'
                        : 'border border-transparent'
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          <div className={cn(
                            'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold',
                            section.id === currentSection
                              ? 'bg-primary-600 text-white'
                              : 'bg-neutral-200 text-neutral-600'
                          )}>
                            {index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={cn(
                              'text-sm font-medium truncate',
                              section.id === currentSection
                                ? 'text-primary-900'
                                : 'text-neutral-900'
                            )}>
                              {section.title}
                            </div>
                            {section.description && (
                              <div className="text-xs text-neutral-500 truncate mt-0.5">
                                {section.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      {section.id === currentSection && (
                        <motion.div
                          className="w-2 h-2 bg-primary-600 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-40 h-1 bg-neutral-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary-600 to-accent-gold"
          initial={{ width: 0 }}
          animate={{ 
            width: `${((currentSectionIndex + 1) / sections.length) * 100}%` 
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </motion.div>
    </>
  );
};

export default MobileBrandStoryNavigation;