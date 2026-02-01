import React from 'react';
import ProjectCard from './ProjectCard';
import { Project } from '@/data/portfolioData';

interface ProjectsGridProps {
  projects: Project[];
  isVisible: boolean;
  emptyMessage?: string;
}

const ProjectsGrid: React.FC<ProjectsGridProps> = ({
  projects,
  isVisible,
  emptyMessage = 'No projects found in this category'
}) => {
  const transition = 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const entrance = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  if (projects.length === 0) {
    return (
      <div
        className={`
          text-center py-16 rounded-2xl border border-dashed
          ${transition} ${entrance}
        `}
        style={{
          borderColor: 'rgba(var(--accent-rgb), 0.3)',
          backgroundColor: 'rgba(var(--bg-secondary-rgb), 0.5)'
        }}
      >
        <div
          className="text-4xl mb-4 opacity-50"
          style={{ filter: 'grayscale(50%)' }}
        >
          🔍
        </div>
        <p
          className="text-base font-mono"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span style={{ color: 'var(--accent)' }}>{'> '}</span>
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`
        grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6
        ${transition} ${entrance}
      `}
      style={{ transitionDelay: isVisible ? '200ms' : '0ms' }}
    >
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
};

export default ProjectsGrid;
