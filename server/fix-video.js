const mongoose = require('mongoose');
const Video = require('./models/Video');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// MongoDB Connection String
const MONGODB_URI = 'mongodb+srv://thantenthousand:KhhnM8r1t3aSSM4P@kuppisite1.ao5c8v0.mongodb.net/?retryWrites=true&w=majority&appName=KuppiSite1';

const fixVideoId = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Find the video with the URL instead of just the ID
    const video = await Video.findOne({ youtubeId: 'https://youtu.be/WyqsOAVmurw' });
    
    if (!video) {
      console.log('No video found with that URL');
    } else {
      console.log('Found video with URL instead of ID:', video.title);
      
      // Extract the YouTube ID from the URL
      let youtubeId = 'WyqsOAVmurw'; // Hardcoded for this specific case
      
      // Update the video
      video.youtubeId = youtubeId;
      await video.save();
      
      console.log('Video updated successfully with correct YouTube ID:', youtubeId);
    }
    
    mongoose.disconnect();
  } catch (error) {
    console.error('Error fixing video ID:', error);
    mongoose.disconnect();
  }
};

fixVideoId();
