const express = require('express');
const {
  getVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo
} = require('../controllers/videos');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are protected
router.use(protect);

// Get all videos and get single video routes are available to all authenticated users
router.get('/', getVideos);
router.get('/:id', getVideo);

// Admin only routes
router.post('/', authorize('admin'), createVideo);
router.put('/:id', authorize('admin'), updateVideo);
router.delete('/:id', authorize('admin'), deleteVideo);

module.exports = router; 