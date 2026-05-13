import React, { useState, useEffect } from 'react';
import { type MQTTData } from '../components/MQTTComponent';

interface LightControlPageProps {
  onBack?: () => void;
  mqttData: MQTTData;
}

const LightControlPage: React.FC<LightControlPageProps> = ({ onBack, mqttData }) => {
  const [lightStatus, setLightStatus] = useState<'ON' | 'OFF'>('OFF');

  // Actualizar estado del LED desde MQTT
  useEffect(() => {
    setLightStatus(mqttData.darkness_led === 'on' ? 'ON' : 'OFF');
  }, [mqttData.darkness_led]);

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
          <h3 className="fw-bold mb-1">Lighting Control</h3>
          <p className="text-muted mb-0">Manage light settings and brightness</p>
        </div>

        {/* Light Control */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body py-3 py-md-4">
            <h5 className="fw-bold mb-3 mb-md-4">Light Control</h5>
           
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center pb-3 border-bottom gap-2">
              <div className="d-flex align-items-center">
                <div className="fs-1 me-3">💡</div>
                <div>
                  <h6 className="mb-1">Light Status</h6>
                  <small className="text-muted">Auto-controlled by LDR sensor</small>
                </div>
              </div>
              <span
                className={`badge ${lightStatus === 'ON' ? 'bg-success' : 'bg-secondary'} fs-6 px-4 py-2`}
                style={{ maxWidth: '150px' }}
              >
                {lightStatus === 'ON' ? '✓ ON' : 'OFF'}
              </span>
            </div>
          </div>
        </div>

        {/* Light Sensor Data */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Light Sensor</h5>
            <div className="text-center py-4">
              <div className="display-4 fw-bold text-warning mb-2">{mqttData.ldr}</div>
              <p className="text-muted mb-0">lux (Light Level)</p>
            </div>
            <div className="progress" style={{ height: '10px' }}>
              <div
                className="progress-bar bg-warning"
                role="progressbar"
                style={{ width: `${(mqttData.ldr / 1000) * 100}%` }}
                aria-valuenow={mqttData.ldr}
                aria-valuemin={0}
                aria-valuemax={1000}
              ></div>
            </div>
          </div>
        </div>

        {/* Info Box Explanation */}
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <h5 className="fw-bold mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2" style={{ verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              Info Box Explanation
            </h5>
            <div className="alert alert-info mb-2">
              <strong>🌙 Night Mode:</strong> Lights turn ON when low light detected (night)
            </div>
            <div className="alert alert-warning mb-0">
              <strong>☀️ Day Mode:</strong> Lights turn OFF when high light detected (day)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LightControlPage;