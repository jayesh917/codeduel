import { InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  hasSuccess?: boolean;
  isSearch?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', hasError, hasSuccess, isSearch, disabled, ...props }, ref) => {
    let borderClass = 'border-border focus:border-primary focus:ring-1 focus:ring-primary';
    if (hasError) borderClass = 'border-danger focus:border-danger focus:ring-1 focus:ring-danger';
    if (hasSuccess) borderClass = 'border-success focus:border-success focus:ring-1 focus:ring-success';
    
    return (
      <div className="relative w-full">
        {isSearch && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-secondary" />
          </div>
        )}
        <input
          ref={ref}
          disabled={disabled}
          className={`w-full bg-surface text-white rounded-xl px-4 py-2.5 text-sm h-[48px] border placeholder-secondary outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isSearch ? 'pl-10' : ''} ${borderClass} ${className}`}
          {...props}
        />
      </div>
    );
  }
);
Input.displayName = 'Input';
