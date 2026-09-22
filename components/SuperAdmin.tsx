
import React, { useState } from 'react';
import { Shield, Users, CreditCard, Scale, LayoutGrid, DollarSign, Activity, UserCheck, Search } from 'lucide-react';
import { AppIntegrationConfig, Business, Employee } from '../types';

// Section Imports
import MerchantsSection from './SuperAdmin/MerchantsSection';
import GovernanceSection from './SuperAdmin/GovernanceSection';
import SubscriptionsSection from './SuperAdmin/SubscriptionsSection';
import AppsSection from './SuperAdmin/AppsSection';
import FinancialsSection from './SuperAdmin/FinancialsSection';
import { SystemAuditSection } from './SuperAdmin/SystemAuditSection';
import { PlatformUsersSection } from './SuperAdmin/PlatformUsersSection';

interface SuperAdminProps {
    integrationConfig?: AppIntegrationConfig;
    onToggleIntegration?: (key: keyof AppIntegrationConfig) => void;
    businesses?: Business[];
    onAddBusiness?: (business: Business, owner: Partial<Employee>) => void;
    onSwitchMerchant?: (business: Business) => void;
}

const NAV_OPTIONS = [
    { id: 'Merchants', label: 'Merchants', icon: Users },
    { id: 'Subscriptions', label: 'Tiers & Pricing', icon: CreditCard },
    { id: 'Governance', label: 'Governance', icon: Scale },
    { id: 'Apps', label: 'App Services', icon: LayoutGrid },
    { id: 'Financials', label: 'Financials', icon: DollarSign },
    { id: 'Users', label: 'Platform Admins', icon: UserCheck },
    { id: 'Reports', label: 'System Audit', icon: Activity }
] as const;

type NavSectionId = typeof NAV_OPTIONS[number]['id'];

const SuperAdmin: React.FC<SuperAdminProps> = ({ integrationConfig, onToggleIntegration, businesses, onAddBusiness, onSwitchMerchant }) => {
    const [activeSection, setActiveSection] = useState<NavSectionId>('Merchants');
    const [searchQuery, setSearchQuery] = useState('');
    
    const renderContent = () => {
        switch(activeSection) {
            case 'Merchants': return <MerchantsSection businesses={businesses} onAddBusiness={onAddBusiness} onSwitchMerchant={onSwitchMerchant} />;
            case 'Governance': return <GovernanceSection />;
            case 'Subscriptions': return <SubscriptionsSection />;
            case 'Apps': return <AppsSection integrationConfig={integrationConfig} onToggleIntegration={onToggleIntegration} />;
            case 'Financials': return <FinancialsSection />;
            case 'Reports': return <SystemAuditSection />;
            case 'Users': return <PlatformUsersSection />;
            default:
                return <MerchantsSection businesses={businesses} onAddBusiness={onAddBusiness} onSwitchMerchant={onSwitchMerchant} />;
        }
    };

    const filteredNav = searchQuery 
        ? NAV_OPTIONS.filter(opt => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : NAV_OPTIONS;

    const NavItem = ({ id, label, icon: Icon }: any) => (
        <button
            onClick={() => {
                setActiveSection(id);
                setSearchQuery('');
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-left transition-all mb-2
                ${activeSection === id 
                    ? 'bg-slate-800 text-white shadow-2xl shadow-slate-900/20 translate-x-1' 
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'}`}
        >
            <Icon size={18} className={activeSection === id ? 'text-indigo-400' : ''} />
            <span className={`font-bold text-sm tracking-tight ${activeSection === id ? 'text-white' : ''}`}>{label}</span>
        </button>
    );

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-slate-50 rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
            <div className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100">
                            <Shield size={18} className="text-white" />
                        </div>
                        <h2 className="font-black text-slate-900 text-xl tracking-tighter">OMNI CONTROL</h2>
                    </div>
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] ml-1">v4.2.0 Enterprise</p>
                </div>
                
                <div className="mb-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search size={16} className="text-slate-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                    />
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto">
                    {filteredNav.length > 0 ? (
                        filteredNav.map(nav => (
                            <NavItem key={nav.id} id={nav.id} label={nav.label} icon={nav.icon} />
                        ))
                    ) : (
                        <div className="px-4 py-3 text-sm text-slate-500 text-center">No modules found</div>
                    )}
                </nav>
                <div className="pt-6 border-t border-slate-50">
                    <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                        <p className="text-[10px] font-black text-indigo-900 uppercase tracking-widest mb-1">Status</p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs font-bold text-indigo-700 uppercase">System Ready</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-10 bg-slate-50/30">
                {renderContent()}
            </div>
        </div>
    );
};

export default SuperAdmin;
