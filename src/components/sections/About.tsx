import React, { useState, useEffect, useRef } from 'react';
import { Download, Eye, EyeOff } from 'lucide-react';
import { resumeConfig } from '@/data/portfolioData';

const About: React.FC = () => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showElements, setShowElements] = useState({
    title: false,
    subtitle: false,
    codeBlock: false,
    status: false,
    resumeCard: false
  });
  const sectionRef = useRef<HTMLElement>(null);
  const resumeCardRef = useRef<HTMLDivElement>(null);
  const [showResumePreview, setShowResumePreview] = useState(false);

  const codeContent = `{
  "role": "CV Engineer @ Cellula Technologies",
  "focus": "Computer Vision, Edge AI & Deep Learning",

  "expertise": {
    "ai_ml": [
      "Computer Vision (OpenCV, YOLOv8, MediaPipe)",
      "Deep Learning (PyTorch, TensorFlow)",
      "NLP (Hugging Face BART)",
      "ML (scikit-learn, NumPy, Pandas)"
    ],
    "languages": [
      "Python", "C++", "C", "Java",
      "TypeScript", "JavaScript"
    ],
    "tools": [
      "Git & GitHub",
      "Gradio", "Streamlit", "FastAPI",
      "React Native", "Node.js", "SQLite",
      "MCP (Model Context Protocol)"
    ]
  },

  "certifications": [
    "CS50x - Harvard University",
    "CS50P - Harvard University",
    "CS50AI - Harvard (In Progress)",
    "Samsung Innovation Campus",
    "IEEE SNAMS 2025 - Published Author"
  ],

  "status": "Open to opportunities",
  "availability": true
}`;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          // Staggered animation timeline
          const timeline = [
            { element: 'title', delay: 80 },
            { element: 'subtitle', delay: 160 },
            { element: 'codeBlock', delay: 280 },
            { element: 'status', delay: 750 },
            { element: 'resumeCard', delay: 1050 }
          ];

          timeline.forEach(({ element, delay }) => {
            setTimeout(() => {
              setShowElements(prev => ({ ...prev, [element]: true }));
            }, delay);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let index = 0;
    const chunkSize = 5; // Larger chunks for faster typing
    const typeInterval = setInterval(() => {
      if (index <= codeContent.length) {
        setDisplayedCode(codeContent.slice(0, index));
        index += chunkSize;
      } else {
        setDisplayedCode(codeContent);
        clearInterval(typeInterval);
      }
    }, 10); // Even faster interval

    return () => clearInterval(typeInterval);
  }, [isVisible]);

  useEffect(() => {
    if (showResumePreview && resumeCardRef.current) {
      setTimeout(() => {
        resumeCardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }, 150);
    }
  }, [showResumePreview]);

  const handleResumeDownload = () => {
    const link = document.createElement('a');
    link.href = resumeConfig.downloadUrl;
    link.setAttribute('download', resumeConfig.fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleToggleResumePreview = () => {
    setShowResumePreview(prev => !prev);
  };

  const highlightSyntax = (code: string) => {
    return code
      .replace(/(\/\/.*$)/gm, '<span style="color: #6b7280; font-style: italic;">$1</span>')
      .replace(/"([^"]*)":/g, '<span style="color: #60a5fa;">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span style="color: #34d399;">"$1"</span>')
      .replace(/: (true|false)/g, ': <span style="color: #fb923c;">$1</span>')
      .replace(/(\{|\}|\[|\])/g, '<span style="color: var(--accent);">$&</span>')
      .replace(/,/g, '<span style="color: #9ca3af;">,</span>');
  };

  const smoothTransition = 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const resumeEntrance = showElements.resumeCard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6';

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-16 sm:py-20"
      style={{ scrollMarginTop: '4rem' }}
    >
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-8 sm:mb-12 ${smoothTransition} transform-gpu ${showElements.title ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-6'
          }`}>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4"
            style={{ color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--accent)', fontWeight: '300' }}>[</span>
            {' '}./about{' '}
            <span style={{ color: 'var(--accent)', fontWeight: '300' }}>]</span>
          </h2>
          <p className={`text-sm sm:text-base md:text-lg ${smoothTransition} ${showElements.subtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ color: 'var(--text-secondary)' }}>
            Teaching machines to see, think, and act
          </p>
        </div>

        {/* Code Block */}
        <div className={`w-full max-w-2xl mx-auto ${smoothTransition} transform-gpu ${showElements.codeBlock ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
          <div
            className="rounded-xl overflow-hidden h-[620px] sm:h-[720px] md:h-[800px]"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
            }}>
            {/* Window Header */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{
                borderColor: 'var(--border)',
                background: 'rgba(var(--accent-rgb), 0.05)'
              }}>
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-2 text-xs sm:text-sm font-mono" style={{ color: 'var(--accent)' }}>
                📄 profile.json
              </span>
            </div>

            {/* Code Content */}
            <div
              className="p-3 sm:p-6 md:p-8"
              style={{
                background: 'var(--bg-primary)',
                height: 'calc(100% - 49px)'
              }}>
              <pre className="text-[10px] sm:text-xs md:text-sm leading-relaxed m-0">
                <code
                  className="font-mono block"
                  dangerouslySetInnerHTML={{ __html: highlightSyntax(displayedCode) }}
                  style={{
                    color: 'var(--text-primary)',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-wrap'
                  }}
                />
                {isVisible && displayedCode.length < codeContent.length && (
                  <span
                    className="animate-pulse inline-block ml-1"
                    style={{
                      color: 'var(--accent)',
                      fontSize: '1.2em'
                    }}>|</span>
                )}
              </pre>
            </div>
          </div>
        </div>

        {/* Resume Card */}
        <div
          id="resume"
          ref={resumeCardRef}
          tabIndex={-1}
          className={`mt-8 sm:mt-12 max-w-2xl mx-auto ${smoothTransition} ${resumeEntrance}`}
        >
          <div
            className={`relative overflow-hidden rounded-xl border p-4 sm:p-6 ${smoothTransition}`}
            style={{
              background: 'rgba(var(--bg-primary-rgb), 0.8)',
              backdropFilter: 'blur(12px)',
              borderColor: 'var(--border)',
              boxShadow: showElements.resumeCard
                ? '0 20px 44px rgba(0,0,0,0.26), 0 0 32px rgba(var(--accent-rgb), 0.14)'
                : '0 12px 28px rgba(0,0,0,0.18)'
            }}
          >
            <div className="flex flex-col gap-4 relative z-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between items-center gap-3">
                <div>
                  <span className="text-[9px] font-semibold uppercase tracking-[0.25em] block mb-1"
                    style={{ color: 'var(--accent)' }}>
                    Save Game
                  </span>
                  <h3 className="text-xs sm:text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                    Resume &amp; Credentials
                  </h3>
                </div>
                <div className="flex flex-row gap-2">
                  <button
                    type="button"
                    onClick={handleResumeDownload}
                    className={`group inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border font-semibold text-[10px] sm:text-xs ${smoothTransition} sleeper-cta`}
                    style={{
                      borderColor: 'var(--accent)',
                      color: 'var(--accent)',
                      backgroundColor: 'rgba(var(--accent-rgb), 0.08)'
                    }}
                  >
                    <Download className="w-3 h-3 transition-transform duration-200 group-hover:scale-110" />
                    <span>Download Resume</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleResumePreview}
                    aria-expanded={showResumePreview}
                    aria-controls="resume-preview"
                    className={`group inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg border font-semibold text-[10px] sm:text-xs ${smoothTransition} sleeper-cta`}
                    style={{
                      borderColor: 'var(--border)',
                      color: 'var(--text-primary)',
                      backgroundColor: 'var(--bg-secondary)'
                    }}
                  >
                    {showResumePreview ? (
                      <EyeOff className="w-3 h-3 transition-transform duration-200 group-hover:scale-110" />
                    ) : (
                      <Eye className="w-3 h-3 transition-transform duration-200 group-hover:scale-110" />
                    )}
                    <span>{showResumePreview ? 'Hide Preview' : 'Preview Resume'}</span>
                  </button>
                </div>
              </div>

              {/* Preview iframe */}
              <div
                id="resume-preview"
                className={`origin-top overflow-hidden rounded-xl border ${smoothTransition} ${showResumePreview
                    ? 'opacity-100 max-h-[1200px] scale-100 shadow-[0_28px_54px_rgba(0,0,0,0.32)]'
                    : 'opacity-0 max-h-0 scale-95 shadow-none pointer-events-none'
                  }`}
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg-secondary)',
                  transitionDelay: showResumePreview ? '80ms' : '0ms'
                }}
              >
                <div className="relative w-full" style={{ paddingTop: '141.4%' }}>
                  <iframe
                    src={resumeConfig.previewUrl}
                    title="Resume preview"
                    className="absolute top-0 left-0 w-full h-full rounded-xl border-0"
                    allow="autoplay"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-12 sm:mt-16 flex justify-center">
          <button
            onClick={() => {
              const experienceSection = document.getElementById('experience');
              if (experienceSection) {
                experienceSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            aria-label="Scroll to experience"
            className="p-2 rounded-full hover:bg-[var(--bg-secondary)] transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              className="soft-bounce"
              style={{ color: 'var(--accent)' }}
            >
              <path d="M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

export default About;
