import React, { useState, useEffect, useRef } from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import ThemeToggle from '@/components/common/ThemeToggle';
import GitHubStreak from '@/components/features/github/GitHubStreak';
import ColorThemeSelector from '@/components/common/ColorThemeSelector';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navigate = useNavigate();
  const location = useLocation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'research', label: 'Research' },
    { id: 'certifications', label: 'Certifications' },
    { id: 'contact', label: 'Contact' },
  ];

  useEffect(() => {
    // Use IntersectionObserver for more reliable section visibility detection
    const observers: IntersectionObserver[] = [];
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: '-40% 0% -40% 0%', // focus on center area of viewport
      threshold: 0.01,
    };

    const callback = (entries: any[]) => {
      // pick the entry that's intersecting and closest to the center (highest intersectionRatio)
      let bestEntry: any = null;
      entries.forEach(entry => {
        if (!bestEntry) {
          if (entry.isIntersecting) bestEntry = entry;
        } else if (entry.isIntersecting && entry.intersectionRatio > (bestEntry.intersectionRatio ?? 0)) {
          bestEntry = entry;
        }
      });

      if (bestEntry && bestEntry.isIntersecting) {
        const target = bestEntry.target as HTMLElement | null;
        if (target && target.id) setActiveSection(target.id);
      }
    };

    navItems.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) {
        const obs = new IntersectionObserver(callback, options);
        obs.observe(el);
        observers.push(obs);
      }
    });

    // Fallback: set initial section based on scroll position
    const initial = navItems.slice().reverse().find(it => {
      const el = document.getElementById(it.id);
      return el && el.getBoundingClientRect().top <= window.innerHeight / 2;
    });
    if (initial) setActiveSection(initial.id);

    return () => observers.forEach(o => o.disconnect());
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const scrollToSection = (sectionId: string) => {
    // Check if we're on the home page
    if (location.pathname !== '/') {
      // Navigate to home page first, then scroll to section
      navigate('/');
      // Wait for navigation to complete before scrolling
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      // Already on home page, just scroll
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setIsOpen(false);
  };

  return (
    <nav ref={mobileMenuRef} className="fixed top-0 left-0 right-0 z-40 backdrop-blur-lg border-b border-opacity-30"
      style={{
        backgroundColor: 'rgba(var(--bg-primary-rgb), 0.8)',
        borderColor: 'var(--border)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
      }}>
      {/* Animated Background Layers */}
      <div className="absolute inset-0 opacity-30">
        {/* Flowing gradient background */}
        <div className="absolute inset-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(var(--accent-rgb), 0.1) 25%, rgba(96, 165, 250, 0.08) 50%, rgba(147, 51, 234, 0.1) 75%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'gradientFlow 8s ease-in-out infinite'
          }}></div>

        {/* Floating particles */}
        <div className="absolute top-2 left-1/4 w-1 h-1 bg-accent rounded-full opacity-60"
          style={{ animation: 'float 8s ease-in-out infinite 0s' }}></div>
        <div className="absolute top-4 right-1/3 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-40"
          style={{ animation: 'float 10s ease-in-out infinite 2s' }}></div>
        <div className="absolute bottom-2 left-2/3 w-0.5 h-0.5 bg-purple-400 rounded-full opacity-80"
          style={{ animation: 'float 6s ease-in-out infinite 4s' }}></div>

        {/* Subtle wave pattern */}
        <div className="absolute bottom-0 left-0 right-0 h-px opacity-50"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, var(--accent) 20%, rgba(96, 165, 250, 0.8) 40%, rgba(147, 51, 234, 0.8) 60%, var(--accent) 80%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'gradientFlow 12s ease-in-out infinite reverse'
          }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-lg px-2 py-1 transition-all duration-300"
            onClick={() => scrollToSection('home')}
            onMouseDown={() => {
              // Remove focus on mouse click to prevent focus styles
              setTimeout(() => {
                if (document.activeElement instanceof HTMLElement) {
                  document.activeElement.blur();
                }
              }, 0);
            }}
            style={{
              '--tw-ring-color': 'var(--accent)',
              '--tw-ring-offset-color': 'transparent'
            } as React.CSSProperties}
          >
            <span className="text-xl font-bold terminal-prompt bg-gradient-to-r from-[var(--text-primary)] to-[var(--accent)] bg-clip-text text-transparent">
              AlBaraa.dev
            </span>
          </button>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2">
            <div className="flex items-baseline space-x-1 lg:space-x-2">
              {navItems.map((item, index) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  onMouseDown={() => {
                    // Remove focus on mouse click to prevent focus styles
                    setTimeout(() => {
                      if (document.activeElement instanceof HTMLElement) {
                        document.activeElement.blur();
                      }
                    }, 0);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      scrollToSection(item.id);
                    }
                  }}
                  aria-label={`Navigate to ${item.label} section (Alt+${index + 1})`}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                  className={`group relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform-gpu active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${activeSection === item.id
                    ? 'active-nav-item'
                    : 'inactive-nav-item'
                    }`}
                  style={{
                    color: activeSection === item.id ? 'var(--accent)' : 'var(--text-primary)',
                    textShadow: activeSection === item.id ? '0 0 10px var(--accent)' : 'none',
                    background: activeSection === item.id
                      ? 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.2) 0%, rgba(var(--accent-rgb), 0.05) 100%)'
                      : 'transparent',
                    border: activeSection === item.id
                      ? '1px solid rgba(var(--accent-rgb), 0.3)'
                      : '1px solid transparent',
                    boxShadow: activeSection === item.id
                      ? '0 8px 16px rgba(var(--accent-rgb), 0.2), 0 0 20px rgba(var(--accent-rgb), 0.1)'
                      : '0 4px 8px rgba(0,0,0,0.1)',
                    backdropFilter: 'blur(10px)',
                    '--tw-ring-color': 'var(--accent)',
                    '--tw-ring-offset-color': 'transparent'
                  } as React.CSSProperties}
                >
                  {/* Text with click animation only */}
                  <span className="relative z-10">
                    {item.label}
                  </span>

                  {/* Bottom line indicator */}
                  <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${activeSection === item.id ? 'w-full' : 'w-0'
                    }`}
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, var(--accent) 50%, transparent 100%)',
                      boxShadow: '0 0 8px var(--accent)'
                    }}></div>
                </button>
              ))}
            </div>
          </div>

          {/* Theme Toggle and GitHub Streak */}
          <div className="hidden md:flex items-center gap-3">
            <GitHubStreak username="AlBaraa63" />
            <ColorThemeSelector />
            <ThemeToggle />
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <div className="flex items-center gap-1.5">
              <div className="hidden xs:block">
                <GitHubStreak username="AlBaraa63" />
              </div>
              <ColorThemeSelector />
              <ThemeToggle />
              <button
                onClick={() => setIsOpen(!isOpen)}
                onMouseDown={() => {
                  // Remove focus on mouse click to prevent focus styles
                  setTimeout(() => {
                    if (document.activeElement instanceof HTMLElement) {
                      document.activeElement.blur();
                    }
                  }, 0);
                }}
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                className="group relative p-3 rounded-lg transition-all duration-500 hover:scale-110 active:scale-95 transform-gpu focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                style={{
                  color: 'var(--text-primary)',
                  background: isOpen
                    ? 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.2) 0%, rgba(var(--accent-rgb), 0.05) 100%)'
                    : 'transparent',
                  border: isOpen
                    ? '1px solid rgba(var(--accent-rgb), 0.3)'
                    : '1px solid transparent',
                  boxShadow: isOpen
                    ? '0 8px 16px rgba(var(--accent-rgb), 0.2)'
                    : '0 4px 8px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(10px)',
                  '--tw-ring-color': 'var(--accent)',
                  '--tw-ring-offset-color': 'transparent'
                } as React.CSSProperties}
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle, rgba(var(--accent-rgb), 0.1) 0%, transparent 70%)'
                  }}></div>

                {/* Menu icon with rotation animation */}
                <div className={`relative z-10 transition-all duration-500 ${isOpen ? 'rotate-180 scale-110' : 'rotate-0'}`}>
                  {isOpen ? (
                    <X className="h-7 w-7 animate-pulse" style={{ filter: 'drop-shadow(0 0 4px var(--accent))' }} />
                  ) : (
                    <Menu className="h-7 w-7 group-hover:animate-pulse" />
                  )}
                </div>

                {/* Floating particles around button */}
                {isOpen && (
                  <>
                    <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-accent rounded-full opacity-60 animate-ping"></div>
                    <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-blue-400 rounded-full opacity-80 animate-ping"
                      style={{ animationDelay: '0.5s' }}></div>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        id="mobile-menu"
        role="menu"
        aria-hidden={!isOpen}
        className={`md:hidden backdrop-blur-lg border-t border-opacity-30 transition-all duration-500 overflow-hidden relative ${isOpen ? 'max-h-[32rem] opacity-100' : 'max-h-0 opacity-0'}`}
        style={{
          backgroundColor: 'rgba(var(--bg-primary-rgb), 0.95)',
          borderColor: 'var(--border)',
          boxShadow: isOpen ? '0 8px 32px rgba(0,0,0,0.3)' : 'none'
        }}
      >
        {/* Mobile menu animated background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0"
            style={{
              background: 'radial-gradient(ellipse at center, rgba(var(--accent-rgb), 0.15) 0%, transparent 70%)',
              animation: isOpen ? 'pulse 4s ease-in-out infinite' : 'none'
            }}></div>
        </div>

        <div className="relative z-10 px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              onMouseDown={() => {
                // Remove focus on mouse click to prevent focus styles
                setTimeout(() => {
                  if (document.activeElement instanceof HTMLElement) {
                    document.activeElement.blur();
                  }
                }, 0);
              }}
              className={`group block w-full px-4 py-3 rounded-lg text-base font-medium text-left transition-all duration-500 hover:scale-105 active:scale-95 transform-gpu focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${activeSection === item.id ? 'mobile-active' : 'mobile-inactive'
                }`}
              style={{
                color: activeSection === item.id ? 'var(--accent)' : 'var(--text-primary)',
                background: activeSection === item.id
                  ? 'linear-gradient(135deg, rgba(var(--accent-rgb), 0.2) 0%, rgba(var(--accent-rgb), 0.05) 100%)'
                  : 'transparent',
                border: activeSection === item.id
                  ? '1px solid rgba(var(--accent-rgb), 0.3)'
                  : '1px solid transparent',
                textShadow: activeSection === item.id ? '0 0 8px var(--accent)' : 'none',
                transform: isOpen ? `translateX(0) translateY(0) scale(1)` : `translateX(-20px) translateY(10px) scale(0.9)`,
                transitionDelay: isOpen ? `${index * 100}ms` : '0ms',
                '--tw-ring-color': 'var(--accent)',
                '--tw-ring-offset-color': 'transparent'
              } as React.CSSProperties}
            >
              <div className="relative">
                {/* Animated bullet point */}
                <span className="absolute -left-2 top-1/2 transform -translate-y-1/2 text-xs opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ color: 'var(--accent)' }}>
                  ▶
                </span>

                {/* Menu item text */}
                <span className="ml-2 group-hover:animate-pulse">
                  {item.label}
                </span>

                {/* Floating particle on active */}
                {activeSection === item.id && (
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full opacity-60 animate-ping"></div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
