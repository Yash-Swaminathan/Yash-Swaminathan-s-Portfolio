import React, { useState, useEffect } from 'react';

interface AnimatedHeadingProps {
  className?: string;
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({ className = '' }) => {
  const [displayText, setDisplayText] = useState('Me');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  const finalText = "Hey, I'm Yash! Nice to meet you";

  useEffect(() => {
    // Start animation after 2 seconds
    const startTimer = setTimeout(() => {
      setIsAnimating(true);
      animateText();
    }, 2000);

    // Cursor blinking effect
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearTimeout(startTimer);
      clearInterval(cursorTimer);
    };
  }, []);

  const animateText = async () => {
    // First, delete "Me" character by character
    for (let i = displayText.length; i >= 0; i--) {
      setDisplayText(displayText.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Small pause before typing new text
    await new Promise(resolve => setTimeout(resolve, 300));

    // Then type the new text character by character
    for (let i = 0; i <= finalText.length; i++) {
      setDisplayText(finalText.substring(0, i));
      await new Promise(resolve => setTimeout(resolve, 80));
    }

    // Stop cursor blinking after animation is complete
    setTimeout(() => {
      setShowCursor(false);
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div style={{ padding: '3rem 2rem 2rem 2rem' }}>
      <h1 style={{
        fontSize: '4rem',
        fontWeight: '700',
        color: 'var(--text-primary)',
        textAlign: 'center',
        marginBottom: '3rem',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
        letterSpacing: '-0.02em',
        background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-secondary) 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        position: 'relative',
        minHeight: '5rem', // Prevent layout shift
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span>
          {displayText}
          <span style={{
            opacity: showCursor ? 1 : 0,
            transition: 'opacity 0.1s ease',
            fontWeight: '300',
            marginLeft: '2px',
            color: 'var(--text-primary)',
            background: 'none',
            WebkitBackgroundClip: 'initial',
            WebkitTextFillColor: 'initial'
          }}>
            |
          </span>
        </span>

        {/* Subtle underline - only show when animation is complete */}
        {!isAnimating && (
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: displayText === finalText ? '200px' : '60px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, var(--text-primary), transparent)',
            borderRadius: '2px',
            transition: 'width 0.5s ease'
          }}></div>
        )}
      </h1>
    </div>
  );
};

export default AnimatedHeading;