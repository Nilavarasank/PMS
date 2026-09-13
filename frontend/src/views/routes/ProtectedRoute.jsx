import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthViewModel } from '@/viewmodels/AuthViewModel';

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthViewModel();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
