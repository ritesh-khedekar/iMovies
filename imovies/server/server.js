const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

// Connect to Database
const Movie = require('./models/Movie');
const { seedData } = require('./seed');

const autoSeedIfEmpty = async () => {
  try {
    const count = await Movie.countDocuments();
    console.log(`[AutoSeed] Database movie count: ${count}`);
    if (count === 0) {
      console.log('[AutoSeed] Empty database detected. Automatically seeding demo movies, shows, and accounts...');
      await seedData(false);
      console.log('[AutoSeed] Automatic seeding completed successfully!');
    }
  } catch (err) {
    console.error('[AutoSeed] Auto-seed error:', err.message);
  }
};

connectDB()
  .then(() => {
    autoSeedIfEmpty();
  })
  .catch((err) => {
    console.error('[DB] Connection error:', err.message);
  });

const app = express();

// Security HTTP headers
app.use(helmet());

// Enable CORS for all local and deployed origins
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// Request logging for debugging
app.use((req, res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`);
  next();
});

// Rate limiting (Allow 1000 requests per 15 minutes window for smooth seat polling and navigation)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Mount API routes (Support both with and without /api prefix for complete resilience)
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/auth', authRoutes);
app.use('/auth', authRoutes);

app.use('/api/movies', movieRoutes);
app.use('/movies', movieRoutes);

app.use('/api/shows', showRoutes);
app.use('/shows', showRoutes);

app.use('/api/bookings', bookingRoutes);
app.use('/bookings', bookingRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'IMovies API is running',
    timestamp: new Date().toISOString(),
  });
});

// Database Seed endpoint (accessible on deployed servers like Render to populate data anytime)
app.all(['/api/seed', '/seed'], async (req, res) => {
  try {
    console.log('[API] Seeding requested via /api/seed...');
    await seedData(false);
    const movieCount = await Movie.countDocuments();
    res.json({
      success: true,
      message: 'Database successfully seeded with movies, shows, and demo users!',
      movieCount,
    });
  } catch (err) {
    console.error('[API] /api/seed error:', err.message);
    res.status(500).json({
      success: false,
      message: 'Database seeding failed: ' + err.message,
    });
  }
});

// 404 handler for unknown routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.originalUrl} on this server`,
  });
});

// Centralized error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`IMovies Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

// Handle unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
});

process.on('uncaughtException', (err) => {
  console.error(`Uncaught Exception Error: ${err.message}`, err.stack);
});

module.exports = app;
