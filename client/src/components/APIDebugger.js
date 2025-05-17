import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL, AUTH_ENDPOINTS } from '../utils/api';

/**
 * APIDebugger - A component to help diagnose API connection issues
 * Include this in a test route to check connectivity to the server
 */
const APIDebugger = () => {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('idle');
  const [serverURL, setServerURL] = useState('');

  // Add log entry with timestamp
  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    setLogs(prev => [...prev, { message, timestamp, type }]);
  };

  // Test API connectivity
  const testConnection = async () => {
    setStatus('testing');
    addLog('Starting API connection test...', 'info');
    
    try {
      // Log environment variable
      addLog(`API Base URL: ${API_BASE_URL}`, 'info');
      addLog(`Environment: ${process.env.NODE_ENV}`, 'info');
      addLog(`Direct env var access: ${process.env.REACT_APP_SERVER_URL}`, 'info');
      
      // Test OPTIONS request (CORS preflight)
      addLog('Testing CORS preflight (OPTIONS request)...', 'info');
      
      try {
        const optionsResult = await fetch(AUTH_ENDPOINTS.LOGIN, { 
          method: 'OPTIONS',
          headers: {
            'Origin': window.location.origin,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization'
          }
        });
        
        addLog(`CORS Preflight status: ${optionsResult.status}`, optionsResult.ok ? 'success' : 'error');
        
        // List response headers
        const headers = {};
        optionsResult.headers.forEach((value, key) => {
          headers[key] = value;
        });
        
        addLog(`Response headers: ${JSON.stringify(headers, null, 2)}`, 'info');
      } catch (error) {
        addLog(`CORS Preflight error: ${error.message}`, 'error');
      }
      
      // Test basic API endpoint
      addLog('Testing API endpoint...', 'info');
      const response = await axios.get(`${API_BASE_URL}/auth/test-connection`);
      
      if (response.status === 200) {
        addLog(`Server connection successful: ${JSON.stringify(response.data)}`, 'success');
      } else {
        addLog(`Unexpected status: ${response.status}`, 'warning');
      }
      
      // Test database status endpoint
      addLog('Testing database connection...', 'info');
      try {
        const dbResponse = await axios.get(`${API_BASE_URL}/db/status`);
        if (dbResponse.status === 200 && dbResponse.data.success) {
          addLog(`Database connection successful: ${JSON.stringify(dbResponse.data.status)}`, 'success');
          setStatus('success');
        } else {
          addLog(`Database not connected: ${JSON.stringify(dbResponse.data)}`, 'warning');
          setStatus('warning');
        }
      } catch (dbError) {
        addLog(`Database status check failed: ${dbError.message}`, 'error');
        if (dbError.response) {
          addLog(`DB Status response: ${JSON.stringify(dbError.response.data)}`, 'error');
        }
        setStatus('error');
      }
    } catch (error) {
      addLog(`Error: ${error.message}`, 'error');
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        addLog(`Response data: ${JSON.stringify(error.response.data)}`, 'error');
        addLog(`Response status: ${error.response.status}`, 'error');
        addLog(`Response headers: ${JSON.stringify(error.response.headers)}`, 'error');
      } else if (error.request) {
        // The request was made but no response was received
        addLog('No response received from server', 'error');
      } else {
        // Something happened in setting up the request that triggered an Error
        addLog(`Request setup error: ${error.message}`, 'error');
      }
      
      setStatus('error');
    }
  };

  // Auto-test on mount
  useEffect(() => {
    setServerURL(API_BASE_URL);
    testConnection();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="api-debugger">
      <h2>API Connection Debugger</h2>
      
      <div className="status-panel">
        <div className={`status-indicator ${status}`}></div>
        <span>Status: {status.toUpperCase()}</span>
      </div>
      
      <div className="server-info mb-3">
        <strong>Server URL:</strong> {serverURL}
        <br />
        <strong>Environment:</strong> {process.env.NODE_ENV || 'Not set'}
      </div>
      
      <div className="actions">
        <button
          className="btn btn-primary mb-3"
          onClick={testConnection}
          disabled={status === 'testing'}
        >
          Test Connection
        </button>
      </div>
      
      <div className="logs">
        <h3>Connection Logs</h3>
        <div className="log-entries p-3 border rounded bg-light">
          {logs.length === 0 ? (
            <p className="text-muted">No logs yet. Click "Test Connection" to begin testing.</p>
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
      
      <div className="troubleshooting mt-4">
        <h3>Troubleshooting Tips</h3>
        <ul>
          <li>If you see CORS errors, check that your server has the correct CORS configuration</li>
          <li>If connection fails, verify your API URL is correct in the .env file</li>
          <li>For network errors, ensure your server is running and accessible</li>
          <li>Check browser console (F12) for additional error details</li>
        </ul>
      </div>
    </div>
  );
};

export default APIDebugger;
