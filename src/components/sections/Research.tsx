import React, { useEffect, useRef, useState } from 'react';
import { Trophy, ExternalLink, FileText, Eye } from 'lucide-react';
import { research } from '@/data/portfolioData';
import HudFrame from '@/components/ui/HudFrame';
import CyberButton from '@/components/ui/CyberButton';
import { cn } from '@/utils/cn';

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
      className="relative py-16 sm:py-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HudFrame title="RESEARCH_LOGS">
          {/* Section Header */}
          <div className={`text-center mb-12 sm:mb-16 ${smoothTransition} ${headerEntrance}`}>
            <h2
              className={`text-4xl md:text-5xl font-bold mb-4 ${smoothTransition} ${headerEntrance}`}
              style={{
                transitionDelay: isVisible ? '90ms' : '0ms',
                color: 'var(--text-primary)'
              }}
            >
              Scientific <span className="text-accent">Publications</span>
            </h2>
            <p
              className={`text-lg mt-3 max-w-2xl mx-auto ${smoothTransition} ${headerEntrance}`}
              style={{
                color: 'var(--text-secondary)',
                transitionDelay: isVisible ? '140ms' : '0ms'
              }}
            >
              Contributing to the frontier of Artificial Intelligence
            </p>
          </div>

          {/* Research Papers */}
          <div className="space-y-12">
            {research.map((paper, index) => {
              const cardVisible = visiblePaperIndex >= index;

              return (
                <div
                  key={paper.id}
                  className={cn(
                    "group relative overflow-visible rounded-xl",
                    smoothTransition,
                    cardVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
                  )}
                  style={{
                    transitionDelay: cardVisible ? `${index * 120}ms` : '0ms'
                  }}
                >
                  {/* Glass Card */}
                  <div className="relative p-6 sm:p-8 lg:p-10 z-10 bg-bg-secondary/40 backdrop-blur-md rounded-xl border border-white/5 group-hover:border-accent/30 transition-colors duration-500">
                    {/* Horizontal Scanning Line */}
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent -translate-x-full group-hover:animate-scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    {/* Vertical Scanning Line */}
                    <div className="absolute top-0 left-0 h-full w-[1px] bg-gradient-to-b from-transparent via-accent to-transparent -translate-y-full group-hover:animate-scan-line-vertical opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                    <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
                      {/* Paper Content */}
                      <div className="lg:col-span-2 space-y-6">
                        {/* Title Box */}
                        <div className="relative">
                          <h3 className="text-2xl sm:text-3xl font-bold leading-tight text-white mb-2">
                            {paper.title}
                          </h3>
                          <div className="h-1 w-20 bg-accent rounded-full mb-4" />
                        </div>

                        {/* Abstract and Preview */}
                        <div className="relative overflow-hidden rounded-lg bg-black/40 border border-white/10 group-hover:border-accent/20 transition-colors">

                          {/* Toggle Buttons */}
                          <div className="flex border-b border-white/10">
                            <button
                              onClick={() => setShowPaperPreview(prev => ({ ...prev, [paper.id]: false }))}
                              className={cn(
                                "flex-1 px-4 py-3 text-sm font-semibold font-mono uppercase tracking-wider transition-all duration-300 disabled:opacity-50",
                                !showPaperPreview[paper.id] ? "bg-accent/10 text-accent border-b-2 border-accent" : "text-text-secondary hover:text-white"
                              )}
                            >
                              Abstract
                            </button>
                            <button
                              onClick={() => setShowPaperPreview(prev => ({ ...prev, [paper.id]: true }))}
                              className={cn(
                                "flex-1 px-4 py-3 text-sm font-semibold font-mono uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2",
                                showPaperPreview[paper.id] ? "bg-accent/10 text-accent border-b-2 border-accent" : "text-text-secondary hover:text-white"
                              )}
                            >
                              <Eye className="w-4 h-4" />
                              Preview
                            </button>
                          </div>

                          {/* Content Area */}
                          <div className="relative overflow-hidden min-h-[200px]">
                            {/* Abstract Content */}
                            <div className={cn(
                              "transform transition-all duration-500 p-6 absolute inset-0 overflow-y-auto scrollbar-thin scrollbar-thumb-accent/20",
                              !showPaperPreview[paper.id] ? "opacity-100 translate-y-0 relative" : "opacity-0 -translate-y-4 absolute pointer-events-none"
                            )}>
                              <p className="text-base sm:text-lg leading-relaxed text-justify text-text-secondary font-sans">
                                {paper.abstract}
                              </p>
                            </div>

                            {/* Paper Preview */}
                            <div className={cn(
                              "transform transition-all duration-500 absolute inset-0 w-full h-full",
                              showPaperPreview[paper.id] ? "opacity-100 translate-y-0 relative z-10" : "opacity-0 translate-y-4 pointer-events-none"
                            )}>
                              {showPaperPreview[paper.id] && paper.link && (
                                <iframe
                                  src={paper.link.replace('/view?usp=drive_link', '/preview')}
                                  title="Research paper preview"
                                  className="w-full h-full border-0"
                                  allow="autoplay"
                                  loading="lazy"
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Visual Element & Actions */}
                      <div className="lg:col-span-1 flex flex-col items-center justify-between h-full gap-8">
                        {/* Trophy/Achievement Visual */}
                        <div className="relative group/trophy">
                          <div
                            className="w-32 h-32 lg:w-40 lg:h-40 rounded-full border-2 border-accent/30 bg-accent/5 flex items-center justify-center relative overflow-hidden transition-all duration-500 group-hover/trophy:border-accent group-hover/trophy:shadow-[0_0_30px_rgba(var(--accent-rgb),0.3)]"
                          >
                            <div className="absolute inset-0 bg-accent/10 scale-0 group-hover/trophy:scale-100 transition-transform duration-500 rounded-full" />
                            <Trophy
                              className="w-14 h-14 lg:w-20 lg:h-20 text-accent/80 group-hover/trophy:text-accent transition-all duration-500 group-hover/trophy:scale-110 group-hover/trophy:rotate-12"
                              strokeWidth={1.5}
                            />
                          </div>
                          {/* Floating particles simplified */}
                          <div className="absolute -top-2 -right-2 w-3 h-3 bg-accent rounded-full animate-ping opacity-75" />
                          <div className="absolute bottom-0 -left-2 w-2 h-2 bg-accent rounded-full animate-pulse opacity-75" />
                        </div>

                        {/* Badges Container */}
                        <div className="flex flex-col gap-3 w-full">
                          {/* Conference Badge */}
                          <div className="px-4 py-2 rounded bg-black/40 border border-accent/30 text-accent text-center font-mono text-sm relative overflow-hidden group/badge">
                            <span className="relative z-10">{paper.conference}</span>
                            <div className="absolute inset-0 bg-accent/10 translate-x-[-100%] group-hover/badge:translate-x-0 transition-transform duration-500" />
                          </div>

                          {/* First Publication Badge */}
                          <div className="px-4 py-2 rounded bg-black/40 border border-accent/20 text-text-secondary text-center font-mono text-xs uppercase tracking-widest">
                            First Publication
                          </div>

                          {/* Read Paper Button */}
                          <CyberButton
                            onClick={() => window.open(paper.link, '_blank')}
                            variant="primary"
                            className="w-full justify-center mt-2 group/btn"
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Read Paper
                            <ExternalLink className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                          </CyberButton>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Future Research */}
          <div className="mt-16 text-center">
            <p className="text-sm font-mono text-text-tertiary animate-pulse cursor-default">
              [ awaiting_further_data... ]
            </p>
          </div>
        </HudFrame>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => document.getElementById('certifications')?.scrollIntoView({ behavior: 'smooth' })}
        aria-label="Scroll to certifications"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-2 hover:bg-white/5 rounded-full transition-colors group"
      >
        <div className="w-6 h-10 border-2 border-accent/30 rounded-full flex justify-center pt-2 group-hover:border-accent transition-colors">
          <div className="w-1 h-2 bg-accent rounded-full animate-scroll-down" />
        </div>
      </button>
    </section>
  );
};

export default Research;
