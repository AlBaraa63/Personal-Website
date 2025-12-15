import React, { useState, useEffect, useRef } from 'react';
import { Palette, RotateCcw } from 'lucide-react';

interface ColorTheme {
  id: string;
  name: string;
  color: string;
  rgb: string;
}

const ColorThemeSelector: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState('#00ff41');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const presetThemes: ColorTheme[] = [
    { id: 'matrix-green', name: 'Matrix Green', color: '#00ff41', rgb: '0, 255, 65' },
    { id: 'cyber-blue', name: 'Cyber Blue', color: '#00d4ff', rgb: '0, 212, 255' },
    { id: 'purple-haze', name: 'Purple Haze', color: '#a855f7', rgb: '168, 85, 247' },
    { id: 'red-alert', name: 'Red Alert', color: '#ff0051', rgb: '255, 0, 81' },
    { id: 'orange-sunset', name: 'Orange Sunset', color: '#ff6b00', rgb: '255, 107, 0' },
    { id: 'golden-hour', name: 'Golden Hour', color: '#fbbf24', rgb: '251, 191, 36' },
    { id: 'pink-neon', name: 'Pink Neon', color: '#ff10f0', rgb: '255, 16, 240' },
    { id: 'mint-fresh', name: 'Mint Fresh', color: '#10ffcb', rgb: '16, 255, 203' },
  ];

  // Get current theme from localStorage or default
  const getCurrentTheme = (): string => {
    const isDark = document.documentElement.classList.contains('dark');
    return localStorage.getItem('accentColor') || (isDark ? '#00ff41' : '#007a1f');
  };

  const [activeColor, setActiveColor] = useState(getCurrentTheme());

  // Apply theme color
  const applyTheme = (color: string) => {
    const root = document.documentElement;
    const rgb = hexToRgb(color);
    
    if (rgb) {
      root.style.setProperty('--accent', color);
      root.style.setProperty('--accent-rgb', rgb);
      
      // Calculate hover color (slightly darker)
      const hoverColor = adjustBrightness(color, -20);
      root.style.setProperty('--accent-hover', hoverColor);
      
      // Save to localStorage
      localStorage.setItem('accentColor', color);
      setActiveColor(color);
    }
  };

  // Convert hex to RGB
  const hexToRgb = (hex: string): string | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : null;
  };

  // Adjust color brightness
  const adjustBrightness = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;
    return `#${(
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)}`;
  };

  // Reset to default theme
  const resetTheme = () => {
    const isDark = document.documentElement.classList.contains('dark');
    const defaultColor = isDark ? '#00ff41' : '#007a1f';
    applyTheme(defaultColor);
    setCustomColor(defaultColor);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Apply saved theme on mount
  useEffect(() => {
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
      applyTheme(savedColor);
      setCustomColor(savedColor);
    }
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg transition-all duration-300 hover:scale-110 active:scale-95 transform-gpu"
        style={{
          backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
          border: '1px solid rgba(var(--accent-rgb), 0.2)',
          color: 'var(--accent)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.15)';
          e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.1)';
          e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.2)';
        }}
        aria-label="Change color theme"
        title="Customize colors"
      >
        <Palette className="w-5 h-5" style={{ color: 'var(--accent)' }} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 mt-2 p-2 sm:p-4 rounded-lg sm:rounded-xl shadow-2xl border animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-lg"
          style={{
            backgroundColor: 'var(--bg-secondary)',
            borderColor: 'rgba(var(--accent-rgb), 0.2)',
            width: '240px',
            maxWidth: 'calc(100vw - 2rem)',
            zIndex: 9999,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(var(--accent-rgb), 0.15)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <h3 className="text-[10px] sm:text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
              Color Theme
            </h3>
            <button
              onClick={resetTheme}
              className="p-1 sm:p-1.5 rounded-md sm:rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
              }}
              title="Reset to default"
            >
              <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          {/* Preset Themes */}
          <div className="mb-2 sm:mb-3">
            <p className="text-[9px] sm:text-xs mb-1 sm:mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Quick Themes
            </p>
            <div className="grid grid-cols-4 gap-1 sm:gap-2">
              {presetThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    applyTheme(theme.color);
                    setCustomColor(theme.color);
                  }}
                  className="relative w-full aspect-square rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 transform-gpu"
                  style={{
                    backgroundColor: theme.color,
                    border: activeColor.toLowerCase() === theme.color.toLowerCase()
                      ? '3px solid var(--text-primary)'
                      : '2px solid transparent',
                    boxShadow: `0 4px 12px ${theme.color}40`,
                  }}
                  title={theme.name}
                >
                  {activeColor.toLowerCase() === theme.color.toLowerCase() && (
                    <div
                      className="absolute inset-0 flex items-center justify-center text-white font-bold text-sm sm:text-xl"
                      style={{ textShadow: '0 0 4px rgba(0,0,0,0.8)' }}
                    >
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Picker */}
          <div>
            <p className="text-[9px] sm:text-xs mb-1 sm:mb-1.5" style={{ color: 'var(--text-secondary)' }}>
              Custom Color
            </p>
            <div className="flex items-center gap-1 sm:gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  applyTheme(e.target.value);
                }}
                className="w-8 h-8 sm:w-12 sm:h-12 rounded-md sm:rounded-lg cursor-pointer border transition-all duration-200 hover:scale-110"
                style={{
                  borderColor: 'var(--border)',
                  backgroundColor: 'var(--bg-secondary)',
                }}
              />
              <div className="flex-1">
                <input
                  type="text"
                  value={customColor.toUpperCase()}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^#[0-9A-F]{6}$/i.test(value)) {
                      setCustomColor(value);
                      applyTheme(value);
                    } else {
                      setCustomColor(value);
                    }
                  }}
                  className="w-full px-1.5 sm:px-3 py-1 sm:py-2 rounded-md sm:rounded-lg text-[10px] sm:text-sm font-mono border transition-all duration-200"
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderColor: 'var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="#00FF41"
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          {/* Info Text */}
          <p className="text-[9px] sm:text-xs mt-2 sm:mt-3 text-center" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            Your preference is saved locally
          </p>
        </div>
      )}
    </div>
  );
};

export default ColorThemeSelector;
