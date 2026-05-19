import React from 'react';
import i18n from '../i18n';
import { useAuth } from '../Hooks/useAuth';
import { settingsService } from '../services/settingsService';

const VALID_LANGS = ['es', 'en'];

const LanguageContext = React.createContext(null);

function LanguageProvider({ children }) {
  const { user, isAuthenticated } = useAuth();

  const [language, setLanguageState] = React.useState(() => {
    const detected = i18n.language?.slice(0, 2);
    return VALID_LANGS.includes(detected) ? detected : 'es';
  });

  // Sincronizar desde servidor cuando el usuario carga/hace login
  React.useEffect(() => {
    const serverLang = user?.settings?.language;
    if (serverLang && VALID_LANGS.includes(serverLang)) {
      i18n.changeLanguage(serverLang);
      setLanguageState(serverLang);
    }
  }, [user]);

  const setLanguage = React.useCallback(
    (lang) => {
      if (!VALID_LANGS.includes(lang)) return;
      i18n.changeLanguage(lang);
      setLanguageState(lang);
      if (isAuthenticated) {
        settingsService.updateSettings({ language: lang }).catch(() => {});
      }
    },
    [isAuthenticated]
  );

  const value = React.useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export { LanguageContext, LanguageProvider };
