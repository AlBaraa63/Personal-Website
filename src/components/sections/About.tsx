import React, { useState, useEffect, useRef } from 'react';
import { Download, ExternalLink, Cpu, Briefcase, Code2, Wrench, Award, Zap, BookOpen, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { resumeConfig } from '@/data/portfolioData';
import HudFrame from '@/components/ui/HudFrame';
import CyberButton from '@/components/ui/CyberButton';

// ─── Data ─────────────────────────────────────────────────────────────────────

const aiMl = [
    'Computer Vision (OpenCV, YOLOv8, MediaPipe)',
    'Deep Learning (PyTorch, TensorFlow, Keras)',
    'Deployment & Edge AI (TFLite, ONNX, Android)',
    'Enterprise AI (MCP, RAG, FAISS, Prompt Engineering)',
];

const languages = ['Python', 'C++', 'C', 'Kotlin'];

const tools = [
    'FastAPI', 'Flask', 'Streamlit', 'Gradio', 'Docker',
    'Git & GitHub', 'CI/CD (GitHub Actions)', 'Linux systems',
];

const certifications = [
    { label: 'CS50x', issuer: 'Harvard University' },
    { label: 'CS50P', issuer: 'Harvard University' },
    { label: 'CS50AI', issuer: 'Harvard University' },
    { label: 'IBM Computer Vision', issuer: 'IBM / edX' },
    { label: 'Samsung Innovation Campus', issuer: 'Samsung' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const SectionLabel: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <div className="flex items-center gap-2 mb-3">
        <span className="text-accent">{icon}</span>
        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-faint)]">{label}</span>
        <div className="flex-1 h-px bg-[var(--border)]" />
    </div>
);

