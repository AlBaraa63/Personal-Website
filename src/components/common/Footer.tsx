import React from 'react';
import { Heart, Code, Wifi } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="relative pt-12 pb-6 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md z-0" />
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Brand / Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
                AlBaraa.dev
              </span>
              <span className="px-1.5 py-0.5 rounded bg-accent/10 border border-accent/20 text-[10px] text-accent font-mono">
                v2.5.0
              </span>
            </div>
            <p className="text-xs text-text-tertiary">
              © {new Date().getFullYear()} AlBaraa AlOlabi. <span className="hidden sm:inline">All systems nominal.</span>
            </p>
          </div>

          {/* Social / Connect */}
          <div className="flex items-center gap-4">
            <a href="https://github.com/AlBaraa63" target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:text-accent transition-colors">
              <span className="sr-only">GitHub</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>

            <div className="h-4 w-[1px] bg-white/10" />

            <div className="flex items-center gap-2 text-xs font-mono text-text-secondary">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/5">
                <Wifi className="w-3 h-3 text-green-500 animate-pulse" />
                <span>NET_ONLINE</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-text-tertiary font-mono">
          <div className="flex items-center gap-1">
            <span>EXECUTION_TIME:</span>
            <span className="text-accent">{Math.random().toFixed(4)}s</span>
          </div>

          <div className="flex items-center gap-2">
            <span>Built with</span>
            <Heart className="w-3 h-3 text-red-500" fill="currentColor" />
            <span>&</span>
            <Code className="w-3 h-3 text-accent" />
            <span>in React</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;