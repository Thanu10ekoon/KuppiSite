import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from './AuthContext';

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
  }, [isAuthenticated]);  // Get all videos  
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
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/videos`;
      console.log('Making request to:', apiUrl);
      
      const res = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      
      console.log('Video API response:', res.data);
      setVideos(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching videos:', err);
      if (err.response) {
        console.error('Error response:', err.response.status, err.response.data);
      }
      setError(err.response?.data?.message || 'Error loading videos');
      setLoading(false);
    }
  };
  // Get single video
  const getVideo = async (id) => {
    try {
      // Check if we already have this video loaded 
      if (currentVideo && currentVideo._id === id) {
        console.log('Video already loaded, using cached version');
        return currentVideo;
      }
      
      setLoading(true);
      setError(null);
      
      // Get the current token
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        setError('Authentication token missing. Please log in again.');
        setLoading(false);
        return null;
      }
      
      // Explicitly set the Authorization header for this specific request
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/videos/${id}`;
      console.log('Fetching video details from:', apiUrl);
      
      const res = await axios.get(apiUrl, {
        headers: {
          'Authorization': `Bearer ${currentToken}`
        }
      });
      
      setCurrentVideo(res.data.data);
      setLoading(false);
      return res.data.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error loading video');
      setLoading(false);
      return null;
    }
  };

  // Add video (admin only)
  const addVideo = async (videoData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/videos`, videoData);
      setVideos([res.data.data, ...videos]);
      setLoading(false);
      return { success: true, data: res.data.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error adding video');
      setLoading(false);
      return { success: false, error: err.response?.data?.message || 'Error adding video' };
    }
  };

  // Update video (admin only)
  const updateVideo = async (id, videoData) => {
    try {
      setLoading(true);
      const res = await axios.put(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/videos/${id}`, videoData);
      setVideos(videos.map(video => video._id === id ? res.data.data : video));
      setCurrentVideo(res.data.data);
      setLoading(false);
      return { success: true, data: res.data.data };
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating video');
      setLoading(false);
      return { success: false, error: err.response?.data?.message || 'Error updating video' };
    }
  };

  // Delete video (admin only)
  const deleteVideo = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/videos/${id}`);
      setVideos(videos.filter(video => video._id !== id));
      if (currentVideo && currentVideo._id === id) {
        setCurrentVideo(null);
      }
      setLoading(false);
      return { success: true };
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting video');
      setLoading(false);
      return { success: false, error: err.response?.data?.message || 'Error deleting video' };
    }
  };

  // Clear errors
  const clearErrors = () => setError(null);

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
        clearErrors,
        setCurrentVideo
      }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export default VideoContext;
