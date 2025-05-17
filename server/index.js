const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');

// Load environment variables
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // In production (Vercel), the environment variables are set through Vercel dashboard
  console.log('Running in production mode - using Vercel environment variables');
} else {
  // In development, load from .env file
  dotenv.config();
  console.log('Environment variables loaded from .env file');
}

// Check for MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is required. Set this environment variable.');
  // Don't set a default in production code - we'll rely on the environment variable
}

// Check for JWT env vars
if (!process.env.JWT_SECRET) {
  console.warn('Warning: JWT_SECRET is not set in environment variables. Using default for development.');
  process.env.JWT_SECRET = 'devsecret';
}
if (!process.env.JWT_EXPIRE) {
  process.env.JWT_EXPIRE = '30d';
}

// Create Express app
const app = express();

// Parse CORS origins from environment variable
const corsOrigin = process.env.CORS_ORIGIN ? 
  process.env.CORS_ORIGIN.split(',') : 
  ['http://localhost:3000', 'https://kuppisite-client.vercel.app', 'https://kuppi-site.vercel.app', 'https://kuppisite.vercel.app'];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (corsOrigin.indexOf(origin) !== -1 || corsOrigin.includes('*')) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      console.log('Allowed origins:', corsOrigin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  preflightContinue: false,
  optionsSuccessStatus: 204
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Import DB status route
const dbStatusRoute = require('./routes/db-status');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/db', dbStatusRoute);

// Connect to MongoDB with improved error handling
const connectDB = async (retryCount = 0, maxRetries = 3) => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const mongoURI = process.env.MONGODB_URI;
    
    // Log a masked version of the connection string for debugging
    const maskedURI = mongoURI?.replace(/(mongodb\+srv:\/\/)[^:]+:[^@]+@/, '$1****:****@') || 'undefined';
    console.log(`Using MongoDB URI: ${maskedURI}`);
    
    await mongoose.connect(mongoURI, {
      // Enhanced options for MongoDB Atlas connections, especially for free tier
      serverSelectionTimeoutMS: 30000, // Increased from 5000ms to 30000ms
      socketTimeoutMS: 60000, // Increased from 45000ms to 60000ms
      connectTimeoutMS: 30000, // Added connection timeout
      heartbeatFrequencyMS: 10000, // Added regular heartbeat checks
      retryWrites: true, // Enable retry for write operations
      retryReads: true, // Enable retry for read operations
      w: 'majority', // Write concern for data durability
      maxPoolSize: 10, // Control connection pool size
      minPoolSize: 1 // Maintain at least one connection
    });
    
    console.log('Connected to MongoDB successfully');
    
    // Listen for connection errors after initial connection
    mongoose.connection.on('error', err => {
      console.error('MongoDB connection error:', err);
      // Attempt to reconnect if not in the process of disconnecting
      if (mongoose.connection.readyState !== 0) {
        console.log('Attempting to reconnect to MongoDB...');
        mongoose.connect(mongoURI).catch(err => {
          console.error('Failed to reconnect to MongoDB:', err.message);
        });
      }
    });
    
    // Listen for disconnection
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });
    
    // Handle process termination
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed due to app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB connection close:', err);
        process.exit(1);
      }
    });
    
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    
    // Retry logic
    if (retryCount < maxRetries) {
      const retryDelay = Math.pow(2, retryCount) * 1000; // Exponential backoff
      console.log(`Retrying in ${retryDelay}ms... (Attempt ${retryCount + 1}/${maxRetries})`);
      
      setTimeout(() => {
        connectDB(retryCount + 1, maxRetries);
      }, retryDelay);
    } else {
      console.error(`Failed to connect after ${maxRetries} attempts.`);
      // In serverless environments, we don't want to exit the process
      if (process.env.NODE_ENV !== 'production') {
        process.exit(1);
      }
    }
  }
};

// Connect to the database
connectDB();

// Vercel serverless function export
if (process.env.NODE_ENV === 'production') {
  // For Vercel, export the Express app as the default module
  module.exports = app;
} else {
  // For local development, start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}