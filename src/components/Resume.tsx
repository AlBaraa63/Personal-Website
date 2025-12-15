import React, { useEffect, useRef, useState } from 'react';
import { Download, Save } from 'lucide-react';
import { resumeConfig } from '../data/portfolioData';

const Resume: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const [glitchText, setGlitchText] = useState('???');
  const sectionRef = useRef<HTMLElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glitchCharacters = '!<>-_\\/%^#@&*+=[]{}~`';
    const baseText = '[REDACTED]';
    let interval: NodeJS.Timeout;

    if (isVisible) {
      interval = setInterval(() => {
        const shouldGlitch = Math.random() < 0.7;
        if (shouldGlitch) {
          const glitched = baseText
            .split('')
            .map(char => 
              Math.random() < 0.3 
                ? glitchCharacters[Math.floor(Math.random() * glitchCharacters.length)]
                : char
            )
            .join('');
          setGlitchText(glitched);
        } else {
          setGlitchText(baseText);
        }
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isVisible]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Scroll to preview when it becomes visible
  useEffect(() => {
    if (isPreviewVisible && previewRef.current) {
      // Small delay to ensure the animation starts first
      setTimeout(() => {
        const element = previewRef.current;
        if (element) {
          const elementRect = element.getBoundingClientRect();
          const absoluteElementTop = elementRect.top + window.pageYOffset;
          const middle = absoluteElementTop - (window.innerHeight / 3); // Position at upper-middle of screen
          
          window.scrollTo({
            top: middle,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [isPreviewVisible]);

  const handleDownload = () => {
    // Create a temporary anchor element to trigger the download
    const link = document.createElement('a');
    link.href = resumeConfig.downloadUrl;
    link.setAttribute('download', resumeConfig.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section id="resume" ref={sectionRef} className="relative py-12 sm:py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-8 sm:mb-12 md:mb-16 transition-all duration-700 ease-out ${
          isVisible 
            ? 'opacity-100 translate-y-0' 
            : 'opacity-0 -translate-y-4'
        }`}>
          <h2 className="text-2xl md:text-3xl font-bold mb-3"
              style={{
                color: 'var(--text-primary)'
              }}>
            <span style={{ 
              color: 'var(--text-secondary)'
            }}>
              Resume
            </span>
          </h2>
          <p className={`text-sm md:text-base mt-2 transition-all duration-700 delay-150 ${
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-4'
          }`} 
             style={{ 
               color: 'var(--text-secondary)'
             }}>
            Professional documentation
          </p>
        </div>

        {/* Minimal Resume Interface */}
        <div className={`transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="max-w-3xl mx-auto"
               style={{
                 background: 'var(--bg-secondary)',
                 border: '1px solid var(--border)',
                 borderRadius: '8px',
                 padding: '24px',
                 boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
               }}>
            
            {/* Minimal Content */}
            <div className="space-y-5">
              {/* Header Info */}
              <div className={`text-center space-y-1 transition-opacity duration-500 delay-100 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}>
                <p className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                  AlBaraa AlOlabi
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  Computer Vision Researcher • AI Developer
                </p>
              </div>

              {/* Key Highlights */}
              <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 transition-opacity duration-500 delay-200 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="text-center space-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                    Education
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    BSc Computer Science
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                    Expected 2026
                  </p>
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                    Research
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    IEEE Publication
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                    SNAMS 2025
                  </p>
                </div>
                <div className="text-center space-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                    Expertise
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Deep Learning
                  </p>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                    Computer Vision
                  </p>
                </div>
              </div>

              {/* Tech Stack */}
              <div className={`transition-opacity duration-500 delay-300 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {['Python', 'PyTorch', 'TensorFlow', 'OpenCV', 'YOLO'].map((tech) => (
                    <span
                      key={tech}
                      className="px-2.5 py-0.5 text-[10px] font-medium rounded-full transition-opacity duration-200 hover:opacity-80"
                      style={{
                        backgroundColor: 'var(--bg-primary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border)'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="w-16 h-px mx-auto" style={{ backgroundColor: 'var(--border)' }}></div>

              {/* Download Buttons */}
              <div className={`text-center transition-opacity duration-500 delay-400 ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={handleDownload}
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm border transition-all duration-200 hover:bg-[var(--bg-primary)]"
                    style={{ 
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Resume</span>
                  </button>
                  <button
                    onClick={() => setIsPreviewVisible(!isPreviewVisible)}
                    className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-semibold text-sm border transition-all duration-200 hover:bg-[var(--bg-primary)]"
                    style={{ 
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                      backgroundColor: 'transparent'
                    }}
                  >
                    <span className="transition-all duration-300">
                      {isPreviewVisible ? 'Hide Preview' : 'Show Preview'}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div 
          ref={previewRef}
          className={`mt-8 sm:mt-12 md:mt-16 transition-all duration-500 ${
            isPreviewVisible 
              ? 'opacity-100 max-h-[2000px]' 
              : 'opacity-0 max-h-0 overflow-hidden'
          }`}
        >
          <div className="max-w-4xl mx-auto rounded-lg border p-3 sm:p-4"
               style={{ 
                 background: 'var(--bg-secondary)',
                 borderColor: 'var(--border)',
                 boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
               }}>
            <h3 className={`text-sm sm:text-base font-bold mb-3 sm:mb-4 text-center transition-all duration-800 ${
              isPreviewVisible ? 'opacity-100 scale-110 translate-y-0 delay-200' : 'opacity-0 scale-90 translate-y-4'
            }`} style={{ 
              color: 'var(--text-primary)'
            }}>
              Resume Preview
            </h3>
            
            {/* PDF iframe - Works on both desktop and mobile with Google Drive */}
            <div className={`relative w-full transition-all duration-1000 ${
              isPreviewVisible ? 'opacity-100 scale-100 rotate-0 delay-400' : 'opacity-0 scale-95 rotate-2'
            }`} style={{ 
              paddingTop: '141.4%',
              transform: isPreviewVisible ? 'perspective(800px) rotateY(0deg)' : 'perspective(800px) rotateY(-3deg)'
            }}>
              <iframe
                src={`${resumeConfig.previewUrl}?rm=minimal`}
                className={`absolute top-0 left-0 w-full h-full rounded-lg transition-all duration-700 ${
                  isPreviewVisible ? 'shadow-2xl' : 'shadow-lg'
                }`}
                style={{
                  boxShadow: isPreviewVisible ? '0 25px 50px rgba(0,0,0,0.6)' : '0 10px 20px rgba(0,0,0,0.3)'
                }}
                allow="autoplay"
                loading="lazy"
                key={`resume-preview-${resumeConfig.fileId}`}
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Arrow to Contact */}
      <div className="mt-12 sm:mt-16 flex justify-center">
        <button
          onClick={() => {
            const contactSection = document.getElementById('contact');
            if (contactSection) {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          aria-label="Scroll to contact"
          className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            className="soft-bounce"
            style={{ color: 'var(--accent)' }}
            aria-hidden="true"
          >
            <path d="M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Resume;
