import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import VideoContext from '../context/VideoContext';
import AuthContext from '../context/AuthContext';

const VideoList = () => {
  const { videos, loading, getVideos, error } = useContext(VideoContext);
  const { isAuthenticated, loading: authLoading } = useContext(AuthContext);
  
  // Add effect to reload videos when authenticated
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      console.log('VideoList: User is authenticated and ready, fetching videos');
      getVideos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authLoading]);
  
  // Show loading if either auth or videos are loading
  if (loading || authLoading) {
    return <div className="text-center my-5">Loading videos...</div>;
  }
  
  if (error) {
    return (
      <div className="alert alert-danger my-5">
        <p>Error loading videos: {error}</p>
        <button 
          className="btn btn-primary mt-3" 
          onClick={() => {
            console.log('Manual refresh after error');
            getVideos();
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="text-center my-5">
        <p>No videos available.</p>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            console.log('Manual refresh triggered');
            getVideos();
          }}
        >
          Refresh Videos
        </button>
      </div>
    );
  }
  
  return (
    <div className="video-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Available Videos ({videos.length})</h3>
        <button 
          className="btn btn-sm btn-outline-secondary" 
          onClick={getVideos}
        >
          Refresh
        </button>
      </div>
      <div className="list-group">
        {videos.map((video) => (
          <Link
            to={`/videos/${video._id}`}
            key={video._id}
            className="list-group-item list-group-item-action"
          >
            <div className="d-flex w-100 justify-content-between">
              <h5 className="mb-1">{video.title}</h5>
              <small className="text-muted">
                {new Date(video.createdAt).toLocaleDateString()}
              </small>
            </div>
            <p className="mb-1">{video.description.substring(0, 100)}{video.description.length > 100 ? '...' : ''}</p>
            {video.category && (
              <small className="text-muted">Category: {video.category}</small>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default VideoList;
