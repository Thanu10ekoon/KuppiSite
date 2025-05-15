import { createContext, useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';
import { VIDEO_ENDPOINTS } from '../utils/api';

const VideoContext = createContext();

export const VideoProvider = ({ children }) => {
  const [videos, setVideos] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const { isAuthenticated } = useContext(AuthContext);

  // Load videos when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      getVideos();
    } else {
      setVideos([]);
      setCurrentVideo(null);
    }
    // We intentionally exclude getVideos from dependencies to avoid loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Get all videos  
  const getVideos = async () => {
    try {
      console.log('Fetching videos...');
      // Set loading state
      setLoading(true);
      setError(null);
      
      // Get the current token
      const currentToken = localStorage.getItem('token');
      console.log('Using token:', currentToken ? 'Token exists' : 'No token');
      
      if (!currentToken) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return;
      }
        
      // Explicitly set the Authorization header for this specific request
      console.log('Making request to:', VIDEO_ENDPOINTS.LIST);
      
      const res = await axios.get(VIDEO_ENDPOINTS.LIST, {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      
      console.log('Videos fetched successfully:', res.data);
      setVideos(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching videos:', err);
      setError(err.response?.data?.message || 'Failed to fetch videos');
      setLoading(false);
    }
  };
  
  // Get single video
  const getVideo = useCallback(async (id) => {
    try {
      // Check if we already have this video loaded 
      if (currentVideo && currentVideo._id === id) {
        console.log('Video already loaded, using cached version');
        return currentVideo;
      }
      
      console.log('Fetching single video with ID:', id);
      setLoading(true);
      setError(null);
      
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return null;
      }
      
      console.log('Making request to:', VIDEO_ENDPOINTS.DETAIL(id));
      
      const res = await axios.get(VIDEO_ENDPOINTS.DETAIL(id), {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      
      console.log('Video fetched successfully:', res.data);
      setCurrentVideo(res.data);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Error fetching video:', err);
      setError(err.response?.data?.message || 'Failed to fetch video');
      setLoading(false);
      return null;
    }
  }, [currentVideo]);
  
  // Add video
  const addVideo = async (videoData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.post(VIDEO_ENDPOINTS.CREATE, videoData);
      
      console.log('Video added successfully');
      setVideos([...videos, res.data]);
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Error adding video:', err);
      setError(err.response?.data?.message || 'Failed to add video');
      setLoading(false);
      throw err;
    }
  };
    // Update video
  const updateVideo = async (id, videoData) => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.put(VIDEO_ENDPOINTS.UPDATE(id), videoData);
      console.log('Video updated successfully');
      setVideos(videos.map(video => video._id === id ? res.data : video));
      if (currentVideo && currentVideo._id === id) {
        setCurrentVideo(res.data);
      }
      setLoading(false);
      return res.data;
    } catch (err) {
      console.error('Error updating video:', err);
      setError(err.response?.data?.message || 'Failed to update video');
      setLoading(false);
      throw err;
    }
  };
  
  // Delete video
  const deleteVideo = async (id) => {
    try {
      setLoading(true);
      setError(null);
      
      await axios.delete(VIDEO_ENDPOINTS.DELETE(id));
      
      console.log('Video deleted successfully');
      setVideos(videos.filter(video => video._id !== id));
      if (currentVideo && currentVideo._id === id) {
        setCurrentVideo(null);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error deleting video:', err);
      setError(err.response?.data?.message || 'Failed to delete video');
      setLoading(false);
      throw err;
    }
  };
  
  // Clear errors
  const clearErrors = () => {
    setError(null);
  };
  
  return (
    <VideoContext.Provider
      value={{
        videos,
        currentVideo,
        loading,
        error,
        getVideos,
        getVideo,
        addVideo,
        updateVideo,
        deleteVideo,
        clearErrors
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContext;
