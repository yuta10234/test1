import React from 'react';

interface ToggleSwitchProps {
  id: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ 
  id, 
  enabled, 
  onChange, 
  label, 
  description, 
  disabled = false 
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div className="flex-1">
        {label && <label htmlFor={id} className="font-medium text-base text-white">{label}</label>}
        {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
      </div>
      <div className="flex items-center">
        <span className={`mr-2 text-sm ${enabled ? 'text-primary-400' : 'text-gray-500'}`}>
          {enabled ? 'ON' : 'OFF'}
        </span>
        <label className="toggle-switch">
          <input
            type="checkbox"
            id={id}
            checked={enabled}
            onChange={() => onChange(!enabled)}
            disabled={disabled}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>
    </div>
  );
};

export default ToggleSwitch;