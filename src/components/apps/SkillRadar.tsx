import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Radar, ChevronRight } from 'lucide-react';

interface SkillCategory {
    name: string;
    angle: number;
    level: number; // 0-1
    skills: { name: string; level: number }[];
    color: string;
}

const CATEGORIES: SkillCategory[] = [
    {
        name: 'AI / ML',
        angle: 0,
        level: 0.95,
        color: '#22c55e',
        skills: [
            { name: 'PyTorch', level: 0.9 },
            { name: 'TensorFlow', level: 0.85 },
            { name: 'scikit-learn', level: 0.85 },
            { name: 'FAISS', level: 0.8 },
            { name: 'Claude API', level: 0.8 },
        ],
    },
    {
        name: 'Computer Vision',
        angle: 60,
        level: 0.92,
        color: '#06b6d4',
        skills: [
            { name: 'OpenCV', level: 0.95 },
            { name: 'YOLOv8', level: 0.9 },
            { name: 'MediaPipe', level: 0.85 },
            { name: 'face_recognition', level: 0.8 },
            { name: 'Tesseract OCR', level: 0.75 },
        ],
    },
    {
        name: 'Languages',
        angle: 120,
        level: 0.88,
        color: '#a855f7',
        skills: [
            { name: 'Python', level: 0.95 },
            { name: 'TypeScript', level: 0.85 },
            { name: 'JavaScript', level: 0.85 },
            { name: 'C++', level: 0.7 },
            { name: 'Java', level: 0.65 },
        ],
    },
    {
        name: 'Web Dev',
        angle: 180,
        level: 0.82,
        color: '#f59e0b',
        skills: [
            { name: 'React', level: 0.9 },
            { name: 'React Native', level: 0.8 },
            { name: 'FastAPI', level: 0.85 },
            { name: 'Node.js', level: 0.75 },
            { name: 'Tailwind CSS', level: 0.85 },
        ],
    },
    {
        name: 'Tools',
        angle: 240,
        level: 0.85,
        color: '#ef4444',
        skills: [
            { name: 'Git / GitHub', level: 0.9 },
            { name: 'MCP Protocol', level: 0.88 },
            { name: 'Gradio', level: 0.85 },
            { name: 'Streamlit', level: 0.85 },
            { name: 'HuggingFace', level: 0.8 },
        ],
    },
    {
        name: 'Data',
        angle: 300,
        level: 0.78,
        color: '#ec4899',
        skills: [
            { name: 'NumPy', level: 0.9 },
            { name: 'Pandas', level: 0.85 },
            { name: 'SQLite', level: 0.8 },
            { name: 'PostgreSQL', level: 0.7 },
            { name: 'Matplotlib', level: 0.75 },
        ],
    },
];

