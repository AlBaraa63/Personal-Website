import { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.setState({ errorInfo });

    // Log error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Replace with your error monitoring service
      console.error('Production error:', { error, errorInfo });
    }
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center px-4" 
             style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="text-center max-w-md mx-auto">
            <div className="mb-8 flex justify-center">
              <AlertTriangle 
                className="w-20 h-20 text-red-500 animate-pulse"
                style={{ 
                  filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.5))' 
                }}
              />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold mb-4" 
                style={{ color: 'var(--text-primary)' }}>
              Oops! Something went wrong
            </h2>
            
            <p className="text-lg mb-8" 
               style={{ color: 'var(--text-secondary)' }}>
              The application encountered an unexpected error. Don't worry, it's not your fault!
            </p>

            <div className="space-y-4">
              <button
                onClick={this.handleRefresh}
                className="w-full px-6 py-3 rounded-lg border-2 font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  borderColor: 'var(--accent)',
                  color: 'var(--accent)',
                  backgroundColor: 'transparent'
                }}
              >
                Refresh Page
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: 'var(--accent)',
                  color: '#ffffff'
                }}
              >
                Go to Home
              </button>
            </div>

            {/* Error details in development */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left">
                <summary className="cursor-pointer text-sm font-semibold mb-2" 
                         style={{ color: 'var(--accent)' }}>
                  Error Details (Development Only)
                </summary>
                <div className="p-4 rounded-lg overflow-auto max-h-60 text-xs font-mono"
                     style={{ 
                       backgroundColor: 'var(--bg-secondary)',
                       color: 'var(--text-secondary)' 
                     }}>
                  <div className="mb-2">
                    <strong style={{ color: 'var(--accent)' }}>Error:</strong>
                    <pre className="whitespace-pre-wrap break-words mt-1">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong style={{ color: 'var(--accent)' }}>Stack Trace:</strong>
                      <pre className="whitespace-pre-wrap break-words mt-1">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
