import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  message: string;
  duration?: number;
  onClose: () => void;
}

const toastClasses: Record<ToastType, string> = {
  success: 'bg-white/10 border-white/50 text-white',
  error: 'bg-black/70 border-white/50 text-white',
  warning: 'bg-black/70 border-white/50 text-white',
  info: 'bg-black/70 border-white/50 text-white',
};

const toastIcons: Record<ToastType, React.ReactNode> = {
  success: <CheckCircle className="w-5 h-5" />,
  error: <AlertCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  info: <AlertCircle className="w-5 h-5" />,
};

const Toast: React.FC<ToastProps> = ({ 
  type, 
  message, 
  duration = 3000, 
  onClose 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    
    return () => clearTimeout(timer);
  }, [duration, onClose]);
  
  return (
    <div 
      className={`
        fixed bottom-4 right-4 flex items-center p-3 pr-4 border rounded-xl shadow-lg backdrop-blur-sm
        transition-all duration-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        ${toastClasses[type]}
      `}
    >
      <div className="flex items-center gap-3">
        <span className="opacity-90">{toastIcons[type]}</span>
        <span className="font-medium">{message}</span>
      </div>
      <button 
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 300);
        }}
        className="ml-4 hover:opacity-70 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;