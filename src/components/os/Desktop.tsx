import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';
import { useNotifications } from '@/context/NotificationContext';
import { useAchievements } from '@/context/AchievementContext';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';
import BootSequence from './BootSequence';
import SysMatrixBackground from './SysMatrixBackground';
import CommandPalette from './CommandPalette';
import NotificationLayer from './NotificationLayer';
import GitHubPresence from './GitHubPresence';
import BigDesktopIcon, { BigDesktopIconConfig } from './BigDesktopIcon';
import FeaturedProjects from './FeaturedProjects';
import ContextMenu from './ContextMenu';
import AchievementToast from './AchievementToast';
import VisitorHUD from './VisitorHUD';
import { useGlobalShortcuts } from './useGlobalShortcuts';
import { User, Terminal, Briefcase, FolderGit2, Mail, Cpu, Gamepad2, Settings, Loader2, Radar } from 'lucide-react';
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
const SkillRadar = lazy(() => import('@/components/apps/SkillRadar'));
const FloatingOrbs = lazy(() => import('@/components/effects/FloatingOrbs'));
const KonamiCode = lazy(() => import('@/components/effects/KonamiCode'));
const WindowParticles = lazy(() => import('@/components/effects/WindowParticles'));
const ClickRipple = lazy(() => import('@/components/effects/ClickRipple'));
const Screensaver = lazy(() => import('@/components/effects/Screensaver'));
const CRTShutdown = lazy(() => import('@/components/effects/CRTShutdown'));

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
// Scramble text hook — decrypts text character-by-character like a sci-fi
// identity scan. Each character cycles through random glyphs before settling.
// ───────────────────────────────────────────────────────────────────────────

const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコ0123456789@#$%&';

const useScrambleText = (target: string, startDelay = 0, charDelay = 40) => {
    const [display, setDisplay] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const timeout = window.setTimeout(() => {
            let resolved = 0;
            const interval = window.setInterval(() => {
                if (cancelled) return;
                resolved++;
                const out = target.split('').map((ch, i) => {
                    if (ch === ' ') return ' ';
                    if (i < resolved) return ch;
                    return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)];
                }).join('');
                setDisplay(out);
                if (resolved >= target.length) {
                    clearInterval(interval);
                    setDone(true);
                }
            }, charDelay);
        }, startDelay);
        return () => { cancelled = true; window.clearTimeout(timeout); };
    }, [target, startDelay, charDelay]);

    return { display: display || target.split('').map(c => c === ' ' ? ' ' : '█').join(''), done };
};

// ───────────────────────────────────────────────────────────────────────────
// Typewriter hook — types text character by character with a blinking cursor.
// ───────────────────────────────────────────────────────────────────────────

const useTypewriter = (text: string, startDelay = 0, speed = 50) => {
    const [display, setDisplay] = useState('');
    const [done, setDone] = useState(false);

    useEffect(() => {
        let cancelled = false;
        const timeout = window.setTimeout(() => {
            let idx = 0;
            const interval = window.setInterval(() => {
                if (cancelled) return;
                idx++;
                setDisplay(text.slice(0, idx));
                if (idx >= text.length) {
                    clearInterval(interval);
                    setDone(true);
                }
            }, speed);
        }, startDelay);
        return () => { cancelled = true; window.clearTimeout(timeout); };
    }, [text, startDelay, speed]);

    return { display, done };
};

// ───────────────────────────────────────────────────────────────────────────
// Count-up hook — animates a number from 0 to target.
// ───────────────────────────────────────────────────────────────────────────

