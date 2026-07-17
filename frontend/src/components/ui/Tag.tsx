import { HTMLAttributes, forwardRef } from 'react';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  onRemove?: () => void;
}

export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ className = '', children, onRemove, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-surface text-secondary border border-border ${className}`}
        {...props}
      >
        {children}
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="ml-1.5 inline-flex items-center justify-center w-3.5 h-3.5 rounded-full text-secondary hover:bg-surface-hover hover:text-white focus:outline-none transition-colors"
          >
            &times;
          </button>
        )}
      </span>
    );
  }
);
Tag.displayName = 'Tag';
