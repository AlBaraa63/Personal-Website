import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Bell } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

const NotificationLayer: React.FC = () => {
    const { notifications, dismiss } = useNotifications();

    return (
        <div
            className="fixed top-4 right-4 z-[70] flex flex-col gap-2 pointer-events-none w-[320px] max-w-[calc(100vw-2rem)] font-mono"
            aria-live="polite"
            aria-label="Notifications"
        >
            <AnimatePresence>
                {notifications.map((n) => (
                    <motion.div
                        key={n.id}
                        layout
                        initial={{ opacity: 0, x: 24, scale: 0.96 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 24, scale: 0.96, transition: { duration: 0.18 } }}
                        transition={{ type: 'spring', damping: 26, stiffness: 320 }}
                        className="relative pointer-events-auto bg-[var(--surface)]/95 backdrop-blur-md border border-accent p-3"
                        role="status"
                    >
                        {/* HUD corners */}
                        <span aria-hidden className="absolute -top-px -left-px w-2 h-2 border-t border-l border-accent" />
                        <span aria-hidden className="absolute -top-px -right-px w-2 h-2 border-t border-r border-accent" />
                        <span aria-hidden className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-accent" />
                        <span aria-hidden className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-accent" />

                        {/* Header */}
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                                <Bell size={10} className="text-accent" />
                                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-accent">
                                    {n.source ?? 'System'}
                                </span>
                            </div>
                            <button
                                onClick={() => dismiss(n.id)}
                                aria-label="Dismiss notification"
                                className="p-1 text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors"
                            >
                                <X size={12} />
                            </button>
                        </div>

                        <div className="text-sm font-bold text-[var(--text-primary)] tracking-wide">
                            {n.title}
                        </div>
                        {n.message && (
                            <div className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                                {n.message}
                            </div>
                        )}

                        {n.action && (
                            <button
                                onClick={() => {
                                    n.action!.run();
                                    dismiss(n.id);
                                }}
                                className="mt-2 px-3 py-1 border border-accent bg-accent text-black text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--accent-hover)] transition-colors"
                            >
                                {n.action.label}
                            </button>
                        )}

                        {/* Auto-dismiss progress bar */}
                        {n.duration && n.duration > 0 && (
                            <motion.span
                                aria-hidden
                                className="absolute bottom-0 left-0 h-[1px] bg-accent"
                                initial={{ width: '100%' }}
                                animate={{ width: 0 }}
                                transition={{ duration: n.duration / 1000, ease: 'linear' }}
                            />
                        )}
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};

export default NotificationLayer;
