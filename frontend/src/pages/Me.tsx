import React, { useState, useEffect } from 'react';
import ClickButton from '../components/ClickButton';
import SpotifyWidget from '../components/SpotifyWidget';
import CurrentCityMap from '../components/CurrentCityMap';
import AnimatedHeading from '../components/AnimatedHeading';
import SocialIcons from '../components/SocialIcons';
import Experience from '../components/Experience';

const Me: React.FC = () => {
  const [ageInDays, setAgeInDays] = useState(0);
  const [ageInYears, setAgeInYears] = useState(0);

  useEffect(() => {
    const calculateAge = () => {
      const birthDate = new Date('2006-04-21');
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - birthDate.getTime());
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);

      setAgeInDays(diffDays);
      setAgeInYears(parseFloat(diffYears.toFixed(1)));
    };

    calculateAge();
    // Update daily
    const interval = setInterval(calculateAge, 1000 * 60 * 60 * 24);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      paddingTop: '60px' // Account for header
    }}>
      {/* Animated Heading */}
      <AnimatedHeading />

      {/* Main Content Area - Full Width */}
      <div style={{
        padding: '0 2rem 1rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Personal Introduction - Full Width */}
        <div style={{
          marginLeft: '2rem',
          marginBottom: '2rem'
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
              lineHeight: '2',
              fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
              fontWeight: '400'
            }}>
              <div style={{ marginBottom: '2rem' }}>
                <p style={{ margin: '0.5rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
                  I'm currently based in <span style={{
                    textDecoration: 'underline',
                    textDecorationColor: 'var(--text-primary)',
                    fontWeight: '500',
                    color: 'var(--text-primary)'
                  }}>Toronto</span>.
                </p>
                <p style={{ margin: '0.5rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
                  I've been alive for{' '}
                  <span
                    style={{
                      textDecoration: 'underline',
                      textDecorationColor: 'var(--text-primary)',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      cursor: 'help',
                      position: 'relative'
                    }}
                    title={`${ageInYears} years old`}
                  >
                    {ageInDays.toLocaleString()} days
                  </span>.
                </p>
              </div>

              <div style={{
                marginBottom: '2rem'
              }}>
                <p style={{
                  margin: '0.3rem 0',
                  fontSize: '17px',
                  color: 'var(--text-secondary)'
                }}>
                  <span style={{ marginRight: '0.5rem' }}>›</span>
                  studying Systems Design Engineering at{' '}
                  <span style={{
                    fontWeight: '500',
                    color: 'var(--text-primary)'
                  }}>University of Waterloo</span>
                </p>
                <p style={{
                  margin: '0.3rem 0',
                  fontSize: '17px',
                  color: 'var(--text-secondary)'
                }}>
                  <span style={{ marginRight: '0.5rem' }}>›</span>
                  interested in backend engineering, DevOps, and building scalable systems
                </p>
                <p style={{
                  margin: '0.3rem 0',
                  fontSize: '17px',
                  color: 'var(--text-secondary)'
                }}>
                  <span style={{ marginRight: '0.5rem' }}>›</span>
                  passionate about stocks and momentum trading
                </p>
              </div>

              <div style={{
                marginBottom: '1.5rem',
                fontSize: '17px',
                color: 'var(--text-secondary)'
              }}>
                <p style={{ margin: '0.5rem 0', lineHeight: '1.8' }}>
                  When I'm not coding, you'll find me gaming <em>(Call of Duty, Fortnite, Clash Royale)</em>,
                  working out, listening to music, or watching basketball.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div style={{
          marginLeft: '2rem',
          display: 'flex',
          justifyContent: 'flex-start'
        }}>
          <div style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '1.5rem',
            borderRadius: '20px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
            border: '1px solid var(--border-default)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            width: 'fit-content'
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

      {/* Social Media Icons */}
      <div style={{
        padding: '2rem',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <div style={{
          backgroundColor: 'var(--bg-secondary)',
          padding: '2rem',
          borderRadius: '20px',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
          border: '1px solid var(--border-default)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background effect */}
          <div style={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(41, 50, 65, 0.05) 0%, transparent 70%)',
            pointerEvents: 'none'
          }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{
              color: 'var(--text-primary)',
              textAlign: 'center',
              marginBottom: '1.5rem',
              fontSize: '20px',
              fontWeight: '600',
              letterSpacing: '0.5px'
            }}>
              Let's Connect
            </h3>
            <SocialIcons />
          </div>
        </div>
      </div>

      {/* Experience Section */}
      <div style={{
        padding: '2rem',
        backgroundColor: 'var(--bg-primary)'
      }}>
        <Experience />
      </div>

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