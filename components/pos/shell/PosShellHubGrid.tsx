import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { AppTileConfig } from './PosShellTileConfigs';
import { PosInternalRoute } from './PosShellTypes';

interface PosShellHubGridProps {
  hubPage: 0 | 1;
  setHubPage: React.Dispatch<React.SetStateAction<0 | 1>>;
  appTiles: AppTileConfig[];
  onSelectRoute: (route: PosInternalRoute) => void;
  deviceId?: string;
}

export const PosShellHubGrid: React.FC<PosShellHubGridProps> = ({
  hubPage,
  setHubPage,
  appTiles,
  onSelectRoute,
  deviceId,
}) => {
  const currentTiles = appTiles.filter(app => app.page === hubPage);

  return (
    <main className="flex-1 flex flex-col justify-between overflow-y-auto">
      {/* App Hub Subheader with Page Switcher */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black text-white tracking-tight">App Hub</h2>
            <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs font-bold rounded-lg border border-slate-700 font-mono">
              Page {hubPage + 1} of 2
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {hubPage === 0 ? 'Shift-Critical POS Applications & Registers' : 'Management, Secondary Tools & Diagnostics'}
          </p>
        </div>

        {/* Paging Buttons & Dots */}
        <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setHubPage(0)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              hubPage === 0 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <ChevronLeft size={16} />
            <span>Page 1</span>
          </button>

          <div className="flex items-center gap-1.5 px-2">
            <button
              onClick={() => setHubPage(0)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                hubPage === 0 ? 'bg-indigo-400 scale-125' : 'bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label="Go to page 1"
            />
            <button
              onClick={() => setHubPage(1)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                hubPage === 1 ? 'bg-indigo-400 scale-125' : 'bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label="Go to page 2"
            />
          </div>

          <button
            onClick={() => setHubPage(1)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              hubPage === 1 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Page 2</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 4-Column Responsive Touch Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 flex-1 content-start">
        {currentTiles.map((app) => (
          <button
            key={app.id}
            onClick={() => onSelectRoute(app.id)}
            className={`p-5 rounded-2xl shadow-xl transition-all duration-150 transform hover:-translate-y-1 active:translate-y-0 text-left relative flex flex-col justify-between h-40 ${app.color} group border border-white/10`}
          >
            {app.badge && (
              <span className="absolute top-3.5 right-3.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                {app.badge}
              </span>
            )}
            <div className="p-2.5 bg-white/10 w-fit rounded-xl backdrop-blur-sm group-hover:scale-105 transition-transform">
              {app.icon}
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">{app.label}</h3>
              <p className="text-xs text-white/80 line-clamp-1 mt-0.5">{app.sub}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Bottom Quick Tips Bar */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <span>Terminal: {deviceId || 'Hardware Terminal Ready'} • Offline Cache Ready</span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHubPage(p => (p === 0 ? 1 : 0))}
            className="text-indigo-400 hover:text-indigo-300 font-bold"
          >
            Switch to {hubPage === 0 ? 'Secondary Tools (Page 2)' : 'Shift-Critical Apps (Page 1)'} →
          </button>
        </div>
      </div>
    </main>
  );
};
