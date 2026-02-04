import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, Trophy, Gamepad2, Zap } from 'lucide-react';
import { useSound } from '@/context/SoundContext';

const CELL_SIZE = 20;

// Particle System Types
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
    size: number;
}

const RetroGrid: React.FC = () => {
    const { playSound } = useSound();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('retro_score') || '0'));
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    // Game state refs (to avoid closure staleness in game loop)
    const snakeRef = useRef([{ x: 10, y: 10 }]);
    const foodRef = useRef({ x: 15, y: 15 });
    const dirRef = useRef({ x: 1, y: 0 });
    const nextDirRef = useRef({ x: 1, y: 0 });
    const speedRef = useRef(150);
    const particlesRef = useRef<Particle[]>([]);
    const shakeRef = useRef(0); // Screen shake intensity

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
        playSound('boot');
    };

    const spawnFood = () => {
        const x = Math.floor(Math.random() * (600 / CELL_SIZE));
        const y = Math.floor(Math.random() * (400 / CELL_SIZE));
        foodRef.current = { x, y };
    };

    const createExplosion = (x: number, y: number, color: string) => {
        for (let i = 0; i < 20; i++) {
            particlesRef.current.push({
                x: x * CELL_SIZE + CELL_SIZE / 2,
                y: y * CELL_SIZE + CELL_SIZE / 2,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                life: 1.0,
                color: color,
                size: Math.random() * 4 + 2
            });
        }
    };

    const draw = (ctx: CanvasRenderingContext2D) => {
        // Apply Shake Apply
        const shakeX = (Math.random() - 0.5) * shakeRef.current;
        const shakeY = (Math.random() - 0.5) * shakeRef.current;

        ctx.setTransform(1, 0, 0, 1, shakeX, shakeY);

        // Clear
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        // Draw Retro Grid Background
        ctx.strokeStyle = '#222';
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

        // Draw Food (Pulse Effect)
        ctx.fillStyle = '#ff00ff';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ff00ff';
        const pulse = Math.sin(Date.now() / 200) * 2;
        ctx.beginPath();
        const foodX = foodRef.current.x * CELL_SIZE + CELL_SIZE / 2;
        const foodY = foodRef.current.y * CELL_SIZE + CELL_SIZE / 2;
        ctx.arc(foodX, foodY, CELL_SIZE / 2 + pulse - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // Draw Snake
        snakeRef.current.forEach((seg, i) => {
            ctx.fillStyle = i === 0 ? '#00ff80' : '#00b359'; // Head is brighter
            ctx.shadowBlur = i === 0 ? 20 : 5;
            ctx.shadowColor = '#00ff80';

            // Draw rounded segments
            const x = seg.x * CELL_SIZE;
            const y = seg.y * CELL_SIZE;
            const size = CELL_SIZE - 2;
            const radius = 4;

            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, size, size, radius);
            ctx.fill();
        });
        ctx.shadowBlur = 0;

        // Draw Particles
        particlesRef.current.forEach(p => {
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;

        // Reset Transform
        ctx.setTransform(1, 0, 0, 1, 0, 0);
    };

    const update = () => {
        // Decrease shake
        if (shakeRef.current > 0) shakeRef.current *= 0.9;
        if (shakeRef.current < 0.5) shakeRef.current = 0;

        // Update Particles
        for (let i = particlesRef.current.length - 1; i >= 0; i--) {
            const p = particlesRef.current[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.05;
            p.size *= 0.95;

            if (p.life <= 0) {
                particlesRef.current.splice(i, 1);
            }
        }

        const head = { ...snakeRef.current[0] };
        dirRef.current = nextDirRef.current;
        head.x += dirRef.current.x;
        head.y += dirRef.current.y;

        // Wall Collision
        const cols = 600 / CELL_SIZE;
        const rows = 400 / CELL_SIZE;
        if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
            handleGameOver();
            shakeRef.current = 20; // Big shake on crash
            return;
        }

        // Self Collision
        if (snakeRef.current.some(s => s.x === head.x && s.y === head.y)) {
            handleGameOver();
            shakeRef.current = 20;
            return;
        }

        snakeRef.current.unshift(head);

        // Food Collision
        if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
            setScore(s => s + 100); // Higher score for cooler game
            createExplosion(head.x, head.y, '#ff00ff');
            spawnFood();
            playSound('success');
            shakeRef.current = 5; // Small shake on eat
            // Speed up slightly
            if (speedRef.current > 40) speedRef.current -= 2;
        } else {
            snakeRef.current.pop();
        }
    };

    const handleGameOver = () => {
        setGameOver(true);
        setIsPlaying(false);
        playSound('error');
        // createExplosion(snakeRef.current[0].x, snakeRef.current[0].y, '#ff0000'); // Blood explosion?
    };

    // Game Loop (Using requestAnimationFrame based loop for smoother visuals)
    useEffect(() => {
        if (!isPlaying) return;

        let lastTime = 0;
        let accumulator = 0;
        let animationFrameId: number;

        const loop = (timestamp: number) => {
            if (!lastTime) lastTime = timestamp;
            const deltaTime = timestamp - lastTime;
            lastTime = timestamp;

            // Fixed time step update for game logic
            accumulator += deltaTime;
            while (accumulator > speedRef.current) {
                update();
                accumulator -= speedRef.current;
            }

            // Render every frame (interpolation would be better but simple integer grid is fine)
            // Just ensure we draw particles every frame
            const canvas = canvasRef.current;
            if (canvas) {
                const ctx = canvas.getContext('2d');
                if (ctx) draw(ctx);
            }

            animationFrameId = requestAnimationFrame(loop);
        };

        animationFrameId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isPlaying, gameOver]); // Re-start loop if speed changes? No, speed is ref.

    // Static Draw & Resize
    useEffect(() => {
        if (!isPlaying && canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) draw(ctx);
        }
    }, [isPlaying, gameOver]);


    // Controls
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
        <div className="h-full flex flex-col bg-black overflow-hidden relative font-mono select-none">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-white/5 backdrop-blur-md z-10">
                <div className="flex items-center gap-2 text-accent">
                    <Gamepad2 size={24} />
                    <span className="font-bold tracking-widest">RETRO_GRID.EXE</span>
                </div>
                <div className="flex gap-6 text-sm">
                    <div className="flex flex-col items-end">
                        <span className="text-white/50 text-xs">SCORE</span>
                        <span className="text-xl font-bold text-white tracking-widest">{score.toString().padStart(6, '0')}</span>
                    </div>
                    <div className="flex flex-col items-end">
                        <span className="text-white/50 text-xs flex items-center gap-1"><Trophy size={10} /> HIGH</span>
                        <span className="text-xl font-bold text-yellow-500 tracking-widest">{highScore.toString().padStart(6, '0')}</span>
                    </div>
                </div>
            </div>

            {/* Game Canvas */}
            <div className="flex-1 relative flex items-center justify-center bg-[#050505] overflow-hidden">
                {/* CRT Scanline Overlay */}
                <div className="absolute inset-0 pointer-events-none z-30 opacity-10 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
                <div className="absolute inset-0 pointer-events-none z-30 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_2px,3px_100%]" />

                <canvas
                    ref={canvasRef}
                    width={600}
                    height={400}
                    className="border border-white/10 shadow-[0_0_50px_rgba(0,255,128,0.1)] rounded-lg max-w-full max-h-full relative z-20"
                />

                {/* Overlays */}
                {!isPlaying && !gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-50">
                        <h1 className="text-4xl font-black text-white mb-2 tracking-widest drop-shadow-[0_0_10px_rgba(0,255,128,0.8)] italic transform -skew-x-12">
                            NEON <span className="text-accent">SNAKE</span>
                        </h1>
                        <p className="text-white/60 mb-8 animate-pulse font-bold tracking-widest">PRESS START TO INITIALIZE</p>
                        <button
                            onClick={initGame}
                            className="flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-green-500 to-emerald-400 text-black text-lg font-black rounded-lg shadow-[0_0_30px_rgba(0,255,128,0.6)] hover:shadow-[0_0_50px_rgba(0,255,128,0.8)] hover:scale-110 transition-all uppercase tracking-widest border-2 border-white/20"
                        >
                            <Play size={24} fill="currentColor" /> START GAME
                        </button>
                    </div>
                )}

                {gameOver && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur-sm z-40 animate-in fade-in duration-300">
                        <h1 className="text-6xl font-black text-red-500 mb-2 tracking-widest drop-shadow-[0_0_20px_rgba(255,0,0,0.8)] glitch-text">GAME OVER</h1>
                        <p className="text-white/80 mb-8 text-2xl font-mono">SCORE: {score}</p>
                        <button
                            onClick={initGame}
                            className="flex items-center gap-2 px-8 py-3 bg-white text-black font-bold rounded hover:scale-105 transition-all shadow-lg"
                        >
                            <RotateCcw size={20} /> RETRY
                        </button>
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="p-2 border-t border-white/10 text-center text-xs text-white/40 flex justify-center gap-8">
                <span className="flex items-center gap-1"><Zap size={10} /> COLLECT ENERGY</span>
                <span className="flex items-center gap-1"><Zap size={10} className="text-red-500" /> AVOID WALLS</span>
            </div>
        </div>
    );
};

export default RetroGrid;
