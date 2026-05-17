import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export interface Notification {
    id: number;
    title: string;
    message?: string;
    /** Source app name shown in the chip header. */
    source?: string;
    /** Optional action button — click runs the callback then dismisses the toast. */
    action?: { label: string; run: () => void };
    /** Auto-dismiss after this many ms. 0 = persistent. Default 5000. */
    duration?: number;
}

interface NotificationContextType {
    notifications: Notification[];
    notify: (n: Omit<Notification, 'id'>) => number;
    dismiss: (id: number) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const idRef = useRef(1);

    const dismiss = useCallback((id: number) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    }, []);

    const notify = useCallback((n: Omit<Notification, 'id'>): number => {
        const id = idRef.current++;
        const full: Notification = { duration: 5000, ...n, id };
        setNotifications(prev => [...prev, full]);
        if (full.duration && full.duration > 0) {
            setTimeout(() => dismiss(id), full.duration);
        }
        return id;
    }, [dismiss]);

    const value = useMemo(() => ({ notifications, notify, dismiss }), [notifications, notify, dismiss]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
    return ctx;
};
