import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import './auth.css';

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleChange = (e) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate(from, { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Credenciales incorrectas. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Iniciar sesión</h1>
        <p className="auth-subtitle">Accede a tus misiones espaciales</p>
        {serverError && <div className="auth-server-error">{serverError}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
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
              id="password" name="password" type="password" required
              className="auth-input" value={form.password} onChange={handleChange}
              placeholder="••••••••" autoComplete="current-password"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Iniciando...' : 'Iniciar sesión'}
          </button>
        </form>
        <div className="auth-link-row">
          <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
          <Link to="/register">Crear cuenta</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
