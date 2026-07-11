import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/context/SoundContext';

interface BootSequenceProps {
    onComplete: () => void;
}

const ASCII_LOGO = `
 ██╗  ██╗ ██████╗ ██╗      ██████╗        ██████╗ ███████╗
 ██║  ██║██╔═══██╗██║     ██╔═══██╗      ██╔═══██╗██╔════╝
 ███████║██║   ██║██║     ██║   ██║█████╗██║   ██║███████╗
 ██╔══██║██║   ██║██║     ██║   ██║╚════╝██║   ██║╚════██║
 ██║  ██║╚██████╔╝███████╗╚██████╔╝      ╚██████╔╝███████║
 ╚═╝  ╚═╝ ╚═════╝ ╚══════╝ ╚═════╝        ╚═════╝ ╚══════╝`;

const BOOT_LOGS = [
    { text: 'BIOS POST CHECK...', delay: 0 },
    { text: 'CPU: Neural Co-Processor v5.0 — 16 cores @ 4.2GHz', delay: 120 },
    { text: 'GPU: HoloRender RTX — 24GB VRAM [DETECTED]', delay: 200 },
    { text: 'RAM: 64GB DDR5 — ALL BANKS OK', delay: 280 },
    { text: 'MOUNTING VIRTUAL FILESYSTEM... OK', delay: 400 },
    { text: 'LOADING KERNEL MODULES...', delay: 500 },
    { text: '  ├─ window_manager.sys    [OK]', delay: 560 },
    { text: '  ├─ sound_engine.sys      [OK]', delay: 600 },
    { text: '  ├─ particle_renderer.sys [OK]', delay: 640 },
    { text: '  └─ holo_ai.neural        [LINKED]', delay: 680 },
    { text: 'AUTHENTICATING USER...', delay: 800 },
    { text: 'USER: ALBARAA ALOLABI', delay: 900 },
    { text: 'CLEARANCE: LEVEL ████████ — FULL ACCESS', delay: 1000 },
    { text: 'STARTING DESKTOP ENVIRONMENT...', delay: 1200 },
];

