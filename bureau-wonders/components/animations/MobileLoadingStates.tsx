'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useMobileAnimationConfig } from '@/lib/mobile-animation-config';
import { useDeviceType } from '@/lib/responsive';

// Mobile-optimized skeleton loader
export interface MobileSkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
  image?: boolean;
  width?: string | number;
  height?: string | number;
}

export const MobileSkeleton: React.FC<MobileSkeletonProps> = ({
  className = '',
  lines = 3,
  avatar = false,
  image = false,
  width = '100%',
  height = '1rem',
}) => {
  const { config, complexity } = useMobileAnimationConfig();
  const deviceType = useDeviceType();

  const skeletonVariants = {
    minimal: {
      animate: {
        opacity: [0.5, 0.8, 0.5],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear' as any,
        },
      },
    },
    reduced: {
      animate: {
        opacity: [0.4, 0.7, 0.4],
        transition: {
          duration: 1.2,
          repeat: Infinity,
          ease: 'ease-in-out' as any,
        },
      },
    },
    standard: {
      animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
        transition: {
          duration: 1.2,
          repeat: Infinity,
          ease: 'linear' as any,
        },
      },
    },
    enhanced: {
      animate: {
        backgroundPosition: ['200% 0', '-200% 0'],
        scale: [1, 1.01, 1],
        transition: {
          backgroundPosition: {
            duration: 1,
            repeat: Infinity,
            ease: 'linear' as any,
          },
          scale: {
            duration: 2,
            repeat: Infinity,
            ease: 'ease-in-out' as any,
          },
        },
      },
    },
  };

  const baseClasses = cn(
    'bg-neutral-200 rounded',
    complexity === 'standard' || complexity === 'enhanced'
      ? 'bg-gradient-to-r from-neutral-200 via-neutral-300 to-neutral-200 bg-[length:200%_100%]'
      : '',
    className
  );

  return (
    <div className="space-y-3">
      {/* Avatar */}
      {avatar && (
        <motion.div
          className={cn(
            'w-12 h-12 rounded-full',
            baseClasses
          )}
          variants={skeletonVariants[complexity]}
          animate="animate"
        />
      )}

      {/* Image */}
      {image && (
        <motion.div
          className={cn(
            'aspect-video rounded-lg',
            baseClasses
          )}
          variants={skeletonVariants[complexity]}
          animate="animate"
        />
      )}

      {/* Text lines */}
      {Array.from({ length: lines }).map((_, index) => (
        <motion.div
          key={index}
          className={baseClasses}
          style={{
            width: index === lines - 1 ? '75%' : width,
            height,
          }}
          variants={skeletonVariants[complexity]}
          animate="animate"
          transition={{
            delay: complexity === 'enhanced' ? index * 0.1 : 0,
          }}
        />
      ))}
    </div>
  );
};

// Mobile-optimized spinner
export interface MobileSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: string;
}

export const MobileSpinner: React.FC<MobileSpinnerProps> = ({
  size = 'md',
  className = '',
  color = 'currentColor',
}) => {
  const { config, complexity, shouldAnimate } = useMobileAnimationConfig();
  const deviceType = useDeviceType();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const strokeWidths = {
    sm: 2,
    md: 3,
    lg: 4,
  };

  if (!shouldAnimate) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <div className={cn('rounded-full border-2 border-neutral-300', sizeClasses[size])} />
      </div>
    );
  }

  const spinnerVariants = {
    minimal: {
      animate: {
        rotate: 360,
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: 'linear' as any,
        },
      },
    },
    reduced: {
      animate: {
        rotate: 360,
        transition: {
          duration: 0.8,
          repeat: Infinity,
          ease: 'linear' as any,
        },
      },
    },
    standard: {
      animate: {
        rotate: 360,
        transition: {
          duration: 0.6,
          repeat: Infinity,
          ease: 'linear' as any,
        },
      },
    },
    enhanced: {
      animate: {
        rotate: 360,
        scale: [1, 1.1, 1],
        transition: {
          rotate: {
            duration: 0.6,
            repeat: Infinity,
            ease: 'linear' as any,
          },
          scale: {
            duration: 1.2,
            repeat: Infinity,
            ease: 'ease-in-out' as any,
          },
        },
      },
    },
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <motion.svg
        className={sizeClasses[size]}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        variants={spinnerVariants[complexity]}
        animate="animate"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke={color}
          strokeWidth={strokeWidths[size]}
        />
        <path
          className="opacity-75"
          fill={color}
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
        
        {/* Enhanced glow effect */}
        {complexity === 'enhanced' && (
          <motion.circle
            cx="12"
            cy="12"
            r="10"
            stroke={color}
            strokeWidth="1"
            fill="none"
            className="opacity-30"
            animate={{
              r: [8, 12, 8],
              opacity: [0.3, 0.1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'ease-in-out' as any,
            }}
          />
        )}
      </motion.svg>
    </div>
  );
};

