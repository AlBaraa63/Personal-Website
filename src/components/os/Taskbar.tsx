import React, { useState, useEffect } from 'react';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';
import { Wifi, WifiOff, Battery, BatteryCharging, BatteryLow, Grid3X3, X, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { APP_LAUNCHER, SECONDARY_APPS } from './Desktop';
import { useSystemTray } from './useSystemTray';

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

const Taskbar: React.FC = () => {
    const { windows, activeWindowId, focusWindow, openWindow, minimizeWindow } = useOS();
    const { playSound } = useSound();
    const [time, setTime] = useState(new Date());
    const [drawerOpen, setDrawerOpen] = useState(false);
    const isMobile = useIsMobile();
    const tray = useSystemTray();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Only open windows show on desktop taskbar — this is the "real OS" behavior.
    const openApps = Object.values(windows).filter(w => w.isOpen);

    const handleAppClick = (id: string) => {
        playSound('click');
        const win = windows[id];
        if (!win) return;
        if (win.isOpen && !win.isMinimized && activeWindowId === id) {
            // Click active app to minimize
            minimizeWindow(id);
        } else if (win.isOpen) {
            focusWindow(id);
        } else {
            openWindow(id);
        }
    };

    const handleLaunchFromDrawer = (id: string) => {
        playSound('click');
        playSound('open');
        setDrawerOpen(false);
        const win = windows[id];
        if (win?.isOpen) {
            focusWindow(id);
        } else {
            openWindow(id);
        }
    };

    const timeStr = time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

    if (isMobile) {
        return (
            <>
                {/* Full-screen app drawer */}
                <AnimatePresence>
                    {drawerOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col p-5 pt-10 font-mono overflow-y-auto"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-2">
                                <div>
                                    <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-faint)]">// holo-os · launcher</div>
                                    <h2 className="text-[var(--text-primary)] text-base font-bold uppercase tracking-[0.2em]">All Applications</h2>
                                </div>
                                <button
                                    onClick={() => setDrawerOpen(false)}
                                    aria-label="Close launcher"
                                    className="p-2 border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-accent hover:text-accent transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Status counter */}
                            <div className="text-[10px] text-[var(--text-faint)] uppercase tracking-widest mb-6">
                                {openApps.length === 0
                                    ? 'No active windows · select an app to launch'
                                    : `${openApps.length} active window${openApps.length === 1 ? '' : 's'}`}
                            </div>

                            {/* Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {APP_LAUNCHER.map((app, idx) => {
                                    const win = windows[app.id];
                                    const isOpen = !!win?.isOpen;
                                    const isActive = activeWindowId === app.id && isOpen;
                                    return (
                                        <motion.button
                                            key={app.id}
                                            onClick={() => handleLaunchFromDrawer(app.id)}
                                            aria-pressed={isActive}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.035, duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
                                            className="relative flex items-center gap-4 px-4 py-3 text-left transition-colors border"
                                            style={{
                                                borderColor: isActive ? 'var(--accent)' : 'var(--border)',
                                                backgroundColor: isActive ? 'rgba(var(--accent-rgb), 0.08)' : 'var(--surface)',
                                            }}
                                        >
                                            {isActive && (
                                                <>
                                                    <span aria-hidden className="absolute -top-px -left-px w-2 h-2 border-t border-l border-accent" />
                                                    <span aria-hidden className="absolute -top-px -right-px w-2 h-2 border-t border-r border-accent" />
                                                    <span aria-hidden className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-accent" />
                                                    <span aria-hidden className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-accent" />
                                                </>
                                            )}

                                            <div className={`w-12 h-12 flex items-center justify-center border flex-shrink-0
                                                ${isActive ? 'border-accent text-accent bg-[rgba(var(--accent-rgb),0.12)]' :
                                                    isOpen ? 'border-[var(--border-strong)] text-[var(--text-primary)]' :
                                                        'border-[var(--border)] text-[var(--text-muted)]'}
                                            `}>
                                                {app.icon}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className={`text-sm font-bold uppercase tracking-wider truncate
                                                    ${isActive ? 'text-accent' : 'text-[var(--text-primary)]'}
                                                `}>
                                                    {app.label}
                                                </div>
                                                {app.subtitle && (
                                                    <div className="text-[10px] uppercase tracking-widest text-[var(--text-faint)] truncate">
                                                        {app.subtitle}
                                                    </div>
                                                )}
                                            </div>

                                            {isOpen && (
                                                <span className={`text-[9px] font-mono uppercase tracking-widest px-1.5 py-0.5 border flex-shrink-0
                                                    ${isActive ? 'border-accent text-accent' : 'border-[var(--border)] text-[var(--text-muted)]'}
                                                `}>
                                                    {isActive ? 'Active' : 'Open'}
                                                </span>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* Footer */}
                            <div className="mt-6 text-center text-[10px] text-[var(--text-faint)] uppercase tracking-widest">
                                Tap any app to launch · {APP_LAUNCHER.length} total
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile bottom bar — hamburger + clock only, per brief */}
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-[var(--surface)]/90 backdrop-blur-md border-t border-[var(--border)]">
                    <div className="flex items-center justify-between px-4 h-14 font-mono">
                        <Link
                            to="/resume"
                            onClick={() => playSound('click')}
                            aria-label="Recruiter View — clean resume"
                            className="flex items-center justify-center w-10 h-10 rounded border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-accent hover:text-accent transition-colors"
                        >
                            <FileText size={18} />
                        </Link>
                        <button
                            onClick={() => {
                                playSound('click');
                                setDrawerOpen(true);
                            }}
                            aria-label="Open application launcher"
                            className="flex items-center gap-2 px-4 py-2 rounded border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-accent hover:text-accent transition-colors"
                        >
                            <Grid3X3 size={18} />
                            <span className="text-[10px] uppercase tracking-[0.2em]">Apps</span>
                        </button>
                        <div className="text-xs text-[var(--text-muted)] tabular-nums tracking-wider w-10 text-right">
                            {timeStr}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Desktop taskbar — utility launcher + open windows + system tray
    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-end pb-3 pointer-events-none">
            <motion.div
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring', damping: 24 }}
                className="pointer-events-auto flex items-center gap-3 px-3 py-2 bg-[var(--surface)]/85 backdrop-blur-xl border border-[var(--border)] rounded font-mono"
                style={{ minWidth: 280 }}
            >
                {/* Utility launcher — quick-launch icons on the left */}
                <div className="flex items-center gap-1">
                    {SECONDARY_APPS.map(app => {
                        const win = windows[app.id];
                        const isOpen = !!win?.isOpen;
                        const isActive = activeWindowId === app.id && isOpen;
                        return (
                            <button
                                key={app.id}
                                onClick={() => handleAppClick(app.id)}
                                onMouseEnter={() => playSound('hover')}
                                aria-pressed={isActive}
                                aria-label={app.label}
                                title={app.label}
                                className={`
                                    relative w-9 h-9 flex items-center justify-center transition-colors group
                                    ${isActive
                                        ? 'text-accent'
                                        : isOpen
                                            ? 'text-[var(--text-primary)] hover:text-accent'
                                            : 'text-[var(--text-muted)] hover:text-accent'}
                                `}
                            >
                                {app.icon}
                                {/* Active underline */}
                                <span
                                    className={`absolute -bottom-[2px] left-1/2 -translate-x-1/2 h-[2px] transition-all
                                        ${isActive ? 'w-5 bg-accent shadow-[0_0_6px_var(--accent)]' : isOpen ? 'w-1 bg-[var(--text-faint)]' : 'w-0'}
                                    `}
                                />
                                {/* Tooltip */}
                                <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--surface-raised)] border border-[var(--border)] text-[9px] uppercase tracking-widest text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                    {app.label}
                                </span>
                            </button>
                        );
                    })}

                    {/* Recruiter View — navigates to the clean /resume page */}
                    <Link
                        to="/resume"
                        onMouseEnter={() => playSound('hover')}
                        onClick={() => playSound('click')}
                        aria-label="Recruiter View — clean resume"
                        title="Recruiter View"
                        className="group relative ml-1 flex items-center gap-1.5 h-9 px-2.5 border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-accent hover:text-accent transition-colors"
                    >
                        <FileText size={15} />
                        <span className="text-[9px] uppercase tracking-[0.18em] hidden lg:inline">Résumé</span>
                        {/* Tooltip */}
                        <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 bg-[var(--surface-raised)] border border-[var(--border)] text-[9px] uppercase tracking-widest text-[var(--text-primary)] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Recruiter View
                        </span>
                    </Link>
                </div>

                <div className="w-px h-6 bg-[var(--border)]" />

                {/* Open apps list */}
                <div className="flex items-center gap-1 min-h-[36px]">
                    {openApps.length === 0 ? (
                        <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-faint)] px-2">
                            No active windows
                        </span>
                    ) : (
                        openApps.map(app => {
                            const isActive = activeWindowId === app.id && !app.isMinimized;
                            return (
                                <OpenAppChip
                                    key={app.id}
                                    icon={app.icon}
                                    title={app.title}
                                    isActive={isActive}
                                    isMinimized={app.isMinimized}
                                    onClick={() => handleAppClick(app.id)}
                                />
                            );
                        })
                    )}
                </div>

                <div className="w-px h-6 bg-[var(--border)]" />

                {/* System tray — real data, not cosmetic */}
                <div className="flex items-center gap-3 px-2 text-[var(--text-muted)]">
                    <div
                        title={tray.online ? 'Online' : 'Offline'}
                        className={tray.online ? '' : 'text-red-400'}
                    >
                        {tray.online ? <Wifi size={13} /> : <WifiOff size={13} />}
                    </div>
                    {tray.hasBattery && tray.batteryLevel !== null && (
                        <div
                            title={`Battery ${Math.round(tray.batteryLevel * 100)}%${tray.charging ? ' (charging)' : ''}`}
                            className={`flex items-center gap-1 ${tray.batteryLevel < 0.2 && !tray.charging ? 'text-red-400' : ''}`}
                        >
                            {tray.charging
                                ? <BatteryCharging size={13} className="text-accent" />
                                : tray.batteryLevel < 0.2
                                    ? <BatteryLow size={13} />
                                    : <Battery size={13} />
                            }
                            <span className="text-[10px] tabular-nums">{Math.round(tray.batteryLevel * 100)}</span>
                        </div>
                    )}
                    <div className="text-[11px] tabular-nums tracking-wider">{timeStr}</div>
                </div>
            </motion.div>
        </div>
    );
};

