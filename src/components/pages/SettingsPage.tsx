import React from 'react';
import { Settings, Globe, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="animate-fadeIn">
      <div className="flex items-center mb-2">
        <div className="p-2 rounded-lg bg-dark-700 mr-3">
          <Settings className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">設定</h1>
      </div>
      <p className="text-gray-400 mb-8">アプリケーションの設定とバージョン情報</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="setting-card">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-primary-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">言語設定</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <label htmlFor="language" className="block text-sm text-gray-400 mb-1">
                表示言語
              </label>
              <select
                id="language"
                className="w-full bg-dark-700 text-white border border-dark-600 rounded-md p-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="ja">日本語</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="setting-card">
          <div className="flex items-center mb-4">
            <Info className="w-5 h-5 text-accent-500 mr-2" />
            <h2 className="text-lg font-semibold text-white">バージョン情報</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">アプリケーション名</p>
              <p className="text-base text-white">Kagen's Tweaker</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">バージョン</p>
              <p className="text-base text-white">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">ライセンスキー</p>
              <p className="text-base text-white">{user?.license?.key || '-'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;