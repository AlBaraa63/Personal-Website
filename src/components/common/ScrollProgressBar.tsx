import React, { useState, useEffect } from 'react';

const ScrollProgressBar: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          // Calculate scroll progress
          const scrollTop = window.pageYOffset;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          const progress = (scrollTop / docHeight) * 100;
          setScrollProgress(Math.min(progress, 100));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main Progress Bar */}
      <div 
        className="h-1 bg-opacity-20 backdrop-blur-sm"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div
          className="h-full transition-all duration-150 ease-out"
          style={{
            width: `${scrollProgress}%`,
            background: 'linear-gradient(90deg, var(--accent), #10b981, var(--accent))',
            boxShadow: '0 0 10px var(--accent)',
            transform: 'translateZ(0)', // Hardware acceleration
            willChange: 'width'
          }}
        />
      </div>
    </div>
  );
};

export default ScrollProgressBar;