import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';
import { useNotifications } from '@/context/NotificationContext';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';
import BootSequence from './BootSequence';
import SysMatrixBackground from './SysMatrixBackground';
import CommandPalette from './CommandPalette';
import NotificationLayer from './NotificationLayer';
import GitHubPresence from './GitHubPresence';
import BigDesktopIcon, { BigDesktopIconConfig } from './BigDesktopIcon';
import FeaturedProjects from './FeaturedProjects';
import { useGlobalShortcuts } from './useGlobalShortcuts';
import { User, Terminal, Briefcase, FolderGit2, Mail, Cpu, Gamepad2, Settings, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

// Shape used by the launcher list — consumed by the command palette, taskbar
// mobile drawer, and keyboard-shortcut hook. Kept here since the old Sidebar
// component is no longer rendered.
export interface LauncherApp {
    id: string;
    label: string;
    subtitle?: string;
    icon: React.ReactNode;
}

// Lazy-loaded apps — each becomes its own chunk so the boot screen ships fast.
const About = lazy(() => import('@/components/sections/About'));
const Projects = lazy(() => import('@/components/sections/Projects'));
const Contact = lazy(() => import('@/components/sections/Contact'));
const Experience = lazy(() => import('@/components/sections/Experience'));
const TerminalApp = lazy(() => import('@/components/apps/TerminalApp'));
const NeuralNet = lazy(() => import('@/components/apps/NeuralNet'));
const RetroGrid = lazy(() => import('@/components/apps/RetroGrid'));
const SettingsApp = lazy(() => import('@/components/apps/Settings'));
const FloatingOrbs = lazy(() => import('@/components/effects/FloatingOrbs'));

const AppLoading: React.FC = () => (
    <div className="h-full w-full flex items-center justify-center font-mono text-[var(--text-faint)]">
        <Loader2 className="animate-spin text-accent mr-2" size={16} />
        <span className="text-xs uppercase tracking-widest">Loading…</span>
    </div>
);

const lazyApp = (node: React.ReactNode) => (
    <Suspense fallback={<AppLoading />}>{node}</Suspense>
);

// ───────────────────────────────────────────────────────────────────────────
// Hero — name + role + headline credentials. The first thing a visitor sees.
// ───────────────────────────────────────────────────────────────────────────

const DesktopHero: React.FC = () => (
    <motion.header
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-5xl mx-auto px-4 sm:px-6 text-center"
    >
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.45em] text-[var(--text-faint)] mb-3"
        >
            // Holo-OS · Identity Loaded
        </motion.div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.02]">
            AlBaraa <span className="text-accent">AlOlabi</span>
        </h1>

        <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg md:text-xl font-mono uppercase tracking-[0.28em] text-[var(--text-primary)]">
            AI Researcher · Computer Vision Engineer
        </h2>

        <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-[11px] sm:text-sm text-[var(--text-muted)] leading-relaxed">
            CV Engineer Intern @ <span className="text-accent">Cellula Technologies</span>
            <span className="text-[var(--text-faint)]"> · </span>
            Published author at <span className="text-accent">IEEE SNAMS 2025</span>
            <span className="text-[var(--text-faint)]"> · </span>
            Open to opportunities
        </p>
    </motion.header>
);

// ───────────────────────────────────────────────────────────────────────────
// Live clock — small, top-left so it doesn't compete with the hero.
// ───────────────────────────────────────────────────────────────────────────

