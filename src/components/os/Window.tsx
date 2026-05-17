import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useDragControls, PanInfo } from 'framer-motion';
import { X, Minus, Square, Maximize2 } from 'lucide-react';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';

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

interface WindowProps {
    id: string;
}

type DragSnapPreview = 'left' | 'right' | 'top' | null;

// How close the cursor needs to be to a viewport edge during drag to trigger snap.
const SNAP_EDGE_THRESHOLD = 24;

const Window: React.FC<WindowProps> = ({ id }) => {
    const { windows, closeWindow, minimizeWindow, maximizeWindow, focusWindow, updateWindowPosition, snapWindow, activeWindowId } = useOS();
    const { playSound } = useSound();
    const windowState = windows[id];
    const dragControls = useDragControls();
    const isMobile = useIsMobile();
    const [snapPreview, setSnapPreview] = useState<DragSnapPreview>(null);

    if (!windowState || !windowState.isOpen) return null;

    const isActive = activeWindowId === id;
    const effectiveMaximized = isMobile || windowState.isMaximized;
    const isSnapped = !!windowState.snap;

    const savedX = windowState.position?.x ?? 0;
    const savedY = windowState.position?.y ?? 0;

    // Compute the live target dimensions for this window's current display mode.
    // Returns a framer-motion animate target — allows x/y motion-value keys
    // alongside standard CSS keys.
    const computeAnimateTarget = (): Record<string, string | number> => {
        if (effectiveMaximized) {
            return { x: 0, y: 0, top: 0, left: 0, width: '100vw', height: 'calc(100vh - 64px)', borderRadius: 0 };
        }
        if (windowState.snap === 'left') {
            return { x: 0, y: 0, top: 0, left: 0, width: '50vw', height: 'calc(100vh - 64px)', borderRadius: 0 };
        }
        if (windowState.snap === 'right') {
            return { x: 0, y: 0, top: 0, left: '50vw', width: '50vw', height: 'calc(100vh - 64px)', borderRadius: 0 };
        }
        return {
            x: savedX,
            y: savedY,
            top: 80,
            left: 80,
            width: windowState.size?.width || 800,
            height: windowState.size?.height || 600,
            borderRadius: 4,
        };
    };

    const detectSnapZone = (point: { x: number; y: number }): DragSnapPreview => {
        if (point.y < SNAP_EDGE_THRESHOLD) return 'top';
        if (point.x < SNAP_EDGE_THRESHOLD) return 'left';
        if (point.x > window.innerWidth - SNAP_EDGE_THRESHOLD) return 'right';
        return null;
    };

    const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (effectiveMaximized) return;
        const zone = detectSnapZone(info.point);
        setSnapPreview(prev => (prev === zone ? prev : zone));
    };

    const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        if (effectiveMaximized) return;
        const zone = detectSnapZone(info.point);
        setSnapPreview(null);
        if (zone === 'top') {
            maximizeWindow(id);
            return;
        }
        if (zone === 'left' || zone === 'right') {
            snapWindow(id, zone);
            playSound('click');
            return;
        }
        // Otherwise, save the new free-form position. If currently snapped,
        // updateWindowPosition will clear the snap state too.
        updateWindowPosition(id, {
            x: savedX + info.offset.x,
            y: savedY + info.offset.y,
        });
    };

    const animateTarget = computeAnimateTarget();

    return (
        <>
            <AnimatePresence>
                {!windowState.isMinimized && (
                    <motion.div
                        initial={{ scale: 0.92, opacity: 0, filter: 'blur(8px)' }}
                        animate={{ ...animateTarget, scale: 1, opacity: 1, filter: 'blur(0px)' }}
                        exit={{ scale: 0.9, opacity: 0, filter: 'blur(8px)', transition: { duration: 0.18, ease: [0.4, 0, 1, 1] } }}
                        transition={{ type: 'spring', damping: 28, stiffness: 320 }}
                        className={`absolute flex flex-col overflow-hidden hud-frame pointer-events-auto ${isActive ? 'is-active' : ''}`}
                        style={{ zIndex: windowState.zIndex }}
                        drag={!effectiveMaximized && !isSnapped}
                        dragControls={dragControls}
                        dragListener={false}
                        dragConstraints={{
                            left: -savedX - 200,
                            top: -savedY,
                            right: window.innerWidth - savedX,
                            bottom: window.innerHeight - savedY - 80,
                        }}
                        dragMomentum={false}
                        dragElastic={0.05}
                        onDragStart={() => focusWindow(id)}
                        onDrag={handleDrag}
                        onDragEnd={handleDragEnd}
                        onClick={() => focusWindow(id)}
                    >
                        {!effectiveMaximized && !isSnapped && (
                            <>
                                <div className="hud-corner-bl" />
                                <div className="hud-corner-br" />
                            </>
                        )}

                        {/* Title bar */}
                        <div
                            className={`flex items-center justify-between px-3 md:px-4 select-none cursor-default font-mono
                                border-b border-[var(--border)] min-h-[40px] flex-shrink-0
                                ${isActive ? 'bg-[var(--surface-raised)] text-[var(--text-primary)]' : 'bg-[var(--surface)] text-[var(--text-muted)]'}
                            `}
                            onPointerDown={(e) => {
                                if (!effectiveMaximized) {
                                    dragControls.start(e);
                                    focusWindow(id);
                                }
                            }}
                            onDoubleClick={() => {
                                if (isMobile) return;
                                if (isSnapped) {
                                    snapWindow(id, null);
                                } else {
                                    maximizeWindow(id);
                                }
                            }}
                        >
                            <div className="flex items-center gap-2 md:gap-3 overflow-hidden">
                                <div className={`flex-shrink-0 ${isActive ? 'text-accent' : 'text-[var(--text-faint)]'}`}>
                                    {windowState.icon}
                                </div>
                                <span className="text-[11px] font-medium tracking-[0.15em] uppercase truncate">
                                    {windowState.title}
                                </span>
                            </div>

                            <div
                                className="flex items-center gap-1 flex-shrink-0"
                                onPointerDown={(e) => e.stopPropagation()}
                                onDoubleClick={(e) => e.stopPropagation()}
                            >
                                {!isMobile && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playSound('minimize');
                                            minimizeWindow(id);
                                        }}
                                        aria-label="Minimize"
                                        className="p-2 md:p-1.5 rounded hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        <Minus size={14} />
                                    </button>
                                )}
                                {!isMobile && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            playSound('click');
                                            if (isSnapped) snapWindow(id, null);
                                            else maximizeWindow(id);
                                        }}
                                        aria-label={windowState.isMaximized ? 'Restore' : 'Maximize'}
                                        className="p-2 md:p-1.5 rounded hover:bg-white/10 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                    >
                                        {windowState.isMaximized || isSnapped ? <Square size={12} /> : <Maximize2 size={12} />}
                                    </button>
                                )}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        playSound('close');
                                        closeWindow(id);
                                    }}
                                    aria-label="Close"
                                    className="p-2 md:p-1.5 rounded hover:bg-red-500/20 text-[var(--text-muted)] hover:text-red-400 transition-colors"
                                >
                                    <X size={isMobile ? 18 : 14} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-auto custom-scrollbar relative bg-[var(--surface-inset)]">
                            {windowState.component}
                            {!isActive && <div className="absolute inset-0 z-10" />}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Snap preview — drawn at the zone the window will land in if released now. */}
            <SnapPreview zone={snapPreview} />
        </>
    );
};

const SnapPreview: React.FC<{ zone: DragSnapPreview }> = ({ zone }) => {
    return (
        <AnimatePresence>
            {zone && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="fixed pointer-events-none z-[35] border-2 border-accent bg-[rgba(var(--accent-rgb),0.08)]"
                    style={{
                        top: 0,
                        left: zone === 'right' ? '50vw' : 0,
                        width: zone === 'top' ? '100vw' : '50vw',
                        height: 'calc(100vh - 64px)',
                        boxShadow: '0 0 60px rgba(var(--accent-rgb), 0.25), inset 0 0 60px rgba(var(--accent-rgb), 0.08)',
                    }}
                />
            )}
        </AnimatePresence>
    );
};

export default Window;
