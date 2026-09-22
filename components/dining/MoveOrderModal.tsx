import React, { useState } from 'react';
import { DiningTable } from '../../types';
import { MoveRight, X, Check, Utensils } from 'lucide-react';

interface MoveOrderModalProps {
  currentTable: DiningTable;
  allTables: DiningTable[];
  onMoveOrder: (sourceTableId: string, targetTableId: string) => void;
  onClose: () => void;
}

export const MoveOrderModal: React.FC<MoveOrderModalProps> = ({
  currentTable,
  allTables = [],
  onMoveOrder,
  onClose
}) => {
  // Available target tables (e.g., status is Available or different table)
  const availableTables = allTables.filter(t => t.id !== currentTable.id && t.status !== 'Occupied');
  const fallbackTables = ['Table 2', 'Table 4', 'Table 5', 'Bar 1', 'Patio 1', 'Patio 2'];

  const [selectedTargetId, setSelectedTargetId] = useState<string>(
    availableTables[0]?.id || fallbackTables[0]
  );

  const handleConfirmMove = () => {
    if (!selectedTargetId) return;
    onMoveOrder(currentTable.id, selectedTargetId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/70 backdrop-blur-sm animate-fade-in text-slate-800 p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-in relative">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-violet-100 text-violet-600 flex items-center justify-center">
              <MoveRight size={22} />
            </div>
            <div>
              <h3 className="font-black text-xl text-slate-900">Move Order</h3>
              <p className="text-xs font-bold text-slate-400">From Table {currentTable.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm font-medium text-slate-500 mb-4">
          Select an available target table to transfer this entire order & guest seats:
        </p>

        <div className="space-y-2 mb-6 max-h-[220px] overflow-y-auto pr-1">
          {availableTables.length > 0 ? (
            availableTables.map(tbl => (
              <button
                key={tbl.id}
                type="button"
                onClick={() => setSelectedTargetId(tbl.id)}
                className={`w-full p-3.5 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
                  selectedTargetId === tbl.id
                    ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Utensils size={16} className="text-slate-400" />
                  <span>Table {tbl.name} ({tbl.section || 'Main'})</span>
                </div>
                {selectedTargetId === tbl.id && (
                  <span className="text-xs font-black uppercase text-violet-600 flex items-center gap-1">
                    <Check size={14} /> Selected
                  </span>
                )}
              </button>
            ))
          ) : (
            fallbackTables.map(tblName => (
              <button
                key={tblName}
                type="button"
                onClick={() => setSelectedTargetId(tblName)}
                className={`w-full p-3.5 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
                  selectedTargetId === tblName
                    ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Utensils size={16} className="text-slate-400" />
                  <span>{tblName}</span>
                </div>
                {selectedTargetId === tblName && (
                  <span className="text-xs font-black uppercase text-violet-600 flex items-center gap-1">
                    <Check size={14} /> Selected
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmMove}
            className="flex-1 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-violet-900/20 text-sm flex items-center justify-center gap-2"
          >
            <MoveRight size={18} /> Move Order
          </button>
        </div>
      </div>
    </div>
  );
};
