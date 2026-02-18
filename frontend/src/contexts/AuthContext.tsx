import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role } from '../types';
import { usersApi } from '../services/api';

interface AuthContextValue {
  user: User | null;
  login: (role: Role) => void;
  logout: () => void;
  switchRole: (role: Role) => void;
}

const AuthContext = createContext<AuthContextValue>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  useEffect(() => {
    usersApi.list().then(setAllUsers).catch(() => {});
  }, []);

  const findByRole = (role: Role) =>
    allUsers.find((u) => u.role === role) || allUsers[0] || null;

  const login = (role: Role) => setUser(findByRole(role));
  const logout = () => setUser(null);
  const switchRole = (role: Role) => setUser(findByRole(role));

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
