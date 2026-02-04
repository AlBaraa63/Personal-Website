import { useEffect, useRef, useState } from 'react';
import { Briefcase, GraduationCap, Zap } from 'lucide-react';
import { experience } from '@/data/portfolioData';
import HudFrame from '@/components/ui/HudFrame';

const Experience: React.FC = () => {
  // Default to showing all items to ensure data visibility
  const [visibleItemIndex, setVisibleItemIndex] = useState(100);
  const sectionRef = useRef<HTMLElement>(null);

  // Optional: Simple stagger effect if desired, but default to visible
  useEffect(() => {
    // We can add simple animation logic here if needed, but data is prioritized
  }, []);

  const smoothTransition = 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="h-full w-full p-4 sm:p-8 overflow-y-auto"
    >
      <div className="max-w-5xl mx-auto">
        <HudFrame title="CAREER_LOGS" className="w-full glass-panel aurora-border">

          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Experience <span className="gradient-text">&amp; Education</span>
            </h2>
            <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto">
              Chronological archive of professional missions and academic uploads.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative px-2 sm:px-8 pb-8">
            {/* Animated vertical timeline line */}
            <div
              className="absolute left-[1.65rem] sm:left-[3.5rem] top-0 bottom-0 w-px overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-accent via-cyan-400 to-purple-500 opacity-50" />
              <div
                className="absolute w-full h-20 bg-gradient-to-b from-accent via-white to-transparent"
                style={{
                  animation: 'hologram-scan 3s linear infinite',
                  opacity: 0.8,
                }}
              />
            </div>

            <div className="space-y-8 sm:space-y-12">
              {experience.map((item, index) => {
                const cardVisible = visibleItemIndex >= index;
                const Icon = item.type === 'work' ? Briefcase : GraduationCap;

                return (
                  <div
                    key={item.id}
                    className={`relative pl-12 sm:pl-20 ${smoothTransition} ${cardVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                      }`}
                  >
                    {/* Glowing timeline node */}
                    <div
                      className={`absolute left-4 sm:left-[2.75rem] w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center bg-bg-primary ${item.current ? 'glow-pulse' : ''}`}
                      style={{
                        borderColor: item.current ? 'var(--accent)' : 'var(--border)',
                        boxShadow: item.current
                          ? '0 0 15px var(--accent), 0 0 30px rgba(var(--accent-rgb), 0.3)'
                          : 'none',
                        top: '0',
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full ${item.current ? 'bg-accent animate-pulse' : 'bg-text-secondary'}`} />
                    </div>

                    {/* Connection line pulse */}
                    {item.current && (
                      <div
                        className="absolute left-[1.65rem] sm:left-[3.5rem] w-px h-full"
                        style={{
                          background: 'linear-gradient(to bottom, var(--accent), transparent)',
                          animation: 'glow-pulse 2s ease-in-out infinite',
                        }}
                      />
                    )}

                    {/* Card with enhanced styling */}
                    <div
                      className="group relative rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden hover:border-accent/40 transition-all duration-300 spotlight-card"
                    >
                      {/* Hover Glow */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent via-cyan-400 to-purple-500 opacity-0 group-hover:opacity-15 transition duration-500 blur-lg" />

                      <div className="relative p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                              <Icon size={20} />
                            </div>
                            <div>
                              <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-accent transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-sm font-mono text-accent/80">
                                {item.company}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm font-mono text-text-secondary border border-white/10 px-3 py-1 rounded bg-black/30">
                              {item.period}
                            </span>
                            {item.current && (
                              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30">
                                <Zap size={10} className="animate-pulse" />
                                ACTIVE
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm sm:text-base text-text-secondary mb-4 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Highlights with accent markers */}
                        <div className="space-y-2 mb-5">
                          {item.highlights.map((h, i) => (
                            <div key={i} className="flex gap-2 text-xs sm:text-sm text-gray-300 group/highlight hover:text-white transition-colors">
                              <span className="text-accent flex-shrink-0 mt-0.5 group-hover/highlight:neon-glow">›</span>
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>

                        {/* Skills with hover effects */}
                        <div className="flex flex-wrap gap-2">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] sm:text-xs px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-gray-300 font-mono hover:border-accent/50 hover:text-accent hover:bg-accent/10 transition-all duration-200 hover:scale-105"
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
        </HudFrame>
      </div>
    </section>
  );
};

export default Experience;
