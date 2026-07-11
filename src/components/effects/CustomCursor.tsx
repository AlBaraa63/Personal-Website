import React, { useEffect, useState, useCallback, useRef } from 'react';
import { usePrefersReducedMotion } from './useReducedMotion';

interface CustomCursorProps {
    enabled?: boolean;
}

interface TrailDot {
    x: number;
    y: number;
    age: number;
}

const TRAIL_LENGTH = 12;
const TRAIL_INTERVAL = 16; // ~60fps

const CustomCursor: React.FC<CustomCursorProps> = ({ enabled = true }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const [trail, setTrail] = useState<TrailDot[]>([]);
    const lastPosRef = useRef({ x: 0, y: 0 });
    const trailTimerRef = useRef(0);
    const prefersReducedMotion = usePrefersReducedMotion();

    // Check for touch device on mount
    useEffect(() => {
        const checkTouchDevice = () => {
            setIsTouchDevice(
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0 ||
                window.matchMedia('(hover: none)').matches
            );
        };

        checkTouchDevice();
        window.addEventListener('resize', checkTouchDevice);
        return () => window.removeEventListener('resize', checkTouchDevice);
    }, []);

    const handleMouseEnter = useCallback(() => setIsVisible(true), []);
    const handleMouseLeave = useCallback(() => {
        setIsVisible(false);
        setTrail([]);
    }, []);

    useEffect(() => {
        if (!enabled || isTouchDevice) return;

        // Animation frame for smooth following
        let animationId: number;
        let lastX = 0;
        let lastY = 0;

        const animate = () => {
            setPosition(prev => {
                const newX = prev.x + (lastX - prev.x) * 0.12;
                const newY = prev.y + (lastY - prev.y) * 0.12;
                return { x: newX, y: newY };
            });
            animationId = requestAnimationFrame(animate);
        };

        const onMouseMove = (e: MouseEvent) => {
            lastX = e.clientX;
            lastY = e.clientY;
            lastPosRef.current = { x: e.clientX, y: e.clientY };
            setDotPosition({ x: e.clientX, y: e.clientY });
            // Reduced motion: snap the ring directly to the pointer instead of easing.
            if (prefersReducedMotion) setPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);
        if (!prefersReducedMotion) {
            animationId = requestAnimationFrame(animate);
        }

        // Trail (comet) update loop — skipped under reduced motion.
        if (!prefersReducedMotion) {
            trailTimerRef.current = window.setInterval(() => {
                setTrail(prev => {
                    const aged = prev.map(d => ({ ...d, age: d.age + 1 })).filter(d => d.age < TRAIL_LENGTH);
                    // Only add if cursor has moved
                    const last = aged[0];
                    const cur = lastPosRef.current;
                    if (!last || Math.abs(last.x - cur.x) > 2 || Math.abs(last.y - cur.y) > 2) {
                        return [{ x: cur.x, y: cur.y, age: 0 }, ...aged];
                    }
                    return aged;
                });
            }, TRAIL_INTERVAL);
        }

        // Detect hoverable elements
        const handleHoverableElements = () => {
            const hoverables = document.querySelectorAll('a, button, [role="button"], input, textarea, .hoverable');

            hoverables.forEach(el => {
                el.addEventListener('mouseenter', () => setIsHovering(true));
                el.addEventListener('mouseleave', () => setIsHovering(false));
            });
        };

        // Run once and observe for new elements
        handleHoverableElements();
        const observer = new MutationObserver(handleHoverableElements);
        observer.observe(document.body, { childList: true, subtree: true });

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseenter', handleMouseEnter);
            document.removeEventListener('mouseleave', handleMouseLeave);
            cancelAnimationFrame(animationId);
            clearInterval(trailTimerRef.current);
            observer.disconnect();
        };
    }, [enabled, isTouchDevice, isVisible, handleMouseEnter, handleMouseLeave, prefersReducedMotion]);

    // Don't render on touch devices or when disabled
    if (!enabled || isTouchDevice) return null;

    return (
        <>
            {/* Comet trail */}
            {trail.map((dot, i) => {
                const progress = dot.age / TRAIL_LENGTH; // 0 = newest, 1 = oldest
                const size = Math.max(1, 6 * (1 - progress));
                const opacity = (1 - progress) * 0.5;
                return (
                    <div
                        key={i}
                        className="cursor-trail-dot"
                        style={{
                            left: dot.x,
                            top: dot.y,
                            width: size,
                            height: size,
                            opacity: isVisible ? opacity : 0,
                            transform: 'translate(-50%, -50%)',
                        }}
                    />
                );
            })}

            {/* Ring cursor */}
            <div
                className={`custom-cursor ${isHovering ? 'hovering' : ''}`}
                style={{
                    left: position.x,
                    top: position.y,
                    transform: 'translate(-50%, -50%)',
                    opacity: isVisible ? 1 : 0,
                }}
            />

            {/* Dot cursor */}
            <div
                className="cursor-dot"
                style={{
                    left: dotPosition.x,
                    top: dotPosition.y,
                    transform: 'translate(-50%, -50%)',
                    opacity: isVisible ? 1 : 0,
                }}
            />
        </>
    );
};

export default CustomCursor;
