import React, { useMemo, useState } from 'react';
import { ExternalLink, Github, Trophy, Rocket, Swords, Map, Sparkles, Eye, ArrowLeft, X, ZoomIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../data/portfolioData';
import { generateProjectDetails } from '../utils/gamifiedDetails';

type MediaItem = { type: 'image' | 'video' | 'gif'; src: string; alt?: string };

export interface GameProjectDetailProps {
  project: Project;
  media?: MediaItem[]; // Visuals carousel items
  features?: string[]; // Quest objectives
  inventory?: string[]; // Technologies & skills icons/badges (fallbacks to project.skills)
  timeline?: { level: string; note: string }[]; // Level progression
  bossFights?: { challenge: string; solution: string }[]; // Challenges & Solutions pairs
  demoEmbed?: React.ReactNode; // Interactive demo
  links?: { github?: string; liveDemo?: string; paper?: string };
}

const Section: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }>
  = ({ title, icon, children }) => (
  <section className="mb-12 opacity-0 animate-fadeInUp" style={{ animationFillMode: 'forwards', animationDuration: '600ms' }}>
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h2 className="text-2xl font-extrabold tracking-wide" style={{ color: 'var(--accent)' }}>{title}</h2>
    </div>
    <div className="rounded-xl border p-4 md:p-6 bg-black/20 backdrop-blur-sm"
         style={{ borderColor: 'var(--border)' }}>
      {children}
    </div>
  </section>
);

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="px-3 py-1 rounded-full text-xs border shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-0.5"
        style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>{children}</span>
);

