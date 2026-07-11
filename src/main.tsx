import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Analytics } from '@vercel/analytics/react';
import App from './App.tsx';
import './index.css';

// Apply persisted user preferences (accent color, visual effects) to CSS variables
// before React mounts so the first paint reflects the user's actual choice.
(() => {
    const root = document.documentElement;
    const accentMap: Record<string, string> = {
        '#22c55e': '34, 197, 94',
        '#00ff41': '0, 255, 65',
        '#00d4ff': '0, 212, 255',
        '#ff0080': '255, 0, 128',
        '#ff6600': '255, 102, 0',
        '#a855f7': '168, 85, 247',
        '#fbbf24': '251, 191, 36',
    };
    const savedAccent = localStorage.getItem('accentColor');
    if (savedAccent && accentMap[savedAccent]) {
        const rgb = accentMap[savedAccent];
        root.style.setProperty('--accent', savedAccent);
        root.style.setProperty('--accent-rgb', rgb);
        root.style.setProperty('--accent-glow', `rgba(${rgb}, 0.3)`);
        root.style.setProperty('--accent-dim', `rgba(${rgb}, 0.5)`);
    }
    const savedScanline = localStorage.getItem('scanlineIntensity');
    if (savedScanline) root.style.setProperty('--scanline-opacity', savedScanline);
    const savedBloom = localStorage.getItem('bloomStrength');
    if (savedBloom) root.style.setProperty('--bloom-strength', savedBloom);
    const savedBlur = localStorage.getItem('glassBlur');
    if (savedBlur) root.style.setProperty('--glass-blur', `${savedBlur}px`);
})();

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
        <Analytics />
    </StrictMode>
);
