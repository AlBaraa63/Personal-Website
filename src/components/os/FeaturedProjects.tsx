import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Cpu, Layers, Code } from 'lucide-react';
import { projects, Project } from '@/data/portfolioData';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';

const FEATURED_LIMIT = 3;

const categoryIcon = (cat: Project['category']) => {
    if (cat === 'ai-cv') return <Cpu size={11} />;
    if (cat === 'web-dev') return <Layers size={11} />;
    return <Code size={11} />;
};

const categoryLabel = (cat: Project['category']) =>
    cat === 'ai-cv' ? 'AI & CV' : cat === 'web-dev' ? 'Web' : cat === 'robotics' ? 'Robotics' : 'Other';

const FeaturedProjects: React.FC = () => {
    const { openWindow, windows } = useOS();
    const { playSound } = useSound();

    const featured = projects.filter(p => p.featured).slice(0, FEATURED_LIMIT);
    if (featured.length === 0) return null;

    const openProject = (project: Project) => {
        playSound('click');
        playSound('open');
        const win = windows['projects'];
        if (!win?.isOpen) openWindow('projects');
        // Defer the deep-link until Projects has mounted/restored.
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('holo-os:projects:select', { detail: { id: project.id } }));
        }, 80);
    };

    const openAllProjects = () => {
        playSound('click');
        playSound('open');
        openWindow('projects');
    };

    return (
        <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            aria-label="Featured projects"
            className="w-full max-w-5xl mx-auto px-4 sm:px-6"
        >
            {/* Section header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-accent text-xs">▸</span>
                    <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.3em] text-[var(--text-muted)]">
                        Featured Work
                    </span>
                </div>
                <button
                    onClick={openAllProjects}
                    className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-faint)] hover:text-accent transition-colors flex items-center gap-1"
                >
                    See all
                    <ArrowRight size={11} />
                </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {featured.map((project, idx) => (
                    <motion.button
                        key={project.id}
                        onClick={() => openProject(project)}
                        onMouseEnter={() => playSound('hover')}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + idx * 0.08, duration: 0.4 }}
                        whileHover={{ y: -4 }}
                        aria-label={`Open project: ${project.title}`}
                        className="group relative text-left bg-[var(--surface)]/85 backdrop-blur-md border border-[var(--border)] hover:border-accent transition-colors overflow-hidden"
                    >
                        {/* HUD corners */}
                        <span aria-hidden className="absolute -top-px -left-px w-2 h-2 border-t border-l border-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span aria-hidden className="absolute -top-px -right-px w-2 h-2 border-t border-r border-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span aria-hidden className="absolute -bottom-px -left-px w-2 h-2 border-b border-l border-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span aria-hidden className="absolute -bottom-px -right-px w-2 h-2 border-b border-r border-accent opacity-0 group-hover:opacity-100 transition-opacity" />

                        {/* Thumbnail */}
                        <div className="relative aspect-video overflow-hidden bg-[var(--surface-inset)]">
                            <img
                                src={project.image}
                                alt={project.title}
                                loading="lazy"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.opacity = '0';
                                }}
                            />
                            {/* Bottom gradient — unifies whatever the thumbnail looks like */}
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/30 to-transparent" />

                            {/* Category chip */}
                            <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-[var(--surface)]/90 border border-[var(--border-strong)] text-accent font-mono text-[9px] uppercase tracking-widest">
                                {categoryIcon(project.category)}
                                {categoryLabel(project.category)}
                            </div>

                            {/* Featured chip */}
                            <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-accent text-black font-mono text-[9px] uppercase tracking-widest font-bold">
                                ★ Featured
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-3 sm:p-4">
                            <div className="text-sm sm:text-base font-bold text-[var(--text-primary)] truncate group-hover:text-accent transition-colors">
                                {project.title}
                            </div>
                            <div className="text-[11px] sm:text-xs text-[var(--text-muted)] line-clamp-2 mt-1 leading-relaxed">
                                {project.description}
                            </div>
                            <div className="flex items-center gap-1 mt-2 text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)] group-hover:text-accent transition-colors">
                                Open
                                <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    </motion.button>
                ))}
            </div>
        </motion.section>
    );
};

export default FeaturedProjects;
