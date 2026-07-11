import { useEffect, useState } from 'react';
import { usePrefersReducedMotion } from './useReducedMotion';

/**
 * Classic CRT TV shutdown effect — when the user navigates away,
 * the screen collapses to a horizontal white line then a dot.
 * Uses CSS keyframes for the animation.
 */
const CRTShutdown: React.FC = () => {
    const [shutting, setShutting] = useState(false);
    const prefersReducedMotion = usePrefersReducedMotion();

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                setShutting(true);
            }
        };

        const handleBeforeUnload = () => {
            setShutting(true);
        };

        // Also trigger on back/forward cache restore
        const handlePageShow = (e: PageTransitionEvent) => {
            if (e.persisted) {
                setShutting(false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('pageshow', handlePageShow);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('pageshow', handlePageShow);
        };
    }, []);

    // Reset when tab becomes visible again
    useEffect(() => {
        const handleFocus = () => {
            if (shutting) setShutting(false);
        };
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') handleFocus();
        });
    }, [shutting]);

    if (!shutting || prefersReducedMotion) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none crt-shutdown-overlay" aria-hidden>
            <div className="crt-shutdown-line" />
        </div>
    );
};

export default CRTShutdown;
