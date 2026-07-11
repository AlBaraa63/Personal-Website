import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Users, Eye, MapPin } from 'lucide-react';

// Mock visitor analytics — simulates a live data feed.
// Replace with Supabase realtime queries when a project is connected.

const getVisitorTimezone = (): string => {
    try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop()?.replace(/_/g, ' ') || 'Unknown';
    } catch { return 'Unknown'; }
};

const getVisitorCountry = (): string => {
    try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const regionMap: Record<string, string> = {
            'Asia/Dubai': '🇦🇪 UAE',
            'Asia/Abu_Dhabi': '🇦🇪 UAE',
            'America/New_York': '🇺🇸 USA',
            'America/Los_Angeles': '🇺🇸 USA',
            'America/Chicago': '🇺🇸 USA',
            'Europe/London': '🇬🇧 UK',
            'Europe/Berlin': '🇩🇪 Germany',
            'Asia/Tokyo': '🇯🇵 Japan',
            'Asia/Shanghai': '🇨🇳 China',
            'Asia/Kolkata': '🇮🇳 India',
            'Asia/Calcutta': '🇮🇳 India',
            'Australia/Sydney': '🇦🇺 Australia',
            'America/Toronto': '🇨🇦 Canada',
            'Europe/Paris': '🇫🇷 France',
            'Asia/Riyadh': '🇸🇦 KSA',
        };
        return regionMap[tz] || '🌍 ' + (tz.split('/')[1]?.replace(/_/g, ' ') || 'Earth');
    } catch { return '🌍 Earth'; }
};

const VisitorHUD: React.FC = () => {
    const [viewerCount, setViewerCount] = useState(1);
    const [sessionTime, setSessionTime] = useState(0);
    const location = getVisitorCountry();
    const timezone = getVisitorTimezone();

    // Simulate fluctuating viewer count
    useEffect(() => {
        const base = 1 + Math.floor(Math.random() * 3);
        setViewerCount(base);
        const interval = setInterval(() => {
            setViewerCount(prev => {
                const delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
                return Math.max(1, prev + delta);
            });
        }, 15000);
        return () => clearInterval(interval);
    }, []);

    // Session timer
    useEffect(() => {
        const interval = setInterval(() => {
            setSessionTime(prev => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.5 }}
            className="hidden md:flex fixed top-4 right-4 z-20 flex-col gap-0
                       bg-[var(--surface)]/70 backdrop-blur-md border border-[var(--border)] font-mono pointer-events-none"
        >
            {/* HUD corners */}
            <span aria-hidden className="absolute -top-px -left-px w-2 h-2 border-t border-l border-accent" />
            <span aria-hidden className="absolute -top-px -right-px w-2 h-2 border-t border-r border-accent" />
            <span aria-hidden className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-accent" />
            <span aria-hidden className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-accent" />

            {/* Header */}
            <div className="px-3 py-1.5 border-b border-[var(--border)] flex items-center gap-1.5 text-[8px] uppercase tracking-[0.3em] text-[var(--text-faint)]">
                <Globe size={8} />
                Visitor Telemetry
            </div>

            <div className="px-3 py-2 space-y-1.5">
                {/* Location */}
                <div className="flex items-center gap-1.5">
                    <MapPin size={9} className="text-accent flex-shrink-0" />
                    <span className="text-[10px] text-[var(--text-muted)]">{location}</span>
                </div>

                {/* Active viewers */}
                <div className="flex items-center gap-1.5">
                    <Eye size={9} className="text-accent flex-shrink-0" />
                    <span className="text-[10px] text-[var(--text-muted)]">
                        <span className="text-accent font-bold">{viewerCount}</span> active viewer{viewerCount > 1 ? 's' : ''}
                    </span>
                </div>

                {/* Session time */}
                <div className="flex items-center gap-1.5">
                    <Users size={9} className="text-[var(--text-faint)] flex-shrink-0" />
                    <span className="text-[10px] text-[var(--text-faint)] tabular-nums">
                        Session: {formatTime(sessionTime)}
                    </span>
                </div>

                {/* Timezone */}
                <div className="flex items-center gap-1.5">
                    <Globe size={9} className="text-[var(--text-faint)] flex-shrink-0" />
                    <span className="text-[10px] text-[var(--text-faint)]">
                        {timezone}
                    </span>
                </div>
            </div>
        </motion.div>
    );
};

export default VisitorHUD;
