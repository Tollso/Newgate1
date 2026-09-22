
import React from 'react';
import { CartItem, DiscountCode, GlobalTaxConfig, getEffectiveTaxRate } from '../../../types';
import { ShoppingCart, Minus, Plus, CreditCard, X, Tag, Edit3, Trash2, SplitSquareHorizontal, ChefHat, User, Clock, AlertTriangle } from 'lucide-react';

interface OrderSidebarProps {
    cart: CartItem[];
    onUpdateQty: (id: string, delta: number) => void;
    onRemoveItem: (id: string) => void;
    onEditItem: (item: CartItem) => void;
    onCheckout: () => void;
    onSplit: () => void;
    onDiscount: () => void;
    onFire: () => void;
    subtotal: number;
    tax: number;
    total: number;
    orderType: string;
    activeCustomer?: string | null;
    activeDiscount?: DiscountCode | null;
    taxConfig?: GlobalTaxConfig;
    currentOrderId?: string | null;
}

const OrderSidebar: React.FC<OrderSidebarProps> = ({ 
    cart = [], onUpdateQty, onRemoveItem, onEditItem, onCheckout, onSplit, onDiscount, onFire,
    subtotal, tax, total, orderType, activeCustomer, activeDiscount, taxConfig, currentOrderId
}) => {
    return (
        <div className="w-[400px] border-l border-slate-200 bg-white flex flex-col shadow-2xl z-10 h-full">
            {/* Header Status Bar */}
            <div className="bg-slate-50 p-4 border-b border-slate-200 flex justify-between items-center text-xs font-bold text-slate-500">
                <div className="flex items-center gap-2">
                    <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded border border-indigo-200">{orderType}</span>
                    {activeCustomer && <span className="flex items-center gap-1 text-slate-700"><User size={12}/> {activeCustomer}</span>}
                </div>
                <span>{currentOrderId ? `Order #${currentOrderId}` : 'New Order'}</span>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-white">
                {(cart || []).length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-6 opacity-60">
                        <div className="h-24 w-24 rounded-[2.5rem] bg-slate-50 shadow-inner flex items-center justify-center">
                            <ShoppingCart size={40} strokeWidth={1.5} />
                        </div>
                        <div className="text-center">
                            <p className="font-black uppercase tracking-widest text-xs">Register Idle</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-1">Add items to start a check</p>
                        </div>
                    </div>
                ) : (
                    cart.map(item => (
                        <div 
                            key={item.cartId || item.id} 
                            onClick={() => onEditItem(item)}
                            className={`relative bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:border-indigo-300 transition-all cursor-pointer group ${item.isVoided ? 'opacity-50 grayscale bg-slate-50' : ''}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-bold text-sm ${item.isVoided ? 'line-through text-slate-500' : 'text-slate-800'}`}>{item.name}</span>
                                        {item.isVoided && <span className="text-[10px] font-bold text-red-600 uppercase bg-red-50 px-1 rounded">VOID</span>}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-medium mt-0.5 space-y-0.5">
                                        {item.modifiers?.map((mod, idx) => <div key={idx}>+ {mod}</div>)}
                                        {item.specialRequest && <div className="text-orange-600 italic flex items-center gap-1"><AlertTriangle size={8} /> "{item.specialRequest}"</div>}
                                        {item.course && <div className="text-indigo-600 font-bold uppercase tracking-wider flex items-center gap-1"><Clock size={8} /> {item.course}</div>}
                                        {item.discount && (
                                            <div className="text-emerald-600 flex items-center gap-1 font-bold">
                                                <Tag size={8} /> {item.discount.name} 
                                                {item.discount.type === 'Percentage' 
                                                    ? ` (${item.discount.value}% Off)` 
                                                    : ` (-$${item.discount.value.toFixed(2)})`
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-mono font-bold text-sm">
                                        ${(item.price * item.quantity).toFixed(2)}
                                        {item.discount && (
                                            <span className="block text-[10px] text-emerald-600 font-normal line-through opacity-70">
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        )}
                                    </div>
                                    {item.seatId && item.seatId > 0 && (
                                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-1">
                                            Seat {item.seatId}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            {/* Hover Actions */}
                            {!item.isVoided && (
                                <div className="absolute right-2 bottom-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-1 rounded-lg shadow-sm border border-slate-100">
                                    <button onClick={(e) => { e.stopPropagation(); onUpdateQty(item.cartId || item.id, -1); }} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Minus size={14}/></button>
                                    <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                                    <button onClick={(e) => { e.stopPropagation(); onUpdateQty(item.cartId || item.id, 1); }} className="p-1 hover:bg-slate-100 rounded text-slate-500"><Plus size={14}/></button>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Financial Summary */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 space-y-2">
                <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                {activeDiscount && (
                    <div className="flex justify-between text-xs font-bold text-emerald-600">
                        <span className="flex items-center gap-1">
                            <Tag size={12}/> {activeDiscount.name} 
                            <span className="font-normal opacity-80">
                                ({activeDiscount.type === 'Percentage' ? `${activeDiscount.value}%` : `$${activeDiscount.value.toFixed(2)}`})
                            </span>
                        </span>
                        <span className="font-mono">
                            -${activeDiscount.type === 'Percentage' 
                                ? (subtotal * (activeDiscount.value/100)).toFixed(2) 
                                : Math.min(subtotal, activeDiscount.value).toFixed(2)
                            }
                        </span>
                    </div>
                )}
                <div className="flex justify-between text-xs font-medium text-slate-500">
                    <span>
                        Tax {taxConfig?.enabled ? ` (${getEffectiveTaxRate(taxConfig).toFixed(2)}%)` : ' (0%)'}
                    </span>
                    <span className="font-mono text-slate-800">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-slate-200 my-2" />
                <div className="flex justify-between items-end">
                    <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Due</span>
                    <span className="text-3xl font-black text-slate-900 tracking-tighter">${total.toFixed(2)}</span>
                </div>
            </div>

            {/* Action Grid */}
            <div className="p-4 grid grid-cols-4 gap-2 bg-white border-t border-slate-200 h-24 shrink-0">
                <button onClick={onDiscount} className="flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors border border-slate-200">
                    <Tag size={20} className="mb-1" />
                    <span className="text-[9px] font-bold uppercase">Discount</span>
                </button>
                <button onClick={onSplit} className="flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors border border-slate-200">
                    <SplitSquareHorizontal size={20} className="mb-1" />
                    <span className="text-[9px] font-bold uppercase">Split</span>
                </button>
                <button onClick={onFire} className="flex flex-col items-center justify-center bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-600 transition-colors border border-orange-200">
                    <ChefHat size={20} className="mb-1" />
                    <span className="text-[9px] font-bold uppercase">Fire</span>
                </button>
                <button 
                    onClick={onCheckout}
                    disabled={(cart || []).length === 0}
                    className="col-span-1 flex flex-col items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md transition-all active:scale-95 disabled:opacity-50 disabled:grayscale"
                >
                    <CreditCard size={20} className="mb-1" />
                    <span className="text-[9px] font-bold uppercase">Pay</span>
                </button>
            </div>
        </div>
    );
};

export default OrderSidebar;
