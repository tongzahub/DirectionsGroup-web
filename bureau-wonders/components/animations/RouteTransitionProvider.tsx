'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSkeleton from './LoadingSkeleton';
import { useAdaptiveAnimation } from '@/hooks/useAnimations';
import { cn } from '@/lib/utils';

interface RouteTransitionContextType {
  isTransitioning: boolean;
  setIsTransitioning: (value: boolean) => void;
}

const RouteTransitionContext = createContext<RouteTransitionContextType>({
  isTransitioning: false,
  setIsTransitioning: () => {},
});

export const useRouteTransition = () => useContext(RouteTransitionContext);

interface RouteTransitionProviderProps {
  children: ReactNode;
  showLoadingScreen?: boolean;
  loadingVariant?: 'hero' | 'grid' | 'text';
  className?: string;
}

export default function RouteTransitionProvider({
  children,
  showLoadingScreen = true,
  loadingVariant = 'hero',
  className = ''
}: RouteTransitionProviderProps) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const adaptiveConfig = useAdaptiveAnimation('pageTransition');
  
  // Handle route changes
  useEffect(() => {
    const handleStart = () => {
      setIsTransitioning(true);
      if (showLoadingScreen) {
        setIsLoading(true);
      }
    };
    
    const handleComplete = () => {
      // Add a small delay to ensure smooth transition
      setTimeout(() => {
        setIsTransitioning(false);
        setIsLoading(false);
      }, adaptiveConfig.duration * 1000 || 300);
    };
    
    // Simulate route change detection
    handleStart();
    
    // Complete transition after a short delay
    const timer = setTimeout(handleComplete, 100);
    
    return () => clearTimeout(timer);
  }, [pathname, searchParams, showLoadingScreen, adaptiveConfig.duration]);
  
  const contextValue = {
    isTransitioning,
    setIsTransitioning,
  };
  
  return (
    <RouteTransitionContext.Provider value={contextValue}>
      <div className={cn('relative', className)}>
        <AnimatePresence mode="wait">
          {isLoading && showLoadingScreen && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-white flex items-center justify-center"
            >
              <div className="max-w-4xl mx-auto px-6">
                <LoadingSkeleton 
                  variant={loadingVariant} 
                  animate={!adaptiveConfig.disabled}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{
            duration: adaptiveConfig.duration || 0.3,
            ease: 'easeInOut'
          }}
          className={cn(
            'will-change-transform will-change-opacity',
            'motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:transform-none'
          )}
        >
          {children}
        </motion.div>
      </div>
    </RouteTransitionContext.Provider>
  );
}