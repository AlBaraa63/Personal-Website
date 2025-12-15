import React, { useState, useEffect } from 'react';
import { GitCommit } from 'lucide-react';

const GitHubStreak: React.FC = () => {
  const [streak, setStreak] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchGitHubStreak = async () => {
      try {
        const username = 'AlBaraa-1';
        
        // Fetch contribution calendar data from GitHub's public API
        const response = await fetch(
          `https://github-contributions-api.jogruber.de/v4/${username}?y=last`,
          { 
            signal: AbortSignal.timeout(5000) // 5 second timeout
          }
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch GitHub data');
        }

        const data = await response.json();
        
        // Calculate current streak from contributions
        let currentStreak = 0;
        const contributions = data.contributions;
        
        // Start from today and go backwards
        for (let i = contributions.length - 1; i >= 0; i--) {
          if (contributions[i].count > 0) {
            currentStreak++;
          } else {
            // Check if it's today (allow today to have 0 commits)
            const contributionDate = new Date(contributions[i].date);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            contributionDate.setHours(0, 0, 0, 0);
            
            if (contributionDate.getTime() === today.getTime()) {
              continue; // Skip today if no commits yet
            }
            break; // End of streak
          }
        }
        
        setStreak(currentStreak);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching GitHub streak:', err);
        setError(true);
        setIsLoading(false);
        // Set to 0 if we can't fetch
        setStreak(0);
      }
    };

    fetchGitHubStreak();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300"
           style={{
             backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
             border: '1px solid rgba(var(--accent-rgb), 0.2)',
             opacity: 0.7
           }}>
        <GitCommit className="w-4 h-4 animate-pulse" style={{ color: 'var(--accent)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>
          ...
        </span>
      </div>
    );
  }

  return (
    <div 
      className="group flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-110 cursor-pointer"
      style={{
        backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
        border: '1px solid rgba(var(--accent-rgb), 0.2)',
      }}
      title={streak ? `${streak} day commit streak on GitHub` : 'GitHub streak unavailable'}
      onClick={() => window.open('https://github.com/AlBaraa-1', '_blank')}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.15)';
        e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(var(--accent-rgb), 0.1)';
        e.currentTarget.style.borderColor = 'rgba(var(--accent-rgb), 0.2)';
      }}
    >
      <GitCommit 
        className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all duration-300 group-hover:rotate-12" 
        style={{ color: 'var(--accent)' }} 
      />
      <span className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>
        {streak !== null && streak !== undefined ? streak : '-'}
      </span>
      <span className="text-xs hidden sm:inline" style={{ color: 'var(--text-secondary)' }}>
        day{streak !== 1 ? 's' : ''}
      </span>
      <span className="text-[10px] sm:text-xs" style={{ color: 'var(--accent)' }}>
        🔥
      </span>
    </div>
  );
};

export default GitHubStreak;
