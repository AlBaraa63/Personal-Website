import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Monitor, Volume2, Zap, Palette, Sun, Moon } from 'lucide-react';
import { useSound } from '@/context/SoundContext';
import { useTheme } from '@/context/ThemeContext';

// Accent color presets
const ACCENT_COLORS = [
    { name: 'Neon Green', value: '#00ff41', rgb: '0, 255, 65' },
    { name: 'Cyber Cyan', value: '#00d4ff', rgb: '0, 212, 255' },
    { name: 'Hot Pink', value: '#ff0080', rgb: '255, 0, 128' },
    { name: 'Electric Orange', value: '#ff6600', rgb: '255, 102, 0' },
    { name: 'Purple Haze', value: '#a855f7', rgb: '168, 85, 247' },
    { name: 'Gold', value: '#fbbf24', rgb: '251, 191, 36' },
];

const Settings: React.FC = () => {
    const { playSound, isMuted, toggleMute, setVolume } = useSound();
    const { theme, toggleTheme } = useTheme();

    // Local state for sliders
    const [scanlineIntensity, setScanlineIntensity] = useState(0.1);
    const [bloomStrength, setBloomStrength] = useState(1);
    const [chromaticAberration, setChromaticAberration] = useState(1);

    // Accent color state
    const [selectedAccent, setSelectedAccent] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accentColor') || '#00ff41';
        }
        return '#00ff41';
    });

    // Apply accent color to CSS
    useEffect(() => {
        const color = ACCENT_COLORS.find(c => c.value === selectedAccent);
        if (color) {
            document.documentElement.style.setProperty('--accent', color.value);
            document.documentElement.style.setProperty('--accent-rgb', color.rgb);
            localStorage.setItem('accentColor', color.value);
        }
    }, [selectedAccent]);

    // Load saved accent on mount
    useEffect(() => {
        const saved = localStorage.getItem('accentColor');
        if (saved) {
            const color = ACCENT_COLORS.find(c => c.value === saved);
            if (color) {
                document.documentElement.style.setProperty('--accent', color.value);
                document.documentElement.style.setProperty('--accent-rgb', color.rgb);
            }
        }
    }, []);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    const handleAccentChange = (colorValue: string) => {
        playSound('click');
        setSelectedAccent(colorValue);
    };

    return (
        <div className="h-full bg-black/80 backdrop-blur-xl text-white p-4 md:p-6 select-none overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-3 mb-6 md:mb-8 pb-4 border-b border-white/10">
                <SettingsIcon size={24} className="text-accent animate-spin-slow" />
                <h1 className="text-lg md:text-xl font-bold tracking-widest">SYSTEM_CONFIG</h1>
            </div>

            <div className="space-y-6 md:space-y-8">
                {/* Theme Section */}
                <section>
                    <h2 className="flex items-center gap-2 text-sm font-bold text-accent mb-4 uppercase tracking-wider">
                        <Sun size={16} /> Appearance
                    </h2>

                    <div className="bg-white/5 p-4 rounded-lg border border-white/5 space-y-4">
                        {/* Theme Toggle */}
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <div className="text-white font-bold">THEME_MODE</div>
                                <div className="text-xs text-white/50">Switch between light and dark modes</div>
                            </div>
                            <button
                                onClick={() => {
                                    playSound('click');
                                    toggleTheme();
                                }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all
                                    ${theme === 'dark'
                                        ? 'bg-accent/20 border-accent text-accent'
                                        : 'bg-yellow-500/20 border-yellow-500 text-yellow-500'
                                    }
                                `}
                            >
                                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
                                <span className="text-xs font-bold uppercase">{theme}</span>
                            </button>
                        </div>
                    </div>
                </section>

                {/* Accent Color Section */}
                <section>
                    <h2 className="flex items-center gap-2 text-sm font-bold text-accent mb-4 uppercase tracking-wider">
                        <Palette size={16} /> Accent Color
                    </h2>

                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                            {ACCENT_COLORS.map((color) => (
                                <button
                                    key={color.value}
                                    onClick={() => handleAccentChange(color.value)}
                                    className={`
                                        w-full aspect-square rounded-xl border-2 transition-all
                                        hover:scale-110 active:scale-95
                                        ${selectedAccent === color.value
                                            ? 'border-white ring-2 ring-white/30 scale-110'
                                            : 'border-transparent'
                                        }
                                    `}
                                    style={{
                                        backgroundColor: color.value,
                                        boxShadow: selectedAccent === color.value
                                            ? `0 0 20px ${color.value}`
                                            : 'none'
                                    }}
                                    title={color.name}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-white/40 text-center mt-3">
                            {ACCENT_COLORS.find(c => c.value === selectedAccent)?.name || 'Custom'}
                        </p>
                    </div>
                </section>

                {/* Visuals Section */}
                <section>
                    <h2 className="flex items-center gap-2 text-sm font-bold text-accent mb-4 uppercase tracking-wider">
                        <Monitor size={16} /> Visual Processing
                    </h2>

                    <div className="space-y-4 bg-white/5 p-4 rounded-lg border border-white/5">
                        {/* Scanlines */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-white/70">
                                <span>SCANLINE_DENSITY</span>
                                <span>{(scanlineIntensity * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                value={scanlineIntensity}
                                onChange={(e) => setScanlineIntensity(parseFloat(e.target.value))}
                                className="w-full accent-accent h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* Bloom */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-white/70">
                                <span>BLOOM_THRESHOLD</span>
                                <span>{(bloomStrength * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="2" step="0.1"
                                value={bloomStrength}
                                onChange={(e) => setBloomStrength(parseFloat(e.target.value))}
                                className="w-full accent-accent h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>

                        {/* RGB Split */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-white/70">
                                <span>CHROMATIC_ABERRATION</span>
                                <span>{(chromaticAberration * 100).toFixed(0)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="5" step="0.5"
                                value={chromaticAberration}
                                onChange={(e) => setChromaticAberration(parseFloat(e.target.value))}
                                className="w-full accent-accent h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    </div>
                </section>

                {/* Audio Section */}
                <section>
                    <h2 className="flex items-center gap-2 text-sm font-bold text-accent mb-4 uppercase tracking-wider">
                        <Volume2 size={16} /> Audio Output
                    </h2>

                    <div className="bg-white/5 p-4 rounded-lg border border-white/5 flex items-center gap-4">
                        <button
                            onClick={toggleMute}
                            className={`p-3 rounded-full border transition-all min-w-[48px] min-h-[48px] flex items-center justify-center
                                ${isMuted ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-accent/20 border-accent text-accent'}
                            `}
                        >
                            <Volume2 size={20} />
                        </button>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between text-xs text-white/70">
                                <span>MASTER_VOL</span>
                                <span>{isMuted ? 'MUTED' : 'ACTIVE'}</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.05"
                                defaultValue="0.5"
                                onChange={handleVolumeChange}
                                disabled={isMuted}
                                className="w-full accent-accent h-2 bg-white/20 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
                            />
                        </div>
                    </div>
                </section>

                {/* Performance Section */}
                <section>
                    <h2 className="flex items-center gap-2 text-sm font-bold text-accent mb-4 uppercase tracking-wider">
                        <Zap size={16} /> Performance Override
                    </h2>

                    <div className="bg-white/5 p-4 rounded-lg border border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="text-sm">
                                <div className="text-white font-bold">OVERCLOCK_MODE</div>
                                <div className="text-xs text-white/50">Unlocks frame rate limiters. Warning: High GPU usage.</div>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" className="sr-only peer" />
                                <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Settings;
