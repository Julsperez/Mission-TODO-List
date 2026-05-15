import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import './auth.css';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);
    try {
      await authService.register(form.name, form.email, form.password);
      setSuccess(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Error al crear la cuenta. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-success">
          <p className="auth-success-icon">📡</p>
          <h2 className="auth-title">¡Misión iniciada!</h2>
          <p className="auth-subtitle">
            Revisa tu email para confirmar tu cuenta antes de iniciar sesión.
          </p>
          <Link
            to="/login"
            className="auth-btn"
            style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
          >
            Ir al login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">Únete a la flota espacial</p>
        {serverError && <div className="auth-server-error">{serverError}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-group">
            <label className="auth-label" htmlFor="name">Nombre</label>
            <input
              id="name" name="name" type="text" required
              className="auth-input" value={form.name} onChange={handleChange}
              placeholder="Comandante Orion" autoComplete="name"
            />
          </div>
          <div className="auth-group">
            <label className="auth-label" htmlFor="email">Email</label>
            <input
              id="email" name="email" type="email" required
              className="auth-input" value={form.email} onChange={handleChange}
              placeholder="comandante@galaxia.com" autoComplete="email"
            />
          </div>
          <div className="auth-group">
            <label className="auth-label" htmlFor="password">Contraseña</label>
            <input
              id="password" name="password" type="password" required minLength={8}
              className="auth-input" value={form.password} onChange={handleChange}
              placeholder="Mínimo 8 caracteres" autoComplete="new-password"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>
        <div className="auth-link-row">
          <Link to="/login">¿Ya tienes cuenta? Inicia sesión</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
