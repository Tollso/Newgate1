
import React, { useState } from 'react';
import { KitchenTicket } from '../../types';
import { LayoutGrid, Clock, List, Package, CheckCircle, Search } from 'lucide-react';

interface ExpeditorScreenProps {
    tickets?: KitchenTicket[];
    onUpdateStatus?: (id: string, status: KitchenTicket['status']) => void;
}

const ExpeditorScreen: React.FC<ExpeditorScreenProps> = ({ tickets = [], onUpdateStatus }) => {
    const [view, setView] = useState<'Grid' | 'List'>('Grid');
    const [searchTerm, setSearchTerm] = useState('');

    // Filter out delivered items usually, but keep them if needed for history. 
    // For Expo, we usually care about what is currently active.
    const activeTickets = tickets.filter(t => t.status !== 'Delivered' && 
        (t.orderId.toLowerCase().includes(searchTerm.toLowerCase()) || 
         t.table?.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleBump = (ticket: KitchenTicket) => {
        if (ticket.status === 'Ready' && onUpdateStatus) {
            onUpdateStatus(ticket.id, 'Delivered');
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 animate-fade-in">
            <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-6">
                    <h2 className="text-xl font-black tracking-tighter uppercase flex items-center gap-2 text-slate-800">
                        <LayoutGrid size={20} className="text-indigo-600" /> Expo Station
                    </h2>
                    <div className="flex bg-slate-100 p-1 rounded-lg">
                        <button onClick={() => setView('Grid')} className={`p-1.5 rounded ${view === 'Grid' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><LayoutGrid size={18}/></button>
                        <button onClick={() => setView('List')} className={`p-1.5 rounded ${view === 'List' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400'}`}><List size={18}/></button>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input 
                            type="text" 
                            placeholder="Order ID / Table..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-slate-50 border-slate-200 rounded-lg pl-9 pr-3 py-1.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500" 
                        />
                    </div>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest">{activeTickets.length} ACTIVE</span>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-6">
                <div className={view === 'Grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4 max-w-5xl mx-auto'}>
                    {activeTickets.map(ticket => (
                        <div key={ticket.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col hover:shadow-xl transition-shadow group">
                            <div className={`p-4 flex justify-between items-start ${ticket.status === 'Ready' ? 'bg-emerald-50' : 'bg-slate-50'}`}>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        #{ticket.orderId.split('-')[1] || ticket.orderId}
                                    </p>
                                    <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                        {ticket.table || 'Takeout'}
                                        {ticket.type === 'Takeout' && <Package size={14} className="text-blue-500" />}
                                    </h3>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className={`px-2 py-1 rounded text-[10px] font-black uppercase tracking-widest ${
                                        ticket.status === 'Ready' ? 'bg-emerald-100 text-emerald-700' : 
                                        ticket.status === 'Prep' ? 'bg-orange-100 text-orange-700' :
                                        'bg-slate-100 text-slate-600'
                                    }`}>
                                        {ticket.status}
                                    </span>
                                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-2">
                                        <Clock size={10} /> {new Date(ticket.timeIn).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 flex-1 space-y-3">
                                {ticket.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-start">
                                        <div className="flex gap-3">
                                            <span className="font-black text-indigo-600">{item.qty}</span>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 leading-none">{item.name}</p>
                                                {item.modifiers && item.modifiers.length > 0 && <p className="text-[10px] text-slate-400 mt-1 uppercase font-medium">{item.modifiers.join(', ')}</p>}
                                            </div>
                                        </div>
                                        {ticket.status === 'Ready' && <CheckCircle size={14} className="text-emerald-500" />}
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-slate-50">
                                <button 
                                    onClick={() => handleBump(ticket)}
                                    disabled={ticket.status !== 'Ready'}
                                    className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                                        ticket.status === 'Ready' 
                                            ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-100 hover:bg-emerald-700 active:scale-95' 
                                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    }`}
                                >
                                    {ticket.status === 'Ready' ? 'BUMP TO RUNNER' : 'WAITING FOR KITCHEN'}
                                </button>
                            </div>
                        </div>
                    ))}
                    {activeTickets.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 text-slate-400 opacity-50">
                            <CheckCircle size={48} className="mb-4" />
                            <p className="text-sm font-bold uppercase tracking-widest">All Orders Cleared</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpeditorScreen;
