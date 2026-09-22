import React, { useState } from 'react';
import { SettingsHeaderScopeBar } from './SettingsHeaderScopeBar';
import { SettingsSidebarV2 } from './SettingsSidebarV2';
import { CategoryViewRenderer } from './CategoryViewRenderer';

interface SettingsEnterpriseContainerProps {
  taxConfig?: any;
  setTaxConfig?: any;
  tipConfig?: any;
  setTipConfig?: any;
  removalReasons?: string[];
  setRemovalReasons?: any;
  onNavigate?: (tab: string) => void;
  roles?: any[];
  setRoles?: any;
  rolePermissions?: any[];
  setRolePermissions?: any;
  matrixState?: any;
  setMatrixState?: any;
  kioskConfig?: any;
  setKioskConfig?: any;
  businesses?: any;
  giftCards?: any;
  setGiftCards?: any;
}

export const SettingsEnterpriseContainer: React.FC<SettingsEnterpriseContainerProps> = (props) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('profile_security');
  const [selectedPageId, setSelectedPageId] = useState<string | null>('personal_profile');
  const [currentScope, setCurrentScope] = useState<'organization' | 'location' | 'device' | 'personal'>('location');
  const [selectedLocation, setSelectedLocation] = useState<string>('Downtown Bistro');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [showSaveToast, setShowSaveToast] = useState<boolean>(false);

  const handleFieldChange = () => {
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    setHasUnsavedChanges(false);
    setIsDraft(false);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const handleSaveDraft = () => {
    setHasUnsavedChanges(false);
    setIsDraft(true);
  };

  const handleViewHistory = () => {
    setSelectedCategoryId('integrations_admin');
    setSelectedPageId('config_history');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-slate-50 font-sans overflow-hidden">
      {/* Top Scope and Status Navigation */}
      <SettingsHeaderScopeBar
        currentScope={currentScope}
        setCurrentScope={setCurrentScope}
        selectedLocation={selectedLocation}
        setSelectedLocation={setSelectedLocation}
        isDraft={isDraft}
        hasUnsavedChanges={hasUnsavedChanges}
        onSave={handleSave}
        onSaveDraft={handleSaveDraft}
        onViewHistory={handleViewHistory}
      />

      {/* Main Settings Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Searchable 20-Category Sidebar */}
        <SettingsSidebarV2
          selectedCategoryId={selectedCategoryId}
          setSelectedCategoryId={setSelectedCategoryId}
          selectedPageId={selectedPageId}
          setSelectedPageId={setSelectedPageId}
        />

        {/* Setting Category Content View */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50 relative">
          {showSaveToast && (
            <div className="fixed bottom-6 right-6 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 z-50 animate-bounce">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
              <span className="text-xs font-bold">Settings Published Successfully! Live changes applied across active terminals.</span>
            </div>
          )}

          <CategoryViewRenderer
            categoryId={selectedCategoryId}
            selectedPageId={selectedPageId}
            setSelectedPageId={(id) => setSelectedPageId(id)}
            onFieldChange={handleFieldChange}
            {...props}
          />
        </div>
      </div>
    </div>
  );
};
