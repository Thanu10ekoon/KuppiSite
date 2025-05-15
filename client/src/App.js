import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { VideoProvider } from './context/VideoContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VideoDetail from './pages/VideoDetail';
import Admin from './pages/Admin';
import AddVideo from './pages/AddVideo';
import EditVideo from './pages/EditVideo';

// Add Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <AuthProvider>
      <VideoProvider>
        <Router>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/videos/:id" 
                element={
                  <PrivateRoute>
                    <VideoDetail />
                  </PrivateRoute>
                } 
              />
              
              {/* Admin only routes */}
              <Route 
                path="/admin" 
                element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/videos/add" 
                element={
                  <AdminRoute>
                    <AddVideo />
                  </AdminRoute>
                } 
              />
              <Route 
                path="/admin/videos/:id/edit" 
                element={
                  <AdminRoute>
                    <EditVideo />
                  </AdminRoute>
                } 
              />
            </Routes>
          </main>
        </Router>
      </VideoProvider>
    </AuthProvider>
  );
}

export default App;
