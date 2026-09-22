import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Download, SlidersHorizontal, ChevronDown, Check, Plus, FolderPlus, Printer, FileSpreadsheet, X } from 'lucide-react';
import { RemovedItemsOverview } from './RemovedItemsOverview';
import { RemovedItemsTable, RemovedItem } from './RemovedItemsTable';
import { downloadCSV } from '../../src/utils/csvExportUtil';

const INITIAL_REMOVED_ITEMS: RemovedItem[] = [
  { id: 'RM1', itemName: "Truffle Fries", price: 14.50, removedAt: "May 18, 2026", employeeName: "Michael Server", reason: "Customer Changed Mind", orderId: "ORD-9302", orderType: "Dine-In", printStatus: "Printed", category: "Food", removedBy: "Sarah Connor", serverSection: "Dining Room", time: "11:34 PM" },
  { id: 'RM2', itemName: "Classic Burger", price: 18.50, removedAt: "May 18, 2026", employeeName: "Michael Server", reason: "Sent in Error", orderId: "ORD-9288", orderType: "Dine-In", printStatus: "Printed", category: "Food", removedBy: "Sarah Connor", serverSection: "Bar", time: "11:15 PM" },
  { id: 'RM3', itemName: "Ribeye Steak", price: 42.00, removedAt: "May 18, 2026", employeeName: "Emma Davis", reason: "Kitchen Backed Up / Long Wait", orderId: "ORD-9201", orderType: "Dine-In", printStatus: "Printed", category: "Food", removedBy: "Sarah Connor", serverSection: "Patio", time: "09:42 PM" },
  { id: 'RM4', itemName: "Caesar Salad", price: 14.20, removedAt: "May 18, 2026", employeeName: "Alice Walker", reason: "Customer unhappy with dressing", orderId: "ORD-9154", orderType: "Dine-In", printStatus: "Printed", category: "Food", removedBy: "Michael Server", serverSection: "Dining Room", time: "08:15 PM" },
  { id: 'RM5', itemName: "Draft IPA", price: 8.50, removedAt: "May 18, 2026", employeeName: "Emma Davis", reason: "Entered Wrong Draft Beer", orderId: "ORD-9111", orderType: "Bar", printStatus: "Printed", category: "Alcohol", removedBy: "Emma Davis", serverSection: "Bar", time: "07:11 PM" },
  { id: 'RM6', itemName: "Margherita Pizza", price: 19.50, removedAt: "May 18, 2026", employeeName: "Alice Walker", reason: "Burned crust", orderId: "ORD-9087", orderType: "Takeout", printStatus: "Printed", category: "Food", removedBy: "Sarah Connor", serverSection: "Dining Room", time: "06:45 PM" },
  { id: 'RM7', itemName: "Diet Coke", price: 4.00, removedAt: "May 18, 2026", employeeName: "David Chen", reason: "Wrong flavor selected", orderId: "ORD-9012", orderType: "Dine-In", printStatus: "Printed", category: "Beverages", removedBy: "David Chen", serverSection: "Bar", time: "04:30 PM" },
  { id: 'RM8', itemName: "Chocolate Lava Cake", price: 11.50, removedAt: "May 18, 2026", employeeName: "David Chen", reason: "Customer left before dessert", orderId: "ORD-8942", orderType: "Dine-In", printStatus: "Printed", category: "Dessert", removedBy: "Sarah Connor", serverSection: "Dining Room", time: "02:15 PM" },
  { id: 'RM9', itemName: "Grilled Salmon", price: 28.00, removedAt: "May 18, 2026", employeeName: "Michael Server", reason: "Customer Changed Mind", orderId: "ORD-8812", orderType: "Dine-In", printStatus: "Printed", category: "Food", removedBy: "Michael Server", serverSection: "Patio", time: "12:40 PM" },
  { id: 'RM10', itemName: "Spicy Chicken Wings", price: 24.00, removedAt: "May 18, 2026", employeeName: "Emma Davis", reason: "Ordered double by mistake", orderId: "ORD-8710", orderType: "Takeout", printStatus: "Printed", category: "Food", removedBy: "Emma Davis", serverSection: "Dining Room", time: "11:15 AM" },
  { id: 'RM11', itemName: "Espresso", price: 3.50, removedAt: "May 19, 2026", employeeName: "Emma Davis", reason: "Order Mistake", orderId: "ORD-9350", orderType: "Takeout", printStatus: "Unprinted", category: "Beverages", removedBy: "Emma Davis", serverSection: "Bar", time: "09:20 AM" },
  { id: 'RM12', itemName: "Garlic Bread", price: 6.00, removedAt: "May 19, 2026", employeeName: "Michael Server", reason: "Spilled before serving", orderId: "ORD-9366", orderType: "Dine-In", printStatus: "Unprinted", category: "Food", removedBy: "Michael Server", serverSection: "Dining Room", time: "10:45 AM" },
  { id: 'RM13', itemName: "Vanilla Gelato", price: 7.00, removedAt: "May 19, 2026", employeeName: "Alice Walker", reason: "Entered twice", orderId: "ORD-9380", orderType: "Dine-In", printStatus: "Unprinted", category: "Dessert", removedBy: "Sarah Connor", serverSection: "Dining Room", time: "11:30 AM" }
];

