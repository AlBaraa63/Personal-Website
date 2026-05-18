import React, { useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';

export interface BigDesktopIconConfig {
    id: string;
    label: string;
    sublabel: string;
    icon: React.ReactNode;
    /** Hex or `#rgb` color used for the tile's tint, border, and glow. */
    color: string;
    /** RGB triple for opacity math (e.g. "6, 182, 212"). */
    colorRgb: string;
}

interface BigDesktopIconProps extends BigDesktopIconConfig {
    isOpen: boolean;
    isActive: boolean;
    onClick: () => void;
    onHover?: () => void;
    /** Optional animation delay (seconds) so a row can stagger in. */
    delay?: number;
}

const BigDesktopIcon: React.FC<BigDesktopIconProps> = ({
    label,
    sublabel,
    icon,
    color,
    colorRgb,
    isOpen,
    isActive,
    onClick,
    onHover,
    delay = 0,
}) => {
    const tileRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
    const [glare, setGlare] = useState({ x: 50, y: 50 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
        const tile = tileRef.current;
        if (!tile) return;
        const rect = tile.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;   // 0..1
        const y = (e.clientY - rect.top) / rect.height;    // 0..1
        const tiltX = (0.5 - y) * 20;  // ±10 degrees
        const tiltY = (x - 0.5) * 20;  // ±10 degrees
        setTilt({ rotateX: tiltX, rotateY: tiltY });
        setGlare({ x: x * 100, y: y * 100 });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setTilt({ rotateX: 0, rotateY: 0 });
        setGlare({ x: 50, y: 50 });
        setIsHovered(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
        onHover?.();
    }, [onHover]);

    return (
        <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            aria-pressed={isActive}
            aria-label={`${label} — ${sublabel}`}
            className="group relative flex flex-col items-center gap-2.5 sm:gap-3 select-none focus-visible:outline-none"
            style={{ perspective: '800px' }}
        >
            {/* The tile — with 3D tilt */}
            <div
                ref={tileRef}
                className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center
                           transition-shadow duration-300 will-change-transform"
                style={{
                    background: `linear-gradient(135deg, rgba(${colorRgb}, 0.16) 0%, rgba(${colorRgb}, 0.04) 100%)`,
                    border: `1px solid rgba(${colorRgb}, ${isActive ? 0.85 : 0.45})`,
                    color: color,
                    boxShadow: isActive
                        ? `0 0 28px rgba(${colorRgb}, 0.45), inset 0 0 24px rgba(${colorRgb}, 0.08)`
                        : isHovered
                            ? `0 12px 40px rgba(${colorRgb}, 0.35), 0 0 20px rgba(${colorRgb}, 0.15), inset 0 0 24px rgba(${colorRgb}, 0.05)`
                            : `0 8px 32px rgba(0, 0, 0, 0.45), inset 0 0 24px rgba(${colorRgb}, 0.05)`,
                    transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) ${isHovered ? 'translateY(-4px) scale(1.03)' : ''}`,
                    transition: isHovered
                        ? 'transform 0.08s ease-out, box-shadow 0.3s ease'
                        : 'transform 0.5s ease-out, box-shadow 0.3s ease',
                }}
            >
                {/* Holographic rainbow reflection overlay */}
                <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none opacity-0 transition-opacity duration-300"
                    style={{
                        opacity: isHovered ? 0.35 : 0,
                        background: `linear-gradient(
                            ${135 + tilt.rotateY * 3}deg,
                            rgba(255, 0, 128, 0.15) 0%,
                            rgba(255, 165, 0, 0.1) 20%,
                            rgba(255, 255, 0, 0.1) 35%,
                            rgba(0, 255, 128, 0.12) 50%,
                            rgba(0, 170, 255, 0.12) 65%,
                            rgba(128, 0, 255, 0.1) 80%,
                            rgba(255, 0, 128, 0.15) 100%
                        )`,
                        backgroundSize: '200% 200%',
                        backgroundPosition: `${glare.x}% ${glare.y}%`,
                        mixBlendMode: 'screen',
                    }}
                />

                {/* Specular glare — bright spot following cursor */}
                <div
                    aria-hidden
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        opacity: isHovered ? 0.6 : 0,
                        background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.25) 0%, transparent 60%)`,
                        transition: 'opacity 0.3s ease',
                    }}
                />

                {/* HUD corner brackets */}
                <span aria-hidden className="absolute -top-px -left-px w-2.5 h-2.5 border-t border-l" style={{ borderColor: color }} />
                <span aria-hidden className="absolute -top-px -right-px w-2.5 h-2.5 border-t border-r" style={{ borderColor: color }} />
                <span aria-hidden className="absolute -bottom-px -left-px w-2.5 h-2.5 border-b border-l" style={{ borderColor: color }} />
                <span aria-hidden className="absolute -bottom-px -right-px w-2.5 h-2.5 border-b border-r" style={{ borderColor: color }} />

                {/* Scanline shine on hover */}
                <span
                    aria-hidden
                    className="absolute inset-x-2 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
                />

                {/* The icon itself — large */}
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-110">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex items-center justify-center" style={{ color }}>
                        {icon}
                    </div>
                </div>

                {/* Open indicator — bottom dot */}
                {isOpen && (
                    <span
                        aria-hidden
                        className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-6 h-[2px]"
                        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
                    />
                )}

                {/* Active glow halo */}
                {isActive && (
                    <motion.span
                        aria-hidden
                        className="absolute inset-0 pointer-events-none"
                        animate={{ opacity: [0.4, 0.8, 0.4] }}
                        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                        style={{ boxShadow: `0 0 32px rgba(${colorRgb}, 0.6)` }}
                    />
                )}
            </div>

            {/* Labels */}
            <div className="text-center leading-tight">
                <div
                    className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] font-mono transition-colors"
                    style={{ color: isActive ? color : 'var(--text-primary)' }}
                >
                    {label}
                </div>
                <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-[var(--text-faint)] mt-0.5">
                    {sublabel}
                </div>
            </div>
        </motion.button>
    );
};

export default BigDesktopIcon;
