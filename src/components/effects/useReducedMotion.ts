import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Tracks the user's `prefers-reduced-motion` OS/browser preference.
 * Effect components should use this to skip or simplify continuous
 * canvas/DOM animations for accessibility.
 */
export const usePrefersReducedMotion = (): boolean => {
    const [prefersReduced, setPrefersReduced] = useState(() =>
        typeof window !== 'undefined' && window.matchMedia
            ? window.matchMedia(QUERY).matches
            : false
    );

    useEffect(() => {
        if (typeof window === 'undefined' || !window.matchMedia) return;
        const mql = window.matchMedia(QUERY);
        const handleChange = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
        mql.addEventListener('change', handleChange);
        return () => mql.removeEventListener('change', handleChange);
    }, []);

    return prefersReduced;
};

export default usePrefersReducedMotion;
