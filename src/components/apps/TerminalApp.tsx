import React, { useState, useEffect, useRef } from 'react';
import { useSound } from '@/context/SoundContext';
import { useOS } from '@/context/OSContext';

interface CommandHistory {
    id: number;
    command: string;
    output: React.ReactNode;
}

const FILESYSTEM = {
    '~': {
        type: 'dir',
        children: {
            'projects': { type: 'dir', children: {} },
            'skills.txt': { type: 'file', content: 'React, TypeScript, Node.js, WebGL, Three.js' },
            'secret.txt': { type: 'file', content: 'The password is: HOLO-REVOLUTION' },
            'contact.sh': { type: 'executable', app: 'contact' },
        }
    },
    '/': {
        type: 'dir',
        children: {
            'bin': { type: 'dir' },
            'usr': { type: 'dir' },
            'etc': { type: 'dir' },
        }
    }
};

const TerminalApp: React.FC = () => {
    const { playSound } = useSound();
    const { openWindow } = useOS();
    const [history, setHistory] = useState<CommandHistory[]>([
        { id: 0, command: 'boot', output: 'Holo-OS v1.0.0 Initialized...' },
        { id: 1, command: 'info', output: 'Type "help" for available commands.' }
    ]);
    const [currentInput, setCurrentInput] = useState('');
    const [currentPath, setCurrentPath] = useState('~');
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [history]);

    const handleCommand = (cmd: string) => {
        const trimmed = cmd.trim();
        const parts = trimmed.split(' ');
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);

        let output: React.ReactNode = '';

        switch (command) {
            case 'help':
                output = (
                    <div className="grid grid-cols-1 gap-1 text-accent/80">
                        <div><span className="text-white font-bold">ls</span> - List directory contents</div>
                        <div><span className="text-white font-bold">cd [dir]</span> - Change directory</div>
                        <div><span className="text-white font-bold">cat [file]</span> - Display file contents</div>
                        <div><span className="text-white font-bold">open [app]</span> - Launch an application</div>
                        <div><span className="text-white font-bold">clear</span> - Clear output</div>
                        <div><span className="text-white font-bold">date</span> - Show current date/time</div>
                        <div><span className="text-white font-bold">sudo</span> - Execute command as superuser</div>
                    </div>
                );
                break;
            case 'clear':
                setHistory([]);
                return;
            case 'ls':
                output = (
                    <div className="flex gap-4 flex-wrap">
                        <span className="text-blue-400 font-bold">projects/</span>
                        <span className="text-white">skills.txt</span>
                        <span className="text-white">secret.txt</span>
                        <span className="text-green-400 font-bold">contact.sh*</span>
                    </div>
                );
                break;
            case 'cat':
                if (args.length === 0) {
                    output = <span className="text-red-400">Usage: cat [filename]</span>;
                } else {
                    const file = args[0];
                    if (file === 'skills.txt') output = "React, TypeScript, Node.js, WebGL, Three.js";
                    else if (file === 'secret.txt') output = "The password is: HOLO-REVOLUTION";
                    else output = <span className="text-red-400">File not found: {file}</span>;
                }
                break;
            case 'open':
                if (args.length === 0) {
                    output = <span className="text-red-400">Usage: open [app_id]</span>;
                } else {
                    const appId = args[0].toLowerCase();
                    if (['bio', 'projects', 'contact', 'experience'].includes(appId)) {
                        openWindow(appId);
                        output = <span className="text-green-400">Launching {appId}...</span>;
                    } else {
                        output = <span className="text-red-400">Application not found: {appId}</span>;
                    }
                }
                break;
            case 'whoami':
                output = "guest_user@holo-os";
                break;
            case 'date':
                output = new Date().toLocaleString();
                break;
            case 'sudo':
                output = <span className="text-red-500 font-bold blink">ACCESS DENIED. THIS INCIDENT WILL BE REPORTED.</span>;
                playSound('error');
                break;
            case '':
                output = null;
                break;
            default:
                output = <span className="text-red-400">Command not found: {command}</span>;
        }

        if (trimmed) {
            setHistory(prev => [...prev, { id: Date.now(), command: trimmed, output }]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleCommand(currentInput);
            setCurrentInput('');
            playSound('success'); // Using 'success' as a generic 'enter' sound for now, or add 'enter' type
        } else {
            playSound('typing');
        }
    };

    return (
        <div
            className="h-full bg-black font-mono p-4 text-sm md:text-base overflow-auto custom-scrollbar"
            ref={containerRef}
            onClick={() => inputRef.current?.focus()}
        >
            {history.map((entry) => (
                <div key={entry.id} className="mb-2">
                    <div className="flex items-center gap-2 opacity-80">
                        <span className="text-green-400">guest@holo-os</span>
                        <span className="text-white/50">:</span>
                        <span className="text-blue-400">{currentPath}</span>
                        <span className="text-white/50">$</span>
                        <span className="text-white">{entry.command}</span>
                    </div>
                    {entry.output && (
                        <div className="ml-0 mt-1 mb-3 text-white/90">
                            {entry.output}
                        </div>
                    )}
                </div>
            ))}

            <div className="flex items-center gap-2">
                <span className="text-green-400">guest@holo-os</span>
                <span className="text-white/50">:</span>
                <span className="text-blue-400">{currentPath}</span>
                <span className="text-white/50">$</span>
                <input
                    ref={inputRef}
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-transparent border-none outline-none text-white caret-accent"
                    autoFocus
                    spellCheck={false}
                    autoComplete="off"
                />
            </div>
        </div>
    );
};

export default TerminalApp;
