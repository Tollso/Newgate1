import React from 'react';
import { Trash2 } from 'lucide-react';

interface RemovalReasonsSubProps {
  renderSectionHeader: (title: string, description: string, parentSection?: string) => React.ReactNode;
  localRemovalReasons: string[];
  newReason: string;
  setNewReason: (val: string) => void;
  handleAddReason: () => void;
  handleDeleteReason: (reason: string) => void;
}

export const RemovalReasonsSub: React.FC<RemovalReasonsSubProps> = ({
  renderSectionHeader,
  localRemovalReasons,
  newReason,
  setNewReason,
  handleAddReason,
  handleDeleteReason
}) => {
  return (
    <div className="max-w-4xl animate-fade-in pb-20 space-y-8">
      {renderSectionHeader("Removal & Void Reasons", "Configure reasons displayed to cashiers when deleting or voiding items.", "Business operations")}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 space-y-6">
        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Add New Reason</label>
          <div className="flex gap-4">
            <input
              type="text"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              placeholder="e.g. Returned / Cold food, Quality Issue"
              className="flex-1 border border-slate-300 rounded-xl px-4 py-3 text-sm font-bold bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            <button
              onClick={handleAddReason}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-colors shadow-lg shadow-indigo-100"
            >
              Add Reason
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">Active Removal Reasons</label>
          <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-slate-50/50">
            {(localRemovalReasons || []).length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-sm font-medium">
                No removal reasons defined. Add one above!
              </div>
            ) : (
              localRemovalReasons.map((reason, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 bg-white hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-bold text-slate-700">{reason}</span>
                  <button
                    onClick={() => handleDeleteReason(reason)}
                    className="p-2 text-rose-500 hover:bg-rose-50 hover:text-red-700 rounded-lg transition-colors"
                    title="Delete Reason"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
