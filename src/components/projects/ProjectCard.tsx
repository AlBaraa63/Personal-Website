import React, { useRef, useState } from 'react';
import { ExternalLink, Github, Eye, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    description: string;
    category: string;
    skills: string[];
    image?: string;
    liveDemo?: string;
    github?: string;
    featured?: boolean;
  };
  index: number;
  isVisible: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, isVisible }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const transition = 'transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const cardEntrance = isVisible 
    ? 'opacity-100 translate-y-0 scale-100' 
    : 'opacity-0 translate-y-8 scale-[0.96]';

  // Calculate visible skills
  const maxVisibleSkills = 4;
  const visibleSkills = project.skills.slice(0, maxVisibleSkills);
  const remainingSkillsCount = Math.max(0, project.skills.length - maxVisibleSkills);

  // Generate initials for placeholder
  const getInitials = (title: string) => {
    return title
      .split(/[\s-]+/)
      .slice(0, 2)
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const handleNavigate = () => {
    if (cardRef.current) {
      cardRef.current.style.transform = 'scale(0.96)';
      cardRef.current.style.opacity = '0.8';
      setTimeout(() => navigate(`/projects/${project.id}`), 150);
    } else {
      navigate(`/projects/${project.id}`);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        group relative rounded-2xl overflow-hidden flex flex-col h-full
        ${transition} transform-gpu ${cardEntrance}
      `}
      style={{
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid rgba(var(--accent-rgb), 0.1)',
        transitionDelay: `${index * 80}ms`,
        boxShadow: isHovered 
          ? '0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(var(--accent-rgb), 0.1)'
          : '0 4px 20px rgba(0,0,0,0.15)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail / Image Section */}
      <div className="relative overflow-hidden aspect-video">
        {/* Image or Placeholder */}
        {project.image && !imageError ? (
          <>
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div 
                className="absolute inset-0 animate-pulse"
                style={{ backgroundColor: 'var(--bg-primary)' }}
              />
            )}
            <img
              src={project.image}
              alt={`${project.title} thumbnail`}
              className={`
                w-full h-full object-cover transition-all duration-500
                ${isHovered ? 'scale-105' : 'scale-100'}
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          </>
        ) : (
          // Gradient placeholder with initials
          <div 
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.2) 0%, var(--bg-primary) 100%)'
            }}
          >
            <span 
              className="text-3xl sm:text-4xl font-bold opacity-30"
              style={{ color: 'var(--accent)' }}
            >
              {getInitials(project.title)}
            </span>
          </div>
        )}

        {/* Gradient overlay */}
        <div 
          className={`
            absolute inset-0 transition-opacity duration-300
            ${isHovered ? 'opacity-60' : 'opacity-40'}
          `}
          style={{
            background: 'linear-gradient(to top, var(--bg-secondary) 0%, transparent 60%)'
          }}
        />

        {/* Featured badge */}
        {project.featured && (
          <div 
            className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm"
            style={{ 
              backgroundColor: 'rgba(var(--accent-rgb), 0.9)',
              color: 'var(--bg-primary)',
              boxShadow: '0 0 15px rgba(var(--accent-rgb), 0.4)'
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>Featured</span>
          </div>
        )}

        {/* Category tag */}
        <div 
          className="absolute top-3 left-3 px-2 py-1 rounded-md text-[0.65rem] font-medium uppercase tracking-wider backdrop-blur-sm"
          style={{ 
            backgroundColor: 'rgba(var(--bg-primary-rgb), 0.7)',
            color: 'var(--text-secondary)',
            border: '1px solid rgba(var(--accent-rgb), 0.2)'
          }}
        >
          {project.category.replace('-', ' ')}
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Title */}
        <h3 
          className={`
            text-base sm:text-lg font-bold line-clamp-2 mb-2
            transition-colors duration-300
          `}
          style={{ 
            color: isHovered ? 'var(--accent)' : 'var(--text-primary)' 
          }}
        >
          {project.title}
        </h3>

        {/* Description */}
        <p 
          className="text-xs sm:text-sm leading-relaxed line-clamp-2 mb-4 flex-grow"
          style={{ color: 'var(--text-secondary)' }}
        >
          {project.description}
        </p>

        {/* Tech Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {visibleSkills.map((skill) => (
            <span
              key={skill}
              className="px-2 py-0.5 text-[0.65rem] sm:text-xs font-medium rounded-md transition-all duration-200"
              style={{ 
                backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
                color: 'var(--accent)',
                border: '1px solid rgba(var(--accent-rgb), 0.2)'
              }}
            >
              {skill}
            </span>
          ))}
          {remainingSkillsCount > 0 && (
            <span
              className="px-2 py-0.5 text-[0.65rem] sm:text-xs font-semibold rounded-md"
              style={{ 
                backgroundColor: 'rgba(var(--accent-rgb), 0.15)',
                color: 'var(--accent)',
              }}
            >
              +{remainingSkillsCount}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div 
          className="flex gap-2 pt-3 mt-auto"
          style={{ borderTop: '1px solid rgba(var(--accent-rgb), 0.1)' }}
        >
          {project.liveDemo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.liveDemo, '_blank');
              }}
              className="group/btn flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                color: '#60a5fa',
                border: '1px solid rgba(59, 130, 246, 0.2)'
              }}
            >
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:rotate-12" />
              <span>Demo</span>
            </button>
          )}
          
          {project.github && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                window.open(project.github, '_blank');
              }}
              className="group/btn flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: 'rgba(156, 163, 175, 0.1)',
                color: 'var(--text-secondary)',
                border: '1px solid rgba(156, 163, 175, 0.2)'
              }}
            >
              <Github className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
              <span>GitHub</span>
            </button>
          )}
          
          <button
            onClick={handleNavigate}
            className="group/btn flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
              color: 'var(--accent)',
              border: '1px solid rgba(var(--accent-rgb), 0.2)'
            }}
          >
            <Eye className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
            <span>Details</span>
          </button>
        </div>
      </div>

      {/* Hover border glow */}
      <div 
        className={`
          absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          border: '1px solid rgba(var(--accent-rgb), 0.4)',
          boxShadow: 'inset 0 0 20px rgba(var(--accent-rgb), 0.05)'
        }}
      />
    </div>
  );
};

export default ProjectCard;
