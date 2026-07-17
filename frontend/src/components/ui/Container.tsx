import { HTMLAttributes } from 'react';

export function Container({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 ${className}`} {...props}>
      {children}
    </div>
  );
}
