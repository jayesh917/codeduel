import { HTMLAttributes } from 'react';

export function PageWrapper({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-col min-h-[calc(100vh-theme(spacing.20)-theme(spacing.16))] py-8 ${className}`} {...props}>
      {children}
    </div>
  );
}
