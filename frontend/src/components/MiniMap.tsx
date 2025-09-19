import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { CityLocation } from './CityLocator';
import { useTheme } from '../contexts/ThemeContext';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MiniMapProps {
  location: CityLocation;
  width?: number;
  height?: number;
  className?: string;
}

const MiniMap: React.FC<MiniMapProps> = ({
  location,
  width = 280,
  height = 200,
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const { theme } = useTheme();

  // Get tile layer based on theme (inverted: dark map on light theme, blue map on dark theme)
  const getTileLayer = useCallback(() => {
    const tileConfigs = {
      light: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
      },
      dark: {
        url: 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png',
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>'
      }
    };

    const config = tileConfigs[theme] || tileConfigs.light;
    return L.tileLayer(config.url, {
      attribution: config.attribution,
      subdomains: ['a', 'b', 'c', 'd'],
      maxZoom: 19,
      keepBuffer: 4,
      updateWhenZooming: false,
      updateWhenIdle: true
    });
  }, [theme]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map if it doesn't exist
    if (!mapInstanceRef.current) {
      const map = L.map(mapRef.current, {
        center: [location.lat, location.lng],
        zoom: 14, // Closer zoom for city view
        zoomControl: true,
        scrollWheelZoom: true,
        doubleClickZoom: true,
        dragging: true,
        minZoom: 2, // Allow global view
        maxZoom: 18,
        // Remove maxBounds to allow global navigation
        worldCopyJump: true // Handle crossing international date line
      });

      // Add theme-aware tile layer
      const tileLayer = getTileLayer();
      tileLayer.addTo(map);
      tileLayerRef.current = tileLayer;

      // Add custom zoom controls styling
      const zoomControls = document.querySelectorAll('.leaflet-control-zoom a');
      zoomControls.forEach((control) => {
        (control as HTMLElement).style.backgroundColor = 'var(--bg)';
        (control as HTMLElement).style.borderColor = 'var(--border)';
        (control as HTMLElement).style.color = 'var(--text)';
      });

      mapInstanceRef.current = map;
      setIsMapLoaded(true);
    }

    // Update map view when location changes
    const map = mapInstanceRef.current;
    if (map) {
      map.setView([location.lat, location.lng], 14);
      // Remove maxBounds restriction for global navigation

      // Remove existing marker if any
      if (markerRef.current) {
        map.removeLayer(markerRef.current);
        markerRef.current = null;
      }
    }

    // Cleanup function
    return () => {
      // Don't destroy map on location change, only on component unmount
    };
  }, [location, getTileLayer]);

  // Handle theme changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const map = mapInstanceRef.current;

    // Remove old tile layer
    map.removeLayer(tileLayerRef.current);

    // Add new theme-appropriate tile layer
    const newTileLayer = getTileLayer();
    newTileLayer.addTo(map);
    tileLayerRef.current = newTileLayer;
  }, [theme, getTileLayer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle keyboard navigation for accessibility
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!mapInstanceRef.current) return;

    const map = mapInstanceRef.current;

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        map.panBy([0, -50]);
        break;
      case 'ArrowDown':
        event.preventDefault();
        map.panBy([0, 50]);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        map.panBy([-50, 0]);
        break;
      case 'ArrowRight':
        event.preventDefault();
        map.panBy([50, 0]);
        break;
      case '+':
      case '=':
        event.preventDefault();
        map.zoomIn();
        break;
      case '-':
        event.preventDefault();
        map.zoomOut();
        break;
    }
  };

  return (
    <div
      className={`mini-map ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        borderRadius: '12px',
        overflow: 'hidden',
        border: '2px solid var(--border)',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        position: 'relative',
        backgroundColor: 'var(--bg-secondary)',
        cursor: 'grab'
      }}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      role="application"
      aria-label={`Interactive map showing ${location.name}. Use arrow keys to pan, +/- to zoom.`}
    >
      <div
        ref={mapRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
      />

      {/* Loading indicator */}
      {!isMapLoaded && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'var(--text-muted)',
          fontSize: '14px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid var(--border)',
            borderTop: '2px solid var(--primary)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
          Loading map...
        </div>
      )}

      {/* Attribution */}
      <div style={{
        position: 'absolute',
        bottom: '2px',
        right: '4px',
        fontSize: '10px',
        color: theme === 'dark' ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.6)',
        backgroundColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.8)',
        padding: '1px 3px',
        borderRadius: '2px'
      }}>
        © CARTO
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .mini-map:focus {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }

        .mini-map:active {
          cursor: grabbing;
        }

        .custom-popup .leaflet-popup-content-wrapper {
          background: var(--bg);
          color: var(--text);
          border: 1px solid var(--border);
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        }

        .custom-popup .leaflet-popup-tip {
          background: var(--bg);
          border: 1px solid var(--border);
        }

        .leaflet-control-zoom {
          border: none !important;
        }

        .leaflet-control-zoom a {
          background-color: var(--bg) !important;
          border: 1px solid var(--border) !important;
          color: var(--text) !important;
          transition: all 0.2s ease !important;
        }

        .leaflet-control-zoom a:hover {
          background-color: var(--bg-secondary) !important;
          border-color: var(--primary) !important;
        }

        .leaflet-control-attribution {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default MiniMap;