const express = require('express');
const router = express.Router();
const buttonController = require('../controllers/buttonController');

// POST /api/buttons/click - Increment button click
router.post('/click', buttonController.incrementClick);

// GET /api/buttons/stats - Get all button statistics
router.get('/stats', buttonController.getClickStats);

// GET /api/buttons/:buttonName - Get specific button statistics
router.get('/:buttonName', buttonController.getButtonStats);

module.exports = router;