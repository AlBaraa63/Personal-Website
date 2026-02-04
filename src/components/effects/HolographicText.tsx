import React, { useState, useCallback } from 'react';

interface HolographicTextProps {
    children: string;
    className?: string;
    as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
    glitchOnHover?: boolean;
}

const HolographicText: React.FC<HolographicTextProps> = ({
    children,
    className = '',
    as: Tag = 'span',
    glitchOnHover = true,
}) => {
    const [isGlitching, setIsGlitching] = useState(false);

    const handleMouseEnter = useCallback(() => {
        if (glitchOnHover) {
            setIsGlitching(true);
            // Random glitch duration
            setTimeout(() => setIsGlitching(false), 300 + Math.random() * 200);
        }
    }, [glitchOnHover]);

    return (
        <Tag
            className={`relative inline-block ${className}`}
            onMouseEnter={handleMouseEnter}
        >
            {/* Main text */}
            <span
                className={`relative z-10 ${isGlitching ? 'animate-glitch-main' : ''}`}
                style={{
                    textShadow: isGlitching
                        ? '-2px 0 #ff0040, 2px 0 #00ffff'
                        : 'none',
                }}
            >
                {children}
            </span>

            {/* Red channel (left offset) */}
            <span
                aria-hidden="true"
                className={`absolute inset-0 text-red-500 opacity-0 ${isGlitching ? 'opacity-70 animate-glitch-red' : ''}`}
                style={{
                    transform: 'translateX(-2px)',
                    mixBlendMode: 'screen',
                }}
            >
                {children}
            </span>

            {/* Cyan channel (right offset) */}
            <span
                aria-hidden="true"
                className={`absolute inset-0 text-cyan-400 opacity-0 ${isGlitching ? 'opacity-70 animate-glitch-cyan' : ''}`}
                style={{
                    transform: 'translateX(2px)',
                    mixBlendMode: 'screen',
                }}
            >
                {children}
            </span>

            {/* Scanline overlay */}
            {isGlitching && (
                <span
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none overflow-hidden"
                >
                    <span
                        className="absolute w-full h-[2px] bg-white/20"
                        style={{
                            animation: 'hologram-scan 0.3s linear',
                            top: '0%',
                        }}
                    />
                </span>
            )}
        </Tag>
    );
};

export default HolographicText;
