import { useEffect, useRef, useState, useCallback } from 'react';

// ============= OPTIMIZED ANIMATION HOOK =============

interface AnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  staggerDelay?: number;
  reduceMotion?: boolean;
}

export const useOptimizedAnimations = (
  options: AnimationOptions = {}
) => {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const elementRef = useRef<HTMLElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    threshold = 0.1,
    rootMargin = '0px 0px -10% 0px',
    triggerOnce = true,
    staggerDelay = 100,
    reduceMotion = false
  } = options;

  // Check user's motion preferences
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Intersection Observer for scroll-triggered animations
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observerRef.current?.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current && element) {
        observerRef.current.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  // Staggered animation helper
  const getStaggeredDelay = useCallback((index: number) => {
    return prefersReducedMotion || reduceMotion ? 0 : index * staggerDelay;
  }, [staggerDelay, prefersReducedMotion, reduceMotion]);

  // Animation styles generator
  const getAnimationStyles = useCallback((
    animationType: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'none' = 'fadeIn',
    delay: number = 0,
    duration: number = 0.6
  ) => {
    if (prefersReducedMotion || reduceMotion) {
      return {
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.2s ease'
      };
    }

    const baseStyles = {
      transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      transitionDelay: `${delay}ms`,
    };

    switch (animationType) {
      case 'fadeIn':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
        };
      case 'slideUp':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
        };
      case 'slideLeft':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
        };
      case 'slideRight':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
        };
      case 'scale':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        };
      default:
        return baseStyles;
    }
  }, [isVisible, prefersReducedMotion, reduceMotion]);

  return {
    elementRef,
    isVisible,
    prefersReducedMotion,
    getStaggeredDelay,
    getAnimationStyles
  };
};

// Performance monitoring for animations
export const useAnimationPerformance = () => {
  const frameCount = useRef(0);
  const lastTime = useRef(0);
  const [fps, setFps] = useState(60);

  useEffect(() => {
    let animationId: number;

    const measureFPS = (currentTime: number) => {
      frameCount.current++;
      
      if (currentTime - lastTime.current >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastTime.current = currentTime;
      }
      
      animationId = requestAnimationFrame(measureFPS);
    };

    animationId = requestAnimationFrame(measureFPS);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const shouldReduceAnimations = fps < 55; // Reduce complexity if FPS drops

  return { fps, shouldReduceAnimations };
};

export default useOptimizedAnimations;
