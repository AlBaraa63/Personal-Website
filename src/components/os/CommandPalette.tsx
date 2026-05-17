import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, CornerDownLeft, ArrowUp, ArrowDown } from 'lucide-react';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';
import { SidebarApp } from './Sidebar';
import { projects } from '@/data/portfolioData';

interface CommandPaletteProps {
    apps: SidebarApp[];
}

interface Item {
    id: string;
    group: 'app' | 'project' | 'action';
    label: string;
    hint: string;
    icon: React.ReactNode;
    run: () => void;
}

// Lightweight fuzzy match: requires all query chars to appear in order, in either
// label or hint. Score = how tight the match is (lower distance = higher score).
const fuzzyMatch = (query: string, target: string): number => {
    if (!query) return 0;
    const q = query.toLowerCase();
    const t = target.toLowerCase();
    let qi = 0;
    let firstHit = -1;
    let lastHit = -1;
    for (let ti = 0; ti < t.length && qi < q.length; ti++) {
        if (t[ti] === q[qi]) {
            if (firstHit < 0) firstHit = ti;
            lastHit = ti;
            qi++;
        }
    }
    if (qi < q.length) return -1; // not all matched
    // Lower spread = better. Tight matches near the start rank highest.
    return 1000 - (lastHit - firstHit) - firstHit;
};

