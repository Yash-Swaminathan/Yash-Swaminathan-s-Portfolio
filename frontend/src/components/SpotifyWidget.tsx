import React, { useState, useEffect } from 'react';

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
    <div style={{
      padding: '1.5rem',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '16px',
      border: '1px solid var(--border-default)',
      boxShadow: 'var(--shadow-lg)',
      width: '100%',
      maxWidth: '320px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          margin: '0',
          display: 'flex',
          alignItems: 'center'
        }}>
           {'What I listen to!'}
        </h3>
      </div>

      {/* Currently Playing or Last Played */}
      {spotifyData.currentlyPlaying && spotifyData.currentlyPlaying.track && (
        <div style={{
          marginBottom: '1.5rem',
          padding: '0.75rem',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '8px',
          border: '1px solid var(--border-default)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '6px',
              overflow: 'hidden',
              flexShrink: 0
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
                fontSize: '11px',
                color: 'var(--text-secondary)',
                marginBottom: '2px'
              }}>
                {(spotifyData.currentlyPlaying.is_playing) ? '🟢 Now Playing' : '⏸️ Last Played'}
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '2px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {spotifyData.currentlyPlaying.track.name}
              </div>
              <div style={{
                fontSize: '12px',
                color: 'var(--text-secondary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {spotifyData.currentlyPlaying.track.artists.join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Artists */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{
          fontSize: '0.9rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '0.75rem'
        }}>
          Top Artists This Month
        </h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {spotifyData.topArtists.items.slice(0, 8).map((artist) => (
            <a
              key={artist.id}
              href={artist.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.5rem',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                overflow: 'hidden',
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
                />
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flex: 1
              }}>
                {artist.name}
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Top Tracks */}
      <div>
        <h4 style={{
          fontSize: '0.9rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '0.75rem'
        }}>
          Top Tracks This Month
        </h4>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          {spotifyData.topTracks.items.slice(0, 5).map((track, index) => (
            <a
              key={track.id}
              href={track.external_urls.spotify}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem',
                borderRadius: '6px',
                transition: 'background-color 0.2s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <div style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                width: '16px',
                textAlign: 'center',
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '4px',
                overflow: 'hidden',
                flexShrink: 0
              }}>
                <img
                  src={getImageUrl(track.album.images)}
                  alt={track.album.name}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '500',
                  color: 'var(--text-primary)',
                  marginBottom: '2px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {track.name}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {track.artists.join(', ')}
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '1rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid var(--border-default)',
        fontSize: '10px',
        color: 'var(--text-secondary)',
        textAlign: 'center'
      }}>
        Data from Spotify • Updated {spotifyData.cached ? 'recently' : 'just now'}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default SpotifyWidget;