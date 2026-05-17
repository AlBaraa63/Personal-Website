import { useRef } from 'react';
import { Briefcase, GraduationCap, Zap } from 'lucide-react';
import { experience, Experience as ExperienceItem } from '@/data/portfolioData';
import HudFrame from '@/components/ui/HudFrame';

const TimelineGroup: React.FC<{
    label: string;
    icon: React.ReactNode;
    items: ExperienceItem[];
}> = ({ label, icon, items }) => {
    if (items.length === 0) return null;
    return (
        <div className="relative">
            {/* Group header */}
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="w-9 h-9 flex items-center justify-center border border-accent text-accent">
                    {icon}
                </div>
                <div className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--text-muted)]">
                    {label}
                    <span className="ml-2 text-[var(--text-faint)]">/ {items.length}</span>
                </div>
                <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Items */}
            <div className="relative px-2 sm:px-8 pb-2">
                {/* Vertical line */}
                <div className="absolute left-[1.65rem] sm:left-[3.5rem] top-0 bottom-0 w-px bg-[var(--border)]" />

                <div className="space-y-8 sm:space-y-10">
                    {items.map((item) => {
                        const Icon = item.type === 'work' ? Briefcase : GraduationCap;
                        return (
                            <div key={item.id} className="relative pl-12 sm:pl-20">
                                {/* Timeline dot */}
                                <div
                                    className={`absolute left-4 sm:left-[2.75rem] top-1 w-7 h-7 rounded-sm border-2 z-10 flex items-center justify-center bg-[var(--surface)]
                                        ${item.current ? 'border-accent' : 'border-[var(--border-strong)]'}
                                    `}
                                    style={
                                        item.current
                                            ? { boxShadow: '0 0 0 2px var(--surface), 0 0 14px var(--accent)' }
                                            : { boxShadow: '0 0 0 2px var(--surface)' }
                                    }
                                >
                                    <div
                                        className={`w-2.5 h-2.5 rounded-sm ${item.current ? 'bg-accent animate-pulse' : 'bg-[var(--text-faint)]'}`}
                                    />
                                </div>

                                {/* Card */}
                                <div className="relative border border-[var(--border)] bg-[var(--surface)] hover:border-accent transition-colors duration-200">
                                    <div className="p-5 sm:p-6">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 border border-[var(--border-strong)] text-accent">
                                                    <Icon size={18} />
                                                </div>
                                                <div>
                                                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-tight">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm font-mono text-[var(--text-muted)] uppercase tracking-wider">
                                                        {item.company}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] sm:text-xs font-mono text-[var(--text-muted)] border border-[var(--border)] px-2.5 py-1 uppercase tracking-wider">
                                                    {item.period}
                                                </span>
                                                {item.current && (
                                                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-accent text-black tracking-widest uppercase">
                                                        <Zap size={10} />
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <p className="text-sm text-[var(--text-muted)] mb-4 leading-relaxed">
                                            {item.description}
                                        </p>

                                        <div className="space-y-1.5 mb-5">
                                            {item.highlights.map((h, i) => (
                                                <div key={i} className="flex gap-2 text-xs sm:text-sm text-[var(--text-muted)]">
                                                    <span className="text-accent flex-shrink-0 mt-0.5">›</span>
                                                    <span>{h}</span>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-wrap gap-1.5">
                                            {item.skills.map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="text-[10px] sm:text-xs px-2 py-0.5 border border-[var(--border)] text-[var(--text-muted)] font-mono hover:border-accent hover:text-accent transition-colors"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

const Experience: React.FC = () => {
    const sectionRef = useRef<HTMLElement>(null);

    const workItems = experience.filter(e => e.type === 'work');
    const programItems = experience.filter(e => e.type !== 'work');

    return (
        <section ref={sectionRef} className="h-full w-full p-4 sm:p-8 overflow-y-auto">
            <div className="max-w-5xl mx-auto">
                <HudFrame title="CAREER_LOGS" className="w-full">
                    {/* Header — unified typography */}
                    <div className="text-center mb-10 sm:mb-12">
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] font-mono uppercase mb-3">
                            Experience &amp; Education
                        </h2>
                        <p className="text-xs sm:text-sm text-[var(--text-muted)] tracking-widest uppercase">
                            Chronological archive
                        </p>
                    </div>

                    <div className="space-y-12 sm:space-y-16">
                        <TimelineGroup
                            label="Work"
                            icon={<Briefcase size={16} />}
                            items={workItems}
                        />
                        <TimelineGroup
                            label="Programs &amp; Education"
                            icon={<GraduationCap size={16} />}
                            items={programItems}
                        />
                    </div>
                </HudFrame>
            </div>
        </section>
    );
};

export default Experience;