const GameProjectDetail: React.FC<GameProjectDetailProps> = ({
  project,
  media,
  features,
  inventory,
  timeline,
  bossFights,
  demoEmbed,
  links
}) => {
  const navigate = useNavigate();
  const summary = useMemo(() => generateProjectDetails(project), [project]);
  const items: MediaItem[] = media ?? [{ type: 'image', src: project.image, alt: project.title }];
  const skills = inventory ?? project.skills;
  const linkSet = { github: project.github, liveDemo: project.liveDemo, ...(links ?? {}) };
  
  // Zoom modal state
  const [zoomedImage, setZoomedImage] = useState<{ src: string; alt: string } | null>(null);

  const handleBackClick = () => {
    // Add smooth transition effect before navigation
    document.body.style.opacity = '0.9';
    document.body.style.transform = 'scale(0.98)';
    setTimeout(() => {
      navigate('/', { state: { fromProject: true } });
    }, 150);
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-50">
        <button
          onClick={handleBackClick}
          className="nav-transition flex items-center gap-2 px-4 py-2 rounded-lg border backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:shadow-lg"
          style={{ 
            backgroundColor: 'var(--bg-secondary)', 
            borderColor: 'var(--border)',
            color: 'var(--text-primary)'
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline text-sm font-medium">Back to Portfolio</span>
        </button>
      </div>

      {/* Hero Banner */}
  <div className="relative overflow-hidden py-10 sm:py-14 md:py-20 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="h-full w-full opacity-20 animate-pulse-slow" style={{
            background: 'radial-gradient(1200px 400px at 50% -10%, rgba(99,102,241,0.4), transparent)'
          }} />
        </div>
        <div className="max-w-6xl mx-auto px-4 md:px-6 relative">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border animate-glow"
                   style={{ borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping-slow" />
                <span className="text-xs uppercase tracking-widest">{project.category}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black leading-tight" style={{ color: 'var(--text-primary)' }}>
                {project.title}
              </h1>
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-md border border-blue-500/40 text-blue-300 bg-blue-500/10 select-none">
                <Trophy className="w-4 h-4" />
                <span className="text-sm font-semibold">Working On</span>
              </div>
            </div>
            <div className="hidden md:block">
              <img src={project.image} alt={project.title} className="w-56 h-32 object-cover rounded-lg border"
                   style={{ borderColor: 'var(--border)' }} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        {/* Quest Log */}
        <Section title="Quest Log" icon={<Rocket className="w-5 h-5 text-emerald-400" /> }>
          <p className="leading-relaxed text-justify" style={{ color: 'var(--text-secondary)' }}>{summary}</p>
        </Section>

        {/* Visuals Carousel */}
        <Section title="Visuals" icon={<Eye className="w-5 h-5 text-sky-400" /> }>
          <div className="-mx-2 sm:mx-0">
            <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible snap-x snap-mandatory px-2 sm:px-0" role="list">
              {items.map((m, idx) => (
                <div role="listitem" key={idx} className="group relative overflow-hidden rounded-xl border bg-black/30 flex-shrink-0 w-[82%] xs:w-[70%] sm:w-auto snap-center cursor-pointer"
                     style={{ borderColor: 'var(--border)' }}
                     onClick={() => (m.type === 'image' || m.type === 'gif') && setZoomedImage({ src: m.src, alt: m.alt ?? '' })}>
                  {m.type === 'image' && (
                    <>
                      <img loading="lazy" src={m.src} alt={m.alt ?? ''}
                           className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </>
                  )}
                  {m.type === 'gif' && (
                    <>
                      <img loading="lazy" src={m.src} alt={m.alt ?? ''}
                           className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute top-2 right-2 p-2 rounded-full bg-black/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </>
                  )}
                  {m.type === 'video' && (
                    <video className="w-full h-56 object-cover" controls muted playsInline>
                      <source src={m.src} />
                    </video>
                  )}
                  <div className="absolute inset-0 pointer-events-none" style={{
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
                  }} />
                </div>
              ))}
            </div>
          </div>
        </Section>

        {/* Inventory / Power-Ups */}
        <Section title="Inventory" icon={<Sparkles className="w-5 h-5 text-fuchsia-400" /> }>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        </Section>

        {/* Quest Objectives */}
        {features && features.length > 0 && (
          <Section title="Quest Objectives" icon={<Map className="w-5 h-5 text-orange-400" /> }>
            <ul className="space-y-2">
              {features.map((f, i) => (
                <li key={i} className="flex items-start gap-2" style={{ color: 'var(--text-secondary)' }}>
                  <span className="mt-1 inline-block w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}

        {/* Interactive Demo */}
        {demoEmbed && (
          <Section title="Interactive Demo" icon={<Swords className="w-5 h-5 text-red-400" /> }>
            <div className="aspect-video w-full rounded-xl overflow-hidden border bg-black/30" style={{ borderColor: 'var(--border)' }}>
              {demoEmbed}
            </div>
          </Section>
        )}

        {/* Level Progression Timeline */}
        {timeline && timeline.length > 0 && (
          <Section title="Level Progression" icon={<Map className="w-5 h-5 text-cyan-400" /> }>
            <ol className="relative border-l pl-6 space-y-6" style={{ borderColor: 'var(--border)' }}>
              {timeline.map((t, i) => (
                <li key={i} className="ml-2">
                  <div className="absolute -left-[6px] mt-1 w-3 h-3 rounded-full bg-violet-500" />
                  <h4 className="font-bold" style={{ color: 'var(--text-primary)' }}>{t.level}</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t.note}</p>
                </li>
              ))}
            </ol>
          </Section>
        )}

        {/* Boss Fights */}
        {bossFights && bossFights.length > 0 && (
          <Section title="Boss Fights" icon={<Swords className="w-5 h-5 text-rose-400" /> }>
            <div className="grid md:grid-cols-2 gap-4">
              {bossFights.map((bf, i) => (
                <div key={i} className="rounded-lg p-4 border bg-black/30" style={{ borderColor: 'var(--border)' }}>
                  <h4 className="font-semibold mb-2 text-rose-300">Challenge</h4>
                  <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>{bf.challenge}</p>
                  <h4 className="font-semibold mb-2 text-emerald-300">Solution</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{bf.solution}</p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Links */}
        <div className="flex flex-wrap gap-3 justify-center py-6">
          {linkSet.liveDemo && (
            <a href={linkSet.liveDemo} target="_blank" className="px-4 py-3 rounded-md border bg-black/30 hover:-translate-y-0.5 hover:shadow transition text-sm sm:text-base" style={{ borderColor: 'var(--accent)', color: 'var(--text-primary)' }}>
              <ExternalLink className="inline w-4 h-4 mr-2" /> Live Demo
            </a>
          )}
          {linkSet.github && (
            <a href={linkSet.github} target="_blank" className="px-4 py-3 rounded-md border bg-black/30 hover:-translate-y-0.5 hover:shadow transition text-sm sm:text-base" style={{ borderColor: 'var(--accent)', color: 'var(--text-primary)' }}>
              <Github className="inline w-4 h-4 mr-2" /> Source
            </a>
          )}
          {links?.paper && (
            <a href={links.paper} target="_blank" className="px-4 py-3 rounded-md border bg-black/30 hover:-translate-y-0.5 hover:shadow transition text-sm sm:text-base" style={{ borderColor: 'var(--accent)', color: 'var(--text-primary)' }}>
              Paper / Report
            </a>
          )}
        </div>

        {/* Easter Egg */}
        <div className="mt-6 text-center text-xs opacity-70 select-none" title="Konami?">
          Press ↑ ↑ ↓ ↓ ← → ← → B A on this page ;)
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

export default GameProjectDetail;
