import React from 'react';

interface AddStationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customStationName: string;
  setCustomStationName: (val: string) => void;
  customDeliveryMode: 'KDS_ONLY' | 'PRINTER_ONLY' | 'BOTH';
  setCustomDeliveryMode: (val: 'KDS_ONLY' | 'PRINTER_ONLY' | 'BOTH') => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AddStationModal: React.FC<AddStationModalProps> = ({
  isOpen,
  onClose,
  customStationName,
  setCustomStationName,
  customDeliveryMode,
  setCustomDeliveryMode,
  onSubmit,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-2">Add Custom Kitchen Station</h3>
        <p className="text-xs text-slate-400 mb-6">
          Create a new kitchen production line (e.g. Pizza Station, Sushi Bar, Pantry). Products can route here automatically.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Station Name</label>
            <input
              type="text"
              required
              value={customStationName}
              onChange={e => setCustomStationName(e.target.value)}
              placeholder="e.g. Pizza Station"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase mb-1">Delivery Policy</label>
            <select
              value={customDeliveryMode}
              onChange={e => setCustomDeliveryMode(e.target.value as any)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="KDS_ONLY">KDS Screen Only</option>
              <option value="BOTH">KDS Screen + Station Printer</option>
              <option value="PRINTER_ONLY">Station Printer Only</option>
            </select>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold shadow-lg"
            >
              Save Station
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
