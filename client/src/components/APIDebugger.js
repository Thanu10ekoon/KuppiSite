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
      
      // Test actual endpoint
      addLog('Testing API endpoint...', 'info');
      const response = await axios.get(`${API_BASE_URL}/auth/test-connection`);
      
      if (response.status === 200) {
        addLog(`Server response: ${JSON.stringify(response.data)}`, 'success');
        setStatus('success');
      } else {
        addLog(`Unexpected status: ${response.status}`, 'warning');
        setStatus('warning');
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
  }, []);

  return (
    <div className="api-debugger">
      <h2>API Connection Debugger</h2>
      
      <div className="status-panel">
        <div className={`status-indicator ${status}`}></div>
        <span>Status: {status.toUpperCase()}</span>
      </div>
      
      <div className="server-info">
        <strong>Server URL:</strong> {serverURL}
        <button onClick={testConnection} disabled={status === 'testing'}>
          {status === 'testing' ? 'Testing...' : 'Test Connection'}
        </button>
      </div>
      
      <div className="logs">
        <h3>Connection Logs</h3>
        <div className="log-entries">
          {logs.map((log, index) => (
            <div key={index} className={`log-entry ${log.type}`}>
              <span className="timestamp">[{log.timestamp}]</span>
              <span className="message">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .api-debugger {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background-color: #f9f9f9;
          max-width: 800px;
          margin: 0 auto;
        }
        
        .status-panel {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }
        
        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-right: 8px;
        }
        
        .status-indicator.idle { background-color: #999; }
        .status-indicator.testing { background-color: #f5a623; }
        .status-indicator.success { background-color: #4caf50; }
        .status-indicator.error { background-color: #f44336; }
        .status-indicator.warning { background-color: #ff9800; }
        
        .server-info {
          margin-bottom: 20px;
        }
        
        .logs {
          background-color: #fff;
          border: 1px solid #ddd;
          border-radius: 3px;
          padding: 10px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .log-entries {
          font-family: monospace;
          font-size: 12px;
        }
        
        .log-entry {
          padding: 3px 0;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .log-entry.info .message { color: #333; }
        .log-entry.success .message { color: #4caf50; }
        .log-entry.error .message { color: #f44336; }
        .log-entry.warning .message { color: #ff9800; }
        
        .timestamp {
          color: #888;
          margin-right: 8px;
        }
        
        button {
          margin-left: 10px;
          padding: 5px 10px;
          background-color: #4285f4;
          color: white;
          border: none;
          border-radius: 3px;
          cursor: pointer;
        }
        
        button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default APIDebugger;
