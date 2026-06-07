import { motion } from 'framer-motion';
import { MapPin, ExternalLink, Calendar, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import type { Application } from '../../types';
import { StatusBadge } from '../ui/Badge';

interface CardProps { application: Application; onClick: () => void; }

export function ApplicationCard({ application, onClick }: CardProps) {
  const { company, role, location, remote, applied_at, url, status } = application;
  return (
    <motion.div layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }} whileHover={{ y: -1 }} onClick={onClick}
      className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-4 cursor-pointer group transition-colors"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="min-w-0">
          <p className="font-semibold text-zinc-100 text-sm truncate">{company}</p>
          <p className="text-zinc-400 text-sm truncate mt-0.5">{role}</p>
        </div>
        <ChevronRight size={14} className="text-zinc-600 group-hover:text-zinc-400 flex-shrink-0 mt-0.5 transition-colors" />
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        <StatusBadge status={status} size="sm" />
        {remote && (
          <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full">Remote</span>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center gap-3">
          {location && <span className="flex items-center gap-1"><MapPin size={11} />{location}</span>}
          {applied_at && <span className="flex items-center gap-1"><Calendar size={11} />{format(new Date(applied_at), 'MMM d')}</span>}
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} className="text-zinc-500 hover:text-blue-400 transition-colors">
            <ExternalLink size={12} />
          </a>
        )}
      </div>
    </motion.div>
  );
}
