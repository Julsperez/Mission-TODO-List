import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';
import './auth.css';

function RegisterPage() {
  const { t } = useTranslation();
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
      setServerError(err.response?.data?.message || t('auth.register.error_default'));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-success">
          <p className="auth-success-icon">📡</p>
          <h2 className="auth-title">{t('auth.register.success_title')}</h2>
          <p className="auth-subtitle">{t('auth.register.success_subtitle')}</p>
          <Link
            to="/login"
            className="auth-btn"
            style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
          >
            {t('auth.register.success_btn')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{t('auth.register.title')}</h1>
        <p className="auth-subtitle">{t('auth.register.subtitle')}</p>
        {serverError && <div className="auth-server-error">{serverError}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-group">
            <label className="auth-label" htmlFor="name">{t('auth.register.name_label')}</label>
            <input
              id="name" name="name" type="text" required
              className="auth-input" value={form.name} onChange={handleChange}
              placeholder={t('auth.register.ph_name')} autoComplete="name"
            />
          </div>
          <div className="auth-group">
            <label className="auth-label" htmlFor="email">{t('common.email')}</label>
            <input
              id="email" name="email" type="email" required
              className="auth-input" value={form.email} onChange={handleChange}
              placeholder={t('auth.register.ph_email')} autoComplete="email"
            />
          </div>
          <div className="auth-group">
            <label className="auth-label" htmlFor="password">{t('auth.login.password_label')}</label>
            <input
              id="password" name="password" type="password" required minLength={8}
              className="auth-input" value={form.password} onChange={handleChange}
              placeholder={t('auth.register.ph_password')} autoComplete="new-password"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? t('auth.register.btn_loading') : t('auth.register.btn')}
          </button>
        </form>
        <div className="auth-link-row">
          <Link to="/login">{t('auth.register.login_link')}</Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
