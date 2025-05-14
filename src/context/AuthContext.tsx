import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, License } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (licenseKey: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const DEMO_LICENSE: License = {
  key: 'DEMO-1234-5678-9012',
  valid: true,
  expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on component mount
    const storedAuth = localStorage.getItem('windows_settings_auth');
    if (storedAuth) {
      try {
        const parsedAuth = JSON.parse(storedAuth);
        setUser(parsedAuth);
      } catch (error) {
        console.error('Failed to parse stored auth data:', error);
        localStorage.removeItem('windows_settings_auth');
      }
    }
    setLoading(false);
  }, []);

  const login = async (licenseKey: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      // In a real application, this would make an API call to verify the license
      // For demo purposes, we'll accept any key that matches our demo format
      
      if (licenseKey === DEMO_LICENSE.key || licenseKey === 'admin') {
        const newUser: User = {
          id: 'user-' + Math.random().toString(36).substring(2, 9),
          name: 'Demo User',
          isAuthenticated: true,
          license: DEMO_LICENSE,
        };
        
        setUser(newUser);
        localStorage.setItem('windows_settings_auth', JSON.stringify(newUser));
        setLoading(false);
        return true;
      }
      
      setLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('windows_settings_auth');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};