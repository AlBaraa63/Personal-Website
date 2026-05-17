import React, { useState, useRef } from 'react';
import { ExternalLink, Github, ChevronRight, Cpu, Layers, Code } from 'lucide-react';
import { Project } from '@/data/portfolioData';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';

interface ProjectCardProps {
    project: Project;
    onDetails: (project: Project) => void;
    priority?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onDetails, priority = false }) => {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleMouseEnter = () => {
        setIsHovered(true);
        if (project.videoUrl && videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        if (project.videoUrl && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
    };

    const handleClick = () => onDetails(project);

    return (
        <motion.div
            layoutId={`project-card-${project.id}`}
            className="group relative h-full flex flex-col"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div
                role="button"
                tabIndex={0}
                onClick={handleClick}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
                className="relative flex-1 flex flex-col overflow-hidden border border-[var(--border)] bg-[var(--surface)] transition-colors duration-200 group-hover:border-accent cursor-pointer focus-visible:outline-none focus-visible:border-accent"
            >
                {/* Thumbnail — fixed 16:9 aspect ratio, gradient overlay for consistency */}
                <div className="relative aspect-video overflow-hidden bg-[var(--surface-inset)] border-b border-[var(--border)]">
                    {project.videoUrl ? (
                        <>
                            <img
                                src={project.image}
                                alt={project.title}
                                className={cn(
                                    'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
                                    isHovered ? 'opacity-0' : 'opacity-100'
                                )}
                                loading={priority ? 'eager' : 'lazy'}
                                onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                            />
                            <video
                                ref={videoRef}
                                src={project.videoUrl}
                                className={cn(
                                    'absolute inset-0 w-full h-full object-cover transition-opacity duration-500',
                                    isHovered ? 'opacity-100' : 'opacity-0'
                                )}
                                muted
                                loop
                                playsInline
                            />
                        </>
                    ) : (
                        <img
                            src={project.image}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            loading={priority ? 'eager' : 'lazy'}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = '0'; }}
                        />
                    )}

                    {/* Bottom gradient — unifies whatever the underlying screenshot looks like */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-[var(--surface)]/40 to-transparent" />

                    {/* Status badges — single accent, no rainbow */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        {project.featured && (
                            <div className="px-2 py-1 bg-accent text-black text-[10px] font-bold tracking-widest uppercase">
                                Featured
                            </div>
                        )}
                        {project.liveDemo && (
                            <div className="px-2 py-1 border border-accent text-accent text-[10px] font-mono uppercase tracking-widest">
                                Live
                            </div>
                        )}
                    </div>

                    {/* Category icon */}
                    <div className="absolute top-3 left-3 p-1.5 border border-[var(--border-strong)] bg-[var(--surface)]/80 backdrop-blur-sm text-accent">
                        {project.category === 'ai-cv' ? <Cpu size={14} /> :
                            project.category === 'web-dev' ? <Layers size={14} /> :
                                <Code size={14} />}
                    </div>

                    {/* Hover hint */}
                    <div className={cn(
                        'absolute inset-0 flex items-center justify-center transition-opacity duration-200 pointer-events-none',
                        isHovered ? 'opacity-100' : 'opacity-0'
                    )}>
                        <div className="px-4 py-2 border border-accent bg-[var(--surface)]/90 text-accent font-mono uppercase tracking-widest text-xs">
                            Access Data
                        </div>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 p-5 flex flex-col">
                    <div className="mb-4">
                        <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 group-hover:text-accent transition-colors truncate">
                            {project.title}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] line-clamp-2 leading-relaxed">
                            {project.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                        {project.skills.slice(0, 4).map((tech) => (
                            <span
                                key={tech}
                                className="text-[10px] px-2 py-0.5 border border-[var(--border)] text-[var(--text-muted)] font-mono"
                            >
                                {tech}
                            </span>
                        ))}
                        {project.skills.length > 4 && (
                            <span className="text-[10px] px-2 py-0.5 text-[var(--text-faint)] font-mono">
                                +{project.skills.length - 4}
                            </span>
                        )}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-[var(--border)]">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleClick();
                            }}
                            className="flex items-center gap-1 text-xs font-mono uppercase tracking-widest text-[var(--text-primary)] hover:text-accent transition-colors group/btn"
                        >
                            Details <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>

                        <div className="flex gap-1">
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-[var(--text-muted)] hover:text-accent transition-colors"
                                    title="View Source"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Github size={16} />
                                </a>
                            )}
                            {project.liveDemo && (
                                <a
                                    href={project.liveDemo}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 text-[var(--text-muted)] hover:text-accent transition-colors"
                                    title="Live Demo"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <ExternalLink size={16} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
