import React, { createContext, useState, useContext, useEffect } from 'react';
import { Setting } from '../types';
import { defaultSettings } from '../data/settings';

// windowオブジェクトにelectronを追加
declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

interface SettingsContextType {
  settings: Setting[];
  loading: boolean;
  toggleSetting: (id: string) => Promise<boolean>;
  getSettingsByCategory: (category: string) => Setting[];
  updateAllSettings: (newSettings: Setting[]) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<Setting[]>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedSettings = localStorage.getItem('windows_settings_states');
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        const mergedSettings = defaultSettings.map(defaultSetting => {
          const storedSetting = parsedSettings.find((s: Setting) => s.id === defaultSetting.id);
          return storedSetting ? { ...defaultSetting, enabled: storedSetting.enabled } : defaultSetting;
        });
        setSettings(mergedSettings);
      } catch (error) {
        console.error('Failed to parse stored settings:', error);
        localStorage.removeItem('windows_settings_states');
        setSettings(defaultSettings);
      }
    }
    setLoading(false);
  }, []);

  const toggleSetting = async (id: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const setting = settings.find(s => s.id === id);
      if (!setting) {
        throw new Error(`Setting with id ${id} not found`);
      }

      const command = setting.enabled ? setting.command.disable : setting.command.enable;
      console.log(`Executing PowerShell command: ${command}`);

      // PowerShellコマンドを実行
      const result = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      console.log('PowerShell execution result:', result);

      const updatedSettings = settings.map(s => {
        if (s.id === id) {
          return {
            ...s,
            enabled: !s.enabled
          };
        }
        return s;
      });
      
      setSettings(updatedSettings);
      localStorage.setItem('windows_settings_states', JSON.stringify(updatedSettings));
      setLoading(false);
      return true;
    } catch (error) {
      console.error('Error toggling setting:', error);
      setLoading(false);
      return false;
    }
  };

  const updateAllSettings = async (newSettings: Setting[]): Promise<void> => {
    setLoading(true);
    try {
      // Get the category from the first setting in newSettings
      const category = newSettings[0]?.category;
      
      // 現在の設定と新しい設定を比較して、変更が必要な設定のみを実行
      for (const newSetting of newSettings) {
        const currentSetting = settings.find(s => s.id === newSetting.id);
        if (currentSetting && currentSetting.enabled !== newSetting.enabled) {
          const command = newSetting.enabled ? newSetting.command.enable : newSetting.command.disable;
          console.log(`Executing PowerShell command for ${newSetting.id}: ${command}`);
          
          try {
            const result = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
            console.log(`PowerShell execution result for ${newSetting.id}:`, result);
          } catch (error) {
            console.error(`Error executing command for ${newSetting.id}:`, error);
            // エラーが発生した場合でも処理を続行
          }
        }
      }
      
      // 設定を更新
      const updatedSettings = settings.map(setting => {
        if (setting.category === category) {
          const newSetting = newSettings.find(s => s.id === setting.id);
          return newSetting || setting;
        }
        return setting;
      });
      
      setSettings(updatedSettings);
      localStorage.setItem('windows_settings_states', JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error updating settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getSettingsByCategory = (category: string): Setting[] => {
    return settings.filter(setting => setting.category === category);
  };

  return (
    <SettingsContext.Provider value={{ 
      settings, 
      loading, 
      toggleSetting, 
      getSettingsByCategory,
      updateAllSettings 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};