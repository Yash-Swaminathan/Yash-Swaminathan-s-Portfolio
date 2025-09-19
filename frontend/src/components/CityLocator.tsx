import React, { useState, useEffect } from 'react';

export interface CityLocation {
  name: string;
  lat: number;
  lng: number;
  bounds: [[number, number], [number, number]];
}

interface CityLocatorProps {
  onLocationDetected: (location: CityLocation) => void;
  children: React.ReactNode;
  onToggleSelector?: () => void;
}

const TORONTO_LOCATION: CityLocation = {
  name: 'Toronto, ON',
  lat: 43.6532, // Position where "Toronto" label typically appears on maps
  lng: -79.3832,
  bounds: [
    [-85, -180], // Global bounds - Southwest corner
    [85, 180]    // Global bounds - Northeast corner
  ]
};

const POPULAR_CITIES: CityLocation[] = [
  TORONTO_LOCATION,
  {
    name: 'Vancouver, BC',
    lat: 49.2827,
    lng: -123.1207,
    bounds: [[-85, -180], [85, 180]] // Global bounds
  },
  {
    name: 'Montreal, QC',
    lat: 45.5017,
    lng: -73.5673,
    bounds: [[-85, -180], [85, 180]] // Global bounds
  },
  {
    name: 'New York, NY',
    lat: 40.7128,
    lng: -74.0060,
    bounds: [[-85, -180], [85, 180]] // Global bounds
  },
  {
    name: 'London, UK',
    lat: 51.5074,
    lng: -0.1278,
    bounds: [[-85, -180], [85, 180]] // Global bounds
  }
];

const CityLocator: React.FC<CityLocatorProps> = ({ onLocationDetected, children, onToggleSelector }) => {
  const [currentLocation, setCurrentLocation] = useState<CityLocation>(TORONTO_LOCATION);
  const [isLocationPermissionGranted, setIsLocationPermissionGranted] = useState<boolean | null>(null);
  const [showCitySelector, setShowCitySelector] = useState(false);

  useEffect(() => {
    // Load saved city from localStorage
    const savedCity = localStorage.getItem('portfolio-current-city');
    if (savedCity) {
      try {
        const parsedCity = JSON.parse(savedCity) as CityLocation;
        setCurrentLocation(parsedCity);
        onLocationDetected(parsedCity);
        return;
      } catch (e) {
        console.warn('Failed to parse saved city, using default');
      }
    }

    // Default to Toronto and notify parent
    onLocationDetected(TORONTO_LOCATION);
  }, [onLocationDetected]);

  // Listen for toggle selector calls
  useEffect(() => {
    if (onToggleSelector) {
      // Store reference to toggle function for external calls
      (window as any).toggleCitySelector = () => setShowCitySelector(!showCitySelector);
    }
    return () => {
      delete (window as any).toggleCitySelector;
    };
  }, [showCitySelector, onToggleSelector]);

  const requestLocationPermission = async () => {
    if (!navigator.geolocation) {
      setIsLocationPermissionGranted(false);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: false,
            timeout: 10000,
            maximumAge: 300000 // 5 minutes cache
          }
        );
      });

      setIsLocationPermissionGranted(true);

      // Round coordinates to city-level precision (privacy protection)
      const roundedLat = Math.round(position.coords.latitude * 100) / 100;
      const roundedLng = Math.round(position.coords.longitude * 100) / 100;

      // Create global bounds for detected location
      const detectedLocation: CityLocation = {
        name: 'Your Location',
        lat: roundedLat,
        lng: roundedLng,
        bounds: [
          [-85, -180], // Global bounds
          [85, 180]    // Global bounds
        ]
      };

      setCurrentLocation(detectedLocation);
      localStorage.setItem('portfolio-current-city', JSON.stringify(detectedLocation));
      onLocationDetected(detectedLocation);

    } catch (error) {
      setIsLocationPermissionGranted(false);
      console.log('Location permission denied or failed');
    }
  };

  const selectCity = (city: CityLocation) => {
    setCurrentLocation(city);
    localStorage.setItem('portfolio-current-city', JSON.stringify(city));
    onLocationDetected(city);
    setShowCitySelector(false);
  };

  return (
    <div style={{ position: 'relative' }}>
      {children}

      {/* City selector overlay */}
      {showCitySelector && (
        <div style={{
          position: 'absolute',
          top: '100%',
          right: 0,
          backgroundColor: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          minWidth: '200px',
          padding: '8px'
        }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '500',
            color: 'var(--text-muted)',
            padding: '8px 12px',
            borderBottom: '1px solid var(--border)'
          }}>
            Select your city:
          </div>

          {POPULAR_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => selectCity(city)}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: 'none',
                color: 'var(--text)',
                fontSize: '14px',
                cursor: 'pointer',
                borderRadius: '4px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {city.name}
            </button>
          ))}

          <div style={{ borderTop: '1px solid var(--border)', marginTop: '4px', paddingTop: '4px' }}>
            <button
              onClick={requestLocationPermission}
              disabled={isLocationPermissionGranted === true}
              style={{
                width: '100%',
                textAlign: 'left',
                padding: '8px 12px',
                backgroundColor: 'transparent',
                border: 'none',
                color: isLocationPermissionGranted === true ? 'var(--text-muted)' : 'var(--primary)',
                fontSize: '14px',
                cursor: isLocationPermissionGranted === true ? 'default' : 'pointer',
                borderRadius: '4px',
                transition: 'background-color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (isLocationPermissionGranted !== true) {
                  e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              {isLocationPermissionGranted === true ? '✓ Location detected' : '📍 Use my location'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default CityLocator;