const SkillRadar: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedCategory, setSelectedCategory] = useState<SkillCategory | null>(null);
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const angleRef = useRef(0);
    const animatedLevelsRef = useRef(CATEGORIES.map(() => 0));

    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const w = canvas.width;
        const h = canvas.height;
        const cx = w / 2;
        const cy = h / 2;
        const maxR = Math.min(cx, cy) - 40;

        ctx.clearRect(0, 0, w, h);

        // Animate levels in
        CATEGORIES.forEach((_, i) => {
            const target = CATEGORIES[i].level;
            animatedLevelsRef.current[i] += (target - animatedLevelsRef.current[i]) * 0.05;
        });

        // Background rings
        for (let i = 1; i <= 5; i++) {
            const r = (maxR / 5) * i;
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = i === 5 ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.04)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Radial lines
        CATEGORIES.forEach(cat => {
            const rad = (cat.angle * Math.PI) / 180;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(cx + Math.cos(rad) * maxR, cy + Math.sin(rad) * maxR);
            ctx.strokeStyle = 'rgba(255,255,255,0.06)';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Skill polygon (filled)
        ctx.beginPath();
        CATEGORIES.forEach((cat, i) => {
            const rad = (cat.angle * Math.PI) / 180;
            const r = maxR * animatedLevelsRef.current[i];
            const x = cx + Math.cos(rad) * r;
            const y = cy + Math.sin(rad) * r;
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.6)';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Category nodes
        CATEGORIES.forEach((cat, i) => {
            const rad = (cat.angle * Math.PI) / 180;
            const r = maxR * animatedLevelsRef.current[i];
            const x = cx + Math.cos(rad) * r;
            const y = cy + Math.sin(rad) * r;
            const isHovered = hoveredIdx === i;
            const nodeSize = isHovered ? 7 : 5;

            // Glow
            ctx.beginPath();
            ctx.arc(x, y, nodeSize + 4, 0, Math.PI * 2);
            ctx.fillStyle = `${cat.color}33`;
            ctx.fill();

            // Node
            ctx.beginPath();
            ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
            ctx.fillStyle = cat.color;
            ctx.fill();

            // Label
            const labelR = maxR + 20;
            const lx = cx + Math.cos(rad) * labelR;
            const ly = cy + Math.sin(rad) * labelR;
            ctx.font = `bold 10px "JetBrains Mono", monospace`;
            ctx.fillStyle = isHovered ? cat.color : 'rgba(255,255,255,0.6)';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(cat.name.toUpperCase(), lx, ly);
        });

        // Sweep line (radar scan)
        angleRef.current = (angleRef.current + 0.8) % 360;
        const sweepRad = (angleRef.current * Math.PI) / 180;
        const grad = ctx.createLinearGradient(cx, cy,
            cx + Math.cos(sweepRad) * maxR,
            cy + Math.sin(sweepRad) * maxR
        );
        grad.addColorStop(0, 'rgba(34, 197, 94, 0)');
        grad.addColorStop(0.5, 'rgba(34, 197, 94, 0.15)');
        grad.addColorStop(1, 'rgba(34, 197, 94, 0.4)');

        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sweepRad) * maxR, cy + Math.sin(sweepRad) * maxR);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Sweep arc trail
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, maxR, sweepRad - 0.3, sweepRad, false);
        ctx.closePath();
        const arcGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
        arcGrad.addColorStop(0, 'rgba(34, 197, 94, 0)');
        arcGrad.addColorStop(1, 'rgba(34, 197, 94, 0.08)');
        ctx.fillStyle = arcGrad;
        ctx.fill();

        // Center dot
        ctx.beginPath();
        ctx.arc(cx, cy, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#22c55e';
        ctx.fill();
    }, [hoveredIdx]);

    useEffect(() => {
        let raf = 0;
        const loop = () => {
            draw();
            raf = requestAnimationFrame(loop);
        };
        raf = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(raf);
    }, [draw]);

    // Handle canvas click/hover for category selection
    const handleCanvasInteraction = useCallback((e: React.MouseEvent<HTMLCanvasElement>, isClick: boolean) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = (e.clientX - rect.left) * (canvas.width / rect.width);
        const my = (e.clientY - rect.top) * (canvas.height / rect.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const maxR = Math.min(cx, cy) - 40;

        let closest = -1;
        let closestDist = Infinity;
        CATEGORIES.forEach((cat, i) => {
            const rad = (cat.angle * Math.PI) / 180;
            const r = maxR * cat.level;
            const x = cx + Math.cos(rad) * r;
            const y = cy + Math.sin(rad) * r;
            const dist = Math.sqrt((mx - x) ** 2 + (my - y) ** 2);
            if (dist < 30 && dist < closestDist) {
                closest = i;
                closestDist = dist;
            }
        });

        if (isClick) {
            setSelectedCategory(closest >= 0 ? CATEGORIES[closest] : null);
        } else {
            setHoveredIdx(closest >= 0 ? closest : null);
        }
    }, []);

    return (
        <div className="h-full flex flex-col bg-[var(--surface-inset)] font-mono overflow-hidden select-none">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface)]">
                <div className="flex items-center gap-2">
                    <Radar size={16} className="text-accent" />
                    <div>
                        <div className="text-[9px] uppercase tracking-[0.3em] text-[var(--text-faint)]">// sys.scan</div>
                        <div className="text-sm font-bold text-[var(--text-primary)] tracking-wider uppercase">Skill Radar</div>
                    </div>
                </div>
                <div className="text-[9px] uppercase tracking-[0.3em] text-[var(--text-faint)]">
                    {CATEGORIES.length} categories · {CATEGORIES.reduce((a, c) => a + c.skills.length, 0)} skills
                </div>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Radar canvas */}
                <div className="flex-1 flex items-center justify-center p-4 min-h-[300px]">
                    <canvas
                        ref={canvasRef}
                        width={400}
                        height={400}
                        className="max-w-full max-h-full"
                        style={{ aspectRatio: '1/1' }}
                        onClick={(e) => handleCanvasInteraction(e, true)}
                        onMouseMove={(e) => handleCanvasInteraction(e, false)}
                        onMouseLeave={() => setHoveredIdx(null)}
                    />
                </div>

                {/* Skill detail panel */}
                <div className="lg:w-[220px] border-t lg:border-t-0 lg:border-l border-[var(--border)] p-3 overflow-y-auto custom-scrollbar bg-[var(--surface)]">
                    {selectedCategory ? (
                        <div>
                            <div className="text-[9px] uppercase tracking-[0.3em] text-[var(--text-faint)] mb-1">Selected</div>
                            <div className="text-sm font-bold mb-3" style={{ color: selectedCategory.color }}>
                                {selectedCategory.name}
                            </div>
                            <div className="text-[9px] uppercase tracking-[0.3em] text-[var(--text-faint)] mb-2">
                                Proficiency
                            </div>
                            <div className="space-y-2">
                                {selectedCategory.skills.map(skill => (
                                    <div key={skill.name}>
                                        <div className="flex justify-between text-[10px] mb-0.5">
                                            <span className="text-[var(--text-muted)]">{skill.name}</span>
                                            <span className="text-[var(--text-faint)] tabular-nums">{Math.round(skill.level * 100)}%</span>
                                        </div>
                                        <div className="h-[3px] bg-[var(--surface-inset)] overflow-hidden">
                                            <div
                                                className="h-full transition-all duration-700"
                                                style={{
                                                    width: `${skill.level * 100}%`,
                                                    background: selectedCategory.color,
                                                    boxShadow: `0 0 8px ${selectedCategory.color}`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center">
                            <Radar size={24} className="text-[var(--text-faint)] mb-2" />
                            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-faint)]">
                                Click a node on the<br />radar to inspect skills
                            </div>
                            <div className="mt-4 space-y-1 w-full">
                                {CATEGORIES.map((cat, i) => (
                                    <button
                                        key={cat.name}
                                        onClick={() => { setSelectedCategory(cat); setHoveredIdx(i); }}
                                        className="w-full flex items-center gap-2 px-2 py-1 text-[10px] text-left hover:bg-[var(--surface-raised)] transition-colors"
                                    >
                                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: cat.color }} />
                                        <span className="text-[var(--text-muted)] flex-1">{cat.name}</span>
                                        <ChevronRight size={10} className="text-[var(--text-faint)]" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillRadar;
