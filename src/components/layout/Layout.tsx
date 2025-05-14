import React, { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import Login from '../pages/Login';
import takeImage from '../../assets/take.webp';

const Layout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { user } = useAuth();
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsCollapsed(true);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  if (!user?.isAuthenticated) {
    return <Login />;
  }
  
  return (
    <div className="h-screen flex overflow-hidden relative">
      {/* グラデーション背景 */}
      <div className="absolute inset-0 bg-gradient-blue" />
      
      {/* 竹の画像 */}
      <div className="absolute inset-0 z-0 opacity-15">
        <img 
          src={takeImage} 
          alt="竹" 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div ref={sidebarRef}>
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      </div>
      
      <main 
        className={`
          flex-1 relative overflow-y-auto focus:outline-none transition-all duration-300
          ml-16 w-[calc(100%-4rem)]
        `}
      >
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;