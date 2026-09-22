import React from 'react';
import { ArrowLeft, RefreshCw, Undo2 } from 'lucide-react';
import { KitchenTicket } from '../../../types';

interface ActiveStationHeaderProps {
  onExit?: () => void;
  onChangeStation: () => void;
  stationName: string;
  isExpo: boolean;
  activeTab: 'All' | 'Dine-in' | 'Takeout';
  setActiveTab: (tab: 'All' | 'Dine-in' | 'Takeout') => void;
  recentlyBumped: KitchenTicket | null;
  onRecall: () => void;
  activeOrdersCount: number;
}

export const ActiveStationHeader: React.FC<ActiveStationHeaderProps> = ({
  onExit,
  onChangeStation,
  stationName,
  isExpo,
  activeTab,
  setActiveTab,
  recentlyBumped,
  onRecall,
  activeOrdersCount,
}) => {
  return (
    <header className="h-16 bg-slate-950 flex items-center justify-between px-6 shrink-0 border-b border-slate-800 shadow-md">
      <div className="flex items-center gap-4">
        {onExit && (
          <button
            onClick={onExit}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition-colors"
            title="Return to POS Hub"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Hub</span>
          </button>
        )}

        <button
          onClick={onChangeStation}
          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-black flex items-center gap-1.5 shadow-sm transition-colors"
        >
          <RefreshCw size={14} />
          <span>Change Station</span>
        </button>

        <div className="h-6 w-px bg-slate-800"></div>

        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${isExpo ? 'bg-purple-500 animate-pulse' : 'bg-orange-500 animate-pulse'}`}></span>
          <span className="text-base font-black tracking-tight text-white uppercase">
            {stationName}
          </span>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
            {isExpo ? 'Expediter View' : 'Prep Line'}
          </span>
        </div>

        <div className="h-6 w-px bg-slate-800 hidden md:block"></div>

        <div className="hidden sm:flex bg-slate-800 rounded-lg p-1 border border-slate-700">
          {(['All', 'Dine-in', 'Takeout'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                activeTab === tab ? 'bg-slate-700 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {recentlyBumped && (
          <button
            onClick={onRecall}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors animate-bounce"
          >
            <Undo2 size={14} />
            <span>Recall #{recentlyBumped.orderId.split('-')[1]}</span>
          </button>
        )}

        <div className="text-right hidden md:block">
          <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Active Orders</div>
          <div className="text-sm font-mono font-black text-emerald-400">
            {activeOrdersCount} IN QUEUE
          </div>
        </div>
      </div>
    </header>
  );
};
