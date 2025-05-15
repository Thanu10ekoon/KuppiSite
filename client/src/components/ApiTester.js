import React, { useState } from 'react';
import { testRegistration } from '../utils/apiTest';

const ApiTester = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTestRegistration = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const data = await testRegistration();
      setResult(data);
      console.log('Test completed successfully');
    } catch (err) {
      setError(err.toString());
      console.error('Test failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>API Test Component</h2>
      
      <button 
        className="btn btn-primary my-3" 
        onClick={handleTestRegistration}
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test Registration'}
      </button>
      
      {result && (
        <div className="alert alert-success">
          <h4>Success!</h4>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger">
          <h4>Error</h4>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};

export default ApiTester;
