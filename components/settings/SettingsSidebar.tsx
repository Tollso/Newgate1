import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SettingsSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  setSubSection: (subSection: string | null) => void;
}

const SECTIONS = [
  'Business operations',
  'Employees',
  'Transactions',
  'Dining',
  'Hardware',
  'Kiosk',
  'Ecommerce',
  'Gift Cards',
  'Overview'
];

const SEARCHABLE_OPTIONS = [
  { title: 'Business operations', section: 'Business operations', subSection: null },
  { title: 'Removal reasons', section: 'Business operations', subSection: 'Removal reasons' },
  { title: 'History / Audit Log', section: 'Business operations', subSection: 'History' },
  { title: 'Taxes and fees', section: 'Business operations', subSection: 'Taxes and fees' },
  { title: 'Tips & Auto Gratuity', section: 'Business operations', subSection: 'Tips' },
  { title: 'Service fees & Kitchen charges', section: 'Business operations', subSection: 'Tips' },
  { title: 'Business hours', section: 'Business operations', subSection: 'Business hours' },
  { title: 'Notification preferences', section: 'Business operations', subSection: 'Notification preferences' },
  
  { title: 'Employees', section: 'Employees', subSection: null },
  { title: 'Employee roles', section: 'Employees', subSection: 'Employee roles' },
  { title: 'Employee permissions', section: 'Employees', subSection: 'Employee permissions' },
  { title: 'Device passcode', section: 'Employees', subSection: 'Device passcode' },
  { title: 'Tip pooling policy', section: 'Employees', subSection: 'Tip pooling policy' },
  
  { title: 'Transactions', section: 'Transactions', subSection: null },
  { title: 'Checkout customization', section: 'Transactions', subSection: 'Checkout customization' },
  { title: 'Fraud prevention', section: 'Transactions', subSection: 'Fraud prevention' },
  { title: 'Payment links', section: 'Transactions', subSection: 'Payment links' },
  
  { title: 'Dining & Table fees', section: 'Dining', subSection: null },
  { title: 'Hardware', section: 'Hardware', subSection: null },
  { title: 'Kiosk', section: 'Kiosk', subSection: null },
  { title: 'Ecommerce', section: 'Ecommerce', subSection: null },
  { title: 'Gift Cards', section: 'Gift Cards', subSection: null },
  { title: 'Overview', section: 'Overview', subSection: null },
];

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({
  activeSection,
  setActiveSection,
  setSubSection
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = searchQuery 
    ? SEARCHABLE_OPTIONS.filter(opt => opt.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  return (
    <div className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-100">
        <h2 className="text-lg font-black text-slate-800 tracking-tight mb-4">Settings</h2>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search options..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-4 space-y-1 px-3">
        {searchQuery ? (
          filteredOptions.length > 0 ? (
            filteredOptions.map((opt, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveSection(opt.section);
                  setSubSection(opt.subSection);
                  setSearchQuery('');
                }}
                className="w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              >
                {opt.title}
                {opt.subSection && <span className="block text-xs font-normal text-slate-400 mt-0.5">in {opt.section}</span>}
              </button>
            ))
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500 text-center">No options found</div>
          )
        ) : (
          SECTIONS.map(section => (
            <button
              key={section}
              onClick={() => {
                setActiveSection(section);
                setSubSection(null);
              }}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                activeSection === section
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-200'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {section}
            </button>
          ))
        )}
      </nav>
    </div>
  );
};
