
import React, { useState, useEffect } from 'react';
import { Lock, Delete, ArrowRight, ShieldCheck, User as UserIcon } from 'lucide-react';
import { Employee } from '../../types';

interface PasscodeLockProps {
  employees: Employee[];
  onAuthenticated: (user: Employee) => void;
  onCancel: () => void;
}

const PasscodeLock: React.FC<PasscodeLockProps> = ({ employees = [], onAuthenticated, onCancel }) => {
  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleNumberClick = (num: string) => {
    if (code.length < 6) {
      setCode(prev => prev + num);
      setError(null);
    }
  };

  const handleDelete = () => {
    setCode(prev => prev.slice(0, -1));
    setError(null);
  };

  useEffect(() => {
    if (code.length === 4) {
      const user = (employees || []).find(e => e.passcode === code);
      if (user) {
        setIsSuccess(true);
        setTimeout(() => onAuthenticated(user), 600);
      } else {
        setError('Invalid Passcode');
        setTimeout(() => setCode(''), 500);
      }
    }
  }, [code, employees, onAuthenticated]);

  return (
    <div className="fixed inset-0 z-[100] bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-8">
          <div className={`h-20 w-20 rounded-full mx-auto flex items-center justify-center mb-4 transition-all duration-300 ${
            isSuccess ? 'bg-emerald-500 scale-110' : error ? 'bg-rose-500 animate-shake' : 'bg-indigo-600 shadow-lg shadow-indigo-500/20'
          }`}>
            {isSuccess ? <ShieldCheck className="text-white" size={40} /> : <Lock className="text-white" size={32} />}
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">System Access</h1>
          <p className="text-slate-400 mt-1">Enter your operator passcode</p>
        </div>

        {/* Indicators */}
        <div className="flex gap-4 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${
                code.length >= i 
                  ? 'bg-indigo-500 border-indigo-500 scale-125 shadow-[0_0_15px_rgba(99,102,241,0.5)]' 
                  : 'border-slate-700'
              }`}
            />
          ))}
        </div>

        {error && <p className="text-rose-500 font-bold mb-6 animate-bounce">{error}</p>}

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-[320px]">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
            <button
              key={num}
              onClick={() => handleNumberClick(num)}
              className="h-20 w-20 rounded-full bg-slate-800 text-white text-3xl font-bold flex items-center justify-center hover:bg-slate-700 active:bg-indigo-600 transition-colors"
            >
              {num}
            </button>
          ))}
          <button onClick={onCancel} className="h-20 w-20 flex items-center justify-center text-slate-500 hover:text-white font-bold">
            Exit
          </button>
          <button
            onClick={() => handleNumberClick('0')}
            className="h-20 w-20 rounded-full bg-slate-800 text-white text-3xl font-bold flex items-center justify-center hover:bg-slate-700 active:bg-indigo-600 transition-colors"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="h-20 w-20 flex items-center justify-center text-slate-400 hover:text-white"
          >
            <Delete size={32} />
          </button>
        </div>

        <div className="mt-12 flex items-center gap-2 text-slate-500 text-sm">
          <UserIcon size={14} />
          <span>Authorized Personnel Only</span>
        </div>
      </div>
    </div>
  );
};

export default PasscodeLock;
