import React, { useState, useEffect } from 'react';
import { InventoryItem, ModifierGroup } from '../../types';
import { X, Plus, ChevronRight, ChevronLeft, Check, Coffee, Utensils } from 'lucide-react';

interface KioskModifierModalProps {
  selectedItem: InventoryItem | null;
  setSelectedItem: (item: InventoryItem | null) => void;
  modifierGroups: ModifierGroup[];
  onConfirm: (item: InventoryItem, modifiers: string[], finalPrice: number) => void;
  theme: { border: string; light: string; bg: string; bgHover: string; text: string };
}

// Preset option categories for Cafe Items
const CAFE_MILK_OPTIONS = [
  { name: 'Whole Milk', price: 0 },
  { name: 'Oat Milk', price: 0.80 },
  { name: 'Almond Milk', price: 0.80 },
  { name: 'Coconut Milk', price: 0.80 }
];

const CAFE_SYRUP_OPTIONS = [
  { name: 'Vanilla Syrup (2 pumps)', price: 0.50 },
  { name: 'Caramel Syrup (2 pumps)', price: 0.50 },
  { name: 'Hazelnut Syrup (2 pumps)', price: 0.50 },
  { name: 'Sugar-Free Vanilla', price: 0.50 }
];

const CAFE_TEMP_OPTIONS = [
  { name: 'Hot (Standard)', price: 0 },
  { name: 'Iced (+ Cold Foam)', price: 0.75 },
  { name: 'Extra Hot', price: 0 }
];

const CAFE_SHOT_OPTIONS = [
  { name: 'Standard Shot', price: 0 },
  { name: 'Extra Espresso Shot', price: 1.25 },
  { name: 'Decaf Shot', price: 0 }
];

// Preset Wizard Steps for Food Items
const FOOD_WIZARD_STEPS = [
  {
    id: 'protein',
    title: 'Choose Protein / Style',
    subtitle: 'Select your main base option',
    options: [
      { name: 'Angus Beef Patty', price: 0 },
      { name: 'Grilled Chicken Breast', price: 1.00 },
      { name: 'Beyond Veggie Patty', price: 2.00 },
      { name: 'Double Patty (+ $3.50)', price: 3.50 }
    ]
  },
  {
    id: 'prep',
    title: 'Select Doneness / Preparation',
    subtitle: 'How would you like it cooked?',
    options: [
      { name: 'Medium Well', price: 0 },
      { name: 'Medium Rare', price: 0 },
      { name: 'Well Done', price: 0 },
      { name: 'Gluten-Free Lettuce Wrap', price: 0.50 }
    ]
  },
  {
    id: 'sides',
    title: 'Sides & Add-Ons',
    subtitle: 'Customize your side pairing',
    options: [
      { name: 'House Seasoned Fries', price: 0 },
      { name: 'Truffle Parmesan Fries', price: 2.50 },
      { name: 'Side Caesar Salad', price: 2.00 },
      { name: 'Melted Cheddar Cheese', price: 1.25 }
    ]
  }
];

