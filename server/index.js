const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');

// Load environment variables
dotenv.config();

// Check for MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is required. Set this environment variable.');
  process.env.MONGODB_URI = 'mongodb+srv://thantenthousand:KhhnM8r1t3aSSM4P@kuppisite1.ao5c8v0.mongodb.net/?retryWrites=true&w=majority&appName=KuppiSite1';
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
  ['http://localhost:3000', 'https://kuppisite-client.vercel.app'];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    
    if (corsOrigin.indexOf(origin) !== -1 || corsOrigin.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

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