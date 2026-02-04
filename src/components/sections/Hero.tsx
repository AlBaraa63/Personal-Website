import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Terminal, Cpu, Wifi, Zap, Activity } from 'lucide-react';
import HudFrame from '@/components/ui/HudFrame';
import CyberButton from '@/components/ui/CyberButton';
import HolographicText from '@/components/effects/HolographicText';

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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Mouse tracking for parallax
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Typewriter effect
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

  const scrollToProjects = () => {
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 sm:px-6 py-20 sm:py-0"
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-accent/5 to-transparent pointer-events-none" />

      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(var(--accent-rgb), 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(var(--accent-rgb), 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${mousePosition.x * 0.5}px, ${mousePosition.y * 0.5}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-5xl z-10"
        style={{
          transform: `translate(${mousePosition.x * -0.3}px, ${mousePosition.y * -0.3}px)`,
          transition: 'transform 0.3s ease-out',
        }}
      >
        <HudFrame className="w-full aurora-border glass-panel">
          <div className="flex flex-col items-center justify-center text-center space-y-8 py-8 sm:py-12">

            {/* Status Indicators */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-mono text-accent/70 mb-4"
            >
              <motion.div
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/20"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Wifi size={14} className="text-accent" />
                <span className="hidden sm:inline">NETWORK: SECURE</span>
                <span className="sm:hidden">ONLINE</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/20"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <Cpu size={14} className="text-accent" />
                <span className="hidden sm:inline">CPU: OPTIMAL</span>
                <span className="sm:hidden">OK</span>
              </motion.div>
              <motion.div
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-accent/5 border border-accent/20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Activity size={14} className="text-accent" />
                <span>v2.0.45</span>
              </motion.div>
            </motion.div>

            {/* Main Title with Holographic Effect */}
            <motion.h1
              variants={itemVariants}
              className="text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter"
            >
              <div className="relative inline-block group">
                <HolographicText
                  className="relative z-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-400 group-hover:to-accent transition-all duration-500"
                  glitchOnHover={true}
                >
                  AlBaraa
                </HolographicText>

                {/* Glow effect on hover */}
                <motion.span
                  className="absolute -inset-2 opacity-0 group-hover:opacity-30 bg-accent blur-xl rounded-lg transition-opacity duration-500"
                  aria-hidden="true"
                />
              </div>

              <br className="sm:hidden" />

              <span className="text-accent inline-block sm:ml-4 relative">
                <HolographicText glitchOnHover={true}>
                  AlOlabi
                </HolographicText>

                {/* Underline accent */}
                <motion.span
                  className="absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-accent to-cyan-400"
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 1, duration: 0.8 }}
                />
              </span>
            </motion.h1>

            {/* Role Typewriter with Enhanced Styling */}
            <motion.div variants={itemVariants} className="h-16 sm:h-20 flex items-center justify-center">
              <motion.div
                className="px-4 py-2 bg-accent/10 border-l-2 border-r-2 border-accent/50 min-w-[240px] xs:min-w-[280px] sm:min-w-[400px] relative overflow-hidden"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: "auto", opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                {/* Animated background gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />

                <p className="text-base xs:text-xl sm:text-2xl md:text-3xl font-mono text-accent truncate relative z-10">
                  <span className="mr-2 opacity-50">&gt;</span>
                  {displayText}
                  <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="inline-block w-2 h-4 sm:h-8 bg-accent ml-1 align-middle"
                  />
                </p>
              </motion.div>
            </motion.div>

            {/* Description */}
            <motion.p
              variants={itemVariants}
              className="max-w-2xl text-text-secondary text-xs xs:text-sm sm:text-base md:text-lg leading-relaxed font-light"
            >
              Building intelligent systems that{' '}
              <span className="text-accent font-semibold neon-glow">see</span>,{' '}
              <span className="text-accent font-semibold neon-glow">think</span>, and{' '}
              <span className="text-accent font-semibold neon-glow">act</span>.
              <br className="hidden sm:block" />
              Bridging the gap between edge computing and advanced computer vision.
            </motion.p>

            {/* CTA Button with Enhanced Effects */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-8"
            >
              <CyberButton onClick={scrollToProjects} className="group relative overflow-hidden">
                <span className="relative z-10 flex items-center">
                  Initialize Protocol
                  <Zap size={16} className="ml-2 group-hover:animate-pulse" />
                </span>

                {/* Animated shine effect */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.5 }}
                />
              </CyberButton>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              variants={itemVariants}
              className="absolute bottom-8 left-1/2 -translate-x-1/2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="flex flex-col items-center gap-2 text-text-secondary/50"
              >
                <span className="text-xs font-mono">SCROLL</span>
                <div className="w-[1px] h-8 bg-gradient-to-b from-accent/50 to-transparent" />
              </motion.div>
            </motion.div>

          </div>
        </HudFrame>
      </motion.div>
    </section>
  );
};

export default Hero;
