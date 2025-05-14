import React, { createContext, useState, useContext, useEffect } from 'react';
import { SystemInfo } from '../types';

interface SystemContextType {
  systemInfo: SystemInfo;
  loading: boolean;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const SystemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemInfo, setSystemInfo] = useState<SystemInfo>({ windowsVersion: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectWindowsVersion = async () => {
      try {
        // In a real application, this would use PowerShell to detect the Windows version
        // For demo purposes, we'll use Windows 11
        const version = 'win11';
        setSystemInfo({ windowsVersion: version as 'win10' | 'win11' });
      } catch (error) {
        console.error('Failed to detect Windows version:', error);
      } finally {
        setLoading(false);
      }
    };

    detectWindowsVersion();
  }, []);

  return (
    <SystemContext.Provider value={{ systemInfo, loading }}>
      {children}
    </SystemContext.Provider>
  );
};

export const useSystem = () => {
  const context = useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};