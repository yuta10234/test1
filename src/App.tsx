import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();
  return <Navigate to={user?.isAuthenticated ? "/home" : "/"} replace />;
}

export default App;