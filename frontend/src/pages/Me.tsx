import React, { useState, useEffect } from 'react';
import ClickButton from '../components/ClickButton';
import SpotifyWidget from '../components/SpotifyWidget';
import CurrentCityMap from '../components/CurrentCityMap';
import AnimatedHeading from '../components/AnimatedHeading';
import Experience from '../components/Experience';
import CodeQuote from '../components/CodeQuote';
import { useWindowSize } from '../hooks/useWindowSize';

const Me: React.FC = () => {
  const [ageInDays, setAgeInDays] = useState(0);
  const [ageInYears, setAgeInYears] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isManualScroll, setIsManualScroll] = useState(false);
  const { isMobile, width } = useWindowSize();

  const photos = [
    { src: '/photos/IMG_0387.jpg', caption: 'High School Graduation' },
    { src: '/photos/IMG_0827.JPG', caption: 'Vietnam' },
    { src: '/photos/9A57B475-2A9D-42D8-A60E-4D850C06B0A0.JPG', caption: 'Vietnam' },
    { src: '/photos/IMG_1900.jpg', caption: 'Me and My Girlfriend' },
    { src: '/photos/IMG_2510.JPG', caption: 'Me and My Girlfriend' },
    { src: '/photos/IMG_2261.JPG', caption: 'Grade 6 Me' },
    { src: '/photos/IMG_2314.jpg', caption: 'Rafting with Classmates' },
    { src: '/photos/IMG_9450.jpg', caption: 'Basketball' },
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
    // Rotate photos every 3 seconds, but pause for 5 seconds after manual scroll
    const photoInterval = setInterval(() => {
      if (!isManualScroll) {
        setCurrentPhotoIndex((prevIndex) => (prevIndex + 1) % photos.length);
      }
    }, 3000);
    return () => clearInterval(photoInterval);
  }, [isManualScroll, photos.length]);

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
        padding: isMobile ? '0 1rem 1rem' : '0 2rem 1rem 2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Personal Introduction - No Box */}
        <div style={{
          marginLeft: isMobile ? '0' : '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            color: 'var(--text-primary)',
            fontSize: '18px',
            lineHeight: '2',
            fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            fontWeight: '400'
          }}>
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
              <span
                style={{
                  textDecoration: 'underline',
                  textDecorationColor: 'var(--text-primary)',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  cursor: 'help',
                  fontSize: '17px',
                  position: 'relative'
                }}
                title={`${ageInDays.toLocaleString()} days old`}
                onMouseEnter={(e) => {
                  const tooltip = document.createElement('div');
                  tooltip.id = 'age-tooltip';
                  tooltip.textContent = `${ageInDays.toLocaleString()} days old`;
                  tooltip.style.cssText = `
                    position: absolute;
                    top: -40px;
                    left: 50%;
                    transform: translateX(-50%);
                    background-color: var(--bg-secondary);
                    color: var(--text-primary);
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    font-size: 18px;
                    font-weight: 500;
                    white-space: nowrap;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border: 1px solid var(--border-default);
                    z-index: 1000;
                  `;
                  e.currentTarget.appendChild(tooltip);
                }}
                onMouseLeave={(e) => {
                  const tooltip = document.getElementById('age-tooltip');
                  if (tooltip) tooltip.remove();
                }}
              >
                {ageInYears} years old
              </span>
            </p>
            <p style={{ margin: '0.3rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
              <span style={{ marginRight: '0.5rem' }}>›</span>
              A 2A student studying Systems Design Engineering at{' '}
              <span style={{ fontWeight: '500', color: 'var(--text-primary)' }}>University of Waterloo.</span>
            </p>
            <p style={{ margin: '0.3rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
              <span style={{ marginRight: '0.5rem' }}>›</span>
              Working at{' '}
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
              {' '}as a Software Engineer.
            </p>
            <p style={{ margin: '0.3rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
              <span style={{ marginRight: '0.5rem' }}>›</span>
              Focused on backend scalability and reliability engineering. Developing in typescript and python based applications.
            </p>
            <p style={{ margin: '0.3rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
              <span style={{ marginRight: '0.5rem' }}>›</span>
              I like Trading! Currently focused on swing trading leveraged Stocks and ETFs. I talk about it on {' '}
              <a
                href="https://x.com/YashSwaminathan"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  textDecoration: 'underline'
                }}
              >
                X(Twitter)
              </a>
            </p>
            <p style={{ margin: '0.3rem 0 3rem 0', fontSize: '17px', color: 'var(--text-secondary)' }}>
              <span style={{ marginRight: '0.5rem' }}>›</span>
              Aspiring to be a 10x engineer, get my CFA, and start my own company!
            </p>

            <p style={{ margin: '0.5rem 0 3rem 0', fontSize: '17px', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
              When I'm not coding, you'll find me gaming <em>(Call of Duty, Fortnite, Clash Royale)</em>, working out, listening to music, or watching basketball.
            </p>
          </div>
        </div>

        {/* Interactive Section Grid - Experience and Photo */}
        <div style={{
          marginLeft: isMobile ? '0' : '2rem',
          marginBottom: '3rem',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'auto auto',
          gap: '2rem',
          alignItems: 'start',
          width: isMobile ? '100%' : 'fit-content'
        }}>
          {/* Experience Section */}
          <div>
            <Experience />
          </div>

          {/* Photo Carousel */}
          <div style={{
            position: 'relative',
            width: isMobile ? '100%' : '500px',
            maxWidth: '100%'
          }}>
            {/* Photo Container */}
            <div
              style={{
                width: isMobile ? '100%' : '500px',
                height: isMobile ? '400px' : '600px',
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
                    if (diff > 0) {
                      // Swipe right - go to previous (or wrap to last)
                      setCurrentPhotoIndex(startIndex === 0 ? photos.length - 1 : startIndex - 1);
                    } else if (diff < 0) {
                      // Swipe left - go to next (or wrap to first)
                      setCurrentPhotoIndex(startIndex === photos.length - 1 ? 0 : startIndex + 1);
                    }
                    setTimeout(() => setIsManualScroll(false), 10000);
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
                    if (diff > 0) {
                      // Swipe right - go to previous (or wrap to last)
                      setCurrentPhotoIndex(startIndex === 0 ? photos.length - 1 : startIndex - 1);
                    } else if (diff < 0) {
                      // Swipe left - go to next (or wrap to first)
                      setCurrentPhotoIndex(startIndex === photos.length - 1 ? 0 : startIndex + 1);
                    }
                    setTimeout(() => setIsManualScroll(false), 10000);
                  }

                  document.removeEventListener('touchmove', handleTouchMove);
                  document.removeEventListener('touchend', handleTouchEnd);
                };

                document.addEventListener('touchmove', handleTouchMove);
                document.addEventListener('touchend', handleTouchEnd);
              }}
            >
              {photos.map((photo, index) => {
                const isAdjacent = Math.abs(index - currentPhotoIndex) <= 1 ||
                                   (currentPhotoIndex === 0 && index === photos.length - 1) ||
                                   (currentPhotoIndex === photos.length - 1 && index === 0);

                return (
                  <div
                    key={photo.src}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: isManualScroll ? `${(index - currentPhotoIndex) * 100}%` : 0,
                      width: '100%',
                      height: '100%',
                      transition: isManualScroll ? 'left 0.5s ease-out' : 'opacity 1s ease-in-out',
                      opacity: isManualScroll ? (isAdjacent || currentPhotoIndex === index ? 1 : 0) : (currentPhotoIndex === index ? 1 : 0),
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
                );
              })}
            </div>
          </div>
        </div>

        {/* Map, Button, and Daily Code Quote - Side by Side */}
        <div style={{
          marginLeft: isMobile ? '0' : '2rem',
          marginBottom: '3rem',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'auto auto auto',
          gap: '2rem',
          alignItems: 'start',
          width: isMobile ? '100%' : 'fit-content'
        }}>
          {/* Map Section */}
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
            position: 'relative',
            overflow: 'hidden',
            width: isMobile ? '100%' : 'fit-content'
          }}>
            {/* Text above map */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                color: 'var(--text-primary)',
                fontSize: isMobile ? '24px' : '30px',
                fontWeight: 'bold',
                marginBottom: '0.5rem',
                fontFamily: 'Inter, sans-serif'
              }}>
                Currently Based In
              </div>
              <div style={{
                color: 'var(--text-muted)',
                fontSize: isMobile ? '16px' : '20px',
                fontWeight: 'normal',
                fontFamily: 'Inter, sans-serif'
              }}>
                Drag to explore
              </div>
            </div>

            {/* Map */}
            <div style={{
              width: isMobile ? '100%' : '180px',
              height: isMobile ? 'auto' : '180px',
              aspectRatio: '1 / 1',
              borderRadius: '8px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CurrentCityMap
                width={isMobile ? Math.min(width - 100, 300) : 180}
                height={isMobile ? Math.min(width - 100, 300) : 180}
              />
            </div>
          </div>

          {/* Click Me Button */}
          <ClickButton />

          {/* Daily Code Quote */}
          <div>
            <CodeQuote />
          </div>
        </div>
      </div>

      {/* Spotify Widget - Full Width at Bottom */}
      <SpotifyWidget />

      {/* Bottom spacing */}
      <div style={{ padding: '2rem' }}></div>
    </div>
  );
};

export default Me;
