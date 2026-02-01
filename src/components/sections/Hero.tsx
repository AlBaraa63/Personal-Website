import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Terminal, Cpu, Wifi } from 'lucide-react';
import HudFrame from '@/components/ui/HudFrame';
import CyberButton from '@/components/ui/CyberButton';

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

  // Glitch effect logic
  useEffect(() => {
    const output = roles[currentRoleIndex];
    if (isPaused) return;

    const timer = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < output.length) {
          setDisplayText(output.slice(0, displayText.length + 1));
        } else {
          setIsPaused(true);
          setTimeout(() => {
            setIsPaused(false);
            setIsDeleting(true);
          }, 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, isPaused, currentRoleIndex, roles]);

  const scrollToAbout = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20 sm:py-0">

      {/* Background Ambience (optional extra layer) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl z-10"
      >
        <HudFrame className="w-full">
          <div className="flex flex-col items-center justify-center text-center space-y-8 py-8 sm:py-12">

            {/* Status Indicators */}
            <div className="flex gap-4 sm:gap-8 text-xs sm:text-sm font-mono text-accent/70 mb-4">
              <motion.div
                className="flex items-center gap-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Wifi size={16} />
                <span className="hidden sm:inline">NETWORK: SECURE</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <Cpu size={16} />
                <span className="hidden sm:inline">CPU: OPTIMAL</span>
              </motion.div>
              <div className="flex items-center gap-2 text-accent">
                <Terminal size={16} />
                <span>v2.0.45</span>
              </div>
            </div>

            {/* Main Title */}
            <motion.h1
              className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="relative inline-block group">
                <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 group-hover:to-accent transition-all duration-500">
                  AlBaraa
                </span>
                <motion.span
                  className="absolute -inset-1 opacity-0 group-hover:opacity-20 bg-accent text-accent blur-lg"
                  animate={{ opacity: [0, 0.2, 0] }}
                  transition={{ duration: 0.2, repeat: Infinity, repeatDelay: Math.random() * 5 }}
                >
                  AlBaraa
                </motion.span>
              </div>
              <br className="sm:hidden" />
              <span className="text-accent inline-block sm:ml-4">
                AlOlabi
              </span>
            </motion.h1>

            {/* Role Typewriter */}
            <div className="h-16 sm:h-20 flex items-center justify-center">
              <motion.div
                className="px-4 py-2 bg-accent/10 border-l-2 border-r-2 border-accent/50 min-w-[280px] sm:min-w-[400px]"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <p className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-mono text-accent truncate">
                  <span className="mr-2 opacity-50">&gt;</span>
                  {displayText}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2 h-5 sm:h-8 bg-accent ml-1 align-middle"
                  />
                </p>
              </motion.div>
            </div>

            {/* Description */}
            <motion.p
              className="max-w-2xl text-text-secondary text-sm sm:text-base md:text-lg leading-relaxed font-light"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              Building intelligent systems that <span className="text-accent">see</span>, <span className="text-accent">think</span>, and <span className="text-accent">act</span>.
              Bridging the gap between edge computing and advanced computer vision.
            </motion.p>

            {/* Actions */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
            >
              <CyberButton onClick={scrollToAbout}>
                Initialize Protocol <Play size={16} className="ml-2" />
              </CyberButton>
            </motion.div>

          </div>
        </HudFrame>
      </motion.div>
    </section>
  );
};

export default Hero;
