import { TextareaHTMLAttributes, forwardRef } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  hasError?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', hasError, disabled, ...props }, ref) => {
    const borderClass = hasError ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500' : 'border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500';
    
    return (
      <textarea
        ref={ref}
        disabled={disabled}
        className={`w-full bg-slate-800 text-white rounded-md px-3 py-2 text-sm border placeholder-slate-400 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-h-[80px] ${borderClass} ${className}`}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';
