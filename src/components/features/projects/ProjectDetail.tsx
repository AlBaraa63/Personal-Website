import React, { useState } from 'react';
import { ExternalLink, Github, X, ZoomIn } from 'lucide-react';
import { Project } from '@/data/portfolioData';

interface ProjectDetailProps {
  project: Project;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project }) => {
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);

  return (
    <div className="min-h-screen py-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Project Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="terminal-prompt" style={{ color: 'var(--accent)' }}>
              {project.title}
            </span>
          </h1>
          <p className="text-xl" style={{ color: 'var(--text-secondary)' }}>
            {project.description}
          </p>
        </div>

        {/* Project Image */}
        <div className="rounded-xl overflow-hidden mb-12">
          <img
            src={project.image}
            alt={`${project.title} - Detailed view of ${project.category} project implementation`}
            className="w-full h-auto"
            loading="eager"
            width="800"
            height="450"
            style={{ aspectRatio: '16/9' }}
            onError={(e) => {
              e.currentTarget.src = '/assets/images/placeholder.svg';
              e.currentTarget.onerror = null;
            }}
          />
        </div>

        {/* Tech Stack */}
        {project.techStack && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
              Tech Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.techStack.frontend && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Frontend</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.frontend.map(tech => (
                      <span key={tech} className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {project.techStack.backend && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Backend</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.backend.map(tech => (
                      <span key={tech} className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {project.techStack.ai && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>AI & ML</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.ai.map(tech => (
                      <span key={tech} className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Challenges & Solutions */}
        {(project.challenges || project.solutions) && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
              Development Journey
            </h2>
            <div className="space-y-8">
              {project.challenges && (
                <div>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Challenges</h3>
                  <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--text-secondary)' }}>
                    {project.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
              )}
              {project.solutions && (
                <div>
                  <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Solutions</h3>
                  <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--text-secondary)' }}>
                    {project.solutions.map((solution, index) => (
                      <li key={index}>{solution}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Outcomes */}
        {project.outcomes && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
              Key Outcomes
            </h2>
            <ul className="list-disc list-inside space-y-2" style={{ color: 'var(--text-secondary)' }}>
              {project.outcomes.map((outcome, index) => (
                <li key={index}>{outcome}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Visuals */}
        {project.visuals && project.visuals.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--accent)' }}>
              Visuals
            </h2>
            <div className="space-y-8">
              {project.visuals.map((visual, index) => (
                <div key={index} className="group rounded-xl overflow-hidden cursor-pointer relative" style={{ backgroundColor: 'var(--bg-secondary)' }}
                  onClick={() => setZoomedImage({ src: visual.src, alt: visual.alt })}>
                  <div className="relative">
                    <img
                      src={visual.src}
                      alt={visual.alt}
                      className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/images/placeholder.svg';
                        e.currentTarget.onerror = null;
                      }}
                    />
                    <div className="absolute top-4 right-4 p-2 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  {visual.caption && (
                    <p className="p-4 text-sm" style={{ color: 'var(--text-secondary)' }}>
                      {visual.caption}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {project.liveDemo && (
            <a
              href={project.liveDemo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'var(--accent)',
                color: 'var(--bg-primary)'
              }}
            >
              <ExternalLink className="w-5 h-5" />
              View Live Demo
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold border-2 transition-all duration-300 hover:scale-105"
              style={{
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
                backgroundColor: 'transparent'
              }}
            >
              <Github className="w-5 h-5" />
              View Source Code
            </a>
          )}
        </div>
      </div>

      {/* Image Zoom Modal */}
      {zoomedImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-sm animate-fadeIn"
          onClick={() => setZoomedImage(null)}
          style={{ cursor: 'zoom-out' }}
        >
          <button
            onClick={() => setZoomedImage(null)}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-200 z-10"
            aria-label="Close zoom"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={zoomedImage.src}
              alt={zoomedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              style={{ cursor: 'zoom-out' }}
            />
            {zoomedImage.alt && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-white text-sm text-center">{zoomedImage.alt}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;