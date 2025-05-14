import React from 'react';
import { Info, Server, LogOut, Key } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const AboutPage: React.FC = () => {
  const { user, logout } = useAuth();
  
  return (
    <div className="animate-fadeIn">
      <div className="flex items-center mb-2">
        <div className="p-2 rounded-lg bg-dark-700 mr-3">
          <Info className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">バージョン情報</h1>
      </div>
      <p className="text-gray-400 mb-8">アプリケーションとライセンスに関する情報</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="setting-card">
          <div className="flex items-center mb-4">
            <Server className="w-5 h-5 text-primary-400 mr-2" />
            <h2 className="text-lg font-semibold text-white">システム情報</h2>
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
              <p className="text-sm text-gray-400">ビルド日</p>
              <p className="text-base text-white">{new Date().toLocaleDateString('ja-JP')}</p>
            </div>
          </div>
        </div>
        
        <div className="setting-card">
          <div className="flex items-center mb-4">
            <Key className="w-5 h-5 text-accent-500 mr-2" />
            <h2 className="text-lg font-semibold text-white">ライセンス情報</h2>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-400">ライセンスキー</p>
              <p className="text-base text-white">{user?.license?.key || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">ライセンスタイプ</p>
              <p className="text-base text-white">プレミアム</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">有効期限</p>
              <p className="text-base text-white">
                {user?.license?.expiresAt 
                  ? new Date(user.license.expiresAt).toLocaleDateString('ja-JP') 
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8 flex justify-end">
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-4 py-2 bg-dark-700 hover:bg-dark-600 rounded-lg transition-colors duration-200"
        >
          <LogOut className="w-4 h-4 text-error-500" />
          <span className="text-white">ログアウト</span>
        </button>
      </div>
    </div>
  );
};

export default AboutPage;