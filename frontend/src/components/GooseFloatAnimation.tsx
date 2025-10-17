import React, { useState, useEffect } from 'react';

interface GooseFloatAnimationProps {
  animationEnabled?: boolean;
  variant?: string;
  reducedMotionText?: string;
  playSound?: boolean;
}

const GooseFloatAnimation: React.FC<GooseFloatAnimationProps> = ({
  animationEnabled = true,
  variant = 'duck-float',
  reducedMotionText = "Done",
  playSound = false
}) => {
  const [showBubble, setShowBubble] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!prefersReducedMotion && animationEnabled) {
      // Show bubble at 70% of geese path (around 1750ms into 2500ms animation)
      const bubbleTimer = setTimeout(() => {
        setShowBubble(true);
        // Hide bubble after 400ms for better visibility with slower animation
        setTimeout(() => setShowBubble(false), 400);
      }, 1750);

      return () => clearTimeout(bubbleTimer);
    }
  }, [prefersReducedMotion, animationEnabled]);

  // Reduced motion fallback
  if (prefersReducedMotion || !animationEnabled) {
    return (
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '20px',
        transform: 'translateY(-50%)',
        color: 'white',
        fontSize: '14px',
        fontWeight: 'bold',
        zIndex: 2,
        animation: 'fadeInOut 200ms ease-out'
      }}>
        ✓ {reducedMotionText}
      </div>
    );
  }

  return (
    <>
      {/* Full-screen duck container */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          pointerEvents: 'none',
          zIndex: 1000
        }}
      >
        {/* Goose 1 - Lead goose */}
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '-100px',
            transform: 'translateY(-50%)',
            width: '80px',
            height: '80px',
            zIndex: 1001,
            animation: 'gooseFloatScreen 2500ms ease-out forwards'
          }}
        >
          <img
            src="/photos/canada_goose-removebg-preview.png"
            alt="Canada Goose"
            style={{
              width: '80px',
              height: '80px',
              objectFit: 'contain',
              animation: 'gooseBob 2500ms ease-in-out',
              filter: 'drop-shadow(5px 5px 10px rgba(0,0,0,0.3))'
            }}
          />
        </div>

        {/* Goose 2 - Following behind and higher */}
        <div
          style={{
            position: 'absolute',
            top: '25%',
            left: '-180px',
            transform: 'translateY(-50%)',
            width: '70px',
            height: '70px',
            zIndex: 1000,
            animation: 'gooseFloatScreen 2500ms ease-out forwards',
            animationDelay: '300ms'
          }}
        >
          <img
            src="/photos/canada_goose-removebg-preview.png"
            alt="Canada Goose"
            style={{
              width: '70px',
              height: '70px',
              objectFit: 'contain',
              animation: 'gooseBob 2500ms ease-in-out',
              animationDelay: '300ms',
              filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.25))'
            }}
          />
        </div>

        {/* Goose 3 - Following behind and lower */}
        <div
          style={{
            position: 'absolute',
            top: '60%',
            left: '-260px',
            transform: 'translateY(-50%)',
            width: '65px',
            height: '65px',
            zIndex: 999,
            animation: 'gooseFloatScreen 2500ms ease-out forwards',
            animationDelay: '600ms'
          }}
        >
          <img
            src="/photos/canada_goose-removebg-preview.png"
            alt="Canada Goose"
            style={{
              width: '65px',
              height: '65px',
              objectFit: 'contain',
              animation: 'gooseBob 2500ms ease-in-out',
              animationDelay: '600ms',
              filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.2))'
            }}
          />
        </div>

        {/* Goose 4 - Upper formation */}
        <div
          style={{
            position: 'absolute',
            top: '15%',
            left: '-340px',
            transform: 'translateY(-50%)',
            width: '60px',
            height: '60px',
            zIndex: 998,
            animation: 'gooseFloatScreen 2500ms ease-out forwards',
            animationDelay: '900ms'
          }}
        >
          <img
            src="/photos/canada_goose-removebg-preview.png"
            alt="Canada Goose"
            style={{
              width: '60px',
              height: '60px',
              objectFit: 'contain',
              animation: 'gooseBob 2500ms ease-in-out',
              animationDelay: '900ms',
              filter: 'drop-shadow(2px 2px 5px rgba(0,0,0,0.2))'
            }}
          />
        </div>

        {/* Goose 5 - Lower formation */}
        <div
          style={{
            position: 'absolute',
            top: '70%',
            left: '-420px',
            transform: 'translateY(-50%)',
            width: '55px',
            height: '55px',
            zIndex: 997,
            animation: 'gooseFloatScreen 2500ms ease-out forwards',
            animationDelay: '1200ms'
          }}
        >
          <img
            src="/photos/canada_goose-removebg-preview.png"
            alt="Canada Goose"
            style={{
              width: '55px',
              height: '55px',
              objectFit: 'contain',
              animation: 'gooseBob 2500ms ease-in-out',
              animationDelay: '1200ms',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.15))'
            }}
          />
        </div>

        {/* Goose 6 - Middle formation */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '-500px',
            transform: 'translateY(-50%)',
            width: '58px',
            height: '58px',
            zIndex: 996,
            animation: 'gooseFloatScreen 2500ms ease-out forwards',
            animationDelay: '1500ms'
          }}
        >
          <img
            src="/photos/canada_goose-removebg-preview.png"
            alt="Canada Goose"
            style={{
              width: '58px',
              height: '58px',
              objectFit: 'contain',
              animation: 'gooseBob 2500ms ease-in-out',
              animationDelay: '1500ms',
              filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.15))'
            }}
          />
        </div>

        {/* Goose 7 - Upper back */}
        <div
          style={{
            position: 'absolute',
            top: '32%',
            left: '-580px',
            transform: 'translateY(-50%)',
            width: '52px',
            height: '52px',
            zIndex: 995,
            animation: 'gooseFloatScreen 2500ms ease-out forwards',
            animationDelay: '1800ms'
          }}
        >
          <img
            src="/photos/canada_goose-removebg-preview.png"
            alt="Canada Goose"
            style={{
              width: '52px',
              height: '52px',
              objectFit: 'contain',
              animation: 'gooseBob 2500ms ease-in-out',
              animationDelay: '1800ms',
              filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.1))'
            }}
          />
        </div>

        {/* Goose 8 - Lower back */}
        <div
          style={{
            position: 'absolute',
            top: '55%',
            left: '-660px',
            transform: 'translateY(-50%)',
            width: '50px',
            height: '50px',
            zIndex: 994,
            animation: 'gooseFloatScreen 2500ms ease-out forwards',
            animationDelay: '2100ms'
          }}
        >
          <img
            src="/photos/canada_goose-removebg-preview.png"
            alt="Canada Goose"
            style={{
              width: '50px',
              height: '50px',
              objectFit: 'contain',
              animation: 'gooseBob 2500ms ease-in-out',
              animationDelay: '2100ms',
              filter: 'drop-shadow(1px 1px 3px rgba(0,0,0,0.1))'
            }}
          />
        </div>

        {/* Success bubble - positioned to follow duck */}
        {showBubble && (
          <div
            style={{
              position: 'absolute',
              top: '45%',
              left: '70%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#1e40af',
              padding: '6px 12px',
              borderRadius: '16px',
              fontSize: '14px',
              fontWeight: 'bold',
              border: '2px solid rgba(30, 64, 175, 0.3)',
              zIndex: 1002,
              animation: 'bubblePop 220ms ease-out forwards',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            ✓
          </div>
        )}
      </div>

      <style>{`
        @keyframes gooseFloatScreen {
          0% {
            left: -80px;
            opacity: 0;
          }
          8% {
            opacity: 1;
          }
          92% {
            opacity: 1;
          }
          100% {
            left: calc(100vw + 80px); /* Exit right side of screen */
            opacity: 0;
          }
        }

        @keyframes gooseBob {
          0%, 100% { transform: translateY(-50%); }
          20% { transform: translateY(-55px); }
          40% { transform: translateY(-50%); }
          60% { transform: translateY(-58px); }
          80% { transform: translateY(-50%); }
        }

        @keyframes bubblePop {
          0% {
            transform: translate(-50%, -50%) scale(0.85);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(0.95);
            opacity: 0;
          }
        }

        @keyframes fadeInOut {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }

        /* Ensure animations respect reduced motion preference */
        @media (prefers-reduced-motion: reduce) {
          .duck-float-animation * {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default GooseFloatAnimation;