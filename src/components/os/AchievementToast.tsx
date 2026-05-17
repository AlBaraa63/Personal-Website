import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy } from 'lucide-react';
import { useAchievements, Achievement } from '@/context/AchievementContext';
import { useSound } from '@/context/SoundContext';

interface QueuedAchievement {
    achievement: Achievement;
    id: number;
}

const AchievementToast: React.FC = () => {
    const { onUnlock } = useAchievements();
    const { playSound } = useSound();
    const [queue, setQueue] = useState<QueuedAchievement[]>([]);

    const handleUnlock = useCallback((achievement: Achievement) => {
        setQueue(prev => [...prev, { achievement, id: Date.now() }]);
        // Play a dramatic ascending chime
        playSound('success');
        setTimeout(() => playSound('open'), 150);
    }, [playSound]);

    useEffect(() => {
        return onUnlock(handleUnlock);
    }, [onUnlock, handleUnlock]);

    // Auto-dismiss after 4s
    useEffect(() => {
        if (queue.length === 0) return;
        const t = window.setTimeout(() => {
            setQueue(prev => prev.slice(1));
        }, 4000);
        return () => window.clearTimeout(t);
    }, [queue]);

    return (
        <div className="fixed top-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
            <AnimatePresence mode="popLayout">
                {queue.map(({ achievement, id }) => (
                    <motion.div
                        key={id}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className="pointer-events-auto bg-[var(--surface)]/95 backdrop-blur-xl border border-accent
                                   font-mono flex items-center gap-3 px-4 py-3 min-w-[280px] max-w-[360px]"
                        style={{
                            boxShadow: '0 0 30px rgba(var(--accent-rgb), 0.3), 0 0 60px rgba(var(--accent-rgb), 0.1)',
                        }}
                    >
                        {/* HUD corners */}
                        <span aria-hidden className="absolute -top-px -left-px w-2 h-2 border-t border-l border-accent" />
                        <span aria-hidden className="absolute -top-px -right-px w-2 h-2 border-t border-r border-accent" />
                        <span aria-hidden className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-accent" />
                        <span aria-hidden className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-accent" />

                        <div className="text-2xl flex-shrink-0">{achievement.icon}</div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.3em] text-accent mb-0.5">
                                <Trophy size={9} />
                                Achievement Unlocked
                            </div>
                            <div className="text-sm font-bold text-[var(--text-primary)] truncate">
                                {achievement.title}
                            </div>
                            <div className="text-[10px] text-[var(--text-muted)] truncate">
                                {achievement.description}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default AchievementToast;
