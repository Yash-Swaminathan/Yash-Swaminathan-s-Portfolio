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

      const response = await fetch('http://localhost:3001/api/spotify/music-data', {
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
      padding: '2.5rem 1rem',
      position: 'relative',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: -1,
        background: 'linear-gradient(to bottom, rgba(16, 185, 129, 0.1), transparent)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap'
      }}>
        <div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 1.875rem)',
            fontWeight: '600',
            color: 'var(--text-primary)',
            margin: '0 0 0.25rem 0',
            letterSpacing: '-0.025em'
          }}>
            What I listen to
          </h2>
          <p style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            margin: 0,
            opacity: 0.8
          }}>
            Updated {spotifyData.cached ? 'recently' : 'just now'}
          </p>
        </div>
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '9999px',
            border: '1px solid var(--border-default)',
            fontSize: '0.875rem',
            fontWeight: '500',
            textDecoration: 'none',
            color: 'var(--text-primary)',
            transition: 'all 0.2s',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--text-primary)';
            e.currentTarget.style.color = 'var(--bg-primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          Open in Spotify
        </a>
      </div>

      {/* Currently Playing (Full Width) */}
      {spotifyData.currentlyPlaying && spotifyData.currentlyPlaying.track && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(var(--card-rgb, 255, 255, 255), 0.6)',
            backdropFilter: 'blur(8px)',
            borderRadius: '1rem',
            border: '1px solid var(--border-default)'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '8px',
              overflow: 'hidden',
              flexShrink: 0,
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
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
                fontSize: '0.75rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.25rem',
                fontWeight: '500'
              }}>
                {spotifyData.currentlyPlaying.is_playing ? '🟢 Now Playing' : '⏸️ Last Played'}
              </div>
              <div style={{
                fontSize: '1rem',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '0.25rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {spotifyData.currentlyPlaying.track.name}
              </div>
              <div style={{
                fontSize: '0.875rem',
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
        gap: '1.5rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))'
      }}>
        {/* Top Artists Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{
            borderRadius: '1rem',
            border: '1px solid var(--border-default)',
            backgroundColor: 'rgba(var(--card-rgb, 255, 255, 255), 0.6)',
            backdropFilter: 'blur(8px)',
            overflow: 'hidden'
          }}
        >
          <div style={{
            padding: '1.25rem 1.25rem 0.75rem',
            borderBottom: '1px solid var(--border-default)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Top Artists (this month)
            </h3>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))',
            gap: '1rem',
            padding: '1.25rem'
          }}>
            {spotifyData.topArtists.items.slice(0, 12).map((artist) => (
              <a
                key={artist.id}
                href={artist.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  display: 'block',
                  textAlign: 'center',
                  transition: 'transform 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.03)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  border: '1px solid var(--border-default)',
                  boxShadow: 'inset 0 0 16px rgba(0,0,0,0.25)'
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
                  marginTop: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  padding: '0 0.25rem'
                }}>
                  {artist.name}
                </p>
              </a>
            ))}
          </div>
        </motion.div>

        {/* Top Tracks Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          style={{
            borderRadius: '1rem',
            border: '1px solid var(--border-default)',
            backgroundColor: 'rgba(var(--card-rgb, 255, 255, 255), 0.6)',
            backdropFilter: 'blur(8px)',
            overflow: 'hidden'
          }}
        >
          <div style={{
            padding: '1.25rem 1.25rem 0.75rem',
            borderBottom: '1px solid var(--border-default)'
          }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              margin: 0
            }}>
              Top Tracks (this month)
            </h3>
          </div>

          <ol style={{
            listStyle: 'none',
            margin: 0,
            padding: 0
          }}>
            {spotifyData.topTracks.items.slice(0, 10).map((track, index) => (
              <li key={track.id} style={{
                borderBottom: index < 9 ? '1px solid var(--border-default)' : 'none'
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
                    padding: '1rem',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <div style={{
                    width: '1.5rem',
                    textAlign: 'right',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    color: 'var(--text-secondary)',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {index + 1}
                  </div>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid var(--border-default)'
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
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      color: 'var(--text-primary)',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      lineHeight: '1.3'
                    }}>
                      {track.name}
                    </p>
                    <p style={{
                      margin: '0.125rem 0 0',
                      fontSize: '0.8125rem',
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

      {/* Footer */}
      <p style={{
        marginTop: '1.5rem',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)',
        textAlign: 'center',
        opacity: 0.8
      }}>
        Data via Spotify • Private listening respected • Cached for performance
      </p>

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