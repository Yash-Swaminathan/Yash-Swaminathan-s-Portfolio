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
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isManualScroll, setIsManualScroll] = useState(false);

  const photos = [
    { src: '/photos/IMG_0387.jpg', caption: 'High School Graduation with Friends' },
    { src: '/photos/IMG_0827.JPG', caption: 'Vietnam' },
    { src: '/photos/9A57B475-2A9D-42D8-A60E-4D850C06B0A0.JPG', caption: 'Vietnam' },
    { src: '/photos/IMG_1900.jpg', caption: 'Me and My Girlfriend' },
    { src: '/photos/IMG_2510.JPG', caption: 'Me and My Girlfriend' },
    { src: '/photos/IMG_2261.JPG', caption: 'Grade 6 Me' },
    { src: '/photos/IMG_2314.jpg', caption: 'Rafting with Classmates' },
    { src: '/photos/IMG_9450.jpg', caption: 'Me Playing Basketball' },
    { src: '/photos/IMG_9764.JPG', caption: 'Shibuya, Japan' },
    { src: '/photos/IMG_9795.jpg', caption: 'Tokyo, Japan' }
  ];

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

  useEffect(() => {
    // Rotate photos every 3 seconds
    const photoInterval = setInterval(() => {
      setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, 3000);
    return () => clearInterval(photoInterval);
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
        {/* Personal Introduction - No Box */}
        <div style={{
          marginLeft: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            color: 'var(--text-primary)',
            fontSize: '18px',
            lineHeight: '2',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: '400'
          }}>
            <p style={{ margin: '0.5rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
              I am{' '}
              <span
                style={{
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--text-primary)',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  cursor: 'help'
                }}
                title={`${ageInDays.toLocaleString()} days old`}
              >
                {ageInYears} years old
              </span>.
            </p>
            <p style={{ margin: '0.5rem 0 2rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
              I've visited{' '}
              <span style={{
                textDecoration: 'underline',
                textDecorationColor: 'var(--text-primary)',
                fontWeight: '500',
                color: 'var(--text-primary)'
              }}>25 countries</span>{' '}
              so far!
            </p>

            <h2 style={{
              fontSize: '24px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '1.5rem',
              letterSpacing: '0.5px'
            }}>
              I'm currently...
            </h2>

            <p style={{ margin: '0.3rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
              <span style={{ marginRight: '0.5rem' }}>›</span>
              2A student studying Systems Design Engineering at{' '}
              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>University of Waterloo</span>
            </p>
            <p style={{ margin: '0.3rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
              <span style={{ marginRight: '0.5rem' }}>›</span>
              working at{' '}
              <a
                href="https://www.micromart.com/smart-store"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  textDecoration: 'underline'
                }}
              >
                Micromart
              </a>
              {' '}as a Software Engineer
            </p>
            <p style={{ margin: '0.3rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
              <span style={{ marginRight: '0.5rem' }}>›</span>
              focused on scalability and reliability using FastAPI
            </p>
            <p style={{ margin: '0.3rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
              <span style={{ marginRight: '0.5rem' }}>›</span>
              actively trading leveraged ETFs (TQQQ, SQQQ, SOXL)
            </p>
            <p style={{ margin: '0.3rem 0 3rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
              <span style={{ marginRight: '0.5rem' }}>›</span>
              aspiring to be a 10x engineer, get my CFA, and start my own company
            </p>

            <p style={{ margin: '0.5rem 0 3rem 0', fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              When I'm not coding, you'll find me gaming <em>(Call of Duty, Fortnite, Clash Royale)</em>, working out, listening to music, or watching basketball.
            </p>
          </div>
        </div>

        {/* Photo Carousel - Below text */}
        <div style={{
          marginLeft: '2rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            position: 'relative',
            width: '400px'
          }}>
            {/* Photo Container */}
            <div
              style={{
                width: '400px',
                height: '500px',
                borderRadius: '12px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)',
                position: 'relative',
                cursor: 'grab',
                userSelect: 'none'
              }}
              onMouseDown={(e) => {
                const startX = e.clientX;
                const startIndex = currentPhotoIndex;
                const containerElement = e.currentTarget as HTMLElement;
                let isDragging = false;

                const handleMouseMove = (moveEvent: MouseEvent) => {
                  const diff = moveEvent.clientX - startX;
                  if (Math.abs(diff) > 5) {
                    isDragging = true;
                    containerElement.style.cursor = 'grabbing';
                  }
                };

                const handleMouseUp = (upEvent: MouseEvent) => {
                  const diff = upEvent.clientX - startX;

                  if (isDragging && Math.abs(diff) > 50) {
                    setIsManualScroll(true);
                    if (diff > 0 && startIndex > 0) {
                      setCurrentPhotoIndex(startIndex - 1);
                    } else if (diff < 0 && startIndex < photos.length - 1) {
                      setCurrentPhotoIndex(startIndex + 1);
                    }
                    setTimeout(() => setIsManualScroll(false), 600);
                  }

                  containerElement.style.cursor = 'grab';
                  document.removeEventListener('mousemove', handleMouseMove);
                  document.removeEventListener('mouseup', handleMouseUp);
                };

                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
              }}
              onTouchStart={(e) => {
                const startX = e.touches[0].clientX;
                const startIndex = currentPhotoIndex;

                const handleTouchMove = (moveEvent: TouchEvent) => {
                  // Track movement
                };

                const handleTouchEnd = (endEvent: TouchEvent) => {
                  const diff = endEvent.changedTouches[0].clientX - startX;

                  if (Math.abs(diff) > 50) {
                    setIsManualScroll(true);
                    if (diff > 0 && startIndex > 0) {
                      setCurrentPhotoIndex(startIndex - 1);
                    } else if (diff < 0 && startIndex < photos.length - 1) {
                      setCurrentPhotoIndex(startIndex + 1);
                    }
                    setTimeout(() => setIsManualScroll(false), 600);
                  }

                  document.removeEventListener('touchmove', handleTouchMove);
                  document.removeEventListener('touchend', handleTouchEnd);
                };

                document.addEventListener('touchmove', handleTouchMove);
                document.addEventListener('touchend', handleTouchEnd);
              }}
            >
              {photos.map((photo, index) => (
                <div
                  key={photo.src}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: isManualScroll ? `${(index - currentPhotoIndex) * 100}%` : 0,
                    width: '100%',
                    height: '100%',
                    transition: isManualScroll ? 'left 0.5s ease-out' : 'opacity 1s ease-in-out',
                    opacity: currentPhotoIndex === index ? 1 : 0,
                    pointerEvents: currentPhotoIndex === index ? 'auto' : 'none'
                  }}
                >
                  <img
                    src={photo.src}
                    alt={photo.caption}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      userSelect: 'none'
                    }}
                    draggable={false}
                  />
                  {/* Caption Overlay with Dots */}
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                    padding: '2rem 1rem 1rem 1rem',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    <div style={{ marginBottom: '0.5rem' }}>{photo.caption}</div>
                    {/* Navigation Dots */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '8px'
                    }}>
                      {photos.map((_, dotIndex) => (
                        <div
                          key={dotIndex}
                          style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: currentPhotoIndex === dotIndex ? 'white' : 'rgba(255,255,255,0.4)',
                            transition: 'background-color 0.3s ease'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
              marginBottom: '0.5rem',
              fontSize: '20px',
              fontWeight: '600',
              position: 'relative',
              zIndex: 1,
              letterSpacing: '0.5px'
            }}>
              Currently based in
            </h3>
            <p style={{
              color: 'var(--text-muted)',
              fontSize: '14px',
              marginBottom: '1rem',
              position: 'relative',
              zIndex: 1,
              fontStyle: 'italic'
            }}>
              Drag around to explore the map
            </p>
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
        padding: '2rem 2rem 2rem 4rem',
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