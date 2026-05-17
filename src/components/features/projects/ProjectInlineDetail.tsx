import React from 'react';
import { ArrowLeft, Github, Play } from 'lucide-react';
import { Project } from '@/data/portfolioData';

interface ProjectInlineDetailProps {
    project: Project;
    onBack: () => void;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <section className="space-y-3">
        <h3 className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--text-muted)] flex items-center gap-2">
            <span className="text-accent">▸</span>
            {title}
        </h3>
        {children}
    </section>
);

const ProjectInlineDetail: React.FC<ProjectInlineDetailProps> = ({ project, onBack }) => {
    return (
        <div className="h-full overflow-y-auto custom-scrollbar p-4 sm:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Back nav */}
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-accent transition-colors"
                >
                    <ArrowLeft size={14} />
                    Back to Database
                </button>

                {/* Header */}
                <header className="space-y-3">
                    <div className="font-mono text-[10px] tracking-[0.3em] uppercase text-[var(--text-faint)]">
                        {project.category}
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] tracking-tight">
                        {project.title}
                    </h1>
                    <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                        {project.description}
                    </p>

                    {/* Action links */}
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                        {project.github && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-accent hover:text-accent transition-colors font-mono text-xs uppercase tracking-wider"
                            >
                                <Github size={14} /> Source
                            </a>
                        )}
                        {project.liveDemo && (
                            <a
                                href={project.liveDemo}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-3 py-2 border border-accent bg-accent text-black hover:bg-[var(--accent-hover)] transition-colors font-mono text-xs uppercase tracking-wider"
                            >
                                <Play size={14} fill="currentColor" /> Live Demo
                            </a>
                        )}
                    </div>
                </header>

                {/* Cover image */}
                <div className="border border-[var(--border)] overflow-hidden">
                    <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-auto aspect-video object-cover"
                        loading="eager"
                        onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                    />
                </div>

                {/* Long-form description */}
                {project.detailedDescription && (
                    <Section title="Overview">
                        <p className="text-sm text-[var(--text-muted)] leading-relaxed whitespace-pre-line">
                            {project.detailedDescription}
                        </p>
                    </Section>
                )}

                {/* Tech stack — grouped if available, flat otherwise */}
                {project.techStack ? (
                    <Section title="Tech Stack">
                        <div className="grid sm:grid-cols-2 gap-4">
                            {(['frontend', 'backend', 'ai', 'other'] as const).map(group => {
                                const items = project.techStack?.[group];
                                if (!items || items.length === 0) return null;
                                return (
                                    <div key={group} className="space-y-2">
                                        <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--text-faint)]">
                                            {group === 'ai' ? 'AI & ML' : group}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {items.map(item => (
                                                <span key={item} className="text-[10px] sm:text-xs px-2 py-0.5 border border-[var(--border)] text-[var(--text-muted)] font-mono">
                                                    {item}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Section>
                ) : (
                    <Section title="Tech Stack">
                        <div className="flex flex-wrap gap-1.5">
                            {project.skills.map(skill => (
                                <span key={skill} className="text-[10px] sm:text-xs px-2 py-0.5 border border-[var(--border)] text-[var(--text-muted)] font-mono">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </Section>
                )}

                {project.challenges && project.challenges.length > 0 && (
                    <Section title="Challenges">
                        <ul className="space-y-2">
                            {project.challenges.map((c, i) => (
                                <li key={i} className="flex gap-2 text-sm text-[var(--text-muted)]">
                                    <span className="text-accent flex-shrink-0">›</span>
                                    <span>{c}</span>
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}

                {project.solutions && project.solutions.length > 0 && (
                    <Section title="Solutions">
                        <ul className="space-y-2">
                            {project.solutions.map((s, i) => (
                                <li key={i} className="flex gap-2 text-sm text-[var(--text-muted)]">
                                    <span className="text-accent flex-shrink-0">›</span>
                                    <span>{s}</span>
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}

                {project.outcomes && project.outcomes.length > 0 && (
                    <Section title="Outcomes">
                        <ul className="space-y-2">
                            {project.outcomes.map((o, i) => (
                                <li key={i} className="flex gap-2 text-sm text-[var(--text-muted)]">
                                    <span className="text-accent flex-shrink-0">›</span>
                                    <span>{o}</span>
                                </li>
                            ))}
                        </ul>
                    </Section>
                )}

                {project.visuals && project.visuals.length > 0 && (
                    <Section title="Visuals">
                        <div className="grid sm:grid-cols-2 gap-3">
                            {project.visuals.map((v, i) => (
                                <figure key={i} className="border border-[var(--border)] overflow-hidden">
                                    <img src={v.src} alt={v.alt} className="w-full h-auto object-cover" loading="lazy" />
                                    {v.caption && (
                                        <figcaption className="px-3 py-2 text-[11px] text-[var(--text-faint)] font-mono border-t border-[var(--border)]">
                                            {v.caption}
                                        </figcaption>
                                    )}
                                </figure>
                            ))}
                        </div>
                    </Section>
                )}

                <footer className="pt-6 border-t border-[var(--border)] text-[11px] font-mono uppercase tracking-widest text-[var(--text-faint)]">
                    // END OF FILE
                </footer>
            </div>
        </div>
    );
};

export default ProjectInlineDetail;
