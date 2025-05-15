const mongoose = require('mongoose');
const Video = require('./models/Video');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB Connection String
const MONGODB_URI = 'mongodb+srv://thantenthousand:KhhnM8r1t3aSSM4P@kuppisite1.ao5c8v0.mongodb.net/?retryWrites=true&w=majority&appName=KuppiSite1';

const listVideos = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Get all videos from the database
    const videos = await Video.find().sort({ createdAt: -1 });
    
    if (videos.length === 0) {
      console.log('No videos found in the database.');
    } else {
      console.log(`Found ${videos.length} videos in the database:`);
      videos.forEach((video, index) => {
        console.log(`\nVideo ${index + 1}:`);
        console.log(`ID: ${video._id}`);
        console.log(`Title: ${video.title}`);
        console.log(`Description: ${video.description}`);
        console.log(`YouTube ID: ${video.youtubeId}`);
        console.log(`Category: ${video.category}`);
        console.log(`Created At: ${video.createdAt}`);
      });
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error listing videos:', error);
    mongoose.disconnect();
  }
};

listVideos();
