import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';
import './auth.css';

function ForgotPasswordPage() {
  const { t } = useTranslation();
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
      setServerError(t('auth.forgot_password.error_default'));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="auth-page">
        <div className="auth-card auth-success">
          <p className="auth-success-icon">📨</p>
          <h2 className="auth-title">{t('auth.forgot_password.success_title')}</h2>
          <p className="auth-subtitle">{t('auth.forgot_password.success_subtitle')}</p>
          <Link
            to="/login"
            className="auth-btn"
            style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
          >
            {t('common.back_to_login')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{t('auth.forgot_password.title')}</h1>
        <p className="auth-subtitle">{t('auth.forgot_password.subtitle')}</p>
        {serverError && <div className="auth-server-error">{serverError}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-group">
            <label className="auth-label" htmlFor="email">{t('common.email')}</label>
            <input
              id="email" name="email" type="email" required
              className="auth-input" value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('auth.login.ph_email')} autoComplete="email"
            />
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? t('auth.forgot_password.btn_loading') : t('auth.forgot_password.btn')}
          </button>
        </form>
        <div className="auth-link-row">
          <Link to="/login">{t('common.back_to_login')}</Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
