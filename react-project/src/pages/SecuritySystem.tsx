import React, { useState, useEffect } from 'react';
import { type MQTTData } from '../components/MQTTComponent';

interface SecuritySystemProps {
  onBack?: () => void;
  mqttData: MQTTData;
}

export const SecuritySystem: React.FC<SecuritySystemProps> = ({ onBack, mqttData }) => {
  const [panicActive, setPanicActive] = useState<boolean>(false);

  // Actualizar estado del botón de pánico desde MQTT
  useEffect(() => {
    setPanicActive(mqttData.button === 'pressed');
  }, [mqttData.button]);

  return (
    <div className="min-vh-100 bg-light">
      <div className="container-fluid px-3 px-md-4 py-4" style={{ maxWidth: '1200px' }}>
        {/* Page Title */}
        <div className="mb-4">
          <button
            onClick={onBack}
            className="btn btn-outline-secondary mb-3"
          >
            ← Back to Home
          </button>
          <h3 className="fw-bold mb-1">Security System</h3>
          <p className="text-muted mb-0">Monitor your home security status</p>
        </div>

        {/* Panic Button Status */}
        <div className="row g-3 g-md-4 mb-4">
          <div className="col-12">
            <div className={`card border-0 shadow-sm ${panicActive ? 'border-danger border-3' : ''}`}>
              <div className="card-body text-center py-4 py-md-5">
                <h5 className="text-muted mb-3">Panic Button Status</h5>
                <div className={`fs-1 mb-3 ${panicActive ? 'text-danger' : 'text-secondary'}`}>
                  {panicActive ? '🚨' : '⚠️'}
                </div>
                <div
                  className={`badge ${panicActive ? 'bg-danger' : 'bg-secondary'} fs-5 fs-md-4 px-4 py-3 mb-3`}
                >
                  {panicActive ? '🚨 PANIC ACTIVE!' : '⚠️ Standby'}
                </div>
                <p className="text-muted small mb-0">
                  {panicActive ? 'Emergency button is pressed!' : 'No emergency detected'}
                </p>
                {panicActive && (
                  <div className="mt-3">
                    <div className="spinner-grow spinner-grow-sm text-danger me-2" role="status">
                      <span className="visually-hidden">Alert...</span>
                    </div>
                    <span className="text-danger fw-semibold">Alert Active</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="row g-3 mb-4">
          <div className="col-6 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-3 py-md-4">
                <div className="fs-2 fs-md-3 mb-2">🪟</div>
                <h6 className="fw-bold mb-1 fs-6 fs-md-5">Door</h6>
                <small className={mqttData.window_state === 'closed' ? 'text-success' : 'text-warning'}>
                  {mqttData.window_state === 'closed' ? '✓ Locked' : 'Open'}
                </small>
              </div>
            </div>
          </div>
          <div className="col-6 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-3 py-md-4">
                <div className="fs-2 fs-md-3 mb-2">🔔</div>
                <h6 className="fw-bold mb-1 fs-6 fs-md-5">Alarms</h6>
                <small className={mqttData.buzzer_active === 'active' ? 'text-danger' : 'text-muted'}>
                  {mqttData.buzzer_active === 'active' ? '⚠️ Active' : 'Standby'}
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Status */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="fw-bold mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2" style={{ verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              Security Status Details
            </h5>
            
            <div className="d-flex flex-column gap-3">
              {/* Panic Button */}
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                <div className="d-flex align-items-center">
                  <div className="fs-3 me-3">🆘</div>
                  <div>
                    <h6 className="mb-0">Panic Button</h6>
                    <small className="text-muted">Physical emergency button</small>
                  </div>
                </div>
                <span className={`badge ${panicActive ? 'bg-danger' : 'bg-secondary'} fs-6 px-3 py-2`}>
                  {panicActive ? 'PRESSED' : 'Released'}
                </span>
              </div>

              {/* Door */}
              <div className="d-flex justify-content-between align-items-center pb-3 border-bottom">
                <div className="d-flex align-items-center">
                  <div className="fs-3 me-3">🚪</div>
                  <div>
                    <h6 className="mb-0">Door Security</h6>
                    <small className="text-muted">Auto-controlled by rain sensor</small>
                  </div>
                </div>
                <span className={`badge ${mqttData.window_state === 'closed' ? 'bg-success' : 'bg-warning'} fs-6 px-3 py-2`}>
                  {mqttData.window_state === 'closed' ? '✓ Locked' : 'Open'}
                </span>
              </div>

              {/* Buzzer */}
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <div className="fs-3 me-3">🔔</div>
                  <div>
                    <h6 className="mb-0">Alarm System</h6>
                    <small className="text-muted">Proximity-based alert</small>
                  </div>
                </div>
                <span className={`badge ${mqttData.buzzer_active === 'active' ? 'bg-danger' : 'bg-secondary'} fs-6 px-3 py-2`}>
                  {mqttData.buzzer_active === 'active' ? '⚠️ Sounding' : 'Quiet'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};