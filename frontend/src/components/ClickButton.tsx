import React, { useState, useEffect } from 'react';
import { ButtonService } from '../services/buttonService';
import GooseFloatAnimation from './GooseFloatAnimation';

// Animation states for duck float
type AnimationState = 'idle' | 'pressed' | 'playing' | 'done';

const ClickButton: React.FC = () => {
  const [clickCount, setClickCount] = useState<number>(0);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  // Load initial click count
  useEffect(() => {
    // You can add logic here to load initial count if needed
  }, []);

  const handleClick = async () => {
    const now = Date.now();

    // Debounce while animation is playing (3000ms max animation time for geese)
    if (animationState === 'playing' && now - lastClickTime < 3000) {
      return;
    }

    setLastClickTime(now);
    setAnimationState('pressed');

    // Start duck float animation
    setTimeout(() => setAnimationState('playing'), 50);

    try {
      const response = await ButtonService.incrementClick('click-me');
      if (response.success) {
        setClickCount(response.clickCount);
      }
    } catch (error) {
      console.error('Failed to track click:', error);
      setClickCount(prev => prev + 1);
    }

    // Complete animation and return to idle
    setTimeout(() => {
      setAnimationState('done');
      setTimeout(() => setAnimationState('idle'), 100);
    }, 2500); // 2.5s for slower geese flock animation
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Trigger on Enter or Space key
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  const getButtonText = () => {
    if (animationState === 'playing') {
      return 'You startled\nthe geese!';
    } else if (clickCount === 0) {
      return 'Click\nMe!';
    } else if (clickCount === 1) {
      return "The geese have\nbeen startled\n1 time";
    } else {
      return `The geese have\nbeen startled\n${clickCount} times`;
    }
  };

  return (
    <>
      <div style={{
        position: 'relative',
        marginLeft: 'auto',
        marginRight: '10%',
        marginTop: '2rem',
        width: 'fit-content'
      }}>
        {/* Container box with border and lighter blackish-grey background */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '3rem',
          borderRadius: '20px',
          boxShadow: 'var(--shadow-xl)',
          border: '2px solid var(--accent-blue)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem'
        }}>
          {/* Text above button */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              color: 'var(--text-primary)',
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              fontFamily: 'Georgia, serif'
            }}>
              Press The Button
            </div>
            <div style={{
              color: 'var(--text-muted)',
              fontSize: '20px',
              fontWeight: 'normal',
              fontFamily: 'Georgia, serif'
            }}>
            or not
            </div>
          </div>

          {/* Circular button */}
          <button
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-label={`Interactive button clicked ${clickCount} times. Press to startle the geese.`}
            aria-live="polite"
            aria-pressed={animationState === 'playing'}
            tabIndex={0}
            style={{
              position: 'relative',
              background: '#1e40af',
              border: '3px solid transparent',
              color: 'white',
              fontWeight: 'bold',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              boxShadow: '0 6px 20px rgba(30, 64, 175, 0.4)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'Georgia, serif',
              lineHeight: '1.2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              transform: animationState === 'pressed' ? 'scale(0.95)' : 'scale(1)',
              opacity: animationState === 'pressed' ? 0.8 : 1,
              outline: 'none'
            }}
            onMouseEnter={(e) => {
              if (animationState === 'idle') {
                e.currentTarget.style.background = '#1d4ed8';
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(30, 64, 175, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (animationState === 'idle') {
                e.currentTarget.style.background = '#1e40af';
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 64, 175, 0.4)';
              }
            }}
            onFocus={(e) => {
              // Visible focus ring for keyboard navigation
              e.currentTarget.style.borderColor = '#fbbf24';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 64, 175, 0.4), 0 0 0 2px #fbbf24';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 64, 175, 0.4)';
            }}
          >
            <span style={{
              whiteSpace: 'pre-line',
              position: 'relative',
              zIndex: 1
            }}>
              {getButtonText()}
            </span>
          </button>
        </div>
      </div>

      {/* Goose float animation rendered outside all containers */}
      {animationState === 'playing' && (
        <GooseFloatAnimation />
      )}
    </>
  );
};

export default ClickButton;