import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSound } from '@/context/SoundContext';
import { useOS } from '@/context/OSContext';
import { resumeConfig } from '@/data/portfolioData';

interface HistoryEntry {
    id: number;
    command: string;
    output: React.ReactNode;
}

const KNOWN_APP_IDS = ['bio', 'projects', 'experience', 'contact', 'terminal', 'neural', 'retro', 'settings'];

const ABOUT_TEXT =
    `name      : AlBaraa AlOlabi
role      : AI Researcher & Computer Vision Engineer
company   : Cellula Technologies (Intern, since Jan 2026)
focus     : Computer Vision, Edge AI, Deep Learning
location  : UAE
status    : Open to opportunities

stack     : Python, PyTorch, OpenCV, YOLOv8, MediaPipe, TensorFlow,
            HuggingFace BART, TypeScript, React, FastAPI, MCP
papers    : IEEE SNAMS 2025 — AI in Education (published author)`;

const TerminalApp: React.FC = () => {
    const { playSound } = useSound();
    const { openWindow, windows, minimizeWindow } = useOS();
    const [history, setHistory] = useState<HistoryEntry[]>([]);
    const [currentInput, setCurrentInput] = useState('');
    const [, setRecall] = useState<{ list: string[]; index: number }>({ list: [], index: -1 });
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const idRef = useRef(1);
    const bootedRef = useRef(false);

    const nextId = () => idRef.current++;

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history]);

    const helpOutput = (
        <div className="grid grid-cols-1 gap-0.5">
            <Row cmd="help" desc="show this list" />
            <Row cmd="ls" desc="list files in this directory" />
            <Row cmd="cat [file]" desc="print a file (try about.txt, skills.txt)" />
            <Row cmd="whoami" desc="print user identity" />
            <Row cmd="cd [app]" desc="navigate to an app (cd projects, cd ~)" />
            <Row cmd="open [app]" desc="launch an app window" />
            <Row cmd="projects" desc="open the projects app" />
            <Row cmd="contact" desc="open the contact app" />
            <Row cmd="resume" desc="download the résumé" />
            <Row cmd="date" desc="current date/time" />
            <Row cmd="clear" desc="clear the terminal" />
            <Row cmd="exit" desc="close this terminal" />
        </div>
    );

    const handleCommand = useCallback((rawCmd: string) => {
        const trimmed = rawCmd.trim();
        const parts = trimmed.split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        let output: React.ReactNode = null;

        switch (command) {
            case 'help':
                output = helpOutput;
                break;

            case 'ls':
                output = (
                    <div className="flex gap-x-5 gap-y-1 flex-wrap">
                        <span className="text-accent font-semibold">projects/</span>
                        <span className="text-[var(--text-primary)]">about.txt</span>
                        <span className="text-[var(--text-primary)]">skills.txt</span>
                        <span className="text-[var(--text-primary)]">contact.txt</span>
                    </div>
                );
                break;

            case 'cat': {
                if (args.length === 0) {
                    output = <span className="text-red-400">Usage: cat [filename]</span>;
                    break;
                }
                const file = args[0];
                if (file === 'about.txt' || file === 'about') {
                    output = <pre className="whitespace-pre-wrap text-[var(--text-muted)]">{ABOUT_TEXT}</pre>;
                } else if (file === 'skills.txt' || file === 'skills') {
                    output = <span className="text-[var(--text-muted)]">Python · PyTorch · OpenCV · YOLOv8 · MediaPipe · TensorFlow · HuggingFace BART · TypeScript · React · FastAPI · MCP</span>;
                } else if (file === 'contact.txt' || file === 'contact') {
                    output = (
                        <div className="text-[var(--text-muted)] space-y-0.5">
                            <div>email     : 666645@gmail.com</div>
                            <div>linkedin  : linkedin.com/in/albaraa-alolabi</div>
                            <div>github    : github.com/AlBaraa63</div>
                        </div>
                    );
                } else {
                    output = <span className="text-red-400">cat: {file}: no such file</span>;
                }
                break;
            }

            case 'whoami':
                output = <span className="text-[var(--text-muted)]">guest@holo-os — viewing AlBaraa AlOlabi's portfolio</span>;
                break;

            case 'projects':
                openWindow('projects');
                output = <span className="text-accent">→ launching projects…</span>;
                break;

            case 'contact':
                openWindow('contact');
                output = <span className="text-accent">→ launching contact…</span>;
                break;

            case 'open':
                if (args.length === 0) {
                    output = <span className="text-red-400">Usage: open [app_id]</span>;
                } else {
                    const appId = args[0].toLowerCase();
                    if (KNOWN_APP_IDS.includes(appId)) {
                        openWindow(appId);
                        output = <span className="text-accent">→ launching {appId}…</span>;
                    } else {
                        output = <span className="text-red-400">unknown app: {appId} (try `help`)</span>;
                    }
                }
                break;

            case 'cd': {
                if (args.length === 0 || args[0] === '~' || args[0] === '/') {
                    Object.values(windows).filter(w => w.isOpen && !w.isMinimized).forEach(w => minimizeWindow(w.id));
                    output = <span className="text-[var(--text-muted)]">→ minimizing all · welcome to the desktop</span>;
                    break;
                }
                const target = args[0].toLowerCase().replace(/^\/+|\/+$/g, '');
                if (KNOWN_APP_IDS.includes(target)) {
                    openWindow(target);
                    output = <span className="text-accent">→ cd {target}</span>;
                } else {
                    output = <span className="text-red-400">cd: no such app: {target}</span>;
                }
                break;
            }

            case 'resume':
            case 'cv': {
                const link = document.createElement('a');
                link.href = resumeConfig.downloadUrl;
                link.setAttribute('download', resumeConfig.fileName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                output = <span className="text-accent">→ downloading {resumeConfig.fileName}…</span>;
                break;
            }

            case 'pwd':
                output = <span className="text-[var(--text-muted)]">/home/guest @ holo-os</span>;
                break;

            case 'date':
                output = <span className="text-[var(--text-muted)]">{new Date().toString()}</span>;
                break;

            case 'sudo':
                output = <span className="text-red-400 font-bold">access denied. this incident has been logged.</span>;
                playSound('error');
                break;

            case 'clear':
                setHistory([]);
                return;

            case 'exit':
                output = <span className="text-[var(--text-faint)]">// session ended. close the window to dismiss.</span>;
                break;

            case '':
                break;

            default:
                output = <span className="text-red-400">command not found: {command} — try `help`</span>;
        }

        if (trimmed) {
            setHistory(prev => [...prev, { id: nextId(), command: trimmed, output }]);
            setRecall(prev => ({ list: [...prev.list, trimmed], index: -1 }));
        }
    }, [helpOutput, openWindow, playSound]);

    // Auto-run `help` on first open so the empty-black-space problem goes away.
    useEffect(() => {
        if (bootedRef.current) return;
        bootedRef.current = true;
        setHistory([
            { id: nextId(), command: '', output: <span className="text-[var(--text-faint)]">HOLO-OS terminal · type `help` to see what you can do.</span> },
            { id: nextId(), command: 'help', output: helpOutput },
        ]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCommand(currentInput);
            setCurrentInput('');
            playSound('success');
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            setRecall(prev => {
                if (prev.list.length === 0) return prev;
                const nextIdx = prev.index < 0 ? prev.list.length - 1 : Math.max(0, prev.index - 1);
                setCurrentInput(prev.list[nextIdx]);
                return { ...prev, index: nextIdx };
            });
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setRecall(prev => {
                if (prev.list.length === 0 || prev.index < 0) return prev;
                const nextIdx = prev.index + 1;
                if (nextIdx >= prev.list.length) {
                    setCurrentInput('');
                    return { ...prev, index: -1 };
                }
                setCurrentInput(prev.list[nextIdx]);
                return { ...prev, index: nextIdx };
            });
            return;
        }
        playSound('typing');
    };

    return (
        <div
            ref={containerRef}
            onClick={() => inputRef.current?.focus()}
            className="h-full bg-[var(--surface-inset)] font-mono p-4 text-sm overflow-auto custom-scrollbar text-[var(--text-primary)]"
        >
            {history.map((entry) => (
                <div key={entry.id} className="mb-2">
                    {entry.command && (
                        <div className="flex items-center gap-2">
                            <span className="text-accent">guest@holo-os</span>
                            <span className="text-[var(--text-faint)]">:~$</span>
                            <span className="text-[var(--text-primary)]">{entry.command}</span>
                        </div>
                    )}
                    {entry.output && <div className="mt-1 mb-2">{entry.output}</div>}
                </div>
            ))}

            <div className="flex items-center gap-2">
                <span className="text-accent">guest@holo-os</span>
                <span className="text-[var(--text-faint)]">:~$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] caret-accent"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                    aria-label="Terminal input"
                />
            </div>
        </div>
    );
};

const Row: React.FC<{ cmd: string; desc: string }> = ({ cmd, desc }) => (
    <div className="flex gap-3">
        <span className="text-accent font-semibold w-28 flex-shrink-0">{cmd}</span>
        <span className="text-[var(--text-muted)]">{desc}</span>
    </div>
);

export default TerminalApp;
