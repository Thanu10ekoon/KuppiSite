/**
 * API Connection Test Component with Login Testing
 * 
 * This component tests both the API connection and authentication endpoints.
 * Add this to your debug page to help diagnose connection issues.
 */

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../utils/api';

const APIConnectionTest = () => {
  const [logs, setLogs] = useState([]);
  const [testCredentials, setTestCredentials] = useState({
    email: '',
    password: ''
  });
  const [isRunningTest, setIsRunningTest] = useState(false);

  // Add log entry with timestamp
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    setLogs(prev => [...prev, { message, timestamp, type }]);
  };

  // Basic connectivity test
  const testBasicConnectivity = async () => {
    setIsRunningTest(true);
    addLog('Starting basic connectivity test...', 'info');
    try {
      // Test OPTIONS request (CORS preflight)
      addLog(`Testing OPTIONS request to ${API_BASE_URL}`, 'info');
      const optionsResult = await fetch(API_BASE_URL, { 
        method: 'OPTIONS',
        headers: {
          'Origin': window.location.origin,
        }
      });
      
      addLog(`OPTIONS request status: ${optionsResult.status}`, optionsResult.ok ? 'success' : 'error');
      
      // Test with axios
      addLog(`Testing GET request with axios to ${API_BASE_URL}`, 'info');
      try {
        await axios.get(API_BASE_URL);
        addLog('Axios GET request succeeded', 'success');
      } catch (error) {
        if (error.response) {
          // Even a 404 means we reached the server
          addLog(`Axios request reached server with status ${error.response.status}`, 'success');
        } else {
          addLog(`Axios GET request failed: ${error.message}`, 'error');
        }
      }
    } catch (error) {
      addLog(`Connectivity test failed: ${error.message}`, 'error');
    }
    setIsRunningTest(false);
  };

  // Test login endpoint
  const testLogin = async () => {
    if (!testCredentials.email || !testCredentials.password) {
      addLog('Please enter both email and password for testing', 'error');
      return;
    }

    setIsRunningTest(true);
    addLog('Testing login endpoint...', 'info');
    addLog(`Using email: ${testCredentials.email}`, 'info');
    addLog(`Endpoint: ${AUTH_ENDPOINTS.LOGIN}`, 'info');
    
    try {
      const response = await axios.post(AUTH_ENDPOINTS.LOGIN, testCredentials);
      addLog(`Login successful! Status: ${response.status}`, 'success');
      addLog('User authenticated successfully', 'success');
    } catch (error) {
      addLog(`Login test failed: ${error.message}`, 'error');
      
      if (error.response) {
        addLog(`Response status: ${error.response.status}`, 'info');
        addLog(`Error details: ${JSON.stringify(error.response.data)}`, 'error');
        
        // Specific error handling
        if (error.response.status === 500) {
          addLog('This is a server error. Check if MongoDB is properly connected', 'warning');
        } else if (error.response.status === 401) {
          addLog('Authentication failed - invalid credentials', 'warning');
        }
      } else if (error.request) {
        addLog('No response received from server', 'error');
      } else {
        addLog(`Request setup error: ${error.message}`, 'error');
      }
    }
    setIsRunningTest(false);
  };

  // Handle input changes for test credentials
  const handleCredentialsChange = (e) => {
    setTestCredentials({
      ...testCredentials,
      [e.target.name]: e.target.value
    });
  };
  
  // Run basic test on mount
  useEffect(() => {
    testBasicConnectivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="api-connection-test border rounded p-3 mt-4">
      <h3>API Connection Tester</h3>
      
      <div className="server-info mb-3">
        <strong>Server URL:</strong> {API_BASE_URL}
      </div>
      
      <div className="row mb-3">
        <div className="col-12 col-md-6">
          <button 
            className="btn btn-primary me-2" 
            onClick={testBasicConnectivity}
            disabled={isRunningTest}
          >
            Test Basic Connectivity
          </button>
        </div>
      </div>
      
      <div className="card mb-4">
        <div className="card-header">
          <h4 className="h5 mb-0">Test Login</h4>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="email"
                  value={testCredentials.email}
                  onChange={handleCredentialsChange}
                  placeholder="test@example.com"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  name="password"
                  value={testCredentials.password}
                  onChange={handleCredentialsChange}
                  placeholder="Enter password"
                />
              </div>
              <button 
                className="btn btn-success" 
                onClick={testLogin}
                disabled={isRunningTest}
              >
                Test Login API
              </button>
            </div>
            <div className="col-md-6">
              <div className="alert alert-info">
                Enter test credentials to try a real login request.
                This helps diagnose if authentication is working correctly.
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="logs">
        <h4>Test Logs</h4>
        <div className="log-entries p-3 border rounded bg-light" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          {logs.length === 0 ? (
            <p className="text-muted">No logs yet. Run a test to see results here.</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} className={`log-entry ${log.type}`}>
                <span className="timestamp">[{log.timestamp}]</span>
                <span className="message">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default APIConnectionTest;