const RemovedItems: React.FC = () => {
  const [items, setItems] = useState<RemovedItem[]>(() => {
    const saved = localStorage.getItem('omni_removed_items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_REMOVED_ITEMS;
  });

  useEffect(() => {
    localStorage.setItem('omni_removed_items', JSON.stringify(items));
  }, [items]);

  const [dateRange, setDateRange] = useState('Custom Date Range');
  const [printStatus, setPrintStatus] = useState('Printed Items');
  const [revenueItemFilter, setRevenueItemFilter] = useState('All Revenue Items');
  const [employeeFilter, setEmployeeFilter] = useState('All Employees');
  const [searchQuery, setSearchQuery] = useState('');
  const [displayDensity, setDisplayDensity] = useState<'Detailed' | 'Compact'>('Detailed');
  const [hasRevenueClasses, setHasRevenueClasses] = useState(false);
  const [showAddClassModal, setShowAddClassModal] = useState(false);

  const [sortColumn, setSortColumn] = useState<'item' | 'price' | 'date' | 'employee'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (printStatus === 'Printed Items' && item.printStatus !== 'Printed') return false;
      if (printStatus === 'Unprinted Items' && item.printStatus !== 'Unprinted') return false;
      if (employeeFilter !== 'All Employees' && item.employeeName !== employeeFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (!item.itemName.toLowerCase().includes(query) && !item.orderId.toLowerCase().includes(query)) return false;
      }
      return true;
    });
  }, [items, printStatus, employeeFilter, searchQuery]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      let valA: any = a[sortColumn === 'item' ? 'itemName' : sortColumn === 'employee' ? 'employeeName' : sortColumn];
      let valB: any = b[sortColumn === 'item' ? 'itemName' : sortColumn === 'employee' ? 'employeeName' : sortColumn];
      return sortDirection === 'asc' ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });
  }, [filteredItems, sortColumn, sortDirection]);

  const handleSort = (col: 'item' | 'price' | 'date' | 'employee') => {
    if (sortColumn === col) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortDirection('asc');
    }
  };

  const handleDeleteLog = (id: string, name: string) => {
    if (confirm(`Delete log entry for "${name}"?`)) {
      setItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const totalRemovedValue = useMemo(() => filteredItems.reduce((acc, i) => acc + i.price, 0), [filteredItems]);
  const unprintedCount = useMemo(() => (items || []).filter(i => i.printStatus === 'Unprinted').length, [items]);
  const unprintedValue = useMemo(() => (items || []).filter(i => i.printStatus === 'Unprinted').reduce((acc, i) => acc + i.price, 0), [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Removed / Void Items</h1>
          <p className="text-slate-500">Track and audit item removals and voided transactions</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => downloadCSV(sortedItems, 'Void_Removed_Items_Report')} className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 text-slate-700 font-medium transition-colors">
            <Download size={16} /> Export CSV
          </button>
        </div>
      </div>

      <RemovedItemsOverview 
        filteredCount={filteredItems.length}
        totalRemovedValue={totalRemovedValue}
        unprintedCount={unprintedCount}
        unprintedValue={unprintedValue}
        hasRevenueClasses={hasRevenueClasses}
        handleSetupStandardClasses={() => setHasRevenueClasses(true)}
        setShowAddClassModal={setShowAddClassModal}
      />

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          {['Printed Items', 'Unprinted Items', 'All Items'].map(status => (
            <button 
              key={status} 
              onClick={() => setPrintStatus(status)} 
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${printStatus === status ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
              {status}
            </button>
          ))}
        </div>
        <input 
          type="text" 
          placeholder="Filter logs..." 
          value={searchQuery} 
          onChange={e => setSearchQuery(e.target.value)} 
          className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <RemovedItemsTable 
        sortedItems={sortedItems}
        displayDensity={displayDensity}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        handleSort={handleSort}
        handleDeleteLog={handleDeleteLog}
      />
    </div>
  );
};

export default RemovedItems;
