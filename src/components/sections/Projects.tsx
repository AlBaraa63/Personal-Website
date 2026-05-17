import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { projects, Project } from '@/data/portfolioData';
import ProjectsHeader from '@/components/features/projects/ProjectsHeader';
import CategoryFilter from '@/components/features/projects/CategoryFilter';
import ProjectsGrid from '@/components/features/projects/ProjectsGrid';
import PortfolioStatsPanel from '@/components/features/projects/PortfolioStatsPanel';
import ProjectInlineDetail from '@/components/features/projects/ProjectInlineDetail';
import type { CategoryFilter as CategoryFilterType } from '@/components/features/projects/types';

type FilterId = 'all' | 'ai-cv' | 'web-dev' | 'robotics' | 'other';

const Projects: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<FilterId>('all');
    const [showAllMobile, setShowAllMobile] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);

    const filters: CategoryFilterType[] = [
        { id: 'all', label: 'All', icon: '📂', count: projects.length },
        { id: 'ai-cv', label: 'AI & CV', icon: '🤖', count: projects.filter(p => p.category === 'ai-cv').length },
        { id: 'web-dev', label: 'Web', icon: '🌐', count: projects.filter(p => p.category === 'web-dev').length },
        { id: 'robotics', label: 'Robotics', icon: '⚙️', count: projects.filter(p => p.category === 'robotics').length },
    ];

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

    const mobileLimit = 6;
    const baseFilteredProjects = activeFilter === 'all'
        ? projects
        : projects.filter(project => project.category === activeFilter);

    const filteredProjects = isMobile && !showAllMobile
        ? baseFilteredProjects.slice(0, mobileLimit)
        : baseFilteredProjects;

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Allow the Command Palette and Holo-AI to deep-link to a specific project.
    useEffect(() => {
        const onSelect = (e: Event) => {
            const detail = (e as CustomEvent<{ id: string }>).detail;
            if (!detail?.id) return;
            const project = projects.find(p => p.id === detail.id);
            if (project) setSelectedProject(project);
        };
        window.addEventListener('holo-os:projects:select', onSelect);
        return () => window.removeEventListener('holo-os:projects:select', onSelect);
    }, []);

    return (
        <section id="projects" className="relative h-full w-full overflow-hidden">
            <AnimatePresence mode="wait">
                {selectedProject ? (
                    <motion.div
                        key="detail"
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 24 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0"
                    >
                        <ProjectInlineDetail
                            project={selectedProject}
                            onBack={() => setSelectedProject(null)}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="grid"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.18 }}
                        className="absolute inset-0 overflow-y-auto custom-scrollbar"
                    >
                        <div className="p-4 sm:p-8">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <ProjectsHeader isVisible={true} />

                                <div className="grid gap-6 sm:gap-8 lg:gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
                                    <div className="space-y-6 sm:space-y-8">
                                        <CategoryFilter
                                            filters={filters}
                                            activeFilter={activeFilter}
                                            onFilterChange={(id: string) => setActiveFilter(id as FilterId)}
                                            isVisible={true}
                                            totalShowing={filteredProjects.length}
                                        />

                                        <ProjectsGrid
                                            projects={filteredProjects}
                                            isVisible={true}
                                            onDetails={(project) => setSelectedProject(project)}
                                            emptyMessage="No projects found in this category"
                                        />

                                        {isMobile && baseFilteredProjects.length > mobileLimit && (
                                            <div className="mt-6 text-center">
                                                <button
                                                    onClick={() => setShowAllMobile(s => !s)}
                                                    className="inline-flex items-center gap-2 px-6 py-3 border border-accent text-accent hover:bg-accent hover:text-black font-mono text-xs uppercase tracking-widest transition-colors"
                                                >
                                                    {showAllMobile ? 'Show Less' : `Show ${baseFilteredProjects.length - mobileLimit} More`}
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    <PortfolioStatsPanel
                                        totalProjects={totalProjects}
                                        liveDemos={liveDemoCount}
                                        avgSkillsPerProject={avgSkillsPerProject}
                                        categoryBreakdown={categoryBreakdown}
                                        isVisible={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Projects;
