const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB Connection String (same as in index.js)
const MONGODB_URI = 'mongodb+srv://thantenthousand:KhhnM8r1t3aSSM4P@kuppisite1.ao5c8v0.mongodb.net/?retryWrites=true&w=majority&appName=KuppiSite1';

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('Admin user already exists:', existingAdmin.email);
      console.log('Use this email and your password to run the add-video.js script');
      mongoose.disconnect();
      return;
    }
    
    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',  // Remember to change this in production
      role: 'admin'
    });
    
    console.log('Admin user created successfully:');
    console.log('Email:', adminUser.email);
    console.log('Password: admin123');
    console.log('Use these credentials to run the add-video.js script');
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin user:', error);
    mongoose.disconnect();
  }
};

createAdminUser();
