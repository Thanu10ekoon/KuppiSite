/**
 * Deployment Verification Script for MongoDB Connection
 * 
 * This script verifies the MongoDB connection in the deployed environment.
 * It tests both direct connection and the database status endpoint.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fetch = require('node-fetch');

// Get the API URL from arguments or use default
const API_URL = process.argv[2] || 'https://kuppisite.vercel.app/api';
const MONGODB_URI = process.env.MONGODB_URI;

console.log('\n=== KuppiSite Deployment MongoDB Verification ===\n');

// Verify API connection
async function testApiConnection() {
  try {
    console.log(`Testing API connection to: ${API_URL}`);
    
    const response = await fetch(`${API_URL}/auth/test-connection`);
    const data = await response.json();
    
    console.log('✅ API Connection Test:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return data.success;
  } catch (error) {
    console.error('❌ API Connection Failed:', error.message);
    return false;
  }
}

// Verify DB Status Endpoint
async function testDbStatusEndpoint() {
  try {
    console.log(`\nTesting DB Status endpoint at: ${API_URL}/db/status`);
    
    const response = await fetch(`${API_URL}/db/status`);
    const data = await response.json();
    
    console.log('DB Status Response:');
    console.log('Status:', response.status);
    console.log('Response:', JSON.stringify(data, null, 2));
    
    return data.success;
  } catch (error) {
    console.error('❌ DB Status Check Failed:', error.message);
    return false;
  }
}

// Test direct MongoDB connection
async function testMongoDBConnection() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI environment variable is not set');
    return false;
  }
  
  try {
    console.log('\nTesting direct MongoDB connection...');
    
    // Enhanced connection options matching the server settings
    const mongooseOptions = {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 60000,
      connectTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      maxPoolSize: 10,
      minPoolSize: 1
    };
    
    console.log('Using connection options:', JSON.stringify(mongooseOptions, null, 2));
    
    const start = Date.now();
    await mongoose.connect(MONGODB_URI, mongooseOptions);
    const duration = Date.now() - start;
    
    console.log(`✅ MongoDB Connection Successful (${duration}ms)`);
    console.log(`Connected to database: ${mongoose.connection.db.databaseName}`);
    
    // Get connection stats
    if (mongoose.connection.readyState === 1) {
      const stats = await mongoose.connection.db.stats();
      console.log('Database Stats:');
      console.log(`- Collections: ${stats.collections}`);
      console.log(`- Documents: ${stats.objects}`);
      console.log(`- Storage Size: ${stats.storageSize} bytes`);
    }
    
    await mongoose.connection.close();
    console.log('Connection closed');
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    return false;
  }
}

// Run all tests
async function runAllTests() {
  let testsSuccessful = 0;
  let totalTests = 3;
  
  console.log('Running deployment verification tests...\n');
  
  // Test 1: API Connection
  if (await testApiConnection()) {
    testsSuccessful++;
  }
  
  // Test 2: DB Status Endpoint
  if (await testDbStatusEndpoint()) {
    testsSuccessful++;
  }
  
  // Test 3: Direct MongoDB Connection
  if (await testMongoDBConnection()) {
    testsSuccessful++;
  }
  
  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`Tests Passed: ${testsSuccessful}/${totalTests}`);
  
  if (testsSuccessful === totalTests) {
    console.log('\n✅ All tests passed! Your MongoDB connection is working correctly.');
  } else {
    console.log('\n⚠️ Some tests failed. Review the errors above and check your MongoDB configuration.');
    console.log('Refer to MONGODB_ATLAS_CONFIG.md for troubleshooting help.');
  }
}

// Run the tests
runAllTests().catch(console.error);
