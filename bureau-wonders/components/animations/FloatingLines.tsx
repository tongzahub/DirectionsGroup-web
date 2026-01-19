'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface FloatingLinesProps {
  className?: string;
  lineCount?: number;
  colors?: string[];
  speed?: number;
}

export default function FloatingLines({ 
  className = '',
  lineCount = 8,
  colors = ['#D4AF37', '#B8860B', '#CD853F', '#DDA0DD'],
  speed = 1
}: FloatingLinesProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const lineVariants = {
    animate: (i: number) => ({
      x: ['-100vw', '100vw'],
      y: [
        Math.sin(i * 0.5) * 50,
        Math.sin(i * 0.5 + Math.PI) * 50,
        Math.sin(i * 0.5) * 50
      ],
      rotate: [0, 360],
      opacity: [0, 0.6, 0.8, 0.6, 0],
      transition: {
        duration: 15 / speed + Math.random() * 10,
        repeat: Infinity,
        ease: "linear",
        delay: i * 2,
      }
    })
  };

  const generatePath = (index: number, width: number = 1200) => {
    // Use deterministic values based on index to avoid hydration mismatch
    const amplitude = 100 + (index * 20) % 100;
    const frequency = 0.01 + (index * 0.003) % 0.02;
    const phase = (index * 0.5) % (Math.PI * 2);
    
    let path = `M -100 ${200 + index * 80}`;
    
    for (let x = -100; x <= width + 100; x += 10) {
      const y = 200 + index * 80 + Math.sin(x * frequency + phase) * amplitude;
      path += ` L ${x} ${y}`;
    }
    
    return path;
  };

  return (
    <div 
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      <svg 
        className="absolute inset-0 w-full h-full"
        style={{ filter: 'blur(1px)' }}
      >
        <defs>
          {/* Gradient definitions */}
          {colors.map((color, index) => (
            <linearGradient
              key={index}
              id={`lineGradient${index}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor={color} stopOpacity="0" />
              <stop offset="20%" stopColor={color} stopOpacity="0.4" />
              <stop offset="50%" stopColor={color} stopOpacity="0.8" />
              <stop offset="80%" stopColor={color} stopOpacity="0.4" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          ))}
          
          {/* Glow filter */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Animated Lines */}
        {[...Array(lineCount)].map((_, index) => {
          const pathData = generatePath(index, 1200);
          return (
            <motion.g key={index} variants={lineVariants} animate="animate" custom={index}>
              {/* Main line */}
              <motion.path
                d={pathData}
                fill="none"
                stroke={`url(#lineGradient${index % colors.length})`}
                strokeWidth="2"
                filter="url(#glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  delay: index * 0.2
                }}
              />
              
              {/* Secondary thinner line for depth */}
              <motion.path
                d={pathData}
                fill="none"
                stroke={colors[index % colors.length]}
                strokeWidth="1"
                opacity="0.3"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 3,
                  ease: "easeInOut",
                  delay: index * 0.2 + 0.5
                }}
              />
            </motion.g>
          );
        })}
      </svg>

      {/* Floating Particles along lines */}
      {[...Array(lineCount * 2)].map((_, index) => {
        const yBase = 200 + (index % lineCount) * 80;
        const yOffset = Math.sin(index * 0.5) * 50;
        
        return (
          <motion.div
            key={`particle-${index}`}
            className="absolute w-2 h-2 rounded-full"
            style={{
              background: `radial-gradient(circle, ${colors[index % colors.length]}80, transparent)`,
              boxShadow: `0 0 10px ${colors[index % colors.length]}40`,
            }}
            animate={{
              x: ['-10vw', '110vw'],
              y: [
                yBase + yOffset,
                yBase - yOffset,
                yBase + yOffset
              ],
              scale: [0, 1, 1, 0],
              opacity: [0, 0.8, 0.8, 0],
            }}
            transition={{
              duration: 12 / speed + (index % 4) * 2,
              repeat: Infinity,
              ease: "linear",
              delay: index * 1.5,
            }}
          />
        );
      })}

      {/* Ambient light effects */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, index) => {
          const size = 200 + index * 100;
          const leftPos = 20 + index * 30;
          const topPos = 20 + index * 20;
          
          return (
            <motion.div
              key={`ambient-${index}`}
              className="absolute rounded-full"
              style={{
                background: `radial-gradient(circle, ${colors[index % colors.length]}10, transparent)`,
                width: `${size}px`,
                height: `${size}px`,
                left: `${leftPos}%`,
                top: `${topPos}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20 + index * 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </div>
    </div>
  );
}