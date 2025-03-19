
import React from 'react';
import { Button as ShadcnButton, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ButtonProps as ShadcnButtonProps } from '@/components/ui/button';
import { Slot } from '@radix-ui/react-slot';

interface ButtonProps extends Omit<ShadcnButtonProps, 'asChild'> {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost' | 'link' | 'primary' | 'secondary';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
  className?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'default', size = 'default', className, asChild = false, icon, iconPosition = 'left', loading, ...props }, ref) => {
    const variantClasses = {
      primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    };
    
    // When asChild is true, we need to use Slot and pass className directly
    if (asChild) {
      return (
        <Slot 
          ref={ref}
          className={cn(
            buttonVariants({ variant: ['primary', 'secondary'].includes(variant) ? 'default' : variant, size }),
            variant === 'primary' && variantClasses.primary,
            variant === 'secondary' && variantClasses.secondary,
            'relative overflow-hidden transition-all duration-300 ease-out active:scale-[0.98]',
            className
          )}
          {...props}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {icon && iconPosition === 'left' && !loading && (
              <span className="flex-shrink-0">{icon}</span>
            )}
            
            {loading ? (
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4"
                ></circle>
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            
            {children}
            
            {icon && iconPosition === 'right' && !loading && (
              <span className="flex-shrink-0">{icon}</span>
            )}
          </span>
        </Slot>
      );
    }
    
    // When not using asChild, use the ShadcnButton directly
    return (
      <ShadcnButton
        className={cn(
          variant === 'primary' && variantClasses.primary,
          variant === 'secondary' && variantClasses.secondary,
          'relative overflow-hidden transition-all duration-300 ease-out active:scale-[0.98]',
          className
        )}
        ref={ref}
        size={size}
        variant={['primary', 'secondary'].includes(variant) ? 'default' : variant}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {icon && iconPosition === 'left' && !loading && (
            <span className="flex-shrink-0">{icon}</span>
          )}
          
          {loading ? (
            <svg 
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              ></circle>
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : null}
          
          <span>{children}</span>
          
          {icon && iconPosition === 'right' && !loading && (
            <span className="flex-shrink-0">{icon}</span>
          )}
        </span>
      </ShadcnButton>
    );
  }
);

Button.displayName = 'Button';
