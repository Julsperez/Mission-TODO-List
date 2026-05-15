import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import './auth.css';

function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      return;
    }
    authService.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [token]);

  return (
    <div className="auth-page">
      <div className="auth-card auth-success">
        {status === 'loading' && (
          <>
            <p className="auth-success-icon">🛸</p>
            <h2 className="auth-title">Verificando...</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <p className="auth-success-icon">✅</p>
            <h2 className="auth-title">Email verificado</h2>
            <p className="auth-subtitle">Tu cuenta está activa. ¡Puedes iniciar sesión!</p>
            <Link
              to="/login"
              className="auth-btn"
              style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
            >
              Iniciar sesión
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="auth-success-icon">⚠️</p>
            <h2 className="auth-title">Enlace inválido</h2>
            <p className="auth-subtitle">
              El token ha expirado o es inválido. Solicita un nuevo email de verificación.
            </p>
            <Link
              to="/login"
              className="auth-btn"
              style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
            >
              Volver al login
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;
