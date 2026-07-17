import { HTMLAttributes } from 'react';

export function Section({ children, className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <section className={`py-8 sm:py-12 ${className}`} {...props}>
      {children}
    </section>
  );
}
