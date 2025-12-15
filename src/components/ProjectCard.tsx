import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Github, Eye } from 'lucide-react';
import { Project } from '../data/portfolioData';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const [isInView, setIsInView] = useState(false);
  const [visibleSkillsCount, setVisibleSkillsCount] = useState(project.skills.length);
  const cardRef = useRef<HTMLDivElement>(null);
  const skillsContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px 0px'
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Calculate how many skills can fit based on container width
  useEffect(() => {
    const calculateVisibleSkills = () => {
      if (!skillsContainerRef.current) return;

      const minTagWidth = 120;
      const columns = Math.max(1, Math.floor(skillsContainerRef.current.offsetWidth / minTagWidth));
      const rows = 2;
      const maxSkills = columns * rows;
      setVisibleSkillsCount(Math.min(project.skills.length, maxSkills));
    };

    calculateVisibleSkills();
    window.addEventListener('resize', calculateVisibleSkills);

    return () => window.removeEventListener('resize', calculateVisibleSkills);
  }, [project.skills]);

  const visibleSkills = project.skills.slice(0, visibleSkillsCount);
  const remainingSkillsCount = Math.max(0, project.skills.length - visibleSkillsCount);

  return (
    <div
        ref={cardRef}
        className={`bg-opacity-20 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg transition-all duration-500 sm:hover:scale-105 active:scale-98 sm:hover:shadow-xl transform flex flex-col h-full ${isInView ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* Project Image */}
      <div className="relative overflow-hidden aspect-video">
        <img
          src={project.image}
          alt={`${project.title} - ${project.category} project showcasing ${project.skills.slice(0, 2).join(' and ')} technologies`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          width="400"
          height="225"
          style={{ aspectRatio: '16/9' }}
          onError={(e) => {
            const img = e.currentTarget;
            if (img.src !== '/assets/images/placeholder.svg') {
              img.src = '/assets/images/placeholder.svg';
              img.onerror = null;
            }
          }}
        />
        <div className={`absolute inset-0 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-500 ${isInView || 'group-hover' ? 'opacity-100' : 'opacity-0'}`} />
        
        {/* Featured Badge */}
        {project.featured && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold animate-glow"
               style={{ backgroundColor: 'var(--accent)', color: 'var(--bg-primary)' }}>
            ⭐ Featured
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-4 sm:p-6 flex flex-col flex-1 relative">
        <div className="flex-1 space-y-3">
          <h3 className="text-lg sm:text-xl font-bold line-clamp-2"
              style={{ color: 'var(--text-primary)' }}>
            {project.title}
          </h3>
          
          <p className="text-xs sm:text-sm leading-relaxed line-clamp-2"
             style={{ color: 'var(--text-secondary)' }}>
            {project.description}
          </p>

          {/* Skill Tags */}
          <div
            ref={skillsContainerRef}
            className="grid gap-2 mb-4"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))' }}
          >
            {visibleSkills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 text-xs font-medium rounded-md transition-all duration-200"
                style={{ 
                  backgroundColor: 'rgba(var(--accent-rgb, 34, 197, 94), 0.1)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(var(--accent-rgb, 34, 197, 94), 0.2)'
                }}
              >
                {skill}
              </span>
            ))}
            {remainingSkillsCount > 0 && (
              <span
                className="px-3 py-1 text-xs font-semibold rounded-md"
                style={{ 
                  backgroundColor: 'rgba(var(--accent-rgb, 34, 197, 94), 0.2)',
                  color: 'var(--accent)',
                  border: '1px solid rgba(var(--accent-rgb, 34, 197, 94), 0.3)'
                }}
              >
                +{remainingSkillsCount}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-row gap-2 mt-auto pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
          {/* Removed Quest toggle button */}
          
          {project.liveDemo && (
            <button
              onClick={() => window.open(project.liveDemo, '_blank')}
              className="group relative flex items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium flex-1 touch-manipulation rounded-md shadow-sm border border-blue-500/20 active:shadow-none transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {/* Desktop hover effect */}
              <div className="absolute inset-0 hidden sm:block">
                <div className="absolute inset-0 w-2 bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out group-hover:w-full opacity-80"></div>
              </div>
              {/* Mobile tap effect */}
              <div className="absolute inset-0 sm:hidden rounded-md overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 transition-opacity duration-150 ease-out group-active:opacity-20">
                  <div className="absolute inset-0 animate-pulse-slow mix-blend-overlay"></div>
                </div>
              </div>
              <div className="relative z-10 flex items-center justify-center gap-1">
                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 sm:group-hover:scale-110 sm:group-hover:rotate-6" />
                <span className="transition-all duration-200 sm:group-hover:translate-x-0.5">Demo</span>
              </div>
            </button>
          )}
          
          {project.github && (
            <button
              onClick={() => window.open(project.github, '_blank')}
              className="group relative flex items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium flex-1 touch-manipulation rounded-md shadow-sm border border-gray-500/20 active:shadow-none transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              {/* Desktop hover effect */}
              <div className="absolute inset-0 hidden sm:block">
                <div className="absolute inset-0 w-2 bg-gradient-to-r from-gray-500 to-gray-600 transition-all duration-300 ease-out group-hover:w-full opacity-80"></div>
              </div>
              {/* Mobile tap effect */}
              <div className="absolute inset-0 sm:hidden rounded-md overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-gray-600 opacity-0 transition-opacity duration-150 ease-out group-active:opacity-20">
                  <div className="absolute inset-0 animate-pulse-slow mix-blend-overlay"></div>
                </div>
              </div>
              <div className="relative z-10 flex items-center justify-center gap-1">
                <Github className="w-3 h-3 sm:w-4 sm:h-4 transition-all duration-200 sm:group-hover:scale-110 sm:group-hover:rotate-6" />
                <span className="transition-all duration-200 sm:group-hover:translate-x-0.5">GitHub</span>
              </div>
            </button>
          )}
          
          <button
            onClick={() => {
              // Add a smooth transition effect before navigation
              const card = cardRef.current;
              if (card) {
                card.style.transform = 'scale(0.95)';
                card.style.opacity = '0.8';
                setTimeout(() => {
                  navigate(`/projects/${project.id}`);
                }, 150);
              } else {
                navigate(`/projects/${project.id}`);
              }
            }}
            className="group relative flex items-center justify-center gap-1 px-2 sm:px-3 py-2 text-xs sm:text-sm font-medium flex-1 touch-manipulation rounded-md shadow-sm border border-green-500/20 active:shadow-none transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98]"
            style={{
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-primary)',
              WebkitTapHighlightColor: 'transparent'
            }}
          >
            {/* Desktop hover effect */}
            <div className="absolute inset-0 hidden sm:block">
              <div className="absolute inset-0 w-2 bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-300 ease-out group-hover:w-full opacity-80"></div>
            </div>
            {/* Mobile tap effect */}
            <div className="absolute inset-0 sm:hidden rounded-md overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 opacity-0 transition-opacity duration-150 ease-out group-active:opacity-20">
                <div className="absolute inset-0 animate-pulse-slow mix-blend-overlay"></div>
              </div>
            </div>
            <div className="relative z-10 flex items-center justify-center gap-1">
              <Eye className="w-3 h-3 sm:w-4 sm:h-4 transition-transform duration-150 sm:group-hover:scale-110" />
              <span className="transition-all duration-200 sm:group-hover:translate-x-0.5">Details</span>
            </div>
          </button>
        </div>
      </div>
      
      
    </div>
  );
};

export default ProjectCard;