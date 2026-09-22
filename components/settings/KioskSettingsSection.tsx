import React, { useState } from 'react';
import { MonitorSmartphone, MessageSquare, LayoutGrid, Palette, Code, FileJson } from 'lucide-react';
import { KioskConfig, Category, InventoryItem } from '../../types';
import { OperatingModeSelector } from './kiosk/OperatingModeSelector';
import { CategoryManager } from './kiosk/CategoryManager';
import { ItemAssignmentPanel } from './kiosk/ItemAssignmentPanel';
import { KioskJsonPreviewModal } from './kiosk/KioskJsonPreviewModal';
import { MOCK_CATEGORIES, MOCK_INVENTORY_ITEMS } from '../../hooks/appStateInitial';

interface KioskSettingsSectionProps {
  kioskConfig?: KioskConfig;
  setKioskConfig?: React.Dispatch<React.SetStateAction<KioskConfig>>;
  categories?: Category[];
  setCategories?: React.Dispatch<React.SetStateAction<Category[]>>;
  inventory?: InventoryItem[];
  setInventory?: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
}

const DEFAULT_KIOSK_CONFIG: KioskConfig = {
  operatingMode: 'Hybrid (Both)',
  welcomeMessage: 'Welcome! What are you craving?',
  themeColor: 'indigo',
  layout: 'bottom-cart',
  requireCustomerName: false,
  showItemImages: true,
  timeoutSeconds: 60
};

export const KioskSettingsSection: React.FC<KioskSettingsSectionProps> = ({
  kioskConfig: externalKioskConfig,
  setKioskConfig: externalSetKioskConfig,
  categories: externalCategories,
  setCategories: externalSetCategories,
  inventory: externalInventory,
  setInventory: externalSetInventory
}) => {
  const [activeTab, setActiveTab] = useState<'modes' | 'categories' | 'items' | 'visuals'>('modes');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fallbacks if not passed directly from parent
  const [localKioskConfig, setLocalKioskConfig] = useState<KioskConfig>(DEFAULT_KIOSK_CONFIG);
  const [localCategories, setLocalCategories] = useState<Category[]>(MOCK_CATEGORIES);
  const [localInventory, setLocalInventory] = useState<InventoryItem[]>(MOCK_INVENTORY_ITEMS);

  const kioskConfig: KioskConfig = {
    ...DEFAULT_KIOSK_CONFIG,
    ...(externalKioskConfig || localKioskConfig)
  };
  const setKioskConfig = externalSetKioskConfig || setLocalKioskConfig;
  const categories = externalCategories || localCategories;
  const setCategories = externalSetCategories || setLocalCategories;
  const inventory = externalInventory || localInventory;
  const setInventory = externalSetInventory || setLocalInventory;

  return (
    <div className="max-w-5xl space-y-6 pb-12 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 shrink-0">
            <MonitorSmartphone size={26} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">Kiosk Architecture & Config Panel</h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Configure operating modes, layout routing, menu mapping, and dynamic visibility switches.
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPreviewOpen(true)}
          className="min-h-[44px] px-5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl flex items-center gap-2 transition-all shadow-md active:scale-95 shrink-0"
        >
          <FileJson size={16} className="text-indigo-400" />
          <span>Inspect Backend Payload</span>
        </button>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'modes', label: '1. Core Operating Modes' },
          { id: 'categories', label: '2. Category CRUD' },
          { id: 'items', label: '3. Menu Item Mapping' },
          { id: 'visuals', label: '4. Layout & Themes' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`min-h-[40px] px-5 py-2 rounded-2xl text-xs font-black transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab 1: Core Operating Modes */}
      {activeTab === 'modes' && (
        <OperatingModeSelector kioskConfig={kioskConfig} setKioskConfig={setKioskConfig} />
      )}

      {/* Tab 2: Category CRUD Management */}
      {activeTab === 'categories' && (
        <CategoryManager categories={categories} setCategories={setCategories} />
      )}

      {/* Tab 3: Item Assignment Panel */}
      {activeTab === 'items' && (
        <ItemAssignmentPanel inventory={inventory} setInventory={setInventory} categories={categories} />
      )}

      {/* Tab 4: Visuals & General Settings */}
      {activeTab === 'visuals' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          {/* Welcome Message */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
              <MessageSquare size={16} className="text-slate-400" />
              Welcome Splash Message
            </label>
            <input
              type="text"
              value={kioskConfig.welcomeMessage}
              onChange={e => setKioskConfig({ ...kioskConfig, welcomeMessage: e.target.value })}
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-900 outline-none focus:border-indigo-600"
              placeholder="e.g. Welcome! What are you craving today?"
            />
          </div>

          {/* Layout Choice */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
              <LayoutGrid size={16} className="text-slate-400" />
              Cart & Navigation Layout
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { id: 'bottom-cart', label: 'Cart on Bottom (Categories on Left)' },
                { id: 'sidebar-right', label: 'Sidebar Cart (Right Side)' },
                { id: 'sidebar-left', label: 'Sidebar Cart (Left Side)' },
                { id: 'grid-only', label: 'Full Menu Grid (Floating Cart Modal)' }
              ].map(layout => (
                <button
                  key={layout.id}
                  onClick={() => setKioskConfig({ ...kioskConfig, layout: layout.id as any })}
                  className={`p-4 rounded-2xl border-2 text-xs font-bold transition-all text-left ${
                    kioskConfig.layout === layout.id
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {layout.label}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Theme Color */}
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
              <Palette size={16} className="text-slate-400" />
              Primary Theme Palette
            </label>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Indigo', value: 'indigo', bg: 'bg-indigo-600' },
                { name: 'Slate', value: 'slate', bg: 'bg-slate-800' },
                { name: 'Rose', value: 'rose', bg: 'bg-rose-600' },
                { name: 'Emerald', value: 'emerald', bg: 'bg-emerald-600' },
                { name: 'Amber', value: 'amber', bg: 'bg-amber-600' }
              ].map(color => (
                <button
                  key={color.value}
                  onClick={() => setKioskConfig({ ...kioskConfig, themeColor: color.value as any })}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border-2 flex items-center gap-2 ${
                    kioskConfig.themeColor === color.value
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${color.bg}`} />
                  {color.name}
                </button>
              ))}
            </div>
          </div>

          {/* Global Switches */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Display Item Images</h4>
                <p className="text-xs text-slate-500">Show food & drink photos on the kiosk grid cards.</p>
              </div>
              <button
                onClick={() => setKioskConfig({ ...kioskConfig, showItemImages: !kioskConfig.showItemImages })}
                className={`w-14 h-8 rounded-full transition-colors relative flex items-center ${
                  kioskConfig.showItemImages ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full absolute transition-all shadow-xs ${
                    kioskConfig.showItemImages ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Require Guest Name at Checkout</h4>
                <p className="text-xs text-slate-500">Prompt for customer name before terminal payment.</p>
              </div>
              <button
                onClick={() => setKioskConfig({ ...kioskConfig, requireCustomerName: !kioskConfig.requireCustomerName })}
                className={`w-14 h-8 rounded-full transition-colors relative flex items-center ${
                  kioskConfig.requireCustomerName ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-6 h-6 bg-white rounded-full absolute transition-all shadow-xs ${
                    kioskConfig.requireCustomerName ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for inspect backend JSON payload */}
      <KioskJsonPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        kioskConfig={kioskConfig}
        categories={categories}
        inventory={inventory}
      />
    </div>
  );
};
