import React from 'react';

const Spinner = ({ size = 'md', className = '' }) => {
  const pixelSize = size === 'sm' ? 16 : size === 'lg' ? 32 : 22;

  return (
    <svg
      className={`ui-spinner ${className}`}
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ animation: 'spin 0.8s linear infinite' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="var(--border-color)"
        strokeWidth="3"
      />
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
};

export default Spinner;
