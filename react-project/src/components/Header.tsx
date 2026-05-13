import React from 'react';
import { Logo } from './Logo';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => (
  <div className="bg-white shadow-sm">
    <div className="container py-3">
      <div className="d-flex align-items-center justify-content-between">
        <Logo size="small" showText={true} />
        <button 
          className="btn btn-outline-secondary btn-sm"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  </div>
);
