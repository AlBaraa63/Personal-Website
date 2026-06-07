import { AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { Application, ApplicationStatus } from '../../types';
import { STATUS_CONFIG } from '../../types';
import { ApplicationCard } from './Card';

interface ColumnProps {
  status: ApplicationStatus;
  applications: Application[];
  onCardClick: (app: Application) => void;
  onAddClick: (status: ApplicationStatus) => void;
}

export function KanbanColumn({ status, applications, onCardClick, onAddClick }: ColumnProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <div className="flex flex-col min-w-[280px] w-[280px] flex-shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
          <span className="text-sm font-medium text-zinc-300">{cfg.label}</span>
          <span className="text-xs text-zinc-600 bg-zinc-800 rounded-full px-1.5 py-0.5 min-w-[20px] text-center">{applications.length}</span>
        </div>
        <button onClick={() => onAddClick(status)} className="p-1 text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800 rounded-lg transition-colors">
          <Plus size={14} />
        </button>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-180px)] pb-4 pr-1">
        <AnimatePresence mode="popLayout">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} onClick={() => onCardClick(app)} />
          ))}
        </AnimatePresence>
        {applications.length === 0 && (
          <button onClick={() => onAddClick(status)} className="border border-dashed border-zinc-800 hover:border-zinc-700 rounded-xl p-6 text-zinc-600 hover:text-zinc-500 text-sm text-center transition-colors">
            + Add application
          </button>
        )}
      </div>
    </div>
  );
}
