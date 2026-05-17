import React from 'react';
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
    return (
        <motion.button
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            onMouseEnter={onHover}
            aria-pressed={isActive}
            aria-label={`${label} — ${sublabel}`}
            className="group relative flex flex-col items-center gap-2.5 sm:gap-3 select-none focus-visible:outline-none"
        >
            {/* The tile */}
            <div
                className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center
                           transition-shadow duration-300"
                style={{
                    background: `linear-gradient(135deg, rgba(${colorRgb}, 0.16) 0%, rgba(${colorRgb}, 0.04) 100%)`,
                    border: `1px solid rgba(${colorRgb}, ${isActive ? 0.85 : 0.45})`,
                    color: color,
                    boxShadow: isActive
                        ? `0 0 28px rgba(${colorRgb}, 0.45), inset 0 0 24px rgba(${colorRgb}, 0.08)`
                        : `0 8px 32px rgba(0, 0, 0, 0.45), inset 0 0 24px rgba(${colorRgb}, 0.05)`,
                }}
            >
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
