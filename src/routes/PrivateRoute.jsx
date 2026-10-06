import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../components/auth/AuthProvider.jsx';

export function PrivateRoute() {
  return useAuth().user ? <Outlet /> : <Navigate to="/login" replace />;
}
