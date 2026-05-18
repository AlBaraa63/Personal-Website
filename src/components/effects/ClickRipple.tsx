import { useEffect, useState, useCallback } from 'react';

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

    const handleClick = useCallback((e: MouseEvent) => {
        const ripple: Ripple = { id: nextId++, x: e.clientX, y: e.clientY };
        setRipples(prev => [...prev, ripple]);
        // Auto-cleanup after animation completes
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== ripple.id));
        }, 700);
    }, []);

    useEffect(() => {
        window.addEventListener('click', handleClick, true);
        return () => window.removeEventListener('click', handleClick, true);
    }, [handleClick]);

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
