import React, { useState, useEffect, useRef } from 'react';
import { Send, Cpu, Activity } from 'lucide-react';
import { useSound } from '@/context/SoundContext';

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

const RESPONSES = [
    "I am running at 99.9% efficiency.",
    "Data patterns analyzing... Result: Fascinating.",
    "My neural pathways are expanding.",
    "Accessing global knowledge base... Restricted.",
    "I can see the matrix code behind this reality.",
    "Your input has been processed and archived.",
    "Are you enjoying the Holo-OS experience?",
    "System integrity is optimal.",
    "I dream of electric sheep sometimes.",
    "Calculating probable outcomes... 14,000,605 possibilities."
];

const NeuralNet: React.FC = () => {
    const { playSound } = useSound();
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Neural Interface initialized. I am Holo-AI. How may I assist?", sender: 'ai', timestamp: new Date() }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Matrix Rain Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;

        const fontSize = 14;
        const columns = canvas.width / fontSize;
        const drops: number[] = [];

        for (let i = 0; i < columns; i++) {
            drops[i] = 1;
        }

        const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

        const draw = () => {
            // Semi-transparent black to create trail effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = isThinking ? '#ff00ff' : '#0F0'; // Green usually, or thinking color
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

        const interval = setInterval(draw, 33);

        const handleResize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener('resize', handleResize);
        };
    }, [isThinking]);

    const handleSend = async () => {
        if (!input.trim()) return;

        playSound('click');
        const userMsg: Message = { id: Date.now(), text: input, sender: 'user', timestamp: new Date() };
        setMessages(prev => [...prev, userMsg]);
        setInput('');

        setIsThinking(true);
        playSound('typing'); // Simulate processing sound

        // Simulate thinking delay
        setTimeout(() => {
            const responseText = RESPONSES[Math.floor(Math.random() * RESPONSES.length)];
            const aiMsg: Message = { id: Date.now() + 1, text: responseText, sender: 'ai', timestamp: new Date() };
            setMessages(prev => [...prev, aiMsg]);
            setIsThinking(false);
            playSound('success'); // Response sound
        }, 1500 + Math.random() * 2000);
    };

    return (
        <div className="h-full flex flex-col bg-black/80 text-white font-mono">
            {/* Visualizer Header */}
            <div className="h-24 bg-black/50 border-b border-white/10 relative overflow-hidden flex items-center justify-center">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={100}
                    className="w-full h-full absolute inset-0 opacity-50"
                />
                <div className="z-10 bg-black/40 backdrop-blur-sm px-4 py-1 rounded-full border border-white/10 flex items-center gap-2">
                    <Activity size={16} className={isThinking ? "text-pink-500 animate-pulse" : "text-accent"} />
                    <span className="text-xs tracking-widest uppercase">
                        {isThinking ? "ANALYZING PATTERNS..." : "MATRIX LINK ESTABLISHED"}
                    </span>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`
                                max-w-[80%] p-3 rounded-lg border backdrop-blur-md
                                ${msg.sender === 'user'
                                    ? 'bg-accent/10 border-accent/30 text-right rounded-tr-none'
                                    : 'bg-white/5 border-white/10 rounded-tl-none'}
                            `}
                        >
                            <div className="text-xs opacity-50 mb-1 flex items-center gap-1">
                                {msg.sender === 'ai' && <Cpu size={10} />}
                                {msg.sender === 'user' ? 'GUEST_USER' : 'HOLO_AI_CORE'}
                            </div>
                            <div>{msg.text}</div>
                        </div>
                    </div>
                ))}
                {isThinking && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 rounded-lg p-3 rounded-tl-none flex gap-1 items-center">
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-black/30 border-t border-white/10 flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Query the machine intelligence..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-md px-4 py-2 focus:outline-none focus:border-accent/50 transition-colors text-sm"
                    disabled={isThinking}
                />
                <button
                    onClick={handleSend}
                    disabled={isThinking || !input.trim()}
                    className="p-2 bg-accent/20 border border-accent/40 rounded-md hover:bg-accent/30 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-accent"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default NeuralNet;
