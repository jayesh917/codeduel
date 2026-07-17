import { HTMLAttributes } from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import { motion } from 'motion/react';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  variant?: 'success' | 'error' | 'info';
  message: string;
  onClose?: () => void;
}

export function Toast({ variant = 'info', message, onClose, className = '', ...props }: ToastProps) {
  const icons = {
    success: <CheckCircle className="text-success" size={16} />,
    error: <AlertCircle className="text-danger" size={16} />,
    info: <Info className="text-primary" size={16} />
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className={`flex items-center justify-between px-4 py-3 bg-surface border border-border rounded-xl shadow-lg w-full max-w-sm ${className}`}
      {...props}
    >
      <div className="flex items-center gap-2.5">
        {icons[variant]}
        <p className="text-sm font-medium text-white m-0 leading-normal">{message}</p>
      </div>
      {onClose && (
        <button onClick={onClose} className="text-secondary hover:text-white transition-colors cursor-pointer ml-3">
          <X size={14} />
        </button>
      )}
    </motion.div>
  );
}
