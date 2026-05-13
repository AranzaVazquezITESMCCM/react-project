import React, { useState, useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { type MQTTData } from '../components/MQTTComponent';
import { useTemperatureUnit } from '../services/useTemperatureUnit';

Chart.register(...registerables);

interface ClimateControlProps {
  onBack?: () => void;
  mqttData: MQTTData;
}

type FanSpeed = 'LOW' | 'MEDIUM' | 'HIGH' | '';
type FanStatus = 'ON' | 'OFF';

export const ClimateControl: React.FC<ClimateControlProps> = ({ onBack, mqttData }) => {
  const [temperature, setTemperature] = useState<number>(24);
  const [fanStatus, setFanStatus] = useState<FanStatus>('OFF');
  const [fanSpeed, setFanSpeed] = useState<FanSpeed>('');
  const [temperatureHistory, setTemperatureHistory] = useState<{ time: string; temp: number }[]>([]);
  
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstanceRef = useRef<Chart | null>(null);

  // Hook para unidades de temperatura
  const { tempUnit, formatTemperature, convertTemperature } = useTemperatureUnit();

  // Actualizar temperatura desde MQTT
  useEffect(() => {
    if (mqttData.temperature !== temperature) {
      setTemperature(mqttData.temperature);
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      
      setTemperatureHistory(prev => {
        const updated = [...prev, { time: timeString, temp: mqttData.temperature }];
        return updated.slice(-20);
      });
    }
  }, [mqttData.temperature]);

  // Actualizar estado del ventilador desde MQTT
  useEffect(() => {
    const fanState = mqttData.fan_state.toLowerCase();
    if (fanState === 'off') {
      setFanStatus('OFF');
      setFanSpeed('');
    } else {
      setFanStatus('ON');
      setFanSpeed(fanState.toUpperCase() as FanSpeed);
    }
  }, [mqttData.fan_state]);

  // Initialize and update chart
  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    // Convertir temperaturas para el gráfico
    const convertedData = temperatureHistory.map(item => convertTemperature(item.temp));
    const unit = tempUnit === 'Celsius' ? '°C' : '°F';

    // Create new chart
    chartInstanceRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: temperatureHistory.map(item => item.time),
        datasets: [{
          label: `Temperature (${unit})`,
          data: convertedData,
          borderColor: 'rgb(13, 110, 253)',
          backgroundColor: 'rgba(13, 110, 253, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointHoverRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top'
          },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            min: tempUnit === 'Celsius' ? 15 : 59,
            max: tempUnit === 'Celsius' ? 35 : 95,
            title: {
              display: true,
              text: `Temperature (${unit})`
            }
          },
          x: {
            title: {
              display: true,
              text: 'Time'
            },
            ticks: {
              maxRotation: 45,
              minRotation: 45
            }
          }
        }
      }
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [temperatureHistory, tempUnit, convertTemperature]);

  const getTemperatureStatus = (): string => {
    if (temperature >= 28) return 'Hot';
    if (temperature >= 20 && temperature < 28) return 'Comfortable';
    return 'Cold';
  };

  const getStatusColor = (): string => {
    if (temperature >= 28) return 'danger';
    if (temperature >= 20 && temperature < 28) return 'success';
    return 'info';
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
          <h3 className="fw-bold mb-1">Climate Control</h3>
          <p className="text-muted mb-0">Monitor temperature and fan settings</p>
        </div>

        {/* Temperature Display */}
        <div className="row g-3 g-md-4 mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body text-center py-4 py-md-5">
                <h5 className="text-muted mb-3">Current Temperature</h5>
                <div className="display-1 fw-bold text-primary mb-3">
                  {formatTemperature(temperature)}
                </div>
                <span className={`badge bg-${getStatusColor()} fs-5 px-4 py-2`}>
                  {getTemperatureStatus()}
                </span>
                <p className="text-muted small mt-3 mb-0">
                  Reading from BME280 sensor
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Temperature Chart */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <h5 className="fw-bold mb-3">Temperature History</h5>
            <p className="text-muted small mb-3">
              Real-time temperature readings from MQTT session
              <span className="badge bg-secondary ms-2">{tempUnit}</span>
            </p>
            <div style={{ height: '300px', position: 'relative' }}>
              <canvas ref={chartRef}></canvas>
            </div>
          </div>
        </div>

        {/* Fan Control - Read Only Status */}
        <div className="card border-0 shadow-sm">
          <div className="card-body py-3 py-md-4">
            <h5 className="fw-bold mb-3 mb-md-4">Fan Status</h5>
           
            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 mb-md-4 pb-3 border-bottom gap-2">
              <div className="d-flex align-items-center">
                <div className="fs-1 me-3">🌀</div>
                <div>
                  <h6 className="mb-1">Fan</h6>
                  <small className="text-muted">Auto-controlled by temperature sensor</small>
                </div>
              </div>
              <span
                className={`badge ${fanStatus === 'ON' ? 'bg-success' : 'bg-secondary'} fs-6 px-4 py-2`}
                style={{ maxWidth: '150px' }}
              >
                {fanStatus === 'ON' ? `✓ ${fanSpeed}` : 'OFF'}
              </span>
            </div>

            {/* Info about automatic control */}
            <div className="alert alert-info mb-0">
              <h6 className="fw-bold mb-2">ℹ️ Automatic Control Thresholds:</h6>
              <ul className="mb-0 small">
                <li><strong>&lt; 25°C (77°F):</strong> Fan OFF</li>
                <li><strong>25-26.9°C (77-80.4°F):</strong> Fan LOW speed</li>
                <li><strong>27-29.9°C (80.6-85.8°F):</strong> Fan MEDIUM speed</li>
                <li><strong>≥ 30°C (86°F):</strong> Fan HIGH speed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};