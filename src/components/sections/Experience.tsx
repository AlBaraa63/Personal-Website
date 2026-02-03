import { useEffect, useRef, useState } from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import { experience } from '@/data/portfolioData';
import HudFrame from '@/components/ui/HudFrame';

const Experience: React.FC = () => {
  const [visibleItemIndex, setVisibleItemIndex] = useState(-1);
  const sectionRef = useRef<HTMLElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          experience.forEach((_, index) => {
            const timeout = window.setTimeout(() => {
              setVisibleItemIndex(index);
            }, 300 + index * 200);
            timeoutsRef.current.push(timeout);
          });
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      timeoutsRef.current.forEach(t => window.clearTimeout(t));
    };
  }, []);

  const smoothTransition = 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-16 sm:py-20 px-4 sm:px-6 overflow-hidden"
      style={{ scrollMarginTop: '4rem' }}
    >
      <div className="max-w-5xl mx-auto">
        <HudFrame title="CAREER_LOGS" className="w-full">

          {/* Header */}
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold tracking-tight mb-4">
              Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">& Education</span>
            </h2>
            <p className="text-sm sm:text-base text-text-secondary max-w-2xl mx-auto">
              Chronological archive of professional missions and academic uploads.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative px-2 sm:px-8 pb-8">
            {/* Vertical timeline line */}
            <div
              className="absolute left-[1.65rem] sm:left-[3.5rem] top-0 bottom-0 w-px bg-gradient-to-b from-accent/50 via-accent/20 to-transparent"
            />

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
                    {/* Timeline dot */}
                    <div
                      className="absolute left-4 sm:left-[2.75rem] w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center bg-bg-primary"
                      style={{
                        borderColor: item.current ? 'var(--accent)' : 'var(--border)',
                        boxShadow: item.current ? '0 0 10px var(--accent)' : 'none',
                        top: '0',
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full ${item.current ? 'bg-accent animate-pulse' : 'bg-text-secondary'}`} />
                    </div>

                    {/* Card */}
                    <div
                      className="group relative rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden hover:border-accent/40 transition-colors duration-300"
                    >
                      {/* Hover Glow */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-accent to-purple-500 opacity-0 group-hover:opacity-10 transition duration-500 blur-lg" />

                      <div className="relative p-5 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-accent/10 text-accent">
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
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent/20 text-accent border border-accent/30 animate-pulse">
                                ACTIVE
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-sm sm:text-base text-text-secondary mb-4 leading-relaxed">
                          {item.description}
                        </p>

                        {/* Highlights */}
                        <div className="space-y-2 mb-5">
                          {item.highlights.map((h, i) => (
                            <div key={i} className="flex gap-2 text-xs sm:text-sm text-gray-300">
                              <span className="text-accent flex-shrink-0 mt-0.5">›</span>
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>

                        {/* Skills */}
                        <div className="flex flex-wrap gap-2">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[10px] sm:text-xs px-2.5 py-1 rounded-md border border-white/10 bg-white/5 text-gray-300 font-mono hover:border-accent/30 hover:text-accent transition-colors"
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
