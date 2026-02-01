import React from 'react';
import { CategoryFilter as CategoryFilterType } from './types';

interface CategoryFilterProps {
  filters: CategoryFilterType[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  isVisible: boolean;
  totalShowing: number;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  filters,
  activeFilter,
  onFilterChange,
  isVisible,
  totalShowing
}) => {
  const transition = 'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const entrance = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  return (
    <div
      className={`rounded-2xl border bg-[var(--bg-secondary)]/80 backdrop-blur-sm p-3 sm:p-5 ${transition} ${entrance}`}
      style={{ 
        borderColor: 'rgba(var(--accent-rgb), 0.15)',
        transitionDelay: isVisible ? '140ms' : '0ms' 
      }}
    >
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-2.5 sm:mb-4">
        <span 
          className="text-[0.55rem] sm:text-xs uppercase tracking-[0.15em] font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span style={{ color: 'var(--accent)' }}>▸</span> Filter
        </span>
        <span 
          className="text-[0.6rem] sm:text-xs font-mono px-1.5 py-0.5 rounded-full"
          style={{ 
            color: 'var(--accent)',
            backgroundColor: 'rgba(var(--accent-rgb), 0.1)'
          }}
        >
          {totalShowing}
        </span>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative -mx-3 sm:mx-0">
        {/* Fade Indicators on Mobile */}
        <div 
          className="absolute left-0 top-0 bottom-0 w-4 pointer-events-none z-10 sm:hidden"
          style={{
            background: 'linear-gradient(to right, var(--bg-secondary), transparent)'
          }}
        />
        <div 
          className="absolute right-0 top-0 bottom-0 w-4 pointer-events-none z-10 sm:hidden"
          style={{
            background: 'linear-gradient(to left, var(--bg-secondary), transparent)'
          }}
        />

        {/* Scrollable Filter Pills */}
        <div className="overflow-x-auto sm:overflow-visible scrollbar-hide px-3 sm:px-0 flex justify-center">
          <div className="flex gap-1.5 sm:gap-2.5 sm:flex-wrap pb-1">
            {filters.map((filter, index) => {
              const isActive = activeFilter === filter.id;
              
              return (
                <button
                  key={filter.id}
                  onClick={() => onFilterChange(filter.id)}
                  className={`
                    group relative flex-shrink-0 px-2 sm:px-4 py-1.5 sm:py-2.5 
                    rounded-md sm:rounded-xl text-[0.65rem] sm:text-sm font-medium
                    transition-all duration-300 transform-gpu
                    ${isActive 
                      ? 'scale-[1.02]' 
                      : 'hover:scale-[1.02] active:scale-[0.98]'
                    }
                  `}
                  style={{
                    backgroundColor: isActive 
                      ? 'var(--accent)' 
                      : 'var(--bg-primary)',
                    color: isActive 
                      ? 'var(--bg-primary)' 
                      : 'var(--text-primary)',
                    border: isActive 
                      ? '1px solid transparent' 
                      : '1px solid rgba(var(--accent-rgb), 0.2)',
                    boxShadow: isActive
                      ? '0 4px 12px rgba(var(--accent-rgb), 0.25)'
                      : 'none',
                    transitionDelay: isVisible ? `${index * 40 + 160}ms` : '0ms'
                  }}
                >
                  {/* Glow on hover */}
                  {!isActive && (
                    <div 
                      className="absolute inset-0 rounded-md sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        boxShadow: '0 0 12px rgba(var(--accent-rgb), 0.15)',
                      }}
                    />
                  )}
                  
                  {/* Mobile: Vertical Layout, Desktop: Horizontal */}
                  <span className="relative z-10 flex flex-col sm:flex-row items-center gap-0 sm:gap-1.5 whitespace-nowrap">
                    {/* Icon - only on tablet+ */}
                    <span className="hidden sm:inline text-xs">
                      {filter.icon}
                    </span>
                    
                    {/* Label */}
                    <span className="tracking-wide leading-tight">
                      {filter.label}
                    </span>
                    
                    {/* Count - below on mobile, inline on desktop */}
                    <span 
                      className="text-[0.65em] sm:text-[0.65em] opacity-60 sm:opacity-70 font-normal leading-tight"
                      style={{ 
                        color: isActive ? 'var(--bg-primary)' : 'var(--text-secondary)' 
                      }}
                    >
                      {filter.count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Swipe Hint */}
      <div 
        className="sm:hidden text-center mt-1.5 text-[0.5rem] opacity-40 font-mono"
        style={{ color: 'var(--text-secondary)' }}
      >
        ← swipe →
      </div>
    </div>
  );
};

export default CategoryFilter;
