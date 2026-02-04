import React, { useEffect, useState } from 'react';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';
import WindowManager from './WindowManager';
import Taskbar from './Taskbar';
import BootSequence from './BootSequence';
import SysMatrixBackground from './SysMatrixBackground';
import { User, Terminal, Briefcase, FolderGit2, Mail, Cpu, Gamepad2, Settings, ChevronRight, Activity, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

// Import our "App" contents
import About from '@/components/sections/About';
import Projects from '@/components/sections/Projects';
import Contact from '@/components/sections/Contact';
import Experience from '@/components/sections/Experience';
import FloatingOrbs from '@/components/effects/FloatingOrbs';
import TerminalApp from '@/components/apps/TerminalApp';
import NeuralNet from '@/components/apps/NeuralNet';
import RetroGrid from '@/components/apps/RetroGrid';
import SettingsApp from '@/components/apps/Settings';

// Live Clock Component
const LiveClock: React.FC = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="text-center">
            <div className="text-4xl sm:text-6xl md:text-8xl font-black tracking-tight text-white tabular-nums">
                {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
            </div>
            <div className="text-sm md:text-lg text-white/40 tracking-widest uppercase mt-2">
                {time.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </div>
        </div>
    );
};

// Welcome Hero Widget
const WelcomeWidget: React.FC = () => {
    const { openWindow } = useOS();
    const { playSound } = useSound();

    const quickActions = [
        { id: 'bio', label: 'About Me', icon: <User size={18} /> },
        { id: 'projects', label: 'Projects', icon: <FolderGit2 size={18} /> },
        { id: 'experience', label: 'Experience', icon: <Briefcase size={18} /> },
        { id: 'contact', label: 'Contact', icon: <Mail size={18} /> },
    ];

    const handleQuickAction = (id: string) => {
        playSound('click');
        playSound('open');
        openWindow(id);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center gap-8 text-center max-w-2xl mx-auto"
        >
            {/* Clock */}
            <LiveClock />

            {/* Identity */}
            <div className="space-y-3">
                <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl md:text-3xl font-bold tracking-wide"
                >
                    <span className="text-white/60">Welcome to </span>
                    <span className="text-accent">HOLO-OS</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/40 text-sm tracking-widest uppercase"
                >
                    AlBaraa AlOlabi • AI Researcher & Engineer
                </motion.p>
            </div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap justify-center gap-3 mt-4"
            >
                {quickActions.map((action, index) => (
                    <motion.button
                        key={action.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        onClick={() => handleQuickAction(action.id)}
                        onMouseEnter={() => playSound('hover')}
                        className="group flex items-center gap-2 px-4 py-2.5 rounded-full
                            bg-white/5 border border-white/10 backdrop-blur-sm
                            hover:bg-accent/20 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.3)]
                            transition-all duration-300"
                    >
                        <span className="text-accent group-hover:scale-110 transition-transform">{action.icon}</span>
                        <span className="text-white/80 text-sm font-medium">{action.label}</span>
                        <ChevronRight size={14} className="text-white/30 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                    </motion.button>
                ))}
            </motion.div>

            {/* System Status Bar */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="flex items-center gap-6 text-xs text-white/30 uppercase tracking-widest mt-6"
            >
                <div className="flex items-center gap-1.5">
                    <Activity size={12} className="text-green-400" />
                    <span>System Online</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Zap size={12} className="text-yellow-400" />
                    <span>Neural Core Active</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

const Desktop: React.FC = () => {
    const { registerWindow, isBooting, setBooting } = useOS();

    // Register default apps on mount
    useEffect(() => {

        registerWindow({
            id: 'bio',
            title: 'Identity Component',
            icon: <User size={20} />,
            component: <About />,
            size: { width: 900, height: 700 },
            position: { x: 100, y: 50 },
        });

        registerWindow({
            id: 'experience',
            title: 'Timeline Log',
            icon: <Briefcase size={20} />,
            component: <Experience />,
            size: { width: 1000, height: 750 },
            position: { x: 150, y: 80 },
        });

        registerWindow({
            id: 'projects',
            title: 'Project Database',
            icon: <FolderGit2 size={20} />,
            component: <Projects />,
            size: { width: 1100, height: 800 },
            position: { x: 200, y: 100 },
        });

        registerWindow({
            id: 'neural',
            title: 'Holo-AI Core',
            icon: <Cpu size={20} />,
            component: <NeuralNet />,
            size: { width: 500, height: 600 },
            position: { x: 800, y: 100 },
        });

        registerWindow({
            id: 'retro',
            title: 'RetroGrid Arcade',
            icon: <Gamepad2 size={20} />,
            component: <RetroGrid />,
            size: { width: 620, height: 500 },
            position: { x: 400, y: 200 },
        });

        registerWindow({
            id: 'settings',
            title: 'System Config',
            icon: <Settings size={20} />,
            component: <SettingsApp />,
            size: { width: 500, height: 650 },
            position: { x: 500, y: 150 },
        });

        registerWindow({
            id: 'contact',
            title: 'Comm Link',
            icon: <Mail size={20} />,
            component: <Contact />,
            size: { width: 800, height: 700 },
            position: { x: 250, y: 120 },
        });

        registerWindow({
            id: 'terminal',
            title: 'SysAdmin Terminal',
            icon: <Terminal size={20} />,
            component: <TerminalApp />,
            size: { width: 700, height: 500 },
            position: { x: 300, y: 150 },
        });
    }, [registerWindow]);

    const handleBootComplete = () => {
        setBooting(false);
    };

    if (isBooting) {
        return <BootSequence onComplete={handleBootComplete} />;
    }

    return (
        <div className="fixed inset-0 overflow-hidden bg-black text-white select-none">
            {/* 3D Background Layer */}
            <SysMatrixBackground />
            <FloatingOrbs className="opacity-50" />

            {/* Central Welcome Widget */}
            <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none pb-16">
                <div className="pointer-events-auto">
                    <WelcomeWidget />
                </div>
            </div>

            {/* Desktop Icons Layer - Hidden on mobile */}
            <div className="absolute right-0 top-0 bottom-16 z-10 p-6 hidden md:flex flex-col gap-4 content-start w-24">
                <DesktopIcon id="bio" label="Bio.exe" icon={<User size={28} />} />
                <DesktopIcon id="experience" label="Timeline" icon={<Briefcase size={28} />} />
                <DesktopIcon id="projects" label="Projects" icon={<FolderGit2 size={28} />} />
                <DesktopIcon id="contact" label="Contact" icon={<Mail size={28} />} />
                <DesktopIcon id="terminal" label="Terminal" icon={<Terminal size={28} />} />
                <DesktopIcon id="neural" label="Holo-AI" icon={<Cpu size={28} />} />
                <DesktopIcon id="retro" label="Arcade" icon={<Gamepad2 size={28} />} />
                <DesktopIcon id="settings" label="Config" icon={<Settings size={28} />} />
            </div>

            {/* Windows Layer */}
            <div className="absolute inset-0 z-20 pointer-events-none">
                <WindowManager />
            </div>

            {/* Taskbar Layer */}
            <Taskbar />

            {/* Vignette Overlay */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-30" />

            {/* Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] brightness-100 contrast-150" />
        </div>
    );
};

interface DesktopIconProps {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const DesktopIcon: React.FC<DesktopIconProps> = ({ id, label, icon }) => {
    const { openWindow } = useOS();
    const { playSound } = useSound();

    const handleClick = () => {
        playSound('click');
        playSound('open');
        openWindow(id);
    };

    return (
        <button
            onClick={handleClick}
            onMouseEnter={() => playSound('hover')}
            className="group flex flex-col items-center gap-2 p-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer text-center"
        >
            <div className="w-16 h-16 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-lg group-hover:scale-105 group-hover:border-accent/50 transition-all duration-300 backdrop-blur-sm text-accent">
                {icon}
            </div>
            <span className="text-xs font-medium text-white/80 group-hover:text-white bg-black/40 px-2 py-0.5 rounded shadow-sm backdrop-blur-md">
                {label}
            </span>
        </button>
    );
};

export default Desktop;
