import React, { createContext, useContext, useState, ReactNode, useCallback, useRef } from 'react';

export type SnapSide = 'left' | 'right' | null;

export interface WindowState {
    id: string;
    title: string;
    icon: React.ReactNode;
    component: React.ReactNode;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    snap: SnapSide;
    zIndex: number;
    position?: { x: number; y: number };
    size?: { width: number; height: number };
}

interface OSContextType {
    windows: Record<string, WindowState>;
    activeWindowId: string | null;
    openWindow: (id: string) => void;
    closeWindow: (id: string) => void;
    minimizeWindow: (id: string) => void;
    maximizeWindow: (id: string) => void;
    focusWindow: (id: string) => void;
    updateWindowPosition: (id: string, position: { x: number; y: number }) => void;
    snapWindow: (id: string, side: SnapSide) => void;
    registerWindow: (window: Omit<WindowState, 'isOpen' | 'isMinimized' | 'isMaximized' | 'zIndex' | 'snap'>) => void;
    isBooting: boolean;
    setBooting: (booting: boolean) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [windows, setWindows] = useState<Record<string, WindowState>>({});
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    // Skip boot if the user already booted earlier in this browser session.
    // Persists across reloads via sessionStorage but resets in a new tab/session.
    const [isBooting, setIsBootingState] = useState<boolean>(() => {
        if (typeof window === 'undefined') return true;
        return sessionStorage.getItem('holo-os-booted') !== '1';
    });

    const setBooting = useCallback((booting: boolean) => {
        setIsBootingState(booting);
        if (!booting && typeof window !== 'undefined') {
            sessionStorage.setItem('holo-os-booted', '1');
        }
    }, []);

    // Ref-based z-index counter avoids the stale-closure race the previous
    // useState+setMaxZIndex pattern had — two rapid focus calls used to read
    // the same `maxZIndex` and assign the same z to both windows.
    const zCounterRef = useRef(100);
    const nextZ = useCallback(() => ++zCounterRef.current, []);

    const registerWindow = useCallback((windowConfig: Omit<WindowState, 'isOpen' | 'isMinimized' | 'isMaximized' | 'zIndex' | 'snap'>) => {
        setWindows(prev => {
            if (prev[windowConfig.id]) return prev;
            return {
                ...prev,
                [windowConfig.id]: {
                    ...windowConfig,
                    isOpen: false,
                    isMinimized: false,
                    isMaximized: false,
                    snap: null,
                    zIndex: 0,
                }
            };
        });
    }, []);

    const focusWindow = useCallback((id: string) => {
        const z = nextZ();
        setActiveWindowId(id);
        setWindows(prev => {
            if (!prev[id]) return prev;
            return {
                ...prev,
                [id]: { ...prev[id], zIndex: z, isMinimized: false }
            };
        });
    }, [nextZ]);

    const openWindow = useCallback((id: string) => {
        const z = nextZ();
        setActiveWindowId(id);
        setWindows(prev => {
            const win = prev[id];
            if (!win) return prev;
            return {
                ...prev,
                [id]: {
                    ...win,
                    isOpen: true,
                    isMinimized: false,
                    // Preserve the user's last maximize choice — don't force it on every open.
                    // Mobile fullscreen is handled separately in Window.tsx.
                    isMaximized: win.isMaximized,
                    zIndex: z,
                }
            };
        });
    }, [nextZ]);

    const closeWindow = useCallback((id: string) => {
        setWindows(prev => {
            if (!prev[id]) return prev;
            return {
                ...prev,
                [id]: { ...prev[id], isOpen: false }
            };
        });
        setActiveWindowId(prev => (prev === id ? null : prev));
    }, []);

    const minimizeWindow = useCallback((id: string) => {
        setWindows(prev => {
            if (!prev[id]) return prev;
            return {
                ...prev,
                [id]: { ...prev[id], isMinimized: true }
            };
        });
        setActiveWindowId(prev => (prev === id ? null : prev));
    }, []);

    const maximizeWindow = useCallback((id: string) => {
        const z = nextZ();
        setActiveWindowId(id);
        setWindows(prev => {
            if (!prev[id]) return prev;
            return {
                ...prev,
                [id]: { ...prev[id], isMaximized: !prev[id].isMaximized, zIndex: z }
            };
        });
    }, [nextZ]);

    // Drag-end handler captures the new position so reopening restores it.
    // Per-session memory only — not persisted to localStorage. Also clears
    // any active snap state since the user has moved the window manually.
    const updateWindowPosition = useCallback((id: string, position: { x: number; y: number }) => {
        setWindows(prev => {
            if (!prev[id]) return prev;
            return {
                ...prev,
                [id]: { ...prev[id], position, snap: null }
            };
        });
    }, []);

    // Snap a window to a screen edge (left half / right half). Passing null
    // restores the window to its remembered position. Snapping also clears
    // isMaximized so the two modes don't fight.
    const snapWindow = useCallback((id: string, side: SnapSide) => {
        const z = nextZ();
        setActiveWindowId(id);
        setWindows(prev => {
            if (!prev[id]) return prev;
            return {
                ...prev,
                [id]: { ...prev[id], snap: side, isMaximized: false, zIndex: z }
            };
        });
    }, [nextZ]);

    return (
        <OSContext.Provider value={{
            windows,
            activeWindowId,
            openWindow,
            closeWindow,
            minimizeWindow,
            maximizeWindow,
            focusWindow,
            updateWindowPosition,
            snapWindow,
            registerWindow,
            isBooting,
            setBooting
        }}>
            {children}
        </OSContext.Provider>
    );
};

export const useOS = () => {
    const context = useContext(OSContext);
    if (context === undefined) {
        throw new Error('useOS must be used within an OSProvider');
    }
    return context;
};
