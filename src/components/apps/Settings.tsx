import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Monitor, Volume2, Zap } from 'lucide-react';
import { useSound } from '@/context/SoundContext';

const Settings: React.FC = () => {
    const { playSound, isMuted, toggleMute, setVolume } = useSound();

    // Local state for sliders
    const [scanlineIntensity, setScanlineIntensity] = useState(0.1);
    const [bloomStrength, setBloomStrength] = useState(1);
    const [chromaticAberration, setChromaticAberration] = useState(1);
    const [crtCurvature, setCrtCurvature] = useState(0);

    // Effect to apply changes to CSS variables
    // Effect to apply changes to CSS variables
    useEffect(() => {
        // In a real implementation, we would update CSS variables here:
        // document.documentElement.style.setProperty('--scanline-intensity', scanlineIntensity.toString());
        // For now, these state values are placeholders for the visual logic.
    }, [scanlineIntensity, bloomStrength, chromaticAberration, crtCurvature]);

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setVolume(parseFloat(e.target.value));
    };

    return (
        <div className="h-full bg-black/80 backdrop-blur-xl text-white p-6 select-none overflow-y-auto custom-scrollbar">
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/10">
                <SettingsIcon size={24} className="text-accent animate-spin-slow" />
                <h1 className="text-xl font-bold tracking-widest">SYSTEM_CONFIG</h1>
            </div>

            <div className="space-y-8">
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
                                className="w-full accent-accent h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
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
                                className="w-full accent-accent h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
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
                                className="w-full accent-accent h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
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
                            className={`p-3 rounded-full border transition-all ${isMuted ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-accent/20 border-accent text-accent'}`}
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
                                className="w-full accent-accent h-1 bg-white/20 rounded-lg appearance-none cursor-pointer disabled:opacity-50"
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
