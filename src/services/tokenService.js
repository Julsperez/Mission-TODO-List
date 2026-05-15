const REFRESH_KEY = 'refresh_token';
let _accessToken = null;

export const tokenService = {
  getAccess:   () => _accessToken,
  getRefresh:  () => localStorage.getItem(REFRESH_KEY),
  setTokens:   (access, refresh) => {
    _accessToken = access;
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clearTokens: () => {
    _accessToken = null;
    localStorage.removeItem(REFRESH_KEY);
  },
};
