import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';

const Hero: React.FC = () => {
  const roles = [
    "Computer Vision Engineer",
    "AI Developer",
    "Edge AI Engineer",
    "AI Researcher",
  ];

  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const [glitchyChars, setGlitchyChars] = useState<Set<number>>(new Set());
  const [showElements, setShowElements] = useState({
    pressStart: false,
    title: false,
    subtitle: false,
    buttons: false
  });

  useEffect(() => {
    // Smooth, sequential fade-ins
    const timers = [
      setTimeout(() => setShowElements(prev => ({ ...prev, title: true })), 200),
      setTimeout(() => setShowElements(prev => ({ ...prev, subtitle: true })), 500),
      setTimeout(() => setShowElements(prev => ({ ...prev, buttons: true })), 800)
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  // Typewriter effect with typing and deleting
  useEffect(() => {
    if (isPaused) return;

    const currentRole = roles[currentRoleIndex];
    const typingSpeed = isDeleting ? 50 : 100;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentRole.length) {
          setDisplayText(currentRole.slice(0, displayText.length + 1));
        } else {
          // Finished typing, pause before deleting
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, 2000); // Pause for 2 seconds
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          // Finished deleting, move to next role
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, isPaused, currentRoleIndex, roles]);

  // Enhanced glitch effect trigger with random intervals
  useEffect(() => {
    const triggerGlitch = () => {
      setShowGlitch(true);
      
      // Randomly select 2-4 characters to glitch
      const numGlitchChars = Math.floor(Math.random() * 3) + 2;
      const glitchIndices = new Set<number>();
      
      for (let i = 0; i < numGlitchChars && i < displayText.length; i++) {
        const randomIndex = Math.floor(Math.random() * displayText.length);
        glitchIndices.add(randomIndex);
      }
      
      setGlitchyChars(glitchIndices);
      
      setTimeout(() => {
        setShowGlitch(false);
        setGlitchyChars(new Set());
      }, 300);
      
      // Random next glitch between 3-6 seconds
      const nextGlitch = Math.random() * 3000 + 3000;
      setTimeout(triggerGlitch, nextGlitch);
    };
    
    // Initial glitch after 3 seconds
    const initialTimer = setTimeout(triggerGlitch, 3000);
    
    return () => clearTimeout(initialTimer);
  }, [displayText]);

  const scrollToAbout = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20 sm:py-0">
      <div className="text-center z-10 w-full max-w-6xl mx-auto">

        {/* Main Content */}
        <div className={`transition-all duration-700 ease-out ${
          showElements.title ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Name - The Star */}
          <h1 className="mb-4 sm:mb-6">
            <span className="block text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight break-words" style={{ 
              color: 'var(--text-primary)',
              lineHeight: '1.1',
              wordBreak: 'normal',
              overflowWrap: 'normal'
            }}>
              AlBaraa AlOlabi
            </span>
          </h1>

          {/* Dynamic Role - Typewriter with Enhanced Glitch Effect */}
          <div className={`mb-6 sm:mb-8 md:mb-10 transition-all duration-700 delay-200 ease-out ${
            showElements.subtitle ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <div className="relative inline-block">
              {/* Main text with glitch layers */}
              <p 
                className={`text-xl xs:text-2xl sm:text-3xl md:text-4xl font-light tracking-wide px-4 min-h-[2.5rem] sm:min-h-[3rem] md:min-h-[3.5rem] relative z-10 ${
                  showGlitch ? 'animate-glitch-main' : ''
                }`}
                style={{ 
                  color: 'var(--accent)',
                  textShadow: showGlitch 
                    ? '0 0 10px rgba(var(--accent-rgb), 0.8), -2px 0 4px rgba(255, 0, 0, 0.7), 2px 0 4px rgba(0, 255, 255, 0.7)'
                    : '0 0 10px rgba(var(--accent-rgb), 0.5)',
                  letterSpacing: '0.05em',
                  lineHeight: '1.4'
                }}
              >
                {displayText.split('').map((char, index) => {
                  const isGlitchy = glitchyChars.has(index);
                  const randomChar = String.fromCharCode(33 + Math.floor(Math.random() * 94)); // Random ASCII char
                  
                  return (
                    <span
                      key={index}
                      className={isGlitchy ? 'animate-char-glitch' : ''}
                      style={{
                        display: 'inline-block',
                        opacity: isGlitchy && Math.random() > 0.5 ? 0 : 1,
                      }}
                    >
                      {isGlitchy && Math.random() > 0.6 ? randomChar : char}
                    </span>
                  );
                })}
                <span 
                  className="ml-1 inline-block w-0.5 sm:w-1 h-5 sm:h-7 md:h-9 align-middle"
                  style={{ 
                    backgroundColor: 'var(--accent)',
                    animation: 'blink 1s steps(2) infinite'
                  }}
                ></span>
              </p>
              
              {/* Glitch layer - Red offset */}
              {showGlitch && (
                <p 
                  className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-light tracking-wide px-4 absolute top-0 left-0 w-full animate-glitch-red pointer-events-none"
                  style={{ 
                    color: '#ff0000',
                    opacity: 0.7,
                    letterSpacing: '0.05em',
                    lineHeight: '1.4',
                    mixBlendMode: 'screen'
                  }}
                  aria-hidden="true"
                >
                  {displayText}
                </p>
              )}
              
              {/* Glitch layer - Cyan offset */}
              {showGlitch && (
                <p 
                  className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-light tracking-wide px-4 absolute top-0 left-0 w-full animate-glitch-cyan pointer-events-none"
                  style={{ 
                    color: '#00ffff',
                    opacity: 0.7,
                    letterSpacing: '0.05em',
                    lineHeight: '1.4',
                    mixBlendMode: 'screen'
                  }}
                  aria-hidden="true"
                >
                  {displayText}
                </p>
              )}
            </div>
          </div>

          {/* Tagline - Supporting Statement */}
          <div className={`mb-8 sm:mb-12 md:mb-14 transition-all duration-700 delay-300 ease-out ${
            showElements.subtitle ? 'opacity-100' : 'opacity-0'
          }`}>
            <p className="text-sm xs:text-base sm:text-lg md:text-xl font-mono px-4 max-w-2xl mx-auto" style={{ 
              color: 'var(--text-secondary)',
              letterSpacing: '0.02em',
              lineHeight: '1.6'
            }}>
              I build intelligent systems that see, think, and act
            </p>
          </div>

          {/* CTA */}
          <div className={`transition-all duration-700 delay-500 ease-out ${
            showElements.buttons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <button
              onClick={scrollToAbout}
              className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 text-sm xs:text-base sm:text-lg font-medium rounded-lg border-2 transition-all duration-300 hover:gap-3 sm:hover:gap-4 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 w-auto min-w-[200px] sm:min-w-0"
              style={{ 
                borderColor: 'var(--accent)',
                color: 'var(--accent)',
                backgroundColor: 'transparent',
                '--tw-ring-color': 'var(--accent)',
                '--tw-ring-offset-color': 'var(--bg-primary)'
              } as React.CSSProperties}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--accent)';
                e.currentTarget.style.color = 'var(--bg-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = 'var(--accent)';
              }}
            >
              <span>View My Work</span>
              <Play className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </div>

        {/* Scroll Indicator */}
        <button
          onClick={scrollToAbout}
          aria-label="Scroll to about"
          className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center justify-center p-2 rounded-full transition-colors duration-200 hover:bg-[var(--bg-secondary)]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[var(--accent)] sm:w-8 sm:h-8"
            aria-hidden="true"
            style={{ animation: 'bounce 2s ease-in-out infinite' }}
          >
            <path d="M12 5v14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M19 12l-7 7-7-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Hero;