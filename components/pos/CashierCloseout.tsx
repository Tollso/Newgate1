
import React, { useState } from 'react';
import { DollarSign, Clock, Calculator, CheckCircle, AlertTriangle, Printer, Lock } from 'lucide-react';

interface CashierCloseoutProps {
    onCloseout?: (data: { actual: number, variance: number }) => void;
}

const CashierCloseout: React.FC<CashierCloseoutProps> = ({ onCloseout }) => {
    const [step, setStep] = useState(1);
    const [counts, setCounts] = useState({ hundred: 0, fifty: 0, twenty: 0, ten: 0, five: 0, one: 0 });
    
    const cashTotal = (counts.hundred * 100) + (counts.fifty * 50) + (counts.twenty * 20) + (counts.ten * 10) + (counts.five * 5) + (counts.one * 1);
    const expectedCash = 450.00;
    const variance = cashTotal - expectedCash;

    const renderDenom = (label: string, value: number, field: keyof typeof counts) => (
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="font-black text-slate-500 uppercase tracking-widest text-xs">${label} Bills</span>
            <div className="flex items-center gap-4">
                <button onClick={() => setCounts({...counts, [field]: Math.max(0, value - 1)})} className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-white">-</button>
                <span className="w-8 text-center font-black text-slate-900">{value}</span>
                <button onClick={() => setCounts({...counts, [field]: value + 1})} className="w-10 h-10 rounded-full border border-slate-300 flex items-center justify-center hover:bg-white">+</button>
            </div>
        </div>
    );

    const handleSubmit = () => {
        if (onCloseout) {
            onCloseout({ actual: cashTotal, variance: variance });
        }
    };

    return (
        <div className="h-full bg-slate-100 flex items-center justify-center p-6 animate-fade-in">
            <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200 flex flex-col md:flex-row h-[700px]">
                {/* Left: Summary Panel */}
                <div className="md:w-80 bg-slate-900 text-white p-10 flex flex-col justify-between shrink-0">
                    <div>
                        <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-900/50">
                            <Clock className="text-white" />
                        </div>
                        <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Shift<br/>Closeout</h2>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">Terminal reconcilliation for drawer ID: #XJ-922</p>
                    </div>

                    <div className="space-y-6">
                        <div className="border-t border-slate-800 pt-6">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Expected Sales</p>
                            <p className="text-xl font-black tracking-tight">$3,042.83</p>
                        </div>
                        <div className="border-t border-slate-800 pt-6">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Cash In Drawer</p>
                            <p className="text-4xl font-black tracking-tight text-indigo-400">${cashTotal.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Right: Workspace */}
                <div className="flex-1 p-12 overflow-y-auto">
                    {step === 1 ? (
                        <div className="space-y-8 animate-fade-in">
                            <div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase mb-2">1. Cash Audit</h3>
                                <p className="text-slate-500 text-sm font-medium">Please count all physical currency in the register drawer.</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {renderDenom('100', counts.hundred, 'hundred')}
                                {renderDenom('50', counts.fifty, 'fifty')}
                                {renderDenom('20', counts.twenty, 'twenty')}
                                {renderDenom('10', counts.ten, 'ten')}
                                {renderDenom('5', counts.five, 'five')}
                                {renderDenom('1', counts.one, 'one')}
                            </div>

                            <button 
                                onClick={() => setStep(2)}
                                className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.25em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                            >
                                Continue to Verification
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8 animate-scale-in">
                            <div className="text-center space-y-4">
                                <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${Math.abs(variance) < 1 ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                                    {Math.abs(variance) < 1 ? <CheckCircle size={40}/> : <AlertTriangle size={40}/>}
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 tracking-tight">VERIFICATION</h3>
                                <p className="text-slate-500 font-medium">Reconcilliation report for terminal Node-01</p>
                            </div>

                            <div className="bg-slate-50 rounded-[2.5rem] p-8 space-y-4 border border-slate-200">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Expected Cash</span>
                                    <span className="font-black text-slate-900">${expectedCash.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="font-bold text-slate-500 uppercase tracking-widest text-[10px]">Actual Count</span>
                                    <span className="font-black text-slate-900">${cashTotal.toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-slate-200 w-full" />
                                <div className="flex justify-between items-center">
                                    <span className="font-black text-slate-800 uppercase tracking-widest text-xs">Drawer Variance</span>
                                    <span className={`text-xl font-black ${variance === 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {variance > 0 ? '+' : ''}{variance.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button onClick={() => setStep(1)} className="flex-1 py-4 border border-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-400 hover:bg-slate-50">Back to Audit</button>
                                <button 
                                    onClick={handleSubmit}
                                    className="flex-1 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl hover:bg-black transition-all"
                                >
                                    <Lock size={14}/> LOCK & SUBMIT
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CashierCloseout;
