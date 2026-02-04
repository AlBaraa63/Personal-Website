import React from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';

interface WindowProps {
    id: string;
}

const Window: React.FC<WindowProps> = ({ id }) => {
    const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow, activeWindowId } = useOS();
    const { playSound } = useSound();
    const windowState = windows[id];
    const dragControls = useDragControls(); // Initialize drag controls

    if (!windowState || !windowState.isOpen) return null;

    const isActive = activeWindowId === id;

    return (
        <AnimatePresence>
            {!windowState.isMinimized && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50, filter: 'blur(10px)' }}
                    animate={{
                        scale: windowState.isMaximized ? 1 : 1,
                        opacity: 1,
                        y: 0,
                        x: windowState.isMaximized ? 0 : undefined,
                        width: windowState.isMaximized ? '100vw' : undefined,
                        height: windowState.isMaximized ? 'calc(100vh - 48px)' : undefined,
                        top: windowState.isMaximized ? 0 : undefined,
                        left: windowState.isMaximized ? 0 : undefined,
                        borderRadius: windowState.isMaximized ? 0 : 16,
                        filter: 'blur(0px)',
                    }}
                    exit={{
                        scale: 0.1,
                        opacity: 0,
                        y: window.innerHeight, // Fly to bottom
                        x: 0, // Ideally this would target the specific icon position, but centering is a good approximation
                        filter: 'blur(20px)',
                        transition: { duration: 0.5, ease: [0.68, -0.55, 0.265, 1.55] } // Anticpate/Overshoot ease
                    }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className={`absolute flex flex-col overflow-hidden glass-panel shadow-2xl backdrop-blur-xl origin-bottom pointer-events-auto
            ${isActive ? 'border-accent/60 ring-1 ring-accent/40 shadow-[0_0_50px_rgba(var(--accent-rgb),0.3)]' : 'border-white/10'}
          `}
                    style={{
                        zIndex: windowState.zIndex,
                        width: windowState.isMaximized ? '100%' : (windowState.size?.width || 800),
                        height: windowState.isMaximized ? '100%' : (windowState.size?.height || 600),
                        boxShadow: isActive
                            ? '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(var(--accent-rgb), 0.1)'
                            : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                    }}
                    drag={!windowState.isMaximized}
                    dragControls={dragControls} // Use manual controls
                    dragListener={false} // Disable auto-drag on content
                    dragConstraints={{ left: 0, top: 0, right: window.innerWidth - 100, bottom: window.innerHeight - 100 }}
                    dragMomentum={false}
                    onDragStart={() => {
                        focusWindow(id);
                    }}
                    onClick={() => {
                        focusWindow(id);
                    }}
                >
                    {/* Window Title Bar - Acts as Drag Handle */}
                    <div
                        className={`flex items-center justify-between px-4 py-3 select-none cursor-default
              ${isActive ? 'bg-white/5' : 'bg-transparent'}
              border-b border-white/5 touch-none
            `}
                        onPointerDown={(e) => {
                            // Start dragging only if not maximized and not clicking buttons
                            if (!windowState.isMaximized) {
                                // We rely on stopPropagation in buttons, so here we just start
                                dragControls.start(e);
                                focusWindow(id);
                            }
                        }}
                        onDoubleClick={() => maximizeWindow(id)}
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-accent opacity-80">{windowState.icon}</div>
                            <span className={`text-sm font-medium tracking-wide ${isActive ? 'text-white' : 'text-white/60'}`}>
                                {windowState.title}
                            </span>
                        </div>

                        {/* Window Controls */}
                        <div
                            className="flex items-center gap-2"
                            onPointerDown={(e) => e.stopPropagation()}
                            onDoubleClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    playSound('minimize');
                                    minimizeWindow(id);
                                }}
                                className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            >
                                <Minus size={14} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    playSound('click');
                                    maximizeWindow(id);
                                }}
                                className="p-1.5 rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                            >
                                {windowState.isMaximized ? <Square size={12} /> : <Maximize2 size={12} />}
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    playSound('close');
                                    closeWindow(id);
                                }}
                                className="p-1.5 rounded-full hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    </div>

                    {/* Window Content */}
                    <div className="flex-1 overflow-auto custom-scrollbar relative bg-black/20">
                        {windowState.component}

                        {/* Interaction Blocker overlay when not active to prevent iframe stealing clicks etc */}
                        {!isActive && (
                            <div className="absolute inset-0 z-10" />
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Window;
