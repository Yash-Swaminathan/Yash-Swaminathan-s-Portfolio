import React, { useState, useEffect, useRef } from 'react';

interface AnimatedHeadingProps {
  className?: string;
}

const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({ className = '' }) => {
  const [displayText, setDisplayText] = useState('Me');
  const [showCursor, setShowCursor] = useState(true);
  const isRunningRef = useRef(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const isMountedRef = useRef(true);

  const greetings = [
    "Hey, I'm Yash! Nice to meet you!",          // English
    "नमस्ते, मैं यश हूं! आपसे मिलकर खुशी हुई",      // Hindi
    "你好，我是雅什！很高兴见到你！",                    // Mandarin
  ];

  // Clear all timeouts when component unmounts
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      isRunningRef.current = false;
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  useEffect(() => {
    // Cursor blinking effect
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    // Start animation after a brief delay
    const startTimer = setTimeout(() => {
      if (!isRunningRef.current) {
        console.log('Starting animation...');
        isRunningRef.current = true;
        startAnimation();
      }
    }, 100);

    return () => {
      clearInterval(cursorTimer);
      clearTimeout(startTimer);
    };
  }, []);

  const delay = (ms: number): Promise<void> => {
    return new Promise(resolve => {
      const timeout = setTimeout(resolve, ms);
      timeoutsRef.current.push(timeout);
    });
  };

  const typeText = async (text: string, speed: number = 80): Promise<void> => {
    for (let i = 0; i <= text.length; i++) {
      if (!isRunningRef.current) return;
      setDisplayText(text.substring(0, i));
      await delay(speed);
    }
  };

  const deleteText = async (text: string, speed: number = 60): Promise<void> => {
    for (let i = text.length; i >= 0; i--) {
      if (!isRunningRef.current) return;
      setDisplayText(text.substring(0, i));
      await delay(speed);
    }
  };

  const startAnimation = async (): Promise<void> => {
    console.log('Animation function started');
    try {
      while (isRunningRef.current) {
        console.log('Starting animation cycle');
        // Initial state: "Me" for 2 seconds
        setDisplayText('Me');
        console.log('Waiting at Me for 2 seconds...');
        await delay(2000);

        // Delete "Me"
        await deleteText('Me', 100);
        await delay(300);

        // Type English greeting
        await typeText(greetings[0], 80);
        await delay(3000);

        // Cycle through Hindi and Mandarin
        for (let i = 1; i < greetings.length; i++) {
          if (!isRunningRef.current) return;

          // Delete current text
          await deleteText(greetings[i - 1], 60);
          await delay(200);

          // Type new language
          await typeText(greetings[i], 80);
          await delay(3000);
        }

        // Delete last language and return to English
        await deleteText(greetings[greetings.length - 1], 60);
        await delay(200);
        await typeText(greetings[0], 80);
        await delay(3000);

        // Return to "Me"
        await deleteText(greetings[0], 60);
        await delay(200);
        await typeText('Me', 100);

        // Wait at "Me" for 10 seconds
        console.log('Starting 10 second wait at Me...');
        await delay(10000);
        console.log('10 second wait complete, restarting cycle...');

        // Small pause before restarting
        await delay(1000);
      }
    } catch (error) {
      console.error('Animation error:', error);
    }
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
        minHeight: '5rem',
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
      </h1>
    </div>
  );
};

export default AnimatedHeading;