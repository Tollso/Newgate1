import React from 'react';
import { Delete } from 'lucide-react';

interface NumpadProps {
  value: string;
  onChange: (val: string) => void;
  onClear: () => void;
}

export const Numpad: React.FC<NumpadProps> = ({ value, onChange, onClear }) => {
  const handleNum = (num: string) => {
    if (value.includes('.') && num === '.') return;
    if (value.includes('.') && value.split('.')[1]?.length >= 2) return;
    onChange(value + num);
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  return (
    <div className="grid grid-cols-3 gap-2 h-full">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
        <button 
          key={n} 
          onClick={() => handleNum(n.toString())} 
          className="h-12 rounded-xl bg-slate-100 text-xl font-bold text-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
        >
          {n}
        </button>
      ))}
      <button 
        onClick={() => handleNum('.')} 
        className="h-12 rounded-xl bg-slate-100 text-xl font-bold text-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
      >
        .
      </button>
      <button 
        onClick={() => handleNum('0')} 
        className="h-12 rounded-xl bg-slate-100 text-xl font-bold text-slate-700 hover:bg-slate-200 active:scale-95 transition-all"
      >
        0
      </button>
      <button 
        onClick={handleBackspace} 
        className="h-12 rounded-xl bg-slate-100 text-xl font-bold text-slate-700 hover:bg-red-100 hover:text-red-600 active:scale-95 transition-all flex items-center justify-center"
      >
        <Delete size={24} />
      </button>
    </div>
  );
};
