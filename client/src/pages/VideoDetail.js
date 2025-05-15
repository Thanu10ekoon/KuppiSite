import React, { useEffect, useContext, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import VideoContext from '../context/VideoContext';
import AuthContext from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';

const VideoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getVideo, currentVideo, loading, error } = useContext(VideoContext);
  const { user } = useContext(AuthContext);
  
  // Use useCallback to prevent this function from being recreated on every render
  const loadVideo = useCallback(async () => {
    console.log('Loading video with ID:', id);
    const result = await getVideo(id);
    if (!result) {
      // Video not found or error occurred
      navigate('/dashboard');
    }
  }, [id, getVideo, navigate]);
  
  useEffect(() => {
    loadVideo();
  }, [loadVideo]);
  
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Loading video...</h2>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  
  if (!currentVideo) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Video not found
        </div>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    );
  }
  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-12">
          <div className="mb-4">
            <Link to="/dashboard" className="btn btn-secondary">
              ← Back to Dashboard
            </Link>
            
            {user && user.role === 'admin' && (
              <Link to={`/admin/videos/${id}/edit`} className="btn btn-outline-primary ms-2">
                Edit Video
              </Link>
            )}
          </div>
          
          {currentVideo && (
            <VideoPlayer 
              key={currentVideo._id} // Add key to prevent re-renders
              videoId={currentVideo.youtubeId} 
              title={currentVideo.title} 
              description={currentVideo.description}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDetail; 