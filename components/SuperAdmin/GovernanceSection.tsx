
import React, { useState } from 'react';
import { MOCK_GLOBAL_RULES, MOCK_GOVERNANCE_PROFILES } from '../../constants';
import { Zap, Shield, Scale, AlertTriangle, CheckCircle, Plus, X } from 'lucide-react';
import { GlobalAutomationRule } from '../../types';

const GovernanceSection: React.FC = () => {
    const [globalRules, setGlobalRules] = useState<GlobalAutomationRule[]>(MOCK_GLOBAL_RULES);
    const [showAddRuleModal, setShowAddRuleModal] = useState<boolean>(false);
    const [ruleName, setRuleName] = useState<string>('');
    const [ruleDesc, setRuleDesc] = useState<string>('');
    const [ruleType, setRuleType] = useState<string>('Velocity Risk');
    const [ruleAction, setRuleAction] = useState<'Block' | 'Require 2FA' | 'Notify'>('Block');

    const toggleGlobalRule = (id: string) => {
        setGlobalRules(prev => prev.map(r => r.id === id ? { ...r, appliedGlobally: !r.appliedGlobally } : r));
    };

    const handleCreateRule = (e: React.FormEvent) => {
        e.preventDefault();
        if (!ruleName || !ruleDesc) return;

        const newRule: GlobalAutomationRule = {
            id: `RULE-${Math.floor(100 + Math.random() * 900)}`,
            name: ruleName,
            description: ruleDesc,
            ruleType,
            action: ruleAction,
            appliedGlobally: true,
    threshold: 0
  };

        setGlobalRules(prev => [newRule, ...prev]);
        setRuleName('');
        setRuleDesc('');
        setShowAddRuleModal(false);
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-emerald-500 rounded-2xl shadow-lg shadow-emerald-500/20">
                            <Scale className="text-white" size={32} />
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter">GOVERNANCE & AUTOMATION</h3>
                    </div>
                    <p className="text-indigo-200 max-w-2xl font-medium leading-relaxed">
                        Control system-wide policies that propagate to all merchants instantly. Manage risk vectors and automate platform compliance via global heuristic rules.
                    </p>
                </div>
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500 opacity-10 rounded-full blur-3xl"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <div>
                            <h4 className="font-black text-slate-800 text-sm tracking-widest uppercase">System Automation</h4>
                            <p className="text-xs text-slate-400 font-bold mt-1">Active heuristic rule-set</p>
                        </div>
                        <button 
                            onClick={() => setShowAddRuleModal(true)}
                            className="p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md flex items-center gap-1 text-xs font-bold uppercase transition-all"
                        >
                            <Plus size={16} /> Add Rule
                        </button>
                    </div>
                    <div className="divide-y divide-slate-50 flex-1">
                        {globalRules.map(rule => (
                            <div key={rule.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                                <div className="flex justify-between items-start mb-3">
                                    <h5 className="font-bold text-slate-900">{rule.name}</h5>
                                    <button 
                                        onClick={() => toggleGlobalRule(rule.id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all ${rule.appliedGlobally ? 'bg-emerald-500' : 'bg-slate-300'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${rule.appliedGlobally ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                <p className="text-sm text-slate-500 mb-4 leading-relaxed font-medium">{rule.description}</p>
                                <div className="flex gap-2">
                                    <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-1 rounded-md font-black uppercase tracking-wider">{rule.ruleType}</span>
                                    <span className={`text-[10px] px-2 py-1 rounded-md font-black uppercase tracking-wider ${rule.action === 'Block' ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                        ACTION: {rule.action}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h4 className="font-black text-slate-800 text-sm tracking-widest uppercase flex items-center gap-2">
                            <Shield size={16} className="text-emerald-500" /> Compliance Oversight
                        </h4>
                    </div>
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase">
                            <tr>
                                <th className="px-6 py-4">Merchant Entity</th>
                                <th className="px-6 py-4">Policy Enforcement</th>
                                <th className="px-6 py-4">Score</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {MOCK_GOVERNANCE_PROFILES.map((profile, idx) => (
                                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-slate-900">{profile.businessName}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-widest ${profile.planEnforcement === 'Strict' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500'}`}>
                                            {profile.planEnforcement}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`text-[10px] px-2 py-1 rounded-lg font-black uppercase flex items-center w-fit gap-1 ${profile.complianceLevel === 'High' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {profile.complianceLevel === 'High' ? <CheckCircle size={10} /> : <AlertTriangle size={10} />}
                                            {profile.complianceLevel}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showAddRuleModal && (
                <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 border border-slate-100 animate-scale-in">
                        <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
                            <h4 className="font-black text-slate-900 uppercase tracking-tight text-base">Create Governance Rule</h4>
                            <button onClick={() => setShowAddRuleModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleCreateRule} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Rule Name</label>
                                <input
                                    type="text"
                                    required
                                    value={ruleName}
                                    onChange={e => setRuleName(e.target.value)}
                                    placeholder="e.g. Max Refund Limit"
                                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Description</label>
                                <textarea
                                    rows={3}
                                    required
                                    value={ruleDesc}
                                    onChange={e => setRuleDesc(e.target.value)}
                                    placeholder="Explain condition & policy trigger..."
                                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Category</label>
                                <select
                                    value={ruleType}
                                    onChange={e => setRuleType(e.target.value)}
                                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                >
                                    <option value="Velocity Risk">Velocity Risk</option>
                                    <option value="Fraud Protection">Fraud Protection</option>
                                    <option value="Audit Compliance">Audit Compliance</option>
                                    <option value="Staff Security">Staff Security</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Action Triggered</label>
                                <select
                                    value={ruleAction}
                                    onChange={e => setRuleAction(e.target.value as any)}
                                    className="w-full border border-slate-300 rounded-xl p-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                                >
                                    <option value="Block">Block</option>
                                    <option value="Require 2FA">Require 2FA</option>
                                    <option value="Notify">Notify</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                                <button type="button" onClick={() => setShowAddRuleModal(false)} className="px-4 py-2 text-xs font-bold text-slate-500">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">Save Rule</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GovernanceSection;
