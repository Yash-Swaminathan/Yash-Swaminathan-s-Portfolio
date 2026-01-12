import React, { useState, useRef, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface StockTickerProps {
  symbol: string;
  children: React.ReactNode;
}

const StockTicker: React.FC<StockTickerProps> = ({ symbol, children }) => {
  const { theme } = useTheme();
  const [showChart, setShowChart] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tickerRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (showChart && tickerRef.current) {
      const rect = tickerRef.current.getBoundingClientRect();
      const tooltipWidth = 450;
      const tooltipHeight = 320;
      
      // Position tooltip above the ticker, centered
      let left = rect.left + (rect.width / 2) - (tooltipWidth / 2);
      let top = rect.top - tooltipHeight - 15;

      // Adjust if tooltip goes off screen
      if (left < 10) left = 10;
      if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
      }
      if (top < 10) {
        // If not enough space above, show below
        top = rect.bottom + 15;
      }

      setTooltipPosition({ top, left });
    }
  }, [showChart]);

  const handleMouseEnter = () => {
    // Small delay to prevent flickering
    hoverTimeoutRef.current = setTimeout(() => {
      setShowChart(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setShowChart(false);
  };

  return (
    <>
      <span
        ref={tickerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          fontWeight: '500',
          color: 'var(--text-primary)',
          cursor: 'pointer',
          textDecoration: 'underline',
          textDecorationColor: 'var(--text-primary)',
          position: 'relative'
        }}
      >
        {children}
      </span>
      {showChart && (
        <div
          ref={tooltipRef}
          onMouseEnter={() => setShowChart(true)}
          onMouseLeave={handleMouseLeave}
          style={{
            position: 'fixed',
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            width: '450px',
            height: '320px',
            backgroundColor: 'var(--bg-secondary)',
            border: '1px solid var(--border-default)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
            zIndex: 10000,
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div style={{
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--text-primary)',
            marginBottom: '0.5rem'
          }}>
            {symbol} - Stock Chart
          </div>
          <div style={{
            flex: 1,
            borderRadius: '8px',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <iframe
              src={`https://www.tradingview.com/widgetembed/?symbol=${symbol}&interval=D&theme=${theme}&style=1&locale=en&hide_side_toolbar=1&allow_symbol_change=0&save_image=0&container_id=tradingview_${symbol}&hide_volume=1&height=280`}
              style={{
                width: '100%',
                height: '280px',
                border: 'none'
              }}
              title={`${symbol} Stock Chart`}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default StockTicker;

