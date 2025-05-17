import React from 'react';
import APIDebugger from '../components/APIDebugger';
import APIConnectionTest from '../components/APIConnectionTest';
import { API_BASE_URL } from '../utils/api';

const DebugPage = () => {
  // Determine which backend we're using
  const isUsingVercel = API_BASE_URL.includes('vercel.app');
  const backendType = isUsingVercel ? 'Vercel (Remote)' : 'Local';
  
  return (
    <div className="container mt-5 mb-5">
      <h1>API Connection Debug</h1>
      <div className="alert alert-info">
        <strong>Current Backend:</strong> {backendType}
        <br />
        <strong>API URL:</strong> {API_BASE_URL}
      </div>
      <p className="mb-4">
        This page helps diagnose API connection issues between the client and server.
        Use it to check if your environment variables and CORS settings are configured correctly.
      </p>
      
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">
              <h2 className="h5 mb-0">Connection Test</h2>
            </div>
            <div className="card-body">
              <APIConnectionTest />
            </div>
          </div>
        </div>
      </div>
      
      <div className="row">
        <div className="col-12">
          <div className="card mb-4">
            <div className="card-header bg-secondary text-white">
              <h2 className="h5 mb-0">Detailed API Debugger</h2>
            </div>
            <div className="card-body">
              <APIDebugger />
            </div>
          </div>
        </div>
      </div>
      
      <div className="card mt-4">
        <div className="card-header bg-info text-white">
          <h3 className="h5 mb-0">Common Issues</h3>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>CORS errors</strong> - Make sure the server's CORS settings include this domain
            </li>
            <li className="list-group-item">
              <strong>Environment variables</strong> - Check if REACT_APP_SERVER_URL is set correctly
            </li>
            <li className="list-group-item">
              <strong>Network connectivity</strong> - Ensure the server is running and accessible
            </li>
            <li className="list-group-item">
              <strong>API path issues</strong> - Verify the API URL includes /api path
            </li>
            <li className="list-group-item">
              <strong>MongoDB connection</strong> - Database connection issues often cause 500 errors
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DebugPage;
