import React from 'react';

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => (
  <button 
    className="btn btn-link text-decoration-none p-0 mb-3"
    onClick={onClick}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
    <span className="ms-2">Back</span>
  </button>
);