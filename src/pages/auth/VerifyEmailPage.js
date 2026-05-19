import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { authService } from '../../services/authService';
import './auth.css';

function VerifyEmailPage() {
  const { t } = useTranslation();
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
            <h2 className="auth-title">{t('auth.verify_email.loading')}</h2>
          </>
        )}
        {status === 'success' && (
          <>
            <p className="auth-success-icon">✅</p>
            <h2 className="auth-title">{t('auth.verify_email.success_title')}</h2>
            <p className="auth-subtitle">{t('auth.verify_email.success_subtitle')}</p>
            <Link
              to="/login"
              className="auth-btn"
              style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
            >
              {t('auth.verify_email.success_btn')}
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="auth-success-icon">⚠️</p>
            <h2 className="auth-title">{t('auth.verify_email.error_title')}</h2>
            <p className="auth-subtitle">{t('auth.verify_email.error_subtitle')}</p>
            <Link
              to="/login"
              className="auth-btn"
              style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}
            >
              {t('auth.verify_email.error_btn')}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyEmailPage;
