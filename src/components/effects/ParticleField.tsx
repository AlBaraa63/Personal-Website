import React, { useRef, useEffect, useState, useCallback } from 'react';

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    alpha: number;
    depth: number;
}

interface ParticleFieldProps {
    particleCount?: number;
    className?: string;
}

const ParticleField: React.FC<ParticleFieldProps> = ({
    particleCount = 60,
    className = ''
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number>();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Colors based on accent
    const colors = [
        'rgba(0, 255, 65, 0.6)',   // Accent green
        'rgba(0, 200, 255, 0.5)',   // Cyan
        'rgba(160, 0, 255, 0.4)',   // Purple
        'rgba(255, 255, 255, 0.3)', // White
    ];

    const initParticles = useCallback((width: number, height: number) => {
        const particles: Particle[] = [];
        for (let i = 0; i < particleCount; i++) {
            const depth = Math.random() * 0.8 + 0.2; // 0.2 to 1.0
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3 * depth,
                vy: (Math.random() - 0.5) * 0.3 * depth,
                radius: Math.random() * 2 + 1 * depth,
                color: colors[Math.floor(Math.random() * colors.length)],
                alpha: Math.random() * 0.5 + 0.2,
                depth,
            });
        }
        return particles;
    }, [particleCount]);

    const handleResize = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const width = window.innerWidth;
        const height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;
        setDimensions({ width, height });

        particlesRef.current = initParticles(width, height);
    }, [initParticles]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    }, []);

    useEffect(() => {
        handleResize();
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [handleResize, handleMouseMove]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const animate = () => {
            ctx.clearRect(0, 0, dimensions.width, dimensions.height);

            const particles = particlesRef.current;
            const mouse = mouseRef.current;

            // Update and draw particles
            particles.forEach((particle, i) => {
                // Mouse influence (parallax based on depth)
                const parallaxX = (mouse.x - dimensions.width / 2) * 0.01 * particle.depth;
                const parallaxY = (mouse.y - dimensions.height / 2) * 0.01 * particle.depth;

                // Update position
                particle.x += particle.vx + parallaxX * 0.1;
                particle.y += particle.vy + parallaxY * 0.1;

                // Wrap around edges
                if (particle.x < 0) particle.x = dimensions.width;
                if (particle.x > dimensions.width) particle.x = 0;
                if (particle.y < 0) particle.y = dimensions.height;
                if (particle.y > dimensions.height) particle.y = 0;

                // Draw particle
                ctx.beginPath();
                ctx.arc(
                    particle.x + parallaxX,
                    particle.y + parallaxY,
                    particle.radius,
                    0,
                    Math.PI * 2
                );
                ctx.fillStyle = particle.color;
                ctx.fill();

                // Draw connections to nearby particles
                particles.slice(i + 1).forEach(other => {
                    const dx = particle.x - other.x;
                    const dy = particle.y - other.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x + parallaxX, particle.y + parallaxY);
                        ctx.lineTo(
                            other.x + (mouse.x - dimensions.width / 2) * 0.01 * other.depth,
                            other.y + (mouse.y - dimensions.height / 2) * 0.01 * other.depth
                        );
                        const opacity = (1 - distance / 120) * 0.2 * Math.min(particle.depth, other.depth);
                        ctx.strokeStyle = `rgba(0, 255, 65, ${opacity})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        if (dimensions.width > 0 && dimensions.height > 0) {
            animate();
        }

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [dimensions]);

    return (
        <canvas
            ref={canvasRef}
            className={`fixed inset-0 pointer-events-none z-0 ${className}`}
            style={{ opacity: 0.7 }}
        />
    );
};

export default ParticleField;
