import React from 'react';

const Scanline: React.FC = () => {
    return (
        <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent animate-scan z-40 pointer-events-none opacity-20" />
        </div>
    );
};

export default Scanline;
