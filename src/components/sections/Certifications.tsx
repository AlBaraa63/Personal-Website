import React, { useEffect, useRef, useState } from 'react';
import { certifications, Certification } from '@/data/portfolioData';
import CertificateViewer from './CertificateViewer';
import HudFrame from '@/components/ui/HudFrame';
import { cn } from '@/utils/cn';
import { Award, ChevronRight, Maximize2 } from 'lucide-react';

const Certifications: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile-specific limits
  const mobileLimit = 6;
  const nonFeaturedCerts = certifications.filter(cert => !cert.featured);
  const displayedCerts = isMobile && !showAllMobile
    ? nonFeaturedCerts.slice(0, mobileLimit)
    : nonFeaturedCerts;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const smoothTransition = 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const cardEntrance = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8';

  return (
    <section id="certifications" ref={sectionRef} className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HudFrame title="OS_LICENSES">
          {/* Section Header */}
          <div className={`text-center mb-16 ${smoothTransition} ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-white">
              <span className="text-accent">[</span> Credentials <span className="text-accent">]</span>
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Authorized certifications and verified skill licenses.
            </p>
          </div>

          {/* Featured Certifications */}
          {certifications.some(cert => cert.featured) && (
            <div className="mb-16">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-accent/50" />
                <h3 className="text-xl font-mono text-accent uppercase tracking-widest flex items-center gap-2">
                  <Award size={20} /> Featured
                </h3>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-accent/50" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {certifications
                  .filter(cert => cert.featured)
                  .map((cert, index) => (
                    <div
                      key={cert.id}
                      onClick={() => setSelectedCert(cert)}
                      className={cn(
                        "group relative cursor-pointer h-full",
                        smoothTransition,
                        cardEntrance
                      )}
                      style={{ transitionDelay: isVisible ? `${index * 100}ms` : '0ms' }}
                    >
                      <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-black/40 hover:border-accent transition-all duration-300 h-full flex flex-col hover:shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]">
                        {/* Hexagon decoration */}
                        <div className="absolute top-0 right-0 w-16 h-16 bg-accent/10 clip-path-polygon-[0_0,100%_0,100%_100%] pointer-events-none" />

                        {/* Preview Area */}
                        <div className="relative aspect-[1.414/1] bg-white/5 overflow-hidden border-b border-accent/20">
                          {/* Image/PDF Preview (Simplified for this view) */}
                          {cert.imagePath ? (
                            <img
                              src={cert.imagePath}
                              alt={cert.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          ) : (
                            <div className="flex items-center justify-center w-full h-full bg-accent/5 text-accent/50">
                              <Award size={48} />
                            </div>
                          )}

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <Maximize2 className="text-accent w-8 h-8" />
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                          <h4 className="font-bold text-white mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                            {cert.title}
                          </h4>
                          <div className="mt-auto space-y-1">
                            <p className="text-xs text-text-secondary font-mono">{cert.issuer}</p>
                            <p className="text-[10px] text-text-tertiary font-mono">{cert.date}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Other Certifications Grid */}
          <div className="relative">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10" />
              <h3 className="text-sm font-mono text-text-secondary uppercase tracking-widest">
                Archive
              </h3>
              <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {displayedCerts.map((cert, index) => (
                <div
                  key={cert.id}
                  onClick={() => setSelectedCert(cert)}
                  className={cn(
                    "group relative cursor-pointer",
                    smoothTransition,
                    cardEntrance
                  )}
                  style={{ transitionDelay: isVisible ? `${300 + index * 50}ms` : '0ms' }}
                >
                  <div className="relative p-4 rounded bg-white/5 border border-white/10 hover:border-accent/40 hover:bg-accent/5 transition-all duration-300 flex items-center gap-4">
                    <div className="text-2xl text-accent/50 group-hover:text-accent transition-colors">
                      {cert.icon || <Award size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-accent transition-colors">
                        {cert.title.split(':')[0]}
                      </h4>
                      <p className="text-xs text-text-secondary truncate">{cert.issuer}</p>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-accent transition-colors" />
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Show More */}
            {isMobile && nonFeaturedCerts.length > mobileLimit && (
              <div className="mt-8 text-center">
                <button
                  onClick={() => setShowAllMobile(!showAllMobile)}
                  className="text-xs font-mono text-accent hover:text-white transition-colors border-b border-accent hover:border-white pb-1"
                >
                  {showAllMobile ? 'Collapse Archive' : `Load ${nonFeaturedCerts.length - mobileLimit} More...`}
                </button>
              </div>
            )}
          </div>
        </HudFrame>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateViewer
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          certificate={{
            title: selectedCert.title,
            issuer: selectedCert.issuer,
            date: selectedCert.date,
            imagePath: selectedCert.imagePath,
            pdfPath: selectedCert.pdfPath,
            externalLink: selectedCert.link
          }}
        />
      )}
    </section>
  );
};

export default Certifications;
