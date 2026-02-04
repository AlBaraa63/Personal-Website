import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Wifi, Fingerprint, Eye, Lock, ShieldCheck, Zap } from 'lucide-react';
import { useSound } from '@/context/SoundContext';

// Hook to detect mobile viewport
const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return isMobile;
};

interface BootSequenceProps {
    onComplete: () => void;
}

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
    const { playSound } = useSound();
    const [logs, setLogs] = useState<string[]>([]);
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<'click' | 'auth' | 'bios' | 'loading' | 'complete'>('click');
    const logsEndRef = useRef<HTMLDivElement>(null);
    const isMobile = useIsMobile();

    // Auto-scroll logs
    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    // Handle the initial click to start the boot sequence
    const handleEnterClick = () => {
        playSound('boot');
        setPhase('auth');

        // Auto-advance auth after delay (faster on mobile)
        setTimeout(() => {
            playSound('success');
            setPhase('bios');
        }, isMobile ? 1500 : 3000);
    };

    // Phase 2: BIOS Logs (Triggered after Auth)
    useEffect(() => {
        if (phase !== 'bios') return;

        const runBios = async () => {
            const commands = [
                'INITIALIZING HOLO-OS KERNEL v5.0.0-alpha...',
                'CHECKING SYSTEM INTEGRITY... OK',
                'LOADING MEMORY MODULES: [0x000000] - [0xFFFFFF]... DONE',
                'MOUNTING VIRTUAL FILESYSTEM (VFS)... SUCCESS',
                'INITIALIZING NEURAL CO-PROCESSOR... CONNECTED',
                'BYPASSING SECURITY FIREWALLS... SUCCESS',
                'ESTABLISHING ENCRYPTED TUNNEL... [LEVE-7 ENCRYPTION]',
                'LOADING DRIVERS: [GPU] [AUDIO] [HAPTICS]... DONE',
                'OPTIMIZING RENDERING PIPELINE... 120FPS LOCKED',
                'USER: ALBARAA ALOLABI DETECTED',
                'ACCESS GRANTED: ADMIN PRIVILEGES UNLOCKED',
                'STARTING WINDOW MANAGER...',
            ];

            for (const cmd of commands) {
                setLogs(prev => [...prev, cmd]);
                playSound('typing'); // Fast clicking sound
                await new Promise(r => setTimeout(r, 40));
            }

            setPhase('loading');
        };

        runBios();
    }, [phase]);

    // Phase 3: Loading Bar
    useEffect(() => {
        if (phase !== 'loading') return;

        const runLoading = async () => {
            for (let i = 0; i <= 100; i += 2) {
                setProgress(i);
                await new Promise(r => setTimeout(r, 10));
            }
            // Enhance the finish feel
            await new Promise(r => setTimeout(r, 500));
            setPhase('complete');
            setTimeout(onComplete, 800);
        };
        runLoading();
    }, [phase]);


    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-mono overflow-hidden select-none cursor-wait">

            {/* Background Matrix/Grid Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none bg-[linear-gradient(rgba(0,255,128,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] pointer-events-none" />

            {/* Phase 0: Click to Enter */}
            <AnimatePresence mode="wait">
                {phase === 'click' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.2, filter: 'blur(20px)' }}
                        className="flex flex-col items-center gap-8 relative z-10 cursor-pointer"
                        onClick={handleEnterClick}
                    >
                        {/* Pulsing Ring */}
                        <div className="relative">
                            <motion.div
                                className="absolute inset-0 w-40 h-40 border-2 border-accent/30 rounded-full"
                                animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute inset-0 w-40 h-40 border-2 border-accent/50 rounded-full"
                                animate={{ scale: [1, 1.15, 1], opacity: [0.7, 0.2, 0.7] }}
                                transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                            />
                            <div className="w-40 h-40 rounded-full border border-accent/60 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                                <span className="text-accent text-4xl font-black tracking-widest">▶</span>
                            </div>
                        </div>

                        <div className="text-center space-y-3">
                            <h1 className="text-3xl font-black tracking-[0.3em] text-white uppercase">
                                HOLO-<span className="text-accent">OS</span>
                            </h1>
                            <p className="text-white/50 text-sm tracking-widest animate-pulse uppercase">
                                Click to Initialize System
                            </p>
                        </div>

                        <div className="flex gap-4 text-xs text-white/20 uppercase tracking-widest">
                            <span>v5.0.0-alpha</span>
                            <span>•</span>
                            <span>Neural Interface Ready</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Phase 1: Biometric Auth */}
            <AnimatePresence mode="wait">
                {phase === 'auth' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                        className="flex flex-col items-center gap-8 relative z-10"
                    >
                        <div className="relative">
                            <motion.div
                                className="absolute inset-0 bg-accent/20 rounded-full blur-xl"
                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <div className="w-32 h-32 rounded-full border border-accent/30 flex items-center justify-center bg-black/40 backdrop-blur-sm relative overflow-hidden">
                                <Fingerprint size={64} className="text-accent relative z-10 opacity-80" />

                                {/* Scanning Bar */}
                                <motion.div
                                    className="absolute top-0 left-0 right-0 h-1 bg-accent shadow-[0_0_10px_var(--accent)] z-20"
                                    animate={{ top: ['0%', '100%', '0%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        </div>

                        <div className="text-center space-y-2">
                            <h2 className="text-xl font-bold tracking-widest text-white">IDENTITY VERIFICATION</h2>
                            <p className="text-accent/70 text-sm animate-pulse">SCANNING BIOMETRICS...</p>
                        </div>

                        <div className="flex gap-4 text-xs text-white/30 uppercase tracking-widest">
                            <div className="flex items-center gap-1"><Lock size={12} /> Encrypted</div>
                            <div className="flex items-center gap-1"><ShieldCheck size={12} /> Secure</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Phase 2: BIOS Logs */}
            <AnimatePresence mode="wait">
                {phase === 'bios' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-3xl p-8 relative z-10"
                    >
                        <div className="flex items-center gap-4 mb-6 border-b border-accent/30 pb-4">
                            <Terminal size={24} className="text-accent" />
                            <h1 className="text-xl font-bold tracking-widest text-accent">ROOT@HOLO-OS:~# _</h1>
                        </div>

                        <div className="space-y-1 h-[400px] overflow-hidden font-mono text-sm relative">
                            {/* Scanline overlay for logs */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%] pointer-events-none z-20 opacity-20" />

                            {logs.map((log, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-3 text-green-400/90"
                                >
                                    <span className="text-green-600/50">[{new Date().toISOString().split('T')[1].replace('Z', '')}]</span>
                                    <span className="drop-shadow-[0_0_2px_rgba(0,255,0,0.5)]">{log}</span>
                                </motion.div>
                            ))}
                            <div ref={logsEndRef} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Phase 3: Loading System */}
            <AnimatePresence>
                {phase === 'loading' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
                        className="w-full max-w-md flex flex-col items-center gap-8 relative z-10"
                    >
                        {/* Holo Spinner V2 */}
                        <div className="relative w-40 h-40">
                            <motion.div
                                className="absolute inset-0 border-2 border-accent/20 rounded-full"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute inset-0 border-t-2 border-accent rounded-full"
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            />
                            <motion.div
                                className="absolute inset-4 border-l-2 border-cyan-500 rounded-full"
                                animate={{ rotate: -360 }}
                                transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-3xl font-black text-white tracking-tighter shadow-accent drop-shadow-[0_0_10px_rgba(0,255,128,0.5)]">{Math.round(progress)}%</span>
                                <span className="text-[10px] text-accent/70 tracking-[0.2em] mt-1">LOADING RESOURCES</span>
                            </div>
                        </div>

                        {/* Loading Bar */}
                        <div className="w-full space-y-2">
                            <div className="flex justify-between text-xs text-accent/60 font-medium">
                                <span>SYSTEM INITIALIZATION</span>
                                <span>{progress === 100 ? 'READY' : 'PROCESSING...'}</span>
                            </div>
                            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-accent via-cyan-400 to-accent bg-[length:200%_100%]"
                                    style={{ width: `${progress}%` }}
                                    animate={{ backgroundPosition: ['0% 0%', '100% 0%'] }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            </div>
                        </div>

                        {/* System Stats Mockup */}
                        <div className="grid grid-cols-4 gap-4 text-center w-full mt-4">
                            {[
                                { icon: Cpu, label: "CPU", val: "34%" },
                                { icon: Zap, label: "PWR", val: "STABLE" },
                                { icon: Wifi, label: "NET", val: "1Gbps" },
                                { icon: Eye, label: "VIS", val: "OK" },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/5 border border-white/5 rounded p-2 flex flex-col items-center gap-1"
                                >
                                    <stat.icon size={12} className="text-accent" />
                                    <span className="text-[10px] text-white/40">{stat.label}</span>
                                    <span className="text-xs text-white font-mono">{stat.val}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default BootSequence;
