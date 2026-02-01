import React, { useEffect, useRef, useState } from 'react';
import { certifications, Certification } from '@/data/portfolioData';
import CertificateViewer from './CertificateViewer';

const Certifications: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Changed from 768 to 1024 for better tablet support
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Mobile-specific limits
  const mobileLimit = 6; // Increased from 4 to 6 for better experience
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

  const baseEntrance = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';
  const secondaryEntrance = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';
  const smoothTransition = 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const cardEntrance = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5';

  return (
    <section id="certifications" ref={sectionRef} className="relative py-12 sm:py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 ${smoothTransition} transform-gpu ${baseEntrance}`}>
          <h2
            className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 ${smoothTransition} transform-gpu ${secondaryEntrance}`}
            style={{
              transitionDelay: isVisible ? '80ms' : '0ms',
              color: 'var(--text-primary)'
            }}
          >
            <span style={{ color: 'var(--accent)', fontWeight: '300' }}>[</span>
            {' '}./credentials{' '}
            <span style={{ color: 'var(--accent)', fontWeight: '300' }}>]</span>
          </h2>
          <p
            className={`text-lg max-w-3xl mx-auto ${smoothTransition} ${secondaryEntrance}`}
            style={{
              color: 'var(--text-secondary)',
              transitionDelay: isVisible ? '140ms' : '0ms'
            }}
          >
            Credentials earned along the way
          </p>
        </div>

        {/* Featured Certifications Section */}
        {certifications.some(cert => cert.featured) && (
          <div
            className={`mb-12 ${smoothTransition} ${secondaryEntrance}`}
            style={{ transitionDelay: isVisible ? '180ms' : '0ms' }}
          >
            <h3
              className={`text-xl sm:text-2xl font-bold text-center mb-6 ${smoothTransition} ${secondaryEntrance}`}
              style={{ color: '#fbbf24', transitionDelay: isVisible ? '240ms' : '0ms' }}
            >
              Featured Achievements
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {certifications
                .filter(cert => cert.featured)
                .map((cert, index) => (
                  <div
                    key={cert.id}
                    className={`${smoothTransition} transform-gpu ${cardEntrance} group cursor-pointer h-full`}
                    style={{ transitionDelay: isVisible ? `${220 + index * 90}ms` : '0ms' }}
                    onClick={() => setSelectedCert(cert)}
                  >
                    <div className="relative overflow-hidden rounded-xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl h-full flex flex-col"
                      style={{
                        borderColor: '#f59e0b',
                        backgroundColor: 'rgba(245, 158, 11, 0.05)',
                        boxShadow: '0 10px 30px rgba(245, 158, 11, 0.2)'
                      }}>
                      {/* Certificate Preview */}
                      <div className="relative aspect-[1.414/1] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden flex-shrink-0">
                        {cert.pdfPath || cert.imagePath ? (
                          <>
                            {/* Desktop: Show PDF iframe if available, otherwise image */}
                            {cert.pdfPath ? (
                              <iframe
                                src={`${cert.pdfPath}#toolbar=0&navpanes=0&scrollbar=0`}
                                className="hidden lg:block w-full h-full pointer-events-none border-0"
                                style={{ transform: 'scale(1.1)', transformOrigin: 'center' }}
                                title={cert.title}
                                loading="lazy"
                              />
                            ) : null}                          {/* Mobile & Tablet: Show image preview if available, otherwise placeholder */}
                            {cert.imagePath ? (
                              <img
                                src={cert.imagePath}
                                alt={cert.title}
                                loading="lazy"
                                decoding="async"
                                className={`w-full h-full object-cover ${cert.pdfPath ? 'lg:hidden' : ''}`}
                                style={{ objectPosition: 'center center' }}
                              />
                            ) : (
                              <div className="lg:hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
                                <div className="text-center p-4 sm:p-6">
                                  <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">{cert.icon}</div>
                                  <div className="text-sm sm:text-base font-bold mb-2 sm:mb-3 px-2" style={{ color: '#f59e0b' }}>
                                    {cert.title.split(':')[0]}
                                  </div>
                                  <div className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-semibold shadow-lg" style={{
                                    backgroundColor: '#f59e0b',
                                    color: 'white'
                                  }}>
                                    📄 Tap to View
                                  </div>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="text-center p-4">
                              <div className="text-6xl mb-4">{cert.icon}</div>
                              <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                Click to view online
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Overlay on hover - Desktop only */}
                        <div className="hidden lg:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center">
                          <div className="text-white text-center p-4">
                            <div className="text-sm font-semibold mb-2">Click to view full size</div>
                            <div className="text-xs opacity-80">📄 {cert.pdfPath ? 'PDF' : cert.imagePath ? 'Image' : 'External Link'}</div>
                          </div>
                        </div>
                      </div>

                      {/* Certificate Info - Fixed Height */}
                      <div className="p-3 sm:p-4 border-t-2 flex-grow" style={{ borderColor: '#f59e0b' }}>
                        <div className="flex items-start gap-2 sm:gap-3 h-full">
                          <div className="text-xl sm:text-2xl md:text-3xl flex-shrink-0">{cert.icon}</div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs sm:text-sm md:text-base mb-1 line-clamp-2 min-h-[2.25rem] sm:min-h-[2.5rem] md:min-h-[2.75rem]" style={{ color: '#f59e0b' }}>
                              {cert.title}
                            </h4>
                            <p className="text-[10px] sm:text-xs md:text-sm mb-0.5 sm:mb-1 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                              {cert.issuer}
                            </p>
                            <p className="text-[10px] sm:text-xs md:text-sm" style={{ color: 'var(--text-tertiary)' }}>
                              {cert.date}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Featured Badge */}
                      <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-[10px] sm:text-xs font-bold shadow-lg">
                        ⭐ Featured
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {/* Other Certifications */}
        {displayedCerts.length > 0 && (
          <div
            className={`${smoothTransition} ${secondaryEntrance}`}
            style={{ transitionDelay: isVisible ? '260ms' : '0ms' }}
          >
            <div
              className={`flex items-center justify-center gap-4 flex-wrap mb-8 ${smoothTransition} ${secondaryEntrance}`}
              style={{ transitionDelay: isVisible ? '320ms' : '0ms' }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>
                Additional Certifications
              </h3>
              {isMobile && nonFeaturedCerts.length > mobileLimit && (
                <span
                  className={`text-sm px-3 py-1 rounded-full ${smoothTransition} ${secondaryEntrance}`}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)',
                    transitionDelay: isVisible ? '360ms' : '0ms'
                  }}
                >
                  {showAllMobile ? nonFeaturedCerts.length : `${mobileLimit}/${nonFeaturedCerts.length}`}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {displayedCerts.map((cert, index) => (
                <div
                  key={cert.id}
                  className={`${smoothTransition} transform-gpu ${cardEntrance} group cursor-pointer h-full`}
                  style={{ transitionDelay: isVisible ? `${360 + index * 70}ms` : '0ms' }}
                  onClick={() => setSelectedCert(cert)}
                >
                  <div className="relative overflow-hidden rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl h-full flex flex-col"
                    style={{
                      borderColor: 'var(--accent)',
                      backgroundColor: 'rgba(var(--accent-rgb), 0.03)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    }}>
                    {/* Certificate Preview */}
                    <div className="relative aspect-[1.414/1] bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 overflow-hidden flex-shrink-0">
                      {cert.pdfPath || cert.imagePath ? (
                        <>
                          {/* Desktop: Show PDF iframe if available, otherwise image */}
                          {cert.pdfPath ? (
                            <iframe
                              src={`${cert.pdfPath}#toolbar=0&navpanes=0&scrollbar=0`}
                              className="hidden lg:block w-full h-full pointer-events-none border-0"
                              style={{ transform: 'scale(1.1)', transformOrigin: 'center' }}
                              title={cert.title}
                              loading="lazy"
                            />
                          ) : null}

                          {/* Mobile & Tablet: Show image preview if available, otherwise placeholder */}
                          {cert.imagePath ? (
                            <img
                              src={cert.imagePath}
                              alt={cert.title}
                              loading="lazy"
                              decoding="async"
                              className={`w-full h-full object-cover ${cert.pdfPath ? 'lg:hidden' : ''}`}
                              style={{ objectPosition: cert.id === 'amideast-soft-skills' ? 'bottom right' : 'center center' }}
                            />
                          ) : (
                            <div className="lg:hidden w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800">
                              <div className="text-center p-2 sm:p-3 md:p-4">
                                <div className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3">{cert.icon}</div>
                                <div className="text-[10px] sm:text-xs md:text-sm font-semibold mb-1.5 sm:mb-2 px-1" style={{ color: 'var(--accent)' }}>
                                  {cert.title.split(':')[0]}
                                </div>
                                <div className="inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-md sm:rounded-lg text-[9px] sm:text-xs md:text-xs font-medium" style={{
                                  backgroundColor: 'rgba(var(--accent-rgb), 0.2)',
                                  color: 'var(--accent)',
                                  border: '1px solid var(--accent)'
                                }}>
                                  📄 Tap to View
                                </div>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center p-2">
                            <div className="text-4xl mb-2">{cert.icon}</div>
                            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                              Click to view
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Overlay on hover - Desktop only */}
                      <div className="hidden lg:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center z-10">
                        <div className="text-white text-center p-2">
                          <div className="text-xs font-semibold mb-1">View full size</div>
                          <div className="text-[10px] opacity-80">📄 {cert.pdfPath ? 'PDF' : cert.imagePath ? 'Image' : 'Link'}</div>
                        </div>
                      </div>
                    </div>

                    {/* Certificate Info - Fixed Height */}
                    <div className="p-2 sm:p-3 border-t-2 flex-grow" style={{ borderColor: 'var(--accent)' }}>
                      <div className="flex flex-col gap-1 sm:gap-1.5">
                        <div className="flex items-center gap-1 sm:gap-1.5 md:gap-2">
                          <div className="text-lg sm:text-xl md:text-2xl flex-shrink-0">{cert.icon}</div>
                          <h4 className="font-bold text-[10px] sm:text-xs md:text-sm leading-tight line-clamp-2" style={{ color: 'var(--accent)' }}>
                            {cert.title.split(':')[0]}
                          </h4>
                        </div>
                        <div className="text-left pl-0 sm:pl-0">
                          <p className="text-[9px] sm:text-[10px] md:text-xs mb-0.5 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                            {cert.issuer}
                          </p>
                          <p className="text-[8px] sm:text-[9px] md:text-[10px]" style={{ color: 'var(--text-tertiary)' }}>
                            {cert.date}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Show More/Less Button */}
            {isMobile && nonFeaturedCerts.length > mobileLimit && (
              <div
                className={`text-center mt-8 ${smoothTransition} ${secondaryEntrance}`}
                style={{ transitionDelay: isVisible ? '360ms' : '0ms' }}
              >
                <button
                  onClick={() => setShowAllMobile(!showAllMobile)}
                  className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${smoothTransition} hover:-translate-y-1 active:translate-y-0`}
                  style={{
                    backgroundColor: 'var(--accent)',
                    color: 'var(--bg-primary)',
                    boxShadow: '0 12px 30px rgba(var(--accent-rgb), 0.35)'
                  }}
                >
                  <span className="tracking-wide">
                    {showAllMobile ? 'Show Less' : `Show ${nonFeaturedCerts.length - mobileLimit} More`}
                  </span>
                  <svg
                    className={`w-4 h-4 ${smoothTransition} ${showAllMobile ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 9l6 6 6-6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Minimal Closing Note */}
        <div className="text-center mt-16">
          <p className="text-sm font-medium tracking-wide mb-20" style={{ color: 'var(--text-secondary)' }}>
            Always refining the craft.
          </p>
        </div>
      </div>

      {/* Scroll Indicator - Arrow to Resume Snapshot */}
      <button
        onClick={() => {
          const resumeSection = document.getElementById('resume');
          if (resumeSection) {
            resumeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            setTimeout(() => {
              if (resumeSection instanceof HTMLElement) {
                resumeSection.focus({ preventScroll: true });
              }
            }, 400);
          }
        }}
        aria-label="Scroll to resume snapshot"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center p-2 rounded-full bg-transparent hover:bg-[var(--bg-secondary)] transition-colors duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          className="text-[var(--accent)] soft-bounce"
          aria-hidden="true"
        >
          <path d="M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Certificate Viewer Modal */}
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
