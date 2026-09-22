/**
 * SettingsContext
 * Global React context providing effective settings resolution and scope management.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SettingsService, EffectiveSettings, ScopeIdentifier } from '../../services/settingsService';

interface SettingsContextType {
  settings: EffectiveSettings | null;
  scope: ScopeIdentifier;
  setScope: (scope: ScopeIdentifier) => void;
  updateSettings: (updates: Partial<EffectiveSettings>, employeeId?: string) => Promise<void>;
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scope, setScope] = useState<ScopeIdentifier>({
    merchantId: 'M001',
    locationId: 'LOC-1',
  });
  const [settings, setSettings] = useState<EffectiveSettings | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    SettingsService.resolveEffectiveSettings(scope).then(res => {
      if (isMounted) {
        setSettings(res);
        setIsLoading(false);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [scope.merchantId, scope.locationId, scope.deviceId]);

  const updateSettings = async (updates: Partial<EffectiveSettings>, employeeId: string = 'E101') => {
    const updated = await SettingsService.updateSettings(scope, updates, employeeId);
    setSettings(updated);
  };

  return (
    <SettingsContext.Provider value={{ settings, scope, setScope, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettingsContext = (): SettingsContextType => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettingsContext must be used within a SettingsProvider');
  }
  return ctx;
};
