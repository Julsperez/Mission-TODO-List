let _accessToken = null;

export const tokenService = {
  getAccess:   () => _accessToken,
  setAccess:   (token) => { _accessToken = token; },
  clearAccess: () => { _accessToken = null; },
};