const useCountUp = (target: number, duration = 1500, startDelay = 0) => {
    const [value, setValue] = useState(0);

    useEffect(() => {
        const timeout = window.setTimeout(() => {
            const start = performance.now();
            const tick = () => {
                const elapsed = performance.now() - start;
                const progress = Math.min(elapsed / duration, 1);
                // ease-out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                setValue(Math.round(eased * target));
                if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        }, startDelay);
        return () => window.clearTimeout(timeout);
    }, [target, duration, startDelay]);

    return value;
};

// ───────────────────────────────────────────────────────────────────────────
// Hero — name + role + headline credentials. The first thing a visitor sees.
// Now with cinematic text-decryption and typing effects.
// ───────────────────────────────────────────────────────────────────────────

const CREDENTIALS = [
    { label: 'CV Engineer Intern @', highlight: 'Cellula Technologies' },
    { label: 'Published author at', highlight: 'IEEE SNAMS 2025' },
    { label: '', highlight: '🟢 Open to opportunities' },
];

const DesktopHero: React.FC = () => {
    const firstName = useScrambleText('AlBaraa', 200, 45);
    const lastName = useScrambleText('AlOlabi', 500, 45);
    const role = useTypewriter('AI Researcher · Computer Vision Engineer', 1200, 35);

    return (
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
                {'>'} Holo-OS · Resolving Identity<span className="animate-pulse">_</span>
            </motion.div>

            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-[var(--text-primary)] leading-[1.02]">
                <span className={firstName.done ? '' : 'text-accent/70'}>{firstName.display}</span>
                {' '}
                <span className={`text-accent ${lastName.done ? '' : 'opacity-70'}`}>{lastName.display}</span>
            </h1>

            <h2 className="mt-3 sm:mt-4 text-sm sm:text-lg md:text-xl font-mono uppercase tracking-[0.28em] text-[var(--text-primary)] min-h-[1.6em]">
                {role.display}
                {!role.done && <span className="text-accent animate-pulse">▌</span>}
            </h2>

            <div className="mt-3 sm:mt-4 flex flex-wrap items-center justify-center gap-x-1 gap-y-1">
                {CREDENTIALS.map((cred, i) => (
                    <motion.span
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.0 + i * 0.2, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-[11px] sm:text-sm text-[var(--text-muted)]"
                    >
                        {cred.label}{cred.label ? ' ' : ''}
                        <span className={cred.highlight.includes('Open') ? 'text-accent font-semibold glow-pulse-text' : 'text-accent'}>
                            {cred.highlight}
                        </span>
                        {i < CREDENTIALS.length - 1 && (
                            <span className="text-[var(--text-faint)] mx-1">·</span>
                        )}
                    </motion.span>
                ))}
            </div>
        </motion.header>
    );
};

// ───────────────────────────────────────────────────────────────────────────
// Quick Stats — recruiter-focused at-a-glance numbers with count-up.
// ───────────────────────────────────────────────────────────────────────────

const STATS = [
    { value: 12, suffix: '+', label: 'Projects' },
    { value: 1, suffix: '', label: 'IEEE Paper' },
    { value: 2, suffix: '', label: 'Hackathon Wins' },
    { value: 5, suffix: '', label: 'Certifications' },
];

const QuickStats: React.FC = () => {
    const counts = STATS.map((s, i) =>
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useCountUp(s.value, 1200, 600 + i * 150)
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="w-full max-w-3xl mx-auto px-4 sm:px-6"
        >
            <div className="flex items-center justify-center gap-0 border border-[var(--border)] bg-[var(--surface)]/60 backdrop-blur-sm font-mono divide-x divide-[var(--border)]">
                {STATS.map((stat, i) => (
                    <div key={stat.label} className="flex-1 py-2.5 sm:py-3 text-center">
                        <div className="text-lg sm:text-xl font-bold text-accent tabular-nums leading-none">
                            {counts[i]}{stat.suffix}
                        </div>
                        <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-[var(--text-faint)] mt-1">
                            {stat.label}
                        </div>
                    </div>
                ))}
                <div className="flex-1 py-2.5 sm:py-3 text-center">
                    <div className="text-xs sm:text-sm font-bold text-accent leading-none flex items-center justify-center gap-1.5">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                        </span>
                        Hiring
                    </div>
                    <div className="text-[8px] sm:text-[10px] uppercase tracking-[0.25em] text-[var(--text-faint)] mt-1">
                        Open to Work
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

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
// Time-of-day hook — returns a dynamic background tint based on local time.
// ───────────────────────────────────────────────────────────────────────────

type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

const getTimeOfDay = (): TimeOfDay => {
    const h = new Date().getHours();
    if (h >= 6 && h < 12) return 'morning';
    if (h >= 12 && h < 18) return 'afternoon';
    if (h >= 18 && h < 22) return 'evening';
    return 'night';
};

const TIME_TINTS: Record<TimeOfDay, string> = {
    morning:   'radial-gradient(ellipse at 30% 20%, rgba(245, 158, 11, 0.06) 0%, transparent 70%)',
    afternoon: 'none',
    evening:   'radial-gradient(ellipse at 70% 80%, rgba(139, 92, 246, 0.06) 0%, transparent 70%)',
    night:     'radial-gradient(ellipse at 50% 50%, rgba(34, 197, 94, 0.03) 0%, transparent 60%)',
};

const useTimeOfDay = () => {
    const [tod, setTod] = useState<TimeOfDay>(getTimeOfDay);
    useEffect(() => {
        const interval = setInterval(() => setTod(getTimeOfDay()), 60_000);
        return () => clearInterval(interval);
    }, []);
    return tod;
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

export const SECONDARY_APPS: LauncherApp[] = [
    { id: 'terminal', label: 'Terminal', subtitle: 'shell · drives the OS', icon: <Terminal size={18} /> },
    { id: 'neural', label: 'Holo-AI', subtitle: 'agent · runs the OS', icon: <Cpu size={18} /> },
    { id: 'skills', label: 'Skill Radar', subtitle: 'tech stack visualizer', icon: <Radar size={18} /> },
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
// Desktop — the full landing layout.
// ───────────────────────────────────────────────────────────────────────────

const Desktop: React.FC = () => {
    const { registerWindow, openWindow, focusWindow, windows, activeWindowId, isBooting, setBooting } = useOS();
    const { playSound } = useSound();
    const { notify } = useNotifications();
    const { unlock } = useAchievements();
    const welcomedRef = useRef(false);
    const openedWindowsRef = useRef(new Set<string>());

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
            id: 'skills',
            title: 'Skill Radar',
            icon: <Radar size={16} />,
            component: lazyApp(<SkillRadar />),
            size: { width: 660, height: 480 },
            position: { x: 180, y: 90 },
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

    const timeOfDay = useTimeOfDay();

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
            // Achievement: first window open
            if (!openedWindowsRef.current.has('any')) {
                openedWindowsRef.current.add('any');
                unlock('first-contact');
            }
            // Achievement: contact window
            if (id === 'contact') unlock('mission-briefing');
        }
    };

    return (
        <div className="fixed inset-0 overflow-y-auto bg-[var(--bg-primary)] text-[var(--text-primary)] select-none">
            {/* Background atmosphere */}
            <SysMatrixBackground />
            <Suspense fallback={null}>
                <FloatingOrbs className="opacity-40" />
            </Suspense>

            {/* Time-of-day ambient tint */}
            <div
                className="fixed inset-0 pointer-events-none z-[1] transition-all duration-[5000ms]"
                style={{ background: TIME_TINTS[timeOfDay] }}
            />

            {/* Small live clock — top-left, doesn't compete with hero */}
            <LiveClock />

            {/* Visitor analytics HUD — top-right */}
            <VisitorHUD />

            {/* Main landing column — hero, icon grid, featured projects */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-16 sm:pt-20 md:pt-24 pb-32 gap-10 sm:gap-12 md:gap-14">
                <DesktopHero />

                {/* Quick stats — recruiter-focused at-a-glance numbers */}
                <QuickStats />

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
            </div>

            {/* Live GitHub presence */}
            <GitHubPresence />

            {/* Windows layer */}
            <div className="fixed inset-0 z-30 pointer-events-none">
                <WindowManager />
            </div>

            {/* Window particle effects */}
            <Suspense fallback={null}>
                <WindowParticles />
            </Suspense>

            {/* Click ripple rings */}
            <Suspense fallback={null}>
                <ClickRipple />
            </Suspense>

            {/* Command palette overlay */}
            <CommandPalette apps={APP_LAUNCHER} />

            {/* Notification toasts */}
            <NotificationLayer />

            {/* Achievement toasts */}
            <AchievementToast />

            {/* Konami code easter egg */}
            <Suspense fallback={null}>
                <KonamiCode />
            </Suspense>

            {/* Desktop right-click context menu */}
            <ContextMenu />

            {/* Taskbar */}
            <Taskbar />

            {/* Atmosphere overlays */}
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] z-40" />
            <div className="fixed inset-0 pointer-events-none opacity-[var(--scanline-opacity)] z-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />

            {/* Screensaver — activates after 30s idle */}
            <Suspense fallback={null}>
                <Screensaver />
            </Suspense>

            {/* CRT shutdown when leaving tab */}
            <Suspense fallback={null}>
                <CRTShutdown />
            </Suspense>
        </div>
    );
};

export default Desktop;
