import React from 'react';
import { authService } from '../services/authService';

const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const isAuthenticated = !!user;

  React.useEffect(() => {
    authService
      .refreshToken()
      .then(() => authService.getCurrentUser())
      .then(setUser)
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    window.location.href = `${process.env.PUBLIC_URL}/login`;
  };

  const register = async (name, email, password) =>
    authService.register(name, email, password);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
