import React from 'react';
import { Settings, Zap, Gamepad2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  
  const categories = [
    {
      id: 'performance',
      name: 'パフォーマンス向上',
      description: 'システムのパフォーマンスを向上させるための設定',
      icon: <Zap className="w-8 h-8 text-primary-400" />,
      path: '/performance'
    },
    {
      id: 'game',
      name: 'ゲーム最適化',
      description: 'ゲーム体験を最適化するための設定',
      icon: <Gamepad2 className="w-8 h-8 text-accent-500" />,
      path: '/game'
    },
    {
      id: 'cleanup',
      name: 'クリーンアップ',
      description: 'システムからの不要なファイルのクリーンアップ',
      icon: <Trash2 className="w-8 h-8 text-secondary-500" />,
      path: '/cleanup'
    }
  ];
  
  return (
    <div className="animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">ようこそ、{user?.name || 'ユーザー'}さん</h1>
          <p className="text-gray-400 mt-1">Windowsの設定を簡単に変更して、システムを最適化できます。</p>
        </div>
        <div className="flex items-center bg-dark-800 rounded-lg px-4 py-2">
          <Settings className="w-5 h-5 text-primary-400 mr-2" />
          <div>
            <div className="text-xs text-gray-400">ライセンス</div>
            <div className="text-sm text-white font-medium">{user?.license?.key || '-'}</div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Link 
            key={category.id}
            to={category.path}
            className="setting-card hover:scale-105 cursor-pointer"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center mb-4">
                <div className="p-2 rounded-lg bg-dark-700">
                  {category.icon}
                </div>
                <h2 className="text-xl font-semibold text-white ml-3">{category.name}</h2>
              </div>
              <p className="text-gray-400 flex-1">{category.description}</p>
              <div className="flex justify-end mt-4">
                <span className="text-primary-400 text-sm flex items-center">
                  設定を表示
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default HomePage;