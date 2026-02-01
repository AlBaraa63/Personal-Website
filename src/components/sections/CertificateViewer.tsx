import React, { useEffect } from 'react';
import { X, Download, ExternalLink } from 'lucide-react';

interface CertificateViewerProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: {
    title: string;
    issuer: string;
    date: string;
    imagePath?: string;
    pdfPath?: string;
    externalLink?: string;
  };
}

const CertificateViewer: React.FC<CertificateViewerProps> = ({ isOpen, onClose, certificate }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const hasLocalFile = certificate.imagePath || certificate.pdfPath;
  const isPdf = certificate.pdfPath && !certificate.imagePath;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
      style={{ cursor: 'zoom-out' }}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[95vh] sm:max-h-[90vh] flex flex-col rounded-lg sm:rounded-xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
        style={{ cursor: 'default', backgroundColor: 'var(--bg-primary)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-2 sm:p-3 md:p-4 border-b flex-shrink-0" style={{ borderColor: 'var(--accent)', backgroundColor: 'rgba(var(--accent-rgb), 0.1)' }}>
          <div className="flex-1 min-w-0 mr-2">
            <h3 className="text-sm sm:text-base md:text-lg font-bold line-clamp-1" style={{ color: 'var(--accent)' }}>
              {certificate.title}
            </h3>
            <p className="text-xs sm:text-sm line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
              {certificate.issuer} • {certificate.date}
            </p>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {hasLocalFile && (
              <a
                href={certificate.pdfPath || certificate.imagePath}
                download
                className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.2)', color: 'var(--accent)' }}
                aria-label="Download certificate"
                title="Download"
              >
                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
            {certificate.externalLink && certificate.externalLink !== '#' && (
              <a
                href={certificate.externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.2)', color: 'var(--accent)' }}
                aria-label="View on external site"
                title="View Original"
              >
                <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
              </a>
            )}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-110 hover:rotate-90"
              style={{ backgroundColor: 'rgba(255, 0, 0, 0.2)', color: '#ff4444' }}
              aria-label="Close viewer"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex-1 overflow-hidden" style={{ backgroundColor: '#1a1a1a' }}>
          <div className="w-full h-full overflow-auto">
            {isPdf ? (
              <div className="w-full h-full min-h-[400px] sm:min-h-[500px] md:min-h-[600px]">
                <iframe
                  src={`${certificate.pdfPath}#toolbar=0&navpanes=0&scrollbar=0&view=Fit`}
                  className="w-full h-full border-0"
                  style={{ minHeight: 'inherit' }}
                  title={certificate.title}
                />
              </div>
            ) : certificate.imagePath ? (
              <div className="w-full h-full flex items-center justify-center p-2 sm:p-4">
                <img
                  src={certificate.imagePath}
                  alt={certificate.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-4 sm:p-6">
                <div className="text-center">
                  <p className="text-sm sm:text-base md:text-lg mb-4" style={{ color: 'var(--text-secondary)' }}>
                    This certificate is hosted externally
                  </p>
                  {certificate.externalLink && certificate.externalLink !== '#' && (
                    <a
                      href={certificate.externalLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg text-sm sm:text-base"
                      style={{ 
                        backgroundColor: 'var(--accent)',
                        color: 'var(--bg-primary)',
                        boxShadow: '0 4px 20px rgba(var(--accent-rgb), 0.4)'
                      }}
                    >
                      <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5" />
                      View Certificate
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateViewer;
