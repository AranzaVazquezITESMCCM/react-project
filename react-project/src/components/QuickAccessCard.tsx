import React from 'react';

interface QuickAccessCardProps {
  name: string;
  icon: string;
  color: string;
  onClick: () => void;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ name, icon, color, onClick }) => (
  <div 
    className="card border-0 shadow-sm h-100"
    onClick={onClick}
    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div className="card-body text-center">
      <div className="fs-1 mb-2">{icon}</div>
      <h6 className="fw-bold mb-0">{name}</h6>
      <small className={`text-${color}`}>Tap to control</small>
    </div>
  </div>
);