import React from 'react';
import { Heart, Code } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="py-2 sm:py-4 border-t border-opacity-30" 
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-secondary)' }}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Two Column Layout */}
        <div className="flex flex-col md:flex-row md:items-center justify-center md:justify-between gap-2 sm:gap-4">
          {/* Left - compact info + social */}
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            <div className="text-xs sm:text-sm font-semibold" style={{ color: 'var(--accent)' }}>
              <span className="terminal-prompt">© 2025 AlBaraa AlOlabi</span>
            </div>

            <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <span>Built with</span>
              <Heart className="w-4 h-4 text-red-500 animate-pulse" />
              <span>and</span>
              <Code className="w-4 h-4" style={{ color: 'var(--accent)' }} />
            </div>

            <div className="hidden sm:flex items-center gap-1 sm:gap-2 sm:ml-2">
              <button
                onClick={() => window.open('http://www.linkedin.com/in/albaraa-alolabi-0693b5278', '_blank')}
                className="p-1.5 sm:p-2 rounded-md transition-all duration-200 hover:scale-105 glow-border"
                style={{ backgroundColor: 'var(--bg-primary)' }}
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: 'var(--accent)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>

              <button
                onClick={() => window.open('https://github.com/AlBaraa63', '_blank')}
                className="p-1.5 sm:p-2 rounded-md transition-all duration-200 hover:scale-105 glow-border"
                style={{ backgroundColor: 'var(--bg-primary)' }}
                aria-label="GitHub"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: 'var(--accent)' }} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </button>

              <button
                onClick={() => window.location.href = 'mailto:666645@gmail.com'}
                className="p-1.5 sm:p-2 rounded-md transition-all duration-200 hover:scale-105 glow-border"
                style={{ backgroundColor: 'var(--bg-primary)' }}
                aria-label="Email"
              >
                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Right - small rolling credits */}
          <div className="hidden md:flex flex-1 items-center justify-end">
            <div className="overflow-hidden h-14 w-full max-w-xs">
              <div className="animate-scroll-up text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                <div>🎮 Game Designer: AlBaraa AlOlabi</div>
                <div>💻 Lead Developer: AlBaraa AlOlabi</div>
                <div>🎨 UI/UX Designer: AlBaraa AlOlabi</div>
                <div>🚀 DevOps Engineer: AlBaraa AlOlabi</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Schema.org structured data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "Person",
        "name": "AlBaraa AlOlabi",
        "url": "https://albaraaalolabi.dev",
        "jobTitle": "AI Researcher & Computer Vision Developer"
      })}} />

      <style>{`
        @keyframes scroll-up {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        .animate-scroll-up {
          /* faster and tighter since content is shorter */
          animation: scroll-up 12s linear infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;