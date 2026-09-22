const fs = require('fs');

const code = `import React, { useState } from 'react';
import { InventoryItem, Category, GlobalTaxConfig, CartItem, ModifierGroup } from '../types';
import { ShoppingCart, Plus, Minus, CreditCard, ArrowLeft, X, Utensils, Check } from 'lucide-react';

interface KioskAppProps {
  items: InventoryItem[];
  categories: Category[];
  modifierGroups?: ModifierGroup[];
  taxConfig: GlobalTaxConfig;
  kioskConfig?: any;
  onProcessSale: (cart: CartItem[], total: number, paymentMethod: string, orderId?: string, tip?: number, discount?: number) => void;
}

const KioskApp: React.FC<KioskAppProps> = ({ items, categories, modifierGroups = [], taxConfig, onProcessSale, kioskConfig }) => {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [showCartModal, setShowCartModal] = useState(false);
  
  // Item detail / modifier selection modal
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [selectedModifiers, setSelectedModifiers] = useState<string[]>([]);

  const config = kioskConfig || {
    welcomeMessage: 'Welcome! What are you craving?',
    themeColor: 'indigo',
    layout: 'sidebar-right',
    categoryLayout: 'top',
    requireCustomerName: false,
    showItemImages: true,
    timeoutSeconds: 60
  };

  const THEMES = {
    indigo: { bg: 'bg-indigo-600', text: 'text-indigo-600', bgHover: 'hover:bg-indigo-700', light: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-600' },
    slate: { bg: 'bg-slate-800', text: 'text-slate-800', bgHover: 'hover:bg-slate-900', light: 'bg-slate-100 text-slate-800', border: 'border-slate-800' },
    rose: { bg: 'bg-rose-600', text: 'text-rose-600', bgHover: 'hover:bg-rose-700', light: 'bg-rose-50 text-rose-700', border: 'border-rose-600' },
    emerald: { bg: 'bg-emerald-600', text: 'text-emerald-600', bgHover: 'hover:bg-emerald-700', light: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-600' },
    amber: { bg: 'bg-amber-500', text: 'text-amber-600', bgHover: 'hover:bg-amber-600', light: 'bg-amber-50 text-amber-700', border: 'border-amber-500' }
  };
  const theme = THEMES[config.themeColor as keyof typeof THEMES] || THEMES.indigo;

  // Filter items that are visible on kiosk
  const kioskItems = items.filter(item => item.showOnKiosk !== false);

  const filteredItems = kioskItems.filter(item => 
    activeCategory === 'All' || item.category === activeCategory
  );

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * (taxConfig.rate / 100);
  const total = subtotal + tax;

  const handleSelectItem = (item: InventoryItem) => {
    // Check if item has modifier groups
    const itemMods = modifierGroups.filter(g => (item.modifierGroups || []).includes(g.id));
    if (itemMods.length > 0) {
      setSelectedItem(item);
      setSelectedModifiers([]);
    } else {
      addToCart(item);
    }
  };

  const toggleModifier = (modName: string) => {
    setSelectedModifiers(prev => 
      prev.includes(modName) ? prev.filter(m => m !== modName) : [...prev, modName]
    );
  };

  const handleConfirmItem = () => {
    if (!selectedItem) return;
    
    setCart(prev => {
      // Find if we have exactly the same item with same modifiers
      const existingIdx = prev.findIndex(i => 
        i.id === selectedItem.id && 
        JSON.stringify(i.modifiers?.sort()) === JSON.stringify(selectedModifiers.sort())
      );
      
      if (existingIdx >= 0) {
        const newCart = [...prev];
        newCart[existingIdx] = { ...newCart[existingIdx], quantity: newCart[existingIdx].quantity + 1 };
        return newCart;
      }
      return [...prev, { ...selectedItem, quantity: 1, subtotal: selectedItem.price, modifiers: selectedModifiers }];
    });
    
    setSelectedItem(null);
  };

  const addToCart = (item: InventoryItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id && (!i.modifiers || i.modifiers.length === 0));
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, subtotal: item.price }];
    });
  };

  const updateQuantity = (cartIndex: number, delta: number) => {
    setCart(prev => {
      const newCart = [...prev];
      const item = newCart[cartIndex];
      const newQty = item.quantity + delta;
      
      if (newQty <= 0) {
        return newCart.filter((_, idx) => idx !== cartIndex);
      }
      
      newCart[cartIndex] = { ...item, quantity: newQty };
      return newCart;
    });
  };

  const handleCheckout = (method: string) => {
    const newOrderNumber = Math.floor(100 + Math.random() * 900).toString();
    setOrderNumber(newOrderNumber);
    onProcessSale(cart, total, method, 'ORD-' + Date.now());
    setOrderComplete(true);
    
    setTimeout(() => {
      setOrderComplete(false);
      setCart([]);
      setIsCheckout(false);
    }, 5000);
  };

  if (orderComplete) {
    return (
      <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 text-center animate-fade-in">
        <div className={\`w-32 h-32 rounded-full \${theme.light} flex items-center justify-center mb-8 animate-scale-in\`}>
          <Check size={64} className={theme.text} />
        </div>
        <h1 className="text-5xl font-black text-slate-900 mb-4">Order Received!</h1>
        <p className="text-2xl text-slate-600 mb-8">Your order number is</p>
        <div className={\`text-8xl font-black \${theme.text} mb-12 animate-pulse\`}>#{orderNumber}</div>
        <p className="text-xl text-slate-500">Please take your receipt and wait for your number to be called.</p>
      </div>
    );
  }

  if (isCheckout) {
    return (
      <div className="h-full flex flex-col bg-slate-50 animate-slide-in-right">
        <div className="p-6 bg-white shadow-sm flex items-center gap-4 shrink-0">
          <button 
            onClick={() => setIsCheckout(false)}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-3xl font-black text-slate-900">Complete Your Order</h1>
        </div>

        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 p-8 overflow-y-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-8">How would you like to pay?</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <button 
                onClick={() => handleCheckout('Card')}
                className={\`p-8 rounded-3xl border-2 border-slate-200 bg-white hover:border-indigo-600 hover:shadow-xl transition-all flex flex-col items-center gap-4 group\`}
              >
                <div className={\`w-20 h-20 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform\`}>
                  <CreditCard size={40} />
                </div>
                <span className="text-2xl font-black text-slate-800">Credit Card</span>
                <span className="text-slate-500 font-medium">Tap, insert, or swipe</span>
              </button>
            </div>
          </div>
          
          <div className="w-96 bg-white border-l border-slate-200 flex flex-col shadow-xl shrink-0">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h2 className="text-2xl font-black text-slate-800">Order Summary</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-800">{item.quantity}x {item.name}</h4>
                    {item.modifiers && item.modifiers.length > 0 && (
                      <p className="text-xs text-slate-500 mt-1">{item.modifiers.join(', ')}</p>
                    )}
                  </div>
                  <span className="font-black text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="space-y-3 mb-6 text-lg font-medium">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-3xl font-black text-slate-900 pt-4 border-t border-slate-200">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderCartContent = () => (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
            <ShoppingCart size={48} className="text-slate-200" />
            <p className="font-medium text-lg">Your cart is empty</p>
          </div>
        ) : (
          cart.map((item, idx) => (
            <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-bold text-slate-800 leading-tight pr-4">{item.name}</h4>
                  {item.modifiers && item.modifiers.length > 0 && (
                    <p className="text-xs text-slate-500 mt-1">{item.modifiers.join(', ')}</p>
                  )}
                </div>
                <span className="font-black text-slate-900 shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 bg-white rounded-xl p-1 border border-slate-200 shadow-sm">
                  <button 
                    onClick={() => updateQuantity(idx, -1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-bold text-slate-800 min-w-[20px] text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(idx, 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => updateQuantity(idx, -item.quantity)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-2"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-6 border-t border-slate-200 bg-white">
        <div className="space-y-2 mb-6 text-sm font-medium">
          <div className="flex justify-between text-slate-500">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-500">
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-black text-slate-900 pt-2 border-t border-slate-100">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
        
        <button 
          disabled={cart.length === 0}
          onClick={() => setIsCheckout(true)}
          className={\`w-full py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 \${
            cart.length > 0 
              ? \`\${theme.bg} text-white \${theme.bgHover} shadow-lg hover:shadow-xl\` 
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }\`}
        >
          Checkout - \${total.toFixed(2)}
        </button>
      </div>
    </>
  );

  return (
    <div className={\`h-full flex bg-slate-50 overflow-hidden \${config.layout === 'sidebar-left' ? 'flex-row-reverse' : ''}\`}>
      
      {/* Main Menu Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Header */}
        <div className="bg-white p-6 shadow-sm border-b border-slate-200 z-10 shrink-0">
          <h1 className="text-3xl font-black text-slate-900 mb-6">{config.welcomeMessage || 'Welcome! What are you craving?'}</h1>
          
          {/* Top Categories */}
          {config.categoryLayout !== 'hidden' && config.categoryLayout !== 'sidebar' && (
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setActiveCategory('All')}
                className={\`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all \${
                  activeCategory === 'All' 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }\`}
              >
                All Items
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={\`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all \${
                    activeCategory === cat.name 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }\`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar Categories */}
          {config.categoryLayout === 'sidebar' && (
            <div className="w-64 bg-white border-r border-slate-200 overflow-y-auto shrink-0 p-4 space-y-2">
              <button
                onClick={() => setActiveCategory('All')}
                className={\`w-full text-left px-4 py-4 rounded-xl font-bold transition-all \${
                  activeCategory === 'All' 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }\`}
              >
                All Items
              </button>
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={\`w-full text-left px-4 py-4 rounded-xl font-bold transition-all \${
                    activeCategory === cat.name 
                      ? 'bg-slate-900 text-white shadow-md' 
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }\`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {/* Items Grid */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className="bg-white rounded-3xl p-6 text-left border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 hover:-translate-y-1 transition-all group flex flex-col h-full"
                >
                  {config.showItemImages !== false && (
                    <div className={\`w-full aspect-square rounded-2xl \${theme.light} mb-6 flex items-center justify-center shrink-0\`}>
                      <Utensils size={48} className={theme.text} />
                    </div>
                  )}
                  <h3 className="text-xl font-black text-slate-900 mb-2 leading-tight">{item.posName || item.name}</h3>
                  {item.description && (
                    <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-4 flex-1">{item.description}</p>
                  )}
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-xl font-black text-slate-800">${item.price.toFixed(2)}</span>
                    <div className={\`w-10 h-10 rounded-full \${theme.bg} text-white flex items-center justify-center group-hover:scale-110 transition-transform\`}>
                      <Plus size={20} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {config.layout !== 'grid-only' && (
        <div className="w-96 bg-white border-l border-r border-slate-200 flex flex-col shadow-xl z-20 shrink-0">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <div className="flex items-center gap-3">
              <ShoppingCart size={24} className="text-slate-800" />
              <h2 className="text-2xl font-black text-slate-800">Your Order</h2>
            </div>
          </div>
          {renderCartContent()}
        </div>
      )}

      {/* Grid Only Floating Button & Modal */}
      {config.layout === 'grid-only' && (
        <>
          {!showCartModal && cart.length > 0 && (
            <button
              onClick={() => setShowCartModal(true)}
              className={\`fixed bottom-8 right-8 py-4 px-8 rounded-full font-black text-lg transition-all flex items-center justify-center gap-3 \${theme.bg} text-white shadow-2xl hover:shadow-xl z-30 animate-scale-in\`}
            >
              <div className="relative">
                <ShoppingCart size={24} />
                <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </span>
              </div>
              View Cart - \${total.toFixed(2)}
            </button>
          )}

          {showCartModal && (
            <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm animate-fade-in">
              <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl animate-slide-in-right">
                <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <ShoppingCart size={24} className="text-slate-800" />
                    <h2 className="text-2xl font-black text-slate-800">Your Order</h2>
                  </div>
                  <button onClick={() => setShowCartModal(false)} className="p-2 bg-slate-200 rounded-full hover:bg-slate-300">
                    <X size={20} />
                  </button>
                </div>
                {renderCartContent()}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modifier Selection Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-6">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-scale-in overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
              <h2 className="text-2xl font-black text-slate-900">Customize {selectedItem.name}</h2>
              <button 
                onClick={() => setSelectedItem(null)}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {modifierGroups.filter(g => (selectedItem.modifierGroups || []).includes(g.id)).map(group => (
                <div key={group.id} className="mb-8 last:mb-0">
                  <h3 className="text-lg font-bold text-slate-800 mb-4">{group.name}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {/* Fallback mock modifiers since real ones aren't stored in modifierGroup type yet */}
                    {['Extra Cheese', 'No Onions', 'Gluten Free', 'Spicy', 'Sauce on Side', 'Well Done'].slice(0, Math.max(3, (group.modifiersCount || 6))).map(mod => {
                      const isSelected = selectedModifiers.includes(mod);
                      return (
                        <button
                          key={mod}
                          onClick={() => toggleModifier(mod)}
                          className={\`p-4 rounded-2xl border-2 font-bold text-sm transition-all \${
                            isSelected 
                              ? \`\${theme.border} \${theme.light}\` 
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                          }\`}
                        >
                          {mod}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50 shrink-0">
              <button 
                onClick={handleConfirmItem}
                className={\`w-full py-5 rounded-2xl font-black text-xl transition-all flex items-center justify-center gap-2 \${theme.bg} text-white \${theme.bgHover} shadow-lg hover:shadow-xl\`}
              >
                <Plus size={24} />
                Add to Order - \${selectedItem.price.toFixed(2)}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default KioskApp;
`
fs.writeFileSync('components/KioskApp.tsx', code);
