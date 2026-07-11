import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Mail, Linkedin, Github, Bot, MapPin, Download, FileText, ExternalLink,
    ArrowRight, Briefcase, GraduationCap, Award, BookOpen, FlaskConical,
} from 'lucide-react';
import {
    experience, research, certifications, projects, resumeConfig,
} from '@/data/portfolioData';

// ───────────────────────────────────────────────────────────────────────────
// Recruiter view — a clean, scannable, mobile-first, print-friendly resume.
// Deliberately the opposite of the HOLO-OS theme: no boot, no particles, no
// custom cursor, minimal motion. Facts are sourced from portfolioData so this
// page never drifts from the rest of the site.
// ───────────────────────────────────────────────────────────────────────────

const NAME = 'AlBaraa AlOlabi';
const TITLE = 'AI Engineer & Computer Vision Specialist';
const LOCATION = 'Abu Dhabi, UAE';

// Education is not a structured export in portfolioData, so the degree is the
// one fact defined here. The 42 Abu Dhabi Piscine is pulled from experience[].
const DEGREE = {
    program: 'B.Sc. Computer Science',
    school: 'Al Ain University',
    period: 'Sep 2022 – Expected Aug 2026',
    location: 'Al Ain, UAE',
};

const CONTACTS = [
    { icon: Mail, label: '666645@gmail.com', href: 'mailto:666645@gmail.com' },
    { icon: Linkedin, label: 'linkedin.com/in/albaraa-alolabi', href: 'https://linkedin.com/in/albaraa-alolabi' },
    { icon: Github, label: 'github.com/AlBaraa63', href: 'https://github.com/AlBaraa63' },
    { icon: Bot, label: 'huggingface.co/AlBaraa63', href: 'https://huggingface.co/AlBaraa63' },
];

const firstSentence = (text: string): string => {
    const idx = text.indexOf('. ');
    return idx === -1 ? text : text.slice(0, idx + 1);
};

// Section wrapper — small-caps mono heading with an accent tick, matching the
// site's visual language but restrained for a professional document.
const Section: React.FC<{ title: string; icon: React.ElementType; children: React.ReactNode }> = ({ title, icon: Icon, children }) => (
    <section className="mt-9">
        <h2 className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.28em] text-accent border-b border-[var(--border)] pb-2 mb-4">
            <Icon size={13} strokeWidth={2} className="resume-accent" />
            {title}
        </h2>
        {children}
    </section>
);

