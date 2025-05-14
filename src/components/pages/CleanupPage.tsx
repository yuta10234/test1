import React from 'react';
import { Trash2 } from 'lucide-react';
import { useSettings } from '../../context/SettingsContext';
import ToggleSwitch from '../ui/ToggleSwitch';
import Toast, { ToastType } from '../ui/Toast';

const CleanupPage: React.FC = () => {
  const { getSettingsByCategory, toggleSetting, loading } = useSettings();
  const [toast, setToast] = React.useState<{ type: ToastType; message: string } | null>(null);
  
  const settings = getSettingsByCategory('cleanup');
  
  const handleToggle = async (settingId: string, settingName: string, enabled: boolean) => {
    const success = await toggleSetting(settingId);
    
    if (success) {
      setToast({
        type: 'success',
        message: `設定「${settingName}」を${enabled ? '無効' : '有効'}にしました`,
      });
    } else {
      setToast({
        type: 'error',
        message: `設定の変更に失敗しました: ${settingName}`,
      });
    }
  };

  return (
    <div className="animate-fadeIn">
      <div className="flex items-center mb-2">
        <div className="p-2 rounded-lg bg-dark-700 mr-3">
          <Trash2 className="w-6 h-6 text-secondary-500" />
        </div>
        <h1 className="text-2xl font-bold text-white">クリーンアップ</h1>
      </div>
      <p className="text-gray-400 mb-8">
        システムから不要なファイルを削除するための設定。これらの設定を有効にすると、ディスク容量を解放し、システムのパフォーマンスが向上する可能性があります。
      </p>
      
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

export default CleanupPage;