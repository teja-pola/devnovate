
import React, { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export const FadeIn = ({
  children,
  className,
  direction = 'up',
  duration = 'normal',
  delay = 0,
  threshold = 0.2,
  once = true,
}: FadeInProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const entryRef = useRef<boolean>(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!entryRef.current || !once) {
              entryRef.current = true;
              if (ref.current) {
                ref.current.style.opacity = '1';
                ref.current.style.transform = 'translate3d(0, 0, 0)';
              }
            }
          } else if (!once) {
            entryRef.current = false;
            if (ref.current) {
              ref.current.style.opacity = '0';
              switch (direction) {
                case 'up':
                  ref.current.style.transform = 'translate3d(0, 20px, 0)';
                  break;
                case 'down':
                  ref.current.style.transform = 'translate3d(0, -20px, 0)';
                  break;
                case 'left':
                  ref.current.style.transform = 'translate3d(20px, 0, 0)';
                  break;
                case 'right':
                  ref.current.style.transform = 'translate3d(-20px, 0, 0)';
                  break;
                case 'none':
                  ref.current.style.transform = 'translate3d(0, 0, 0)';
                  break;
              }
            }
          }
        });
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [direction, once, threshold]);

  const getInitialTransform = () => {
    switch (direction) {
      case 'up':
        return 'translate3d(0, 20px, 0)';
      case 'down':
        return 'translate3d(0, -20px, 0)';
      case 'left':
        return 'translate3d(20px, 0, 0)';
      case 'right':
        return 'translate3d(-20px, 0, 0)';
      case 'none':
        return 'translate3d(0, 0, 0)';
      default:
        return 'translate3d(0, 20px, 0)';
    }
  };

  const getDuration = () => {
    switch (duration) {
      case 'fast':
        return '0.4s';
      case 'normal':
        return '0.7s';
      case 'slow':
        return '1s';
      default:
        return '0.7s';
    }
  };

  return (
    <div
      ref={ref}
      className={cn(className)}
      style={{
        opacity: 0,
        transform: getInitialTransform(),
        transition: `opacity ${getDuration()} cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${getDuration()} cubic-bezier(0.16, 1, 0.3, 1) ${delay}s`,
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
};
