import React, { useState, useEffect } from 'react';
import { Reservation, Table, DiningTable, KitchenTicket, WaitlistEntry } from '../../types';
import { Clock, Users, Calendar, MapPin, ArrowRight, Map as MapIcon, List as ListIcon, ZoomIn, ZoomOut, MessageSquare, Plus, CheckCircle, XCircle } from 'lucide-react';
import { ReservationService } from '../../services/reservationService';
import InteractiveTable from '../dining/InteractiveTable';
import { ReservationTableModal } from './ReservationTableModal';

interface ReservationsAppProps {
  reservations: Reservation[];
  onSeatReservation: (reservationId: string, tableId: string) => void;
  tables: Table[]; 
  floorPlanTables?: DiningTable[];
  isConnectedToPos: boolean;
  onUpdateReservation?: (res: Reservation) => void;
  kitchenTickets?: KitchenTicket[];
  waitlist?: WaitlistEntry[];
  setWaitlist?: (waitlist: WaitlistEntry[]) => void;
}

const ReservationsApp: React.FC<ReservationsAppProps> = ({ 
  reservations: initialReservations, 
  onSeatReservation, 
  floorPlanTables = [],
  isConnectedToPos,
  onUpdateReservation,
  kitchenTickets = [],
  waitlist = [],
  setWaitlist
}) => {
  const [viewMode, setViewMode] = useState<'LIST' | 'MAP' | 'WAITLIST'>('LIST');
  const [activeSection, setActiveSection] = useState('Dining Room');
  const [scale, setScale] = useState(0.8);
  const [pan, setPan] = useState({ x: 50, y: 50 });

  const floorSections = Array.from(new Set(floorPlanTables.map(t => t.section))).filter(Boolean) as string[];

  const [localReservations, setLocalReservations] = useState<Reservation[]>(initialReservations);
  const reservations = onUpdateReservation ? initialReservations : localReservations;

  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [showTableSelector, setShowTableSelector] = useState(false);
  const [aiSuggesting, setAiSuggesting] = useState<string | null>(null);
  const [suggestedTableId, setSuggestedTableId] = useState<string | null>(null);

  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const [newWaitlist, setNewWaitlist] = useState({ name: '', phone: '', size: 2, quote: 15 });
  
  // Local state fallback if setWaitlist isn't provided
  const [localWaitlist, setLocalWaitlist] = useState<WaitlistEntry[]>([
    { id: 'wl-1', customerName: 'Alice Smith', customerPhone: '555-0101', partySize: 2, quotedTimeMins: 15, timeAdded: new Date(Date.now() - 10 * 60000).toISOString(), status: 'Waiting' },
    { id: 'wl-2', customerName: 'Bob Johnson', customerPhone: '555-0102', partySize: 4, quotedTimeMins: 30, timeAdded: new Date(Date.now() - 5 * 60000).toISOString(), status: 'Waiting' }
  ]);
  const activeWaitlist = setWaitlist && waitlist.length > 0 ? waitlist : localWaitlist;
  
  const handleUpdateWaitlist = (newList: WaitlistEntry[]) => {
    if (setWaitlist) {
      setWaitlist(newList);
    } else {
      setLocalWaitlist(newList);
    }
  };

  useEffect(() => {
    ReservationService.setInitialData(initialReservations);
  }, [initialReservations]);

  const handleSeatClick = (res: Reservation) => {
    setSelectedRes(res);
    setSuggestedTableId(null);
    setShowTableSelector(true);
  };

  const handleAiSuggest = async () => {
    if (!selectedRes) return;
    setAiSuggesting(selectedRes.id);
    const suggestion = await ReservationService.suggestTable(selectedRes, floorPlanTables);
    setSuggestedTableId(suggestion);
    setAiSuggesting(null);
  };

  const confirmSeating = async (tableId: string) => {
    if (selectedRes) {
      const success = await ReservationService.seatReservation(selectedRes.id, tableId);
      if (success) {
        onSeatReservation(selectedRes.id, tableId);
        if (onUpdateReservation) {
          onUpdateReservation({ ...selectedRes, status: 'Seated', tableId });
        } else {
          setLocalReservations(localReservations.map(r => r.id === selectedRes.id ? { ...r, status: 'Seated' as const, tableId } : r));
        }
        setShowTableSelector(false);
        setSelectedRes(null);
      }
    }
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-fade-in overflow-hidden">
      <div className="bg-white border-b border-slate-200 p-4 flex flex-wrap justify-between items-center gap-4 shadow-sm z-30">
        <div className="flex items-center gap-6">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar className="text-indigo-600" /> Guest Manager
          </h2>
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('LIST')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'LIST' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <ListIcon size={14} /> Reservations
            </button>
            <button 
              onClick={() => setViewMode('WAITLIST')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'WAITLIST' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <Users size={14} /> Waitlist
            </button>
            <button 
              onClick={() => setViewMode('MAP')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${viewMode === 'MAP' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <MapIcon size={14} /> Floor Plan
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {viewMode === 'MAP' && (
            <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
              {floorSections.map(sec => (
                <button 
                  key={sec} 
                  onClick={() => setActiveSection(sec)} 
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all ${activeSection === sec ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                >
                  {sec}
                </button>
              ))}
            </div>
          )}
          <div className="h-8 w-[1px] bg-slate-200 mx-2" />
          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${isConnectedToPos ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{isConnectedToPos ? 'Synced' : 'Offline'}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 relative overflow-hidden">
        {viewMode === 'WAITLIST' ? (
          <div className="absolute inset-0 p-6 overflow-y-auto bg-slate-50">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-black text-xl text-slate-900">Current Waitlist</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">Manage walk-ins and seating queue</p>
              </div>
              <button 
                onClick={() => setShowWaitlistModal(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-indigo-700"
              >
                + Add to Waitlist
              </button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
              {activeWaitlist.length === 0 ? (
                <div className="p-12 text-center">
                  <Users className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-bold text-slate-900 mb-2">Waitlist is empty</h3>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto">
                    There are currently no parties on the waitlist. Click "Add to Waitlist" to manage walk-in guests.
                  </p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Party</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Size</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Quoted Time</th>
                      <th className="py-3 px-6 text-xs font-bold text-slate-500 uppercase">Status</th>
                      <th className="py-3 px-6 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {activeWaitlist.map((entry) => {
                      const minsWaited = Math.floor((Date.now() - new Date(entry.timeAdded).getTime()) / 60000);
                      const isOverdue = minsWaited > entry.quotedTimeMins && entry.status === 'Waiting';
                      return (
                        <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-slate-900">{entry.customerName}</div>
                            {entry.customerPhone && <div className="text-xs text-slate-500 mt-0.5">{entry.customerPhone}</div>}
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                              <Users size={14} className="text-slate-400" /> {entry.partySize}
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="text-sm font-bold text-slate-700">{entry.quotedTimeMins} mins</div>
                            <div className={`text-xs mt-0.5 ${isOverdue ? 'text-red-500 font-bold' : 'text-slate-500'}`}>
                              Waited: {minsWaited} mins
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              entry.status === 'Waiting' ? (isOverdue ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700') :
                              entry.status === 'Ready' ? 'bg-indigo-100 text-indigo-700' :
                              entry.status === 'Seated' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-slate-100 text-slate-600'
                            }`}>
                              {entry.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            {entry.status === 'Waiting' && (
                              <button 
                                onClick={() => {
                                  alert(`SMS Sent: "Hi ${entry.customerName}, your table for ${entry.partySize} is ready! Please see the host."`);
                                  setWaitlist(activeWaitlist.map(w => w.id === entry.id ? { ...w, status: 'Ready' } : w));
                                }}
                                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 mr-2"
                              >
                                <MessageSquare size={14} /> Notify
                              </button>
                            )}
                            {(entry.status === 'Waiting' || entry.status === 'Ready') && (
                              <button 
                                onClick={() => setWaitlist(activeWaitlist.map(w => w.id === entry.id ? { ...w, status: 'Seated' } : w))}
                                className="px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                              >
                                <CheckCircle size={14} /> Seat
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : viewMode === 'LIST' ? (
          <div className="absolute inset-0 p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reservations.map(res => (
                <div key={res.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all group border-b-4 border-b-transparent hover:border-b-indigo-500">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-black text-xl text-slate-900 tracking-tight">{res.customerName}</h3>
                      <div className="flex items-center gap-3 text-slate-500 text-sm mt-2 font-medium">
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg"><Clock size={14} /> {res.time}</span>
                        <span className="flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-lg"><Users size={14} /> {res.partySize} guests</span>
                      </div>
                    </div>
                    <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 ${
                      res.status === 'Seated' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      res.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-100' : 'bg-indigo-50 text-indigo-700 border-indigo-100'
                    }`}>
                      {res.status}
                    </span>
                  </div>
                  
                  {res.notes && (
                    <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-600 mb-6 font-medium italic border border-slate-100">
                      "{res.notes}"
                    </div>
                  )}

                  {res.status === 'Booked' && (
                    <button 
                      onClick={() => handleSeatClick(res)}
                      className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 group-hover:-translate-y-1"
                    >
                      Seat Party Now <ArrowRight size={16} />
                    </button>
                  )}
                  {res.status === 'Seated' && res.tableId && (
                    <div className="flex items-center justify-center gap-2 py-3 bg-slate-50 rounded-xl text-slate-700 text-xs font-black uppercase tracking-wider border border-slate-200">
                      <MapPin size={14} className="text-indigo-500" /> Table {floorPlanTables.find(t => t.id === res.tableId)?.name || res.tableId}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-slate-200/50">
            <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
              <div 
                style={{ 
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})`, 
                  transformOrigin: '0 0',
                  transition: 'transform 0.1s ease-out'
                }}
                className="absolute top-0 left-0"
              >
                {floorPlanTables.filter(t => t.section === activeSection).map(table => {
                  const tableTicket = kitchenTickets.find(ticket => ticket.table === `Table ${table.name}` && ticket.status !== 'Delivered');
                  const kStatus = tableTicket ? { status: tableTicket.status, ticketId: tableTicket.id } : null;

                  return (
                    <InteractiveTable
                      key={table.id}
                      table={table}
                      onClick={() => {}}
                      kitchenStatus={kStatus}
                    />
                  );
                })}
              </div>

              <div className="absolute bottom-6 right-6 flex items-center gap-2 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-xl border border-slate-200 z-10">
                <button onClick={() => setScale(s => Math.min(2, s + 0.1))} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600"><ZoomIn size={18} /></button>
                <button onClick={() => setScale(s => Math.max(0.4, s - 0.1))} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600"><ZoomOut size={18} /></button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ReservationTableModal
        showTableSelector={showTableSelector}
        setShowTableSelector={setShowTableSelector}
        selectedRes={selectedRes}
        aiSuggesting={aiSuggesting}
        suggestedTableId={suggestedTableId}
        floorPlanTables={floorPlanTables}
        handleAiSuggest={handleAiSuggest}
        confirmSeating={confirmSeating}
      />

      {showWaitlistModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-in">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-900">Add to Waitlist</h3>
              <button onClick={() => setShowWaitlistModal(false)} className="text-slate-400 hover:text-slate-600 transition-colors bg-white rounded-full p-1 shadow-sm border border-slate-200"><XCircle size={20} /></button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Guest Name</label>
                <input 
                  type="text" 
                  value={newWaitlist.name}
                  onChange={e => setNewWaitlist({...newWaitlist, name: e.target.value})}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                  placeholder="e.g. John Doe"
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Phone Number</label>
                  <input 
                    type="tel" 
                    value={newWaitlist.phone}
                    onChange={e => setNewWaitlist({...newWaitlist, phone: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                    placeholder="(555) 000-0000"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Party Size</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => setNewWaitlist(w => ({...w, size: Math.max(1, w.size - 1)}))} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600">-</button>
                    <div className="flex-1 text-center font-bold text-lg">{newWaitlist.size}</div>
                    <button onClick={() => setNewWaitlist(w => ({...w, size: w.size + 1}))} className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600">+</button>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Quoted Wait Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 15, 20, 30, 45, 60].map(time => (
                    <button 
                      key={time}
                      onClick={() => setNewWaitlist({...newWaitlist, quote: time})}
                      className={`py-2 rounded-lg text-sm font-bold border transition-colors ${newWaitlist.quote === time ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                    >
                      {time}m
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
              <button 
                onClick={() => setShowWaitlistModal(false)}
                className="px-5 py-2.5 rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (!newWaitlist.name) return alert('Please enter a name');
                  handleUpdateWaitlist([...activeWaitlist, {
                    id: `wl-${Date.now()}`,
                    customerName: newWaitlist.name,
                    customerPhone: newWaitlist.phone,
                    partySize: newWaitlist.size,
                    quotedTimeMins: newWaitlist.quote,
                    timeAdded: new Date().toISOString(),
                    status: 'Waiting'
                  }]);
                  setNewWaitlist({ name: '', phone: '', size: 2, quote: 15 });
                  setShowWaitlistModal(false);
                }}
                className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors shadow-sm"
              >
                Add to Waitlist
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReservationsApp;
