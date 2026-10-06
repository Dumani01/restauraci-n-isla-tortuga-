import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('rc_user') || 'null'));

  const login = (email, password) => {
    const configuredEmail = import.meta.env.VITE_RC_AUTH_EMAIL;
    const configuredPassword = import.meta.env.VITE_RC_AUTH_PASSWORD;
    if (configuredEmail && configuredPassword && email === configuredEmail && password === configuredPassword) {
      const nextUser = { name: import.meta.env.VITE_RC_AUTH_NAME || configuredEmail, role: 'equipo' };
      localStorage.setItem('rc_user', JSON.stringify(nextUser));
      setUser(nextUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem('rc_user');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
