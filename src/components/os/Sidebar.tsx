import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, MotionValue } from 'framer-motion';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';

export interface SidebarApp {
    id: string;
    label: string;
    icon: React.ReactNode;
    subtitle?: string;
}

interface SidebarProps {
    apps: SidebarApp[];
}

const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');
const MOD = isMac ? '⌘' : 'Ctrl';

// Mac-dock physics knobs
const ICON_REST = 44;
const ICON_PEAK = 64;
const MAGNIFY_RANGE = 110;

const Sidebar: React.FC<SidebarProps> = ({ apps }) => {
    const { windows, activeWindowId, openWindow, focusWindow } = useOS();
    const { playSound } = useSound();
    const containerRef = useRef<HTMLElement>(null);
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    // Track the pointer's Y position relative to the sidebar so each icon can
    // compute its own magnification from distance. Negative infinity means
    // "cursor not in sidebar" — icons stay at rest size.
    const mouseY = useMotionValue<number>(-Infinity);

    const handleClick = (id: string) => {
        playSound('click');
        const win = windows[id];
        if (win?.isOpen) {
            focusWindow(id);
        } else {
            playSound('open');
            openWindow(id);
        }
    };

    return (
        <aside
            ref={containerRef}
            aria-label="Application launcher"
            onMouseMove={(e) => mouseY.set(e.clientY)}
            onMouseLeave={() => mouseY.set(-Infinity)}
            className="hidden md:flex fixed right-3 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-1.5 px-2 py-3 pointer-events-auto
                       bg-[var(--surface)]/85 backdrop-blur-md border border-[var(--border)]"
        >
            {/* Top + bottom HUD brackets — mark the launcher as a single panel */}
            <span aria-hidden className="absolute -top-px -left-px w-3 h-3 border-t-2 border-l-2 border-accent" />
            <span aria-hidden className="absolute -top-px -right-px w-3 h-3 border-t-2 border-r-2 border-accent" />
            <span aria-hidden className="absolute -bottom-px -left-px w-3 h-3 border-b-2 border-l-2 border-accent" />
            <span aria-hidden className="absolute -bottom-px -right-px w-3 h-3 border-b-2 border-r-2 border-accent" />

            {apps.map((app, idx) => {
                const win = windows[app.id];
                const isOpen = !!win?.isOpen;
                const isActive = activeWindowId === app.id && isOpen;
                const shortcut = idx < 9 ? `${MOD}${idx + 1}` : undefined;

                return (
                    <SidebarIcon
                        key={app.id}
                        app={app}
                        isOpen={isOpen}
                        isActive={isActive}
                        mouseY={mouseY}
                        shortcut={shortcut}
                        showTooltip={hoveredId === app.id}
                        onHover={(hovered) => {
                            setHoveredId(hovered ? app.id : null);
                            if (hovered) playSound('hover');
                        }}
                        onClick={() => handleClick(app.id)}
                    />
                );
            })}
        </aside>
    );
};

interface SidebarIconProps {
    app: SidebarApp;
    isOpen: boolean;
    isActive: boolean;
    mouseY: MotionValue<number>;
    shortcut?: string;
    showTooltip: boolean;
    onHover: (hovered: boolean) => void;
    onClick: () => void;
}

