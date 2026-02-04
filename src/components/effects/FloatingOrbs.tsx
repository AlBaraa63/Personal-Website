import React from 'react';

interface FloatingOrbsProps {
    className?: string;
}

const FloatingOrbs: React.FC<FloatingOrbsProps> = ({ className = '' }) => {
    return (
        <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
            {/* Main accent orb - top left */}
            <div
                className="floating-orb orb-1"
                style={{
                    top: '-10%',
                    left: '-5%',
                }}
            />

            {/* Purple orb - bottom right */}
            <div
                className="floating-orb orb-2"
                style={{
                    bottom: '10%',
                    right: '-5%',
                }}
            />

            {/* Cyan orb - center right */}
            <div
                className="floating-orb orb-3"
                style={{
                    top: '40%',
                    right: '10%',
                }}
            />

            {/* Additional subtle orb - bottom left */}
            <div
                className="floating-orb"
                style={{
                    width: '180px',
                    height: '180px',
                    background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.2), rgba(100, 0, 255, 0.1))',
                    bottom: '5%',
                    left: '15%',
                    filter: 'blur(50px)',
                    animation: 'float-orb 16s ease-in-out infinite',
                    animationDelay: '-6s',
                }}
            />

            {/* Small accent orb - top right */}
            <div
                className="floating-orb"
                style={{
                    width: '100px',
                    height: '100px',
                    background: 'linear-gradient(135deg, rgba(0, 200, 255, 0.25), rgba(var(--accent-rgb), 0.15))',
                    top: '20%',
                    right: '20%',
                    filter: 'blur(30px)',
                    animation: 'float-orb 20s ease-in-out infinite reverse',
                    animationDelay: '-10s',
                }}
            />
        </div>
    );
};

export default FloatingOrbs;
