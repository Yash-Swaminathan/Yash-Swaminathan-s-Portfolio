import React, { useState, useEffect } from 'react';
import { ButtonService } from '../services/buttonService';

const ClickButton: React.FC = () => {
  const [clickCount, setClickCount] = useState<number>(0);
  const [isClicked, setIsClicked] = useState<boolean>(false);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    // Get initial click count when component mounts
    loadInitialCount();
  }, []);

  const loadInitialCount = async () => {
    try {
      const response = await ButtonService.getButtonStats('click-me');
      if (response.success && response.data) {
        setClickCount(response.data.click_count);
        if (response.data.click_count > 0) {
          setIsClicked(true);
        }
      }
    } catch (error) {
      console.log('Button not found yet, will be created on first click');
      // This is fine - button will be created on first click
    }
  };

  const handleClick = async () => {
    // Start animation
    setIsAnimating(true);

    try {
      const response = await ButtonService.incrementClick('click-me');
      if (response.success) {
        setClickCount(response.clickCount);
        setIsClicked(true);
      }
    } catch (error) {
      console.error('Failed to track click:', error);
      // Fallback - increment locally if API fails
      setClickCount(prev => prev + 1);
      setIsClicked(true);
    }

    // End animation after delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  const getButtonText = () => {
    if (!isClicked || clickCount === 0) {
      return 'Click\nMe!';
    } else if (clickCount === 1) {
      return "I've been\nclicked\n1 time!";
    } else {
      return `I've been\nclicked\n${clickCount} times!`;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      right: '10%',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 40
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
            Press it
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
          style={{
            position: 'relative',
            overflow: 'hidden',
            background: '#1e40af', // Deep blue solid color
            border: 'none',
            color: 'white',
            fontWeight: 'bold',
            width: '180px',
            height: '180px',
            borderRadius: '50%', // Perfect circle
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
            transform: isAnimating ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#1d4ed8'; // Slightly lighter deep blue on hover
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(30, 64, 175, 0.5)';
          }}
          onMouseLeave={(e) => {
            if (!isAnimating) {
              e.currentTarget.style.background = '#1e40af';
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(30, 64, 175, 0.4)';
            }
          }}
          disabled={isAnimating}
        >
          <span style={{
            opacity: isAnimating ? '0.7' : '1',
            whiteSpace: 'pre-line' // Allows line breaks
          }}>
            {getButtonText()}
          </span>

          {/* Simple animation overlay */}
          {isAnimating && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              animation: 'pulse 0.6s ease-out'
            }}></div>
          )}
        </button>
      </div>
    </div>
  );
};

export default ClickButton;