import React, { useState, useEffect } from 'react';
import { ButtonService } from '../services/buttonService';
import GooseFloatAnimation from './GooseFloatAnimation';

// Animation states for duck float
type AnimationState = 'idle' | 'pressed' | 'playing' | 'done';

const ClickButton: React.FC = () => {
  const [clickCount, setClickCount] = useState<number>(0);
  const [animationState, setAnimationState] = useState<AnimationState>('idle');
  const [lastClickTime, setLastClickTime] = useState<number>(0);

  // Load the real, persisted click count on mount so the UI reflects the database
  useEffect(() => {
    let isMounted = true;
    ButtonService.getButtonStats('click-me')
      .then((response) => {
        if (isMounted && response?.data?.click_count != null) {
          setClickCount(response.data.click_count);
        }
      })
      .catch((error) => {
        console.error('Failed to load initial click count:', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClick = async () => {
    const now = Date.now();

    // Debounce while animation is playing (6000ms max animation time for 8 geese)
    if (animationState === 'playing' && now - lastClickTime < 6000) {
      return;
    }

    setLastClickTime(now);
    setAnimationState('pressed');

    // Start duck float animation
    setTimeout(() => setAnimationState('playing'), 50);

    try {
      const response = await ButtonService.incrementClick('click-me');
      if (response.success) {
        // Trust the server as the source of truth for the persisted count
        setClickCount(response.clickCount);
      }
    } catch (error) {
      // Do not fake a local increment: if the request failed, nothing was persisted.
      console.error('Failed to track click:', error);
    }

    // Complete animation and return to idle (2100ms last goose delay + 3500ms animation = 5600ms total)
    setTimeout(() => {
      setAnimationState('done');
      setTimeout(() => setAnimationState('idle'), 100);
    }, 5600); // 5.6s for all 8 geese to fly off screen
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
      return 'You scared\nthe geese!';
    } else if (clickCount === 0) {
      return 'Click\nMe!';
    } else {
      return `The Waterloo geese\nhave been scared\n${clickCount} times`;
    }
  };

  return (
    <>
      <div style={{
        width: 'fit-content'
      }}>
        {/* Container box - Cursor.com inspired styling */}
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '1.5rem',
          borderRadius: '16px',
          boxShadow: '0 0 0 1px var(--border-default), 0 8px 24px rgba(0, 0, 0, 0.12)',
          border: '1px solid var(--border-default)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          transition: 'all 0.3s ease',
          width: 'fit-content'
        }}>
          {/* Text above button */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              color: 'var(--text-primary)',
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '0.5rem',
              fontFamily: 'Inter, sans-serif'
            }}>
              Press The Button
            </div>
            <div style={{
              color: 'var(--text-muted)',
              fontSize: '20px',
              fontWeight: 'normal',
              fontFamily: 'Inter, sans-serif'
            }}>
            or not
            </div>
          </div>

          {/* Circular button - inverted theme colors */}
          <button
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            aria-label={`Interactive button clicked ${clickCount} times. Press to startle the Waterloo geese.`}
            aria-live="polite"
            aria-pressed={animationState === 'playing'}
            tabIndex={0}
            className="theme-inverted-button"
            style={{
              position: 'relative',
              border: '3px solid transparent',
              fontWeight: 'bold',
              width: '180px',
              height: '180px',
              borderRadius: '50%',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              fontSize: '16px',
              fontFamily: 'Inter, sans-serif',
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
                e.currentTarget.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (animationState === 'idle') {
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
            onFocus={(e) => {
              // Visible focus ring for keyboard navigation
              e.currentTarget.style.borderColor = 'var(--primary)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3), 0 0 0 2px var(--primary)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'transparent';
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