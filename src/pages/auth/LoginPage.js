import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../Hooks/useAuth';
import './auth.css';

function LoginPage() {
  const { t } = useTranslation();
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
      setServerError(err.response?.data?.message || t('auth.login.error_default'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{t('auth.login.title')}</h1>
        <p className="auth-subtitle">{t('auth.login.subtitle')}</p>
        {serverError && <div className="auth-server-error">{serverError}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-group">
            <label className="auth-label" htmlFor="email">{t('common.email')}</label>
            <input
              id="email" name="email" type="email" required
              className="auth-input" value={form.email} onChange={handleChange}
              placeholder={t('auth.login.ph_email')} autoComplete="email"
            />
          </div>
          <div className="auth-group">
            <label className="auth-label" htmlFor="password">{t('auth.login.password_label')}</label>
            <input
              id="password" name="password" type="password" required
              className="auth-input" value={form.password} onChange={handleChange}
              placeholder={t('auth.login.ph_password')} autoComplete="current-password"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? t('auth.login.btn_loading') : t('auth.login.btn')}
          </button>
        </form>
        <div className="auth-link-row">
          <Link to="/forgot-password">{t('auth.login.forgot_link')}</Link>
          <Link to="/register">{t('auth.login.register_link')}</Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