const Tag: React.FC<{ children: React.ReactNode; dimmed?: boolean }> = ({ children, dimmed }) => (
    <span
        className={`text-[10px] sm:text-[11px] px-2.5 py-1 border font-mono transition-colors ${
            dimmed
                ? 'border-[var(--border-strong)] text-[var(--text-muted)] hover:border-accent/40 hover:text-accent'
                : 'border-accent/40 text-accent hover:border-accent hover:bg-accent/5'
        }`}
    >
        {children}
    </span>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const About: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);
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

    const cardVariants = {
        hidden: { opacity: 0, x: -16 },
        visible: (i: number) => ({
            opacity: 1,
            x: 0,
            transition: { duration: 0.4, delay: 0.1 + i * 0.08 },
        }),
    };

    return (
        <section
            id="about"
            ref={sectionRef}
            className="relative h-full w-full p-4 sm:p-8 overflow-y-auto"
        >
            <div className="w-full max-w-7xl mx-auto flex flex-col-reverse lg:grid lg:grid-cols-2 gap-10 lg:gap-8 items-start">

                {/* ── Left — readable profile card ── */}
                <motion.div
                    initial={{ opacity: 0, x: -24 }}
                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.5 }}
                    className="w-full"
                >
                    <HudFrame title="IDENTITY_CORE" className="h-full">
                        <div className="flex flex-col gap-6">

                            {/* Role & Focus */}
                            <motion.div custom={0} variants={cardVariants} initial="hidden" animate={isVisible ? 'visible' : 'hidden'}>
                                <SectionLabel icon={<Briefcase size={13} />} label="Role" />
                                <div className="pl-1">
                                    <p className="text-sm sm:text-base font-semibold text-[var(--text-primary)] leading-snug">
                                        AI Engineer & CV Specialist
                                        <span className="text-accent"> @ Abu Dhabi, UAE</span>
                                    </p>
                                    <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed">
                                        Medical Imaging · Edge AI · Agentic Workflows
                                    </p>
                                </div>
                            </motion.div>

                            {/* AI / ML Expertise */}
                            <motion.div custom={1} variants={cardVariants} initial="hidden" animate={isVisible ? 'visible' : 'hidden'}>
                                <SectionLabel icon={<Cpu size={13} />} label="AI / ML Expertise" />
                                <ul className="pl-1 space-y-1.5">
                                    {aiMl.map((item) => (
                                        <li key={item} className="flex items-start gap-2">
                                            <span className="text-accent mt-1 flex-shrink-0 text-[8px]">▶</span>
                                            <span className="text-xs sm:text-[13px] text-[var(--text-muted)] leading-relaxed">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>

                            {/* Languages */}
                            <motion.div custom={2} variants={cardVariants} initial="hidden" animate={isVisible ? 'visible' : 'hidden'}>
                                <SectionLabel icon={<Code2 size={13} />} label="Languages" />
                                <div className="flex flex-wrap gap-1.5 pl-1">
                                    {languages.map((lang) => (
                                        <Tag key={lang}>{lang}</Tag>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Tools */}
                            <motion.div custom={3} variants={cardVariants} initial="hidden" animate={isVisible ? 'visible' : 'hidden'}>
                                <SectionLabel icon={<Wrench size={13} />} label="Tools & Frameworks" />
                                <div className="flex flex-wrap gap-1.5 pl-1">
                                    {tools.map((tool) => (
                                        <Tag key={tool} dimmed>{tool}</Tag>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Certifications */}
                            <motion.div custom={4} variants={cardVariants} initial="hidden" animate={isVisible ? 'visible' : 'hidden'}>
                                <SectionLabel icon={<Award size={13} />} label="Certifications" />
                                <div className="pl-1 space-y-2">
                                    {certifications.map((cert) => (
                                        <div key={cert.label} className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 min-w-0">
                                                <span className="text-accent flex-shrink-0 text-[8px]">✦</span>
                                                <span className="text-xs sm:text-[13px] text-[var(--text-primary)] font-medium truncate">{cert.label}</span>
                                            </div>
                                            <span className="text-[10px] font-mono text-[var(--text-faint)] flex-shrink-0">{cert.issuer}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* Status */}
                            <motion.div custom={5} variants={cardVariants} initial="hidden" animate={isVisible ? 'visible' : 'hidden'}>
                                <div className="flex items-center gap-3 border border-accent/20 bg-accent/5 px-4 py-3">
                                    <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent" />
                                    </span>
                                    <div>
                                        <p className="text-xs font-mono text-[var(--text-faint)] uppercase tracking-[0.15em] leading-none mb-0.5">Status</p>
                                        <p className="text-sm font-semibold text-accent">Open to Opportunities</p>
                                    </div>
                                    <Zap size={14} className="text-accent ml-auto opacity-60" />
                                </div>
                            </motion.div>

                        </div>
                    </HudFrame>
                </motion.div>

                {/* ── Right — bio + resume ── */}
                <div className="flex flex-col gap-5">
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
                        <p className="text-sm sm:text-base text-[var(--text-muted)] leading-relaxed text-justify hyphens-auto">
                            I'm an <span className="text-accent font-semibold">AI Engineer and Computer Vision Specialist</span>. I expect to complete my B.Sc. in Computer Science from Al Ain University in August 2026, and I'm a graduate of the intensive 42 Abu Dhabi Piscine and the Harvard CS50 series. My research focuses on parameter-efficient deep learning architectures for medical image segmentation and satellite remote sensing — I'm the author of a published paper at <span className="text-[var(--text-primary)]">IEEE SNAMS 2025</span> and first author of <span className="text-[var(--text-primary)]">F-UNet</span>, presented at SRC'26 and under review at IEEE JBHI. I build real-world solutions across edge AI, robotics, and agentic systems, including the <span className="text-[var(--text-primary)]">CleanCity Agent</span>, built with Anthropic's Model Context Protocol for the MCP 1st Birthday Hackathon. I specialize in PyTorch, OpenCV, TensorFlow Lite, and Kotlin.
                        </p>
                    </motion.div>

                    {/* Skills grid */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.25 }}
                        className="border border-[var(--border)] bg-[var(--surface)] p-4"
                    >
                        <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-faint)] mb-3">Core Stack</p>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                'Python', 'PyTorch', 'OpenCV', 'YOLOv8', 'TensorFlow',
                                'TFLite', 'Kotlin', 'Gradio', 'FastAPI', 'Docker',
                                'MCP', 'FAISS', 'RAG'
                            ].map((skill) => (
                                <span
                                    key={skill}
                                    className="text-[10px] px-2 py-0.5 border border-accent/40 text-accent font-mono hover:border-accent hover:bg-accent/5 transition-colors"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Education */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.32 }}
                        className="border border-[var(--border)] bg-[var(--surface)] p-4 flex items-start gap-4"
                    >
                        <div className="text-accent mt-0.5 flex-shrink-0">
                            <BookOpen size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-faint)] mb-0.5">Education</p>
                            <p className="text-sm font-bold text-[var(--text-primary)] truncate">Al Ain University, Abu Dhabi, UAE</p>
                            <p className="text-xs text-[var(--text-muted)]">B.Sc. Computer Science</p>
                            <p className="text-[10px] font-mono text-[var(--text-faint)] mt-0.5">Sep 2022 – Expected Aug 2026</p>
                        </div>
                    </motion.div>

                    {/* Resume */}
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={isVisible ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.38 }}
                        className="relative border border-[var(--border-strong)] bg-[var(--surface)] overflow-hidden group"
                    >
                        {/* Decorative scan-line shimmer */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/[0.03] to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 pointer-events-none" />

                        <div className="p-5 sm:p-6">
                            <div className="flex items-start gap-4">
                                {/* Icon */}
                                <div className="relative flex-shrink-0">
                                    <div className="w-12 h-12 border border-accent/30 bg-accent/5 flex items-center justify-center">
                                        <FileText size={22} className="text-accent" />
                                    </div>
                                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 border-b border-r border-accent/40" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-faint)] mb-1">Data Cartridge</p>
                                    <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)] tracking-wide font-mono uppercase">
                                        Résumé
                                    </h3>
                                    <p className="text-[10px] font-mono text-[var(--text-faint)] mt-1">
                                        AlBaraa_Alolabi_Resume.pdf · Access Level: Unclassified
                                    </p>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="flex gap-3 mt-5">
                                <CyberButton
                                    variant="secondary"
                                    onClick={() => window.open(resumeConfig.viewUrl, '_blank', 'noopener')}
                                    className="flex-1"
                                >
                                    <ExternalLink size={16} className="mr-2" />
                                    View
                                </CyberButton>
                                <CyberButton onClick={handleResumeDownload} className="flex-1">
                                    <Download size={16} className="mr-2" />
                                    Download
                                </CyberButton>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default About;
