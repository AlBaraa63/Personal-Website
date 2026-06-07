import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

const variants = {
  primary: 'bg-blue-600 hover:bg-blue-500 text-white border-transparent',
  secondary: 'bg-zinc-800 hover:bg-zinc-700 text-zinc-100 border-zinc-700',
  ghost: 'bg-transparent hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 border-transparent',
  danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border-red-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2',
};

export function Button({ variant = 'secondary', size = 'md', loading, icon, children, className = '', disabled, onClick, type = 'button', title }: ButtonProps) {
  return (
    <motion.button whileTap={{ scale: 0.97 }} type={type} title={title} onClick={onClick} disabled={disabled || loading}
      className={`inline-flex items-center justify-center font-medium rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : icon}
      {children}
    </motion.button>
  );
}