export const KioskModifierModal: React.FC<KioskModifierModalProps> = ({
  selectedItem, setSelectedItem, modifierGroups, onConfirm, theme
}) => {
  const [selectedMods, setSelectedMods] = useState<{ [key: string]: { name: string; price: number } }>({});
  const [wizardStep, setWizardStep] = useState(0);

  useEffect(() => {
    setSelectedMods({});
    setWizardStep(0);
  }, [selectedItem]);

  if (!selectedItem) return null;

  const isCafeItem = Boolean(
    selectedItem.category && 
    /coffee|drink|beverage|tea|espresso|barista|pastry|bakery/i.test(selectedItem.category + ' ' + selectedItem.name)
  );

  // Calculate real-time dynamic total
  const modAdditions = (Object.values(selectedMods || {}) as {name: string, price: number}[]).reduce((sum, m) => sum + (m?.price || 0), 0);
  const currentTotal = selectedItem.price + modAdditions;

  const handleToggleOption = (categoryKey: string, optName: string, price: number) => {
    setSelectedMods(prev => {
      const next = { ...(prev || {}) };
      if (next[categoryKey]?.name === optName) {
        delete next[categoryKey];
      } else {
        next[categoryKey] = { name: optName, price };
      }
      return next;
    });
  };

  const handleConfirmOrder = () => {
    const modNames = (Object.values(selectedMods || {}) as {name: string, price: number}[]).map(m => (m?.price || 0) > 0 ? `${m.name} (+$${(m?.price || 0).toFixed(2)})` : m?.name || '');
    onConfirm(selectedItem, modNames, currentTotal);
    setSelectedItem(null);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/70 backdrop-blur-md animate-fade-in p-4 sm:p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col animate-scale-in overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-2xl ${theme.light}`}>
              {isCafeItem ? <Coffee size={24} /> : <Utensils size={24} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {isCafeItem ? 'Beverage Grid Customizer' : `Step ${wizardStep + 1} of ${FOOD_WIZARD_STEPS.length}: Food Wizard`}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900">{selectedItem.name}</h2>
            </div>
          </div>

          <button 
            onClick={() => setSelectedItem(null)}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {isCafeItem ? (
            /* CAFE GRID MODIFIER INTERFACE */
            <div className="space-y-6">
              {/* Milk */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">Choice of Milk / Base</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CAFE_MILK_OPTIONS.map(opt => {
                    const isSelected = selectedMods['milk']?.name === opt.name;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => handleToggleOption('milk', opt.name, opt.price)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all font-bold text-xs flex flex-col justify-between h-20 ${
                          isSelected ? `${theme.border} ${theme.light} ring-2 ring-indigo-300` : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="text-[11px] text-slate-500 font-semibold">{opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Included'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Temperature */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">Temperature & Style</h4>
                <div className="grid grid-cols-3 gap-3">
                  {CAFE_TEMP_OPTIONS.map(opt => {
                    const isSelected = selectedMods['temp']?.name === opt.name;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => handleToggleOption('temp', opt.name, opt.price)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all font-bold text-xs flex flex-col justify-between h-20 ${
                          isSelected ? `${theme.border} ${theme.light} ring-2 ring-indigo-300` : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="text-[11px] text-slate-500 font-semibold">{opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Standard'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Syrups */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">Flavor & Syrups</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {CAFE_SYRUP_OPTIONS.map(opt => {
                    const isSelected = selectedMods['syrup']?.name === opt.name;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => handleToggleOption('syrup', opt.name, opt.price)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all font-bold text-xs flex flex-col justify-between h-20 ${
                          isSelected ? `${theme.border} ${theme.light} ring-2 ring-indigo-300` : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="text-[11px] text-slate-500 font-semibold">{opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Free'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Espresso Shots */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 mb-3">Espresso Intensity</h4>
                <div className="grid grid-cols-3 gap-3">
                  {CAFE_SHOT_OPTIONS.map(opt => {
                    const isSelected = selectedMods['shot']?.name === opt.name;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => handleToggleOption('shot', opt.name, opt.price)}
                        className={`p-3.5 rounded-2xl border-2 text-left transition-all font-bold text-xs flex flex-col justify-between h-20 ${
                          isSelected ? `${theme.border} ${theme.light} ring-2 ring-indigo-300` : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <span>{opt.name}</span>
                        <span className="text-[11px] text-slate-500 font-semibold">{opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Included'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* RESTAURANT WIZARD STEP MODIFIER INTERFACE */
            <div className="space-y-6">
              {/* Wizard Step Indicator Bar */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                {FOOD_WIZARD_STEPS.map((step, idx) => (
                  <button
                    key={step.id}
                    onClick={() => setWizardStep(idx)}
                    className={`flex-1 text-center font-bold text-xs pb-2 border-b-2 transition-all ${
                      idx === wizardStep
                        ? 'border-indigo-600 text-indigo-600 font-black'
                        : idx < wizardStep
                        ? 'border-emerald-500 text-emerald-600'
                        : 'border-transparent text-slate-400'
                    }`}
                  >
                    {idx + 1}. {step.title.split(' ')[0]}
                  </button>
                ))}
              </div>

              {/* Current Wizard Step Content */}
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-black text-slate-800">{FOOD_WIZARD_STEPS[wizardStep].title}</h3>
                  <p className="text-xs text-slate-500">{FOOD_WIZARD_STEPS[wizardStep].subtitle}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {FOOD_WIZARD_STEPS[wizardStep].options.map(opt => {
                    const categoryKey = FOOD_WIZARD_STEPS[wizardStep].id;
                    const isSelected = selectedMods[categoryKey]?.name === opt.name;
                    return (
                      <button
                        key={opt.name}
                        onClick={() => handleToggleOption(categoryKey, opt.name, opt.price)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all font-bold text-sm flex items-center justify-between ${
                          isSelected ? `${theme.border} ${theme.light} ring-2 ring-indigo-300` : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300'
                          }`}>
                            {isSelected && <Check size={14} />}
                          </div>
                          <span>{opt.name}</span>
                        </div>
                        <span className="text-xs font-black text-slate-500">{opt.price > 0 ? `+$${opt.price.toFixed(2)}` : 'Included'}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Real-Time Dynamic Price & Confirm */}
        <div className="p-6 border-t border-slate-200 bg-slate-50 shrink-0 flex items-center justify-between gap-4">
          <div>
            <span className="block text-[10px] font-black uppercase tracking-wider text-slate-400">Real-Time Subtotal</span>
            <div className="text-2xl font-black text-slate-900">${currentTotal.toFixed(2)}</div>
          </div>

          <div className="flex items-center gap-3">
            {!isCafeItem && wizardStep < FOOD_WIZARD_STEPS.length - 1 ? (
              <button
                onClick={() => setWizardStep(prev => prev + 1)}
                className={`py-4 px-6 rounded-2xl font-black text-sm flex items-center gap-2 ${theme.bg} text-white hover:scale-105 transition-all shadow-md`}
              >
                Next Step <ChevronRight size={18} />
              </button>
            ) : null}

            <button
              onClick={handleConfirmOrder}
              className={`py-4 px-8 rounded-2xl font-black text-base flex items-center gap-2 ${theme.bg} text-white ${theme.bgHover} shadow-xl hover:scale-105 transition-all`}
            >
              <Plus size={20} />
              Add to Cart • ${currentTotal.toFixed(2)}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