const Resume: React.FC = () => {
    useEffect(() => {
        const prevTitle = document.title;
        document.title = `${NAME} — Resume`;
        window.scrollTo(0, 0);
        return () => { document.title = prevTitle; };
    }, []);

    // Headline proof points. The DOI href is sourced from research[] rather than
    // re-typed here so the link can never drift from the publications section.
    const snams = research.find(r => r.id === 'snams2025-ai-edu');
    const proofPoints: Array<{ text: string; href?: string }> = [
        {
            text: 'Published sole author at IEEE SNAMS 2025 (peer-reviewed, with DOI)',
            href: snams?.link,
        },
        {
            text: 'F-UNet (first author): 82% parameter reduction — presented at SRC’26, under review at IEEE JBHI',
        },
        {
            text: 'Edge AI: 9.87 MB model with 12–20 ms on-device inference (TomatoCare)',
        },
        {
            text: '0.854 IoU satellite water-body segmentation with a MiT-B2 transformer backbone',
        },
    ];

    // Experience timeline: the 42 Piscine and IEEE SNAMS live under Education and
    // Publications respectively, so they are excluded here to avoid duplication.
    const workHistory = experience.filter(
        e => e.id !== '42-abu-dhabi-piscine' && e.id !== 'ieee-snams-2025',
    );
    const piscine = experience.find(e => e.id === '42-abu-dhabi-piscine');

    const featuredProjects = projects.filter(p => p.featured);
    // SNAMS appears in Publications; other featured certs are shown here.
    const keyCerts = certifications.filter(c => c.featured && c.id !== 'snams2025');

    const isRealLink = (link?: string) => !!link && link !== '#';

    return (
        <div className="resume-root min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] font-sans antialiased">
            {/* Scoped styles: re-enable the native cursor (index.css hides it
                globally for the OS) and add print rules so this prints as a
                decent one/two-page resume. Scoped to .resume-root so nothing
                leaks back into the OS. */}
            <style>{`
                .resume-root, .resume-root * { cursor: auto !important; }
                .resume-root a, .resume-root button, .resume-root [role="button"] { cursor: pointer !important; }
                @media print {
                    @page { margin: 1.4cm; }
                    html, body { background: #fff !important; }
                    .resume-root { background: #fff !important; color: #000 !important; }
                    .resume-root * { color: #000 !important; box-shadow: none !important; text-shadow: none !important; }
                    .resume-root .resume-accent { color: #000 !important; }
                    .resume-root a { color: #000 !important; text-decoration: underline; }
                    .resume-root .resume-chip { border-color: #999 !important; }
                    .resume-root hr, .resume-root .resume-divider { border-color: #ccc !important; }
                    .resume-no-print { display: none !important; }
                    .resume-root { padding: 0 !important; }
                }
            `}</style>

            {/* Action bar — hidden in print */}
            <div className="resume-no-print sticky top-0 z-20 bg-[var(--bg-primary)]/90 backdrop-blur-md border-b border-[var(--border)]">
                <div className="max-w-3xl mx-auto px-5 sm:px-6 h-14 flex items-center justify-between gap-3">
                    <Link
                        to="/"
                        className="group inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-[0.15em] text-[var(--text-muted)] hover:text-accent transition-colors"
                    >
                        Enter HOLO-OS
                        <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                    <div className="flex items-center gap-2">
                        <a
                            href="/resume.pdf"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-accent hover:text-accent transition-colors"
                        >
                            <FileText size={13} />
                            View PDF
                        </a>
                        <a
                            href="/resume.pdf"
                            download={resumeConfig.fileName}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] bg-accent text-black font-semibold hover:bg-[var(--accent-hover)] transition-colors"
                        >
                            <Download size={13} />
                            Download
                        </a>
                    </div>
                </div>
            </div>

            <main className="max-w-3xl mx-auto px-5 sm:px-8 py-8 sm:py-10">
                {/* Header */}
                <header>
                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                        {NAME}
                    </h1>
                    <p className="mt-1.5 text-base sm:text-lg text-accent font-medium resume-accent">
                        {TITLE}
                    </p>
                    <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-[var(--text-muted)]">
                        <MapPin size={13} className="resume-accent text-accent" />
                        {LOCATION}
                    </p>

                    {/* Contact row */}
                    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm">
                        {CONTACTS.map(({ icon: Icon, label, href }) => (
                            <a
                                key={label}
                                href={href}
                                target={href.startsWith('mailto:') ? undefined : '_blank'}
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-[var(--text-muted)] hover:text-accent transition-colors break-all"
                            >
                                <Icon size={13} className="resume-accent text-accent flex-shrink-0" />
                                {label}
                            </a>
                        ))}
                    </div>
                </header>

                {/* Headline proof points */}
                <Section title="Highlights" icon={Award}>
                    <ul className="space-y-2">
                        {proofPoints.map((p, i) => (
                            <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-[var(--text-secondary)]">
                                <span className="text-accent resume-accent mt-0.5 flex-shrink-0">▸</span>
                                <span>
                                    {p.text}
                                    {p.href && (
                                        <a
                                            href={p.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-1.5 inline-flex items-center gap-1 text-accent resume-accent hover:underline"
                                        >
                                            DOI <ExternalLink size={11} />
                                        </a>
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>
                </Section>

                {/* Experience */}
                <Section title="Experience" icon={Briefcase}>
                    <div className="space-y-6">
                        {workHistory.map(job => (
                            <article key={job.id}>
                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-4">
                                    <h3 className="text-base font-semibold text-[var(--text-primary)]">
                                        {job.title}
                                        <span className="text-[var(--text-muted)] font-normal"> · {job.company}</span>
                                    </h3>
                                    <span className="text-xs font-mono text-[var(--text-faint)] whitespace-nowrap flex-shrink-0">
                                        {job.period}
                                    </span>
                                </div>
                                <ul className="mt-2 space-y-1.5">
                                    {job.highlights.map((h, i) => (
                                        <li key={i} className="flex gap-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                                            <span className="text-[var(--text-faint)] mt-1 flex-shrink-0">–</span>
                                            <span>{h}</span>
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        ))}
                    </div>
                </Section>

                {/* Education */}
                <Section title="Education" icon={GraduationCap}>
                    <div className="space-y-4">
                        <article>
                            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-4">
                                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                                    {DEGREE.program}
                                    <span className="text-[var(--text-muted)] font-normal"> · {DEGREE.school}</span>
                                </h3>
                                <span className="text-xs font-mono text-[var(--text-faint)] whitespace-nowrap flex-shrink-0">
                                    {DEGREE.period}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">{DEGREE.location}</p>
                        </article>

                        {piscine && (
                            <article>
                                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-4">
                                    <h3 className="text-base font-semibold text-[var(--text-primary)]">
                                        {piscine.title}
                                        <span className="text-[var(--text-muted)] font-normal"> · {piscine.company}</span>
                                    </h3>
                                    <span className="text-xs font-mono text-[var(--text-faint)] whitespace-nowrap flex-shrink-0">
                                        {piscine.period}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                                    {piscine.description}
                                </p>
                            </article>
                        )}
                    </div>
                </Section>

                {/* Publications */}
                <Section title="Publications & Research" icon={FlaskConical}>
                    <div className="space-y-4">
                        {research.map(pub => (
                            <article key={pub.id}>
                                <h3 className="text-sm font-semibold text-[var(--text-primary)] leading-snug">
                                    {pub.title}
                                </h3>
                                <p className="mt-1 text-xs text-[var(--text-muted)] font-mono">
                                    {pub.conference}
                                    {pub.link && (
                                        <a
                                            href={pub.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="ml-2 inline-flex items-center gap-1 text-accent resume-accent hover:underline"
                                        >
                                            DOI <ExternalLink size={10} />
                                        </a>
                                    )}
                                </p>
                            </article>
                        ))}
                    </div>
                </Section>

                {/* Selected projects */}
                <Section title="Selected Projects" icon={BookOpen}>
                    <div className="space-y-4">
                        {featuredProjects.map(project => (
                            <article key={project.id}>
                                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">
                                        {project.title}
                                    </h3>
                                    <span className="resume-no-print flex items-center gap-2.5">
                                        {isRealLink(project.github) && (
                                            <a
                                                href={project.github}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${project.title} on GitHub`}
                                                className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-accent transition-colors"
                                            >
                                                <Github size={12} /> Code
                                            </a>
                                        )}
                                        {isRealLink(project.liveDemo) && (
                                            <a
                                                href={project.liveDemo}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${project.title} live demo`}
                                                className="inline-flex items-center gap-1 text-xs text-[var(--text-muted)] hover:text-accent transition-colors"
                                            >
                                                <ExternalLink size={12} /> Demo
                                            </a>
                                        )}
                                    </span>
                                </div>
                                <p className="mt-1 text-sm text-[var(--text-secondary)] leading-relaxed">
                                    {firstSentence(project.description)}
                                </p>
                            </article>
                        ))}
                    </div>
                </Section>

                {/* Certifications */}
                <Section title="Key Certifications" icon={Award}>
                    <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                        {keyCerts.map(cert => (
                            <li key={cert.id} className="text-sm">
                                {isRealLink(cert.link) ? (
                                    <a
                                        href={cert.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[var(--text-primary)] hover:text-accent transition-colors"
                                    >
                                        {cert.title}
                                    </a>
                                ) : (
                                    <span className="text-[var(--text-primary)]">{cert.title}</span>
                                )}
                                <span className="text-[var(--text-faint)]"> · {cert.issuer}</span>
                            </li>
                        ))}
                    </ul>
                </Section>

                {/* Footer CTA */}
                <div className="mt-10 pt-6 border-t border-[var(--border)] resume-divider flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <p className="text-xs font-mono text-[var(--text-faint)]">
                        This resume is also available as an interactive experience.
                    </p>
                    <div className="resume-no-print flex items-center gap-2">
                        <a
                            href="/resume.pdf"
                            download={resumeConfig.fileName}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] bg-accent text-black font-semibold hover:bg-[var(--accent-hover)] transition-colors"
                        >
                            <Download size={13} />
                            Download PDF
                        </a>
                        <Link
                            to="/"
                            className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono uppercase tracking-[0.12em] border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-accent hover:text-accent transition-colors"
                        >
                            Enter HOLO-OS
                            <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Resume;
