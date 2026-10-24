'use client';

import * as React from 'react';

export type TemperatureUnit = 'celsius' | 'fahrenheit' | 'kelvin';
export type MeasurementSystem = 'metric' | 'imperial';

interface SettingsContextType {
  tempUnit: TemperatureUnit;
  setTempUnit: (unit: TemperatureUnit) => void;
  weightUnit: MeasurementSystem;
  setWeightUnit: (system: MeasurementSystem) => void;
  formatTemp: (celsius: number) => string;
  formatWeight: (grams: number) => string;
}

const SettingsContext = React.createContext<SettingsContextType | null>(null);

const STORAGE_KEY = 'bakeitbaby_settings_v1';

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [tempUnit, setTempUnitState] = React.useState<TemperatureUnit>('celsius');
  const [weightUnit, setWeightUnitState] = React.useState<MeasurementSystem>('metric');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.tempUnit) setTempUnitState(parsed.tempUnit);
        if (parsed.weightUnit) setWeightUnitState(parsed.weightUnit);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const setTempUnit = React.useCallback((unit: TemperatureUnit) => {
    setTempUnitState(unit);
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, tempUnit: unit }));
    } catch {
      // ignore
    }
  }, []);

  const setWeightUnit = React.useCallback((system: MeasurementSystem) => {
    setWeightUnitState(system);
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...current, weightUnit: system }));
    } catch {
      // ignore
    }
  }, []);

  const formatTemp = React.useCallback(
    (celsius: number): string => {
      if (!mounted) return `${Math.round(celsius)} °C`;
      switch (tempUnit) {
        case 'fahrenheit':
          return `${Math.round((celsius * 9) / 5 + 32)} °F`;
        case 'kelvin':
          return `${(celsius + 273.15).toFixed(1)} K`;
        case 'celsius':
        default:
          return `${Math.round(celsius)} °C`;
      }
    },
    [tempUnit, mounted]
  );

  const formatWeight = React.useCallback(
    (grams: number): string => {
      if (!mounted) return `${grams >= 1000 ? (grams / 1000).toFixed(2) + ' kg' : Math.round(grams * 10) / 10 + ' g'}`;
      if (weightUnit === 'imperial') {
        const oz = grams / 28.3495;
        if (oz >= 16) {
          const lbs = oz / 16;
          return `${lbs.toFixed(2)} lbs`;
        }
        return `${oz.toFixed(1)} oz`;
      }
      if (grams >= 1000) {
        return `${(grams / 1000).toFixed(2)} kg`;
      }
      return `${Math.round(grams * 10) / 10} g`;
    },
    [weightUnit, mounted]
  );

  return (
    <SettingsContext.Provider
      value={{
        tempUnit,
        setTempUnit,
        weightUnit,
        setWeightUnit,
        formatTemp,
        formatWeight,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

const defaultSettings: SettingsContextType = {
  tempUnit: 'celsius',
  setTempUnit: () => {},
  weightUnit: 'metric',
  setWeightUnit: () => {},
  formatTemp: (celsius: number) => `${Math.round(celsius)} °C`,
  formatWeight: (grams: number) =>
    grams >= 1000 ? `${(grams / 1000).toFixed(2)} kg` : `${Math.round(grams * 10) / 10} g`,
};

export function useSettings(): SettingsContextType {
  const ctx = React.useContext(SettingsContext);
  return ctx || defaultSettings;
}

