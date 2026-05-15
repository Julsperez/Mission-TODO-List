import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import './auth.css';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSubmitted(true);
    } catch {
      setServerError('Ocurrió un error. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-success">
          <p className="auth-success-icon">📨</p>
          <h2 className="auth-title">Email enviado</h2>
          <p className="auth-subtitle">
            Si ese email está registrado, recibirás un enlace para restablecer tu contraseña.
          </p>
          <Link
            to="/login"
            className="auth-btn"
            style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
          >
            Volver al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Recuperar contraseña</h1>
        <p className="auth-subtitle">Te enviaremos un enlace a tu email</p>
        {serverError && <div className="auth-server-error">{serverError}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-group">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email" required
              className="auth-input" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="comandante@galaxia.com" autoComplete="email"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
        <div className="auth-link-row">
          <Link to="/login">Volver al login</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
