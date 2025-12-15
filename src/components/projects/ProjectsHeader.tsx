import React from 'react';

interface ProjectsHeaderProps {
  title?: string;
  subtitle?: string;
  isVisible: boolean;
}

const ProjectsHeader: React.FC<ProjectsHeaderProps> = ({
  title = './work',
  subtitle = 'From concept to deployment',
  isVisible
}) => {
  const transition = 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const entrance = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

  return (
    <div className={`text-center mb-10 sm:mb-14 ${transition} transform-gpu ${entrance}`}>
      {/* Terminal-style title */}
      <h2
        className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 ${transition} ${entrance}`}
        style={{
          transitionDelay: isVisible ? '90ms' : '0ms',
          color: 'var(--text-primary)'
        }}
      >
        <span style={{ color: 'var(--accent)', fontWeight: '300' }}>[</span>
        {' '}{title}{' '}
        <span style={{ color: 'var(--accent)', fontWeight: '300' }}>]</span>
      </h2>
      
      {/* Subtitle */}
      <p
        className={`text-sm sm:text-base md:text-lg font-mono ${transition} ${entrance}`}
        style={{
          color: 'var(--text-secondary)',
          transitionDelay: isVisible ? '150ms' : '0ms'
        }}
      >
        {subtitle}
      </p>
    </div>
  );
};

export default ProjectsHeader;
