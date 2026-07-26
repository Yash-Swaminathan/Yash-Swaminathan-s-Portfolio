const axios = require('axios');

class SpotifyService {
  constructor() {
    this.baseURL = 'https://api.spotify.com/v1';
    this.tokenURL = 'https://accounts.spotify.com/api/token';
    this.cachedData = {
      topTracks: null,
      topArtists: null,
      currentlyPlaying: null,
      lastUpdated: null
    };
    this.CACHE_DURATION = 1000 * 60 * 30; // 30 minutes
    // Access token cache (tokens are valid ~1 hour)
    this.accessToken = null;
    this.accessTokenExpiresAt = 0;
  }

  /**
   * Get access token using refresh token, cached until shortly before expiry.
   */
  async getAccessToken() {
    if (!process.env.SPOTIFY_REFRESH_TOKEN || !process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new Error('Missing Spotify credentials in environment variables');
    }

    // Reuse a still-valid token (60s safety buffer) to avoid re-fetching on every call
    if (this.accessToken && Date.now() < this.accessTokenExpiresAt - 60_000) {
      return this.accessToken;
    }

    try {
      const clientId = process.env.SPOTIFY_CLIENT_ID.trim();
      const clientSecret = process.env.SPOTIFY_CLIENT_SECRET.trim();
      const refreshToken = process.env.SPOTIFY_REFRESH_TOKEN.trim();

      // Base64 encode client_id:client_secret for Authorization header
      const authString = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const response = await axios.post(this.tokenURL,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${authString}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.accessTokenExpiresAt = Date.now() + (response.data.expires_in || 3600) * 1000;
      return this.accessToken;
    } catch (error) {
      const spotifyError = error.response?.data;
      console.error('Error getting Spotify access token:', spotifyError || error.message);
      // Surface Spotify's real reason (e.g. invalid_grant = revoked/expired refresh token,
      // invalid_client = wrong client id/secret) so failures are diagnosable.
      const detail = spotifyError
        ? `${spotifyError.error || 'error'}: ${spotifyError.error_description || ''}`.trim()
        : error.message;
      const err = new Error(`Failed to get Spotify access token (${detail})`);
      err.status = error.response?.status;
      throw err;
    }
  }

  /**
   * Make authenticated request to Spotify API
   */
  async makeSpotifyRequest(endpoint) {
    const accessToken = await this.getAccessToken();

    try {
      const response = await axios.get(`${this.baseURL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      return { status: response.status, data: response.data };
    } catch (error) {
      const spotifyError = error.response?.data;
      console.error(`Error making Spotify API request to ${endpoint}:`, spotifyError || error.message);
      const detail = spotifyError?.error?.message || spotifyError?.error || error.message;
      const err = new Error(`Failed to fetch data from Spotify (${endpoint}): ${detail}`);
      err.status = error.response?.status;
      throw err;
    }
  }

  /**
   * Get top tracks for different time ranges
   */
  async getTopTracks(timeRange = 'short_term', limit = 10) {
    const endpoint = `/me/top/tracks?time_range=${timeRange}&limit=${limit}`;
    const { data } = await this.makeSpotifyRequest(endpoint);
    return data;
  }

  /**
   * Get top artists for different time ranges
   */
  async getTopArtists(timeRange = 'short_term', limit = 10) {
    const endpoint = `/me/top/artists?time_range=${timeRange}&limit=${limit}`;
    const { data } = await this.makeSpotifyRequest(endpoint);
    return data;
  }

  /**
   * Get currently playing track. Spotify returns HTTP 204 (no content) when nothing
   * is playing - that is the only case we treat as "null". Real errors (401/403 etc.)
   * are rethrown so they are not silently masked.
   */
  async getCurrentlyPlaying() {
    try {
      const { status, data } = await this.makeSpotifyRequest('/me/player/currently-playing');
      // 204 = nothing playing; empty body also means nothing playing
      if (status === 204 || !data) {
        return null;
      }
      return data;
    } catch (error) {
      // 404 can occur when there is no active device; treat as "nothing playing".
      if (error.status === 404 || error.status === 204) {
        return null;
      }
      // Auth/scope/other errors must propagate so they are surfaced, not hidden.
      throw error;
    }
  }

  /**
   * Check if cache is still valid
   */
  isCacheValid() {
    return this.cachedData.lastUpdated &&
           (Date.now() - this.cachedData.lastUpdated) < this.CACHE_DURATION;
  }

  /**
   * Get comprehensive music data with caching
   */
  async getMusicData() {
    // Always fetch fresh currently playing data
    const currentlyPlaying = await this.getCurrentlyPlaying();

    // Return cached data for top tracks/artists if still valid, but always fresh currently playing
    if (this.isCacheValid() && this.cachedData.topTracks && this.cachedData.topArtists) {
      console.log('🎵 Returning cached Spotify data with fresh currently playing');
      return {
        topTracks: this.cachedData.topTracks,
        topArtists: this.cachedData.topArtists,
        currentlyPlaying: currentlyPlaying ? {
          is_playing: currentlyPlaying.is_playing || false,
          track: currentlyPlaying.item ? {
            id: currentlyPlaying.item.id,
            name: currentlyPlaying.item.name,
            artists: currentlyPlaying.item.artists.map(artist => artist.name),
            album: {
              name: currentlyPlaying.item.album.name,
              images: currentlyPlaying.item.album.images
            },
            external_urls: currentlyPlaying.item.external_urls
          } : null
        } : null,
        cached: true,
        lastUpdated: this.cachedData.lastUpdated
      };
    }

    try {
      console.log('🎵 Fetching fresh Spotify data...');

      // Fetch top tracks and artists (currentlyPlaying already fetched above)
      const [topTracksShort, topArtistsShort] = await Promise.all([
        this.getTopTracks('short_term', 8), // Last 4 weeks
        this.getTopArtists('short_term', 8), // Last 4 weeks - exactly 8 artists
      ]);

      // Process and cache the data
      this.cachedData = {
        topTracks: {
          items: topTracksShort.items.map(track => ({
            id: track.id,
            name: track.name,
            artists: track.artists.map(artist => artist.name),
            album: {
              name: track.album.name,
              images: track.album.images
            },
            external_urls: track.external_urls,
            preview_url: track.preview_url
          }))
        },
        topArtists: {
          items: topArtistsShort.items.map(artist => ({
            id: artist.id,
            name: artist.name,
            genres: artist.genres,
            images: artist.images,
            external_urls: artist.external_urls,
            followers: artist.followers
          }))
        },
        lastUpdated: Date.now()
      };

      console.log('✅ Spotify data cached successfully');

      return {
        topTracks: this.cachedData.topTracks,
        topArtists: this.cachedData.topArtists,
        currentlyPlaying: currentlyPlaying ? {
          is_playing: currentlyPlaying.is_playing || false,
          track: currentlyPlaying.item ? {
            id: currentlyPlaying.item.id,
            name: currentlyPlaying.item.name,
            artists: currentlyPlaying.item.artists.map(artist => artist.name),
            album: {
              name: currentlyPlaying.item.album.name,
              images: currentlyPlaying.item.album.images
            },
            external_urls: currentlyPlaying.item.external_urls
          } : null
        } : null,
        cached: false,
        lastUpdated: this.cachedData.lastUpdated
      };

    } catch (error) {
      console.error('Error fetching Spotify music data:', error);
      throw error;
    }
  }
}

module.exports = new SpotifyService();