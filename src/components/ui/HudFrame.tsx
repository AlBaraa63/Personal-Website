import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';

interface HudFrameProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
}

const HudFrame: React.FC<HudFrameProps> = ({ children, className, title = "SYSTEM_ONLINE" }) => {
    return (
        <div className={cn("relative p-6 sm:p-10 border border-accent/20 bg-black/40 backdrop-blur-sm", className)}>
            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-accent" />
            <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-accent" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-accent" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-accent" />

            {/* Top Status Bar */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-black border border-accent/50 text-xs font-mono text-accent">
                {title}
            </div>

            {/* Scanning Line Animation on Borders */}
            <motion.div
                className="absolute top-0 left-0 w-full h-[1px] bg-accent/50"
                animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-0 right-0 w-full h-[1px] bg-accent/50"
                animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear", delay: 1.5 }}
            />

            {/* Content */}
            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default HudFrame;
