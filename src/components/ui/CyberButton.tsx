import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/cn'; // Assuming we create a utils/cn helper, I'll create that too

interface CyberButtonProps extends HTMLMotionProps<"button"> {
    children: React.ReactNode;
    variant?: 'primary' | 'secondary';
    glitch?: boolean;
}

const CyberButton: React.FC<CyberButtonProps> = ({
    children,
    className,
    variant = 'primary',
    glitch = true,
    ...props
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
                "relative px-8 py-3 font-mono font-bold uppercase tracking-wider overflow-hidden group",
                "bg-transparent border transition-all duration-300",
                variant === 'primary'
                    ? "border-accent text-accent hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)]"
                    : "border-text-secondary text-text-secondary hover:border-accent hover:text-accent",
                className
            )}
            {...props}
        >
            {/* Background slide effect */}
            <div className="absolute inset-0 bg-accent/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />

            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 border-current opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 border-current opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 border-current opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 border-current opacity-0 group-hover:opacity-100 transition-opacity" />

            {/* Button Text */}
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>

            {/* Glitch effect on hover (optional enhancement) */}
            {glitch && (
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 animate-pulse bg-accent" />
            )}
        </motion.button>
    );
};

export default CyberButton;
