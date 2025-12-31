
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType } from '../types';
import { apiService } from '../services/apiService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (nome: string, email: string, pass: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('zap_user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      const now = new Date().getTime();
      const loginTime = parsedUser.loginTime || 0;
      if (now - loginTime > 24 * 60 * 60 * 1000) {
        logout();
      } else {
        setUser(parsedUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const foundUser = await apiService.auth.login({ email, senha: pass });
    
    if (foundUser) {
      const userToSave = { ...foundUser, loginTime: new Date().getTime() };
      setUser(userToSave);
      localStorage.setItem('zap_user', JSON.stringify(userToSave));
    } else {
      throw new Error('Email ou senha inválidos');
    }
  };

  const register = async (nome: string, email: string, pass: string) => {
    const newUser = await apiService.auth.register({
      nome,
      email,
      senha_hash: pass
    });
    
    const userToSave = { ...newUser, loginTime: new Date().getTime() };
    setUser(userToSave);
    localStorage.setItem('zap_user', JSON.stringify(userToSave));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('zap_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.tipo === UserType.ADMIN }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
