import React, { useState, useEffect, useCallback } from 'react';
import { InventoryItem, Category, GlobalTaxConfig, CartItem, ModifierGroup } from '../../types';
import { KioskModifierModal } from './KioskModifierModal';
import { KioskCheckoutView } from './KioskCheckoutView';
import { KioskOrderCompleteView } from './KioskOrderCompleteView';
import { KioskBottomCartBar } from './KioskBottomCartBar';
import { KioskCrossSellModal } from './KioskCrossSellModal';
import { KioskIdleTimeoutModal } from './KioskIdleTimeoutModal';
import { KioskOfflineScreen } from './KioskOfflineScreen';
import { KioskSplashView } from './KioskSplashView';
import { useKioskInactivity } from './kiosk/useKioskInactivity';
import { useKioskCart } from './kiosk/useKioskCart';
import { KioskCatalogView } from './kiosk/KioskCatalogView';

interface KioskAppProps {
  items: InventoryItem[];
  categories: Category[];
  modifierGroups?: ModifierGroup[];
  taxConfig: GlobalTaxConfig;
  kioskConfig?: any;
  onProcessSale: (cart: CartItem[], total: number, paymentMethod: string, orderId?: string, tip?: number, discount?: number) => void;
  onFireToKitchen?: (ticket: any) => void;
}

