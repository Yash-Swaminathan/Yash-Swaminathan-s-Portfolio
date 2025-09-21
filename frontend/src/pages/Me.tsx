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
      <div style={{ padding: '2rem 2rem 1rem 2rem' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          textAlign: 'center',
          marginBottom: '2rem',
          fontFamily: 'Georgia, serif'
        }}>
          Me
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
          maxWidth: '600px',
          marginLeft: '2rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '2rem',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-default)'
          }}>
            <div style={{
              color: 'var(--text-primary)',
              fontSize: '22px',
              lineHeight: '1.7',
              fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
            }}>
              <p style={{ marginBottom: '1.2rem' }}>
                Hi, I'm Yash, a Systems Design Engineering student and aspiring Software Engineer.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                When I'm not coding, you'll probably find me gaming (Call of Duty, Fortnite, and of course Clash Royale),
                working out, listening to music, or watching basketball.
              </p>

              <p style={{ marginBottom: '1.2rem' }}>
                Right now, I'm navigating adulthood in Toronto, living on my own, learning how to cook, and working toward
                becoming the best engineer I can be. My interests are in backend and DevOps engineering, where I love building
                features and scaling systems so they can handle real-world usage at scale.
              </p>

              <p style={{ margin: '0' }}>
                If you'd like to learn more about me, I'd love to chat. Feel free to reach out through email or LinkedIn.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - Map */}
        <div style={{
          flex: '0 0 300px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1rem',
            borderRadius: '16px',
            boxShadow: 'var(--shadow-lg)',
            border: '1px solid var(--border-default)',
            textAlign: 'center'
          }}>
            <h3 style={{
              color: 'var(--text-primary)',
              marginBottom: '0.5rem',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Currently in
            </h3>
            <CurrentCityMap width={280} height={200} />
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