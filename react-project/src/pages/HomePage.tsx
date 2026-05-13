import React from 'react';
import { Header } from '../components/Header';
import { QuickAccessCard } from '../components/QuickAccessCard';
import { type MQTTData } from '../components/MQTTComponent';
import { useTemperatureUnit } from '../services/useTemperatureUnit';

interface HomePageProps {
  userName: string;
  onNavigate: (page: string) => void;
  mqttData: MQTTData;
}

export const HomePage: React.FC<HomePageProps> = ({ userName, onNavigate, mqttData }) => {
  const { formatTemperature } = useTemperatureUnit();

  const quickAccessCards = [
    { name: 'Security', icon: '🔒', color: 'danger', page: 'security' },
    { name: 'Climate', icon: '🌡️', color: 'info', page: 'climate' },
    { name: 'Weather', icon: '☁️', color: 'primary', page: 'weather' },
    { name: 'Lighting', icon: '💡', color: 'warning', page: 'lighting' },
    { name: 'Proximity', icon: '📡', color: 'success', page: 'proximity' }
  ]; 

  return (
    <div className="min-vh-100 bg-light" style={{ overflowX: 'hidden' }}>
      <Header onLogout={() => onNavigate('login')} />

      <div className="container-fluid px-2 px-sm-3 px-md-4 py-3 py-md-4" style={{ maxWidth: '100%' }}>
        {/* Welcome Section - Responsive */}
        <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center mb-3 mb-md-4 gap-2 gap-md-3">
          <div>
            <h3 className="fw-bold mb-1 fs-4 fs-md-3">Welcome back, {userName}!</h3>
            <p className="text-muted mb-0 small">Manage your smart home devices</p>
          </div>
          <div className="d-flex gap-2 w-100 w-lg-auto">
            <button
              className="btn btn-outline-secondary btn-sm btn-md-md flex-fill flex-lg-grow-0"
              onClick={() => onNavigate('settings')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="me-1 me-md-2 d-none d-sm-inline" style={{ verticalAlign: 'middle' }}>
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6"></path>
              </svg>
              Settings
            </button>
          </div>
        </div>

        {/* System Status Row - Full Width */}
        <div className="row g-2 g-md-3 g-lg-4 mb-3 mb-md-4">
          {/* MQTT Connection Status */}
          <div className="col-12 col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-3 py-md-4">
                <div className={`fs-3 fs-md-2 mb-2 ${mqttData.isConnected ? 'text-success' : 'text-danger'}`}>
                  {mqttData.isConnected ? '🟢' : '🔴'}
                </div>
                <h6 className="fw-bold mb-1">
                  {mqttData.isConnected ? 'Online' : 'Offline'}
                </h6>
                <small className="text-muted">
                  {mqttData.isConnected ? 'MQTT Connected' : 'Disconnected'}
                </small>
              </div>
            </div>
          </div>

          {/* Panic Button Status */}
          <div className="col-12 col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-3 py-md-4 d-flex flex-column justify-content-center">
                <div className={`fs-3 fs-md-2 mb-2 ${mqttData.button === 'pressed' ? 'text-danger' : 'text-secondary'}`}>
                  {mqttData.button === 'pressed' ? '🚨' : '⚠️'}
                </div>
                <h6 className="fw-bold mb-1">
                  {mqttData.button === 'pressed' ? 'PANIC ACTIVE' : 'Panic Button'}
                </h6>
                <small className={`${mqttData.button === 'pressed' ? 'text-danger fw-semibold' : 'text-muted'}`}>
                  {mqttData.button === 'pressed' ? 'Button pressed!' : 'Standby'}
                </small>
              </div>
            </div>
          </div>

          {/* Temperature */}
          <div className="col-12 col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-3 py-md-4">
                <div className="fs-3 fs-md-2 text-info mb-2">🌡️</div>
                <h6 className="fw-bold mb-1">{formatTemperature(mqttData.temperature)}</h6>
                <small className="text-muted">Temperature</small>
              </div>
            </div>
          </div>

          {/* Light Level */}
          <div className="col-12 col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center py-3 py-md-4">
                <div className={`fs-3 fs-md-2 mb-2 ${mqttData.darkness_led === 'on' ? 'text-warning' : 'text-secondary'}`}>
                  {mqttData.darkness_led === 'on' ? '🌙' : '☀️'}
                </div>
                <h6 className="fw-bold mb-1">{mqttData.ldr}</h6>
                <small className="text-muted">Light Level</small>
              </div>
            </div>
          </div>
        </div>

        {/* Active Systems Status */}
        <div className="card border-0 shadow-sm mb-3 mb-md-4">
          <div className="card-body py-3">
            <h6 className="fw-bold mb-3">Active Systems</h6>
            <div className="row g-2">
              {/* Fan Status */}
              <div className="col-6 col-md-3">
                <div className="d-flex align-items-center">
                  <span className="fs-4 me-2">🌀</span>
                  <div>
                    <small className="text-muted d-block">Fan</small>
                    <small className={`fw-semibold ${mqttData.fan_state !== 'off' ? 'text-success' : 'text-secondary'}`}>
                      {mqttData.fan_state !== 'off' ? mqttData.fan_state.toUpperCase() : 'OFF'}
                    </small>
                  </div>
                </div>
              </div>

              {/* Door Status */}
              <div className="col-6 col-md-3">
                <div className="d-flex align-items-center">
                  <span className="fs-4 me-2">🚪</span>
                  <div>
                    <small className="text-muted d-block">Door Status</small>
                    <small className={`fw-semibold ${mqttData.window_state === 'closed' ? 'text-success' : 'text-warning'}`}>
                      {mqttData.window_state === 'closed' ? 'CLOSED' : 'OPEN'}
                    </small>
                  </div>
                </div>
              </div>

              {/* Lights Status */}
              <div className="col-6 col-md-3">
                <div className="d-flex align-items-center">
                  <span className="fs-4 me-2">💡</span>
                  <div>
                    <small className="text-muted d-block">Lights</small>
                    <small className={`fw-semibold ${mqttData.darkness_led === 'on' ? 'text-warning' : 'text-secondary'}`}>
                      {mqttData.darkness_led === 'on' ? 'ON' : 'OFF'}
                    </small>
                  </div>
                </div>
              </div>

              {/* Alarm Status */}
              <div className="col-6 col-md-3">
                <div className="d-flex align-items-center">
                  <span className="fs-4 me-2">🔔</span>
                  <div>
                    <small className="text-muted d-block">Alarm</small>
                    <small className={`fw-semibold ${mqttData.buzzer_active === 'active' ? 'text-danger' : 'text-muted'}`}>
                      {mqttData.buzzer_active === 'active' ? 'ACTIVE' : 'QUIET'}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access Section - Responsive */}
        <div className="d-flex justify-content-between align-items-center mb-2 mb-md-3">
          <h5 className="fw-bold mb-0 fs-6 fs-md-5">Quick Access</h5>
        </div>
       
        {/* Cards Grid - Fully Responsive */}
        <div className="row g-2 g-md-3 g-lg-4">
          {quickAccessCards.map((card, index) => (
            <div key={index} className="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2">
              <QuickAccessCard
                name={card.name}
                icon={card.icon}
                color={card.color}
                onClick={() => {
                  if (['security', 'climate', 'weather', 'lighting', 'proximity'].includes(card.page)) {
                    onNavigate(card.page);
                  } else {
                    alert(`Navigation to ${card.name} page - Not implemented yet`);
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};