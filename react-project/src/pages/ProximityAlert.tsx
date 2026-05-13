import React, { useState, useEffect } from 'react';
import { type MQTTData } from '../components/MQTTComponent';

interface ProximityAlertPageProps {
  onBack?: () => void;
  mqttData: MQTTData;
}

const ProximityAlertPage: React.FC<ProximityAlertPageProps> = ({ onBack, mqttData }) => {
  const [distance, setDistance] = useState<number>(45);
  const [buzzerStatus, setBuzzerStatus] = useState<'Silent' | 'Sounding'>('Silent');

  // Actualizar distancia desde MQTT (usando HC-SR04)
  useEffect(() => {
    if (mqttData.distance_hcsr04 > 0) {
      setDistance(Math.round(mqttData.distance_hcsr04));
    }
  }, [mqttData.distance_hcsr04]);

  // Actualizar estado del buzzer desde MQTT
  useEffect(() => {
    setBuzzerStatus(mqttData.buzzer_active === 'active' ? 'Sounding' : 'Silent');
  }, [mqttData.buzzer_active]);

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
          <h3 className="fw-bold mb-1">Proximity System</h3>
          <p className="text-muted mb-0">Monitor distance and alert status</p>
        </div>

        {/* Distance Display */}
        <div className="row g-3 g-md-4 mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-4 py-md-5" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                <h5 className="fw-bold text-white mb-3">Current Distance</h5>
                <div className="display-1 fw-bold text-white mb-2">{distance}</div>
                <p className="text-white fs-5 mb-0">cm</p>
                <p className="text-white small mt-3 mb-0 opacity-75">
                  Reading from HC-SR04 ultrasonic sensor
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sensor Data Cards */}
        <div className="row g-3 g-md-4 mb-4">
          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-4">
                <h6 className="text-muted mb-3">HC-SR04 Sensor</h6>
                <div className="display-4 fw-bold text-primary mb-2">
                  {mqttData.distance_hcsr04.toFixed(1)}
                </div>
                <p className="text-muted mb-0">cm</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-4">
                <h6 className="text-muted mb-3">VL53L0X Sensor</h6>
                <div className="display-4 fw-bold text-info mb-2">
                  {mqttData.distance_vl53l0x > 0 ? mqttData.distance_vl53l0x.toFixed(1) : 'N/A'}
                </div>
                <p className="text-muted mb-0">cm</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buzzer Status */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body py-3 py-md-4">
            <h5 className="fw-bold mb-3 mb-md-4">Buzzer Status</h5>
           
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center pb-3 border-bottom gap-2">
              <div className="d-flex align-items-center">
                <div className="fs-1 me-3">🔊</div>
                <div>
                  <h6 className="mb-1">Alarm</h6>
                  <small className="text-muted">Auto-activated when object within 10cm</small>
                </div>
              </div>
              <span
                className={`badge ${buzzerStatus === 'Sounding' ? 'bg-danger' : 'bg-secondary'} fs-6 px-4 py-2`}
                style={{ maxWidth: '150px' }}
              >
                {buzzerStatus === 'Sounding' ? '⚠️ SOUNDING' : 'Silent'}
              </span>
            </div>

            {buzzerStatus === 'Sounding' && (
              <div className="alert alert-danger mt-3 mb-0 d-flex align-items-center">
                <div className="spinner-grow spinner-grow-sm text-danger me-3" role="status">
                  <span className="visually-hidden">Alert...</span>
                </div>
                <strong>Warning:</strong>&nbsp;Object detected within alert range!
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="card border-0 shadow-sm border-start border-warning border-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-2" style={{ verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="10"/>
                <path d="M12 16v-4M12 8h.01"/>
              </svg>
              System Information
            </h5>
            <div className="alert alert-warning mb-2">
              <strong>⚠️ Alert Threshold:</strong> Buzzer activates when BOTH sensors detect object within <strong>10cm</strong>
            </div>
            <div className="alert alert-info mb-0">
              <strong>ℹ️ Dual Sensor System:</strong> Uses both HC-SR04 (ultrasonic) and VL53L0X (laser) for accurate detection
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProximityAlertPage;