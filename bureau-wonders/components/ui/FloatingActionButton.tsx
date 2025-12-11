'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingActionButtonProps {
  icon: React.ReactNode;
  label?: string;
  onClick?: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'luxury';
  showLabel?: boolean;
  className?: string;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  icon,
  label,
  onClick,
  position = 'bottom-right',
  size = 'md',
  variant = 'primary',
  showLabel = false,
  className = '',
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(true);

  // Position classes
  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  // Size classes
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  };

  // Variant classes
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white hover:bg-neutral-50 text-primary-600 shadow-lg hover:shadow-xl border border-neutral-200',
    luxury: 'bg-gradient-to-r from-accent-gold to-accent-copper text-white shadow-luxury-md hover:shadow-luxury-lg',
  };

  const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-7 h-7',
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            'fixed z-50',
            positionClasses[position],
            className
          )}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 25,
          }}
        >
          <motion.button
            className={cn(
              'relative rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-200 group',
              sizeClasses[size],
              variantClasses[variant]
            )}
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ 
              scale: 1.1,
              rotate: 5,
            }}
            whileTap={{ 
              scale: 0.95,
              rotate: -5,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
          >
            {/* Background glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400/20 to-primary-600/20 blur-lg"
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1.2 : 1,
              }}
              transition={{ duration: 0.3 }}
            />

            {/* Icon */}
            <motion.div
              className={cn('relative z-10', iconSizeClasses[size])}
              animate={{
                rotate: isHovered ? 180 : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              {icon}
            </motion.div>

            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-current opacity-20"
              animate={{
                scale: [1, 1.5, 2],
                opacity: [0.2, 0.1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          </motion.button>

          {/* Label tooltip */}
          <AnimatePresence>
            {label && (showLabel || isHovered) && (
              <motion.div
                className={cn(
                  'absolute whitespace-nowrap bg-neutral-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none',
                  position.includes('right') ? 'right-full mr-3' : 'left-full ml-3',
                  'top-1/2 -translate-y-1/2'
                )}
                initial={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 10 : -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8, x: position.includes('right') ? 10 : -10 }}
                transition={{ duration: 0.2 }}
              >
                {label}
                
                {/* Arrow */}
                <div
                  className={cn(
                    'absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-neutral-900 rotate-45',
                    position.includes('right') ? '-right-1' : '-left-1'
                  )}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingActionButton;