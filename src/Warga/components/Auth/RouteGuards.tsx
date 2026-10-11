import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './useAuth';

// Only allows access if NOT logged in (prevents logged-in users from seeing Login page)
export const PublicRoute = () => {
  const { user } = useAuth();
  if (!user) return <Outlet />;
  
  // Redirect logged-in users to homepage
  return <Navigate to="/" replace />;
};

// Only allows access if logged in as Warga
export const ProtectedRoute = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/masuk" replace />;
  
  // Only Warga role can access this route
  return user.role === 'Warga' ? <Outlet /> : <Navigate to="/balai/masuk" replace />;
};

// Balai-specific public route (for Balai login page)
export const BalaiPublicRoute = () => {
  const { user } = useAuth();
  if (!user) return <Outlet />;
  
  // Redirect logged-in Balai users to dashboard, Warga users to homepage
  return user.role === 'Balai' ? <Navigate to="/dashboard-balai" replace /> : <Navigate to="/" replace />;
};

// Balai-specific protected route (requires Balai role)
export const BalaiProtectedRoute = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/balai/masuk" replace />;
  
  // Only Balai role can access this route
  return user.role === 'Balai' ? <Outlet /> : <Navigate to="/masuk" replace />;
};