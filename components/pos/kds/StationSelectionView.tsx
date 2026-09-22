import React from 'react';
import { ChefHat, ArrowLeft, Plus, Layers, Flame } from 'lucide-react';
import { StationConfig } from '../../../services/kitchenRoutingService';

interface StationSelectionViewProps {
  onExit?: () => void;
  onOpenAddStationModal: () => void;
  stations: StationConfig[];
  getTicketCountForStation: (id: string) => number;
  onSelectStation: (id: string) => void;
}

export const StationSelectionView: React.FC<StationSelectionViewProps> = ({
  onExit,
  onOpenAddStationModal,
  stations,
  getTicketCountForStation,
  onSelectStation,
}) => {
  return (
    <div className="h-full min-h-[calc(100vh-5rem)] flex flex-col bg-slate-950 text-white select-none">
      {/* Top Header */}
      <header className="h-20 px-6 md:px-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0 shadow-lg">
        <div className="flex items-center space-x-4">
          {onExit && (
            <button
              onClick={onExit}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl font-bold text-sm flex items-center gap-2 border border-slate-700 transition-colors shadow-sm"
            >
              <ArrowLeft size={18} />
              <span>Back to POS Hub</span>
            </button>
          )}
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-orange-600/20 text-orange-400 rounded-xl border border-orange-500/30">
              <ChefHat size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                Kitchen Display System (KDS)
                <span className="text-xs bg-indigo-600/30 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-500/30">
                  Station Routing
                </span>
              </h1>
              <p className="text-xs text-slate-400">Select a prep station or dispatch screen to monitor orders</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenAddStationModal}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-colors"
          >
            <Plus size={16} />
            <span>Add Custom Station</span>
          </button>
        </div>
      </header>

      {/* Station Selection Grid */}
      <main className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full flex flex-col justify-center">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-white tracking-tight">Select Kitchen Station</h2>
          <p className="text-slate-400 text-sm mt-1">
            Choose the station this screen will display. Each station filters orders strictly by its production line routing.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {stations.map(st => {
            const count = getTicketCountForStation(st.id);
            const isExpo = st.id.toLowerCase() === 'expo';

            return (
              <button
                key={st.id}
                onClick={() => onSelectStation(st.id)}
                className={`p-6 rounded-2xl shadow-xl transition-all duration-200 transform hover:-translate-y-1 active:translate-y-0 text-left relative flex flex-col justify-between h-48 border group ${
                  isExpo
                    ? 'bg-gradient-to-br from-indigo-900/90 to-purple-900/90 border-indigo-500/50 hover:border-indigo-400'
                    : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <div className={`p-3 rounded-xl ${
                    isExpo ? 'bg-indigo-500/30 text-indigo-200' : 'bg-orange-500/20 text-orange-400'
                  }`}>
                    {isExpo ? <Layers size={28} /> : <Flame size={28} />}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[11px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      st.deliveryMode === 'BOTH'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    }`}>
                      {st.deliveryMode === 'BOTH' ? 'KDS & Printer' : 'KDS Only'}
                    </span>

                    {count > 0 && (
                      <span className="bg-rose-600 text-white text-xs font-black px-2.5 py-1 rounded-full animate-pulse shadow-md">
                        {count}
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-black tracking-tight text-white group-hover:text-indigo-200 transition-colors">
                    {st.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {isExpo
                      ? 'Master expediter • Multi-station readiness aggregation'
                      : `${st.name} production line orders & modifiers`}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </main>
    </div>
  );
};
