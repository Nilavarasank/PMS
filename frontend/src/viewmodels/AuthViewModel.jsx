import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { loginUser, logoutUser, registerUser } from '@/models/auth.model';

export const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const persist = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
    if (nextUser && nextToken) {
      localStorage.setItem('user', JSON.stringify(nextUser));
      localStorage.setItem('token', nextToken);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  };

  const login = useCallback(async ({ email, password }) => {
    const { data } = await loginUser({ email, password });
    persist(data.user, data.token);
    return data;
  }, []);

  const register = useCallback(async ({ fullName, email, password }) => {
    const { data } = await registerUser({ fullName, email, password });
    persist(data.user, data.token);
    return data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // Client-side logout still proceeds for a stateless JWT.
    }
    persist(null, null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      login,
      register,
      logout,
    }),
    [user, token, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthViewModel() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthViewModel must be used within AuthProvider');
  }
  return context;
}
