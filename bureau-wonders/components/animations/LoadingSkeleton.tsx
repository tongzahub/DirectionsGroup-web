'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'hero' | 'grid';
  lines?: number;
  className?: string;
  animate?: boolean;
}

export default function LoadingSkeleton({ 
  variant = 'text',
  lines = 3,
  className = '',
  animate = true
}: LoadingSkeletonProps) {
  const pulseAnimation = animate ? {
    animate: {
      opacity: [0.5, 1, 0.5],
    },
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut" as any
    }
  } : {};
  
  const baseClasses = "bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded";
  
  if (variant === 'hero') {
    return (
      <div className={cn("space-y-6", className)}>
        <motion.div 
          className={cn(baseClasses, "h-12 w-3/4")}
          {...pulseAnimation}
        />
        <motion.div 
          className={cn(baseClasses, "h-6 w-1/2")}
          {...pulseAnimation}
        />
        <motion.div 
          className={cn(baseClasses, "h-10 w-32")}
          {...pulseAnimation}
        />
      </div>
    );
  }
  
  if (variant === 'card') {
    return (
      <div className={cn("space-y-4", className)}>
        <motion.div 
          className={cn(baseClasses, "h-48 w-full")}
          {...pulseAnimation}
        />
        <motion.div 
          className={cn(baseClasses, "h-6 w-3/4")}
          {...pulseAnimation}
        />
        <motion.div 
          className={cn(baseClasses, "h-4 w-1/2")}
          {...pulseAnimation}
        />
      </div>
    );
  }
  
  if (variant === 'grid') {
    return (
      <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
        {Array.from({ length: 6 }).map((_, index) => (
          <LoadingSkeleton key={index} variant="card" animate={animate} />
        ))}
      </div>
    );
  }
  
  // Default text variant
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className={cn(
            baseClasses,
            "h-4",
            index === lines - 1 ? "w-2/3" : "w-full"
          )}
          {...pulseAnimation}
        />
      ))}
    </div>
  );
}