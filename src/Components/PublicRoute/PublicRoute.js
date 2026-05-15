import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';

function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="appLoadingMessage">Verificando sesión...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export { PublicRoute };
