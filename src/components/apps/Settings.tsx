import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Volume2, Zap, Palette, VolumeX, Monitor } from 'lucide-react';
import { useSound } from '@/context/SoundContext';

const DEFAULT_ACCENT = '#22c55e';
const DEFAULT_ACCENT_RGB = '34, 197, 94';

const ACCENT_COLORS = [
    { name: 'Holo', value: '#22c55e', rgb: '34, 197, 94' },
    { name: 'Neon', value: '#00ff41', rgb: '0, 255, 65' },
    { name: 'Cyan', value: '#00d4ff', rgb: '0, 212, 255' },
    { name: 'Pink', value: '#ff0080', rgb: '255, 0, 128' },
    { name: 'Orange', value: '#ff6600', rgb: '255, 102, 0' },
    { name: 'Purple', value: '#a855f7', rgb: '168, 85, 247' },
    { name: 'Gold', value: '#fbbf24', rgb: '251, 191, 36' },
];

const SectionHeader: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
    <h2 className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-[var(--text-muted)] mb-3">
        <span className="text-accent">{icon}</span>
        {label}
    </h2>
);

const Settings: React.FC = () => {
    const { playSound, isMuted, toggleMute, setVolume, volume } = useSound();

    const [scanlineIntensity, setScanlineIntensity] = useState(() => {
        const saved = localStorage.getItem('scanlineIntensity');
        return saved ? parseFloat(saved) : 0.03;
    });
    const [bloomStrength, setBloomStrength] = useState(() => {
        const saved = localStorage.getItem('bloomStrength');
        return saved ? parseFloat(saved) : 1;
    });
    const [glassBlur, setGlassBlur] = useState(() => {
        const saved = localStorage.getItem('glassBlur');
        return saved ? parseFloat(saved) : 12;
    });

    const [selectedAccent, setSelectedAccent] = useState(() => {
        if (typeof window === 'undefined') return DEFAULT_ACCENT;
        const saved = localStorage.getItem('accentColor');
        if (saved === '#00ff41' && !localStorage.getItem('accentColorMigrated')) {
            localStorage.setItem('accentColorMigrated', '1');
            return DEFAULT_ACCENT;
        }
        if (saved && ACCENT_COLORS.some(c => c.value === saved)) return saved;
        return DEFAULT_ACCENT;
    });

    useEffect(() => {
        document.documentElement.style.setProperty('--scanline-opacity', scanlineIntensity.toString());
        localStorage.setItem('scanlineIntensity', scanlineIntensity.toString());
    }, [scanlineIntensity]);

    useEffect(() => {
        document.documentElement.style.setProperty('--bloom-strength', bloomStrength.toString());
        localStorage.setItem('bloomStrength', bloomStrength.toString());
    }, [bloomStrength]);

    useEffect(() => {
        document.documentElement.style.setProperty('--glass-blur', `${glassBlur}px`);
        localStorage.setItem('glassBlur', glassBlur.toString());
    }, [glassBlur]);

    useEffect(() => {
        const color = ACCENT_COLORS.find(c => c.value === selectedAccent);
        const value = color?.value ?? DEFAULT_ACCENT;
        const rgb = color?.rgb ?? DEFAULT_ACCENT_RGB;
        document.documentElement.style.setProperty('--accent', value);
        document.documentElement.style.setProperty('--accent-rgb', rgb);
        document.documentElement.style.setProperty('--accent-glow', `rgba(${rgb}, 0.3)`);
        document.documentElement.style.setProperty('--accent-dim', `rgba(${rgb}, 0.5)`);
        localStorage.setItem('accentColor', value);
    }, [selectedAccent]);

    const handleAccentChange = (colorValue: string) => {
        playSound('click');
        setSelectedAccent(colorValue);
    };

    return (
        <div className="h-full bg-[var(--surface-inset)] text-[var(--text-primary)] font-mono overflow-y-auto custom-scrollbar">
            <div className="p-5 sm:p-6 max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--border)]">
                    <SettingsIcon size={18} className="text-accent" />
                    <h1 className="text-sm font-bold tracking-[0.3em] uppercase">System Config</h1>
                </div>

                <div className="space-y-7">
                    {/* Accent */}
                    <section>
                        <SectionHeader icon={<Palette size={12} />} label="Accent Color" />
                        <div className="grid grid-cols-7 gap-2 sm:gap-3">
                            {ACCENT_COLORS.map(color => {
                                const isActive = selectedAccent === color.value;
                                return (
                                    <button
                                        key={color.value}
                                        onClick={() => handleAccentChange(color.value)}
                                        aria-label={color.name}
                                        aria-pressed={isActive}
                                        className="flex flex-col items-center gap-1.5 py-1 group"
                                    >
                                        <div
                                            className={`w-9 h-9 rounded-full border-2 transition-all
                                                ${isActive ? 'scale-110 border-[var(--text-primary)]' : 'border-transparent group-hover:scale-105'}
                                            `}
                                            style={{
                                                backgroundColor: color.value,
                                                boxShadow: isActive ? `0 0 16px ${color.value}` : undefined,
                                            }}
                                        />
                                        <span className={`text-[9px] uppercase tracking-wider transition-colors
                                            ${isActive ? 'text-accent' : 'text-[var(--text-faint)] group-hover:text-[var(--text-muted)]'}
                                        `}>
                                            {color.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    {/* Audio */}
                    <section>
                        <SectionHeader icon={<Volume2 size={12} />} label="Audio Output" />
                        <div className="flex items-center gap-3 px-3 py-2.5 border border-[var(--border)]">
                            <button
                                onClick={() => { playSound('click'); toggleMute(); }}
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                                className={`p-2 border transition-colors
                                    ${isMuted ? 'border-red-500/60 text-red-400' : 'border-accent text-accent'}
                                `}
                            >
                                {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                            </button>
                            <div className="flex-1 space-y-1.5">
                                <div className="flex justify-between text-[10px] uppercase tracking-wider text-[var(--text-faint)]">
                                    <span>Master Volume</span>
                                    <span>{isMuted ? 'MUTED' : `${Math.round((volume ?? 0.5) * 100)}%`}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0" max="1" step="0.05"
                                    value={volume ?? 0.5}
                                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                                    disabled={isMuted}
                                    aria-label="Master volume"
                                    className="w-full accent-[var(--accent)] h-2 bg-[var(--surface-raised)] rounded-none appearance-none cursor-pointer disabled:opacity-50"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Visuals */}
                    <section>
                        <SectionHeader icon={<Monitor size={12} />} label="Visual Effects" />
                        <div className="space-y-3 px-3 py-3 border border-[var(--border)]">
                            <Slider
                                label="Scanline Opacity"
                                min={0} max={0.15} step={0.01}
                                value={scanlineIntensity}
                                onChange={setScanlineIntensity}
                                format={(v) => `${Math.round(v * 100)}%`}
                            />
                            <Slider
                                label="Glow Intensity"
                                min={0} max={2} step={0.1}
                                value={bloomStrength}
                                onChange={setBloomStrength}
                                format={(v) => `${Math.round(v * 100)}%`}
                            />
                            <Slider
                                label="Glass Blur"
                                min={0} max={30} step={1}
                                value={glassBlur}
                                onChange={setGlassBlur}
                                format={(v) => `${Math.round(v)}px`}
                            />
                        </div>
                    </section>

                    {/* System info */}
                    <section>
                        <SectionHeader icon={<Zap size={12} />} label="System Info" />
                        <div className="space-y-1.5 px-3 py-3 border border-[var(--border)] text-[11px]">
                            <InfoRow label="Version" value="HOLO-OS v5.0.0" />
                            <InfoRow label="Kernel" value="React 18.3" />
                            <InfoRow label="Renderer" value="Framer Motion" />
                            <InfoRow label="Accent" value={ACCENT_COLORS.find(c => c.value === selectedAccent)?.name ?? 'Custom'} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

interface SliderProps {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    format: (v: number) => string;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, onChange, format }) => (
    <div>
        <div className="flex justify-between text-[10px] uppercase tracking-wider text-[var(--text-faint)] mb-1">
            <span>{label}</span>
            <span className="text-[var(--text-muted)]">{format(value)}</span>
        </div>
        <input
            type="range"
            min={min} max={max} step={step}
            value={value}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            aria-label={label}
            className="w-full accent-[var(--accent)] h-2 bg-[var(--surface-raised)] rounded-none appearance-none cursor-pointer"
        />
    </div>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div className="flex justify-between">
        <span className="text-[var(--text-faint)] uppercase tracking-wider">{label}</span>
        <span className="text-[var(--text-primary)]">{value}</span>
    </div>
);

export default Settings;
