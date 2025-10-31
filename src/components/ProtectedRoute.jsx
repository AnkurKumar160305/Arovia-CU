import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, requiredRole }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <div className="preloader">
          <div className="circle"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    // Redirect to appropriate dashboard based on user role
    if (user.role === 'doctor') {
      return <Navigate to="/v1/doctorDashboard" replace />;
    } else if (user.role === 'admin') {
      return <Navigate to="/v1/adminDashboard" replace />;
    } else {
      return <Navigate to="/v1/userDashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;