import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink } from 'lucide-react';

interface GitHubEvent {
    type: string;
    repo: { name: string; url: string };
    created_at: string;
    payload?: {
        commits?: Array<{ message: string }>;
        ref?: string;
        ref_type?: string;
        action?: string;
    };
}

interface Activity {
    verb: string;
    repo: string;
    detail?: string;
    timestamp: string;
    url: string;
}

const USERNAME = 'AlBaraa63';
const REFRESH_INTERVAL = 90_000; // 90s

const relativeTime = (iso: string): string => {
    const seconds = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 2592000) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 2592000)}mo ago`;
};

const parseEvent = (e: GitHubEvent): Activity | null => {
    const repo = e.repo.name.split('/').pop() ?? e.repo.name;
    const repoUrl = `https://github.com/${e.repo.name}`;
    switch (e.type) {
        case 'PushEvent': {
            const msg = e.payload?.commits?.[0]?.message?.split('\n')[0];
            return { verb: 'pushed to', repo, detail: msg, timestamp: e.created_at, url: repoUrl };
        }
        case 'CreateEvent':
            if (e.payload?.ref_type === 'repository') {
                return { verb: 'created repo', repo, timestamp: e.created_at, url: repoUrl };
            }
            if (e.payload?.ref_type === 'branch') {
                return { verb: 'created branch on', repo, detail: e.payload.ref, timestamp: e.created_at, url: repoUrl };
            }
            return { verb: 'created tag on', repo, detail: e.payload?.ref, timestamp: e.created_at, url: repoUrl };
        case 'PullRequestEvent':
            return { verb: `${e.payload?.action ?? 'updated'} PR on`, repo, timestamp: e.created_at, url: repoUrl };
        case 'IssuesEvent':
            return { verb: `${e.payload?.action ?? 'updated'} issue on`, repo, timestamp: e.created_at, url: repoUrl };
        case 'WatchEvent':
            return { verb: 'starred', repo, timestamp: e.created_at, url: repoUrl };
        case 'ReleaseEvent':
            return { verb: 'released on', repo, timestamp: e.created_at, url: repoUrl };
        default:
            return null;
    }
};

const GitHubPresence: React.FC = () => {
    const [activity, setActivity] = useState<Activity | null>(null);
    const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
    const [, forceTick] = useState(0);

    useEffect(() => {
        let cancelled = false;

        const fetchActivity = async () => {
            try {
                const headers: HeadersInit = { Accept: 'application/vnd.github.v3+json' };
                const token = import.meta.env.VITE_GITHUB_TOKEN;
                if (token) headers.Authorization = `token ${token}`;
                const res = await fetch(`https://api.github.com/users/${USERNAME}/events/public?per_page=10`, { headers });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const events: GitHubEvent[] = await res.json();
                for (const e of events) {
                    const parsed = parseEvent(e);
                    if (parsed) {
                        if (!cancelled) {
                            setActivity(parsed);
                            setStatus('ok');
                        }
                        return;
                    }
                }
                if (!cancelled) setStatus('error');
            } catch {
                if (!cancelled) setStatus('error');
            }
        };

        fetchActivity();
        const interval = setInterval(fetchActivity, REFRESH_INTERVAL);
        return () => {
            cancelled = true;
            clearInterval(interval);
        };
    }, []);

    // Re-render every 30s so the relative timestamp stays fresh.
    useEffect(() => {
        const tick = setInterval(() => forceTick(n => n + 1), 30_000);
        return () => clearInterval(tick);
    }, []);

    if (status === 'loading') return null;
    if (status === 'error' || !activity) return null;

    return (
        <motion.a
            href={activity.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="hidden md:flex fixed bottom-20 left-4 z-20 pointer-events-auto
                       bg-[var(--surface)]/85 backdrop-blur-md border border-[var(--border)]
                       hover:border-accent transition-colors group max-w-[320px] font-mono"
            aria-label={`Latest GitHub activity: ${activity.verb} ${activity.repo}`}
        >
            {/* HUD corner brackets */}
            <span aria-hidden className="absolute -top-px -left-px w-2 h-2 border-t border-l border-accent" />
            <span aria-hidden className="absolute -top-px -right-px w-2 h-2 border-t border-r border-accent" />
            <span aria-hidden className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-accent" />
            <span aria-hidden className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-accent" />

            <div className="flex items-stretch">
                {/* Pulse indicator */}
                <div className="px-2.5 border-r border-[var(--border)] flex items-center bg-[var(--surface-inset)]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full bg-accent opacity-75" />
                        <span className="relative inline-flex rounded-none h-2 w-2 bg-accent" />
                    </span>
                </div>

                <div className="p-2.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] text-[var(--text-faint)] mb-0.5">
                        <Github size={9} />
                        <span>Live · @{USERNAME}</span>
                    </div>
                    <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {activity.verb} <span className="text-accent font-semibold">{activity.repo}</span>
                    </div>
                    {activity.detail && (
                        <div className="text-[10px] text-[var(--text-faint)] truncate mt-0.5 italic">
                            "{activity.detail}"
                        </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-1 text-[9px] uppercase tracking-widest text-[var(--text-faint)]">
                        <span>{relativeTime(activity.timestamp)}</span>
                        <ExternalLink size={9} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                </div>
            </div>
        </motion.a>
    );
};

export default GitHubPresence;
