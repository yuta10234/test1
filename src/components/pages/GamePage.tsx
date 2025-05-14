import React from 'react';
import { Gamepad2, Sparkles, RotateCcw } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import ToggleSwitch from '../ui/ToggleSwitch';
import Toast, { ToastType } from '../ui/Toast';
import katanas from '../../assets/katanas.webp';
import { Setting } from '../../types';

const GamePage: React.FC = () => {
  const { getSettingsByCategory, toggleSetting, updateAllSettings, loading } = useSettings();
  const [toast, setToast] = React.useState<{ type: ToastType; message: string } | null>(null);
  const [isRecommendedMode, setIsRecommendedMode] = React.useState(false);
  const [previousSettings, setPreviousSettings] = React.useState<Setting[]>([]);
  
  const settings = getSettingsByCategory('game');
  
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
        enabled: setting.id === 'game-mode' || 
                 setting.id === 'optimize-visual-effects' ||
                 setting.id === 'disable-notifications'
      }));
      
      await updateAllSettings(recommendedSettings);
      setIsRecommendedMode(true);
      setToast({
        type: 'success',
        message: '推奨設定を適用しました',
      });
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <div className="p-2 rounded-lg bg-dark-700 mr-3">
            <Gamepad2 className="w-6 h-6 text-accent-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">ゲーム最適化</h1>
            <p className="text-gray-400 mt-1">
              ゲーム体験を最適化するための設定
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
      
      <div className="space-y-4">
        {settings.map((setting) => (
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
        ))}
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

export default GamePage;