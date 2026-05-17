import React, { useState, useEffect, useRef } from 'react';
import { Download, Eye, EyeOff, Terminal, Cpu } from 'lucide-react';
import { motion } from 'framer-motion';
import { resumeConfig } from '@/data/portfolioData';
import HudFrame from '@/components/ui/HudFrame';
import CyberButton from '@/components/ui/CyberButton';

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

// Monochrome JSON highlighter — single accent, no random blues/greens/oranges.
const highlightSyntax = (code: string): string =>
    code
        .replace(/(\/\/.*$)/gm, '<span class="text-[var(--text-faint)] italic">$1</span>')
        .replace(/"([^"]+)":/g, '<span class="text-[var(--text-primary)]">"$1"</span>:')
        .replace(/: "([^"]*)"/g, ': <span class="text-accent">"$1"</span>')
        .replace(/: (true|false)/g, ': <span class="text-accent">$1</span>')
        .replace(/(\{|\}|\[|\])/g, '<span class="text-accent font-semibold">$&</span>')
        .replace(/,/g, '<span class="text-[var(--text-faint)]">,</span>');

const About: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [showResumePreview, setShowResumePreview] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const handleResumeDownload = () => {
        const link = document.createElement('a');
        link.href = resumeConfig.downloadUrl;
        link.setAttribute('download', resumeConfig.fileName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative h-full w-full p-4 sm:p-8 overflow-y-auto"
        >
            <div className="w-full max-w-7xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-8 items-start">

                {/* Left — profile.json */}
                <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    <HudFrame title="IDENTITY_CORE" className="h-full">
                        <div className="flex items-center gap-2 mb-4 border-b border-[var(--border)] pb-2">
                            <Terminal size={14} className="text-accent" />
                            <span className="text-xs font-mono text-[var(--text-muted)]">profile.json</span>
                        </div>

                        <div className="relative h-auto w-full p-2 font-mono text-xs sm:text-sm">
                            <pre className="whitespace-pre-wrap break-words text-[var(--text-muted)]">
                                <code dangerouslySetInnerHTML={{ __html: highlightSyntax(codeContent) }} />
                            </pre>
                        </div>
                    </HudFrame>
                </motion.div>

                {/* Right — bio + resume */}
                <div className="flex flex-col gap-8">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.15 }}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <Cpu className="text-accent" size={22} />
                            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                                About Me
                            </h2>
                        </div>
                        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed">
                            I'm a <span className="text-accent font-semibold">Computer Vision Engineer</span> focused
                            on bridging theoretical AI models and real-world edge deployment. My work centers on
                            optimizing deep learning algorithms to run efficiently on resource-constrained devices
                            without compromising accuracy.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="relative"
                    >
                        <div className="relative border border-[var(--border-strong)] bg-[var(--surface)] p-6 sm:p-7">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
                                <div>
                                    <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-wide mb-1 font-mono uppercase">
                                        Data Cartridge · Résumé
                                    </h3>
                                    <p className="text-xs font-mono text-[var(--text-faint)] uppercase tracking-[0.2em]">
                                        Access Level · Unclassified
                                    </p>
                                </div>
                                <div className="flex gap-3">
                                    <CyberButton variant="secondary" onClick={() => setShowResumePreview(p => !p)} className="min-w-[40px] px-4">
                                        {showResumePreview ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </CyberButton>
                                    <CyberButton onClick={handleResumeDownload}>
                                        Download <Download size={18} className="ml-2" />
                                    </CyberButton>
                                </div>
                            </div>

                            <motion.div
                                initial={false}
                                animate={{ height: showResumePreview ? 500 : 0, opacity: showResumePreview ? 1 : 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden border-t border-[var(--border)]"
                            >
                                <div className="w-full h-full pt-5">
                                    <iframe
                                        src={resumeConfig.previewUrl}
                                        className="w-full h-full border border-[var(--border)]"
                                        title="Resume Preview"
                                    />
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
