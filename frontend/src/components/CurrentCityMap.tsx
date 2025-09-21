import React, { useState, useCallback } from 'react';
import CityLocator, { CityLocation } from './CityLocator';
import MiniMap from './MiniMap';

interface CurrentCityMapProps {
  width?: number;
  height?: number;
  className?: string;
}

const CurrentCityMap: React.FC<CurrentCityMapProps> = ({
  width = 280,
  height = 200,
  className = ''
}) => {
  const [currentLocation, setCurrentLocation] = useState<CityLocation>({
    name: 'Toronto, ON',
    lat: 43.6532,
    lng: -79.3832,
    bounds: [
      [43.5, -79.7], // Southwest corner
      [43.8, -79.1]  // Northeast corner
    ]
  });

  const handleLocationDetected = useCallback((location: CityLocation) => {
    setCurrentLocation(location);
  }, []);

  const containerStyle: React.CSSProperties = {
    width: `${width}px`,
    height: `${height}px`,
    borderRadius: '12px',
    overflow: 'hidden',
    border: '2px solid var(--border)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    backgroundColor: 'var(--bg-secondary)'
  };

  return (
    <div
      className={`current-city-map ${className}`}
      style={containerStyle}
    >
      <CityLocator onLocationDetected={handleLocationDetected}>
        <div style={{ position: 'relative' }}>
          <MiniMap
            location={currentLocation}
            width={width}
            height={height}
          />

          {/* Settings/City selector button */}
          <div
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '24px',
              height: '24px',
              background: 'rgba(255, 255, 255, 0.9)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '12px',
              color: '#666',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              userSelect: 'none',
              transition: 'all 0.2s ease'
            }}
            onClick={(e) => {
              e.stopPropagation();
              // Trigger city selector via global reference
              if ((window as any).toggleCitySelector) {
                (window as any).toggleCitySelector();
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
            title="Change city"
          >
            ⚙️
          </div>
        </div>
      </CityLocator>

      <style>{`
        .current-city-map {
          transition: box-shadow 0.2s ease;
        }

        .current-city-map:hover {
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default CurrentCityMap;