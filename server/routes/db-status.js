/**
 * MongoDB Status Check Route
 * 
 * A simple route that verifies the MongoDB connection status
 * without doing any significant data operations.
 */

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

router.get('/status', async (req, res) => {
  try {
    const status = {
      dbConnected: false,
      dbState: '',
      serverTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    };

    // Get connection status
    if (mongoose.connection) {
      // readyState values: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
      status.dbConnected = mongoose.connection.readyState === 1;
      
      switch (mongoose.connection.readyState) {
        case 0:
          status.dbState = 'disconnected';
          break;
        case 1: 
          status.dbState = 'connected';
          break;
        case 2:
          status.dbState = 'connecting';
          break;
        case 3:
          status.dbState = 'disconnecting';
          break;
        default:
          status.dbState = 'unknown';
      }
      
      // Only attempt to get stats if connected
      if (status.dbConnected) {
        try {
          // Simple ping command to verify connection is working
          const pingResult = await mongoose.connection.db.admin().ping();
          status.pingSuccess = pingResult && pingResult.ok === 1;
          
          // Get server stats for additional info
          const serverStatus = await mongoose.connection.db.admin().serverStatus();
          status.connectionCount = serverStatus.connections?.current || 0;
          status.serverUptime = serverStatus.uptime || 0;
        } catch (err) {
          console.error('Error getting MongoDB stats:', err);
          status.statsError = err.message;
        }
      }
    } else {
      status.dbState = 'not initialized';
    }
    
    // Set appropriate HTTP status based on connection state
    const httpStatus = status.dbConnected ? 200 : 503;
    
    res.status(httpStatus).json({
      success: status.dbConnected,
      message: status.dbConnected ? 'Database is connected' : 'Database is not connected',
      status
    });
  } catch (error) {
    console.error('MongoDB status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking database status',
      error: error.message
    });
  }
});

module.exports = router;
