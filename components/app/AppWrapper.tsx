/**
 * AppWrapper
 * Root context and provider composition wrapper for Newgate POS.
 * Initializes singleton services (SyncService, RealtimeTransport) once at the root level,
 * wraps the application with SettingsProvider, and provides a stable application context.
 */

import React, { useEffect, useState, createContext, useContext } from 'react';
import { SettingsProvider } from '../../src/context/SettingsContext';
import { SyncService } from '../../services/syncService';
import { RealtimeTransport } from '../../services/realtimeTransport';
import { ManagerApprovalModal } from '../modals/ManagerApprovalModal';
import { ManagerApprovalResult, AuthorizationContext } from '../../services/permissionService';

interface GlobalApprovalRequest {
  actionTitle: string;
  actionKey: string;
  context: AuthorizationContext;
  details?: string;
  resolve: (result: ManagerApprovalResult) => void;
}

interface AppWrapperContextType {
  requestManagerApproval: (
    actionTitle: string,
    actionKey: string,
    context: AuthorizationContext,
    details?: string
  ) => Promise<ManagerApprovalResult>;
  isOnline: boolean;
}

const AppWrapperContext = createContext<AppWrapperContextType | null>(null);

export const useAppWrapper = (): AppWrapperContextType => {
  const ctx = useContext(AppWrapperContext);
  if (!ctx) {
    throw new Error('useAppWrapper must be used within AppWrapper');
  }
  return ctx;
};

export const AppWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [approvalRequest, setApprovalRequest] = useState<GlobalApprovalRequest | null>(null);
  const [isOnline, setIsOnline] = useState(SyncService.isOnline());

  useEffect(() => {
    // Initialize background singleton transports once
    SyncService.init();
    RealtimeTransport.init();

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const requestManagerApproval = (
    actionTitle: string,
    actionKey: string,
    context: AuthorizationContext,
    details?: string
  ): Promise<ManagerApprovalResult> => {
    return new Promise((resolve) => {
      setApprovalRequest({
        actionTitle,
        actionKey,
        context,
        details,
        resolve,
      });
    });
  };

  const handleApprovalClose = () => {
    if (approvalRequest) {
      approvalRequest.resolve({ approved: false });
      setApprovalRequest(null);
    }
  };

  const handleApproved = (result: ManagerApprovalResult) => {
    if (approvalRequest) {
      approvalRequest.resolve(result);
      setApprovalRequest(null);
    }
  };

  return (
    <SettingsProvider>
      <AppWrapperContext.Provider value={{ requestManagerApproval, isOnline }}>
        {children}

        {approvalRequest && (
          <ManagerApprovalModal
            isOpen={true}
            onClose={handleApprovalClose}
            onApproved={handleApproved}
            actionTitle={approvalRequest.actionTitle}
            actionKey={approvalRequest.actionKey}
            context={approvalRequest.context}
            details={approvalRequest.details}
          />
        )}
      </AppWrapperContext.Provider>
    </SettingsProvider>
  );
};
