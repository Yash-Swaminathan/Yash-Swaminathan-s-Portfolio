import React, { useState, useCallback } from 'react';
import CityLocator, { CityLocation } from './CityLocator';
import MiniMap from './MiniMap';

interface CurrentCityMapProps {
  width?: number;
  height?: number;
  className?: string;
  position?: 'fixed' | 'relative';
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
}

const CurrentCityMap: React.FC<CurrentCityMapProps> = ({
  width = 280,
  height = 200,
  className = '',
  position = 'fixed',
  top = '80px',
  right = '20px',
  bottom,
  left
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

  const [isVisible, setIsVisible] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [mapPosition, setMapPosition] = useState({
    top: parseInt(top),
    right: parseInt(right),
    bottom: bottom ? parseInt(bottom) : undefined,
    left: left ? parseInt(left) : undefined
  });

  const handleLocationDetected = useCallback((location: CityLocation) => {
    setCurrentLocation(location);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return; // Only drag on container, not map

    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const newPosition = {
      top: e.clientY - dragOffset.y,
      right: window.innerWidth - (e.clientX - dragOffset.x) - width,
      bottom: undefined,
      left: undefined
    };

    // Keep within viewport bounds
    newPosition.top = Math.max(0, Math.min(newPosition.top, window.innerHeight - height));
    newPosition.right = Math.max(0, Math.min(newPosition.right, window.innerWidth - width));

    setMapPosition(newPosition);
  }, [isDragging, dragOffset, width, height]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners for dragging
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
      document.body.style.cursor = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  if (!isVisible) return null;

  const positionStyle: React.CSSProperties = {
    position,
    width: `${width}px`,
    height: `${height}px`,
    zIndex: 999,
    ...(mapPosition.top !== undefined && { top: `${mapPosition.top}px` }),
    ...(mapPosition.right !== undefined && { right: `${mapPosition.right}px` }),
    ...(mapPosition.bottom !== undefined && { bottom: `${mapPosition.bottom}px` }),
    ...(mapPosition.left !== undefined && { left: `${mapPosition.left}px` })
  };

  return (
    <div
      className={`current-city-map ${className}`}
      style={positionStyle}
      onMouseDown={handleMouseDown}
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

          {/* Close button */}
          <button
            onClick={() => setIsVisible(false)}
            style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              width: '24px',
              height: '24px',
              background: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#666',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 1)';
              e.currentTarget.style.color = '#333';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.9)';
              e.currentTarget.style.color = '#666';
            }}
            title="Hide map"
          >
            ×
          </button>
        </div>
      </CityLocator>

      <style>{`
        .current-city-map {
          transition: transform 0.2s ease;
        }

        .current-city-map:hover {
          transform: scale(1.02);
        }

        .current-city-map:active {
          transform: scale(0.98);
        }
      `}</style>
    </div>
  );
};

// Toggle button to show/hide the map
export const MapToggleButton: React.FC<{ onToggle: () => void; isVisible: boolean }> = ({
  onToggle,
  isVisible
}) => {
  return (
    <button
      onClick={onToggle}
      style={{
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        backgroundColor: 'var(--primary)',
        color: 'white',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        fontSize: '20px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      title={isVisible ? 'Hide map' : 'Show current city map'}
    >
      {isVisible ? '🗺️' : '📍'}
    </button>
  );
};

export default CurrentCityMap;