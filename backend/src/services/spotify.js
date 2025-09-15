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
  }

  /**
   * Get access token using refresh token
   */
  async getAccessToken() {
    if (!process.env.SPOTIFY_REFRESH_TOKEN || !process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
      throw new Error('Missing Spotify credentials in environment variables');
    }

    try {
      const response = await axios.post(this.tokenURL,
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
          client_id: process.env.SPOTIFY_CLIENT_ID,
          client_secret: process.env.SPOTIFY_CLIENT_SECRET
        }), {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error getting Spotify access token:', error.response?.data || error.message);
      throw new Error('Failed to get Spotify access token');
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

      return response.data;
    } catch (error) {
      console.error(`Error making Spotify API request to ${endpoint}:`, error.response?.data || error.message);
      throw new Error(`Failed to fetch data from Spotify: ${endpoint}`);
    }
  }

  /**
   * Get top tracks for different time ranges
   */
  async getTopTracks(timeRange = 'short_term', limit = 10) {
    const endpoint = `/me/top/tracks?time_range=${timeRange}&limit=${limit}`;
    return await this.makeSpotifyRequest(endpoint);
  }

  /**
   * Get top artists for different time ranges
   */
  async getTopArtists(timeRange = 'short_term', limit = 10) {
    const endpoint = `/me/top/artists?time_range=${timeRange}&limit=${limit}`;
    return await this.makeSpotifyRequest(endpoint);
  }

  /**
   * Get currently playing track
   */
  async getCurrentlyPlaying() {
    try {
      return await this.makeSpotifyRequest('/me/player/currently-playing');
    } catch (error) {
      // It's normal for this to fail if nothing is playing
      return null;
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
        this.getTopArtists('short_term', 6), // Last 4 weeks
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