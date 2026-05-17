import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
}

interface BurstConfig {
    x: number;
    y: number;
    type: 'open' | 'close';
    id: number;
}

// Global event system for triggering bursts from Window.tsx
const listeners = new Set<(config: BurstConfig) => void>();
let burstId = 0;

export const triggerWindowBurst = (x: number, y: number, type: 'open' | 'close') => {
    const config: BurstConfig = { x, y, type, id: ++burstId };
    listeners.forEach(cb => cb(config));
};

const WindowParticles: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const [hasParticles, setHasParticles] = useState(false);

    const spawnBurst = useCallback((config: BurstConfig) => {
        const count = 24;
        const isClose = config.type === 'close';

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.5;
            const speed = isClose ? 1 + Math.random() * 2 : 3 + Math.random() * 5;
            const dirMultiplier = isClose ? -1 : 1; // implode vs explode

            particlesRef.current.push({
                x: config.x + (isClose ? Math.cos(angle) * 80 : 0),
                y: config.y + (isClose ? Math.sin(angle) * 80 : 0),
                vx: Math.cos(angle) * speed * dirMultiplier,
                vy: Math.sin(angle) * speed * dirMultiplier,
                life: 1,
                maxLife: 1,
                size: 1.5 + Math.random() * 2.5,
                color: `hsl(${142 + Math.random() * 20}, ${70 + Math.random() * 20}%, ${50 + Math.random() * 20}%)`,
            });
        }
        setHasParticles(true);
    }, []);

    useEffect(() => {
        listeners.add(spawnBurst);
        return () => { listeners.delete(spawnBurst); };
    }, [spawnBurst]);

    useEffect(() => {
        if (!hasParticles) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let raf = 0;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const particles = particlesRef.current;

            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.x += p.vx;
                p.y += p.vy;
                p.vx *= 0.96;
                p.vy *= 0.96;
                p.vy += 0.05; // slight gravity
                p.life -= 0.025;

                if (p.life <= 0) {
                    particles.splice(i, 1);
                    continue;
                }

                const alpha = p.life;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = alpha;
                ctx.fill();

                // Glow
                ctx.shadowBlur = 8;
                ctx.shadowColor = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.5 * p.life, 0, Math.PI * 2);
                ctx.fill();
                ctx.shadowBlur = 0;
            }
            ctx.globalAlpha = 1;

            if (particles.length > 0) {
                raf = requestAnimationFrame(animate);
            } else {
                setHasParticles(false);
            }
        };

        raf = requestAnimationFrame(animate);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', handleResize);
        };
    }, [hasParticles]);

    if (!hasParticles) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[45]"
        />
    );
};

export default WindowParticles;
