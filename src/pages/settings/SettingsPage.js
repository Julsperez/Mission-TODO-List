import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { useAuth } from '../../Hooks/useAuth';
import { useTheme } from '../../Hooks/useTheme';
import { useLanguage } from '../../Hooks/useLanguage';
import { userService } from '../../services/userService';
import { Toast } from '../../Components';
import './SettingsPage.css';

const PW_INITIAL = { currentPassword: '', newPassword: '', confirmPassword: '' };

function SettingsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();

  const [toast, setToast] = React.useState(null);
  const showToast = React.useCallback((message, type = 'success') => setToast({ message, type }), []);

  // --- Perfil ---
  const [profileName, setProfileName] = React.useState('');
  const [profileLoading, setProfileLoading] = React.useState(false);
  const [profileError, setProfileError] = React.useState('');

  React.useEffect(() => {
    if (user?.name) setProfileName(user.name);
  }, [user]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileLoading(true);
    try {
      await userService.updateProfile({ name: profileName });
      updateUser({ name: profileName });
      showToast(t('settings.profile_success'));
    } catch (err) {
      setProfileError(err.response?.data?.message || t('settings.profile_error_default'));
    } finally {
      setProfileLoading(false);
    }
  };

  // --- Contraseña ---
  const [pwForm, setPwForm] = React.useState(PW_INITIAL);
  const [pwLoading, setPwLoading] = React.useState(false);
  const [pwError, setPwError] = React.useState('');
  const [pwValidationError, setPwValidationError] = React.useState('');

  const handlePwChange = (e) => {
    const { name, value } = e.target;
    setPwForm(prev => ({ ...prev, [name]: value }));
    setPwValidationError('');
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwValidationError('');
    setPwError('');
    if (pwForm.newPassword.length < 8) {
      setPwValidationError(t('settings.security_error_min_length'));
      return;
    }
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwValidationError(t('settings.security_error_mismatch'));
      return;
    }
    setPwLoading(true);
    try {
      await userService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      setPwForm(PW_INITIAL);
      showToast(t('settings.security_success'));
    } catch (err) {
      const status = err.response?.status;
      // Solo mostrar el mensaje del servidor para errores de dominio (401 contraseña incorrecta,
      // 400 validación). Cualquier otro error (404, 500, red) muestra el mensaje genérico.
      const safeMsg = (status === 401 || status === 400)
        ? err.response?.data?.message
        : null;
      setPwError(safeMsg || t('settings.security_error_default'));
    } finally {
      setPwLoading(false);
    }
  };

  // --- Preferencias ---
  const handleThemeChange = (e) => {
    setTheme(e.target.value);
    showToast(t('settings.prefs_theme_success'));
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
    showToast(t('settings.prefs_lang_success'));
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <button onClick={() => navigate('/')} className="settings-back" aria-label={t('settings.back')}>
          <HiOutlineArrowLeft aria-hidden="true" />
          {t('settings.back')}
        </button>
        <h1 className="settings-title">{t('settings.title')}</h1>
      </header>

      <div className="settings-body">

        {/* Perfil */}
        <section className="settings-section" aria-labelledby="section-profile">
          <h2 id="section-profile" className="settings-section-title">{t('settings.profile_title')}</h2>
          {profileError && <div className="settings-server-error">{profileError}</div>}
          <form onSubmit={handleProfileSubmit} className="settings-form" noValidate>
            <div className="settings-group">
              <label className="settings-label" htmlFor="profileName">{t('settings.profile_name_label')}</label>
              <input
                id="profileName"
                type="text"
                required
                className="settings-input"
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                placeholder={t('settings.profile_name_ph')}
                autoComplete="name"
              />
            </div>
            <div className="settings-group">
              <label className="settings-label">{t('settings.profile_email_label')}</label>
              <p className="settings-readonly">{user?.email}</p>
            </div>
            <button type="submit" className="settings-btn" disabled={profileLoading}>
              {profileLoading ? t('settings.profile_save_loading') : t('settings.profile_save_btn')}
            </button>
          </form>
        </section>

        {/* Seguridad */}
        <section className="settings-section" aria-labelledby="section-security">
          <h2 id="section-security" className="settings-section-title">{t('settings.security_title')}</h2>
          {pwError && <div className="settings-server-error">{pwError}</div>}
          <form onSubmit={handlePasswordSubmit} className="settings-form" noValidate>
            <div className="settings-group">
              <label className="settings-label" htmlFor="currentPassword">{t('settings.security_current_pw_label')}</label>
              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                required
                className="settings-input"
                value={pwForm.currentPassword}
                onChange={handlePwChange}
                autoComplete="current-password"
              />
            </div>
            <div className="settings-group">
              <label className="settings-label" htmlFor="newPassword">{t('settings.security_new_pw_label')}</label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className={`settings-input${pwValidationError ? ' error' : ''}`}
                value={pwForm.newPassword}
                onChange={handlePwChange}
                placeholder={t('settings.security_new_pw_ph')}
                autoComplete="new-password"
              />
            </div>
            <div className="settings-group">
              <label className="settings-label" htmlFor="confirmPassword">{t('settings.security_confirm_pw_label')}</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className={`settings-input${pwValidationError ? ' error' : ''}`}
                value={pwForm.confirmPassword}
                onChange={handlePwChange}
                autoComplete="new-password"
              />
              {pwValidationError && <span className="settings-error-text">{pwValidationError}</span>}
            </div>
            <button type="submit" className="settings-btn" disabled={pwLoading}>
              {pwLoading ? t('settings.security_save_loading') : t('settings.security_save_btn')}
            </button>
          </form>
        </section>

        {/* Preferencias */}
        <section className="settings-section" aria-labelledby="section-preferences">
          <h2 id="section-preferences" className="settings-section-title">{t('settings.prefs_title')}</h2>

          <div className="settings-group">
            <label className="settings-label" htmlFor="themeSelect">{t('settings.prefs_theme_label')}</label>
            <select id="themeSelect" className="settings-select" value={theme} onChange={handleThemeChange}>
              <option value="dark">{t('settings.prefs_theme_dark')}</option>
              <option value="light">{t('settings.prefs_theme_light')}</option>
              <option value="system">{t('settings.prefs_theme_system')}</option>
            </select>
          </div>

          <div className="settings-group">
            <label className="settings-label" htmlFor="languageSelect">{t('settings.prefs_lang_label')}</label>
            <select id="languageSelect" className="settings-select" value={language} onChange={handleLanguageChange}>
              <option value="es">{t('settings.prefs_lang_es')}</option>
              <option value="en">{t('settings.prefs_lang_en')}</option>
            </select>
          </div>
        </section>

      </div>

      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
    </div>
  );
}

export default SettingsPage;
