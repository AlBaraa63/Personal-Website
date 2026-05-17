import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Gamepad2, Zap } from 'lucide-react';
import { useSound } from '@/context/SoundContext';

const CELL_SIZE = 20;

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    size: number;
}

// Single-accent palette — read once at mount; live accent changes refresh on next frame.
const readAccent = () => {
    if (typeof window === 'undefined') return '#22c55e';
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#22c55e';
};

const RetroGrid: React.FC = () => {
    const { playSound } = useSound();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('retro_score') || '0', 10));
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const snakeRef = useRef([{ x: 10, y: 10 }]);
    const foodRef = useRef({ x: 15, y: 15 });
    const dirRef = useRef({ x: 1, y: 0 });
    const nextDirRef = useRef({ x: 1, y: 0 });
    const speedRef = useRef(150);
    const particlesRef = useRef<Particle[]>([]);
    const shakeRef = useRef(0);
    const accentRef = useRef(readAccent());

    useEffect(() => {
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('retro_score', score.toString());
        }
    }, [score, highScore]);

    const initGame = () => {
        snakeRef.current = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        spawnFood();
        dirRef.current = { x: 1, y: 0 };
        nextDirRef.current = { x: 1, y: 0 };
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        speedRef.current = 150;
        particlesRef.current = [];
        shakeRef.current = 0;
        accentRef.current = readAccent();
        playSound('boot');
    };

    const spawnFood = () => {
        const x = Math.floor(Math.random() * (600 / CELL_SIZE));
        const y = Math.floor(Math.random() * (400 / CELL_SIZE));
        foodRef.current = { x, y };
    };

    const createExplosion = (x: number, y: number) => {
        for (let i = 0; i < 20; i++) {
            particlesRef.current.push({
                x: x * CELL_SIZE + CELL_SIZE / 2,
                y: y * CELL_SIZE + CELL_SIZE / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                size: Math.random() * 4 + 2,
            });
        }
    };

    const draw = (ctx: CanvasRenderingContext2D) => {
        const accent = accentRef.current;
        const shakeX = (Math.random() - 0.5) * shakeRef.current;
        const shakeY = (Math.random() - 0.5) * shakeRef.current;
        ctx.setTransform(1, 0, 0, 1, shakeX, shakeY);

        // Clear
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Grid lines
        ctx.strokeStyle = '#141414';
        ctx.lineWidth = 1;
        ctx.shadowBlur = 0;
        for (let i = 0; i < ctx.canvas.width; i += CELL_SIZE) {
            ctx.beginPath();
            ctx.moveTo(i, 0);
            ctx.lineTo(i, ctx.canvas.height);
            ctx.stroke();
        }
        for (let i = 0; i < ctx.canvas.height; i += CELL_SIZE) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(ctx.canvas.width, i);
            ctx.stroke();
        }

        // Food — pure white square, high contrast against the accent snake
        const pulse = Math.sin(Date.now() / 200) * 1.5;
        ctx.fillStyle = '#ffffff';
        ctx.shadowBlur = 16;
        ctx.shadowColor = '#ffffff';
        ctx.beginPath();
        const foodX = foodRef.current.x * CELL_SIZE + CELL_SIZE / 2;
        const foodY = foodRef.current.y * CELL_SIZE + CELL_SIZE / 2;
        ctx.arc(foodX, foodY, CELL_SIZE / 2 + pulse - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Snake — accent
        snakeRef.current.forEach((seg, i) => {
            ctx.fillStyle = i === 0 ? accent : accent;
            ctx.globalAlpha = i === 0 ? 1 : 0.7;
            ctx.shadowBlur = i === 0 ? 16 : 4;
            ctx.shadowColor = accent;
            const x = seg.x * CELL_SIZE;
            const y = seg.y * CELL_SIZE;
            const size = CELL_SIZE - 2;
            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, size, size, 3);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        // Particles — accent
        particlesRef.current.forEach(p => {
            ctx.fillStyle = accent;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    const update = () => {
        if (shakeRef.current > 0) shakeRef.current *= 0.9;
        if (shakeRef.current < 0.5) shakeRef.current = 0;

        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
            const p = particlesRef.current[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
            p.size *= 0.95;
            if (p.life <= 0) particlesRef.current.splice(i, 1);
        }

        const head = { ...snakeRef.current[0] };
        dirRef.current = nextDirRef.current;
        head.x += dirRef.current.x;
        head.y += dirRef.current.y;

        const cols = 600 / CELL_SIZE;
        const rows = 400 / CELL_SIZE;
        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            handleGameOver();
            shakeRef.current = 20;
            return;
        }
        if (snakeRef.current.some(s => s.x === head.x && s.y === head.y)) {
            handleGameOver();
            shakeRef.current = 20;
            return;
        }
        snakeRef.current.unshift(head);

        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
            setScore(s => s + 100);
            createExplosion(head.x, head.y);
            spawnFood();
            playSound('success');
            shakeRef.current = 5;
            if (speedRef.current > 40) speedRef.current -= 2;
        } else {
            snakeRef.current.pop();
        }
    };

    const handleGameOver = () => {
        setGameOver(true);
        setIsPlaying(false);
        playSound('error');
    };

    useEffect(() => {
        if (!isPlaying) return;
        let lastTime = 0;
        let accumulator = 0;
        let raf = 0;
        const loop = (timestamp: number) => {
            if (!lastTime) lastTime = timestamp;
            const dt = timestamp - lastTime;
            lastTime = timestamp;
            accumulator += dt;
            while (accumulator > speedRef.current) {
                update();
                accumulator -= speedRef.current;
            }
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) draw(ctx);
            }
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying]);

    useEffect(() => {
        if (!isPlaying && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) draw(ctx);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isPlaying, gameOver]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (!isPlaying) return;
            switch (e.key) {
                case 'ArrowUp': if (dirRef.current.y !== 1) nextDirRef.current = { x: 0, y: -1 }; break;
                case 'ArrowDown': if (dirRef.current.y !== -1) nextDirRef.current = { x: 0, y: 1 }; break;
                case 'ArrowLeft': if (dirRef.current.x !== 1) nextDirRef.current = { x: -1, y: 0 }; break;
                case 'ArrowRight': if (dirRef.current.x !== -1) nextDirRef.current = { x: 1, y: 0 }; break;
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [isPlaying]);

    return (
        <div className="h-full flex flex-col bg-[var(--surface-inset)] overflow-hidden relative font-mono select-none">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-[var(--border)] bg-[var(--surface)] z-10">
                <div className="flex items-center gap-2 text-accent">
                    <Gamepad2 size={20} />
                    <div className="flex flex-col leading-tight">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-faint)]">// easter_egg.exe</span>
                        <span className="font-bold tracking-widest text-sm">Neon Snake</span>
                    </div>
                </div>
                <div className="flex gap-5 text-sm">
                    <div className="flex flex-col items-end">
                        <span className="text-[var(--text-faint)] text-[10px] uppercase tracking-widest">Score</span>
                        <span className="text-lg font-bold text-[var(--text-primary)] tabular-nums tracking-wider">{score.toString().padStart(6, '0')}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-[var(--text-faint)] text-[10px] uppercase tracking-widest flex items-center gap-1"><Trophy size={9} /> High</span>
                        <span className="text-lg font-bold text-accent tabular-nums tracking-wider">{highScore.toString().padStart(6, '0')}</span>
                    </div>
                </div>
            </div>

            {/* Canvas */}
            <div className="flex-1 relative flex items-center justify-center bg-[#050505] overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="border border-[var(--border)] max-w-full max-h-full relative z-20"
                    style={{ boxShadow: '0 0 30px rgba(var(--accent-rgb), 0.08)' }}
                />

                {!isPlaying && !gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm z-50">
                        <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-faint)] mb-2">// easter_egg.exe</div>
                        <h1 className="text-3xl font-black text-[var(--text-primary)] mb-3 tracking-widest uppercase">
                            Neon <span className="text-accent">Snake</span>
                        </h1>
                        <p className="text-[var(--text-muted)] mb-8 font-mono text-xs uppercase tracking-widest">
                            Arrow keys · Collect food · Don't crash
                        </p>
                        <button
                            onClick={initGame}
                            className="flex items-center gap-2 px-8 py-3 bg-accent text-black font-bold uppercase tracking-widest hover:bg-[var(--accent-hover)] transition-colors"
                        >
                            <Play size={18} fill="currentColor" /> Start
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm z-40">
                        <h1 className="text-4xl font-black text-red-400 mb-3 tracking-widest uppercase">Game Over</h1>
                        <p className="text-[var(--text-muted)] mb-8 text-xl font-mono tabular-nums">Score: {score.toString().padStart(6, '0')}</p>
                        <button
                            onClick={initGame}
                            className="flex items-center gap-2 px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-black font-bold uppercase tracking-widest transition-colors"
                        >
                            <RotateCcw size={18} /> Retry
                        </button>
                    </div>
                )}
            </div>

            {/* Footer hint */}
            <div className="p-2 border-t border-[var(--border)] text-center text-[10px] text-[var(--text-faint)] flex justify-center gap-6 uppercase tracking-widest">
                <span className="flex items-center gap-1"><Zap size={10} /> Collect Energy</span>
                <span className="flex items-center gap-1"><Zap size={10} /> Avoid Walls</span>
            </div>
        </div>
    );
};

export default RetroGrid;
