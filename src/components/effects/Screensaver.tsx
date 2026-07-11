import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePrefersReducedMotion } from './useReducedMotion';

const IDLE_TIMEOUT = 30_000; // 30 seconds
const LOGO_W = 180;
const LOGO_H = 60;
const SPEED = 1.5;

const COLORS = [
    '#22c55e', '#06b6d4', '#a855f7', '#f59e0b', '#ef4444',
    '#ec4899', '#14b8a6', '#8b5cf6', '#f97316', '#3b82f6',
];

/**
 * DVD-logo screensaver — bouncing HOLO-OS logo after idle.
 * Any user input wakes the screen. Color changes on edge bounce.
 */
const Screensaver: React.FC = () => {
    const [active, setActive] = useState(false);
    const timerRef = useRef<number>(0);
    const posRef = useRef({ x: 100, y: 100 });
    const velRef = useRef({ vx: SPEED, vy: SPEED * 0.7 });
    const colorRef = useRef(0);
    const [, setColor] = useState(COLORS[0]);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef(0);
    const prefersReducedMotion = usePrefersReducedMotion();

    const resetTimer = useCallback(() => {
        if (active) {
            setActive(false);
            return;
        }
        window.clearTimeout(timerRef.current);
        timerRef.current = window.setTimeout(() => setActive(true), IDLE_TIMEOUT);
    }, [active]);

    useEffect(() => {
        // The DVD-bounce screensaver is pure continuous motion — disable entirely
        // for reduced-motion users rather than ever activating it.
        if (prefersReducedMotion) return;
        const events = ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
        // Start initial timer
        timerRef.current = window.setTimeout(() => setActive(true), IDLE_TIMEOUT);
        return () => {
            events.forEach(e => window.removeEventListener(e, resetTimer));
            window.clearTimeout(timerRef.current);
        };
    }, [resetTimer, prefersReducedMotion]);

    // Animation loop
    useEffect(() => {
        if (!active || prefersReducedMotion) {
            cancelAnimationFrame(rafRef.current);
            return;
        }

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Reset position to center
        posRef.current = {
            x: canvas.width / 2 - LOGO_W / 2,
            y: canvas.height / 2 - LOGO_H / 2,
        };

        const draw = () => {
            const { width: W, height: H } = canvas;
            ctx.clearRect(0, 0, W, H);

            // Move
            posRef.current.x += velRef.current.vx;
            posRef.current.y += velRef.current.vy;

            // Bounce
            let bounced = false;
            if (posRef.current.x <= 0 || posRef.current.x + LOGO_W >= W) {
                velRef.current.vx *= -1;
                posRef.current.x = Math.max(0, Math.min(posRef.current.x, W - LOGO_W));
                bounced = true;
            }
            if (posRef.current.y <= 0 || posRef.current.y + LOGO_H >= H) {
                velRef.current.vy *= -1;
                posRef.current.y = Math.max(0, Math.min(posRef.current.y, H - LOGO_H));
                bounced = true;
            }
            if (bounced) {
                colorRef.current = (colorRef.current + 1) % COLORS.length;
                setColor(COLORS[colorRef.current]);
            }

            const c = COLORS[colorRef.current];
            const x = posRef.current.x;
            const y = posRef.current.y;

            // Draw glow
            ctx.shadowBlur = 30;
            ctx.shadowColor = c;

            // Draw HOLO-OS text
            ctx.font = 'bold 28px "JetBrains Mono", monospace';
            ctx.fillStyle = c;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('HOLO-OS', x + LOGO_W / 2, y + LOGO_H / 2 - 6);

            // Draw subtitle
            ctx.shadowBlur = 0;
            ctx.font = '10px "JetBrains Mono", monospace';
            ctx.fillStyle = `${c}88`;
            ctx.fillText('// move to wake', x + LOGO_W / 2, y + LOGO_H / 2 + 16);

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [active, prefersReducedMotion]);

    return (
        <AnimatePresence>
            {active && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="fixed inset-0 z-[400] bg-black"
                    onClick={() => setActive(false)}
                >
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 w-full h-full"
                    />
                    {/* CRT scanline overlay */}
                    <div
                        aria-hidden
                        className="absolute inset-0 pointer-events-none opacity-10"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Screensaver;
