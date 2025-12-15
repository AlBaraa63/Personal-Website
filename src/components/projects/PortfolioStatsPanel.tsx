import React, { useState } from 'react';
import { ChevronDown, Zap, Activity, Layers } from 'lucide-react';
import GitHubStats from './GitHubStats';

interface CategoryBreakdown {
  id: string;
  label: string;
  icon: string;
  count: number;
  percent: number;
}

interface CTAConfig {
  title: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

interface PortfolioStatsPanelProps {
  totalProjects: number;
  liveDemos: number;
  avgSkillsPerProject: number;
  categoryBreakdown: CategoryBreakdown[];
  isVisible: boolean;
  cta?: CTAConfig;
}

const defaultCTA: CTAConfig = {
  title: 'Ready to build?',
  heading: "Let's collaborate",
  description: 'Have a project in mind? Let\'s make it happen.',
  buttonText: 'Get in touch',
  buttonLink: '#contact'
};

const PortfolioStatsPanel: React.FC<PortfolioStatsPanelProps> = ({
  totalProjects,
  liveDemos,
  avgSkillsPerProject,
  categoryBreakdown,
  isVisible,
  cta = defaultCTA
}) => {
  // Start collapsed on mobile, expanded on desktop
  const [isExpanded, setIsExpanded] = useState(() => {
    return window.innerWidth >= 1024; // lg breakpoint
  });
  const transition = 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const entrance = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  const stats = [
    { 
      label: 'Projects', 
      value: totalProjects, 
      icon: <Layers className="w-4 h-4" />,
      color: 'var(--accent)' 
    },
    { 
      label: 'Live Demos', 
      value: liveDemos, 
      icon: <Zap className="w-4 h-4" />,
      color: '#60a5fa' 
    },
    { 
      label: 'Avg Skills', 
      value: avgSkillsPerProject, 
      icon: <Activity className="w-4 h-4" />,
      color: '#a78bfa' 
    },
  ];

  return (
    <aside className="space-y-4 sm:space-y-5 lg:sticky lg:top-24">
      {/* Mobile Accordion Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          lg:hidden w-full flex items-center justify-between p-4 rounded-2xl
          ${transition} ${entrance}
        `}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid rgba(var(--accent-rgb), 0.15)'
        }}
      >
        <span 
          className="text-sm font-medium"
          style={{ color: 'var(--text-primary)' }}
        >
          📊 Portfolio Stats
        </span>
        <ChevronDown 
          className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          style={{ color: 'var(--accent)' }}
        />
      </button>

      {/* Stats Content - Collapsible on mobile */}
      <div className={`
        ${isExpanded ? 'block' : 'hidden'} lg:block space-y-4 sm:space-y-5
      `}>
        {/* Portfolio Snapshot */}
        <div
          className={`rounded-2xl p-4 sm:p-5 ${transition} ${entrance}`}
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid rgba(var(--accent-rgb), 0.15)',
            transitionDelay: isVisible ? '200ms' : '0ms'
          }}
        >
          <p 
            className="text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] font-medium mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span style={{ color: 'var(--accent)' }}>▸</span> Portfolio Snapshot
          </p>
          
          <div className="grid grid-cols-3 gap-3 text-center">
            {stats.map((stat, index) => (
              <div 
                key={stat.label}
                className={`${transition} ${entrance}`}
                style={{ transitionDelay: `${250 + index * 50}ms` }}
              >
                <div 
                  className="flex items-center justify-center mb-2 opacity-60"
                  style={{ color: stat.color }}
                >
                  {stat.icon}
                </div>
                <p 
                  className="text-xl sm:text-2xl font-bold"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
                <p 
                  className="text-[0.55rem] sm:text-[0.65rem] uppercase tracking-[0.2em] mt-1"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div
          className={`rounded-2xl p-4 sm:p-5 ${transition} ${entrance}`}
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid rgba(var(--accent-rgb), 0.15)',
            transitionDelay: isVisible ? '280ms' : '0ms'
          }}
        >
          <p 
            className="text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] font-medium mb-4"
            style={{ color: 'var(--text-secondary)' }}
          >
            <span style={{ color: 'var(--accent)' }}>▸</span> Category Breakdown
          </p>
          
          <div className="space-y-3">
            {categoryBreakdown.map((category, index) => (
              <div 
                key={category.id}
                className={`${transition}`}
                style={{ transitionDelay: `${320 + index * 40}ms` }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span 
                    className="text-xs sm:text-sm flex items-center gap-1.5"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <span className="text-sm">{category.icon}</span>
                    {category.label}
                  </span>
                  <span 
                    className="text-[0.65rem] sm:text-xs font-mono"
                    style={{ color: 'var(--accent)' }}
                  >
                    {category.count} <span className="opacity-50">({category.percent}%)</span>
                  </span>
                </div>
                <div 
                  className="h-1.5 w-full rounded-full overflow-hidden"
                  style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ 
                      width: `${category.percent}%`,
                      background: 'linear-gradient(90deg, var(--accent) 0%, rgba(var(--accent-rgb), 0.6) 100%)',
                      boxShadow: '0 0 10px rgba(var(--accent-rgb), 0.3)'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Stats */}
        <GitHubStats username="AlBaraa63" isVisible={isVisible} />

        {/* CTA Card */}
        <div
          className={`rounded-xl p-3 sm:p-4 ${transition} ${entrance}`}
          style={{ 
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid rgba(var(--accent-rgb), 0.15)',
            transitionDelay: isVisible ? '360ms' : '0ms'
          }}
        >
          <p 
            className="text-[0.6rem] sm:text-[0.65rem] uppercase tracking-[0.2em] font-medium mb-1.5"
            style={{ color: 'var(--accent)' }}
          >
            {cta.title}
          </p>
          
          <h3 
            className="text-xs sm:text-sm font-semibold mb-1.5"
            style={{ color: 'var(--text-primary)' }}
          >
            {cta.heading}
          </h3>
          
          <p 
            className="text-[0.65rem] sm:text-xs mb-3"
            style={{ color: 'var(--text-secondary)' }}
          >
            {cta.description}
          </p>
          
          <a
            href={cta.buttonLink}
            className="inline-flex items-center justify-center w-full px-3 py-2 rounded-lg text-[0.65rem] sm:text-xs font-semibold transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: 'var(--accent)',
              color: 'var(--bg-primary)',
              boxShadow: '0 2px 8px rgba(var(--accent-rgb), 0.2)'
            }}
          >
            <span>{cta.buttonText}</span>
            <span className="ml-1.5">→</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default PortfolioStatsPanel;
