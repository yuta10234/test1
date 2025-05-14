import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Key, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import sakuraImage from '../../assets/sakura.webp';
import iconImage from '../../assets/icon.webp';

const Login: React.FC = () => {
  const { login, loading, user } = useAuth();
  const [licenseKey, setLicenseKey] = useState('');
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (user?.isAuthenticated) {
      navigate('/home');
    }
    setTimeout(() => setIsVisible(true), 100);
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!licenseKey.trim()) {
      setError('ライセンスキーを入力してください');
      return;
    }
    
    const success = await login(licenseKey);
    if (!success) {
      setError('無効なライセンスキーです');
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* アニメーション付きグラデーション背景 */}
      <div 
        className="absolute inset-0 z-0 animate-gradient"
        style={{
          background: 'linear-gradient(135deg, rgba(0,0,0,0.92) 0%, rgba(13,13,13,0.9) 25%, rgba(26,26,26,0.88) 50%, rgba(39,39,39,0.86) 75%, rgba(51,51,51,0.84) 100%)',
          backgroundSize: '400% 400%',
        }}
      />
      
      {/* 桜の画像 */}
      <div className="absolute inset-0 z-0 opacity-20">
        <img 
          src={sakuraImage} 
          alt="桜" 
          className="w-full h-full object-cover"
        />
      </div>
      
      {/* 認証フォーム */}
      <div className={`glass-panel max-w-md w-full mx-4 p-8 sm:p-10 relative z-10 transform transition-all duration-700 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <img 
              src={iconImage}
              alt="Kagen's Tweaker Logo" 
              className="w-24 h-24 drop-shadow-[0_0_2.5px_white]"
            />
          </div>
          <h1 className="text-2xl font-bold text-primary-400 mb-2 animate-fadeIn">Kagen's Tweaker</h1>
          <p className="text-gray-400 animate-fadeIn">続行するにはライセンスキーを入力してください</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="animate-slideIn">
            <label htmlFor="license" className="block text-sm font-medium text-gray-300 mb-2">
              ライセンスキー
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="license"
                type="text"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="bg-dark-700 block w-full pl-10 pr-3 py-2 border border-dark-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 text-white"
                placeholder="XXXX-XXXX-XXXX-XXXX"
                disabled={loading}
              />
            </div>
            <div className="mt-1 text-xs text-gray-400">
              デモ用キー: DEMO-1234-5678-9012
            </div>
          </div>
          
          {error && (
            <div className="flex items-center text-error-500 text-sm gap-2 animate-shake">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="animate-slideIn">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-300 bg-natural-900 hover:bg-neutral-950 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400 focus:ring-offset-dark-900 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : 'アクティベート'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;