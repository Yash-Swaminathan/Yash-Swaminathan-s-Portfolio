import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Track {
  id: string;
  name: string;
  artists: string[];
  album: {
    name: string;
    images: Array<{ url: string; height: number; width: number }>;
  };
  external_urls: { spotify: string };
  preview_url?: string;
}

interface Artist {
  id: string;
  name: string;
  genres: string[];
  images: Array<{ url: string; height: number; width: number }>;
  external_urls: { spotify: string };
  followers: { total: number };
}

interface CurrentlyPlaying {
  is_playing: boolean;
  track: Track | null;
}

interface SpotifyData {
  topTracks: { items: Track[] };
  topArtists: { items: Artist[] };
  currentlyPlaying: CurrentlyPlaying | null;
  cached: boolean;
  lastUpdated: number;
}

const API_BASE_URL = process.env.REACT_APP_API_URL?.replace(/\/$/, '') || 'http://localhost:3001';

const SpotifyWidget: React.FC = () => {
  const [spotifyData, setSpotifyData] = useState<SpotifyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSpotifyData();
  }, []);

  const fetchSpotifyData = async () => {
    try {
      setLoading(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(`${API_BASE_URL}/api/spotify/music-data`, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 429) {
          setError('Rate limit exceeded. Please wait a moment before refreshing.');
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSpotifyData(result.data);
      } else {
        setError(result.message || 'Failed to load music data');
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timed out. Please check your connection.');
      } else if (err.message.includes('fetch')) {
        setError('Unable to connect to music service');
      } else {
        setError('Failed to load music data');
      }
      console.error('Error fetching Spotify data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (images: Array<{ url: string; height: number; width: number }>) => {
    return images && images.length > 0 ? images[images.length - 1].url : '';
  };

  if (loading) {
    return (
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '16px',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '320px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontSize: '13px'
        }}>
          <div style={{
            width: '16px',
            height: '16px',
            border: '2px solid var(--text-secondary)',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '8px'
          }} />
          Loading music data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '1.5rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '16px',
        border: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: '320px'
      }}>
        <div style={{
          color: 'var(--text-secondary)',
          fontSize: '13px',
          textAlign: 'center'
        }}>
          🎵 Music data temporarily unavailable
        </div>
      </div>
    );
  }

  if (!spotifyData) return null;

  return (
    <section style={{
      padding: '4rem 1.5rem',
      position: 'relative',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{
        marginBottom: '2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem',
        flexWrap: 'wrap'
      }}>
        <h2 style={{
          fontSize: 'clamp(2rem, 4vw, 2.5rem)',
          fontWeight: '700',
          color: 'var(--text-primary)',
          margin: 0,
          letterSpacing: '-0.03em',
          fontFamily: 'Inter, sans-serif'
        }}>
          I also love music this is what I listen to!
        </h2>
        <a
          href="https://open.spotify.com/user/yeq062vvc2vmx1sq0rwew7gz9"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '0.625rem 1.25rem',
            borderRadius: '8px',
            border: '1px solid var(--border-default)',
            fontSize: '0.9375rem',
            fontWeight: '500',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            transition: 'all 0.15s ease',
            backgroundColor: 'var(--bg-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--text-primary)';
            e.currentTarget.style.color = 'var(--bg-primary)';
            e.currentTarget.style.borderColor = 'var(--text-primary)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
            e.currentTarget.style.color = 'var(--text-primary)';
            e.currentTarget.style.borderColor = 'var(--border-default)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>Add me on Spotify</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7V17"/>
          </svg>
        </a>
      </div>

      {/* Currently Playing (Full Width) */}
      {spotifyData.currentlyPlaying && spotifyData.currentlyPlaying.track && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            marginBottom: '2rem',
            padding: '1.5rem 1.75rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: '12px',
            border: '1px solid var(--border-default)',
            boxShadow: '0 0 0 1px var(--border-default), 0 4px 12px rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '10px',
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid var(--border-default)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)'
            }}>
              <img
                src={getImageUrl(spotifyData.currentlyPlaying.track.album.images)}
                alt={spotifyData.currentlyPlaying.track.album.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                {spotifyData.currentlyPlaying.is_playing ? (
                  <>
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      backgroundColor: '#1DB954',
                      borderRadius: '50%',
                      marginRight: '0.5rem'
                    }}></span>
                    Now Playing
                  </>
                ) : (
                  <>
                    <span style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      backgroundColor: 'var(--text-secondary)',
                      borderRadius: '50%',
                      marginRight: '0.5rem'
                    }}></span>
                    Last Played
                  </>
                )}
              </div>
              <div style={{
                fontSize: '1.125rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.375rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                letterSpacing: '-0.01em'
              }}>
                {spotifyData.currentlyPlaying.track.name}
              </div>
              <div style={{
                fontSize: '0.9375rem',
                color: 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {spotifyData.currentlyPlaying.track.artists.join(', ')}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Two Column Grid */}
      <div style={{
        display: 'grid',
        gap: '2rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))'
      }}>
        {/* Top Artists Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            borderRadius: '12px',
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-secondary)',
            boxShadow: '0 0 0 1px var(--border-default), 0 4px 12px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}
        >
          <div style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-primary)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.01em'
            }}>
              Top Artists
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: '0.25rem 0 0',
              fontWeight: '400'
            }}>
              This month
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '1.5rem',
            padding: '2rem 1.75rem'
          }}>
            {spotifyData.topArtists.items.slice(0, 4).map((artist) => (
              <a
                key={artist.id}
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.75rem',
                  transition: 'transform 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '96px',
                  height: '96px',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '2px solid var(--border-default)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
                  flexShrink: 0
                }}>
                  <img
                    src={getImageUrl(artist.images)}
                    alt={artist.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    loading="lazy"
                  />
                </div>
                <p style={{
                  margin: 0,
                  fontSize: '0.9375rem',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  textAlign: 'center',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  width: '100%',
                  padding: '0 0.5rem'
                }}>
                  {artist.name}
                </p>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Top Tracks Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut', delay: 0.1 }}
          style={{
            borderRadius: '12px',
            border: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-secondary)',
            boxShadow: '0 0 0 1px var(--border-default), 0 4px 12px rgba(0, 0, 0, 0.05)',
            overflow: 'hidden'
          }}
        >
          <div style={{
            padding: '1.5rem 1.75rem',
            borderBottom: '1px solid var(--border-default)',
            backgroundColor: 'var(--bg-primary)'
          }}>
            <h3 style={{
              fontSize: '1.125rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0,
              letterSpacing: '-0.01em'
            }}>
              Top Tracks
            </h3>
            <p style={{
              fontSize: '0.875rem',
              color: 'var(--text-secondary)',
              margin: '0.25rem 0 0',
              fontWeight: '400'
            }}>
              This month
            </p>
          </div>

          <ol style={{
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {spotifyData.topTracks.items.slice(0, 4).map((track, index) => (
              <li key={track.id} style={{
                borderBottom: index < 3 ? '1px solid var(--border-default)' : 'none'
              }}>
                <a
                  href={track.external_urls.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1.25rem 1.75rem',
                    transition: 'background-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    width: '1.5rem',
                    textAlign: 'center',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: 'var(--text-secondary)',
                    fontVariantNumeric: 'tabular-nums',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid var(--border-default)',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)'
                  }}>
                    <img
                      src={getImageUrl(track.album.images)}
                      alt={track.album.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      margin: 0,
                      fontSize: '0.9375rem',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: '1.4',
                      marginBottom: '0.25rem'
                    }}>
                      {track.name}
                    </p>
                    <p style={{
                      margin: 0,
                      fontSize: '0.875rem',
                      color: 'var(--text-secondary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}>
                      {track.artists.join(', ')}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ol>
        </motion.div>
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </section>
  );
};

export default SpotifyWidget;