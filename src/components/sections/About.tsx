import React, { useState, useEffect, useRef } from 'react';
import { Download, Eye, EyeOff, Terminal, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { resumeConfig } from '@/data/portfolioData';
import HudFrame from '@/components/ui/HudFrame';
import CyberButton from '@/components/ui/CyberButton';

const About: React.FC = () => {
  const [displayedCode, setDisplayedCode] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [showResumePreview, setShowResumePreview] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const resumeCardRef = useRef<HTMLDivElement>(null);

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
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setDisplayedCode(codeContent);
  }, []);

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
      .replace(/(\/\/.*$)/gm, '<span class="text-gray-500 italic">$1</span>')
      .replace(/"([^"]*)":/g, '<span class="text-blue-400">"$1"</span>:')
      .replace(/: "([^"]*)"/g, ': <span class="text-green-400">"$1"</span>')
      .replace(/: (true|false)/g, ': <span class="text-orange-400">$1</span>')
      .replace(/(\{|\}|\[|\])/g, '<span class="text-[var(--accent)] font-bold">$&</span>')
      .replace(/,/g, '<span class="text-gray-400">,</span>');
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center py-16 sm:py-20 px-4 sm:px-6 overflow-hidden"
    >
      <div className="w-full max-w-7xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-2 gap-12 lg:gap-8 items-start">

        {/* Left Column: Code Terminal (Bottom on mobile) */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={isVisible ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="w-full"
        >
          <HudFrame title="IDENTITY_CORE" className="h-full">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-2">
              <Terminal size={14} className="text-accent" />
              <span className="text-xs font-mono text-accent/80">profile.json</span>
              <div className="ml-auto w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>

            <div className="h-auto w-full p-2 font-mono text-xs sm:text-sm">
              <pre className="whitespace-pre-wrap break-words">
                <code dangerouslySetInnerHTML={{ __html: highlightSyntax(displayedCode) }} />
              </pre>
            </div>
          </HudFrame>
        </motion.div>

        {/* Right Column: Content & Resume */}
        <div className="flex flex-col gap-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <Cpu className="text-accent" />
              <h2 className="text-2xl xs:text-3xl sm:text-4xl font-bold tracking-tight">
                About <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-purple-500">Me</span>
              </h2>
            </div>
            <p className="text-sm xs:text-base sm:text-lg text-text-secondary leading-relaxed">
              I am a passionate <span className="text-accent font-semibold">Computer Vision Engineer</span> dedicated to bridging the gap between theoretical AI models and real-world edge deployment.
              My work focuses on optimizing deep learning algorithms to run efficiently on resource-constrained devices without compromising accuracy.
            </p>
          </motion.div>

          {/* Resume 'Cartridge' */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="group relative"
            ref={resumeCardRef}
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500" />
            <div className="relative border border-accent/30 bg-black/60 backdrop-blur-md rounded-xl p-6 sm:p-8 overflow-hidden">

              {/* Decorative scanline */}
              <motion.div
                className="absolute top-0 left-0 w-full h-[2px] bg-accent/50"
                animate={{ top: ["0%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                style={{ boxShadow: "0 0 10px var(--accent)" }}
              />

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">DATA_CARTRIDGE: RESUME</h3>
                  <p className="text-sm font-mono text-accent/70">ACCESS_LEVEL: UNCLASSIFIED</p>
                </div>
                <div className="flex gap-3">
                  <CyberButton variant="secondary" onClick={handleToggleResumePreview} className="min-w-[40px] px-4">
                    {showResumePreview ? <EyeOff size={18} /> : <Eye size={18} />}
                  </CyberButton>
                  <CyberButton onClick={handleResumeDownload}>
                    Download <Download size={18} className="ml-2" />
                  </CyberButton>
                </div>
              </div>

              {/* Preview Area */}
              <motion.div
                initial={false}
                animate={{ height: showResumePreview ? '500px' : '0px', opacity: showResumePreview ? 1 : 0 }}
                className="overflow-hidden border-t border-accent/20"
              >
                <div className="w-full h-full pt-6 relative">
                  <iframe
                    src={resumeConfig.previewUrl}
                    className="w-full h-full rounded-md border border-white/10"
                    title="Resume Preview"
                  />
                  {/* Screen reflection/glare effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default About;
