import React from 'react';
import { Check } from 'lucide-react';
import { RolePermissionAccess } from './types';

interface PermissionToggleProps {
  access: RolePermissionAccess;
  isReadOnly: boolean;
  onChange: (val: RolePermissionAccess) => void;
}

export const PermissionToggle: React.FC<PermissionToggleProps> = ({
  access,
  isReadOnly,
  onChange,
}) => {
  const isOn = access === 'ALLOW';

  const handleToggle = () => {
    if (isReadOnly) return;
    onChange(isOn ? 'DENY' : 'ALLOW');
  };

  return (
    <div className="flex items-center justify-center py-1">
      <button
        type="button"
        disabled={isReadOnly}
        onClick={handleToggle}
        title={
          isReadOnly
            ? 'System Admin has full access'
            : isOn
            ? 'Turn OFF'
            : 'Turn ON'
        }
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 ${
          isReadOnly
            ? 'opacity-80 cursor-not-allowed bg-emerald-500'
            : isOn
            ? 'bg-emerald-500 hover:bg-emerald-600'
            : 'bg-slate-300 hover:bg-slate-400'
        }`}
      >
        <span
          className={`pointer-events-none flex items-center justify-center h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
            isOn ? 'translate-x-5 text-emerald-600' : 'translate-x-0 text-slate-400'
          }`}
        >
          {isOn ? (
            <Check size={12} strokeWidth={3} />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          )}
        </span>
      </button>
    </div>
  );
};