const LiveClock: React.FC = () => {
    const [time, setTime] = useState(new Date());
    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);
    return (
        <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden md:flex fixed top-4 left-4 z-20 items-center gap-3 px-3 py-2 bg-[var(--surface)]/70 backdrop-blur-md border border-[var(--border)] font-mono pointer-events-none"
        >
            <div className="text-xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums leading-none">
                {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="text-[9px] uppercase tracking-[0.3em] text-[var(--text-faint)]">
                {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </div>
        </motion.div>
    );
};

// ───────────────────────────────────────────────────────────────────────────
// App launcher data — split into primary (big colored center icons) and
// secondary (small accent-only mini-dock).
// ───────────────────────────────────────────────────────────────────────────

const PRIMARY_APPS: BigDesktopIconConfig[] = [
    {
        id: 'bio',
        label: 'About Me',
        sublabel: 'profile · résumé',
        icon: <User size={32} strokeWidth={1.6} />,
        color: '#06b6d4',
        colorRgb: '6, 182, 212',
    },
    {
        id: 'projects',
        label: 'Projects',
        sublabel: 'case studies',
        icon: <FolderGit2 size={32} strokeWidth={1.6} />,
        color: '#22c55e',
        colorRgb: '34, 197, 94',
    },
    {
        id: 'experience',
        label: 'Experience',
        sublabel: 'career & education',
        icon: <Briefcase size={32} strokeWidth={1.6} />,
        color: '#f59e0b',
        colorRgb: '245, 158, 11',
    },
    {
        id: 'contact',
        label: 'Contact',
        sublabel: 'open uplink',
        icon: <Mail size={32} strokeWidth={1.6} />,
        color: '#a855f7',
        colorRgb: '168, 85, 247',
    },
];

const SECONDARY_APPS: LauncherApp[] = [
    { id: 'terminal', label: 'Terminal', subtitle: 'shell · drives the OS', icon: <Terminal size={18} /> },
    { id: 'neural', label: 'Holo-AI', subtitle: 'agent · runs the OS', icon: <Cpu size={18} /> },
    { id: 'retro', label: 'Arcade', subtitle: '// easter_egg.exe', icon: <Gamepad2 size={18} /> },
    { id: 'settings', label: 'Config', subtitle: 'theme · accent · audio', icon: <Settings size={18} /> },
];

// Combined for command palette, mobile drawer, keyboard shortcuts (⌘1..9).
// Primary apps come first so ⌘1..4 hits the headline apps.
export const APP_LAUNCHER: LauncherApp[] = [
    ...PRIMARY_APPS.map(({ id, label, sublabel, icon }) => ({ id, label, subtitle: sublabel, icon })),
    ...SECONDARY_APPS,
];

// ───────────────────────────────────────────────────────────────────────────
// Secondary mini-dock — a thin strip of small accent-tinted app icons. Lives
// just above the taskbar so they're reachable without competing with the
// primary center grid.
// ───────────────────────────────────────────────────────────────────────────

const SecondaryDock: React.FC = () => {
    const { windows, activeWindowId, openWindow, focusWindow } = useOS();
    const { playSound } = useSound();

    const handleClick = (id: string) => {
        playSound('click');
        const win = windows[id];
        if (win?.isOpen) focusWindow(id);
        else {
            playSound('open');
            openWindow(id);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[var(--surface)]/70 backdrop-blur-md border border-[var(--border)] font-mono pointer-events-auto"
        >
            <span className="text-[9px] uppercase tracking-[0.25em] text-[var(--text-faint)] pr-2 border-r border-[var(--border)]">
                Utilities
            </span>
            {SECONDARY_APPS.map(app => {
                const win = windows[app.id];
                const isOpen = !!win?.isOpen;
                const isActive = activeWindowId === app.id && isOpen;
                return (
                    <button
                        key={app.id}
                        onClick={() => handleClick(app.id)}
                        onMouseEnter={() => playSound('hover')}
                        aria-pressed={isActive}
                        aria-label={app.label}
                        title={app.label}
                        className={`
                            relative w-9 h-9 flex items-center justify-center border transition-colors group
                            ${isActive
                                ? 'border-accent text-accent bg-[rgba(var(--accent-rgb),0.12)]'
                                : isOpen
                                    ? 'border-[var(--border-strong)] text-[var(--text-primary)] hover:border-accent hover:text-accent'
                                    : 'border-[var(--border)] text-[var(--text-muted)] hover:border-accent hover:text-accent'}
                        `}
                    >
                        {app.icon}
                        {isOpen && !isActive && (
                            <span aria-hidden className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-accent" />
                        )}
                        {/* Tooltip */}
                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--surface-raised)] border border-[var(--border)] text-[9px] uppercase tracking-widest text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            {app.label}
                        </span>
                    </button>
                );
            })}
        </motion.div>
    );
};

// ───────────────────────────────────────────────────────────────────────────
// Desktop — the full landing layout.
// ───────────────────────────────────────────────────────────────────────────

