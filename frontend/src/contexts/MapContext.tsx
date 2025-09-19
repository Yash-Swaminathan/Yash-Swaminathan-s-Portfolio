import React, { createContext, useContext, useCallback, useState } from 'react';
import { CityLocation } from '../components/CityLocator';

interface MapConfig {
  tileUrl: string;
  attribution: string;
  maxZoom: number;
  minZoom: number;
  defaultZoom: number;
  theme: 'light' | 'dark' | 'auto';
}

interface MapContextType {
  config: MapConfig;
  currentLocation: CityLocation | null;
  setCurrentLocation: (location: CityLocation) => void;
  updateConfig: (newConfig: Partial<MapConfig>) => void;
  isMapEnabled: boolean;
  setMapEnabled: (enabled: boolean) => void;
}

const defaultConfig: MapConfig = {
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '© OpenStreetMap contributors',
  maxZoom: 15,
  minZoom: 8,
  defaultZoom: 11,
  theme: 'auto'
};

const MapContext = createContext<MapContextType | undefined>(undefined);

interface MapProviderProps {
  children: React.ReactNode;
  initialConfig?: Partial<MapConfig>;
}

export const MapProvider: React.FC<MapProviderProps> = ({
  children,
  initialConfig = {}
}) => {
  const [config, setConfig] = useState<MapConfig>({
    ...defaultConfig,
    ...initialConfig
  });

  const [currentLocation, setCurrentLocationState] = useState<CityLocation | null>(null);
  const [isMapEnabled, setMapEnabled] = useState(true);

  const setCurrentLocation = useCallback((location: CityLocation) => {
    setCurrentLocationState(location);

    // Optional: Save to localStorage for persistence
    try {
      localStorage.setItem('portfolio-map-location', JSON.stringify(location));
    } catch (error) {
      console.warn('Failed to save location to localStorage:', error);
    }
  }, []);

  const updateConfig = useCallback((newConfig: Partial<MapConfig>) => {
    setConfig(prev => ({
      ...prev,
      ...newConfig
    }));
  }, []);

  // Load saved location on mount
  React.useEffect(() => {
    try {
      const savedLocation = localStorage.getItem('portfolio-map-location');
      if (savedLocation) {
        const location = JSON.parse(savedLocation) as CityLocation;
        setCurrentLocationState(location);
      }
    } catch (error) {
      console.warn('Failed to load saved location:', error);
    }
  }, []);

  const value: MapContextType = {
    config,
    currentLocation,
    setCurrentLocation,
    updateConfig,
    isMapEnabled,
    setMapEnabled
  };

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = (): MapContextType => {
  const context = useContext(MapContext);
  if (context === undefined) {
    throw new Error('useMap must be used within a MapProvider');
  }
  return context;
};

// Custom hook for map configuration based on theme
export const useMapTheme = () => {
  const { config, updateConfig } = useMap();

  const applyTheme = useCallback((theme: 'light' | 'dark') => {
    const tileConfigs = {
      light: {
        tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution: '© OpenStreetMap contributors'
      },
      dark: {
        tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '© OpenStreetMap contributors © CARTO'
      }
    };

    updateConfig({
      ...tileConfigs[theme],
      theme
    });
  }, [updateConfig]);

  return {
    currentTheme: config.theme,
    applyTheme
  };
};

export default MapContext;