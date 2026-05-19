import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';
import './auth.css';

function ResetPasswordPage() {
  const { t } = useTranslation();
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
      setValidationError(t('auth.reset_password.error_mismatch'));
      return;
    }
    if (!token) {
      setServerError(t('auth.reset_password.error_token'));
      return;
    }
    setServerError('');
    setLoading(true);
    try {
      await authService.resetPassword(token, form.newPassword);
      navigate('/login', { state: { message: t('auth.reset_password.success_msg') } });
    } catch (err) {
      setServerError(
        err.response?.data?.message || t('auth.reset_password.error_default')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{t('auth.reset_password.title')}</h1>
        <p className="auth-subtitle">{t('auth.reset_password.subtitle')}</p>
        {serverError && <div className="auth-server-error">{serverError}</div>}
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="auth-group">
            <label className="auth-label" htmlFor="newPassword">{t('auth.reset_password.new_password_label')}</label>
            <input
              id="newPassword" name="newPassword" type="password" required minLength={8}
              className={`auth-input${validationError ? ' error' : ''}`}
              value={form.newPassword} onChange={handleChange}
              placeholder={t('auth.reset_password.ph_new_password')} autoComplete="new-password"
            />
          </div>
          <div className="auth-group">
            <label className="auth-label" htmlFor="confirmPassword">{t('auth.reset_password.confirm_password_label')}</label>
            <input
              id="confirmPassword" name="confirmPassword" type="password" required
              className={`auth-input${validationError ? ' error' : ''}`}
              value={form.confirmPassword} onChange={handleChange}
              placeholder={t('auth.reset_password.ph_repeat')} autoComplete="new-password"
            />
            {validationError && <span className="auth-error-text">{validationError}</span>}
          </div>
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? t('auth.reset_password.btn_loading') : t('auth.reset_password.btn')}
          </button>
        </form>
        <div className="auth-link-row">
          <Link to="/login">{t('common.back_to_login')}</Link>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
