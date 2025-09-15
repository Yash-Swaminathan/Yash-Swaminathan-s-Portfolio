const express = require('express');
const router = express.Router();
const spotifyService = require('../services/spotify');

/**
 * GET /api/spotify/music-data
 * Get user's top tracks, artists, and currently playing track
 */
router.get('/music-data', async (req, res) => {
  try {
    const musicData = await spotifyService.getMusicData();

    res.json({
      success: true,
      data: musicData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching music data:', error);

    // Return appropriate error response
    if (error.message.includes('Missing Spotify credentials')) {
      return res.status(500).json({
        success: false,
        message: 'Spotify integration not configured',
        error: 'Missing credentials'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to fetch music data',
      error: error.message
    });
  }
});

/**
 * GET /api/spotify/top-tracks
 * Get user's top tracks with optional time range
 */
router.get('/top-tracks', async (req, res) => {
  try {
    const { time_range = 'short_term', limit = 10 } = req.query;
    const topTracks = await spotifyService.getTopTracks(time_range, parseInt(limit));

    res.json({
      success: true,
      data: topTracks,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching top tracks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top tracks',
      error: error.message
    });
  }
});

/**
 * GET /api/spotify/top-artists
 * Get user's top artists with optional time range
 */
router.get('/top-artists', async (req, res) => {
  try {
    const { time_range = 'short_term', limit = 10 } = req.query;
    const topArtists = await spotifyService.getTopArtists(time_range, parseInt(limit));

    res.json({
      success: true,
      data: topArtists,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching top artists:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top artists',
      error: error.message
    });
  }
});

/**
 * GET /api/spotify/currently-playing
 * Get currently playing track
 */
router.get('/currently-playing', async (req, res) => {
  try {
    const currentlyPlaying = await spotifyService.getCurrentlyPlaying();

    res.json({
      success: true,
      data: currentlyPlaying,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching currently playing:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch currently playing track',
      error: error.message
    });
  }
});

module.exports = router;