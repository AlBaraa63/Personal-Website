import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="group relative p-2 rounded-lg transition-all duration-300 hover:scale-110 focus:outline-none"
      style={{
        backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
        border: '1px solid rgba(var(--accent-rgb), 0.2)',
        color: 'var(--accent)'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.15)';
        e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.1)';
        e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.2)';
      }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {/* Icon with smooth rotation */}
      <div className="relative w-5 h-5">
        {theme === 'dark' ? (
          <Moon 
            className="w-5 h-5 transition-all duration-500 rotate-0" 
            style={{ color: 'var(--accent)' }} 
          />
        ) : (
          <Sun 
            className="w-5 h-5 transition-all duration-500 rotate-180" 
            style={{ color: 'var(--accent)' }} 
          />
        )}
      </div>

      {/* Minimal tooltip */}
      <div className="absolute -bottom-9 left-1/2 -translate-x-1/2 px-2 py-1 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap"
           style={{ 
             backgroundColor: 'var(--bg-secondary)', 
             color: 'var(--text-primary)',
             border: '1px solid var(--border)'
           }}>
        {theme === 'dark' ? 'Light' : 'Dark'}
      </div>
    </button>
  );
};

export default ThemeToggle;