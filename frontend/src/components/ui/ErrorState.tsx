import { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

export function ErrorState({ title = 'Something went wrong', description, action }: { title?: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-red-500/5 border border-red-500/20 rounded-xl">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-red-500/10 text-red-500 mb-4">
        <AlertTriangle size={24} />
      </div>
      <h3 className="text-lg font-medium text-red-500 mb-2">{title}</h3>
      {description && <p className="text-slate-400 text-sm max-w-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
