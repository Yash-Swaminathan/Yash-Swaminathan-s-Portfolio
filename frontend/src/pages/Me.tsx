import React from 'react';
import ClickButton from '../components/ClickButton';
import SpotifyWidget from '../components/SpotifyWidget';
import CurrentCityMap from '../components/CurrentCityMap';

const Me: React.FC = () => {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      paddingTop: '60px' // Account for header
    }}>
      {/* About Me Heading */}
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
          position: 'relative'
        }}>
          Me
          {/* Subtle underline */}
          <div style={{
            position: 'absolute',
            bottom: '-8px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '3px',
            background: 'linear-gradient(90deg, transparent, var(--text-primary), transparent)',
            borderRadius: '2px'
          }}></div>
        </h1>
      </div>

      {/* Main Content Area - Two Column Layout */}
      <div style={{
        padding: '0 2rem 1rem 2rem',
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-start',
        flexWrap: 'wrap'
      }}>
        {/* Left Column - Personal Introduction */}
        <div style={{
          flex: '1',
          minWidth: '400px',
          maxWidth: '700px',
          marginLeft: '2rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '3rem',
            borderRadius: '20px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            border: '1px solid var(--border-default)',
            backdropFilter: 'blur(10px)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Subtle background pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.02,
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3), transparent 50%)',
              pointerEvents: 'none'
            }}></div>

            <div style={{
              position: 'relative',
              zIndex: 1,
              color: 'var(--text-primary)',
              fontSize: '18px',
              lineHeight: '1.8',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif',
              fontWeight: '400'
            }}>
              <p style={{
                marginBottom: '1.8rem',
                fontSize: '20px',
                fontWeight: '500',
                color: 'var(--text-primary)'
              }}>
                Hi, I'm <span style={{ fontWeight: '600', color: 'var(--text-primary)' }}>Yash</span>, a Systems Design Engineering student and aspiring Software Engineer.
              </p>

              <p style={{
                marginBottom: '1.8rem',
                color: 'var(--text-secondary)'
              }}>
                When I'm not coding, you'll probably find me gaming <em>(Call of Duty, Fortnite, and of course Clash Royale)</em>,
                working out, listening to music, or watching basketball.
              </p>

              <p style={{
                marginBottom: '1.8rem',
                color: 'var(--text-secondary)'
              }}>
                Right now, I'm navigating adulthood in <span style={{ fontWeight: '500' }}>Toronto</span>, living on my own, learning how to cook, and working toward
                becoming the best engineer I can be. My interests are in <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>backend and DevOps engineering</span>, where I love building
                features and scaling systems so they can handle real-world usage at scale.
              </p>

              <p style={{
                margin: '0',
                fontSize: '17px',
                color: 'var(--text-muted)',
                fontStyle: 'italic',
                textAlign: 'center',
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid var(--border-default)'
              }}>
                If you'd like to learn more about me, I'd love to chat. Feel free to reach out through email or LinkedIn.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Map */}
        <div style={{
          flex: '0 0 320px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '20px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid var(--border-default)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Subtle glow effect */}
            <div style={{
              position: 'absolute',
              top: '-50%',
              left: '-50%',
              width: '200%',
              height: '200%',
              background: 'radial-gradient(circle, rgba(41, 50, 65, 0.1) 0%, transparent 70%)',
              pointerEvents: 'none'
            }}></div>

            <h3 style={{
              color: 'var(--text-primary)',
              marginBottom: '1rem',
              fontSize: '20px',
              fontWeight: '600',
              position: 'relative',
              zIndex: 1,
              letterSpacing: '0.5px'
            }}>
              Currently in
            </h3>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <CurrentCityMap width={290} height={220} />
            </div>
          </div>
        </div>
      </div>

      {/* Click Me Button */}
      <ClickButton />


      {/* Spotify Widget */}
      <div style={{ padding: '0 2rem' }}>
        <div style={{
          maxWidth: '600px',
          margin: '0',
          marginLeft: '2rem'
        }}>
          <SpotifyWidget />
        </div>
      </div>

      {/* Additional spacing */}
      <div style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Empty space for clean look */}
        </div>
      </div>
    </div>
  );
};

export default Me;