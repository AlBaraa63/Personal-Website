import { useEffect, useState, useRef, useCallback } from 'react';
import { useAchievements } from '@/context/AchievementContext';
import { useSound } from '@/context/SoundContext';
import { usePrefersReducedMotion } from './useReducedMotion';

const KONAMI_SEQUENCE = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a',
];

/**
 * Konami Code detector. When the sequence is entered, triggers Matrix Mode:
 * - Dense matrix rain canvas overlay fills the screen
 * - All text gets an RGB-split glitch
 * - Dramatic sound plays
 * - Lasts ~8 seconds, then fades
 * - Unlocks "The One" achievement
 */
const KonamiCode: React.FC = () => {
    const [active, setActive] = useState(false);
    const inputRef = useRef<string[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { unlock } = useAchievements();
    const { playSound } = useSound();
    const prefersReducedMotion = usePrefersReducedMotion();

    const triggerMatrix = useCallback(() => {
        if (active) return;
        setActive(true);
        unlock('the-one');

        // Dramatic boot sound
        playSound('boot');
        setTimeout(() => playSound('success'), 300);

        // Add matrix-mode class to html — skip the RGB-glitch styling for reduced-motion users.
        if (!prefersReducedMotion) {
            document.documentElement.classList.add('matrix-mode');
        }

        // Auto-dismiss
        setTimeout(() => {
            setActive(false);
            document.documentElement.classList.remove('matrix-mode');
        }, 8000);
    }, [active, unlock, playSound, prefersReducedMotion]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            inputRef.current.push(e.key);
            // Keep only last N keys
            if (inputRef.current.length > KONAMI_SEQUENCE.length) {
                inputRef.current = inputRef.current.slice(-KONAMI_SEQUENCE.length);
            }
            // Check match
            if (inputRef.current.length === KONAMI_SEQUENCE.length) {
                const match = inputRef.current.every((k, i) => k === KONAMI_SEQUENCE[i]);
                if (match) {
                    inputRef.current = [];
                    triggerMatrix();
                }
            }
        };
        window.addEventListener('keydown', handleKey);
        return () => window.removeEventListener('keydown', handleKey);
    }, [triggerMatrix]);

    // Canvas-based Matrix rain
    useEffect(() => {
        if (!active || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const fontSize = 14;
        const columns = Math.ceil(canvas.width / fontSize);
        const drops: number[] = Array(columns).fill(0).map(() => Math.random() * -100);
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF';

        let raf = 0;
        const draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const char = chars.charAt(Math.floor(Math.random() * chars.length));
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                // Head character is bright white
                if (Math.random() > 0.95) {
                    ctx.fillStyle = '#ffffff';
                    ctx.shadowBlur = 20;
                    ctx.shadowColor = '#00ff41';
                } else {
                    ctx.fillStyle = `rgba(34, 197, 94, ${0.5 + Math.random() * 0.5})`;
                    ctx.shadowBlur = 0;
                }

                ctx.fillText(char, x, y);
                ctx.shadowBlur = 0;

                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }
            // Reduced motion: render a single static frame instead of a continuous loop.
            if (!prefersReducedMotion) {
                raf = requestAnimationFrame(draw);
            }
        };

        raf = requestAnimationFrame(draw);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', handleResize);
        };
    }, [active, prefersReducedMotion]);

    if (!active) return null;

    return (
        <div className="fixed inset-0 z-[500] pointer-events-none">
            {/* Dense matrix rain — static single frame when reduced motion is preferred */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full"
                style={{ opacity: 0.85, mixBlendMode: 'screen' }}
            />
            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <div
                    className={`text-accent text-4xl sm:text-6xl font-black tracking-[0.4em] uppercase font-mono ${prefersReducedMotion ? '' : 'animate-pulse'}`}
                    style={{
                        textShadow: prefersReducedMotion
                            ? '0 0 20px rgba(34,197,94,0.7)'
                            : '0 0 30px rgba(34,197,94,0.9), 0 0 60px rgba(34,197,94,0.5), -3px 0 #ff0040, 3px 0 #00ffff',
                    }}
                >
                    THE MATRIX
                </div>
            </div>
        </div>
    );
};

export default KonamiCode;
