import React from 'react';
import { Coffee, Utensils, Plus, ArrowRight, X } from 'lucide-react';

interface KioskCrossSellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSuggestedItem: (item: { id: string; name: string; price: number; category: string }) => void;
  onProceedToCheckout: () => void;
  cartHasDrinksOnly: boolean;
  cartHasFoodOnly: boolean;
  theme: { bg: string; bgHover: string; light: string; text: string };
}

export const KioskCrossSellModal: React.FC<KioskCrossSellModalProps> = ({
  isOpen,
  onClose,
  onAddSuggestedItem,
  onProceedToCheckout,
  cartHasDrinksOnly,
  cartHasFoodOnly,
  theme
}) => {
  if (!isOpen) return null;

  const suggestedDrink = {
    id: 'cross-drink-1',
    name: 'Signature Iced Caramel Latte',
    price: 5.25,
    category: 'Coffee',
    description: 'Espresso poured over milk and sweet buttery caramel sauce.'
  };

  const suggestedPastry = {
    id: 'cross-pastry-1',
    name: 'Freshly Baked Almond Croissant',
    price: 4.50,
    category: 'Bakery',
    description: 'Flaky, butter croissant filled with almond frangipane.'
  };

  const activeSuggestion = cartHasFoodOnly ? suggestedDrink : suggestedPastry;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/75 backdrop-blur-md animate-fade-in p-6">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg flex flex-col animate-scale-in overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex justify-between items-center relative overflow-hidden">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-300">Perfect Pairing Suggestion</span>
            <h3 className="text-2xl font-black mt-0.5">
              {cartHasFoodOnly ? 'Thirsty? Add a Handcrafted Drink' : 'Need a Bite? Pair with a Pastry'}
            </h3>
          </div>
          <button 
            onClick={onProceedToCheckout}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Suggested Item Card */}
        <div className="p-6 bg-slate-50 flex flex-col items-center text-center">
          <div className={`w-20 h-20 rounded-2xl ${theme.light} flex items-center justify-center mb-4 shadow-sm border border-indigo-100`}>
            {cartHasFoodOnly ? <Coffee size={40} className={theme.text} /> : <Utensils size={40} className={theme.text} />}
          </div>

          <h4 className="text-xl font-black text-slate-900 mb-1">{activeSuggestion.name}</h4>
          <p className="text-xs text-slate-500 font-medium max-w-xs mb-4">{activeSuggestion.description}</p>
          <span className="text-2xl font-black text-slate-900 mb-6">${activeSuggestion.price.toFixed(2)}</span>

          <button
            onClick={() => {
              onAddSuggestedItem(activeSuggestion);
              onProceedToCheckout();
            }}
            className={`w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2 ${theme.bg} text-white ${theme.bgHover} shadow-lg hover:shadow-xl transition-all mb-3`}
          >
            <Plus size={20} />
            Add {activeSuggestion.name} (+$${activeSuggestion.price.toFixed(2)})
          </button>

          <button
            onClick={onProceedToCheckout}
            className="w-full py-3 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors flex items-center justify-center gap-1"
          >
            No thanks, proceed to checkout <ArrowRight size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};
