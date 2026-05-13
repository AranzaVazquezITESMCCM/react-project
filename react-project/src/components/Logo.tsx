import React from 'react';

interface LogoProps {
  size?: 'small' | 'large';
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ size = 'large', showText = true }) => {
  const isSmall = size === 'small';
  
  return (
    <div className={`d-flex align-items-center gap-2 ${!showText ? 'justify-content-center' : ''}`}>
      {isSmall ? (
        <span style={{ fontSize: '32px', lineHeight: '1' }}>🏠</span>
      ) : (
        <div className="text-center">
          <div className="d-inline-block p-3 bg-primary bg-opacity-10 rounded-circle">
            <span style={{ fontSize: '60px' }}>🏠</span>
          </div>
          {showText && <h2 className="mt-3 fw-bold text-primary">SmartHome</h2>}
        </div>
      )}
      {isSmall && showText && (
        <span className="fs-5 fw-bold text-primary">SmartHome</span>
      )}
    </div>
  );
};