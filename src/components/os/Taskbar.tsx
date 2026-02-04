import React, { useState, useEffect } from 'react';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';
import { Wifi, Battery, Menu, X, Grid3X3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const Taskbar: React.FC = () => {
    const { windows, activeWindowId, focusWindow, openWindow, minimizeWindow } = useOS();
    const { playSound } = useSound();
    const [time, setTime] = useState(new Date());
    const [menuOpen, setMenuOpen] = useState(false);
    const isMobile = useIsMobile();

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Get dock apps (all registered windows)
    const dockApps = Object.values(windows);

    const handleDockClick = (id: string) => {
        playSound('click');
        setMenuOpen(false);
        const win = windows[id];
        if (win.isOpen) {
            if (win.isMinimized || activeWindowId !== id) {
                focusWindow(id);
            } else {
                minimizeWindow(id);
            }
        } else {
            openWindow(id);
        }
    };

    const toggleMenu = () => {
        playSound('click');
        setMenuOpen(!menuOpen);
    };

    // Mobile: Show bottom nav with more button
    if (isMobile) {
        return (
            <>
                {/* App Launcher Menu (Mobile) */}
                <AnimatePresence>
                    {menuOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 100 }}
                            className="fixed inset-0 z-40 bg-black/90 backdrop-blur-xl p-6 pt-12"
                        >
                            <button
                                onClick={toggleMenu}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-white/60 text-sm uppercase tracking-widest mb-6">All Apps</h2>

                            <div className="grid grid-cols-4 gap-4">
                                {dockApps.map(app => (
                                    <button
                                        key={app.id}
                                        onClick={() => handleDockClick(app.id)}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-all"
                                    >
                                        <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center text-accent text-2xl">
                                            {app.icon}
                                        </div>
                                        <span className="text-xs text-white/70 text-center truncate w-full">
                                            {app.title.split(' ')[0]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Bottom Nav */}
                <div className="fixed bottom-0 left-0 right-0 z-50">
                    <div className="bg-black/80 backdrop-blur-xl border-t border-white/10 px-2 py-2 safe-area-pb">
                        <div className="flex justify-around items-center">
                            {dockApps.slice(0, 4).map(app => (
                                <button
                                    key={app.id}
                                    onClick={() => handleDockClick(app.id)}
                                    className={`flex flex-col items-center gap-1 p-2 rounded-xl min-w-[56px] transition-all
                                        ${activeWindowId === app.id || app.isOpen ? 'bg-accent/10' : 'hover:bg-white/5'}
                                    `}
                                >
                                    <div className={`text-xl ${activeWindowId === app.id ? 'text-accent' : app.isOpen ? 'text-accent/60' : 'text-white/60'}`}>
                                        {app.icon}
                                    </div>
                                    <span className={`text-[10px] ${activeWindowId === app.id ? 'text-accent' : 'text-white/40'}`}>
                                        {app.title.split(' ')[0]}
                                    </span>
                                </button>
                            ))}

                            {/* More Apps Button */}
                            <button
                                onClick={toggleMenu}
                                className="flex flex-col items-center gap-1 p-2 rounded-xl min-w-[56px] hover:bg-white/5 transition-all"
                            >
                                <div className="text-xl text-white/60">
                                    <Grid3X3 size={20} />
                                </div>
                                <span className="text-[10px] text-white/40">More</span>
                            </button>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Desktop: Original dock layout with working menu
    return (
        <>
            {/* App Launcher Menu (Desktop) */}
            <AnimatePresence>
                {menuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMenuOpen(false)}
                            className="fixed inset-0 z-40"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20, scale: 0.95 }}
                            className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 w-96 max-w-[90vw] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl"
                        >
                            <h2 className="text-white/60 text-xs uppercase tracking-widest mb-4 px-2">All Applications</h2>

                            <div className="grid grid-cols-4 gap-2">
                                {dockApps.map(app => (
                                    <button
                                        key={app.id}
                                        onClick={() => handleDockClick(app.id)}
                                        onMouseEnter={() => playSound('hover')}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-white/10 transition-all group"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-accent group-hover:scale-110 group-hover:border-accent/30 transition-all">
                                            {app.icon}
                                        </div>
                                        <span className="text-[10px] text-white/70 text-center truncate w-full">
                                            {app.title.split(' ')[0]}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Desktop Taskbar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-end pb-2 pointer-events-none">
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, type: "spring", damping: 20 }}
                    className="pointer-events-auto flex items-center gap-1 px-3 py-2 bg-black/60 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl"
                >
                    {/* Start Menu Button */}
                    <button
                        onClick={toggleMenu}
                        onMouseEnter={() => playSound('hover')}
                        className={`p-2 rounded-xl transition-colors ${menuOpen ? 'bg-accent/20 text-accent' : 'hover:bg-white/10 text-accent'}`}
                    >
                        <Menu size={20} />
                    </button>

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    {/* Dock Icons */}
                    <div className="flex items-center gap-1">
                        {dockApps.map((app) => (
                            <DockIcon
                                key={app.id}
                                icon={app.icon}
                                title={app.title}
                                isOpen={app.isOpen}
                                isActive={activeWindowId === app.id}
                                onClick={() => handleDockClick(app.id)}
                            />
                        ))}
                    </div>

                    <div className="w-px h-6 bg-white/10 mx-1" />

                    {/* System Tray */}
                    <div className="flex items-center gap-2 px-2">
                        <Wifi size={14} className="text-white/50" />
                        <Battery size={14} className="text-white/50" />
                        <div className="text-xs text-white/70 font-mono tracking-wider">
                            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
};

// Dock Icon Component
function DockIcon({ icon, title, isOpen, isActive, onClick }: {
    icon: React.ReactNode,
    title: string,
    isOpen: boolean,
    isActive: boolean,
    onClick: () => void
}) {
    const { playSound } = useSound();

    return (
        <motion.button
            layout
            onClick={onClick}
            onMouseEnter={() => playSound('hover')}
            whileHover={{
                scale: 1.2,
                y: -5,
                transition: { type: "spring", damping: 10, stiffness: 300 }
            }}
            whileTap={{ scale: 0.9 }}
            className={`
                relative w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-xl
                transition-colors duration-200 group
                ${isActive ? 'bg-white/10 border-accent/30' : 'bg-transparent hover:bg-white/5 border-transparent'}
                border
            `}
        >
            <div className={`
                text-2xl sm:text-3xl transition-all duration-300
                ${isActive ? 'text-accent drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.6)]' : 'text-white/70 group-hover:text-white'}
            `}>
                {icon}
            </div>

            {/* Active Dot */}
            {isOpen && (
                <motion.div
                    layoutId={`dot-${title}`}
                    className={`
                        absolute -bottom-1 w-1 h-1 rounded-full
                        ${isActive ? 'bg-accent shadow-[0_0_5px_var(--accent)]' : 'bg-white/30'}
                    `}
                />
            )}

            {/* Tooltip */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap backdrop-blur-sm z-50">
                {title}
            </div>

            {/* Glow on Hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.button>
    );
}

export default Taskbar;
