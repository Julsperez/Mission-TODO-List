import '../i18n';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { LanguageProvider } from '../context/LanguageContext';
import { TodoProvider } from '../TodoContext';
import { AppContext } from './AppContext';
import { MigrationModal } from '../Components';
import { PrivateRoute } from '../Components/PrivateRoute/PrivateRoute';
import { PublicRoute } from '../Components/PublicRoute/PublicRoute';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import VerifyEmailPage from '../pages/auth/VerifyEmailPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import SettingsPage from '../pages/settings/SettingsPage';

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <AuthProvider>
        <ThemeProvider>
          <LanguageProvider>
          <Routes>

            {/* Rutas públicas — redirigen a / si ya autenticado */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            </Route>

            {/* Rutas neutras — accesibles con o sin sesión (token en URL) */}
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Rutas privadas — redirigen a /login si no autenticado */}
            <Route element={<PrivateRoute />}>
              <Route path="/" element={
                <TodoProvider>
                  <MigrationModal />
                  <AppContext />
                </TodoProvider>
              } />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
          </LanguageProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
