
import React, { useState } from 'react';
import { InventoryItem } from '../../types';
import { Search, Box, ArrowRight, Barcode, RefreshCw, CheckCircle, AlertTriangle } from 'lucide-react';

interface InventoryScannerProps {
    items: InventoryItem[];
    onUpdateItem?: (item: InventoryItem) => void;
}

const InventoryScanner: React.FC<InventoryScannerProps> = ({ items, onUpdateItem }) => {
    const [scannedItem, setScannedItem] = useState<InventoryItem | null>(null);
    const [adjustValue, setAdjustValue] = useState('');
    const [log, setLog] = useState<{msg: string, time: string}[]>([]);

    const handleScan = (item: InventoryItem) => {
        setScannedItem(item);
    };

    const commitAdjustment = () => {
        if (!scannedItem || !adjustValue) return;
        const newCount = parseInt(adjustValue, 10);
        if (isNaN(newCount)) return;

        const newLog = { 
            msg: `Adjusted ${scannedItem.name} stock level to ${newCount} units.`, 
            time: new Date().toLocaleTimeString() 
        };
        setLog([newLog, ...log]);
        
        const updatedItem = {
            ...scannedItem,
            quantity: newCount,
            inStock: newCount > 0
        };

        if (onUpdateItem) {
            onUpdateItem(updatedItem);
        }

        setScannedItem(updatedItem);
        setAdjustValue('');
    };

    return (
        <div className="h-full flex flex-col bg-slate-900 text-white animate-fade-in">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950">
                <h2 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2">
                    <Barcode className="text-indigo-400" /> Stock Control Node
                </h2>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase">
                    Scanner Online
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Left: Item Selector */}
                <div className="w-1/3 border-r border-slate-800 flex flex-col">
                    <div className="p-4 bg-slate-800/50">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search or Scan SKU..." 
                                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {items.map(item => (
                            <button 
                                key={item.id} 
                                onClick={() => handleScan(item)}
                                className={`w-full text-left p-4 rounded-xl transition-all ${scannedItem?.id === item.id ? 'bg-indigo-600 shadow-lg' : 'hover:bg-slate-800'}`}
                            >
                                <p className="font-bold text-sm leading-tight">{item.name}</p>
                                <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">{item.sku || item.id}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Workspace */}
                <div className="flex-1 p-8 overflow-y-auto space-y-8">
                    {scannedItem ? (
                        <div className="max-w-md mx-auto space-y-6 animate-scale-in">
                            <div className="p-8 bg-slate-800 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden">
                                <div className="relative z-10">
                                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2 block">Item Identified</span>
                                    <h3 className="text-3xl font-black tracking-tight mb-4">{scannedItem.name}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-700">
                                            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Current Stock</p>
                                            <p className="text-xl font-black">{scannedItem.quantity !== undefined ? `${scannedItem.quantity} units` : (scannedItem.inStock ? 'Available' : 'Out of Stock')}</p>
                                        </div>
                                        <div className="bg-slate-900/50 p-3 rounded-2xl border border-slate-700">
                                            <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Price/Unit</p>
                                            <p className="text-xl font-black">${scannedItem.price.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <Box size={120} className="absolute -bottom-10 -right-10 text-slate-700/20 rotate-12" />
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest">Adjust Quantity</label>
                                <div className="flex gap-3">
                                    <input 
                                        type="number" 
                                        value={adjustValue}
                                        onChange={e => setAdjustValue(e.target.value)}
                                        placeholder="New Count"
                                        className="flex-1 bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-xl font-black focus:ring-4 focus:ring-indigo-500/20 outline-none"
                                    />
                                    <button 
                                        onClick={commitAdjustment}
                                        className="bg-indigo-600 px-8 rounded-2xl hover:bg-indigo-700 transition-all active:scale-95 shadow-xl shadow-indigo-900/20"
                                    >
                                        <CheckCircle size={24} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
                            <div className="w-24 h-24 rounded-full border-4 border-dashed border-slate-700 flex items-center justify-center">
                                <Barcode size={48} />
                            </div>
                            <div>
                                <p className="font-black uppercase tracking-[0.3em] text-sm">Awaiting Input</p>
                                <p className="text-xs font-medium mt-2">Scan an item or select from the list to begin audit.</p>
                            </div>
                        </div>
                    )}

                    {/* Audit Log */}
                    {log.length > 0 && (
                        <div className="border-t border-slate-800 pt-8 mt-8">
                            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Audit Trace</h4>
                            <div className="space-y-2">
                                {log.map((entry, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-slate-800/30 rounded-xl border border-slate-800/50">
                                        <span className="text-xs font-medium text-slate-300">{entry.msg}</span>
                                        <span className="text-[10px] font-mono text-slate-500">{entry.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryScanner;
