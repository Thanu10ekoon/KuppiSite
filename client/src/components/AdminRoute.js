import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="text-center my-5">Loading...</div>;
  }

  if (!isAuthenticated || (user && user.role !== 'admin')) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default AdminRoute; 