import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Send, Cpu, Activity, Zap } from 'lucide-react';
import { useSound } from '@/context/SoundContext';
import { useOS } from '@/context/OSContext';
import { interpret, queryRemote, HoloAction, AIResponse } from './holoAI';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    actions?: HoloAction[];
    timestamp: Date;
}

const SUGGESTED_PROMPTS = [
    'Open my projects',
    'Show me your CV',
    'Who are you?',
    'How do I contact you?',
];

// In production, default to the Vercel Edge Function at /api/chat. In dev,
// only hit a remote endpoint if VITE_AI_ENDPOINT is explicitly set. Either way,
// queryRemote falls back to the local agent if the request errors.
const AI_ENDPOINT =
    (import.meta.env.VITE_AI_ENDPOINT as string | undefined) ||
    (import.meta.env.PROD ? '/api/chat' : '');

const NeuralNet: React.FC = () => {
    const { playSound } = useSound();
    const { openWindow, closeWindow, focusWindow, minimizeWindow, windows } = useOS();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            text:
                "Holo-AI online. I can answer questions about AlBaraa — and I can run the OS for you. Try \"open projects\" or pick a suggestion below.",
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Contained matrix rain across the header strip.
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();

        const fontSize = 12;
        const chars = '01アイウエオカキクケコサシスセソ';
        let drops: number[] = [];
        const initDrops = () => {
            const columns = Math.ceil(canvas.width / fontSize);
            drops = Array(columns).fill(1).map(() => Math.random() * 10);
        };
        initDrops();

        const onResize = () => { resize(); initDrops(); };
        window.addEventListener('resize', onResize);

        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = 'rgba(34, 197, 94, 0.6)';
            ctx.font = `${fontSize}px monospace`;
            for (let i = 0; i < drops.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
        };
        const interval = setInterval(draw, 60);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    // Execute Holo-AI actions against the OS.
    const executeActions = useCallback((actions: HoloAction[]) => {
        for (const action of actions) {
            switch (action.type) {
                case 'open_window':
                    openWindow(action.id);
                    break;
                case 'close_window':
                    closeWindow(action.id);
                    break;
                case 'focus_window':
                    focusWindow(action.id);
                    break;
                case 'minimize_all':
                    Object.values(windows).filter(w => w.isOpen && !w.isMinimized).forEach(w => minimizeWindow(w.id));
                    break;
                case 'close_all':
                    Object.values(windows).filter(w => w.isOpen).forEach(w => closeWindow(w.id));
                    break;
                case 'open_project':
                    openWindow('projects');
                    // Defer so Projects mounts/restores before receiving the event
                    setTimeout(() => {
                        window.dispatchEvent(new CustomEvent('holo-os:projects:select', { detail: { id: action.id } }));
                    }, 80);
                    break;
            }
        }
    }, [openWindow, closeWindow, focusWindow, minimizeWindow, windows]);

    const sendMessage = async (text: string) => {
        if (!text.trim()) return;
        playSound('click');
        const userMsg: Message = { id: Date.now(), text, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        const response: AIResponse = AI_ENDPOINT
            ? await queryRemote(text, AI_ENDPOINT)
            : interpret(text);

        // Small delay so the UI doesn't snap; feels less robotic.
        await new Promise(r => setTimeout(r, 250 + Math.random() * 200));

        const aiMsg: Message = {
            id: Date.now() + 1,
            text: response.message,
            sender: 'ai',
            actions: response.actions,
            timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMsg]);
        setIsThinking(false);
        playSound('success');

        // Execute after we've rendered the confirmation message.
        if (response.actions && response.actions.length > 0) {
            executeActions(response.actions);
        }
    };

    const handleSend = () => sendMessage(input);

    return (
        <div className="h-full flex flex-col bg-[var(--surface-inset)] text-[var(--text-primary)] font-mono">
            {/* Contained matrix strip */}
            <div className="h-8 border-b border-[var(--border)] relative overflow-hidden">
                <canvas ref={canvasRef} className="w-full h-full absolute inset-0 opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-[var(--surface-inset)] to-transparent">
                    <div className="flex items-center gap-2 px-3 py-0.5 bg-[var(--surface)]/80 border border-[var(--border)] backdrop-blur-sm">
                        <Activity size={10} className="text-accent" />
                        <span className="text-[10px] tracking-[0.25em] uppercase text-[var(--text-muted)]">
                            {isThinking ? 'Analyzing…' : AI_ENDPOINT ? 'Neural Link · Live' : 'Neural Link · Local Agent'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Chat */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[85%] p-3 border text-sm
                                ${msg.sender === 'user'
                                    ? 'border-accent bg-[rgba(var(--accent-rgb),0.08)] text-[var(--text-primary)] rounded-tr-none'
                                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)] rounded-tl-none'}
                            `}
                        >
                            <div className="text-[10px] uppercase tracking-widest mb-1.5 flex items-center gap-1.5 text-[var(--text-faint)]">
                                {msg.sender === 'ai' && <Cpu size={10} />}
                                {msg.sender === 'user' ? 'You' : 'Holo-AI'}
                            </div>
                            <div className="whitespace-pre-line leading-relaxed">{msg.text}</div>
                            {msg.actions && msg.actions.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-[var(--border)] flex flex-wrap gap-1">
                                    {msg.actions.map((a, i) => (
                                        <span key={i} className="inline-flex items-center gap-1 text-[10px] uppercase tracking-widest text-accent">
                                            <Zap size={10} />
                                            {actionLabel(a)}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start">
                        <div className="border border-[var(--border)] bg-[var(--surface)] p-3 rounded-tl-none flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}

                {messages.length === 1 && !isThinking && (
                    <div className="pt-2 flex flex-wrap gap-2">
                        {SUGGESTED_PROMPTS.map(prompt => (
                            <button
                                key={prompt}
                                onClick={() => sendMessage(prompt)}
                                className="px-3 py-1.5 border border-[var(--border)] text-xs text-[var(--text-muted)] hover:border-accent hover:text-accent transition-colors"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-[var(--surface)] border-t border-[var(--border)] flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Ask, or tell me what to open…"
                    className="flex-1 bg-[var(--surface-inset)] border border-[var(--border)] focus:border-accent px-3 py-2 outline-none text-sm placeholder:text-[var(--text-faint)] transition-colors"
                    disabled={isThinking}
                    aria-label="Ask Holo-AI"
                />
                <button
                    onClick={handleSend}
                    disabled={isThinking || !input.trim()}
                    className="px-3 border border-accent bg-accent text-black hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Send"
                >
                    <Send size={16} />
                </button>
            </div>
        </div>
    );
};

const actionLabel = (a: HoloAction): string => {
    switch (a.type) {
        case 'open_window': return `open ${a.id}`;
        case 'close_window': return `close ${a.id}`;
        case 'focus_window': return `focus ${a.id}`;
        case 'minimize_all': return 'minimize all';
        case 'close_all': return 'close all';
        case 'open_project': return `project: ${a.id}`;
    }
};

export default NeuralNet;