const CommandPalette: React.FC<CommandPaletteProps> = ({ apps }) => {
    const { openWindow, focusWindow, closeWindow, minimizeWindow, windows } = useOS();
    const { playSound } = useSound();
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    // Listen for the toggle event from useGlobalShortcuts.
    useEffect(() => {
        const onToggle = () => setOpen(o => !o);
        const onOpen = () => setOpen(true);
        const onClose = () => setOpen(false);
        window.addEventListener('holo-os:palette:toggle', onToggle);
        window.addEventListener('holo-os:palette:open', onOpen);
        window.addEventListener('holo-os:palette:close', onClose);
        return () => {
            window.removeEventListener('holo-os:palette:toggle', onToggle);
            window.removeEventListener('holo-os:palette:open', onOpen);
            window.removeEventListener('holo-os:palette:close', onClose);
        };
    }, []);

    // Reset state each time it opens
    useEffect(() => {
        if (open) {
            setQuery('');
            setActiveIndex(0);
            playSound('click');
            // Defer focus until the input is mounted
            requestAnimationFrame(() => inputRef.current?.focus());
        }
    }, [open, playSound]);

    // Build the item list. Apps + each project as a deep-launch.
    const allItems: Item[] = useMemo(() => {
        const appItems: Item[] = apps.map(app => ({
            id: `app:${app.id}`,
            group: 'app',
            label: app.label,
            hint: 'App · open window',
            icon: app.icon,
            run: () => {
                const win = windows[app.id];
                if (win?.isOpen) focusWindow(app.id);
                else openWindow(app.id);
            },
        }));

        const projectItems: Item[] = projects.map(p => ({
            id: `project:${p.id}`,
            group: 'project',
            label: p.title,
            hint: `Project · ${p.category}`,
            icon: <span className="text-accent text-[10px] font-mono">›</span>,
            run: () => {
                // Open the projects window AND deep-link to this project.
                openWindow('projects');
                // Defer so the projects component is mounted before the event fires.
                setTimeout(() => {
                    window.dispatchEvent(new CustomEvent('holo-os:projects:select', { detail: { id: p.id } }));
                }, 60);
            },
        }));

        const actionItems: Item[] = [
            {
                id: 'action:close-all',
                group: 'action',
                label: 'Close all windows',
                hint: 'Action · clear the desktop',
                icon: <span className="text-accent">×</span>,
                run: () => {
                    Object.values(windows).filter(w => w.isOpen).forEach(w => closeWindow(w.id));
                },
            },
            {
                id: 'action:focus-desktop',
                group: 'action',
                label: 'Show desktop',
                hint: 'Action · minimize everything',
                icon: <span className="text-accent">⌂</span>,
                run: () => {
                    Object.values(windows)
                        .filter(w => w.isOpen && !w.isMinimized)
                        .forEach(w => minimizeWindow(w.id));
                },
            },
        ];

        return [...appItems, ...projectItems, ...actionItems];
    }, [apps, windows, openWindow, focusWindow, closeWindow, minimizeWindow]);

    // Filter + rank
    const results = useMemo(() => {
        if (!query.trim()) {
            // Default view: apps first, then a few featured projects, then actions.
            const apps = allItems.filter(i => i.group === 'app');
            const featuredProjects = allItems.filter(i => i.group === 'project').slice(0, 4);
            const actions = allItems.filter(i => i.group === 'action');
            return [...apps, ...featuredProjects, ...actions];
        }
        return allItems
            .map(item => ({ item, score: Math.max(fuzzyMatch(query, item.label), fuzzyMatch(query, item.hint)) }))
            .filter(({ score }) => score >= 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 12)
            .map(({ item }) => item);
    }, [allItems, query]);

    // Clamp active index whenever results change
    useEffect(() => {
        setActiveIndex(i => Math.min(i, Math.max(0, results.length - 1)));
    }, [results.length]);

    // Scroll the active item into view
    useEffect(() => {
        const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIndex}"]`);
        el?.scrollIntoView({ block: 'nearest' });
    }, [activeIndex]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex(i => Math.min(results.length - 1, i + 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex(i => Math.max(0, i - 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const item = results[activeIndex];
            if (item) {
                playSound('open');
                item.run();
                setOpen(false);
            }
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setOpen(false);
        }
    }, [activeIndex, results, playSound]);

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    className="fixed inset-0 z-[80] flex items-start justify-center pt-[10vh] px-4 bg-black/70 backdrop-blur-md font-mono"
                    onClick={() => setOpen(false)}
                    role="dialog"
                    aria-label="Command palette"
                >
                    <motion.div
                        initial={{ scale: 0.96, y: -8, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.96, y: -8, opacity: 0 }}
                        transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
                        className="hud-frame is-active w-full max-w-2xl bg-[var(--surface)] overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="hud-corner-bl" />
                        <div className="hud-corner-br" />

                        {/* Search input */}
                        <div className="flex items-center gap-3 px-4 h-14 border-b border-[var(--border)]">
                            <Search size={16} className="text-accent flex-shrink-0" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
                                onKeyDown={handleKeyDown}
                                placeholder="Search apps, projects, actions…"
                                aria-label="Command palette search"
                                className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] text-sm placeholder:text-[var(--text-faint)]"
                                spellCheck={false}
                                autoComplete="off"
                            />
                            <kbd className="text-[10px] px-2 py-0.5 border border-[var(--border-strong)] text-[var(--text-faint)] uppercase tracking-widest">esc</kbd>
                        </div>

                        {/* Results */}
                        <div ref={listRef} className="max-h-[50vh] overflow-y-auto custom-scrollbar">
                            {results.length === 0 ? (
                                <div className="px-4 py-8 text-center text-[var(--text-faint)] text-xs uppercase tracking-widest">
                                    No matches for "{query}"
                                </div>
                            ) : (
                                <div className="py-1">
                                    {results.map((item, i) => {
                                        const isActive = i === activeIndex;
                                        const groupLabel = item.group === 'app' ? 'APP' : item.group === 'project' ? 'PROJECT' : 'ACTION';
                                        return (
                                            <div
                                                key={item.id}
                                                data-idx={i}
                                                onMouseEnter={() => setActiveIndex(i)}
                                                onClick={() => {
                                                    playSound('open');
                                                    item.run();
                                                    setOpen(false);
                                                }}
                                                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors
                                                    ${isActive ? 'bg-[rgba(var(--accent-rgb),0.08)] border-l-2 border-accent' : 'border-l-2 border-transparent'}
                                                `}
                                            >
                                                <div className={`w-8 h-8 flex items-center justify-center border ${isActive ? 'border-accent text-accent' : 'border-[var(--border)] text-[var(--text-muted)]'}`}>
                                                    {item.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className={`text-sm truncate ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}`}>
                                                        {item.label}
                                                    </div>
                                                    <div className="text-[10px] uppercase tracking-widest text-[var(--text-faint)]">
                                                        {item.hint}
                                                    </div>
                                                </div>
                                                <span className="text-[9px] uppercase tracking-widest text-[var(--text-faint)] flex-shrink-0">
                                                    {groupLabel}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer hints */}
                        <div className="border-t border-[var(--border)] px-4 py-2 flex items-center gap-4 text-[10px] uppercase tracking-widest text-[var(--text-faint)] bg-[var(--surface-inset)]">
                            <span className="flex items-center gap-1.5"><ArrowUp size={11} /><ArrowDown size={11} /> Navigate</span>
                            <span className="flex items-center gap-1.5"><CornerDownLeft size={11} /> Select</span>
                            <span className="ml-auto">{results.length} results</span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CommandPalette;
