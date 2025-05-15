import React, { useState, useContext, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import VideoContext from '../context/VideoContext';
import VideoForm from '../components/VideoForm';

const EditVideo = () => {
  const { id } = useParams();
  const { getVideo, updateVideo, currentVideo, loading } = useContext(VideoContext);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadVideo = async () => {
      const result = await getVideo(id);
      if (!result) {
        navigate('/admin');
      }
    };
    
    loadVideo();
  }, [id, getVideo, navigate]);

  const handleSubmit = async (formData) => {
    const result = await updateVideo(id, formData);
    
    if (result.success) {
      setFormSuccess('Video updated successfully!');
      setFormError('');
      
      // Navigate back to admin after short delay
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } else {
      setFormError(result.error || 'Error updating video');
      setFormSuccess('');
    }
  };

  if (loading || !currentVideo) {
    return (
      <div className="container py-5 text-center">
        <h3>Loading video data...</h3>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Edit Video</h1>
            <div>
              <Link to="/admin" className="btn btn-secondary me-2">
                Back to Admin
              </Link>
              <Link to={`/videos/${id}`} className="btn btn-primary">
                View Video
              </Link>
            </div>
          </div>

          {formError && (
            <div className="alert alert-danger" role="alert">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="alert alert-success" role="alert">
              {formSuccess}
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <VideoForm 
                video={currentVideo} 
                onSubmit={handleSubmit} 
                buttonText="Update Video" 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditVideo; 