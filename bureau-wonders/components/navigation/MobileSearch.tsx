'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useTouchHover, useTouchFeedback } from '@/hooks/useTouchInteractions';
import { useMobileAnimationConfig } from '@/lib/mobile-animation-config';
import { 
  MagnifyingGlassIcon, 
  XMarkIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'page' | 'blog' | 'service' | 'team';
  href: string;
  image?: string;
}

export interface MobileSearchProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  onResultSelect?: (result: SearchResult) => void;
  results?: SearchResult[];
  recentSearches?: string[];
  popularSearches?: string[];
  isLoading?: boolean;
}

const MobileSearch: React.FC<MobileSearchProps> = ({
  className = '',
  placeholder = 'Search...',
  onSearch,
  onResultSelect,
  results = [],
  recentSearches = [],
  popularSearches = ['Services', 'About', 'Contact', 'Blog'],
  isLoading = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { config, shouldAnimate } = useMobileAnimationConfig();
  const { triggerFeedback } = useTouchFeedback();
  
  const searchHover = useTouchHover({
    touchDelay: 50,
    hoverTimeout: 150,
  });

  // Handle search expansion
  const expandSearch = () => {
    setIsExpanded(true);
    setShowSuggestions(true);
    triggerFeedback('light');
    
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  // Handle search collapse
  const collapseSearch = () => {
    setIsExpanded(false);
    setShowSuggestions(false);
    setQuery('');
    inputRef.current?.blur();
  };

  // Handle search input
  const handleSearch = (value: string) => {
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
    setShowSuggestions(value.length > 0 || recentSearches.length > 0);
  };

  // Handle result selection
  const handleResultSelect = (result: SearchResult) => {
    if (onResultSelect) {
      onResultSelect(result);
    }
    collapseSearch();
    triggerFeedback('medium');
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (suggestion: string) => {
    setQuery(suggestion);
    handleSearch(suggestion);
    triggerFeedback('light');
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isExpanded) {
        collapseSearch();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isExpanded]);

  // Get icon for result type
  const getResultIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'page':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'blog':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'service':
        return <BriefcaseIcon className="h-4 w-4" />;
      case 'team':
        return <UserGroupIcon className="h-4 w-4" />;
      default:
        return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  // Animation variants
  const containerVariants = {
    collapsed: {
      width: 48,
      transition: {
        duration: config.duration,
        ease: config.easing,
      },
    },
    expanded: {
      width: '100%',
      transition: {
        duration: config.duration,
        ease: config.easing,
      },
    },
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        duration: config.duration,
      },
    },
  };

  const resultsVariants = {
    hidden: { 
      opacity: 0, 
      y: -10,
      transition: {
        duration: config.duration,
      },
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: config.duration,
        staggerChildren: shouldAnimate ? 0.05 : 0,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: config.duration,
      },
    },
  };

  return (
    <>
      {/* Search Container */}
      <motion.div
        ref={containerRef}
        className={cn(
          'relative bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden',
          className
        )}
        variants={containerVariants}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        layout
      >
        <div className="flex items-center h-12">
          {/* Search Button/Icon */}
          <motion.button
            onClick={expandSearch}
            className={cn(
              'flex-shrink-0 p-3 text-neutral-500 hover:text-primary-600 transition-colors',
              'min-h-[48px] min-w-[48px] flex items-center justify-center',
              searchHover.isHovered && 'text-primary-600'
            )}
            whileTap={{ scale: 0.95 }}
            {...searchHover.touchProps}
            {...searchHover.mouseProps}
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
          </motion.button>

          {/* Search Input */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                className="flex-1 flex items-center"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full px-2 py-2 text-neutral-900 placeholder-neutral-500 bg-transparent border-none outline-none"
                />
                
                {/* Loading Spinner */}
                {isLoading && (
                  <motion.div
                    className="flex-shrink-0 mr-2"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="w-4 h-4 border-2 border-primary-200 border-t-primary-600 rounded-full" />
                  </motion.div>
                )}

                {/* Clear Button */}
                {query && (
                  <motion.button
                    onClick={() => handleSearch('')}
                    className="flex-shrink-0 p-1 mr-2 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 transition-colors"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </motion.button>
                )}

                {/* Close Button */}
                <motion.button
                  onClick={collapseSearch}
                  className="flex-shrink-0 p-2 text-neutral-400 hover:text-neutral-600 transition-colors"
                  whileTap={{ scale: 0.95 }}
                >
                  <XMarkIcon className="h-5 w-5" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Search Overlay */}
      <AnimatePresence>
        {isExpanded && showSuggestions && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={collapseSearch}
            />

            {/* Results Panel */}
            <motion.div
              className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto"
              variants={resultsVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              {/* Search Results */}
              {query && results.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-neutral-700 mb-3">Results</h3>
                  <div className="space-y-2">
                    {results.map((result, index) => (
                      <motion.button
                        key={result.id}
                        onClick={() => handleResultSelect(result)}
                        className="w-full p-3 text-left rounded-lg hover:bg-neutral-50 active:bg-neutral-100 transition-colors group"
                        variants={itemVariants}
                        custom={index}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0 mt-1 text-neutral-400 group-hover:text-primary-600">
                            {getResultIcon(result.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-neutral-900 group-hover:text-primary-700">
                              {result.title}
                            </div>
                            <div className="text-sm text-neutral-500 mt-1 line-clamp-2">
                              {result.description}
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* No Results */}
              {query && results.length === 0 && !isLoading && (
                <div className="p-8 text-center">
                  <MagnifyingGlassIcon className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
                  <div className="text-neutral-500">No results found for "{query}"</div>
                </div>
              )}

              {/* Recent Searches */}
              {!query && recentSearches.length > 0 && (
                <div className="p-4 border-b border-neutral-100">
                  <h3 className="text-sm font-medium text-neutral-700 mb-3 flex items-center">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    Recent
                  </h3>
                  <div className="space-y-1">
                    {recentSearches.slice(0, 5).map((search, index) => (
                      <motion.button
                        key={search}
                        onClick={() => handleSuggestionSelect(search)}
                        className="w-full p-2 text-left text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        variants={itemVariants}
                        custom={index}
                        whileTap={{ scale: 0.98 }}
                      >
                        {search}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              {!query && popularSearches.length > 0 && (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-neutral-700 mb-3 flex items-center">
                    <ArrowTrendingUpIcon className="h-4 w-4 mr-2" />
                    Popular
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((search, index) => (
                      <motion.button
                        key={search}
                        onClick={() => handleSuggestionSelect(search)}
                        className="px-3 py-2 text-sm bg-neutral-100 text-neutral-700 hover:bg-primary-100 hover:text-primary-700 rounded-full transition-colors"
                        variants={itemVariants}
                        custom={index}
                        whileTap={{ scale: 0.95 }}
                      >
                        {search}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileSearch;