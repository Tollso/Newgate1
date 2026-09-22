const fs = require('fs');

const code = `import React, { useState } from 'react';
import { DiningTable, InventoryItem, Category, DiningOrderItem } from '../../types';
import { OrderItemRow } from './OrderItemRow';
import { Flame, CreditCard, ArrowLeft, Plus, Share2, SplitSquareHorizontal, Percent, History, Trash2, MoveRight, MoreHorizontal } from 'lucide-react';

interface TableServiceOrderPanelProps {
  table: DiningTable;
  orderItems: DiningOrderItem[];
  guests: { id: number; name?: string }[];
  activeSeat: number;
  setActiveSeat: (seat: number) => void;
  inventory: InventoryItem[];
  categories: Category[];
  activeCategory: string;
  setActiveCategory: (cat: string) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  onBackToFloor: () => void;
  onAddToOrder: (item: InventoryItem) => void;
  onFire: () => void;
  onOpenPayment: () => void;
  subtotal: number;
  tax: number;
  total: number;
  onUpdateOrderItems: (items: DiningOrderItem[]) => void;
  onAddGuest?: () => void;
}

export const TableServiceOrderPanel: React.FC<TableServiceOrderPanelProps> = ({
  table,
  orderItems,
  guests,
  activeSeat,
  setActiveSeat,
  inventory = [],
  categories = [],
  activeCategory,
  setActiveCategory,
  searchTerm,
  setSearchTerm,
  onBackToFloor,
  onAddToOrder,
  onFire,
  onOpenPayment,
  subtotal,
  tax,
  total,
  onUpdateOrderItems,
  onAddGuest
}) => {
  const [itemToMove, setItemToMove] = useState<string | null>(null);
  const [activeGuestActions, setActiveGuestActions] = useState<number | null>(null);

  const filteredMenu = inventory.filter(i => 
    (activeCategory === 'All' || i.category === activeCategory) &&
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeatSubtotal = (seatNum: number) => {
    return orderItems.filter(i => i.seatNumber === seatNum && !i.isVoided).reduce((sum, i) => sum + (i.price * i.quantity), 0);
  };

  const handleVoidItem = (cartId: string) => {
    onUpdateOrderItems(orderItems.map(i => i.cartId === cartId ? { ...i, isVoided: true } : i));
  };

  const handleDiscountItem = (cartId: string) => {
    onUpdateOrderItems(orderItems.map(i => i.cartId === cartId ? { ...i, discount: { type: 'Percentage', value: 10, name: '10% Off' } } : i));
  };

  const handleVoidGuest = (seatNum: number) => {
    onUpdateOrderItems(orderItems.map(i => i.seatNumber === seatNum ? { ...i, isVoided: true } : i));
    setActiveGuestActions(null);
  };

  const handleDiscountGuest = (seatNum: number) => {
    onUpdateOrderItems(orderItems.map(i => i.seatNumber === seatNum ? { ...i, discount: { type: 'Percentage', value: 10, name: '10% Off' } } : i));
    setActiveGuestActions(null);
  };

  const renderGuestGroup = (seatNum: number, name: string) => {
    const items = orderItems.filter(i => i.seatNumber === seatNum);
    const subtotalStr = getSeatSubtotal(seatNum).toFixed(2);
    const isActive = activeSeat === seatNum;
    const showGuestActions = activeGuestActions === seatNum;

    return (
      <div key={seatNum} className="mb-4">
        <div 
          onClick={() => setActiveSeat(seatNum)}
          className={\`flex items-center justify-between p-3 rounded-t-xl cursor-pointer transition-colors \${isActive ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}\`}
        >
          <div className="flex items-center gap-3">
            <div className={\`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs \${isActive ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-400'}\`}>
              {seatNum === 0 ? <Share2 size={16} /> : seatNum}
            </div>
            <div>
              <div className="font-bold text-sm">{name}</div>
              <div className={\`text-[10px] font-medium \${isActive ? 'text-indigo-200' : 'text-slate-500'}\`}>{items.length} items</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold">\${subtotalStr}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); setActiveGuestActions(showGuestActions ? null : seatNum); }}
              className={\`p-1.5 rounded-md hover:bg-black/20 \${showGuestActions ? 'bg-black/20' : ''}\`}
            >
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>

        {showGuestActions && (
          <div className={\`flex gap-2 p-2 border-x \${isActive ? 'bg-indigo-900/40 border-indigo-500/30' : 'bg-slate-800/40 border-slate-700'}\`}>
            <button onClick={() => handleVoidGuest(seatNum)} className="flex-1 py-1.5 bg-red-900/40 hover:bg-red-900/60 text-red-400 rounded text-xs font-bold transition-colors">
              Void All
            </button>
            <button onClick={() => handleDiscountGuest(seatNum)} className="flex-1 py-1.5 bg-slate-900/40 hover:bg-slate-900/60 text-slate-300 rounded text-xs font-bold transition-colors">
              Discount All
            </button>
          </div>
        )}

        <div className={\`p-2 bg-slate-950/50 border-x border-b rounded-b-xl space-y-1 \${isActive ? 'border-indigo-500/30' : 'border-slate-700'}\`}>
          {items.length === 0 ? (
            <div className="text-center py-4 text-xs font-medium text-slate-600">No items</div>
          ) : (
            items.map(item => (
              <OrderItemRow 
                key={item.cartId} 
                item={item}
                onVoid={() => handleVoidItem(item.cartId)}
                onDiscount={() => handleDiscountItem(item.cartId)}
                onMove={() => setItemToMove(item.cartId)}
              />
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col lg:flex-row bg-slate-900 text-white animate-fade-in font-sans overflow-hidden">
      
      {/* Column 1: Ticket (Guests & Items) */}
      <div className="w-full lg:w-[320px] xl:w-[400px] h-[45vh] lg:h-auto border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col bg-slate-900 shrink-0 relative">
        <div className="p-3 lg:p-4 border-b border-slate-800 bg-slate-950 flex flex-col gap-3 shrink-0">
          <div className="flex justify-between items-center">
            <button onClick={onBackToFloor} className="p-2 -ml-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </button>
            <div className="text-right">
              <h2 className="font-black text-lg">Table {table.name}</h2>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{table.status}</p>
            </div>
          </div>
          <button onClick={onAddGuest} className="w-full py-2 mt-1 border border-dashed border-slate-700 hover:border-slate-500 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white transition-colors text-sm font-bold">
            <Plus size={16} /> Add New Guest
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 lg:p-4 bg-slate-900">
          {renderGuestGroup(0, 'Shared Items')}
          {guests.map(g => renderGuestGroup(g.id, g.name || \`Guest \${g.id}\`))}
        </div>

        {/* Footer in Column 1 */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 flex flex-col gap-4 shrink-0">
          <div className="flex gap-2">
            <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 font-bold text-sm">
              <Percent size={16} /> Discount
            </button>
            <button className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2 font-bold text-sm">
              <SplitSquareHorizontal size={16} /> Split
            </button>
          </div>
          
          <div className="flex justify-between items-end text-slate-400 px-1">
             <div>
               <p className="text-xs font-bold uppercase tracking-wider mb-1">Subtotal</p>
               <p className="font-mono font-medium">\${subtotal.toFixed(2)}</p>
             </div>
             <div>
               <p className="text-xs font-bold uppercase tracking-wider mb-1">Tax</p>
               <p className="font-mono font-medium">\${tax.toFixed(2)}</p>
             </div>
             <div className="text-white text-right">
               <p className="text-xs font-bold uppercase tracking-wider mb-1 text-slate-400">Total</p>
               <p className="font-mono font-black text-xl leading-none">\${total.toFixed(2)}</p>
             </div>
          </div>

          <div className="flex gap-2">
            <button onClick={onFire} className="flex-1 py-3 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-orange-900/20 transition-all active:scale-95 text-sm">
              <Flame size={18} /> Send
            </button>
            <button onClick={onOpenPayment} className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20 transition-all active:scale-95 text-sm">
              <CreditCard size={18} /> Pay
            </button>
          </div>
        </div>
      </div>

      {/* Column 2: Menu & Actions */}
      <div className="flex-1 flex flex-col bg-slate-900 relative">
        <div className="p-3 md:p-6 border-b border-slate-800 flex flex-col gap-3 md:gap-4 sticky top-0 z-10 bg-slate-900/90 backdrop-blur-md shrink-0">
          <div className="flex justify-between items-center gap-4">
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full max-w-[140px] sm:max-w-xs bg-slate-950 border border-slate-800 px-3 py-2 md:px-4 md:py-3 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
            />
            <div className="flex gap-1.5 md:gap-2 shrink-0">
               <button className="p-2 md:p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-400 hover:text-white transition-colors" title="Order History"><History size={18} className="md:w-5 md:h-5" /></button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
            <button onClick={() => setActiveCategory('All')} className={\`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all \${activeCategory === 'All' ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}\`}>All</button>
            {categories.map(cat => (
              <button key={cat.name} onClick={() => setActiveCategory(cat.name)} className={\`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all \${activeCategory === cat.name ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'}\`}>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-3 md:p-6 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 auto-rows-max">
            {filteredMenu.map(item => (
              <button
                key={item.id}
                onClick={() => onAddToOrder(item)}
                className="bg-slate-800 hover:bg-slate-700 p-3 md:p-5 rounded-2xl border border-slate-700 flex flex-col justify-between text-left h-28 md:h-36 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/50 active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="font-bold text-slate-200 text-sm leading-tight line-clamp-3">{item.name}</span>
                <span className="font-mono text-emerald-400 font-black tracking-tight">\${item.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {itemToMove && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-800">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-in">
            <h3 className="font-black text-xl mb-1">Move Item</h3>
            <p className="text-sm font-medium text-slate-500 mb-6">Select a destination guest or seat</p>
            
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              <button 
                onClick={() => {
                  onUpdateOrderItems(orderItems.map(i => i.cartId === itemToMove ? {...i, seatNumber: 0} : i));
                  setItemToMove(null);
                }}
                className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center"><Share2 size={16} /></div>
                  <span className="font-bold text-slate-700">Shared / Table</span>
                </div>
              </button>
              
              {guests.map((g) => (
                <button 
                  key={g.id}
                  onClick={() => {
                    onUpdateOrderItems(orderItems.map(i => i.cartId === itemToMove ? {...i, seatNumber: g.id} : i));
                    setItemToMove(null);
                  }}
                  className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">{g.id}</div>
                    <span className="font-bold text-slate-700">{g.name || \`Guest \${g.id}\`}</span>
                  </div>
                </button>
              ))}
            </div>
            
            <button onClick={() => setItemToMove(null)} className="w-full mt-6 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
`;

fs.writeFileSync('components/dining/TableServiceOrderPanel.tsx', code);
console.log('Order panel patched with footer in column 1');
