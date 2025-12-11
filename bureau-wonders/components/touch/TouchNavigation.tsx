'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSwipeGesture, useTouchHover, useTouchFeedback } from '@/hooks/useTouchInteractions';
import { useDeviceType } from '@/lib/responsive';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ArrowLeftIcon,
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

export interface NavigationItem {
  id: string;
  title: string;
  href: string;
  description?: string;
  image?: string;
}

export interface TouchNavigationProps {
  items: NavigationItem[];
  currentIndex: number;
  onNavigate: (index: number) => void;
  className?: string;
  showPreviews?: boolean;
  enableSwipe?: boolean;
}

const TouchNavigation: React.FC<TouchNavigationProps> = ({
  items,
  currentIndex,
  onNavigate,
  className = '',
  showPreviews = true,
  enableSwipe = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const deviceType = useDeviceType();
  const { triggerFeedback } = useTouchFeedback();

  const previousItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem = currentIndex < items.length - 1 ? items[currentIndex + 1] : null;

  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (previousItem) {
      onNavigate(currentIndex - 1);
      triggerFeedback('light');
    }
  }, [previousItem, currentIndex, onNavigate, triggerFeedback]);

  const goToNext = useCallback(() => {
    if (nextItem) {
      onNavigate(currentIndex + 1);
      triggerFeedback('light');
    }
  }, [nextItem, currentIndex, onNavigate, triggerFeedback]);

  // Swipe gesture handling
  const handleSwipe = useCallback((gesture: any) => {
    if (!enableSwipe) return;
    
    if (gesture.direction === 'left' && nextItem) {
      goToNext();
    } else if (gesture.direction === 'right' && previousItem) {
      goToPrevious();
    }
  }, [enableSwipe, nextItem, previousItem, goToNext, goToPrevious]);

  const swipeProps = useSwipeGesture(handleSwipe, {
    threshold: 50,
    direction: 'horizontal',
    preventScroll: true,
  });

  // Touch hover for navigation buttons
  const prevHover = useTouchHover({ touchDelay: 100 });
  const nextHover = useTouchHover({ touchDelay: 100 });

  return (
    <div className={cn('relative', className)} {...(enableSwipe ? swipeProps : {})}>
      {/* Compact Navigation Bar */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl shadow-sm">
        {/* Previous Button */}
        <motion.button
          onClick={goToPrevious}
          disabled={!previousItem}
          className={cn(
            'flex items-center space-x-2 p-3 rounded-lg transition-all duration-200',
            'min-h-[48px] min-w-[48px]', // Touch-friendly size
            previousItem
              ? 'text-primary-600 hover:bg-primary-50 active:bg-primary-100'
              : 'text-neutral-300 cursor-not-allowed',
            prevHover.isHovered && previousItem && 'bg-primary-50'
          )}
          whileTap={previousItem ? { scale: 0.95 } : undefined}
          {...prevHover.touchProps}
          {...(deviceType !== 'mobile' ? prevHover.mouseProps : {})}
        >
          <ArrowLeftIcon className="h-5 w-5" />
          {deviceType !== 'mobile' && previousItem && (
            <span className="text-sm font-medium truncate max-w-[120px]">
              {previousItem.title}
            </span>
          )}
        </motion.button>

        {/* Current Item Info */}
        <div className="flex-1 text-center px-4">
          <div className="text-sm text-neutral-500">
            {currentIndex + 1} of {items.length}
          </div>
          <div className="text-base font-medium text-neutral-900 truncate">
            {items[currentIndex]?.title}
          </div>
        </div>

        {/* Next Button */}
        <motion.button
          onClick={goToNext}
          disabled={!nextItem}
          className={cn(
            'flex items-center space-x-2 p-3 rounded-lg transition-all duration-200',
            'min-h-[48px] min-w-[48px]', // Touch-friendly size
            nextItem
              ? 'text-primary-600 hover:bg-primary-50 active:bg-primary-100'
              : 'text-neutral-300 cursor-not-allowed',
            nextHover.isHovered && nextItem && 'bg-primary-50'
          )}
          whileTap={nextItem ? { scale: 0.95 } : undefined}
          {...nextHover.touchProps}
          {...(deviceType !== 'mobile' ? nextHover.mouseProps : {})}
        >
          {deviceType !== 'mobile' && nextItem && (
            <span className="text-sm font-medium truncate max-w-[120px]">
              {nextItem.title}
            </span>
          )}
          <ArrowRightIcon className="h-5 w-5" />
        </motion.button>

        {/* Expand Button for Mobile */}
        {deviceType === 'mobile' && showPreviews && (
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2 p-2 text-neutral-500 hover:text-neutral-700 rounded-lg hover:bg-neutral-100"
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </motion.div>
          </motion.button>
        )}
      </div>

      {/* Expanded Preview Cards (Mobile) */}
      <AnimatePresence>
        {isExpanded && deviceType === 'mobile' && showPreviews && (
          <motion.div
            className="mt-4 space-y-3"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Previous Item Preview */}
            {previousItem && (
              <motion.button
                onClick={goToPrevious}
                className="w-full p-4 bg-white border border-neutral-200 rounded-xl text-left hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <ArrowLeftIcon className="h-5 w-5 text-primary-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-neutral-900 truncate">
                      {previousItem.title}
                    </div>
                    {previousItem.description && (
                      <div className="text-xs text-neutral-500 truncate mt-1">
                        {previousItem.description}
                      </div>
                    )}
                  </div>
                </div>
              </motion.button>
            )}

            {/* Next Item Preview */}
            {nextItem && (
              <motion.button
                onClick={goToNext}
                className="w-full p-4 bg-white border border-neutral-200 rounded-xl text-left hover:bg-neutral-50 active:bg-neutral-100 transition-colors"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-neutral-900 truncate">
                      {nextItem.title}
                    </div>
                    {nextItem.description && (
                      <div className="text-xs text-neutral-500 truncate mt-1">
                        {nextItem.description}
                      </div>
                    )}
                  </div>
                  <ArrowRightIcon className="h-5 w-5 text-primary-600 flex-shrink-0" />
                </div>
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Preview Cards */}
      {deviceType !== 'mobile' && showPreviews && (
        <div className="mt-6 grid grid-cols-2 gap-6">
          {/* Previous Item Preview */}
          <div className="space-y-2">
            {previousItem ? (
              <motion.button
                onClick={goToPrevious}
                className="w-full p-6 bg-white border border-neutral-200 rounded-xl text-left hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <ArrowLeftIcon className="h-5 w-5 text-primary-600" />
                  <span className="text-sm font-medium text-primary-600">Previous</span>
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {previousItem.title}
                </h3>
                {previousItem.description && (
                  <p className="text-sm text-neutral-600 line-clamp-2">
                    {previousItem.description}
                  </p>
                )}
              </motion.button>
            ) : (
              <div className="w-full p-6 bg-neutral-50 border border-neutral-200 rounded-xl opacity-50">
                <div className="flex items-center space-x-3 mb-3">
                  <ArrowLeftIcon className="h-5 w-5 text-neutral-400" />
                  <span className="text-sm font-medium text-neutral-400">Previous</span>
                </div>
                <p className="text-sm text-neutral-400">No previous item</p>
              </div>
            )}
          </div>

          {/* Next Item Preview */}
          <div className="space-y-2">
            {nextItem ? (
              <motion.button
                onClick={goToNext}
                className="w-full p-6 bg-white border border-neutral-200 rounded-xl text-left hover:border-primary-300 hover:shadow-md transition-all duration-200 group"
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-end space-x-3 mb-3">
                  <span className="text-sm font-medium text-primary-600">Next</span>
                  <ArrowRightIcon className="h-5 w-5 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors text-right">
                  {nextItem.title}
                </h3>
                {nextItem.description && (
                  <p className="text-sm text-neutral-600 line-clamp-2 text-right">
                    {nextItem.description}
                  </p>
                )}
              </motion.button>
            ) : (
              <div className="w-full p-6 bg-neutral-50 border border-neutral-200 rounded-xl opacity-50">
                <div className="flex items-center justify-end space-x-3 mb-3">
                  <span className="text-sm font-medium text-neutral-400">Next</span>
                  <ArrowRightIcon className="h-5 w-5 text-neutral-400" />
                </div>
                <p className="text-sm text-neutral-400 text-right">No next item</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Swipe Indicator for Mobile */}
      {deviceType === 'mobile' && enableSwipe && (
        <motion.div
          className="mt-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <p className="text-xs text-neutral-400">
            Swipe left or right to navigate
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default TouchNavigation;