import { useEffect, useState, useCallback } from 'react';
import { usePrefersReducedMotion } from './useReducedMotion';

interface Ripple {
    id: number;
    x: number;
    y: number;
}

let nextId = 0;

/**
 * Every click spawns an expanding HUD-styled ring ripple at the click position.
 * Pure CSS animations — no canvas overhead.
 */
const ClickRipple: React.FC = () => {
    const [ripples, setRipples] = useState<Ripple[]>([]);
    const prefersReducedMotion = usePrefersReducedMotion();

    const handleClick = useCallback((e: MouseEvent) => {
        const ripple: Ripple = { id: nextId++, x: e.clientX, y: e.clientY };
        setRipples(prev => [...prev, ripple]);
        // Auto-cleanup after animation completes
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== ripple.id));
        }, 700);
    }, []);

    useEffect(() => {
        // Expanding ring is a continuous motion effect — skip it entirely for reduced-motion users.
        if (prefersReducedMotion) return;
        window.addEventListener('click', handleClick, true);
        return () => window.removeEventListener('click', handleClick, true);
    }, [handleClick, prefersReducedMotion]);

    if (ripples.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[45]" aria-hidden>
            {ripples.map(r => (
                <div
                    key={r.id}
                    className="click-ripple-ring"
                    style={{
                        left: r.x,
                        top: r.y,
                    }}
                />
            ))}
        </div>
    );
};

export default ClickRipple;
