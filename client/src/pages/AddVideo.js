import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VideoContext from '../context/VideoContext';
import VideoForm from '../components/VideoForm';

const AddVideo = () => {
  const { addVideo } = useContext(VideoContext);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const result = await addVideo(formData);
    
    if (result.success) {
      setFormSuccess('Video added successfully!');
      setFormError('');
      
      // Navigate to admin page after short delay
      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } else {
      setFormError(result.error || 'Error adding video');
      setFormSuccess('');
    }
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1>Add New Video</h1>
            <Link to="/admin" className="btn btn-secondary">
              Back to Admin
            </Link>
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
              <VideoForm onSubmit={handleSubmit} buttonText="Add Video" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddVideo; 