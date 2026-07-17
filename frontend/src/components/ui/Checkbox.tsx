import { InputHTMLAttributes, forwardRef } from 'react';

export const Checkbox = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        type="checkbox"
        ref={ref}
        className={`w-4 h-4 text-blue-600 bg-slate-800 border-slate-600 rounded focus:ring-blue-500 focus:ring-offset-slate-900 cursor-pointer ${className}`}
        {...props}
      />
    );
  }
);
Checkbox.displayName = 'Checkbox';
