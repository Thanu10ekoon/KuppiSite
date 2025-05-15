import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import VideoContext from '../context/VideoContext';

const Admin = () => {
  const { videos, loading, deleteVideo } = useContext(VideoContext);
  const [deleteMessage, setDeleteMessage] = useState({ text: '', type: '' });

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      const result = await deleteVideo(id);
      if (result.success) {
        setDeleteMessage({ 
          text: 'Video deleted successfully', 
          type: 'success' 
        });
      } else {
        setDeleteMessage({ 
          text: result.error || 'Failed to delete video', 
          type: 'danger' 
        });
      }
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setDeleteMessage({ text: '', type: '' });
      }, 3000);
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <Link to="/admin/videos/add" className="btn btn-success">
          Add New Video
        </Link>
      </div>

      {deleteMessage.text && (
        <div className={`alert alert-${deleteMessage.type}`} role="alert">
          {deleteMessage.text}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="mb-0">Manage Videos</h3>
        </div>
        <div className="card-body">
          {loading ? (
            <div className="text-center py-3">Loading videos...</div>
          ) : videos.length === 0 ? (
            <div className="text-center py-3">No videos available.</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Date Added</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {videos.map((video) => (
                    <tr key={video._id}>
                      <td>{video.title}</td>
                      <td>{video.category || 'Uncategorized'}</td>
                      <td>{new Date(video.createdAt).toLocaleDateString()}</td>
                      <td>
                        <Link
                          to={`/videos/${video._id}`}
                          className="btn btn-sm btn-primary me-2"
                        >
                          View
                        </Link>
                        <Link
                          to={`/admin/videos/${video._id}/edit`}
                          className="btn btn-sm btn-warning me-2"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(video._id, video.title)}
                          className="btn btn-sm btn-danger"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin; 