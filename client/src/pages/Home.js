import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <div className="container py-5">
      <div className="jumbotron text-center">
        <h1 className="display-4">Welcome to KuppiSite</h1>
        <p className="lead">
          Access exclusive YouTube content with your secure account.
        </p>
        <hr className="my-4" />
        <p>
          This platform provides authenticated access to private YouTube videos. Sign up or log in to
          get started.
        </p>
        {!isAuthenticated ? (
          <div>
            <Link to="/login" className="btn btn-primary btn-lg me-3">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary btn-lg">
              Register
            </Link>
          </div>
        ) : (
          <Link to="/dashboard" className="btn btn-success btn-lg">
            Go to Dashboard
          </Link>
        )}
      </div>

      <div className="row mt-5">
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">Secure Access</h3>
              <p className="card-text">
                Our platform ensures that only authenticated users can access the private video
                content.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">Private Videos</h3>
              <p className="card-text">
                Access exclusive YouTube videos that are not available to the general public.
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">Easy to Use</h3>
              <p className="card-text">
                A simple and intuitive interface makes it easy to browse and watch the available
                videos.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 