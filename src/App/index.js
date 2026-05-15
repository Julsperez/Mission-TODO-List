import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { TodoProvider } from '../TodoContext';
import { AppContext } from './AppContext';
import { PrivateRoute } from '../Components/PrivateRoute/PrivateRoute';
import { PublicRoute } from '../Components/PublicRoute/PublicRoute';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <Routes>

          {/* Rutas públicas — redirigen a / si ya autenticado */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Route>

          {/* Rutas privadas — redirigen a /login si no autenticado */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={
              <TodoProvider>
                <AppContext />
              </TodoProvider>
            } />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
