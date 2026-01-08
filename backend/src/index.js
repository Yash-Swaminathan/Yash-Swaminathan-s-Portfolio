const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config({ path: '../.env' });

// Import routes
const buttonRoutes = require('./routes/buttons');
const spotifyRoutes = require('./routes/spotify');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy - required for Vercel
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// Rate limiting - More permissive for development
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // much higher limit for development
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

// CORS configuration - Allow all origins for now (can restrict later)
app.use(cors({
  origin: '*', // Allow all origins
  credentials: false, // Must be false when origin is '*'
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Handle preflight requests explicitly
app.options('*', cors());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Yash Portfolio Backend'
  });
});

// Supabase heartbeat - keeps free-tier project from pausing after 7 days of inactivity
app.get('/api/supabase-heartbeat', async (req, res) => {
  try {
    const supabase = require('./config/supabase');
    const { data, error } = await supabase
      .from('button_click_stats')
      .select('id')
      .limit(1);
    
    if (error) throw error;
    res.json({ ok: true });
  } catch (error) {
    console.error('Heartbeat error:', error.message);
    res.status(500).json({ ok: false });
  }
});

// API routes
app.use('/api/buttons', buttonRoutes);
app.use('/api/spotify', spotifyRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

// Start server (only in non-serverless environments)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`🚀 Portfolio backend server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 Database: Connected to Supabase`);
  });
}

// Export for Vercel serverless
module.exports = app;