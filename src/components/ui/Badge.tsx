import type { ApplicationStatus } from '../../types';
import { STATUS_CONFIG } from '../../types';

interface BadgeProps { status: ApplicationStatus; size?: 'sm' | 'md'; }

export function StatusBadge({ status, size = 'md' }: BadgeProps) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${cfg.bg} ${cfg.color} ${cfg.border} ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}
