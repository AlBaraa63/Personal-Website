import React from 'react';

// Note: the @keyframes grid-scroll and data-fall live in src/index.css.

const SysMatrixBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
            {/* 3D Perspective Grid */}
            <div
                className="absolute inset-0 opacity-20"
                style={{
                    perspective: '1000px',
                    transformStyle: 'preserve-3d',
                }}
            >
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(var(--accent-rgb), 0.1) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(var(--accent-rgb), 0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '40px 40px',
                        transform: 'rotateX(60deg) scale(2)',
                        animation: 'grid-scroll 20s linear infinite',
                        transformOrigin: '50% 100%',
                    }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]" />
            </div>

            {/* Floating data particles */}
            <div className="absolute inset-0 opacity-30">
                <DataStream size={20} speed={10} left="10%" delay={0} />
                <DataStream size={15} speed={15} left="30%" delay={2} />
                <DataStream size={25} speed={8} left="60%" delay={1} />
                <DataStream size={10} speed={20} left="85%" delay={3} />
            </div>
        </div>
    );
};

const DataStream: React.FC<{ size: number; speed: number; left: string; delay: number }> = ({ size, speed, left, delay }) => (
    <div
        className="absolute top-0 w-[1px] bg-gradient-to-b from-transparent via-accent to-transparent"
        style={{
            left,
            height: size * 10,
            animation: `data-fall ${speed}s linear infinite`,
            animationDelay: `${delay}s`,
        }}
    />
);

export default SysMatrixBackground;
