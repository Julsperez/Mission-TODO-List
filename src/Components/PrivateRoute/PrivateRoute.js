import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

function PrivateRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="appLoadingMessage">Verificando sesión...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export { PrivateRoute };
