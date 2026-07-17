import { HTMLAttributes } from 'react';

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  progress: number;
}

export function ProgressBar({ progress, className = '', ...props }: ProgressBarProps) {
  const safeProgress = Math.min(100, Math.max(0, progress));
  return (
    <div className={`w-full bg-background rounded-full h-2 border border-border overflow-hidden ${className}`} {...props}>
      <div
        className="bg-primary h-full transition-all duration-300 ease-out"
        style={{ width: `${safeProgress}%` }}
      />
    </div>
  );
}
