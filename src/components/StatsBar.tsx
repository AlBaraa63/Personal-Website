import type { Application } from '../types';
import { COLUMN_ORDER, STATUS_CONFIG } from '../types';

export function StatsBar({ applications }: { applications: Application[] }) {
  const total = applications.length;
  const offers = applications.filter((a) => a.status === 'offer').length;
  const interviews = applications.filter((a) => a.status === 'interview').length;
  const responseRate = total > 0
    ? Math.round((applications.filter((a) => !['wishlist', 'applied'].includes(a.status)).length / total) * 100)
    : 0;

  return (
    <div className="flex items-center gap-6 px-6 py-3 border-b border-zinc-800/50">
      <div className="flex items-center gap-4 text-xs text-zinc-500">
        <span><span className="text-zinc-200 font-semibold text-sm">{total}</span> applications</span>
        <span><span className="text-violet-400 font-semibold text-sm">{interviews}</span> interviews</span>
        <span><span className="text-green-400 font-semibold text-sm">{offers}</span> offers</span>
        <span><span className="text-blue-400 font-semibold text-sm">{responseRate}%</span> response rate</span>
      </div>
      <div className="flex-1 flex items-center gap-1 max-w-xs ml-auto">
        {COLUMN_ORDER.filter((s) => s !== 'rejected').map((status) => {
          const count = applications.filter((a) => a.status === status).length;
          const pct = total > 0 ? (count / total) * 100 : 0;
          if (pct === 0) return null;
          return <div key={status} title={`${STATUS_CONFIG[status].label}: ${count}`}
            className={`h-1.5 rounded-full ${STATUS_CONFIG[status].dot} opacity-80`} style={{ width: `${pct}%` }} />;
        })}
      </div>
    </div>
  );
}
