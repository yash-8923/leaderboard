import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import { seedDatabase } from './utils/seedDatabase.js';
import userRoutes from './routes/users.js';
import leaderboardRoutes from './routes/leaderboard.js';
import claimRoutes from './routes/claim.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

app.use(compression());

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB and seed database
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Seed database with initial data
    await seedDatabase();
    
    // API routes
    app.use('/api/users', userRoutes);
    app.use('/api/leaderboard', leaderboardRoutes);
    app.use('/api/claim', claimRoutes);
    
    // Root endpoint - API information
    app.get('/', (req, res) => {
      res.json({
        name: 'Leaderboard API',
        version: '1.0.0',
        status: 'running',
        endpoints: {
          health: '/api/health',
          status: '/api/status',
          users: '/api/users',
          leaderboard: '/api/leaderboard',
          claim: '/api/claim'
        },
        documentation: 'See README.md for full API documentation'
      });
    });
    
    // API root endpoint
    app.get('/api', (req, res) => {
      res.json({
        message: 'Leaderboard API v1.0.0',
        endpoints: [
          'GET /api/health - Health check',
          'GET /api/status - Database status',
          'GET /api/users - Get all users',
          'POST /api/users - Create new user',
          'GET /api/leaderboard - Get leaderboard',
          'POST /api/claim - Claim points'
        ],
        database: mongoose.connection.name || 'connected'
      });
    });
    
    // Health check endpoint
    app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        database: 'connected'
      });
    });
    
    // Database status endpoint
    app.get('/api/status', async (req, res) => {
      try {
        const dbStatus = mongoose.connection.readyState;
        const statusMap = {
          0: 'disconnected',
          1: 'connected',
          2: 'connecting',
          3: 'disconnecting'
        };
        
        res.json({
          database: statusMap[dbStatus] || 'unknown',
          host: mongoose.connection.host,
          name: mongoose.connection.name,
          port: mongoose.connection.port
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to get database status' });
      }
    });
    
    // Error handling middleware
    app.use((err, req, res, next) => {
      console.error('❌ Server Error:', err.stack);
      
      if (err.name === 'ValidationError') {
        return res.status(400).json({ 
          error: 'Validation Error',
          message: err.message 
        });
      }
      
      if (err.name === 'CastError') {
        return res.status(400).json({ 
          error: 'Invalid ID format',
          message: 'The provided ID is not valid' 
        });
      }
      
      res.status(500).json({ 
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!'
      });
    });
    
    // 404 handler
    app.use('*', (req, res) => {
      res.status(404).json({ 
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
      });
    });
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Leaderboard API available at http://localhost:${PORT}/api`);
      console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📈 Database status: http://localhost:${PORT}/api/status`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  await mongoose.connection.close();
  process.exit(0);
});

startServer();