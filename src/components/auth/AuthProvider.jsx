import { createContext, useCallback, useContext, useState } from 'react';
import { findUserByCredentials, findUserForSession } from '../../services/databaseService.js';

const AuthContext = createContext(null);

function getStoredUser() {
  let serialized;
  try {
    serialized = localStorage.getItem('rc_user');
  } catch {
    return { user: null, error: 'AUTH_STORAGE_UNAVAILABLE' };
  }
  let stored;
  try {
    stored = JSON.parse(serialized || 'null');
  } catch {
    return { user: null, error: 'INVALID_SESSION' };
  }
  if (!stored) return { user: null, error: '' };
  let user;
  try {
    user = findUserForSession(stored);
  } catch {
    return { user: null, error: 'AUTH_STORAGE_UNAVAILABLE' };
  }
  if (!user) {
    try {
      localStorage.removeItem('rc_user');
    } catch {
      return { user: null, error: 'AUTH_STORAGE_UNAVAILABLE' };
    }
    return { user: null, error: 'INVALID_SESSION' };
  }
  return { user, error: '' };
}

export function AuthProvider({ children }) {
  const [initialSession] = useState(getStoredUser);
  const [authError, setAuthError] = useState(initialSession.error);
  const [user, setUser] = useState(initialSession.user);

  const login = useCallback((email, password) => {
    setAuthError('');
    try {
      const record = findUserByCredentials(email, password);
      if (!record) return false;
      const nextUser = findUserForSession(record);
      if (!nextUser) {
        setAuthError('INVALID_SESSION');
        return false;
      }
      localStorage.setItem('rc_user', JSON.stringify(nextUser));
      setUser(nextUser);
      return true;
    } catch {
      setAuthError('AUTH_STORAGE_UNAVAILABLE');
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem('rc_user');
    } catch {
      setAuthError('AUTH_STORAGE_UNAVAILABLE');
    } finally {
      setUser(null);
    }
  }, []);

  return <AuthContext.Provider value={{ user, login, logout, authError }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
