import React from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowRight } from 'lucide-react';
import { projects, Project } from '@/data/portfolioData';
import { useOS } from '@/context/OSContext';
import { useSound } from '@/context/SoundContext';

// Exactly which projects to feature, in display order.
const FEATURED_IDS = ['cleancity-agent', 'mission-control-mcp', 'clean-eye'];

// Perimeter large enough for any realistic card size (max-w-5xl × ~260px ≈ 2560px).
const DASH = 4000;

// CSS-only keyframe injected once — traces the SVG rect border on hover.
// The rect starts at stroke-dashoffset: DASH (invisible) and animates to 0 (fully drawn).
// `animation-fill-mode: forwards` keeps it visible; hover-end reverts the presentation
// attribute, restarting the trace on the next hover.
const KEYFRAME_CSS = `
@keyframes holo-trace {
  from { stroke-dashoffset: ${DASH}; }
  to   { stroke-dashoffset: 0; }
}
.holo-feat-card:hover .holo-trace-rect {
  animation: holo-trace 0.65s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
`;

const FeaturedProjects: React.FC = () => {
    const { openWindow, windows } = useOS();
    const { playSound } = useSound();

    const featured = FEATURED_IDS
        .map(id => projects.find(p => p.id === id))
        .filter((p): p is Project => Boolean(p));

    if (featured.length === 0) return null;

    const openProject = (project: Project) => {
        playSound('click');
        playSound('open');
        if (!windows['projects']?.isOpen) openWindow('projects');
        setTimeout(() => {
            window.dispatchEvent(
                new CustomEvent('holo-os:projects:select', { detail: { id: project.id } })
            );
        }, 80);
    };

    const openAllProjects = () => {
        playSound('click');
        openWindow('projects');
    };

    // First sentence only for the hero description slot.
    const firstSentence = (text: string) => {
        const dot = text.indexOf('. ');
        return dot !== -1 ? text.slice(0, dot + 1) : text;
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{ __html: KEYFRAME_CSS }} />

            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                aria-label="Featured projects"
                className="w-full max-w-5xl mx-auto px-4 sm:px-6"
            >
                {/* ── Section header ── */}
                <div className="flex items-center justify-between mb-4 sm:mb-5">
                    <div className="flex items-center gap-2">
                        <span className="text-accent font-mono text-sm sm:text-base font-bold tracking-tight">
                            // featured_work
                        </span>
                    </div>
                    <button
                        onClick={openAllProjects}
                        className="flex items-center gap-1 text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-[var(--text-faint)] hover:text-accent transition-colors"
                    >
                        All projects <ArrowRight size={11} />
                    </button>
                </div>

                {/* ── Stacked full-width cards ── */}
                <div className="flex flex-col gap-3 sm:gap-4">
                    {featured.map((project, idx) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.75 + idx * 0.1, duration: 0.45 }}
                            className="holo-feat-card group relative border border-[var(--border)] bg-[var(--surface)]/85 backdrop-blur-md overflow-hidden transition-colors duration-300 hover:border-accent/50"
                        >
                            {/* ── SVG border trace (CSS-only, no JS) ── */}
                            <svg
                                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                                aria-hidden="true"
                                preserveAspectRatio="none"
                            >
                                <rect
                                    className="holo-trace-rect"
                                    x="1"
                                    y="1"
                                    width="calc(100% - 2px)"
                                    height="calc(100% - 2px)"
                                    fill="none"
                                    stroke="#00ff41"
                                    strokeWidth="1.5"
                                    strokeDasharray={DASH}
                                    strokeDashoffset={DASH}
                                    strokeLinecap="square"
                                />
                            </svg>

                            {/* ── Card body: left 60% · right 40% ── */}
                            <div className="flex flex-col md:flex-row min-h-[180px] sm:min-h-[200px]">

                                {/* Left — project info */}
                                <div className="flex-[3] p-5 sm:p-7 flex flex-col justify-between gap-4 z-[5]">
                                    <div>
                                        {/* Index + category label */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[9px] font-mono text-accent/60 uppercase tracking-[0.35em]">
                                                {String(idx + 1).padStart(2, '0')}
                                            </span>
                                            <span className="text-[9px] font-mono text-[var(--text-faint)] uppercase tracking-[0.25em]">
                                                AI &amp; CV
                                            </span>
                                        </div>

                                        {/* Title */}
                                        <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] group-hover:text-accent transition-colors duration-300 leading-tight mb-2">
                                            {project.title}
                                        </h3>

                                        {/* 1-sentence description */}
                                        <p className="text-xs sm:text-sm text-[var(--text-muted)] leading-relaxed line-clamp-2">
                                            {firstSentence(project.description)}
                                        </p>
                                    </div>

                                    {/* Tech stack badges */}
                                    <div className="flex flex-wrap gap-1.5">
                                        {project.skills.slice(0, 5).map(skill => (
                                            <span
                                                key={skill}
                                                className="text-[9px] sm:text-[10px] px-1.5 py-0.5 border border-accent/30 text-accent font-mono hover:border-accent transition-colors duration-200"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {project.skills.length > 5 && (
                                            <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 text-[var(--text-faint)] font-mono">
                                                +{project.skills.length - 5}
                                            </span>
                                        )}
                                    </div>

                                    {/* Action buttons */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <button
                                            onClick={() => openProject(project)}
                                            className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-accent text-accent hover:bg-accent hover:text-black transition-all duration-200"
                                        >
                                            View Details <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                                        </button>

                                        {project.github && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:border-accent hover:text-accent transition-all duration-200"
                                            >
                                                <Github size={12} />
                                                GitHub
                                            </a>
                                        )}

                                        {project.liveDemo && (
                                            <a
                                                href={project.liveDemo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest px-3 py-1.5 border border-[var(--border)] text-[var(--text-muted)] hover:border-accent hover:text-accent transition-all duration-200"
                                            >
                                                <ExternalLink size={12} />
                                                Live Demo
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Right — cover image (40%) */}
                                <div className="flex-[2] relative min-h-[160px] md:min-h-0 overflow-hidden border-t md:border-t-0 md:border-l border-[var(--border)] group-hover:border-accent/30 transition-colors duration-300">
                                    <img
                                        src={project.image}
                                        alt={project.title}
                                        loading="lazy"
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        onError={e => {
                                            (e.currentTarget as HTMLImageElement).style.opacity = '0';
                                        }}
                                    />
                                    {/* Left fade so image bleeds into text area naturally */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-[var(--surface)] via-[var(--surface)]/20 to-transparent md:block hidden" />
                                    {/* Bottom fade for mobile (image is below text) */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/20 to-transparent md:hidden" />

                                    {/* Live badge */}
                                    {project.liveDemo && (
                                        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 border border-accent text-accent text-[9px] font-mono uppercase tracking-widest bg-[var(--surface)]/80 backdrop-blur-sm">
                                            Live
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>
        </>
    );
};

export default FeaturedProjects;
