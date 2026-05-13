import React, { useState, useEffect } from 'react';
import { type MQTTData } from '../components/MQTTComponent';

interface WeatherMonitoringProps {
  onBack?: () => void;
  mqttData: MQTTData;
}

type RainStatus = 'Dry' | 'Light Rain' | 'Heavy Rain';

export const WeatherMonitoring: React.FC<WeatherMonitoringProps> = ({ onBack, mqttData }) => {
  const [alertStatus, setAlertStatus] = useState<string>('All Clear');
  const [rainStatus, setRainStatus] = useState<RainStatus>('Dry');
  const [oledMessage, setOledMessage] = useState<string>('Normal conditions');

  // Actualizar estado de lluvia desde MQTT
  useEffect(() => {
    if (mqttData.rain > 50) {
      setRainStatus('Heavy Rain');
      setAlertStatus('Storm Warning');
      setOledMessage('Heavy rain detected!');
    } else if (mqttData.rain > 15) {
      setRainStatus('Light Rain');
      setAlertStatus('Rain Detected');
      setOledMessage('Light rain detected');
    } else {
      setRainStatus('Dry');
      setAlertStatus('All Clear');
      setOledMessage('Normal conditions');
    }
  }, [mqttData.rain]);

  const getRainStatusColor = (): string => {
    if (rainStatus === 'Heavy Rain') return 'danger';
    if (rainStatus === 'Light Rain') return 'warning';
    return 'success';
  };

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
          <h3 className="fw-bold mb-1">Weather Monitoring</h3>
          <p className="text-muted mb-0">Track weather conditions and alerts</p>
        </div>

        {/* Alert Banner */}
        <div className={`alert ${alertStatus === 'Storm Warning' ? 'alert-danger' : alertStatus === 'Rain Detected' ? 'alert-warning' : 'alert-success'} mb-3 mb-md-4`} role="alert">
          <h5 className="alert-heading mb-0">
            {alertStatus === 'All Clear' ? '✓ ' : '⚠️ '}
            {alertStatus}
          </h5>
        </div>

        {/* Rain Sensor Section */}
        <div className="row g-3 g-md-4 mb-3 mb-md-4">
          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-4 py-md-5">
                <div className="fs-1 mb-3">🌧️</div>
                <h5 className="fw-bold mb-3">Rain Sensor</h5>
                <div
                  className={`badge bg-${getRainStatusColor()} fs-5 px-4 py-3 mb-3`}
                >
                  {rainStatus}
                </div>
                <p className="text-muted small mb-2">Wetness: {mqttData.rain}%</p>
                <p className="text-muted small mb-0">Reading from Arduino sensor</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body py-3 py-md-4">
                <h5 className="fw-bold mb-3 mb-md-4">Door Control</h5>
               
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 mb-md-4 pb-3 border-bottom gap-2">
                  <div>
                    <h6 className="mb-1">Door Status</h6>
                    <small className="text-muted">Auto-close on rain</small>
                  </div>
                  <button
                    className={`btn ${mqttData.window_state === 'closed' ? 'btn-success' : 'btn-warning'} px-4 w-100 w-sm-auto`}
                    style={{ maxWidth: '150px' }}
                    disabled
                  >
                    {mqttData.window_state === 'closed' ? '🔒 Closed' : '🚪 Open'}
                  </button>
                </div>

                <div className={`alert ${mqttData.window_state === 'open' && mqttData.rain > 15 ? 'alert-warning' : 'alert-info'} mb-0`}>
                  <small>
                    {mqttData.window_state === 'open' && mqttData.rain > 15
                      ? '⚠️ Close door during rain!'
                      : '✓ Door status is optimal'}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Pressure & Display Section */}
        <div className="row g-3 g-md-4 mb-3">
          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-4 py-md-5">
                <h5 className="text-muted mb-3">Atmospheric Pressure</h5>
                <div className="display-4 fw-bold text-primary mb-2">
                  {mqttData.pressure.toFixed(1)} hPa
                </div>
                <small className="text-muted">Hectopascals</small>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="card border-0 shadow-sm bg-dark text-white h-100">
              <div className="card-body py-4 py-md-5 d-flex flex-column justify-content-center">
                <h6 className="text-white-50 mb-3 text-center">OLED DISPLAY</h6>
                <div className="text-center">
                  <div className="border border-secondary rounded p-3 p-md-4">
                    <code className="text-white fs-6 fs-md-5">{oledMessage}</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Weather Stats */}
        <div className="row g-2 g-md-3">
          <div className="col-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-3">
                <div className="fs-4 mb-2">💧</div>
                <small className="text-muted">Rain Level</small>
                <div className="fw-bold">{mqttData.rain}%</div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-3">
                <div className="fs-4 mb-2">🌡️</div>
                <small className="text-muted">Temperature</small>
                <div className="fw-bold">{mqttData.temperature.toFixed(1)}°C</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};