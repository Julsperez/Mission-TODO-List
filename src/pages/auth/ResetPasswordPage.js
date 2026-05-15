import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../../services/authService';
import './auth.css';

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleChange = (e) => {
    setValidationError('');
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      setValidationError('Las contraseñas no coinciden.');
      return;
    }
    if (!token) {
      setServerError('Token inválido o faltante.');
      return;
    }
    setServerError('');
    setLoading(true);
    try {
      await authService.resetPassword(token, form.newPassword);
      navigate('/login', { state: { message: 'Contraseña actualizada. Inicia sesión.' } });
    } catch (err) {
      setServerError(
        err.response?.data?.message || 'El enlace expiró o es inválido. Solicita uno nuevo.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Nueva contraseña</h1>
        <p className="auth-subtitle">Elige una contraseña segura</p>
        {serverError && <div className="auth-server-error">{serverError}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-group">
            <label className="auth-label" htmlFor="newPassword">Nueva contraseña</label>
            <input
              id="newPassword" name="newPassword" type="password" required minLength={8}
              className={`auth-input${validationError ? ' error' : ''}`}
              value={form.newPassword} onChange={handleChange}
              placeholder="Mínimo 8 caracteres" autoComplete="new-password"
            />
          </div>
          <div className="auth-group">
            <label className="auth-label" htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword" name="confirmPassword" type="password" required
              className={`auth-input${validationError ? ' error' : ''}`}
              value={form.confirmPassword} onChange={handleChange}
              placeholder="Repite tu contraseña" autoComplete="new-password"
            />
            {validationError && <span className="auth-error-text">{validationError}</span>}
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar contraseña'}
          </button>
        </form>
        <div className="auth-link-row">
          <Link to="/login">Volver al login</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
