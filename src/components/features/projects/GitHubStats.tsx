import React, { useState, useEffect } from 'react';
import { GitCommit, GitFork, Book } from 'lucide-react';

interface GitHubStatsProps {
  username: string;
  isVisible: boolean;
}

interface GitHubData {
  public_repos: number;
  followers: number;
  following: number;
  total_commits: number;
  total_forks: number;
  isLoading: boolean;
  error: string | null;
}

const GitHubStats: React.FC<GitHubStatsProps> = ({ username, isVisible }) => {
  const [data, setData] = useState<GitHubData>({
    public_repos: 0,
    followers: 0,
    following: 0,
    total_commits: 0,
    total_forks: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        const headers: HeadersInit = {
          'Accept': 'application/vnd.github.v3+json'
        };
        
        // Add token if available (increases rate limit from 60 to 5000/hour)
        const token = import.meta.env.VITE_GITHUB_TOKEN;
        if (token) {
          headers['Authorization'] = `token ${token}`;
        }

        // Fetch user data
        const userResponse = await fetch(`https://api.github.com/users/${username}`, { headers });
        if (userResponse.status === 403) throw new Error('Rate limited');
        if (!userResponse.ok) throw new Error('Failed to fetch user data');
        const userData = await userResponse.json();

        // Fetch repositories - just get basic info, skip commit counting to reduce API calls
        const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`, { headers });
        if (reposResponse.status === 403) throw new Error('Rate limited');
        if (!reposResponse.ok) throw new Error('Failed to fetch repos data');
        const reposData = await reposResponse.json();

        const totalForks = reposData.reduce((sum: number, repo: any) => sum + repo.forks_count, 0);
        const totalStars = reposData.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);

        setData({
          public_repos: userData.public_repos,
          followers: userData.followers,
          following: userData.following,
          total_commits: totalStars, // Use stars instead of commits to avoid extra API calls
          total_forks: totalForks,
          isLoading: false,
          error: null
        });
      } catch (error: any) {
        const message = error?.message === 'Rate limited'
          ? 'GitHub API rate-limited. Stats will reload soon!'
          : 'Unable to load stats right now';
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: message
        }));
      }
    };

    fetchGitHubData();
  }, [username]);

  const transition = 'transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]';
  const entrance = isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4';

  const stats = [
    { 
      label: 'Repositories', 
      value: data.public_repos, 
      icon: <Book className="w-4 h-4" />,
      color: '#f97316' 
    },
    { 
      label: 'Stars', 
      value: data.total_commits, 
      icon: <GitCommit className="w-4 h-4" />,
      color: '#eab308' 
    },
    { 
      label: 'Forks', 
      value: data.total_forks, 
      icon: <GitFork className="w-4 h-4" />,
      color: '#10b981' 
    },
  ];

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 ${transition} ${entrance}`}
      style={{ 
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid rgba(var(--accent-rgb), 0.15)',
        transitionDelay: isVisible ? '320ms' : '0ms'
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <p 
          className="text-[0.65rem] sm:text-xs uppercase tracking-[0.25em] font-medium"
          style={{ color: 'var(--text-secondary)' }}
        >
          <span style={{ color: 'var(--accent)' }}>▸</span> GitHub Activity
        </p>
        <a
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs hover:opacity-70 transition-opacity"
          style={{ color: 'var(--accent)' }}
        >
          @{username}
        </a>
      </div>
      
      {data.isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-t-transparent" 
               style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
          />
        </div>
      ) : data.error ? (
        <div className="p-3 rounded-xl text-center" style={{ backgroundColor: 'rgba(var(--accent-rgb),0.08)', color: 'var(--text-secondary)', border: '1px solid rgba(var(--accent-rgb),0.2)' }}>
          <p className="text-xs mb-2">{data.error}</p>
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold"
            style={{ color: 'var(--accent)' }}
          >
            View GitHub Profile →
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 text-center">
          {stats.map((stat, index) => (
            <div 
              key={stat.label}
              className={`${transition} ${entrance}`}
              style={{ transitionDelay: `${360 + index * 50}ms` }}
            >
              <div 
                className="flex items-center justify-center mb-2 opacity-60"
                style={{ color: stat.color }}
              >
                {stat.icon}
              </div>
              <p 
                className="text-xl sm:text-2xl font-bold"
                style={{ color: stat.color }}
              >
                {stat.value}
              </p>
              <p 
                className="text-[0.55rem] sm:text-[0.65rem] uppercase tracking-[0.2em] mt-1"
                style={{ color: 'var(--text-secondary)' }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GitHubStats;
