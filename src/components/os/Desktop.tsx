import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useOS } from '@/context/OSContext';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';
import Sidebar, { SidebarApp } from './Sidebar';
import BootSequence from './BootSequence';
import SysMatrixBackground from './SysMatrixBackground';
import CommandPalette from './CommandPalette';
import { useGlobalShortcuts } from './useGlobalShortcuts';
import { User, Terminal, Briefcase, FolderGit2, Mail, Cpu, Gamepad2, Settings, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

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

const LiveClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-center font-mono">
            <div className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight text-[var(--text-primary)] tabular-nums">
                {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="text-xs md:text-sm text-[var(--text-faint)] tracking-[0.3em] uppercase mt-3">
                {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
        </div>
    );
};

const WelcomeWidget: React.FC = () => (
    <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="flex flex-col items-center justify-center gap-10 text-center max-w-2xl mx-auto px-4"
    >
        <LiveClock />

        <div className="space-y-2">
            <h1 className="font-mono text-sm md:text-base tracking-[0.4em] text-[var(--text-muted)] uppercase">
                AlBaraa AlOlabi
            </h1>
            <p className="font-mono text-[10px] md:text-xs tracking-[0.5em] text-[var(--text-faint)] uppercase">
                AI Researcher · Computer Vision Engineer
            </p>
        </div>

        <KeyboardHint />
    </motion.div>
);

const KeyboardHint: React.FC = () => {
    const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');
    const mod = isMac ? '⌘' : 'Ctrl';
    return (
        <div className="flex items-center gap-3 px-4 py-2 border border-[var(--border)] text-[10px] font-mono uppercase tracking-[0.25em] text-[var(--text-faint)]">
            <span>Press</span>
            <kbd className="px-2 py-0.5 border border-[var(--border-strong)] text-[var(--text-muted)]">{mod} K</kbd>
            <span>to launch apps</span>
        </div>
    );
};

// Single source of truth for the app launcher list — shared by Sidebar, Taskbar (mobile), and Command Palette.
export const APP_LAUNCHER: SidebarApp[] = [
    { id: 'bio', label: 'Bio', subtitle: 'profile.json · identity', icon: <User size={22} /> },
    { id: 'experience', label: 'Timeline', subtitle: 'career & education logs', icon: <Briefcase size={22} /> },
    { id: 'projects', label: 'Projects', subtitle: 'case studies · code', icon: <FolderGit2 size={22} /> },
    { id: 'contact', label: 'Contact', subtitle: 'open uplink · message', icon: <Mail size={22} /> },
    { id: 'terminal', label: 'Terminal', subtitle: 'shell · drives the OS', icon: <Terminal size={22} /> },
    { id: 'neural', label: 'Holo-AI', subtitle: 'agent · runs the OS', icon: <Cpu size={22} /> },
    { id: 'retro', label: 'Arcade', subtitle: '// easter_egg.exe', icon: <Gamepad2 size={22} /> },
    { id: 'settings', label: 'Config', subtitle: 'theme · accent · audio', icon: <Settings size={22} /> },
];

const Desktop: React.FC = () => {
    const { registerWindow, isBooting, setBooting } = useOS();

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

    // Wire global keyboard shortcuts (⌘K, ⌘W, Esc, ⌘M, ⌘1–9).
    useGlobalShortcuts(APP_LAUNCHER);

    if (isBooting) {
        return <BootSequence onComplete={() => setBooting(false)} />;
    }

    return (
        <div className="fixed inset-0 overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] select-none">
            <SysMatrixBackground />
            <Suspense fallback={null}>
                <FloatingOrbs className="opacity-40" />
            </Suspense>

            {/* Centered desktop hero */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none pb-16">
                <div className="pointer-events-auto">
                    <WelcomeWidget />
                </div>
            </div>

            {/* Right sidebar */}
            <Sidebar apps={APP_LAUNCHER} />

            {/* Windows */}
            <div className="absolute inset-0 z-30 pointer-events-none">
                <WindowManager />
            </div>

            {/* Command palette overlay */}
            <CommandPalette apps={APP_LAUNCHER} />

            {/* Taskbar */}
            <Taskbar />

            {/* Atmosphere */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-40" />
            <div className="absolute inset-0 pointer-events-none opacity-[var(--scanline-opacity)] z-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        </div>
    );
};

export default Desktop;
