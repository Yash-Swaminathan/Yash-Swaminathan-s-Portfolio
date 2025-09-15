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
        padding: '2rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '16px',
        border: '1px solid var(--border-default)',
        margin: '2rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-secondary)',
          fontSize: '16px'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid var(--text-secondary)',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            marginRight: '10px'
          }} />
          Loading music data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        padding: '2rem',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: '16px',
        border: '1px solid var(--border-default)',
        margin: '2rem',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          color: 'var(--text-secondary)',
          fontSize: '16px',
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
      padding: '2rem',
      backgroundColor: 'var(--bg-secondary)',
      borderRadius: '16px',
      border: '1px solid var(--border-default)',
      margin: '2rem',
      boxShadow: 'var(--shadow-lg)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'var(--text-primary)',
          margin: '0',
          display: 'flex',
          alignItems: 'center'
        }}>
          🎵 {(spotifyData.currentlyPlaying?.is_playing) ? 'Currently Vibing To' : 'Music Taste'}
        </h3>
      </div>

      {/* Currently Playing or Last Played */}
      {spotifyData.currentlyPlaying && spotifyData.currentlyPlaying.track && (
        <div style={{
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'var(--bg-primary)',
          borderRadius: '12px',
          border: '1px solid var(--border-default)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '8px',
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
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: '14px',
                color: 'var(--text-secondary)',
                marginBottom: '4px'
              }}>
                {(spotifyData.currentlyPlaying.is_playing) ? '🔴 Now Playing' : '⏸️ Last Played'}
              </div>
              <div style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-primary)',
                marginBottom: '2px'
              }}>
                {spotifyData.currentlyPlaying.track.name}
              </div>
              <div style={{
                fontSize: '14px',
                color: 'var(--text-secondary)'
              }}>
                {spotifyData.currentlyPlaying.track.artists.join(', ')}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Artists */}
      <div style={{ marginBottom: '2rem' }}>
        <h4 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          Top Artists This Month
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '1rem'
        }}>
          {spotifyData.topArtists.items.slice(0, 6).map((artist) => (
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
                padding: '0.75rem',
                borderRadius: '8px',
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
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                overflow: 'hidden',
                marginBottom: '0.5rem'
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
                fontSize: '14px',
                fontWeight: '500',
                color: 'var(--text-primary)',
                textAlign: 'center',
                lineHeight: '1.2'
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
          fontSize: '1.1rem',
          fontWeight: '600',
          color: 'var(--text-primary)',
          marginBottom: '1rem'
        }}>
          Top Tracks This Month
        </h4>
        <div style={{
          display: 'grid',
          gap: '0.75rem'
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
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '8px',
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
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                width: '20px',
                textAlign: 'center',
                flexShrink: 0
              }}>
                {index + 1}
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '6px',
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
                  fontSize: '15px',
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
                  fontSize: '13px',
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
        marginTop: '1.5rem',
        paddingTop: '1rem',
        borderTop: '1px solid var(--border-default)',
        fontSize: '12px',
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