import { ReactNode } from 'react';
import { FileQuestion } from 'lucide-react';

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-800/30 border border-slate-700 border-dashed rounded-xl">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-800 border border-slate-700 text-slate-400 mb-4 shadow-sm">
        <FileQuestion size={24} />
      </div>
      <h3 className="text-lg font-medium text-white mb-2">{title}</h3>
      {description && <p className="text-slate-400 text-sm max-w-sm mb-6">{description}</p>}
      {action && <div>{action}</div>}
    </div>
  );
}
