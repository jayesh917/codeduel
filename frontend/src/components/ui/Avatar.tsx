import { ImgHTMLAttributes } from 'react';
import { User } from 'lucide-react';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  alt?: string;
  className?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Avatar({ src, alt, fallback, size = 'md', className = '', ...props }: AvatarProps) {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  return (
    <div className={`relative inline-flex items-center justify-center overflow-hidden bg-surface border border-border rounded-full ${sizes[size]} ${className}`}>
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" {...props} />
      ) : fallback ? (
        <span className="font-medium text-white">{fallback}</span>
      ) : (
        <User className="w-1/2 h-1/2 text-secondary" />
      )}
    </div>
  );
}
