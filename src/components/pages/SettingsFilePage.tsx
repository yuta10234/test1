import React, { useState } from 'react';
import { Save, Download } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import Toast, { ToastType } from '../ui/Toast';
import { Setting, SettingState } from '../../types';

const SettingsFilePage: React.FC = () => {
  const { settings, updateAllSettings } = useSettings();
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(null);

  const handleSaveSettings = async () => {
    try {
      // Only save the id and enabled state
      const settingsState: SettingState[] = settings.map(setting => ({
        id: setting.id,
        enabled: setting.enabled
      }));
      
      const settingsData = JSON.stringify(settingsState, null, 2);
      const blob = new Blob([settingsData], { type: 'application/json' });
      
      const handle = await window.showSaveFilePicker({
        suggestedName: 'windows-settings.ktweak',
        types: [{
          description: 'Windows設定ファイル',
          accept: {
            'application/json': ['.ktweak']
          }
        }]
      });
      
      const writable = await handle.createWritable();
      await writable.write(blob);
      await writable.close();
      
      setToast({
        type: 'success',
        message: '設定を保存しました'
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setToast({
          type: 'error',
          message: '設定の保存に失敗しました'
        });
      }
    }
  };

  const handleLoadSettings = async () => {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [{
          description: 'Windows設定ファイル',
          accept: {
            'application/json': ['.ktweak']
          }
        }]
      });
      
      const file = await fileHandle.getFile();
      const content = await file.text();
      const loadedStates: SettingState[] = JSON.parse(content);
      
      // Merge loaded states with existing settings
      const updatedSettings = settings.map(setting => {
        const loadedState = loadedStates.find(state => state.id === setting.id);
        return loadedState ? { ...setting, enabled: loadedState.enabled } : setting;
      });
      
      await updateAllSettings(updatedSettings);
      
      setToast({
        type: 'success',
        message: '設定を読み込みました'
      });
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        setToast({
          type: 'error',
          message: '設定の読み込みに失敗しました'
        });
      }
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center mb-2">
        <div className="p-2 rounded-lg bg-dark-700 mr-3">
          <Save className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">設定ファイル</h1>
      </div>
      <p className="text-gray-400 mb-8">
        現在の設定を保存したり、以前保存した設定を読み込んだりできます。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button
          onClick={handleSaveSettings}
          className="setting-card flex items-center justify-center p-6 hover:bg-dark-700 transition-colors group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-primary-500/10 mb-4 group-hover:bg-primary-500/20 transition-colors">
              <Save className="w-8 h-8 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">設定を保存</h3>
            <p className="text-sm text-gray-400">
              現在の設定を.ktweakファイルとして保存します
            </p>
          </div>
        </button>

        <button
          onClick={handleLoadSettings}
          className="setting-card flex items-center justify-center p-6 hover:bg-dark-700 transition-colors group"
        >
          <div className="flex flex-col items-center text-center">
            <div className="p-4 rounded-full bg-accent-500/10 mb-4 group-hover:bg-accent-500/20 transition-colors">
              <Download className="w-8 h-8 text-accent-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">設定を読み込み</h3>
            <p className="text-sm text-gray-400">
              保存済みの.ktweakファイルから設定を読み込みます
            </p>
          </div>
        </button>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default SettingsFilePage;