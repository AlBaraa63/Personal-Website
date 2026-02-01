import { useEffect, useRef, useState } from 'react';
import { Briefcase, GraduationCap } from 'lucide-react';
import { experience } from '@/data/portfolioData';

const Experience: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleItemIndex, setVisibleItemIndex] = useState(-1);
  const sectionRef = useRef<HTMLElement>(null);
  const timeoutsRef = useRef<number[]>([]);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggeredRef.current) {
          hasTriggeredRef.current = true;
          setIsVisible(true);
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
  const headerEntrance = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-12 sm:py-16 md:py-20"
      style={{ scrollMarginTop: '4rem' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 ${smoothTransition} ${headerEntrance}`}>
          <h2
            className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            <span style={{ color: 'var(--accent)', fontWeight: '300' }}>[</span>
            {' '}./experience{' '}
            <span style={{ color: 'var(--accent)', fontWeight: '300' }}>]</span>
          </h2>
          <p
            className={`text-sm sm:text-base md:text-lg ${smoothTransition} ${headerEntrance}`}
            style={{
              color: 'var(--text-secondary)',
              transitionDelay: isVisible ? '140ms' : '0ms',
            }}
          >
            Career log and mission history
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className="absolute left-4 sm:left-6 top-0 bottom-0 w-px"
            style={{ backgroundColor: 'var(--accent)', opacity: 0.3 }}
          />

          <div className="space-y-6 sm:space-y-8">
            {experience.map((item, index) => {
              const cardVisible = visibleItemIndex >= index;
              const Icon = item.type === 'work' ? Briefcase : GraduationCap;

              return (
                <div
                  key={item.id}
                  className={`relative pl-12 sm:pl-16 ${smoothTransition} ${cardVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                    }`}
                >
                  {/* Timeline dot */}
                  <div
                    className="absolute left-2.5 sm:left-4 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 z-10"
                    style={{
                      borderColor: 'var(--accent)',
                      backgroundColor: item.current ? 'var(--accent)' : 'var(--bg-primary)',
                      boxShadow: item.current ? '0 0 12px var(--accent)' : 'none',
                      top: '1.75rem',
                    }}
                  />

                  {/* Card */}
                  <div
                    className="rounded-xl border overflow-hidden"
                    style={{
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--bg-secondary)',
                      boxShadow: cardVisible
                        ? '0 12px 28px rgba(0,0,0,0.18), 0 0 16px rgba(var(--accent-rgb),0.1)'
                        : 'none',
                    }}
                  >
                    {/* Terminal header bar */}
                    <div
                      className="flex items-center gap-2 px-4 py-2 border-b"
                      style={{
                        borderColor: 'var(--border)',
                        background: 'rgba(var(--accent-rgb), 0.05)',
                      }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      <span
                        className="ml-2 text-xs font-mono truncate"
                        style={{ color: 'var(--accent)' }}
                      >
                        {item.company}
                      </span>
                      {item.current && (
                        <span
                          className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                          style={{
                            backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
                            color: 'var(--accent)',
                            border: '1px solid var(--accent)',
                          }}
                        >
                          ACTIVE
                        </span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 mb-3">
                        <Icon
                          className="w-5 h-5 mt-0.5 flex-shrink-0"
                          style={{ color: 'var(--accent)' }}
                        />
                        <div>
                          <h3
                            className="text-base sm:text-lg font-bold"
                            style={{ color: 'var(--text-primary)' }}
                          >
                            {item.title}
                          </h3>
                          <p
                            className="text-xs sm:text-sm font-mono"
                            style={{ color: 'var(--accent)' }}
                          >
                            {item.period}
                          </p>
                        </div>
                      </div>

                      <p
                        className="text-sm mb-3"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {item.description}
                      </p>

                      {/* Highlights as terminal output lines */}
                      <div className="space-y-1 mb-4">
                        {item.highlights.map((h, i) => (
                          <div key={i} className="flex gap-2 text-xs sm:text-sm">
                            <span
                              style={{ color: 'var(--accent)' }}
                              className="flex-shrink-0"
                            >
                              $
                            </span>
                            <span style={{ color: 'var(--text-secondary)' }}>
                              {h}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Skills tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {item.skills.map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] sm:text-xs px-2 py-0.5 rounded border font-mono"
                            style={{
                              borderColor: 'var(--accent)',
                              color: 'var(--accent)',
                              backgroundColor: 'rgba(var(--accent-rgb), 0.08)',
                            }}
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

        {/* Scroll indicator to Projects */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <button
            onClick={() => {
              const el = document.getElementById('projects');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            aria-label="Scroll to projects"
            className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              className="soft-bounce"
              style={{ color: 'var(--accent)' }}
            >
              <path
                d="M12 5v14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 12l-7 7-7-7"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Experience;
