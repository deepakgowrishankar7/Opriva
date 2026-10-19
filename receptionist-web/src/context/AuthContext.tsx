import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi, getAuthToken, setAuthToken, removeAuthToken } from '../services/api';

export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  role: 'ROLE_PATIENT' | 'ROLE_RECEPTIONIST' | 'ROLE_CLINICIAN' | 'ROLE_SUPPORT';
  preferredLanguage: string;
}

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  loading: boolean;
  login: (identifier: string, pass: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: 'ROLE_PATIENT' | 'ROLE_RECEPTIONIST' | 'ROLE_CLINICIAN') => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  switchDemoRole: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>({
    userId: 'usr-pat-001',
    fullName: 'Ananya Reddy',
    email: 'patient@opriva.com',
    phone: '9876543212',
    role: 'ROLE_PATIENT',
    preferredLanguage: 'en',
  });
  const [token, setTokenState] = useState<string | null>(getAuthToken());
  const [loading, setLoading] = useState<boolean>(false);

  const fetchProfile = async () => {
    try {
      const profile = await authApi.getMe();
      setUser(profile);
    } catch {
      // keep fallback
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      switchDemoRole('ROLE_PATIENT');
    }
  }, []);

  const login = async (identifier: string, pass: string) => {
    setLoading(true);
    try {
      const res = await authApi.login(identifier, pass);
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser({
        userId: res.userId,
        fullName: res.fullName,
        email: res.email,
        phone: res.phone,
        role: res.role,
        preferredLanguage: res.preferredLanguage,
      });
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await authApi.register(data);
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser({
        userId: res.userId,
        fullName: res.fullName,
        email: res.email,
        phone: res.phone,
        role: res.role,
        preferredLanguage: res.preferredLanguage,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    removeAuthToken();
    setTokenState(null);
    setUser(null);
  };

  const switchDemoRole = async (role: 'ROLE_PATIENT' | 'ROLE_RECEPTIONIST' | 'ROLE_CLINICIAN') => {
    setLoading(true);
    let identifier = 'patient@opriva.com';
    if (role === 'ROLE_RECEPTIONIST') identifier = 'receptionist@apollo.opriva.com';
    if (role === 'ROLE_CLINICIAN') identifier = 'dr.sharma@apollo.opriva.com';

    try {
      const res = await authApi.login(identifier, 'password123');
      setAuthToken(res.token);
      setTokenState(res.token);
      setUser({
        userId: res.userId,
        fullName: res.fullName,
        email: res.email,
        phone: res.phone,
        role: res.role,
        preferredLanguage: res.preferredLanguage,
      });
    } catch (e) {
      console.warn('Demo switch error', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
