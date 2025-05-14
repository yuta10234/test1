export interface Setting {
  id: string;
  name: string;
  description: string;
  category: 'performance' | 'game' | 'cleanup' | 'privacy' | 'network';
  section?: 'windows' | 'privacy' | 'system' | 'bcd' | 'gaming' | 'power' | 'graphics' | 'nvidia' | 'ui' | 'tcpip';
  enabled: boolean;
  supportedOS: ('win10' | 'win11')[];
  command: {
    enable: string;
    disable: string;
    options?: {
      [key: string]: string;
    };
  };
}

export interface SettingState {
  id: string;
  enabled: boolean;
}

export interface License {
  key: string;
  valid: boolean;
  expiresAt: string;
}

export interface User {
  id: string;
  name: string;
  isAuthenticated: boolean;
  license: License | null;
}

export interface SystemInfo {
  windowsVersion: 'win10' | 'win11' | null;
}