// Mobile-optimized progress bar
export interface MobileProgressProps {
  value: number;
  max?: number;
  className?: string;
  showLabel?: boolean;
  color?: string;
}

export const MobileProgress: React.FC<MobileProgressProps> = ({
  value,
  max = 100,
  className = '',
  showLabel = false,
  color = 'bg-primary-500',
}) => {
  const { complexity, shouldAnimate } = useMobileAnimationConfig();
  const percentage = Math.min((value / max) * 100, 100);

  const progressVariants = {
    minimal: {
      animate: {
        width: `${percentage}%`,
        transition: {
          duration: 0.2,
          ease: 'linear' as any,
        },
      },
    },
    reduced: {
      animate: {
        width: `${percentage}%`,
        transition: {
          duration: 0.3,
          ease: 'ease-out' as any,
        },
      },
    },
    standard: {
      animate: {
        width: `${percentage}%`,
        transition: {
          duration: 0.4,
          ease: 'ease-out' as any,
        },
      },
    },
    enhanced: {
      animate: {
        width: `${percentage}%`,
        transition: {
          duration: 0.5,
          ease: [0.25, 0.46, 0.45, 0.94] as any,
        },
      },
    },
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-neutral-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          variants={shouldAnimate ? progressVariants[complexity] : undefined}
          animate={shouldAnimate ? "animate" : undefined}
          initial={{ width: 0 }}
        >
          {/* Enhanced shimmer effect */}
          {complexity === 'enhanced' && shouldAnimate && (
            <motion.div
              className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Mobile-optimized pulse loader
export interface MobilePulseProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const MobilePulse: React.FC<MobilePulseProps> = ({
  className = '',
  size = 'md',
  color = 'bg-primary-500',
}) => {
  const { complexity, shouldAnimate } = useMobileAnimationConfig();

  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const pulseVariants = {
    minimal: {
      animate: {
        scale: [1, 1.2, 1],
        opacity: [0.7, 1, 0.7],
        transition: {
          duration: 1.5,
          repeat: Infinity,
          ease: 'ease-in-out' as any,
        },
      },
    },
    reduced: {
      animate: {
        scale: [1, 1.3, 1],
        opacity: [0.6, 1, 0.6],
        transition: {
          duration: 1.2,
          repeat: Infinity,
          ease: 'ease-in-out' as any,
        },
      },
    },
    standard: {
      animate: {
        scale: [1, 1.4, 1],
        opacity: [0.5, 1, 0.5],
        transition: {
          duration: 1,
          repeat: Infinity,
          ease: 'ease-in-out' as any,
        },
      },
    },
    enhanced: {
      animate: {
        scale: [1, 1.5, 1],
        opacity: [0.4, 1, 0.4],
        boxShadow: [
          '0 0 0 0 rgba(59, 130, 246, 0.4)',
          '0 0 0 10px rgba(59, 130, 246, 0)',
          '0 0 0 0 rgba(59, 130, 246, 0)',
        ],
        transition: {
          duration: 0.8,
          repeat: Infinity,
          ease: 'ease-in-out' as any,
        },
      },
    },
  };

  if (!shouldAnimate) {
    return (
      <div className={cn('flex space-x-2', className)}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className={cn('rounded-full', sizeClasses[size], color)} />
        ))}
      </div>
    );
  }

  return (
    <div className={cn('flex space-x-2', className)}>
      {Array.from({ length: 3 }).map((_, i) => (
        <motion.div
          key={i}
          className={cn('rounded-full', sizeClasses[size], color)}
          variants={pulseVariants[complexity]}
          animate="animate"
          transition={{
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Composite mobile loading component
export interface MobileLoadingProps {
  type?: 'skeleton' | 'spinner' | 'progress' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  message?: string;
}

export const MobileLoading: React.FC<MobileLoadingProps> = ({
  type = 'spinner',
  size = 'md',
  className = '',
  message,
}) => {
  const { complexity } = useMobileAnimationConfig();

  const renderLoader = () => {
    switch (type) {
      case 'skeleton':
        return <MobileSkeleton lines={3} />;
      case 'spinner':
        return <MobileSpinner size={size} />;
      case 'progress':
        return <MobileProgress value={50} showLabel />;
      case 'pulse':
        return <MobilePulse size={size} />;
      default:
        return <MobileSpinner size={size} />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4 p-8', className)}>
      {renderLoader()}
      
      {message && (
        <motion.p
          className="text-sm text-neutral-600 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );
};

export default MobileLoading;