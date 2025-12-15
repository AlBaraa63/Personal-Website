import React, { useEffect, useRef, useState } from 'react';
import { Trophy, ExternalLink, FileText, Eye } from 'lucide-react';
import { research } from '../data/portfolioData';

const Research: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visiblePaperIndex, setVisiblePaperIndex] = useState(-1);
  const [showPaperPreview, setShowPaperPreview] = useState<{ [key: string]: boolean }>({});
  const sectionRef = useRef<HTMLElement>(null);
  const timelineTimeoutsRef = useRef<number[]>([]);
  const paperTimeoutsRef = useRef<number[]>([]);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!hasTriggeredRef.current) {
            hasTriggeredRef.current = true;
            setIsVisible(true);
            const timeline = [
              { element: 'header' as const, delay: 120 },
              { element: 'papers' as const, delay: 260 }
            ];

            timeline.forEach(({ element, delay }) => {
              const timeoutId = window.setTimeout(() => {
                if (element === 'papers') {
                  research.forEach((_, index) => {
                    const paperTimeout = window.setTimeout(() => {
                      setVisiblePaperIndex(index);
                    }, 260 + index * 180);
                    paperTimeoutsRef.current.push(paperTimeout);
                  });
                }
              }, delay);
              timelineTimeoutsRef.current.push(timeoutId);
            });
          }
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      timelineTimeoutsRef.current.forEach(timeout => window.clearTimeout(timeout));
      paperTimeoutsRef.current.forEach(timeout => window.clearTimeout(timeout));
    };
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setVisiblePaperIndex(-1);
      paperTimeoutsRef.current.forEach(timeout => window.clearTimeout(timeout));
    }
  }, [isVisible]);

  const smoothTransition = 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const headerEntrance = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

  return (
    <section 
      id="research" 
      ref={sectionRef} 
      className="relative py-12 sm:py-16 md:py-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 ${smoothTransition} ${headerEntrance}`}>
          <h2
            className={`text-4xl md:text-5xl font-bold mb-4 ${smoothTransition} ${headerEntrance}`}
            style={{
              transitionDelay: isVisible ? '90ms' : '0ms',
              color: 'var(--text-primary)'
            }}
          >
            <span style={{ color: 'var(--accent)', fontWeight: '300' }}>[</span>
            {' '}./research{' '}
            <span style={{ color: 'var(--accent)', fontWeight: '300' }}>]</span>
          </h2>
          <p
            className={`text-lg mt-3 max-w-2xl mx-auto ${smoothTransition} ${headerEntrance}`}
            style={{
              color: 'var(--text-secondary)',
              transitionDelay: isVisible ? '140ms' : '0ms'
            }}
          >
            Contributing to the science of AI
          </p>
        </div>

        {/* Research Papers */}
        <div className="space-y-8">
          {research.map((paper, index) => {
            const cardVisible = visiblePaperIndex >= index;

            return (
            <div
              key={paper.id}
              className={`group relative overflow-hidden rounded-xl ${smoothTransition} ${
                cardVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-[0.96]'
              } hover:-translate-y-2 hover:scale-[1.02]`}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                transform: isVisible ? 
                  `perspective(1000px) rotateY(0deg) rotateX(0deg)` : 
                  `perspective(1000px) rotateY(${index % 2 === 0 ? -8 : 8}deg) rotateX(3deg)`,
                boxShadow: cardVisible
                  ? '0 22px 44px rgba(0,0,0,0.26), 0 0 28px rgba(var(--accent-rgb),0.18)'
                  : '0 12px 28px rgba(0,0,0,0.16)',
                transitionDelay: cardVisible ? `${index * 120}ms` : '0ms'
              }}
            >
              {/* Glowing border effect */}
              <div className="absolute inset-0 rounded-xl transition-opacity duration-700 opacity-50"
                   style={{
                     background: `linear-gradient(45deg, 
                       var(--accent) 0%, 
                       transparent 40%,
                       transparent 60%,
                       var(--accent) 100%
                     )`,
                   }}
              ></div>
              
              <div className="relative p-4 sm:p-6 md:p-8 lg:p-12 z-10">
                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8 items-start">
                  {/* Paper Content */}
                  <div className="lg:col-span-2 space-y-4">
                    {/* Title Box */}
                    <div className="p-4 sm:p-5 rounded-lg border-2"
                         style={{ 
                           borderColor: 'var(--accent)',
                           backgroundColor: 'var(--bg-primary)',
                           boxShadow: '0 4px 15px rgba(var(--accent-rgb), 0.2)'
                         }}>
                      <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-tight text-justify"
                          style={{ color: 'var(--text-primary)', fontFamily: 'Times New Roman, serif' }}>
                        {paper.title}
                      </h3>
                    </div>
                    
                    {/* Abstract Box with Toggle */}
                    <div className="rounded-lg border-2 overflow-hidden"
                         style={{ 
                           borderColor: 'var(--accent)',
                           backgroundColor: 'var(--bg-primary)',
                           boxShadow: '0 4px 15px rgba(var(--accent-rgb), 0.2)'
                         }}>
                      
                      {/* Toggle Buttons */}
                      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
                        <button
                          onClick={() => setShowPaperPreview(prev => ({ ...prev, [paper.id]: false }))}
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 ${
                            !showPaperPreview[paper.id] ? 'border-b-2' : ''
                          }`}
                          style={{ 
                            borderColor: !showPaperPreview[paper.id] ? 'var(--accent)' : 'transparent',
                            color: !showPaperPreview[paper.id] ? 'var(--accent)' : 'var(--text-secondary)',
                            backgroundColor: !showPaperPreview[paper.id] ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent'
                          }}
                        >
                          Abstract
                        </button>
                        <button
                          onClick={() => setShowPaperPreview(prev => ({ ...prev, [paper.id]: true }))}
                          className={`flex-1 px-4 py-3 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                            showPaperPreview[paper.id] ? 'border-b-2' : ''
                          }`}
                          style={{ 
                            borderColor: showPaperPreview[paper.id] ? 'var(--accent)' : 'transparent',
                            color: showPaperPreview[paper.id] ? 'var(--accent)' : 'var(--text-secondary)',
                            backgroundColor: showPaperPreview[paper.id] ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent'
                          }}
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      </div>

                      {/* Content Area */}
                      <div className="relative overflow-hidden">
                        {/* Abstract Content */}
                        <div className={`transform transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                          !showPaperPreview[paper.id] 
                            ? 'opacity-100 translate-y-0 scale-100' 
                            : 'opacity-0 -translate-y-4 scale-98 absolute inset-0 pointer-events-none'
                        }`}>
                          <div className="p-4 sm:p-5">
                            <p className="text-base sm:text-lg leading-relaxed text-justify"
                               style={{ color: 'var(--text-secondary)', fontFamily: 'Times New Roman, serif' }}>
                              {paper.abstract}
                            </p>
                          </div>
                        </div>

                        {/* Paper Preview */}
                        <div className={`transform transition-all duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
                          showPaperPreview[paper.id] 
                            ? 'opacity-100 translate-y-0 scale-100' 
                            : 'opacity-0 translate-y-4 scale-98 absolute inset-0 pointer-events-none'
                        }`}>
                          {showPaperPreview[paper.id] && paper.link && (
                            <div className="relative w-full bg-black" style={{ paddingTop: '141.4%' }}>
                              <iframe
                                src={paper.link.replace('/view?usp=drive_link', '/preview')}
                                title="Research paper preview"
                                className="absolute top-0 left-0 w-full h-full"
                                allow="autoplay"
                                loading="lazy"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Visual Element */}
                  <div className={`lg:col-span-1 flex flex-col items-center justify-center gap-6 h-full transition-all duration-800 delay-1200 ${
                    isVisible ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-90 rotate-6'
                  }`}>
                    <div className="relative group/trophy">
                      <div 
                        className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-2 flex items-center justify-center transition-all duration-700 group-hover/trophy:scale-110 group-hover/trophy:rotate-6 transform-gpu"
                        style={{ 
                          borderColor: 'var(--accent)',
                          boxShadow: isVisible ? '0 0 30px var(--accent), 0 15px 35px rgba(0,0,0,0.3)' : 'none',
                          background: isVisible
                            ? 'radial-gradient(circle, rgba(0,0,0,0.9), rgba(0,0,0,0.2))'
                            : 'rgba(0,0,0,0.7)'
                        }}
                      >
                        <Trophy 
                          className="w-16 h-16 lg:w-20 lg:h-20 transition-all duration-700 group-hover/trophy:scale-125 group-hover/trophy:rotate-[360deg] animate-pulse" 
                          style={{ 
                            color: 'var(--accent)',
                            filter: isVisible ? 'drop-shadow(0 0 15px var(--accent))' : 'none'
                          }} 
                        />
                      </div>
                      
                      {/* Enhanced floating particles */}
                      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full transition-all duration-500 ${
                        isVisible ? 'animate-ping opacity-70' : 'opacity-0'
                      }`}
                           style={{ 
                             backgroundColor: 'var(--accent)',
                             animation: isVisible ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'
                           }}></div>
                      <div className={`absolute -bottom-1 -left-1 w-3 h-3 rounded-full transition-all duration-500 ${
                        isVisible ? 'animate-ping opacity-70' : 'opacity-0'
                      }`}
                           style={{ 
                             backgroundColor: 'var(--accent)',
                             animation: isVisible ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 1s' : 'none'
                           }}></div>
                      <div className={`absolute -top-2 -left-2 w-2 h-2 rounded-full transition-all duration-500 ${
                        isVisible ? 'animate-ping opacity-50' : 'opacity-0'
                      }`}
                           style={{ 
                             backgroundColor: 'var(--accent)',
                             animation: isVisible ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 0.5s' : 'none'
                           }}></div>
                      <div className={`absolute -bottom-2 -right-2 w-2 h-2 rounded-full transition-all duration-500 ${
                        isVisible ? 'animate-ping opacity-50' : 'opacity-0'
                      }`}
                           style={{ 
                             backgroundColor: 'var(--accent)',
                             animation: isVisible ? 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite 1.5s' : 'none'
                           }}></div>
                    </div>

                    {/* Badges Container */}
                    <div className={`flex flex-col gap-3 items-center w-full pt-4 transition-all duration-800 delay-1400 ${
                      isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'
                    }`}>
                      {/* Conference Badge */}
                      <div 
                        className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border w-full"
                        style={{ 
                          borderColor: 'var(--accent)',
                          color: 'var(--accent)',
                          backgroundColor: 'var(--bg-primary)',
                          boxShadow: isVisible ? '0 0 15px rgba(var(--accent-rgb), 0.4)' : 'none'
                        }}
                      >
                        <span className="text-sm font-medium whitespace-nowrap">{paper.conference}</span>
                      </div>

                      {/* First Publication Badge */}
                      <div 
                        className="flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border w-full"
                        style={{ 
                          borderColor: 'var(--accent)',
                          color: 'var(--accent)',
                          backgroundColor: 'var(--bg-primary)',
                          boxShadow: isVisible ? '0 0 15px rgba(var(--accent-rgb), 0.4)' : 'none'
                        }}
                      >
                        <span className="text-sm font-medium whitespace-nowrap">First Publication</span>
                      </div>

                      {/* Read Paper Button */}
                      <button
                        onClick={() => window.open(paper.link, '_blank')}
                        className="group/btn relative inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-lg font-semibold text-base overflow-hidden transform-gpu sleeper-cta mt-2"
                        style={{ 
                          backgroundColor: 'var(--bg-primary)',
                          color: 'var(--accent)',
                          boxShadow: '0 8px 25px rgba(var(--accent-rgb), 0.3)'
                        }}
                      >
                        {/* Gradient border */}
                        <div 
                          className="absolute inset-0 rounded-lg border-2 transition-all duration-300"
                          style={{ 
                            borderColor: 'var(--accent)',
                            opacity: 0.5
                          }}
                        ></div>

                        {/* Hover gradient */}
                        <div 
                          className="absolute inset-0 rounded-lg opacity-0 group-hover/btn:opacity-20 transition-opacity duration-300"
                          style={{ 
                            background: 'linear-gradient(to right, var(--accent), transparent, var(--accent))'
                          }}
                        ></div>

                        {/* Moving light effect */}
                        <div 
                          className="absolute top-0 -left-[100%] w-[200%] h-full group-hover/btn:left-[100%] transition-all duration-1000 ease-in-out"
                          style={{ 
                            background: 'linear-gradient(90deg, transparent, rgba(var(--accent-rgb), 0.2), transparent)',
                            opacity: 0.5
                          }}
                        ></div>

                        {/* Button content */}
                        <div className="relative flex items-center gap-2">
                          <FileText 
                            className="w-4 h-4 transition-all duration-400 group-hover/btn:scale-125 group-hover/btn:rotate-12" 
                            style={{ 
                              filter: 'drop-shadow(0 0 8px var(--accent))'
                            }}
                          />
                          <span 
                            className="relative transition-all duration-400 group-hover/btn:translate-x-1 group-hover/btn:tracking-wider"
                            style={{
                              textShadow: '0 0 10px var(--accent)'
                            }}
                          >
                            Read Paper
                          </span>
                          <ExternalLink 
                            className="w-3 h-3 transition-all duration-400 group-hover/btn:translate-x-1 group-hover/btn:rotate-[360deg]" 
                            style={{ 
                              filter: 'drop-shadow(0 0 8px var(--accent))'
                            }}
                          />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Background glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                   style={{ 
                     background: 'radial-gradient(circle at center, var(--accent), transparent 70%)'
                   }}></div>
            </div>
            );
          })}
        </div>

        {/* Future Research Section */}
        <div className={`mt-8 text-center ${smoothTransition} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`} style={{ transitionDelay: isVisible ? '320ms' : '0ms' }}>
          <p className="text-sm mb-20" style={{ color: 'var(--text-secondary)' }}>
             More research coming soon...
          </p>
        </div>
      </div>

      {/* Scroll Indicator - Arrow to Certifications */}
      <button
        onClick={() => {
          const certificationsSection = document.getElementById('certifications');
          if (certificationsSection) {
            certificationsSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        aria-label="Scroll to certifications"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center p-2 rounded-full bg-transparent hover:bg-[var(--bg-secondary)] transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[var(--accent)] soft-bounce"
          aria-hidden="true"
        >
          <path d="M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
};

export default Research;
