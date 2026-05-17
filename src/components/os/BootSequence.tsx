import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Terminal } from 'lucide-react';
import { useSound } from '@/context/SoundContext';

interface BootSequenceProps {
    onComplete: () => void;
}

const BOOT_LOGS = [
    'INITIALIZING HOLO-OS KERNEL v5.0.0...',
    'MOUNTING VIRTUAL FILESYSTEM... OK',
    'LOADING NEURAL CO-PROCESSOR... CONNECTED',
    'USER: ALBARAA ALOLABI — ACCESS GRANTED',
    'STARTING WINDOW MANAGER...',
];

const TOTAL_DURATION_MS = 2500;

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
    const { playSound } = useSound();
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const completedRef = useRef(false);

    const finish = () => {
        if (completedRef.current) return;
        completedRef.current = true;
        onComplete();
    };

    // Sequenced log lines, progress bar, and hard auto-complete at TOTAL_DURATION_MS.
    useEffect(() => {
        playSound('boot');

        const logInterval = Math.floor((TOTAL_DURATION_MS - 600) / BOOT_LOGS.length);
        const logTimers: number[] = [];

        BOOT_LOGS.forEach((line, i) => {
            const t = window.setTimeout(() => {
                setLogs(prev => [...prev, line]);
                playSound('typing');
            }, i * logInterval);
            logTimers.push(t);
        });

        const start = performance.now();
        let raf = 0;
        const tick = () => {
            const elapsed = performance.now() - start;
            const next = Math.min(100, (elapsed / TOTAL_DURATION_MS) * 100);
            setProgress(next);
            if (elapsed < TOTAL_DURATION_MS) {
                raf = requestAnimationFrame(tick);
            } else {
                finish();
            }
        };
        raf = requestAnimationFrame(tick);

        return () => {
            logTimers.forEach(t => window.clearTimeout(t));
            cancelAnimationFrame(raf);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Escape key skip
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
                finish();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black font-mono overflow-hidden select-none">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[linear-gradient(rgba(34,197,94,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.5)_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none" />

            {/* Main column */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative z-10 w-full max-w-md px-6 flex flex-col items-center gap-8"
            >
                {/* Title */}
                <div className="flex items-center gap-3">
                    <Terminal size={20} className="text-accent" />
                    <h1 className="text-2xl font-bold tracking-[0.35em] text-[var(--text-primary)] uppercase">
                        HOLO<span className="text-accent">-OS</span>
                    </h1>
                </div>

                {/* Log lines */}
                <div className="w-full h-[140px] overflow-hidden text-[11px] leading-relaxed text-[var(--text-muted)]">
                    {logs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -6 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.15 }}
                        >
                            <span className="text-accent">›</span> {log}
                        </motion.div>
                    ))}
                </div>

                {/* Progress bar */}
                <div className="w-full space-y-2">
                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-[var(--text-faint)]">
                        <span>System Init</span>
                        <span className="text-[var(--text-muted)]">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full h-[2px] bg-[var(--surface-raised)] overflow-hidden">
                        <motion.div
                            className="h-full bg-accent"
                            style={{ width: `${progress}%`, boxShadow: '0 0 10px var(--accent)' }}
                        />
                    </div>
                </div>

                {/* Prominent skip button */}
                <button
                    onClick={finish}
                    className="mt-4 px-8 py-2.5 border border-[var(--border-strong)] text-[var(--text-primary)] text-xs tracking-[0.2em] uppercase font-medium
                               hover:bg-accent hover:text-black hover:border-accent transition-colors"
                >
                    Skip Intro ▸
                </button>

                <div className="text-[10px] text-[var(--text-faint)] tracking-widest uppercase">
                    Press Esc or Enter to skip
                </div>
            </motion.div>
        </div>
    );
};

export default BootSequence;
