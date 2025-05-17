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
          <button 
            className="btn btn-secondary" 
            onClick={() => setLogs([])}
            disabled={isRunningTest}
          >
            Clear Logs
          </button>
        </div>
      </div>
      
      <div className="login-test-section border-top pt-3 mt-3">
        <h4>Test Login Endpoint</h4>
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="mb-2">
              <label htmlFor="testEmail" className="form-label">Test Email</label>
              <input
                type="email"
                className="form-control"
                id="testEmail"
                name="email"
                value={testCredentials.email}
                onChange={handleCredentialsChange}
              />
            </div>
            <div className="mb-2">
              <label htmlFor="testPassword" className="form-label">Test Password</label>
              <input
                type="password"
                className="form-control"
                id="testPassword"
                name="password"
                value={testCredentials.password}
                onChange={handleCredentialsChange}
              />
            </div>
            <button 
              className="btn btn-warning" 
              onClick={testLogin}
              disabled={isRunningTest}
            >
              Test Login
            </button>
          </div>
        </div>
      </div>
      
      <div className="logs mt-4">
        <h4>Test Logs</h4>
        <div className="log-container border p-2 bg-light" style={{maxHeight: '400px', overflowY: 'auto'}}>
          {logs.length === 0 ? (
            <p className="text-muted">No logs yet</p>
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
      
      <style jsx>{`
        .log-entry {
          padding: 3px 0;
          border-bottom: 1px solid #f0f0f0;
          font-family: monospace;
          font-size: 0.9rem;
        }
        .timestamp {
          color: #777;
          margin-right: 8px;
        }
        .log-entry.info .message { color: #333; }
        .log-entry.success .message { color: #198754; }
        .log-entry.error .message { color: #dc3545; }
        .log-entry.warning .message { color: #fd7e14; }
      `}</style>
    </div>
  );
};

export default APIConnectionTest;