const Desktop: React.FC = () => {
    const { registerWindow, openWindow, focusWindow, windows, activeWindowId, isBooting, setBooting } = useOS();
    const { playSound } = useSound();
    const { notify } = useNotifications();
    const welcomedRef = useRef(false);

    useEffect(() => {
        registerWindow({
            id: 'bio',
            title: 'Identity Component',
            icon: <User size={16} />,
            component: lazyApp(<About />),
            size: { width: 900, height: 700 },
            position: { x: 0, y: 0 },
        });

        registerWindow({
            id: 'experience',
            title: 'Timeline Log',
            icon: <Briefcase size={16} />,
            component: lazyApp(<Experience />),
            size: { width: 1000, height: 750 },
            position: { x: 40, y: 20 },
        });

        registerWindow({
            id: 'projects',
            title: 'Project Database',
            icon: <FolderGit2 size={16} />,
            component: lazyApp(<Projects />),
            size: { width: 1100, height: 800 },
            position: { x: 80, y: 40 },
        });

        registerWindow({
            id: 'neural',
            title: 'Holo-AI Core',
            icon: <Cpu size={16} />,
            component: lazyApp(<NeuralNet />),
            size: { width: 520, height: 600 },
            position: { x: 120, y: 60 },
        });

        registerWindow({
            id: 'retro',
            title: 'RetroGrid Arcade',
            icon: <Gamepad2 size={16} />,
            component: lazyApp(<RetroGrid />),
            size: { width: 620, height: 500 },
            position: { x: 160, y: 80 },
        });

        registerWindow({
            id: 'settings',
            title: 'System Config',
            icon: <Settings size={16} />,
            component: lazyApp(<SettingsApp />),
            size: { width: 520, height: 650 },
            position: { x: 200, y: 100 },
        });

        registerWindow({
            id: 'contact',
            title: 'Comm Link',
            icon: <Mail size={16} />,
            component: lazyApp(<Contact />),
            size: { width: 900, height: 700 },
            position: { x: 240, y: 120 },
        });

        registerWindow({
            id: 'terminal',
            title: 'SysAdmin Terminal',
            icon: <Terminal size={16} />,
            component: lazyApp(<TerminalApp />),
            size: { width: 720, height: 500 },
            position: { x: 280, y: 140 },
        });
    }, [registerWindow]);

    useGlobalShortcuts(APP_LAUNCHER);

    // First-visit welcome from Holo-AI
    useEffect(() => {
        if (isBooting || welcomedRef.current) return;
        welcomedRef.current = true;
        if (typeof window === 'undefined') return;
        if (localStorage.getItem('holo-os-welcomed') === '1') return;
        const t = window.setTimeout(() => {
            notify({
                source: 'Holo-AI',
                title: 'Welcome to HOLO-OS',
                message: 'Click an icon to launch · Press ⌘K for the command palette · I can drive the OS — just ask.',
                duration: 9000,
                action: { label: 'Meet Holo-AI', run: () => openWindow('neural') },
            });
            localStorage.setItem('holo-os-welcomed', '1');
        }, 1200);
        return () => window.clearTimeout(t);
    }, [isBooting, notify, openWindow]);

    if (isBooting) {
        return <BootSequence onComplete={() => setBooting(false)} />;
    }

    const handlePrimaryClick = (id: string) => {
        playSound('click');
        const win = windows[id];
        if (win?.isOpen) focusWindow(id);
        else {
            playSound('open');
            openWindow(id);
        }
    };

    return (
        <div className="fixed inset-0 overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)] select-none">
            {/* Background atmosphere */}
            <SysMatrixBackground />
            <Suspense fallback={null}>
                <FloatingOrbs className="opacity-40" />
            </Suspense>

            {/* Small live clock — top-left, doesn't compete with hero */}
            <LiveClock />

            {/* Main landing column — hero, icon grid, featured projects */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-16 sm:pt-20 md:pt-24 pb-32 gap-10 sm:gap-12 md:gap-14">
                <DesktopHero />

                {/* Primary app icons — the desktop centerpiece */}
                <motion.section
                    aria-label="Application launcher"
                    className="w-full max-w-4xl px-4 sm:px-6"
                >
                    <div className="flex items-center justify-center gap-4 sm:gap-8 md:gap-12 flex-wrap">
                        {PRIMARY_APPS.map((app, idx) => {
                            const win = windows[app.id];
                            const isOpen = !!win?.isOpen;
                            const isActive = activeWindowId === app.id && isOpen;
                            return (
                                <BigDesktopIcon
                                    key={app.id}
                                    {...app}
                                    isOpen={isOpen}
                                    isActive={isActive}
                                    onClick={() => handlePrimaryClick(app.id)}
                                    onHover={() => playSound('hover')}
                                    delay={0.3 + idx * 0.08}
                                />
                            );
                        })}
                    </div>
                </motion.section>

                {/* Featured projects — visible without needing to open Projects */}
                <FeaturedProjects />

                {/* Secondary apps — thin utility dock */}
                <div className="mt-2 flex justify-center">
                    <SecondaryDock />
                </div>
            </div>

            {/* Live GitHub presence */}
            <GitHubPresence />

            {/* Windows layer */}
            <div className="fixed inset-0 z-30 pointer-events-none">
                <WindowManager />
            </div>

            {/* Command palette overlay */}
            <CommandPalette apps={APP_LAUNCHER} />

            {/* Notification toasts */}
            <NotificationLayer />

            {/* Taskbar */}
            <Taskbar />

            {/* Atmosphere overlays */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-40" />
            <div className="fixed inset-0 pointer-events-none opacity-[var(--scanline-opacity)] z-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        </div>
    );
};

export default Desktop;
