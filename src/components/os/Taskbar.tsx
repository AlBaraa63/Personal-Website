import React, { useState, useEffect, useRef } from 'react';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';
import { Wifi, Battery, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Taskbar: React.FC = () => {
    const { windows, activeWindowId, focusWindow, openWindow, minimizeWindow } = useOS();
    const { playSound } = useSound();
    const [time, setTime] = useState(new Date());
    const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAppClick = (id: string, isOpen: boolean, isMinimized: boolean, isActive: boolean) => {
        playSound('click');
        if (!isOpen) {
            playSound('open');
            openWindow(id);
        } else if (isMinimized) {
            playSound('open');
            focusWindow(id);
        } else if (isActive) {
            playSound('minimize');
            minimizeWindow(id);
        } else {
            playSound('click');
            focusWindow(id);
        }
    };

    const handleStartMenuApp = (id: string) => {
        playSound('click');
        playSound('open');
        openWindow(id);
        setIsStartMenuOpen(false);
    };

    return (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center pointer-events-none">

            {/* Start Menu */}
            <AnimatePresence>
                {isStartMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mb-4 pointer-events-auto glass-panel rounded-2xl border border-white/10 p-6 w-80 backdrop-blur-2xl bg-black/80 shadow-2xl"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                            <h3 className="text-sm font-bold text-white tracking-widest uppercase">All Apps</h3>
                            <button
                                onClick={() => {
                                    playSound('click');
                                    setIsStartMenuOpen(false);
                                }}
                                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X size={16} className="text-white/50" />
                            </button>
                        </div>


                        {/* Apps Grid */}
                        <div className="grid grid-cols-4 gap-3">
                            {Object.values(windows).map((win) => (
                                <motion.button
                                    key={win.id}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => handleStartMenuApp(win.id)}
                                    onMouseEnter={() => playSound('hover')}
                                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-colors group"
                                >
                                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-white/5 border border-white/10 group-hover:border-accent/30 group-hover:bg-accent/10 transition-all text-accent">
                                        {win.icon}
                                    </div>
                                    <span className="text-[10px] text-white/60 group-hover:text-white truncate max-w-full transition-colors">
                                        {win.title.split(' ')[0]}
                                    </span>
                                </motion.button>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="mt-4 pt-3 border-t border-white/10 text-center">
                            <span className="text-[10px] text-white/30 tracking-widest uppercase">Holo-OS v5.0.0</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Dock Container */}
            <div className="glass-panel px-4 py-2 rounded-2xl border border-white/10 flex items-center gap-4 pointer-events-auto shadow-2xl backdrop-blur-2xl bg-black/40">

                {/* Start / Menu */}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                        playSound('click');
                        setIsStartMenuOpen(!isStartMenuOpen);
                    }}
                    className={`p-2.5 rounded-xl border transition-colors group relative
                        ${isStartMenuOpen
                            ? 'bg-accent/20 border-accent/50 text-accent'
                            : 'bg-white/5 hover:bg-white/10 border-white/5 hover:border-accent/30'}`}
                >
                    <Menu size={20} className={`transition-colors ${isStartMenuOpen ? 'text-accent' : 'text-white group-hover:text-accent'}`} />
                </motion.button>

                <div className="w-[1px] h-8 bg-white/10" />

                {/* Icons Dock area */}
                <div className="flex items-end gap-2">
                    {Object.values(windows).map((win) => (
                        <DockIcon
                            key={win.id}
                            icon={win.icon}
                            title={win.title}
                            isOpen={win.isOpen}
                            isActive={win.id === activeWindowId && !win.isMinimized}
                            onClick={() => handleAppClick(win.id, win.isOpen, win.isMinimized, win.id === activeWindowId && !win.isMinimized)}
                        />
                    ))}
                </div>

                <div className="w-[1px] h-8 bg-white/10" />

                {/* System Tray (Mini) */}
                <div className="flex items-center gap-3 pl-2 pr-2">
                    <div className="flex flex-col items-end">
                        <span className="text-xs font-bold text-white leading-none">
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-[10px] text-white/50 leading-none mt-0.5">
                            {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                        </span>
                    </div>
                    <div className="flex gap-2 text-white/60">
                        <Wifi size={14} />
                        <Battery size={14} />
                    </div>
                </div>

            </div>
        </div>
    );
};

// Isolated Dock Icon Component for Magnetic Effect
function DockIcon({ icon, title, isOpen, isActive, onClick }: {
    icon: React.ReactNode,
    title: string,
    isOpen: boolean,
    isActive: boolean,
    onClick: () => void
}) {
    const ref = useRef<HTMLButtonElement>(null);
    const { playSound } = useSound();

    // Hover state is managed by CSS/Framer mostly, but could enhance with mouse position tracking
    // For simplicity and performance, we'll use framer's layout animations

    return (
        <motion.button
            ref={ref}
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

            {/* Reflection/Glow on Hover */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </motion.button>
    );
}

export default Taskbar;