const TOTAL_DURATION_MS = 3800;

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
    const { playSound } = useSound();
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<'logo' | 'boot' | 'access' | 'wipe'>('logo');
    const [logoChars, setLogoChars] = useState(0);
    const completedRef = useRef(false);
    const logsEndRef = useRef<HTMLDivElement>(null);

    const finish = () => {
        if (completedRef.current) return;
        completedRef.current = true;
        onComplete();
    };

    // Phase 1: ASCII logo character-by-character render
    useEffect(() => {
        playSound('boot');
        const totalChars = ASCII_LOGO.length;
        const charInterval = 600 / totalChars; // render logo in ~600ms
        let count = 0;
        const timer = setInterval(() => {
            count += 3; // render 3 chars at a time for speed
            setLogoChars(Math.min(count, totalChars));
            if (count >= totalChars) {
                clearInterval(timer);
                setTimeout(() => setPhase('boot'), 300);
            }
        }, charInterval);
        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Phase 2: Boot logs + progress bar
    useEffect(() => {
        if (phase !== 'boot') return;
        const logTimers: number[] = [];

        BOOT_LOGS.forEach((log) => {
            const t = window.setTimeout(() => {
                setLogs(prev => [...prev, log.text]);
                playSound('typing');
            }, log.delay);
            logTimers.push(t);
        });

        const start = performance.now();
        let raf = 0;
        const tick = () => {
            const elapsed = performance.now() - start;
            const next = Math.min(100, (elapsed / (TOTAL_DURATION_MS - 1200)) * 100);
            setProgress(next);
            if (elapsed < TOTAL_DURATION_MS - 1200) {
                raf = requestAnimationFrame(tick);
            } else {
                setPhase('access');
            }
        };
        raf = requestAnimationFrame(tick);

        return () => {
            logTimers.forEach(t => window.clearTimeout(t));
            cancelAnimationFrame(raf);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    // Phase 3: ACCESS GRANTED flash
    useEffect(() => {
        if (phase !== 'access') return;
        playSound('success');
        const t = window.setTimeout(() => setPhase('wipe'), 1200);
        return () => window.clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    // Phase 4: Wipe out
    useEffect(() => {
        if (phase !== 'wipe') return;
        const t = window.setTimeout(finish, 600);
        return () => window.clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

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
        <AnimatePresence>
            {phase !== 'wipe' ? (
                <motion.div
                    key="boot"
                    exit={{ opacity: 0, scale: 1.05, filter: 'brightness(3) blur(8px)' }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black font-mono overflow-hidden select-none"
                    onClick={finish}
                >
                    {/* Background grid */}
                    <div className="absolute inset-0 opacity-[0.06] pointer-events-none bg-[linear-gradient(rgba(34,197,94,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.5)_1px,transparent_1px)] bg-[size:32px_32px]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none" />

                    {/* Scanlines overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.04] bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(0,0,0,0.3)_2px,rgba(0,0,0,0.3)_4px)]" />

                    {/* ACCESS GRANTED overlay */}
                    <AnimatePresence>
                        {phase === 'access' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 z-50 flex flex-col items-center justify-center"
                            >
                                {/* Flash */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: [0, 0.6, 0] }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 bg-accent"
                                />
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    className="relative z-10 text-center"
                                >
                                    <div className="text-accent text-5xl sm:text-7xl font-black tracking-[0.3em] uppercase"
                                        style={{
                                            textShadow: '0 0 40px rgba(34,197,94,0.8), 0 0 80px rgba(34,197,94,0.4), 0 0 120px rgba(34,197,94,0.2)',
                                        }}
                                    >
                                        Access Granted
                                    </div>
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ delay: 0.5, duration: 0.4 }}
                                        className="h-[2px] bg-accent mx-auto mt-4"
                                        style={{ boxShadow: '0 0 20px var(--accent)' }}
                                    />
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.7 }}
                                        className="mt-4 text-xs tracking-[0.4em] uppercase text-[var(--text-muted)]"
                                    >
                                        Welcome, AlBaraa
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main content — logo + boot logs */}
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: phase === 'access' ? 0.1 : 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10 w-full max-w-2xl px-6 flex flex-col items-center gap-6"
                    >
                        {/* ASCII Logo */}
                        <div className="relative">
                            <pre
                                className="text-accent text-[6px] sm:text-[8px] md:text-[10px] leading-[1.1] whitespace-pre select-none"
                                style={{
                                    textShadow: '0 0 10px rgba(34,197,94,0.6), 0 0 30px rgba(34,197,94,0.2)',
                                }}
                            >
                                {ASCII_LOGO.slice(0, logoChars)}
                                {logoChars < ASCII_LOGO.length && <span className="animate-pulse">█</span>}
                            </pre>
                            <div className="text-center mt-1 text-[10px] tracking-[0.5em] uppercase text-[var(--text-faint)]">
                                Kernel v5.0.0 · Neural Architecture
                            </div>
                        </div>

                        {/* Boot logs */}
                        {phase !== 'logo' && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="w-full"
                            >
                                <div className="w-full h-[180px] overflow-y-auto custom-scrollbar text-[10px] sm:text-[11px] leading-relaxed text-[var(--text-muted)] bg-black/50 border border-[var(--border)] p-3">
                                    {logs.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -6 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.1 }}
                                        >
                                            <span className="text-accent">{'>'}</span>{' '}
                                            <span className={
                                                log.includes('[OK]') || log.includes('[LINKED]') || log.includes('[DETECTED]')
                                                    ? 'text-accent'
                                                    : log.includes('ALBARAA')
                                                        ? 'text-[var(--text-primary)] font-bold'
                                                        : ''
                                            }>
                                                {log}
                                            </span>
                                        </motion.div>
                                    ))}
                                    <div ref={logsEndRef} />
                                </div>

                                {/* Progress bar */}
                                <div className="w-full mt-3 space-y-1.5">
                                    <div className="flex justify-between text-[10px] uppercase tracking-widest text-[var(--text-faint)]">
                                        <span>System Init</span>
                                        <span className="text-[var(--text-muted)] tabular-nums">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="w-full h-[3px] bg-[var(--surface-raised)] overflow-hidden">
                                        <motion.div
                                            className="h-full bg-accent"
                                            style={{ width: `${progress}%`, boxShadow: '0 0 12px var(--accent), 0 0 4px var(--accent)' }}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Skip button */}
                        <div className="flex flex-col items-center gap-2 mt-2">
                            <button
                                onClick={(e) => { e.stopPropagation(); finish(); }}
                                className="px-8 py-2.5 border border-[var(--border-strong)] text-[var(--text-primary)] text-xs tracking-[0.2em] uppercase font-medium
                                           hover:bg-accent hover:text-black hover:border-accent transition-colors"
                            >
                                Skip Intro ▸
                            </button>
                            <div className="text-[10px] text-[var(--text-faint)] tracking-widest uppercase animate-pulse">
                                Click anywhere · press Esc or Enter to skip
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    );
};

export default BootSequence;
