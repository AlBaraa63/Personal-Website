import { useEffect } from 'react';
import { useOS } from '@/context/OSContext';
import { LauncherApp } from './Desktop';

const isMac = typeof navigator !== 'undefined' && navigator.platform.toUpperCase().includes('MAC');

const isTypingTarget = (target: EventTarget | null): boolean => {
    if (!(target instanceof HTMLElement)) return false;
    const tag = target.tagName;
    return tag === 'INPUT' || tag === 'TEXTAREA' || target.isContentEditable;
};

/**
 * Global keyboard shortcuts for the OS:
 *   ⌘K / Ctrl+K   open command palette (dispatched as a CustomEvent)
 *   Esc           close active window (when nothing is focused)
 *   ⌘W / Ctrl+W   close active window
 *   ⌘M / Ctrl+M   minimize active window
 *   ⌘1..9 / Ctrl+1..9   open/focus the Nth app from the launcher
 */
export const useGlobalShortcuts = (apps: LauncherApp[]) => {
    const { activeWindowId, openWindow, closeWindow, minimizeWindow, focusWindow, windows } = useOS();

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            const mod = isMac ? e.metaKey : e.ctrlKey;

            // ⌘K — open command palette. Works even when typing.
            if (mod && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                window.dispatchEvent(new CustomEvent('holo-os:palette:toggle'));
                return;
            }

            // From here down, ignore if user is typing into an input/textarea/contentEditable.
            if (isTypingTarget(e.target)) return;

            // Esc — close the active window
            if (e.key === 'Escape' && activeWindowId) {
                e.preventDefault();
                closeWindow(activeWindowId);
                return;
            }

            // ⌘W — close the active window
            if (mod && e.key.toLowerCase() === 'w' && activeWindowId) {
                e.preventDefault();
                closeWindow(activeWindowId);
                return;
            }

            // ⌘M — minimize the active window
            if (mod && e.key.toLowerCase() === 'm' && activeWindowId) {
                e.preventDefault();
                minimizeWindow(activeWindowId);
                return;
            }

            // ⌘1..9 — open or focus by position in the launcher
            if (mod && /^[1-9]$/.test(e.key)) {
                const idx = parseInt(e.key, 10) - 1;
                const app = apps[idx];
                if (!app) return;
                e.preventDefault();
                const win = windows[app.id];
                if (win?.isOpen) {
                    focusWindow(app.id);
                } else {
                    openWindow(app.id);
                }
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [apps, activeWindowId, openWindow, closeWindow, minimizeWindow, focusWindow, windows]);
};
