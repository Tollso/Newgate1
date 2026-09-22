import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Employee } from '../../../types/business';

interface RetailPOSHeaderProps {
  onExit: () => void;
  onOpenReturns?: () => void;
  currentUser: Employee;
}

export const RetailPOSHeader: React.FC<RetailPOSHeaderProps> = ({
  onExit,
  onOpenReturns,
  currentUser,
}) => {
  return (
    <header className="h-16 bg-slate-900 border-b border-slate-800 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center space-x-3">
        <button
          onClick={onExit}
          className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-slate-300 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-lg font-black text-white">Retail Register</h1>
          <p className="text-xs text-slate-400">Barcode & Variants Matrix Active</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        {onOpenReturns && (
          <button
            onClick={onOpenReturns}
            className="px-3.5 py-2 bg-amber-950/60 hover:bg-amber-900 text-amber-300 border border-amber-800/80 rounded-xl text-xs font-bold transition-colors"
          >
            Returns & Store Credit
          </button>
        )}
        <span className="text-xs text-slate-400 font-mono">Cashier: {currentUser.name}</span>
      </div>
    </header>
  );
};
