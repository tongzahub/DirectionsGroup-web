/**
 * Touch Interaction Hooks
 * Optimized touch interactions for mobile devices
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDeviceType } from '@/lib/responsive';

// Touch event types
export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeGesture {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

export interface TouchFeedbackConfig {
  haptic?: boolean;
  visual?: boolean;
  audio?: boolean;
  duration?: number;
}

// Hook for touch-optimized hover states
export const useTouchHover = (
  config: {
    touchDelay?: number;
    hoverTimeout?: number;
    preventScroll?: boolean;
  } = {}
) => {
  const {
    touchDelay = 150,
    hoverTimeout = 300,
    preventScroll = false,
  } = config;

  const [isHovered, setIsHovered] = useState(false);
  const [isTouched, setIsTouched] = useState(false);
  const deviceType = useDeviceType();
  const touchTimer = useRef<NodeJS.Timeout | null>(null);
  const hoverTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStart = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    setIsTouched(true);

    // Prevent scroll if configured
    if (preventScroll) {
      e.preventDefault();
    }

    // Delayed hover state for touch devices
    touchTimer.current = setTimeout(() => {
      setIsHovered(true);
    }, touchDelay);
  }, [touchDelay, preventScroll]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.current.x);
    const deltaY = Math.abs(touch.clientY - touchStart.current.y);

    // If user moves finger significantly, cancel hover
    if (deltaX > 10 || deltaY > 10) {
      if (touchTimer.current) {
        clearTimeout(touchTimer.current);
      }
      setIsHovered(false);
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsTouched(false);
    
    if (touchTimer.current) {
      clearTimeout(touchTimer.current);
    }

    // Keep hover state briefly for visual feedback
    hoverTimer.current = setTimeout(() => {
      setIsHovered(false);
    }, hoverTimeout);
  }, [hoverTimeout]);

  const handleMouseEnter = useCallback(() => {
    if (deviceType !== 'mobile') {
      setIsHovered(true);
    }
  }, [deviceType]);

  const handleMouseLeave = useCallback(() => {
    if (deviceType !== 'mobile') {
      setIsHovered(false);
    }
  }, [deviceType]);

  useEffect(() => {
    return () => {
      if (touchTimer.current) clearTimeout(touchTimer.current);
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

  return {
    isHovered,
    isTouched,
    touchProps: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    mouseProps: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
};

// Hook for swipe gestures
export const useSwipeGesture = (
  onSwipe: (gesture: SwipeGesture) => void,
  config: {
    threshold?: number;
    velocityThreshold?: number;
    preventScroll?: boolean;
    direction?: 'horizontal' | 'vertical' | 'both';
  } = {}
) => {
  const {
    threshold = 50,
    velocityThreshold = 0.3,
    preventScroll = true,
    direction = 'both',
  } = config;

  const touchStart = useRef<TouchPoint | null>(null);
  const touchEnd = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
    touchEnd.current = null;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.touches[0];
    touchEnd.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    // Prevent scroll during swipe if configured
    if (preventScroll) {
      const deltaX = Math.abs(touch.clientX - touchStart.current.x);
      const deltaY = Math.abs(touch.clientY - touchStart.current.y);
      
      if (
        (direction === 'horizontal' && deltaX > deltaY) ||
        (direction === 'vertical' && deltaY > deltaX) ||
        direction === 'both'
      ) {
        e.preventDefault();
      }
    }
  }, [preventScroll, direction]);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;

    const deltaX = touchEnd.current.x - touchStart.current.x;
    const deltaY = touchEnd.current.y - touchStart.current.y;
    const duration = touchEnd.current.timestamp - touchStart.current.timestamp;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const velocity = distance / duration;

    // Check if swipe meets threshold requirements
    if (distance < threshold || velocity < velocityThreshold) return;

    // Determine swipe direction
    let swipeDirection: SwipeGesture['direction'];
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      swipeDirection = deltaX > 0 ? 'right' : 'left';
    } else {
      swipeDirection = deltaY > 0 ? 'down' : 'up';
    }

    // Check if direction is allowed
    if (
      (direction === 'horizontal' && (swipeDirection === 'up' || swipeDirection === 'down')) ||
      (direction === 'vertical' && (swipeDirection === 'left' || swipeDirection === 'right'))
    ) {
      return;
    }

    const gesture: SwipeGesture = {
      direction: swipeDirection,
      distance,
      velocity,
      duration,
    };

    onSwipe(gesture);

    // Reset
    touchStart.current = null;
    touchEnd.current = null;
  }, [onSwipe, threshold, velocityThreshold, direction]);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};

// Hook for touch feedback
export const useTouchFeedback = (config: TouchFeedbackConfig = {}) => {
  const {
    haptic = true,
    visual = true,
    audio = false,
    duration = 200,
  } = config;

  const [feedbackActive, setFeedbackActive] = useState(false);
  const deviceType = useDeviceType();

  const triggerFeedback = useCallback((type: 'light' | 'medium' | 'heavy' = 'light') => {
    if (deviceType !== 'mobile') return;

    // Haptic feedback
    if (haptic && 'vibrate' in navigator) {
      const patterns = {
        light: [10],
        medium: [20],
        heavy: [30],
      };
      navigator.vibrate(patterns[type]);
    }

    // Visual feedback
    if (visual) {
      setFeedbackActive(true);
      setTimeout(() => setFeedbackActive(false), duration);
    }

    // Audio feedback (if supported and enabled)
    if (audio && 'AudioContext' in window) {
      try {
        const audioContext = new AudioContext();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (error) {
        // Audio feedback not available
      }
    }
  }, [haptic, visual, audio, duration, deviceType]);

  return {
    feedbackActive,
    triggerFeedback,
  };
};

// Hook for long press detection
export const useLongPress = (
  onLongPress: () => void,
  config: {
    threshold?: number;
    preventDefault?: boolean;
  } = {}
) => {
  const { threshold = 500, preventDefault = true } = config;
  
  const longPressTimer = useRef<NodeJS.Timeout>();
  const touchStart = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStart.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    longPressTimer.current = setTimeout(() => {
      onLongPress();
    }, threshold);

    if (preventDefault) {
      e.preventDefault();
    }
  }, [onLongPress, threshold, preventDefault]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.current.x);
    const deltaY = Math.abs(touch.clientY - touchStart.current.y);

    // Cancel long press if finger moves too much
    if (deltaX > 10 || deltaY > 10) {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
    }
    touchStart.current = null;
  }, []);

  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
};