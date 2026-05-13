import { useState, useEffect } from 'react';

type TempUnit = 'Celsius' | 'Fahrenheit';

export const useTemperatureUnit = () => {
  const [tempUnit, setTempUnit] = useState<TempUnit>(() => {
    const stored = localStorage.getItem('temperatureUnit');
    return (stored as TempUnit) || 'Celsius';
  });

  useEffect(() => {
    localStorage.setItem('temperatureUnit', tempUnit);
  }, [tempUnit]);

  const toggleTempUnit = () => {
    setTempUnit(prev => prev === 'Celsius' ? 'Fahrenheit' : 'Celsius');
  };

  const convertTemperature = (tempCelsius: number): number => {
    if (tempUnit === 'Fahrenheit') {
      return (tempCelsius * 9/5) + 32;
    }
    return tempCelsius;
  };

  const formatTemperature = (tempCelsius: number): string => {
    const converted = convertTemperature(tempCelsius);
    const symbol = tempUnit === 'Celsius' ? '°C' : '°F';
    return `${converted.toFixed(1)}${symbol}`;
  };

  return {
    tempUnit,
    toggleTempUnit,
    convertTemperature,
    formatTemperature
  };
};