const SidebarIcon: React.FC<SidebarIconProps> = ({
    app, isOpen, isActive, mouseY, shortcut, showTooltip, onHover, onClick,
}) => {
    const ref = useRef<HTMLButtonElement>(null);

    // Per-icon magnification: scale up as the cursor approaches, smoothed by spring.
    const distance = useTransform(mouseY, (val: number) => {
        const rect = ref.current?.getBoundingClientRect();
        const center = rect ? rect.top + rect.height / 2 : 0;
        return val === -Infinity ? Infinity : Math.abs(val - center);
    });
    const sizeRaw = useTransform(distance, [0, MAGNIFY_RANGE], [ICON_PEAK, ICON_REST]);
    const size = useSpring(sizeRaw, { mass: 0.1, stiffness: 320, damping: 22 });

    return (
        <button
            ref={ref}
            onClick={onClick}
            onMouseEnter={() => onHover(true)}
            onMouseLeave={() => onHover(false)}
            aria-pressed={isActive}
            aria-label={`${app.label}${shortcut ? ` (${shortcut})` : ''}${isActive ? ' active' : isOpen ? ' open' : ''}`}
            className="group relative flex items-center justify-center"
            style={{ height: ICON_PEAK }}
        >
            {/* Active edge marker — animated with framer's shared layout */}
            {isOpen && (
                <motion.span
                    layoutId="sidebar-active-marker"
                    className={`absolute -left-3 top-1/2 -translate-y-1/2 w-[2px] h-7 ${isActive ? 'bg-accent' : 'bg-[var(--text-faint)]'}`}
                    transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                    style={isActive ? { boxShadow: '0 0 10px var(--accent)' } : undefined}
                />
            )}

            {/* The icon tile — size is a motion value reacting to cursor distance */}
            <motion.div
                style={{ width: size, height: size }}
                className={`relative flex items-center justify-center border transition-colors
                    ${isActive
                        ? 'bg-[rgba(var(--accent-rgb),0.18)] border-accent text-accent'
                        : isOpen
                            ? 'bg-[var(--surface-raised)] border-[var(--border-strong)] text-[var(--text-primary)] group-hover:border-accent group-hover:text-accent'
                            : 'bg-[var(--surface-inset)] border-[var(--border)] text-[var(--text-muted)] group-hover:border-[var(--border-strong)] group-hover:text-[var(--text-primary)]'}
                `}
            >
                {/* HUD corner brackets on the active icon */}
                {isActive && (
                    <>
                        <span aria-hidden className="absolute -top-px -left-px w-2 h-2 border-t border-l border-accent" />
                        <span aria-hidden className="absolute -top-px -right-px w-2 h-2 border-t border-r border-accent" />
                        <span aria-hidden className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-accent" />
                        <span aria-hidden className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-accent" />
                    </>
                )}

                {/* Subtle glow pulse behind the active icon */}
                {isActive && (
                    <motion.span
                        aria-hidden
                        className="absolute inset-0 -z-10"
                        animate={{ opacity: [0.25, 0.6, 0.25] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ boxShadow: '0 0 22px var(--accent)' }}
                    />
                )}

                {app.icon}

                {/* Open-but-not-active dot, bottom-right */}
                {isOpen && !isActive && (
                    <span aria-hidden className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-accent" />
                )}
            </motion.div>

            {/* Floating tooltip card — appears to the left, premium glass treatment */}
            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, x: 8, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 8, scale: 0.96 }}
                        transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute right-full mr-4 top-1/2 -translate-y-1/2 pointer-events-none
                                   bg-[var(--surface)]/95 backdrop-blur-md border border-accent
                                   px-3 py-2 min-w-[200px] z-50"
                        role="tooltip"
                    >
                        {/* HUD corner brackets on the tooltip */}
                        <span aria-hidden className="absolute -top-px -left-px w-2 h-2 border-t border-l border-accent" />
                        <span aria-hidden className="absolute -top-px -right-px w-2 h-2 border-t border-r border-accent" />
                        <span aria-hidden className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-accent" />
                        <span aria-hidden className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-accent" />

                        {/* Pointer triangle */}
                        <span
                            aria-hidden
                            className="absolute right-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px]"
                            style={{ borderLeftColor: 'var(--accent)' }}
                        />

                        <div className="flex items-center justify-between gap-3">
                            <span className="text-sm font-bold tracking-wider uppercase text-[var(--text-primary)] font-mono">
                                {app.label}
                            </span>
                            {shortcut && (
                                <kbd className="text-[10px] font-mono uppercase tracking-widest px-1.5 py-0.5 border border-[var(--border-strong)] text-[var(--text-muted)]">
                                    {shortcut}
                                </kbd>
                            )}
                        </div>
                        {app.subtitle && (
                            <div className="text-[10px] mt-1 text-[var(--text-faint)] uppercase tracking-widest font-mono">
                                {app.subtitle}
                            </div>
                        )}
                        <div className="text-[10px] mt-1 font-mono text-accent uppercase tracking-widest">
                            {isActive ? '· focused' : isOpen ? '· running' : '· idle'}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
};

export default Sidebar;