interface OpenAppChipProps {
    icon: React.ReactNode;
    title: string;
    isActive: boolean;
    isMinimized: boolean;
    onClick: () => void;
}

const OpenAppChip: React.FC<OpenAppChipProps> = ({ icon, title, isActive, isMinimized, onClick }) => {
    const { playSound } = useSound();
    return (
        <motion.button
            onClick={onClick}
            onMouseEnter={() => playSound('hover')}
            whileTap={{ scale: 0.94 }}
            aria-pressed={isActive}
            className={`
                relative flex items-center justify-center w-9 h-9 rounded transition-colors group
                ${isActive
                    ? 'bg-[rgba(var(--accent-rgb),0.15)] text-accent'
                    : isMinimized
                        ? 'text-[var(--text-faint)] hover:text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-raised)]'}
            `}
        >
            {icon}

            {/* Active underline */}
            <span
                className={`absolute -bottom-[2px] left-1/2 -translate-x-1/2 h-[2px] transition-all
                    ${isActive ? 'w-5 bg-accent shadow-[0_0_6px_var(--accent)]' : 'w-1 bg-[var(--text-faint)]'}
                `}
            />

            {/* Tooltip */}
            <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[var(--surface-raised)] border border-[var(--border)] text-[var(--text-primary)] text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap uppercase tracking-wider">
                {title}
            </div>
        </motion.button>
    );
};

export default Taskbar;
