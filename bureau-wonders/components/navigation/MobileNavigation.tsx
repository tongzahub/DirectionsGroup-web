'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSwipeGesture, useTouchHover, useTouchFeedback } from '@/hooks/useTouchInteractions';
import { useMobileAnimationConfig } from '@/lib/mobile-animation-config';
import { useDeviceType } from '@/lib/responsive';
import { 
  Bars3Icon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  ChevronRightIcon,
  HomeIcon,
  InformationCircleIcon,
  BriefcaseIcon,
  NewspaperIcon,
  UserGroupIcon,
  PhoneIcon
} from '@heroicons/react/24/outline';

export interface NavigationItem {
  href: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  badge?: string;
}

export interface MobileNavigationProps {
  navigation: NavigationItem[];
  siteName: string;
  className?: string;
  enableSearch?: boolean;
  enableGestures?: boolean;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  navigation,
  siteName,
  className = '',
  enableSearch = true,
  enableGestures = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  
  const pathname = usePathname();
  const deviceType = useDeviceType();
  const { config, shouldAnimate, complexity } = useMobileAnimationConfig();
  const { triggerFeedback } = useTouchFeedback();
  
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Default icons for navigation items
  const defaultIcons = {
    '/': <HomeIcon className="h-5 w-5" />,
    '/about': <InformationCircleIcon className="h-5 w-5" />,
    '/services': <BriefcaseIcon className="h-5 w-5" />,
    '/blog': <NewspaperIcon className="h-5 w-5" />,
    '/careers': <UserGroupIcon className="h-5 w-5" />,
    '/contact': <PhoneIcon className="h-5 w-5" />,
  };

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsSearchExpanded(false);
    setSearchQuery('');
  }, [pathname]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsSearchExpanded(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Swipe gesture to close menu
  const handleSwipe = (gesture: any) => {
    if (gesture.direction === 'right' && isOpen) {
      setIsOpen(false);
      triggerFeedback('light');
    }
  };

  const swipeProps = useSwipeGesture(handleSwipe, {
    threshold: 100,
    direction: 'horizontal',
    preventScroll: true,
  });

  // Touch hover for menu items
  const menuItemHover = useTouchHover({
    touchDelay: 50,
    hoverTimeout: 150,
  });

  // Check if route is active
  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  // Toggle menu
  const toggleMenu = () => {
    setIsOpen(!isOpen);
    triggerFeedback('medium');
  };

  // Toggle search
  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 200);
    }
    triggerFeedback('light');
  };

  // Handle drag
  const handleDrag = (event: any, info: PanInfo) => {
    if (info.offset.x > 0) {
      setDragOffset(Math.min(info.offset.x, 300));
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    if (info.offset.x > 150 || info.velocity.x > 500) {
      setIsOpen(false);
    }
    setDragOffset(0);
  };

  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const menuVariants = {
    hidden: { 
      x: '-100%',
      transition: {
        duration: config.duration,
        ease: config.easing,
      }
    },
    visible: { 
      x: 0,
      transition: {
        duration: config.duration,
        ease: config.easing,
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: shouldAnimate ? i * config.stagger : 0,
        duration: config.duration,
        ease: config.easing,
      },
    }),
  };

  const searchVariants = {
    collapsed: { width: 44, opacity: 0.7 },
    expanded: { width: '100%', opacity: 1 },
  };

  return (
    <>
      {/* Menu Toggle Button */}
      <motion.button
        onClick={toggleMenu}
        className={cn(
          'relative z-50 p-3 rounded-xl text-neutral-700 hover:text-primary-600',
          'hover:bg-primary-50 active:bg-primary-100 transition-all duration-200',
          'min-h-[48px] min-w-[48px] flex items-center justify-center',
          'touch-manipulation select-none',
          isOpen && 'text-white hover:text-white hover:bg-white/10',
          className
        )}
        whileTap={{ scale: 0.95 }}
        aria-label="Toggle navigation menu"
        aria-expanded={isOpen}
      >
        <motion.div
          animate={isOpen ? 'open' : 'closed'}
          className="relative"
        >
          <motion.div
            variants={{
              closed: { rotate: 0, opacity: 1 },
              open: { rotate: 180, opacity: 0 },
            }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <Bars3Icon className="h-6 w-6" />
          </motion.div>
          
          <motion.div
            variants={{
              closed: { rotate: -180, opacity: 0 },
              open: { rotate: 0, opacity: 1 },
            }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center"
          >
            <XMarkIcon className="h-6 w-6" />
          </motion.div>
        </motion.div>
      </motion.button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: config.duration }}
              onClick={() => setIsOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              ref={menuRef}
              className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 overflow-hidden"
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              drag={enableGestures ? 'x' : false}
              dragConstraints={{ left: -300, right: 0 }}
              dragElastic={0.2}
              onDrag={handleDrag}
              onDragEnd={handleDragEnd}
              style={{
                x: dragOffset,
              }}
              {...(enableGestures ? swipeProps : {})}
            >
              {/* Header */}
              <div className="p-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">{siteName}</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Search Bar */}
                {enableSearch && (
                  <motion.div
                    className="relative"
                    variants={searchVariants}
                    animate={isSearchExpanded ? 'expanded' : 'collapsed'}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                  >
                    <div className="flex items-center">
                      <motion.button
                        onClick={toggleSearch}
                        className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors"
                        whileTap={{ scale: 0.95 }}
                      >
                        <MagnifyingGlassIcon className="h-5 w-5" />
                      </motion.button>
                      
                      <AnimatePresence>
                        {isSearchExpanded && (
                          <motion.input
                            ref={searchInputRef}
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="flex-1 ml-2 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/30"
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Navigation Items */}
              <nav className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-2">
                  {navigation.map((item, index) => {
                    const Icon = item.icon || defaultIcons[item.href as keyof typeof defaultIcons];
                    const active = isActive(item.href);
                    
                    return (
                      <motion.div
                        key={item.href}
                        custom={index}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            'flex items-center space-x-3 p-4 rounded-xl transition-all duration-200',
                            'min-h-[56px] touch-manipulation select-none group relative overflow-hidden',
                            active
                              ? 'bg-primary-50 text-primary-700 border border-primary-200'
                              : 'text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100'
                          )}
                          {...menuItemHover.touchProps}
                          {...menuItemHover.mouseProps}
                        >
                          {/* Background animation */}
                          <motion.div
                            className="absolute inset-0 bg-primary-50"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ 
                              opacity: menuItemHover.isHovered && !active ? 1 : 0,
                              scale: menuItemHover.isHovered && !active ? 1 : 0.8
                            }}
                            transition={{ duration: 0.2 }}
                          />

                          {/* Icon */}
                          <div className={cn(
                            'flex-shrink-0 relative z-10',
                            active ? 'text-primary-600' : 'text-neutral-500 group-hover:text-primary-600'
                          )}>
                            {Icon}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0 relative z-10">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className={cn(
                                  'font-medium',
                                  active ? 'text-primary-700' : 'text-neutral-900'
                                )}>
                                  {item.label}
                                </div>
                                {item.description && (
                                  <div className="text-sm text-neutral-500 mt-1">
                                    {item.description}
                                  </div>
                                )}
                              </div>
                              
                              {item.badge && (
                                <span className="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-700 rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Arrow */}
                          <ChevronRightIcon className={cn(
                            'h-4 w-4 flex-shrink-0 relative z-10 transition-transform duration-200',
                            active ? 'text-primary-600' : 'text-neutral-400',
                            menuItemHover.isHovered && 'translate-x-1'
                          )} />

                          {/* Active indicator */}
                          {active && (
                            <motion.div
                              className="absolute left-0 top-1/2 w-1 h-8 bg-primary-600 rounded-r-full"
                              layoutId="mobileActiveIndicator"
                              initial={{ y: '-50%' }}
                              animate={{ y: '-50%' }}
                              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-neutral-200 bg-neutral-50">
                <div className="text-xs text-neutral-500 text-center">
                  Swipe right to close
                </div>
              </div>

              {/* Drag indicator */}
              {enableGestures && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-neutral-300 rounded-l-full opacity-50" />
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default MobileNavigation;