import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type UserRole = 'Manager' | 'Waiter' | 'Chef' | 'Cashier' | null;

interface AuthUser {
  token: string;
  role: UserRole;
  username: string;
  displayName: string;
}

interface AuthContextType {
  role: UserRole;
  user: AuthUser | null;
  login: (token: string, role: string, username: string, displayName: string) => void;
  logout: () => void;
  // kept for backward compatibility with pages that call setRole directly
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'biteplate_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch { localStorage.removeItem(STORAGE_KEY); }
    }
  }, []);

  const login = (token: string, role: string, username: string, displayName: string) => {
    const authUser: AuthUser = { token, role: role as UserRole, username, displayName };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  // Backward-compat shim so existing pages don't break
  const setRole = (role: UserRole) => {
    if (!role) { logout(); return; }
    if (user) {
      const updated = { ...user, role };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ role: user?.role ?? null, user, login, logout, setRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
