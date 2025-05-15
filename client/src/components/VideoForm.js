import React, { useState, useEffect } from 'react';

const VideoForm = ({ video, onSubmit, buttonText = 'Submit' }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    youtubeId: '',
    category: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (video) {
      setFormData({
        title: video.title || '',
        description: video.description || '',
        youtubeId: video.youtubeId || '',
        category: video.category || ''
      });
    }
  }, [video]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.youtubeId.trim()) newErrors.youtubeId = 'YouTube Video ID is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="title" className="form-label">
          Title *
        </label>
        <input
          type="text"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
        />
        {errors.title && <div className="invalid-feedback">{errors.title}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="description" className="form-label">
          Description *
        </label>
        <textarea
          className={`form-control ${errors.description ? 'is-invalid' : ''}`}
          id="description"
          name="description"
          rows="4"
          value={formData.description}
          onChange={handleChange}
        />
        {errors.description && <div className="invalid-feedback">{errors.description}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="youtubeId" className="form-label">
          YouTube Video ID *
        </label>
        <input
          type="text"
          className={`form-control ${errors.youtubeId ? 'is-invalid' : ''}`}
          id="youtubeId"
          name="youtubeId"
          value={formData.youtubeId}
          onChange={handleChange}
        />
        <div className="form-text">
          This is the ID part of a YouTube URL (e.g., for 
          https://www.youtube.com/watch?v=dQw4w9WgXcQ, the ID is dQw4w9WgXcQ)
        </div>
        {errors.youtubeId && <div className="invalid-feedback">{errors.youtubeId}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="category" className="form-label">
          Category
        </label>
        <input
          type="text"
          className="form-control"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
        />
        <div className="form-text">Optional category for organizing videos</div>
      </div>

      <button type="submit" className="btn btn-primary">
        {buttonText}
      </button>
    </form>
  );
};

export default VideoForm; 