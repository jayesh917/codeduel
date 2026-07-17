import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'motion/react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const variants = {
  primary: 'bg-primary hover:bg-primary-hover text-white border-transparent shadow-sm hover:shadow-md hover:-translate-y-[1px]',
  secondary: 'bg-surface hover:bg-surface-hover text-white border-border border hover:shadow-sm hover:-translate-y-[1px]',
  outline: 'bg-transparent hover:bg-surface text-white border-border border hover:-translate-y-[1px]',
  danger: 'bg-danger hover:bg-danger/90 text-white border-transparent shadow-sm hover:-translate-y-[1px]',
  ghost: 'bg-transparent hover:bg-surface text-secondary hover:text-white',
};

const sizes = {
  sm: 'px-4 h-[38px] text-xs rounded-lg gap-1.5',
  md: 'px-5 h-[46px] text-sm rounded-xl gap-2',
  lg: 'px-6 h-[52px] text-sm font-medium rounded-xl gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none';
    
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : null}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
