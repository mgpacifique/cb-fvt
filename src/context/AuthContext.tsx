'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'analyst' | 'admin' | 'super_admin';

export interface UserSession {
  id: string;
  name: string;
  email: string;
  username?: string;
  shortName: string;
  role: UserRole;
  title: string;
  organization: string;
  avatarUrl?: string;
  sessionToken: string;
  apiKey: string;
  sessionExpiry: string;
  createdAt: string;
}

export interface ExportPreferences {
  defaultFormat: 'csv' | 'json' | 'pdf';
  includeMetadata: boolean;
  currencyFormat: 'USD' | 'Local';
  dateFormat: 'YYYY-MM-DD' | 'DD-MMM-YYYY';
}

interface ToastMessage {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
}

interface AuthContextType {
  role: UserRole;
  user: UserSession | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  preferences: ExportPreferences;
  toasts: ToastMessage[];
  login: (identifier: string, password?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  verifyAdminPassword: (password: string) => Promise<boolean>;
  resetPassword: (email: string, code: string, newPassword: string) => Promise<boolean>;
  updateProfile: (data: { name?: string; organization?: string; defaultFormat?: 'csv' | 'json' | 'pdf' }) => void;
  flushSystemCache: () => void;
  setRole: (role: UserRole) => void;
  generateApiKey: () => string;
  updatePreferences: (newPrefs: Partial<ExportPreferences>) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

const DEFAULT_PREFERENCES: ExportPreferences = {
  defaultFormat: 'csv',
  includeMetadata: true,
  currencyFormat: 'USD',
  dateFormat: 'DD-MMM-YYYY',
};

const getFutureExpiry = () => {
  const d = new Date();
  d.setDate(d.getDate() + 7);
  return d.toISOString();
};

const AuthContext = createContext<AuthContextType>({
  role: 'analyst',
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  preferences: DEFAULT_PREFERENCES,
  toasts: [],
  login: async () => false,
  logout: async () => {},
  verifyAdminPassword: async () => false,
  resetPassword: async () => false,
  updateProfile: () => {},
  flushSystemCache: () => {},
  setRole: () => {},
  generateApiKey: () => '',
  updatePreferences: () => {},
  showToast: () => {},
  dismissToast: () => {},
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('analyst');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserSession | null>(null);
  const [preferences, setPreferences] = useState<ExportPreferences>(DEFAULT_PREFERENCES);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Hydrate session on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSession = async () => {
      try {
        const storedPrefs = localStorage.getItem('cbfvt_preferences');
        if (storedPrefs) {
          setPreferences(JSON.parse(storedPrefs));
        }

        const res = await fetch('/api/auth/session');
        const data = await res.json();

        if (data.authenticated && data.user) {
          setIsAuthenticated(true);
          setRoleState(data.role);
          setUser({
            ...data.user,
            sessionExpiry: getFutureExpiry(),
            apiKey: data.user.apiKey || 'cbfvt_key_live_admin_sec_2026_root',
          });
        } else {
          // Public observer mode
          setIsAuthenticated(false);
          setUser(null);
          setRoleState('analyst');
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
        setRoleState('analyst');
      }
    };

    checkSession();
  }, []);

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const setRole = (newRole: UserRole) => {
    if (newRole === 'admin' || newRole === 'super_admin') {
      showToast('Administrator clearance requires credential authentication.', 'warning');
      return;
    }
    setRoleState('analyst');
    setUser(null);
    setIsAuthenticated(false);
  };

  const login = async (identifier: string, password?: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, password }),
      });

      const data = await res.json();

      if (!res.ok || data.status !== 'success') {
        showToast(data.message || 'Authentication failed. Please check credentials.', 'error');
        return false;
      }

      const authenticatedRole: UserRole = data.role === 'super_admin' ? 'super_admin' : 'admin';
      const authenticatedUser: UserSession = {
        ...data.user,
        role: authenticatedRole,
        sessionExpiry: getFutureExpiry(),
      };

      setRoleState(authenticatedRole);
      setUser(authenticatedUser);
      setIsAuthenticated(true);

      if (typeof window !== 'undefined') {
        localStorage.setItem('cbfvt_session_role', authenticatedRole);
        localStorage.setItem('cbfvt_is_authenticated', 'true');
        localStorage.setItem('cbfvt_session_token', data.token);
      }

      showToast(`Authenticated as ${authenticatedUser.name} (${authenticatedRole.toUpperCase()})`, 'success');
      return true;
    } catch (err: any) {
      showToast('Network error during authentication: ' + err.message, 'error');
      return false;
    }
  };

  const verifyAdminPassword = async (password: string): Promise<boolean> => {
    const success = await login('p.gatabazi@alustudent.com', password);
    if (success) {
      showToast('Administrator clearance granted. Welcome to Data Operations Console.', 'success');
    }
    return success;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}

    setIsAuthenticated(false);
    setUser(null);
    setRoleState('analyst');
    if (typeof window !== 'undefined') {
      localStorage.setItem('cbfvt_is_authenticated', 'false');
      localStorage.setItem('cbfvt_session_role', 'analyst');
      localStorage.removeItem('cbfvt_session_token');
      localStorage.removeItem('cbfvt_session_expiry');
      localStorage.removeItem('cbfvt_custom_user');
      document.cookie = `cbfvt_role=; path=/; max-age=0`;
      document.cookie = `cbfvt_token=; path=/; max-age=0`;
    }
    showToast('Signed out of session. Access restricted to public spatial layer.', 'info');
  };

  const resetPassword = async (email: string, code: string, newPassword: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, newPassword }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        showToast(data.message, 'success');
        return true;
      }
      showToast(data.message || 'Password reset failed.', 'error');
      return false;
    } catch (err: any) {
      showToast('Network error: ' + err.message, 'error');
      return false;
    }
  };

  const updateProfile = (data: { name?: string; organization?: string; defaultFormat?: 'csv' | 'json' | 'pdf' }) => {
    if (!user) return;
    const updated: UserSession = {
      ...user,
      name: data.name ?? user.name,
      organization: data.organization ?? user.organization,
    };
    setUser(updated);
    if (data.defaultFormat) {
      updatePreferences({ defaultFormat: data.defaultFormat });
    }
    showToast('Profile updated successfully', 'success');
  };

  const flushSystemCache = () => {
    showToast('Flushing local storage and cache layers...', 'info');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cbfvt_spatial_cache');
      localStorage.removeItem('cbfvt_recent_corridor');
    }
    setTimeout(() => {
      showToast('System cache cleared. Spatial registry refreshed.', 'success');
    }, 800);
  };

  const generateApiKey = () => {
    const newKey = `cbfvt_key_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    if (user) {
      setUser({ ...user, apiKey: newKey });
    }
    showToast('New developer API Key generated', 'success');
    return newKey;
  };

  const updatePreferences = (newPrefs: Partial<ExportPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...newPrefs };
      if (typeof window !== 'undefined') {
        localStorage.setItem('cbfvt_preferences', JSON.stringify(updated));
      }
      return updated;
    });
    showToast('Preferences updated', 'info');
  };

  const isAdmin = Boolean(user && (role === 'admin' || role === 'super_admin'));

  return (
    <AuthContext.Provider
      value={{
        role,
        user,
        isAuthenticated,
        isAdmin,
        preferences,
        toasts,
        login,
        logout,
        verifyAdminPassword,
        resetPassword,
        updateProfile,
        flushSystemCache,
        setRole,
        generateApiKey,
        updatePreferences,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
