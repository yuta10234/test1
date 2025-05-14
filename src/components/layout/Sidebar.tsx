import React, { useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, TrendingUp, Gamepad2, Chrome as Broom, Settings, Save, Wifi } from 'lucide-react';
import musya from '../../assets/musya.webp';

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, toggleSidebar }) => {
  const navItems = useMemo(() => [
    { to: '/', icon: Home, label: 'ホーム' },
    { to: '/performance', icon: TrendingUp, label: 'パフォーマンス向上' },
    { to: '/game', icon: Gamepad2, label: 'ゲーム最適化' },
    { to: '/network', icon: Wifi, label: 'ネットワーク' },
    { to: '/cleanup', icon: Broom, label: 'クリーンアップ' },
    { to: '/settings-file', icon: Save, label: 'ファイル' },
    { to: '/settings', icon: Settings, label: '設定' }
  ], []);

  return (
    <aside 
      className={`
        fixed top-0 left-0 h-screen transition-all duration-300 ease-in-out
        ${isCollapsed 
          ? 'bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#000] w-16 z-10 rounded-r-3xl border-r border-[#111] shadow-2xl' 
          : 'bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#000] w-60 shadow-2xl z-50 rounded-r-3xl border-r border-[#111]'}
      `}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center h-16 border-b border-[#111] bg-[#0a0a0a]">
          <div className={`w-full flex relative ${isCollapsed ? 'justify-center' : 'px-2'}`}>
            <div className="flex items-center gap-0">
              <img 
                src={musya}
                alt="Musya Logo"
                className={`w-12 h-12 object-contain transition-opacity duration-150 drop-shadow-[0_2px_12px_rgba(255,255,255,0.12)] ${isCollapsed ? 'mx-auto' : ''}`}
                loading="eager"
                width="48"
                height="48"
              />
              <h1
                className={`text-xl font-bold text-gray-100 whitespace-nowrap drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] transition-all duration-500 ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 animate-fadeIn'}`}
              >
                Kagen's Tweaker
              </h1>
            </div>
          </div>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto scrollbar-hide">
          <nav className="px-2 space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink 
                key={to}
                to={to} 
                className={({ isActive }) => `sidebar-item relative flex items-center group rounded-lg transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-primary-500/10 via-white/5 to-white/0 shadow-lg ring-1 ring-primary-500/20' : 'hover:bg-gradient-to-r hover:from-white/5 hover:via-white/2 hover:to-white/0'} ${isCollapsed ? 'justify-center' : ''}`}
              >
                <div className={`flex items-center ${isCollapsed ? 'w-auto' : 'w-full'}`}>
                  <div className="flex items-center justify-center w-5">
                    <Icon className="w-5 h-5 text-primary-400 group-hover:text-white transition-colors duration-200 drop-shadow-[0_1px_4px_rgba(255,255,255,0.10)]" />
                  </div>
                  <span className={`ml-3 whitespace-nowrap font-medium tracking-wide ${isCollapsed ? 'opacity-0 w-0 hidden' : 'opacity-100 w-auto'} group-hover:text-white transition-colors duration-200`}>
                    {label}
                  </span>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>
        
        <button 
          onClick={toggleSidebar}
          className="h-10 border-t border-gray-800/60 flex items-center justify-center hover:bg-gradient-to-r hover:from-white/5 hover:to-white/0 transition-colors"
        >
          <svg 
            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ease-in-out ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
    </aside>
  );
};

export default React.memo(Sidebar);