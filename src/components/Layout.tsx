import { useEffect, type ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import CodeRainBackground from './CodeRainBackground';
import ScrollProgressBar from './ScrollProgressBar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  useEffect(() => {
    // Keyboard navigation setup
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + 1-6 for quick section navigation
      if (event.altKey && !event.shiftKey && !event.ctrlKey) {
        const sections = ['home', 'about', 'projects', 'research', 'certifications', 'contact'];
        const num = parseInt(event.key);
        if (num >= 1 && num <= sections.length) {
          event.preventDefault();
          const section = document.getElementById(sections[num - 1]);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
            // Focus the section for screen readers
            section.setAttribute('tabindex', '-1');
            section.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    // Easter egg console message
    const easterEgg = () => {
      console.log(`
%c
██╗  ██╗███████╗██╗   ██╗    ████████╗██╗  ██╗███████╗██████╗ ███████╗██╗
██║  ██║██╔════╝╚██╗ ██╔╝    ╚══██╔══╝██║  ██║██╔════╝██╔══██╗██╔════╝██║
███████║█████╗   ╚████╔╝        ██║   ███████║█████╗  ██████╔╝█████╗  ██║
██╔══██║██╔══╝    ╚██╔╝         ██║   ██╔══██║██╔══╝  ██╔══██╗██╔══╝  ╚═╝
██║  ██║███████╗   ██║          ██║   ██║  ██║███████╗██║  ██║███████╗██╗
╚═╝  ╚═╝╚══════╝   ╚═╝          ╚═╝   ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝

%cHey! Thanks for checking my portfolio 👾

%cLooks like you're curious about how this was built! 
This gamified portfolio was created with:
• React + TypeScript
• Tailwind CSS
• Canvas API for Matrix rain effect
• Lots of coffee ☕ and creativity 🚀

Want to collaborate? Let's connect!
LinkedIn: http://www.linkedin.com/in/albaraa-alolabi-0693b5278
GitHub: https://github.com/AlBaraa-1
Email: 666645@gmail.com

%cKeep exploring! 🎮
      `, 
      'color: #00ff41; font-family: monospace;',
      'color: #00ff41; font-size: 16px; font-weight: bold;',
      'color: #ffffff; font-size: 14px; line-height: 1.5;',
      'color: #00ff41; font-size: 14px; font-weight: bold;'
      );
    };

    // Add keyboard shortcut for easter egg
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key === 'c') {
        easterEgg();
      }
    };

    // Show easter egg on load
    setTimeout(easterEgg, 2000);
    
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="skip-link"
        onClick={(e) => {
          e.preventDefault();
          const main = document.getElementById('main-content');
          if (main) {
            main.focus();
            main.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      >
        Skip to main content
      </a>
      
      <CodeRainBackground />
      <ScrollProgressBar />
      <Navbar />
      
      <main 
        id="main-content" 
        className="relative z-10" 
        tabIndex={-1}
        role="main"
        aria-label="Main content"
      >
        {children}
      </main>
      
      <Footer />
    </div>
  );
};

export default Layout;
