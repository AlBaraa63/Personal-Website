import React, { useEffect, useState, useCallback } from 'react';

interface CustomCursorProps {
    enabled?: boolean;
}

const CustomCursor: React.FC<CustomCursorProps> = ({ enabled = true }) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [dotPosition, setDotPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);

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

    const handleMouseMove = useCallback((e: MouseEvent) => {
        // Smooth ring cursor
        setPosition(prev => ({
            x: prev.x + (e.clientX - prev.x) * 0.15,
            y: prev.y + (e.clientY - prev.y) * 0.15
        }));

        // Instant dot cursor
        setDotPosition({ x: e.clientX, y: e.clientY });

        if (!isVisible) setIsVisible(true);
    }, [isVisible]);

    const handleMouseEnter = useCallback(() => setIsVisible(true), []);
    const handleMouseLeave = useCallback(() => setIsVisible(false), []);

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
            setDotPosition({ x: e.clientX, y: e.clientY });
            if (!isVisible) setIsVisible(true);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseenter', handleMouseEnter);
        document.addEventListener('mouseleave', handleMouseLeave);
        animationId = requestAnimationFrame(animate);

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
            observer.disconnect();
        };
    }, [enabled, isTouchDevice, isVisible, handleMouseEnter, handleMouseLeave]);

    // Don't render on touch devices or when disabled
    if (!enabled || isTouchDevice) return null;

    return (
        <>
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
