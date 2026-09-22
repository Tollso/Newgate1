import React from 'react';
import {
  LayoutDashboard, FileBarChart, DollarSign, Utensils, Users, User,
  Command, ChevronDown, ChevronRight, Menu, LogOut,
  ShoppingBag, MonitorSmartphone, Settings as SettingsIcon, LayoutGrid,
  Smartphone, Store, Receipt
} from 'lucide-react';

interface MenuGroup {
  id: string;
  items: Array<{
    id: string;
    label: string;
    icon: React.ReactNode;
    action?: () => void;
    subItems?: string[];
  }>;
}

interface AppSidebarNavigationProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  expandedMenu: string | null;
  setExpandedMenu: React.Dispatch<React.SetStateAction<string | null>>;
  onLogout: () => void;
}

export const AppSidebarNavigation: React.FC<AppSidebarNavigationProps> = ({
  isSidebarOpen,
  setIsSidebarOpen,
  activeTab,
  setActiveTab,
  expandedMenu,
  setExpandedMenu,
  onLogout,
}) => {
  // Section 3: Web Admin (Browser-Native Management Application)
  const menuGroups: MenuGroup[] = [
    {
      id: 'management',
      items: [
        { id: 'Home', label: 'Home / Dashboard', icon: <LayoutDashboard size={20} />, action: () => setActiveTab('Home') },
        {
          id: 'Sales', label: 'Sales', icon: <Receipt size={20} />,
          subItems: ['Orders', 'Transactions', 'Invoices', 'Recurring Payments']
        },
        {
          id: 'Reports', label: 'Reports', icon: <FileBarChart size={20} />,
          subItems: ['Sales Report', 'Item Sales', 'Employee Sales', 'Tender Types', 'Discounts Report', 'Gift Cards Report', 'Removed Items', 'Peer Insights', 'Requested Reports']
        },
        {
          id: 'Finances', label: 'Finances', icon: <DollarSign size={20} />,
          subItems: ['Finances Overview', 'Deposits', 'Taxes', 'Statements', 'Pay Bills', 'Disputes', 'Cash Log', 'Closeout']
        },
        {
          id: 'Catalog', label: 'Catalog', icon: <Utensils size={20} />,
          subItems: ['Item Library', 'Categories', 'Modifier Groups', 'Discounts', 'Printer Labels', 'Retail Inventory']
        },
        {
          id: 'Employees', label: 'Employees', icon: <Users size={20} />,
          subItems: ['Employee List', 'Schedule', 'Time Clock', 'Tip Pooling']
        },
        {
          id: 'Restaurant', label: 'Restaurant', icon: <Store size={20} />,
          subItems: ['Floor Plan Designer', 'Floor Plan']
        },
        {
          id: 'Devices', label: 'Devices & Terminals', icon: <Smartphone size={20} />,
          action: () => setActiveTab('Devices')
        },
      ]
    },
    {
      id: 'system',
      items: [
        {
          id: 'Guests', label: 'Guests & CRM', icon: <User size={20} />,
          subItems: ['Customer List', 'Feedback']
        },
        { id: 'App Market', label: 'Discover Products', icon: <LayoutGrid size={20} />, action: () => setActiveTab('App Market') },
        { id: 'Settings', label: 'Settings', icon: <SettingsIcon size={20} />, action: () => setActiveTab('Settings') },
      ]
    }
  ];

  const toggleSubMenu = (id: string) => {
    setExpandedMenu(prev => (prev === id ? null : id));
  };

  return (
    <aside className={`bg-slate-900 text-slate-300 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} shrink-0 h-screen overflow-hidden`}>
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        {isSidebarOpen && <span className="font-bold text-white text-lg tracking-tight">The Newgate POS</span>}
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white">
          <Menu size={20} />
        </button>
      </div>

      {/* Primary Android POS Appliance Launcher */}
      <div className="p-3 border-b border-slate-800/80">
        <button
          onClick={() => setActiveTab('POS Shell')}
          className={`w-full flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
            activeTab === 'POS Shell'
              ? 'bg-indigo-600 text-white shadow-indigo-600/30'
              : 'bg-indigo-950/80 text-indigo-300 hover:bg-indigo-900 border border-indigo-800'
          }`}
          title="Launch Android POS Appliance (Newgate.apk)"
        >
          <Smartphone size={18} />
          {isSidebarOpen && <span>Launch Android POS</span>}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 space-y-1">
        {menuGroups.map((group, groupIndex) => (
          <React.Fragment key={group.id}>
            {group.items.map((item) => (
              <div key={item.id}>
                {item.subItems ? (
                  <>
                    <button
                      onClick={() => isSidebarOpen ? toggleSubMenu(item.id) : setActiveTab(item.subItems?.[0] || item.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 hover:bg-slate-800 hover:text-white transition-colors
                        ${activeTab === item.id || (item.subItems && item.subItems.includes(activeTab)) ? 'text-white bg-slate-800' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon}
                        {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                      </div>
                      {isSidebarOpen && (
                        expandedMenu === item.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />
                      )}
                    </button>

                    {isSidebarOpen && expandedMenu === item.id && (
                      <div className="bg-slate-950 py-1">
                        {item.subItems.map((sub) => (
                          <button
                            key={sub}
                            onClick={() => setActiveTab(sub)}
                            className={`w-full text-left pl-12 pr-4 py-2 text-sm hover:text-white transition-colors
                              ${activeTab === sub ? 'text-indigo-400 font-medium' : 'text-slate-500'}`}
                          >
                            {sub}
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <button
                    onClick={item.action}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 hover:text-white transition-colors
                      ${activeTab === item.id ? 'text-white bg-slate-800 border-l-4 border-indigo-500' : ''}`}
                  >
                    {item.icon}
                    {isSidebarOpen && <span className="font-medium text-sm">{item.label}</span>}
                  </button>
                )}
              </div>
            ))}
            {groupIndex < menuGroups.length - 1 && (
              <div className="mx-4 my-2 border-t border-slate-800" />
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut size={20} />
          {isSidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};
