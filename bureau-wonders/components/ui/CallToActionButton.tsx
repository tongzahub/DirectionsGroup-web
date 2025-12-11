'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Button, { ButtonProps } from './Button';
import { cn } from '@/lib/utils';

interface CallToActionButtonProps extends ButtonProps {
  pulse?: boolean;
  glow?: boolean;
  magneticEffect?: boolean;
}

const CallToActionButton = React.forwardRef<HTMLButtonElement, CallToActionButtonProps>(
  ({ 
    pulse = true, 
    glow = true, 
    magneticEffect = true, 
    className = '', 
    children,
    ...props 
  }, ref) => {
    const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = React.useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!magneticEffect) return;
      
      const rect = e.currentTarget.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * 0.15;
      const deltaY = (e.clientY - centerY) * 0.15;
      
      setMousePosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      setMousePosition({ x: 0, y: 0 });
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    return (
      <motion.div
        className="relative inline-block"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
        }}
      >
        {/* Glow effect background */}
        {glow && (
          <motion.div
            className="absolute inset-0 rounded-inherit bg-gradient-to-r from-primary-400 to-primary-600 opacity-0 blur-lg"
            animate={{
              opacity: isHovered ? 0.6 : 0,
              scale: isHovered ? 1.1 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Pulse rings */}
        {pulse && (
          <>
            <motion.div
              className="absolute inset-0 rounded-inherit border-2 border-primary-400/30"
              animate={{
                scale: [1, 1.2, 1.4],
                opacity: [0.8, 0.4, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
            <motion.div
              className="absolute inset-0 rounded-inherit border-2 border-primary-500/40"
              animate={{
                scale: [1, 1.15, 1.3],
                opacity: [0.6, 0.3, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 1,
                delay: 0.5,
              }}
            />
          </>
        )}

        <Button
          ref={ref}
          className={cn(
            'relative z-10 shadow-lg hover:shadow-xl transition-shadow duration-300',
            className
          )}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          luxury={true}
          {...props}
        >
          {children}
        </Button>
      </motion.div>
    );
  }
);

CallToActionButton.displayName = 'CallToActionButton';

export default CallToActionButton;