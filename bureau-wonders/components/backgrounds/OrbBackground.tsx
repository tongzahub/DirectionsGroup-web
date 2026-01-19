'use client';

import { motion, Variants } from 'framer-motion';

interface OrbBackgroundProps {
  className?: string;
  orbCount?: number;
  colors?: string[];
  intensity?: number;
  speed?: number;
  enableInteraction?: boolean;
}

export default function OrbBackground({
  className = '',
  orbCount = 6,
  colors = [
    'rgba(212, 175, 55, 0.15)',   // Gold
    'rgba(184, 134, 11, 0.12)',  // Dark Gold
    'rgba(205, 133, 63, 0.10)',  // Bronze
    'rgba(139, 69, 19, 0.08)',   // Saddle Brown
    'rgba(221, 160, 221, 0.10)', // Plum
    'rgba(32, 178, 170, 0.08)',  // Light Sea Green
  ],
  intensity = 0.8,
  speed = 1,
  enableInteraction = true
}: OrbBackgroundProps) {
  // Generate deterministic orb configurations to avoid hydration mismatches
  const orbs = Array.from({ length: orbCount }, (_, i) => {
    // Use deterministic values based on index instead of Math.random()
    const seedX = (i * 37 + 23) % 100; // Deterministic X position
    const seedY = (i * 47 + 17) % 100; // Deterministic Y position
    
    return {
      id: i,
      size: 200 + Math.sin(i * 0.5) * 150,
      initialX: seedX,
      initialY: seedY,
      color: colors[i % colors.length],
      duration: 20 + Math.sin(i) * 10,
      delay: i * 2,
    };
  });

  const orbVariants: Variants = {
    animate: (custom: any) => ({
      x: [
        `${custom.initialX}%`,
        `${(custom.initialX + 30) % 100}%`,
        `${(custom.initialX + 60) % 100}%`,
        `${custom.initialX}%`
      ],
      y: [
        `${custom.initialY}%`,
        `${(custom.initialY + 20) % 100}%`,
        `${(custom.initialY + 40) % 100}%`,
        `${custom.initialY}%`
      ],
      scale: [1, 1.2, 0.8, 1],
      rotate: [0, 180, 360],
      transition: {
        duration: custom.duration / speed,
        repeat: Infinity,
        ease: "easeInOut" as const,
        delay: custom.delay,
      }
    })
  };

  return (
    <div 
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      style={{ opacity: intensity }}
    >
      {/* SVG Filters for Blur Effects */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="orb-blur" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="40" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0"
            />
          </filter>
          
          <filter id="orb-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Animated Orbs */}
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            width: `${orb.size}px`,
            height: `${orb.size}px`,
            background: `radial-gradient(circle, ${orb.color} 0%, ${orb.color.replace(/[\d.]+\)/, '0.15)')} 40%, ${orb.color.replace(/[\d.]+\)/, '0.05)')} 70%, transparent 100%)`,
            filter: 'blur(25px)',
          }}
          variants={orbVariants}
          animate="animate"
          custom={orb}
        />
      ))}

      {/* Secondary Layer - Smaller Orbs */}
      {orbs.slice(0, 3).map((orb) => (
        <motion.div
          key={`secondary-${orb.id}`}
          className="absolute rounded-full"
          style={{
            width: `${orb.size * 0.6}px`,
            height: `${orb.size * 0.6}px`,
            background: `radial-gradient(circle, ${orb.color.replace(/[\d.]+\)/, '0.2)')}, ${orb.color.replace(/[\d.]+\)/, '0.08)')} 40%, transparent 70%)`,
            filter: 'blur(15px)',
          }}
          animate={{
            x: [
              `${(orb.initialX + 50) % 100}%`,
              `${(orb.initialX + 20) % 100}%`,
              `${(orb.initialX + 80) % 100}%`,
              `${(orb.initialX + 50) % 100}%`
            ],
            y: [
              `${(orb.initialY + 30) % 100}%`,
              `${(orb.initialY + 60) % 100}%`,
              `${(orb.initialY + 10) % 100}%`,
              `${(orb.initialY + 30) % 100}%`
            ],
            scale: [0.8, 1.1, 0.9, 0.8],
            opacity: [0.6, 0.9, 0.7, 0.6],
          }}
          transition={{
            duration: (orb.duration + 5) / speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay + 1,
          }}
        />
      ))}

      {/* Ambient Light Effects */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={`ambient-${i}`}
            className="absolute rounded-full"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              background: `radial-gradient(circle, ${colors[i % colors.length].replace(/0\.\d+/, '0.03')}, transparent)`,
              left: `${20 + i * 30}%`,
              top: `${15 + i * 25}%`,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
              rotate: [0, 120, 240, 360],
            }}
            transition={{
              duration: 30 + i * 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 5,
            }}
          />
        ))}
      </div>

      {/* Interactive Particles */}
      {enableInteraction && (
        <div className="absolute inset-0">
          {[...Array(8)].map((_, i) => {
            // Use deterministic positions based on index to avoid hydration mismatch
            const positions = [
              { left: 15, top: 25 }, { left: 85, top: 75 }, { left: 45, top: 15 }, { left: 75, top: 85 },
              { left: 25, top: 65 }, { left: 65, top: 35 }, { left: 35, top: 55 }, { left: 55, top: 45 }
            ];
            const pos = positions[i % positions.length];
            const durations = [8, 9, 10, 11, 8.5, 9.5, 10.5, 11.5];
            
            return (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 rounded-full"
                style={{
                  background: colors[i % colors.length].replace(/0\.\d+/, '0.4'),
                  left: `${pos.left}%`,
                  top: `${pos.top}%`,
                }}
                animate={{
                  x: [0, (i % 3 - 1) * 50, 0],
                  y: [0, (i % 2 === 0 ? 1 : -1) * 30, 0],
                  scale: [1, 1.5, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: durations[i % durations.length],
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}