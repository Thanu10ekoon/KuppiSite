import React, { useState } from 'react';
import axios from 'axios';

const TestVideoApi = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testGetVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      console.log('Testing GET /videos API...');
      console.log('Authorization header:', axios.defaults.headers.common['Authorization']);
      
      const response = await axios.get('http://localhost:5000/api/videos');
      console.log('API response:', response.data);
      
      setResult(response.data);
      setLoading(false);
    } catch (err) {
      console.error('API test error:', err);
      if (err.response) {
        setError(`Status: ${err.response.status} - ${JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        setError('No response received from server');
      } else {
        setError(`Error: ${err.message}`);
      }
      setLoading(false);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        Video API Test
      </div>
      <div className="card-body">
        <button 
          className="btn btn-primary mb-3"
          onClick={testGetVideos}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Get Videos API'}
        </button>
        
        {error && (
          <div className="alert alert-danger">
            <h5>Error:</h5>
            <p>{error}</p>
          </div>
        )}
        
        {result && (
          <div className="alert alert-success">
            <h5>Success:</h5>
            <pre className="mt-2" style={{ maxHeight: '300px', overflow: 'auto' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestVideoApi;
