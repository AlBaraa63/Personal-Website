import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export interface WindowState {
    id: string;
    title: string;
    icon: React.ReactNode;
    component: React.ReactNode;
    isOpen: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
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
    registerWindow: (window: Omit<WindowState, 'isOpen' | 'isMinimized' | 'isMaximized' | 'zIndex'>) => void;
    isBooting: boolean;
    setBooting: (booting: boolean) => void;
}

const OSContext = createContext<OSContextType | undefined>(undefined);

export const OSProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [windows, setWindows] = useState<Record<string, WindowState>>({});
    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [maxZIndex, setMaxZIndex] = useState(100);
    const [isBooting, setIsBooting] = useState(true);

    const getNextZIndex = useCallback(() => {
        setMaxZIndex(prev => prev + 1);
        return maxZIndex + 1;
    }, [maxZIndex]);

    const registerWindow = useCallback((windowConfig: Omit<WindowState, 'isOpen' | 'isMinimized' | 'isMaximized' | 'zIndex'>) => {
        setWindows(prev => {
            if (prev[windowConfig.id]) return prev;
            return {
                ...prev,
                [windowConfig.id]: {
                    ...windowConfig,
                    isOpen: false,
                    isMinimized: false,
                    isMaximized: false,
                    zIndex: 0,
                }
            };
        });
    }, []);

    const focusWindow = useCallback((id: string) => {
        setActiveWindowId(id);
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], zIndex: getNextZIndex(), isMinimized: false }
        }));
    }, [getNextZIndex]);

    const openWindow = useCallback((id: string) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], isOpen: true, isMinimized: false, isMaximized: true, zIndex: maxZIndex + 1 }
        }));
        setActiveWindowId(id);
        setMaxZIndex(prev => prev + 1);
    }, [maxZIndex]);

    const closeWindow = useCallback((id: string) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], isOpen: false, isMaximized: false }
        }));
        if (activeWindowId === id) setActiveWindowId(null);
    }, [activeWindowId]);

    const minimizeWindow = useCallback((id: string) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], isMinimized: true }
        }));
        if (activeWindowId === id) setActiveWindowId(null);
    }, [activeWindowId]);

    const maximizeWindow = useCallback((id: string) => {
        setWindows(prev => ({
            ...prev,
            [id]: { ...prev[id], isMaximized: !prev[id].isMaximized }
        }));
        focusWindow(id);
    }, [focusWindow]);

    return (
        <OSContext.Provider value={{
            windows,
            activeWindowId,
            openWindow,
            closeWindow,
            minimizeWindow,
            maximizeWindow,
            focusWindow,
            registerWindow,
            isBooting,
            setBooting: setIsBooting
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
