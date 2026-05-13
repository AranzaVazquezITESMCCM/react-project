// App.tsx
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { HomePage } from './pages/HomePage';
import { ClimateControl } from './pages/ClimateControl';
import { SecuritySystem } from './pages/SecuritySystem';
import { WeatherMonitoring } from './pages/WeatherMonitoring';
import LightingControlPage from './pages/LightControl';
import ProximityAlertPage from './pages/ProximityAlert';
import SettingsProfilePage from './pages/Settings';
import MQTTComponent, { type MQTTData } from './components/MQTTComponent';

export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [userName, setUserName] = useState('User');
  const [mqttData, setMqttData] = useState<MQTTData>({
    temperature: 24,
    pressure: 1013,
    rain: 0,
    ldr: 500,
    distance_vl53l0x: 100,
    distance_hcsr04: 100,
    window_state: 'open',
    fan_state: 'off',
    darkness_led: 'off',
    buzzer_active: 'quiet',
    button: 'released',
    isConnected: false,
  });

  const handleNavigate = (page: string, name: string = 'User') => {
    setCurrentPage(page);
    if (name !== 'User') {
      setUserName(name);
    }
  };

  const handleMQTTDataUpdate = (data: MQTTData) => {
    setMqttData(data);
  };

  return (
    <>
      {/* Componente MQTT activo en todas las páginas excepto login/register */}
      {currentPage !== 'login' && currentPage !== 'register' && (
        <MQTTComponent onDataUpdate={handleMQTTDataUpdate} />
      )}

      {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
      {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
      {currentPage === 'home' && (
        <HomePage 
          userName={userName} 
          onNavigate={handleNavigate}
          mqttData={mqttData}
        />
      )}
      {currentPage === 'climate' && (
        <ClimateControl 
          onBack={() => handleNavigate('home')}
          mqttData={mqttData}
        />
      )}
      {currentPage === 'security' && (
        <SecuritySystem 
          onBack={() => handleNavigate('home')}
          mqttData={mqttData}
        />
      )}
      {currentPage === 'weather' && (
        <WeatherMonitoring 
          onBack={() => handleNavigate('home')}
          mqttData={mqttData}
        />
      )}
      {currentPage === 'lighting' && (
        <LightingControlPage 
          onBack={() => handleNavigate('home')}
          mqttData={mqttData}
        />
      )}
      {currentPage === 'proximity' && (
        <ProximityAlertPage 
          onBack={() => handleNavigate('home')}
          mqttData={mqttData}
        />
      )}
      {currentPage === 'settings' && <SettingsProfilePage onBack={() => handleNavigate('home')} />}
    </>
  );
}