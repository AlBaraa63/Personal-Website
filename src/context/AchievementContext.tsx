import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked: boolean;
    unlockedAt?: number;
}

interface AchievementContextType {
    achievements: Achievement[];
    unlock: (id: string) => void;
    isUnlocked: (id: string) => boolean;
    totalUnlocked: number;
    onUnlock: (callback: (achievement: Achievement) => void) => () => void;
}

const ACHIEVEMENT_DEFS: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
    { id: 'first-contact', title: 'First Contact', description: 'Open your first app window', icon: '🔓' },
    { id: 'neural-handshake', title: 'Neural Handshake', description: 'Talk to Holo-AI', icon: '🧠' },
    { id: 'sudo-master', title: 'Sudo Master', description: 'Try sudo in the terminal', icon: '💀' },
    { id: 'gamer', title: 'Gamer', description: 'Score 500+ in Snake', icon: '🐍' },
    { id: 'mission-briefing', title: 'Mission Briefing', description: 'Open the Contact window', icon: '📧' },
    { id: 'deep-dive', title: 'Deep Dive', description: 'Open 3+ different project details', icon: '🔍' },
    { id: 'customizer', title: 'Customizer', description: 'Change the accent color', icon: '🎨' },
    { id: 'power-user', title: 'Power User', description: 'Use the command palette (⌘K)', icon: '⌨️' },
    { id: 'the-one', title: 'The One', description: 'Enter the Konami Code', icon: '🕶️' },
    { id: 'holo-master', title: 'HOLO-OS Master', description: 'Unlock 8 other achievements', icon: '🏆' },
];

const STORAGE_KEY = 'holo-os-achievements';

const loadAchievements = (): Achievement[] => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed: Record<string, number> = JSON.parse(saved);
            return ACHIEVEMENT_DEFS.map(def => ({
                ...def,
                unlocked: !!parsed[def.id],
                unlockedAt: parsed[def.id] || undefined,
            }));
        }
    } catch { /* ignore */ }
    return ACHIEVEMENT_DEFS.map(def => ({ ...def, unlocked: false }));
};

const saveAchievements = (achievements: Achievement[]) => {
    const map: Record<string, number> = {};
    achievements.forEach(a => {
        if (a.unlocked && a.unlockedAt) map[a.id] = a.unlockedAt;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
};

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export const AchievementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [achievements, setAchievements] = useState<Achievement[]>(loadAchievements);
    const callbacksRef = useRef<Set<(a: Achievement) => void>>(new Set());

    useEffect(() => {
        saveAchievements(achievements);
    }, [achievements]);

    // Check for HOLO-OS Master
    useEffect(() => {
        const unlocked = achievements.filter(a => a.unlocked && a.id !== 'holo-master').length;
        const master = achievements.find(a => a.id === 'holo-master');
        if (unlocked >= 8 && master && !master.unlocked) {
            // Auto-unlock master after a delay
            const t = window.setTimeout(() => unlock('holo-master'), 1500);
            return () => window.clearTimeout(t);
        }
    }, [achievements]);

    const unlock = useCallback((id: string) => {
        setAchievements(prev => {
            const idx = prev.findIndex(a => a.id === id);
            if (idx === -1 || prev[idx].unlocked) return prev;
            const updated = [...prev];
            const achievement = { ...updated[idx], unlocked: true, unlockedAt: Date.now() };
            updated[idx] = achievement;
            // Notify listeners
            callbacksRef.current.forEach(cb => cb(achievement));
            return updated;
        });
    }, []);

    const isUnlocked = useCallback((id: string) => {
        return achievements.some(a => a.id === id && a.unlocked);
    }, [achievements]);

    const onUnlock = useCallback((callback: (a: Achievement) => void) => {
        callbacksRef.current.add(callback);
        return () => { callbacksRef.current.delete(callback); };
    }, []);

    const totalUnlocked = achievements.filter(a => a.unlocked).length;

    return (
        <AchievementContext.Provider value={{ achievements, unlock, isUnlocked, totalUnlocked, onUnlock }}>
            {children}
        </AchievementContext.Provider>
    );
};

export const useAchievements = () => {
    const context = useContext(AchievementContext);
    if (!context) throw new Error('useAchievements must be used within AchievementProvider');
    return context;
};
