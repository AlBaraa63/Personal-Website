import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Command, Download, Github, Volume2, VolumeX, Info } from 'lucide-react';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';
import { resumeConfig } from '@/data/portfolioData';

interface MenuPosition {
    x: number;
    y: number;
}

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    action: () => void;
    separator?: boolean;
}

const ContextMenu: React.FC = () => {
    const [position, setPosition] = useState<MenuPosition | null>(null);
    const { openWindow } = useOS();
    const { playSound, isMuted, toggleMute } = useSound();
    const menuRef = useRef<HTMLDivElement>(null);

    const handleContextMenu = useCallback((e: MouseEvent) => {
        // Only trigger on the desktop background, not on windows or interactive elements
        const target = e.target as HTMLElement;
        if (target.closest('.hud-frame') || target.closest('button') || target.closest('a') || target.closest('input')) {
            return;
        }
        e.preventDefault();
        playSound('click');

        // Adjust position to keep menu in viewport
        const x = Math.min(e.clientX, window.innerWidth - 220);
        const y = Math.min(e.clientY, window.innerHeight - 320);
        setPosition({ x, y });
    }, [playSound]);

    const handleClick = useCallback(() => {
        setPosition(null);
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') setPosition(null);
    }, []);

    useEffect(() => {
        window.addEventListener('contextmenu', handleContextMenu);
        window.addEventListener('click', handleClick);
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('contextmenu', handleContextMenu);
            window.removeEventListener('click', handleClick);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleContextMenu, handleClick, handleKeyDown]);

    const handleMenuAction = (action: () => void) => {
        playSound('click');
        action();
        setPosition(null);
    };

    const handleResumeDownload = () => {
        const link = document.createElement('a');
        link.href = resumeConfig.downloadUrl;
        link.setAttribute('download', resumeConfig.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const menuItems: MenuItem[] = [
        {
            label: 'Open Terminal',
            icon: <Terminal size={13} />,
            action: () => openWindow('terminal'),
        },
        {
            label: 'Command Palette',
            icon: <Command size={13} />,
            action: () => {
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', metaKey: true }));
            },
        },
        {
            label: 'Download Résumé',
            icon: <Download size={13} />,
            action: handleResumeDownload,
            separator: true,
        },
        {
            label: 'View Source Code',
            icon: <Github size={13} />,
            action: () => window.open('https://github.com/AlBaraa63/Personal-Website', '_blank'),
        },
        {
            label: isMuted ? 'Unmute Sound' : 'Mute Sound',
            icon: isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />,
            action: toggleMute,
            separator: true,
        },
        {
            label: 'About HOLO-OS',
            icon: <Info size={13} />,
            action: () => openWindow('settings'),
        },
    ];

    return (
        <AnimatePresence>
            {position && (
                <motion.div
                    ref={menuRef}
                    initial={{ opacity: 0, scale: 0.9, y: -5 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
                    className="fixed z-[300] min-w-[200px] bg-[var(--surface)]/95 backdrop-blur-xl border border-[var(--border-strong)] font-mono py-1.5 select-none"
                    style={{ left: position.x, top: position.y }}
                >
                    {/* HUD corners */}
                    <span aria-hidden className="absolute -top-px -left-px w-2 h-2 border-t border-l border-accent" />
                    <span aria-hidden className="absolute -top-px -right-px w-2 h-2 border-t border-r border-accent" />
                    <span aria-hidden className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-accent" />
                    <span aria-hidden className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-accent" />

                    {/* Header */}
                    <div className="px-3 py-1.5 text-[9px] uppercase tracking-[0.3em] text-[var(--text-faint)] border-b border-[var(--border)] mb-1">
                        Holo-OS · Desktop
                    </div>

                    {menuItems.map((item, i) => (
                        <React.Fragment key={i}>
                            {item.separator && i > 0 && (
                                <div className="my-1 mx-2 h-px bg-[var(--border)]" />
                            )}
                            <button
                                onClick={() => handleMenuAction(item.action)}
                                onMouseEnter={() => playSound('hover')}
                                className="w-full flex items-center gap-2.5 px-3 py-1.5 text-xs text-[var(--text-muted)]
                                         hover:bg-[rgba(var(--accent-rgb),0.1)] hover:text-accent transition-colors text-left"
                            >
                                <span className="text-[var(--text-faint)] group-hover:text-accent">{item.icon}</span>
                                {item.label}
                            </button>
                        </React.Fragment>
                    ))}

                    {/* Footer */}
                    <div className="mt-1 pt-1 border-t border-[var(--border)] px-3 py-1 text-[8px] uppercase tracking-[0.3em] text-[var(--text-faint)]">
                        v5.0.0 · AlBaraa AlOlabi
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ContextMenu;
