import React, { useState } from 'react';
import { Merge, UserCheck, Trash2, AlertTriangle } from 'lucide-react';

interface CombineOrdersModalProps {
  currentTable: string;
  allTables?: any[];
  onCombine: (targetTable: string) => void;
  onClose: () => void;
}

export const CombineOrdersModal: React.FC<CombineOrdersModalProps> = ({
  currentTable,
  allTables = [],
  onCombine,
  onClose
}) => {
  const tableList = allTables.length > 0
    ? allTables
        .filter(t => t.name !== currentTable && t.id !== currentTable && `Table ${t.name}` !== currentTable)
        .map(t => ({ id: t.id, label: `Table ${t.name} (${t.section || 'Main'})`, status: t.status }))
    : ['Table 1', 'Table 2', 'Table 3', 'Table 5', 'Bar 1', 'Patio 2']
        .filter(t => t !== `Table ${currentTable}` && t !== currentTable)
        .map(name => ({ id: name, label: name, status: 'Available' }));

  const [selected, setSelected] = useState(tableList[0]?.id || 'Table 2');

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-800 p-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-in">
        <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mb-4">
          <Merge size={24} />
        </div>
        <h3 className="font-black text-xl mb-1 text-slate-900">Combine Orders</h3>
        <p className="text-sm font-medium text-slate-500 mb-4">
          Merge current order (Table {currentTable}) into another target table:
        </p>

        <div className="space-y-2 mb-6 max-h-[220px] overflow-y-auto pr-1">
          {tableList.map(tbl => (
            <button
              key={tbl.id}
              type="button"
              onClick={() => setSelected(tbl.id)}
              className={`w-full p-3.5 rounded-2xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
                selected === tbl.id
                  ? 'bg-pink-50 border-pink-500 text-pink-700 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{tbl.label}</span>
              {selected === tbl.id && <span className="text-xs font-black uppercase text-pink-600">Selected</span>}
            </button>
          ))}
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
            onClick={() => {
              if (selected) onCombine(selected);
              onClose();
            }}
            className="flex-1 py-3.5 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-pink-900/20 text-sm"
          >
            Combine
          </button>
        </div>
      </div>
    </div>
  );
};

interface TransferServerModalProps {
  currentTable: string;
  onTransfer: (serverName: string) => void;
  onClose: () => void;
}

export const TransferServerModal: React.FC<TransferServerModalProps> = ({
  currentTable,
  onTransfer,
  onClose
}) => {
  const mockServers = ['Sarah Jenkins', 'Alex Rivera', 'Jordan Lee', 'Taylor Smith'];
  const [selected, setSelected] = useState(mockServers[0]);

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-800">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-in">
        <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-4">
          <UserCheck size={24} />
        </div>
        <h3 className="font-black text-xl mb-1">Transfer Server</h3>
        <p className="text-sm font-medium text-slate-500 mb-6">
          Assign Table {currentTable} to another server:
        </p>

        <div className="space-y-2 mb-6 max-h-[200px] overflow-y-auto">
          {mockServers.map(srv => (
            <button
              key={srv}
              onClick={() => setSelected(srv)}
              className={`w-full p-3.5 rounded-xl border text-left font-bold text-sm transition-all flex items-center justify-between ${
                selected === srv
                  ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-sm'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span>{srv}</span>
              {selected === srv && <span className="text-xs font-black uppercase text-indigo-600">Assigned</span>}
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors text-sm"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onTransfer(selected);
              onClose();
            }}
            className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-indigo-900/20 text-sm"
          >
            Transfer
          </button>
        </div>
      </div>
    </div>
  );
};

interface DeleteOrderModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({ onConfirm, onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in text-slate-800">
      <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-in">
        <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mb-4">
          <AlertTriangle size={24} />
        </div>
        <h3 className="font-black text-xl mb-1 text-slate-900">Delete Entire Order?</h3>
        <p className="text-sm font-medium text-slate-500 mb-6">
          This will void all items in this table's order. This action cannot be undone.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-colors text-sm"
          >
            Keep Order
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="flex-1 py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-2xl transition-colors shadow-lg shadow-red-900/20 text-sm flex items-center justify-center gap-1.5"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};
