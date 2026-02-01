import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Loader2 
        className={`animate-spin ${sizeClasses[size]}`}
        style={{ color: 'var(--accent)' }}
      />
      {text && (
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {text}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;