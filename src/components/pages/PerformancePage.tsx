import React, { useState } from 'react';
import { TrendingUp, Sparkles, RotateCcw } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import { useSystem } from '../../context/SystemContext';
import ToggleSwitch from '../ui/ToggleSwitch';
import Toast, { ToastType } from '../ui/Toast';
import { Setting } from '../../types';
import katanas from '../../assets/katanas.webp';

const PerformancePage: React.FC = () => {
  const { getSettingsByCategory, toggleSetting, updateAllSettings, loading } = useSettings();
  const { systemInfo } = useSystem();
  const [toast, setToast] = React.useState<{ type: ToastType; message: string } | null>(null);
  const [isRecommendedMode, setIsRecommendedMode] = React.useState(false);
  const [previousSettings, setPreviousSettings] = React.useState<Setting[]>([]);
  const [selectedValues, setSelectedValues] = React.useState<{ [key: string]: string }>({});
  
  const performanceSettings = getSettingsByCategory('performance');
  const privacySettings = getSettingsByCategory('privacy');
  const allSettings = [...performanceSettings, ...privacySettings];
  const settings = allSettings.filter(setting => 
    !setting.supportedOS || (Array.isArray(setting.supportedOS) && setting.supportedOS.includes(systemInfo.windowsVersion!))
  );
  
  const sections = [
    'windows',
    'privacy',
    'system',
    'bcd',
    'gaming',
    'power',
    'graphics',
    'nvidia'
  ];
  
  const handleToggle = async (settingId: string, settingName: string, enabled: boolean) => {
    const success = await toggleSetting(settingId);
    
    if (success) {
      setToast({
        type: 'success',
        message: `「${settingName}」を${enabled ? 'オフ' : 'オン'}にしました`,
      });
    } else {
      setToast({
        type: 'error',
        message: `設定の変更に失敗しました: ${settingName}`,
      });
    }
  };

  const handleValueChange = (settingId: string, value: string) => {
    setSelectedValues(prev => ({
      ...prev,
      [settingId]: value
    }));
  };

  const handleValueApply = async (settingId: string, settingName: string) => {
    const setting = settings.find(s => s.id === settingId);
    if (!setting || !setting.command.options) return;

    const selectedValue = selectedValues[settingId] || Object.keys(setting.command.options)[0];
    const command = setting.command.options[selectedValue];
    if (!command) return;

    try {
      // PowerShellコマンドを実行
      const success = await window.electron.ipcRenderer.invoke('run-powershell-command', command);
      
      if (success) {
        setToast({
          type: 'success',
          message: `「${settingName}」の値を${selectedValue}に設定しました`,
        });
      } else {
        setToast({
          type: 'error',
          message: `設定の変更に失敗しました: ${settingName}`,
        });
      }
    } catch (error) {
      setToast({
        type: 'error',
        message: `設定の変更に失敗しました: ${settingName}`,
      });
    }
  };

  const handleRecommendedSettings = async () => {
    if (isRecommendedMode) {
      await updateAllSettings(previousSettings);
      setIsRecommendedMode(false);
      setPreviousSettings([]);
      setToast({
        type: 'success',
        message: '設定を元に戻しました',
      });
    } else {
      setPreviousSettings(settings);
      
      const recommendedSettings = settings.map(setting => ({
        ...setting,
        enabled: setting.id === 'disable-animations' || 
                 setting.id === 'disable-transparency' ||
                 setting.id === 'disable-background-apps'
      }));
      
      await updateAllSettings(recommendedSettings);
      setIsRecommendedMode(true);
      setToast({
        type: 'success',
        message: '推奨設定を適用しました',
      });
    }
  };

  const renderSettingsBySection = (sectionSettings: Setting[]) => {
    return sectionSettings.map((setting) => {
      if (setting.command.options) {
        return (
          <div key={setting.id} className="setting-card">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">{setting.name}</h3>
                <p className="text-sm text-gray-400">{setting.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={selectedValues[setting.id] || Object.keys(setting.command.options)[0]}
                  onChange={(e) => handleValueChange(setting.id, e.target.value)}
                  className="bg-dark-700 text-white border border-dark-600 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  {Object.keys(setting.command.options).map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => handleValueApply(setting.id, setting.name)}
                  disabled={loading}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  適用
                </button>
              </div>
            </div>
          </div>
        );
      }

      return (
        <div key={setting.id} className="setting-card">
          <ToggleSwitch
            id={setting.id}
            enabled={setting.enabled}
            onChange={() => handleToggle(setting.id, setting.name, setting.enabled)}
            label={setting.name}
            description={setting.description}
            disabled={loading}
          />
        </div>
      );
    });
  };
  
  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-dark-700 mr-3">
            <TrendingUp className="w-6 h-6 text-primary-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">パフォーマンス向上</h1>
            <p className="text-gray-400 mt-1">
              システムのパフォーマンスを向上させるための設定
            </p>
          </div>
        </div>
        <button
          onClick={handleRecommendedSettings}
          disabled={loading}
          className={`
            flex items-center px-5 py-2.5 text-base rounded-lg transition-all duration-500 disabled:opacity-50 shadow-button shadow-cuticle hover:shadow-cuticle-hover
            ${isRecommendedMode 
              ? 'bg-primary-500 hover:animate-buttonHover group-hover:animate-buttonHoverOut text-white' 
              : 'bg-primary-500 hover:animate-buttonHover group-hover:animate-buttonHoverOut text-white'}
          `}
        >
          {isRecommendedMode ? (
            <>
              <RotateCcw className="w-4 h-4 mr-2" />
              元に戻す
            </>
          ) : (
            <>
              <img src={katanas} alt="katanas" className="w-6 h-6 mr-1.5 -ml-2" />
              推奨設定を適用
            </>
          )}
        </button>
      </div>
      
      <div className="space-y-8">
        {sections.map((section) => {
          const sectionSettings = settings.filter(s => s.section === section);
          if (sectionSettings.length === 0) return null;
          
          const headerSetting = sectionSettings.find(s => s.id.endsWith('-header'));
          
          return (
            <div key={section} className="space-y-4">
              <div className="border-b border-dark-700 pb-2">
                <h2 className="text-xl font-semibold text-white">{headerSetting?.name}</h2>
                <p className="text-gray-400 text-sm">{headerSetting?.description}</p>
              </div>
              {renderSettingsBySection(sectionSettings.filter(s => !s.id.endsWith('-header')))}
            </div>
          );
        })}
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

export default PerformancePage;