import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import { projects } from '@/data/portfolioData';
import ProjectsHeader from '@/components/features/projects/ProjectsHeader';
import CategoryFilter from '@/components/features/projects/CategoryFilter';
import ProjectsGrid from '@/components/features/projects/ProjectsGrid';
import PortfolioStatsPanel from '@/components/features/projects/PortfolioStatsPanel';
import type { CategoryFilter as CategoryFilterType } from '@/components/features/projects/types';

const Projects: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'ai-cv' | 'web-dev' | 'robotics' | 'other'>('all');
  const [showElements, setShowElements] = useState({
    title: true,
    filters: true,
    cards: true
  });
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const timelineTimeoutsRef = useRef<number[]>([]);
  const hasTriggeredTimelineRef = useRef(false);
  const sectionRef = useRef<HTMLElement>(null);
  const showMoreButtonRef = useRef<HTMLDivElement>(null);

  // Calculate filter counts
  const filters: CategoryFilterType[] = [
    { id: 'all', label: 'All', icon: '📂', count: projects.length },
    { id: 'ai-cv', label: 'AI & CV', icon: '🤖', count: projects.filter(p => p.category === 'ai-cv').length },
    { id: 'web-dev', label: 'Web', icon: '🌐', count: projects.filter(p => p.category === 'web-dev').length },
    { id: 'robotics', label: 'Robotics', icon: '⚙️', count: projects.filter(p => p.category === 'robotics').length },
  ];

  // Calculate stats
  const totalProjects = projects.length;
  const liveDemoCount = projects.filter(project => project.liveDemo).length;
  const totalSkills = projects.reduce((sum, project) => sum + project.skills.length, 0);
  const avgSkillsPerProject = totalProjects ? Math.round(totalSkills / totalProjects) : 0;

  const categoryBreakdown = filters
    .filter(filter => filter.id !== 'all')
    .map(filter => ({
      id: filter.id,
      label: filter.label,
      icon: filter.icon,
      count: filter.count,
      percent: totalProjects ? Math.min(100, Math.round((filter.count / totalProjects) * 100)) : 0
    }));

  // Mobile-specific limits
  const mobileLimit = 6;
  const baseFilteredProjects = activeFilter === 'all'
    ? projects
    : projects.filter(project => project.category === activeFilter);

  const filteredProjects = isMobile && !showAllMobile
    ? baseFilteredProjects.slice(0, mobileLimit)
    : baseFilteredProjects;

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const clearTimeouts = (ref: MutableRefObject<number[]>) => {
    ref.current.forEach(timeout => window.clearTimeout(timeout));
    ref.current = [];
  };

  const handleShowMoreToggle = () => {
    const wasExpanded = showAllMobile;
    setShowAllMobile(!showAllMobile);

    if (wasExpanded && showMoreButtonRef.current) {
      setTimeout(() => {
        showMoreButtonRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 100);
    }
  };

  useEffect(() => {
    // Auto-trigger animations when app opens
    if (!hasTriggeredTimelineRef.current) {
      hasTriggeredTimelineRef.current = true;
      const timeline = [
        { element: 'title' as const, delay: 100 },
        { element: 'filters' as const, delay: 240 },
        { element: 'cards' as const, delay: 400 }
      ];

      timeline.forEach(({ element, delay }) => {
        const timeoutId = window.setTimeout(() => {
          setShowElements(prev => ({ ...prev, [element]: true }));
        }, delay);
        timelineTimeoutsRef.current.push(timeoutId);
      });
    }

    return () => {
      clearTimeouts(timelineTimeoutsRef);
    };
  }, []);

  const smoothTransition = 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const cardsEntrance = showElements.cards ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  return (
    <section id="projects" ref={sectionRef} className="relative h-full w-full p-4 sm:p-8 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <ProjectsHeader isVisible={showElements.title} />

        {/* Main Grid Layout */}
        <div className="grid gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          {/* Left Column: Filters + Projects */}
          <div className="space-y-6 sm:space-y-8">
            {/* Category Filters */}
            <CategoryFilter
              filters={filters}
              activeFilter={activeFilter}
              onFilterChange={(id: string) => setActiveFilter(id as 'all' | 'ai-cv' | 'web-dev' | 'robotics' | 'other')}
              isVisible={showElements.filters}
              totalShowing={filteredProjects.length}
            />

            {/* Projects Grid */}
            <ProjectsGrid
              projects={filteredProjects}
              isVisible={showElements.cards}
              emptyMessage="No projects found in this category"
            />

            {/* Show More Button (Mobile) */}
            {isMobile && baseFilteredProjects.length > mobileLimit && (
              <div
                ref={showMoreButtonRef}
                className={`mt-6 text-center ${smoothTransition} ${cardsEntrance}`}
                style={{ transitionDelay: showElements.cards ? '320ms' : '0ms' }}
              >
                <button
                  onClick={handleShowMoreToggle}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-primary)',
                    boxShadow: '0 8px 24px rgba(var(--accent-rgb), 0.3)'
                  }}
                >
                  <span className="tracking-wide">
                    {showAllMobile ? 'Show Less' : `Show ${baseFilteredProjects.length - mobileLimit} More`}
                  </span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-300 ${showAllMobile ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Stats Panel */}
          <PortfolioStatsPanel
            totalProjects={totalProjects}
            liveDemos={liveDemoCount}
            avgSkillsPerProject={avgSkillsPerProject}
            categoryBreakdown={categoryBreakdown}
            isVisible={showElements.cards}
          />
        </div>
      </div>

    </section>
  );
};

export default Projects;
