import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';

interface SoundContextType {
    playSound: (type: SoundType) => void;
    isMuted: boolean;
    toggleMute: () => void;
    setVolume: (volume: number) => void;
}

export type SoundType = 'boot' | 'click' | 'hover' | 'open' | 'close' | 'minimize' | 'error' | 'success' | 'typing';

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const useSound = () => {
    const context = useContext(SoundContext);
    if (!context) {
        throw new Error('useSound must be used within a SoundProvider');
    }
    return context;
};

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolumeState] = useState(0.5);
    const audioContextRef = useRef<AudioContext | null>(null);

    // Initialize Audio Context on user interaction (to bypass browser autoplay policies)
    const initAudioContext = useCallback(() => {
        if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (AudioContextClass) {
                audioContextRef.current = new AudioContext();
            }
        }
        if (audioContextRef.current?.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }, []);

    useEffect(() => {
        const handleInteraction = () => initAudioContext();
        window.addEventListener('click', handleInteraction);
        return () => window.removeEventListener('click', handleInteraction);
    }, [initAudioContext]);

    const toggleMute = () => setIsMuted((prev) => !prev);
    const setVolume = (vol: number) => setVolumeState(Math.max(0, Math.min(1, vol)));

    // Procedural Sound Generation Engines
    const createOscillator = (
        ctx: AudioContext,
        type: OscillatorType,
        freq: number,
        duration: number,
        vol: number = 0.1
    ) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        gainNode.gain.setValueAtTime(vol * volume, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + duration);
    };

    const playSound = useCallback((type: SoundType) => {
        if (isMuted || !audioContextRef.current) return;
        const ctx = audioContextRef.current;

        switch (type) {
            case 'click':
                // High pitched short blip
                createOscillator(ctx, 'sine', 800, 0.1, 0.1);
                break;

            case 'hover':
                // Very subtle high freq tick
                createOscillator(ctx, 'sine', 1200, 0.05, 0.02);
                break;

            case 'open':
                // Rising sci-fi sweep
                {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.frequency.setValueAtTime(200, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.3);
                    gain.gain.setValueAtTime(0.1 * volume, ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.3);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.3);
                }
                break;

            case 'close':
                // Falling sci-fi sweep
                {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.frequency.setValueAtTime(600, ctx.currentTime);
                    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
                    gain.gain.setValueAtTime(0.1 * volume, ctx.currentTime);
                    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.2);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start();
                    osc.stop(ctx.currentTime + 0.2);
                }
                break;

            case 'error':
                // Buzz sawtooth
                createOscillator(ctx, 'sawtooth', 150, 0.3, 0.15);
                break;

            case 'typing':
                // Random pitch click
                createOscillator(ctx, 'square', 600 + Math.random() * 200, 0.05, 0.05);
                break;

            case 'boot':
                // Complex boot sound
                setTimeout(() => createOscillator(ctx, 'sine', 100, 1.0, 0.2), 0);
                setTimeout(() => createOscillator(ctx, 'sine', 200, 1.0, 0.1), 200);
                setTimeout(() => createOscillator(ctx, 'square', 50, 2.0, 0.1), 500);
                break;

            case 'minimize':
                // Quick descending chirp
                createOscillator(ctx, 'triangle', 800, 0.1, 0.05);
                setTimeout(() => createOscillator(ctx, 'triangle', 400, 0.1, 0.05), 50);
                break;
        }
    }, [isMuted, volume]);

    return (
        <SoundContext.Provider value={{ playSound, isMuted, toggleMute, setVolume }}>
            {children}
        </SoundContext.Provider>
    );
};
