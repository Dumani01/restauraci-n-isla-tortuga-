import { createContext, useContext, useState } from 'react';
import { findUserByCredentials } from '../../services/databaseService.js';

const AuthContext = createContext(null);

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('rc_user') || 'null');
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);

  const login = (email, password) => {
    const record = findUserByCredentials(email, password);
    if (record) {
      const nextUser = { id: record.id, name: record.name, email: record.email, role: record.role, profile: record.profile, demo: record.demo === true };
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
