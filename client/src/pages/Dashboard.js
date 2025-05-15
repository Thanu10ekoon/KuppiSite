import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import VideoContext from '../context/VideoContext';
import VideoList from '../components/VideoList';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const { getVideos } = useContext(VideoContext);
  // Fetch videos when dashboard loads, but only once
  useEffect(() => {
    console.log('Dashboard mounted, fetching videos...');
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token exists, calling getVideos()');
      getVideos();
    } else {
      console.log('No token found in Dashboard');
    }
    // We intentionally only call this once on mount, so we suppress the dependency warning
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-12">
          <h1 className="mb-4">Dashboard</h1>
          <div className="card mb-4">
            <div className="card-body">
              <h2 className="card-title">Welcome, {user?.name || 'User'}!</h2>
              <p className="card-text">
                You now have access to the private YouTube videos. Browse through the available videos
                below and click on any to start watching.
              </p>              {user && user.role === 'admin' && (
                <Link to="/admin" className="btn btn-primary">
                  Manage Videos
                </Link>
              )}
            </div>
          </div>
          
          <VideoList />
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 