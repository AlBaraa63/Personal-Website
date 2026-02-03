import React, { useState, useRef } from 'react';
import { ExternalLink, Github, ChevronRight, Play, Cpu, Layers, Code } from 'lucide-react';
import { Project } from '@/data/portfolioData';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  priority?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, priority = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (project.videoUrl && videoRef.current) {
      videoRef.current.play().catch(() => { });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (project.videoUrl && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  const handleDetailsClick = () => {
    navigate(`/projects/${project.id}`);
  };

  return (
    <motion.div
      layoutId={`project-card-${project.id}`}
      className="group relative h-full flex flex-col"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      {/* Card Frame */}
      <div
        className="relative flex-1 flex flex-col rounded-xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm transition-all duration-300 group-hover:border-accent/50 group-hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.15)] cursor-pointer"
        onClick={handleDetailsClick}
      >

        {/* Animated scanning line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent -translate-x-full group-hover:animate-scan-line opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" />

        {/* Image/Video Container */}
        <div className="relative aspect-video overflow-hidden bg-black/50 border-b border-white/5">
          {project.videoUrl ? (
            <>
              <img
                src={project.image}
                alt={project.title}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                  isHovered ? "opacity-0" : "opacity-100"
                )}
                loading={priority ? "eager" : "lazy"}
              />
              <video
                ref={videoRef}
                src={project.videoUrl}
                className={cn(
                  "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                  isHovered ? "opacity-100" : "opacity-0"
                )}
                muted
                loop
                playsInline
              />
            </>
          ) : (
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading={priority ? "eager" : "lazy"}
            />
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80" />

          {/* Status Icons */}
          <div className="absolute top-3 right-3 flex gap-2">
            {project.featured && (
              <div className="px-2 py-1 rounded bg-yellow-500/20 border border-yellow-500/50 text-yellow-500 text-[10px] font-bold tracking-wider backdrop-blur-md">
                ★ FEATURED
              </div>
            )}
            {project.liveDemo && (
              <div className="p-1.5 rounded bg-green-500/20 border border-green-500/50 text-green-500 backdrop-blur-md">
                <Play size={10} fill="currentColor" />
              </div>
            )}
          </div>

          {/* Category Icon */}
          <div className="absolute top-3 left-3 p-1.5 rounded bg-black/60 border border-white/10 backdrop-blur-md text-accent">
            {project.category === 'ai-cv' ? <Cpu size={14} /> :
              project.category === 'web-dev' ? <Layers size={14} /> :
                <Code size={14} />}
          </div>

          {/* Hover Action Overlay */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center gap-4 transition-opacity duration-300 pointer-events-none",
            isHovered ? "opacity-100" : "opacity-0"
          )}>
            <div className="px-4 py-2 rounded-lg bg-black/60 backdrop-blur-md border border-accent/50 text-accent font-bold tracking-widest text-sm shadow-[0_0_15px_rgba(var(--accent-rgb),0.3)]">
              ACCESS DATA
            </div>
          </div>

        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col relative">
          {/* Decorative Corner */}
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-accent/20 rounded-tr-sm" />

          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors truncate">
              {project.title}
            </h3>
            <p className="text-sm text-text-secondary line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Tech Stack */}
          <div className="flex flex-wrap gap-1.5 mb-6">
            {project.skills.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[10px] px-2 py-0.5 rounded border border-white/10 bg-white/5 text-gray-400 font-mono group-hover:border-accent/30 group-hover:text-accent/80 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {tech}
              </span>
            ))}
            {project.skills.length > 4 && (
              <span className="text-[10px] px-2 py-0.5 text-text-secondary">
                +{project.skills.length - 4}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDetailsClick();
              }}
              className="flex items-center gap-1 text-sm font-medium text-text-primary hover:text-accent transition-colors group/btn"
            >
              DETAILS <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>

            <div className="flex gap-2">
              {project.github && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-text-secondary hover:text-white hover:bg-white/10 rounded transition-colors"
                  title="View Source"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github size={16} />
                </a>
              )}
              {project.liveDemo && (
                <a
                  href={project.liveDemo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-text-secondary hover:text-accent hover:bg-accent/10 rounded transition-colors"
                  title="Live Demo"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;