export const KioskApp: React.FC<KioskAppProps> = ({
  items = [], categories = [], modifierGroups = [], taxConfig, onProcessSale, onFireToKitchen, kioskConfig
}) => {
  const [orderType, setOrderType] = useState<'Dine In' | 'Takeout' | null>(null);
  const [intentMode, setIntentMode] = useState<'QUICK_CAFE' | 'FULL_MENU' | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isCheckout, setIsCheckout] = useState(false);
  const [showCrossSell, setShowCrossSell] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  const cartState = useKioskCart(taxConfig);

  const handleFullReset = useCallback(() => {
    cartState.setCart([]);
    setIsCheckout(false);
    setShowCrossSell(false);
    setOrderComplete(false);
    setOrderType(null);
    setIntentMode(null);
    setActiveCategory('All');
    cartState.setSelectedItem(null);
  }, [cartState]);

  const inactivity = useKioskInactivity({
    timeoutSeconds: kioskConfig?.timeoutSeconds || 60,
    isActiveSession: Boolean(orderType || cartState.cart.length > 0),
    onTimeoutReset: handleFullReset
  });

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const THEMES = {
    indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', bgHover: 'hover:bg-indigo-700', light: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-600' },
    slate: { bg: 'bg-slate-800', text: 'text-slate-800', bgHover: 'hover:bg-slate-900', light: 'bg-slate-100 text-slate-800', border: 'border-slate-800' },
    rose: { bg: 'bg-rose-600', text: 'text-rose-600', bgHover: 'hover:bg-rose-700', light: 'bg-rose-50 text-rose-700', border: 'border-rose-600' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', bgHover: 'hover:bg-emerald-700', light: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-600' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-600', bgHover: 'hover:bg-amber-600', light: 'bg-amber-50 text-amber-700', border: 'border-amber-500' }
  };
  const theme = THEMES[(kioskConfig?.themeColor || 'indigo') as keyof typeof THEMES] || THEMES.indigo;

  const cafeRegex = /coffee|tea|latte|espresso|drink|beverage|pastry|bakery|croissant|muffin|cake|snack/i;
  const filteredItems = items.filter(i => i.showOnKiosk !== false && (intentMode === 'QUICK_CAFE' && activeCategory === 'All' ? cafeRegex.test(i.category + ' ' + i.name) : activeCategory === 'All' || i.category === activeCategory));
  const displayCats = [{ id: 'all', name: 'All' }, ...(intentMode === 'QUICK_CAFE' ? categories.filter(c => cafeRegex.test(c.name)) : categories).filter(c => c.showOnline !== false)];

  const handleCheckoutFinal = (method: string) => {
    const orderId = 'ORD-' + Date.now();
    if (onFireToKitchen) {
      onFireToKitchen({
        id: 'TKT-' + Date.now().toString().slice(-6),
        orderId,
        type: 'Kiosk',
        status: 'Pending',
        timeIn: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        items: cartState.cart.map(item => ({ name: item.name, qty: item.quantity || 1, modifiers: item.modifiers || [] })),
        server: 'Kiosk',
        table: orderType || 'Kiosk'
      });
    }
    const newOrderNumber = Math.floor(100 + Math.random() * 900).toString();
    setOrderNumber(newOrderNumber);
    onProcessSale(cartState.cart, cartState.total, method, orderId);
    setOrderComplete(true);
    setTimeout(() => handleFullReset(), 4000);
  };

  if (isOffline) return <KioskOfflineScreen isOffline={isOffline} onRetryConnection={() => setIsOffline(!navigator.onLine)} theme={theme} />;
  if (!orderType || !intentMode) {
    return <KioskSplashView welcomeMessage={kioskConfig?.welcomeMessage} operatingMode={kioskConfig?.operatingMode || 'Hybrid (Both)'} orderType={orderType} setOrderType={setOrderType} intentMode={intentMode} setIntentMode={setIntentMode} timePeriodLabel="Menu Selection" onAdminExit={() => {}} />;
  }
  if (orderComplete) {
    return <KioskOrderCompleteView orderNumber={orderNumber} orderType={orderType} theme={theme} onDone={handleFullReset} />;
  }
  if (isCheckout) {
    return <KioskCheckoutView cart={cartState.cart} subtotal={cartState.subtotal} tax={cartState.tax} total={cartState.total} orderType={orderType} setIsCheckout={setIsCheckout} handleCheckout={handleCheckoutFinal} />;
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden relative select-none">
      <div className="bg-white p-5 shadow-xs border-b border-slate-200 z-10 shrink-0 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400">{orderType} Order</span>
            <span className="text-xs font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">{intentMode === 'QUICK_CAFE' ? 'Quick Drinks & Pastries' : 'Full Restaurant Menu'}</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 mt-0.5">{kioskConfig?.welcomeMessage || 'Select your items below'}</h1>
        </div>
        <div className="flex items-center gap-3">
          {intentMode === 'QUICK_CAFE' && (
            <button onClick={() => setIntentMode('FULL_MENU')} className="px-4 py-2 min-h-[48px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all cursor-pointer">Switch to Full Menu</button>
          )}
          <button onClick={handleFullReset} className="px-3 py-2 min-h-[48px] bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold text-xs rounded-xl transition-all cursor-pointer">Start Over</button>
        </div>
      </div>

      <KioskCatalogView categories={displayCats} activeCategory={activeCategory} setActiveCategory={setActiveCategory} filteredItems={filteredItems} handleSelectItem={cartState.handleSelectItem} theme={theme} showItemImages={kioskConfig?.showItemImages !== false} />

      <KioskBottomCartBar cart={cartState.cart} theme={theme} updateQuantity={cartState.updateQuantity} subtotal={cartState.subtotal} tax={cartState.tax} total={cartState.total} setIsCheckout={() => setIsCheckout(true)} />

      <KioskModifierModal selectedItem={cartState.selectedItem} setSelectedItem={cartState.setSelectedItem} modifierGroups={modifierGroups} onConfirm={cartState.handleConfirmModifierItem} theme={theme} />

      <KioskCrossSellModal isOpen={showCrossSell} onClose={() => setShowCrossSell(false)} onAddSuggestedItem={cartState.handleAddCrossSellItem} onProceedToCheckout={() => { setShowCrossSell(false); setIsCheckout(true); }} cartHasDrinksOnly={false} cartHasFoodOnly={false} theme={theme} />

      <KioskIdleTimeoutModal showWarning={inactivity.showTimeoutWarning} countdownSeconds={inactivity.countdownSeconds} onExtendSession={inactivity.handleExtendSession} onResetSession={handleFullReset} theme={theme} />
    </div>
  );
};

export default KioskApp;
