'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { NavigationItem } from '@/types';

interface GooeyNavigationProps {
  navigation: NavigationItem[];
  className?: string;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  initialActiveIndex?: number;
  animationTime?: number;
  timeVariance?: number;
  colors?: number[];
}

export default function GooeyNavigation({ 
  navigation, 
  className = '',
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  initialActiveIndex = 0,
  animationTime = 600,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4]
}: GooeyNavigationProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(initialActiveIndex);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  // Luxury color palette for different states
  const colorPalette = {
    1: { bg: 'linear-gradient(135deg, #D4AF37 0%, #FFD700 100%)', text: '#1A1A1A' }, // Gold
    2: { bg: 'linear-gradient(135deg, #B8860B 0%, #DAA520 100%)', text: '#FFFFFF' }, // Dark Gold
    3: { bg: 'linear-gradient(135deg, #CD853F 0%, #F4A460 100%)', text: '#1A1A1A' }, // Bronze
    4: { bg: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)', text: '#FFFFFF' }, // Saddle Brown
  };

  useEffect(() => {
    // Find active index based on current pathname
    const active = navigation.findIndex(item => {
      if (item.href === '/') {
        return pathname === '/';
      }
      return pathname.startsWith(item.href);
    });
    setActiveIndex(active >= 0 ? active : null);
  }, [pathname, navigation]);

  const gooeyVariants = {
    initial: { scale: 0, opacity: 0 },
    animate: { 
      scale: 1, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        duration: 0.6
      }
    },
    exit: { 
      scale: 0, 
      opacity: 0,
      transition: {
        duration: 0.3
      }
    }
  };

  const itemVariants = {
    initial: { y: 20, opacity: 0 },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      y: -2,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* SVG Filter for Gooey Effect */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="gooey-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <nav 
        ref={navRef}
        className="relative rounded-full px-3 py-3 shadow-2xl"
        style={{
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          filter: 'url(#gooey-effect)'
        }}
      >
        <div className="flex items-center space-x-1 relative">
          {/* Active/Hover Background Blob - Dynamic Width */}
          <AnimatePresence>
            {(hoveredIndex !== null || activeIndex !== null) && (
              <motion.div
                className="absolute rounded-full shadow-lg"
                variants={gooeyVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{
                  background: colorPalette[colors[(hoveredIndex ?? activeIndex ?? 0) % colors.length] as keyof typeof colorPalette]?.bg || colorPalette[1].bg,
                  zIndex: 0
                }}
                layout
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 30,
                  duration: animationTime / 1000
                }}
              />
            )}
          </AnimatePresence>

          {/* Navigation Items with Dynamic Background */}
          {navigation.map((item, index) => {
            const isActive = activeIndex === index;
            const isHovered = hoveredIndex === index;
            const colorIndex = colors[index % colors.length] as keyof typeof colorPalette;
            const currentColor = colorPalette[colorIndex] || colorPalette[1];
            
            return (
              <motion.div
                key={item.href}
                className="relative z-10"
                variants={itemVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                custom={index}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
                onClick={() => setActiveIndex(index)}
              >
                {/* Individual Background for Each Item */}
                <AnimatePresence>
                  {(isActive || isHovered) && (
                    <motion.div
                      className="absolute inset-0 rounded-full shadow-lg"
                      style={{
                        background: currentColor.bg,
                        zIndex: -1
                      }}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 25,
                        duration: animationTime / 1000
                      }}
                      layoutId={`background-${index}`}
                    />
                  )}
                </AnimatePresence>

                <Link
                  href={item.href}
                  className="relative block px-8 py-3 rounded-full text-sm font-bold transition-all min-h-[44px] flex items-center justify-center whitespace-nowrap"
                  style={{
                    color: isActive || isHovered ? currentColor.text : '#FFFFFF',
                    textShadow: isActive || isHovered ? 'none' : '0 1px 2px rgba(0,0,0,0.5)',
                    transition: `all ${animationTime}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                  }}
                >
                  <span className="relative z-10 font-semibold tracking-wide">
                    {item.label}
                  </span>
                  
                  {/* Ripple Effect on Click */}
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'rgba(255, 255, 255, 0.2)' }}
                    initial={{ scale: 0, opacity: 0 }}
                    whileTap={{ scale: 1.2, opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Enhanced Floating Particles - Deterministic */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(particleCount)].map((_, i) => {
            // Completely deterministic calculations to avoid hydration mismatch
            const positions = [
              { x: 20, y: 30 }, { x: 80, y: 70 }, { x: 60, y: 20 }, { x: 40, y: 80 }, { x: 90, y: 40 },
              { x: 10, y: 60 }, { x: 70, y: 90 }, { x: 30, y: 10 }, { x: 85, y: 25 }, { x: 15, y: 75 },
              { x: 65, y: 55 }, { x: 35, y: 45 }, { x: 95, y: 15 }, { x: 25, y: 85 }, { x: 75, y: 35 }
            ];
            const pos = positions[i % positions.length];
            const animationDurations = [2.5, 3.0, 2.8, 3.2, 2.7, 3.1, 2.9, 3.3, 2.6, 3.4, 2.4, 3.5, 2.3, 3.6, 2.2];
            const delays = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4, 1.6, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8];
            
            return (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  width: '3px',
                  height: '3px',
                  background: 'radial-gradient(circle, #D4AF37, transparent)',
                  boxShadow: '0 0 6px #D4AF37',
                }}
                animate={{
                  y: [0, -10, 0],
                  x: [0, (i % 3 - 1) * 3, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.8, 1.2, 0.8],
                }}
                transition={{
                  duration: animationDurations[i % animationDurations.length],
                  repeat: Infinity,
                  delay: delays[i % delays.length],
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>
      </nav>
    </div>
  );
}