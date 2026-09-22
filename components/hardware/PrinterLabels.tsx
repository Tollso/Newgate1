import React, { useState } from 'react';
import { MOCK_PRINTER_LABELS, MOCK_PRINTER_DEVICES } from '../../constants';
import { PrinterLabel, PrinterDevice, InventoryItem } from '../../types';
import { Plus, Search, Edit2, Trash2, Printer, Tag, X, Server, AlertTriangle } from 'lucide-react';
import { PrinterDevicesModal } from './PrinterDevicesModal';

const INITIAL_DEVICES: PrinterDevice[] = MOCK_PRINTER_DEVICES.length > 0 ? MOCK_PRINTER_DEVICES : [
  { id: 'PD-1', name: 'Kitchen 1', ipAddress: '192.168.1.101', type: 'Kitchen', status: 'Online' },
  { id: 'PD-2', name: 'Kitchen 2', ipAddress: '192.168.1.102', type: 'Kitchen', status: 'Online' },
  { id: 'PD-3', name: 'Bar Printer', ipAddress: '192.168.1.103', type: 'Receipt', status: 'Online' },
  { id: 'PD-4', name: 'Oven Printer', ipAddress: '192.168.1.104', type: 'Kitchen', status: 'Online' }
];

interface PrinterLabelsProps {
  inventory?: InventoryItem[];
  printerLabels?: PrinterLabel[];
  setPrinterLabels?: React.Dispatch<React.SetStateAction<PrinterLabel[]>>;
}

const PrinterLabels: React.FC<PrinterLabelsProps> = ({
  inventory = [],
  printerLabels: propPrinterLabels,
  setPrinterLabels: propSetPrinterLabels
}) => {
  const [localLabels, setLocalLabels] = useState<PrinterLabel[]>(MOCK_PRINTER_LABELS);
  const labels = propPrinterLabels || localLabels;
  const setLabels = propSetPrinterLabels || setLocalLabels;
  const [devices, setDevices] = useState<PrinterDevice[]>(INITIAL_DEVICES);
  const [searchTerm, setSearchTerm] = useState('');

  const [showLabelModal, setShowLabelModal] = useState(false);
  const [editingLabel, setEditingLabel] = useState<PrinterLabel | null>(null);
  const [showDevicesModal, setShowDevicesModal] = useState(false);
  const [deletingLabelId, setDeletingLabelId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<PrinterLabel>>({
    name: '',
    assignedPrinter: 'Kitchen 1',
    itemsCount: 0,
    isActive: true
  });

  const filteredLabels = labels.filter(label => 
    label.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    label.assignedPrinter.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddLabel = () => {
    setEditingLabel(null);
    setFormData({
      name: '',
      assignedPrinter: devices.length > 0 ? devices[0].name : 'Kitchen 1',
      itemsCount: 0,
      isActive: true
    });
    setShowLabelModal(true);
  };

  const handleOpenEditLabel = (label: PrinterLabel) => {
    setEditingLabel(label);
    setFormData({ ...label });
    setShowLabelModal(true);
  };

  const handleSaveLabel = () => {
    if (!formData.name?.trim()) return;

    if (editingLabel) {
      setLabels(prev => prev.map(l => l.id === editingLabel.id ? {
        ...l,
        name: formData.name!.trim(),
        assignedPrinter: formData.assignedPrinter || 'Kitchen 1',
        itemsCount: formData.itemsCount || 0,
        isActive: formData.isActive ?? true
      } : l));
    } else {
      const newLabel: PrinterLabel = {
        id: `PL-${Date.now()}`,
        name: formData.name.trim(),
        assignedPrinter: formData.assignedPrinter || 'Kitchen 1',
        itemsCount: formData.itemsCount || 0,
        isActive: formData.isActive ?? true
      };
      setLabels(prev => [...prev, newLabel]);
    }

    setShowLabelModal(false);
  };

  const confirmDeleteLabel = () => {
    if (deletingLabelId) {
      setLabels(prev => prev.filter(l => l.id !== deletingLabelId));
      setDeletingLabelId(null);
    }
  };

  const toggleLabelStatus = (id: string) => {
    setLabels(prev => prev.map(l => l.id === id ? { ...l, isActive: !l.isActive } : l));
  };

  const handleAddDevice = (name: string, ip: string) => {
    const device: PrinterDevice = {
      id: `PD-${Date.now()}`,
      name: name,
      ipAddress: ip || '192.168.1.200',
      type: 'Kitchen',
      status: 'Online'
    };
    setDevices(prev => [...prev, device]);
  };

  const handleDeleteDevice = (id: string) => {
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      {deletingLabelId && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm border border-slate-100 p-6 text-center">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} />
            </div>
            <h3 className="font-bold text-lg text-slate-800 mb-2">Delete Printer Label?</h3>
            <p className="text-sm text-slate-500 mb-6">This action cannot be undone.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setDeletingLabelId(null)} className="px-4 py-2 border border-slate-300 text-slate-700 font-semibold rounded-xl text-sm">Cancel</button>
              <button onClick={confirmDeleteLabel} className="px-5 py-2 bg-red-600 text-white font-semibold rounded-xl text-sm">Delete</button>
            </div>
          </div>
        </div>
      )}

      {showLabelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-lg text-slate-800">{editingLabel ? 'Edit Printer Label' : 'Add Printer Label'}</h3>
              <button onClick={() => setShowLabelModal(false)} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Label Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Hot Line, Bar" 
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Target Printer</label>
                <select 
                  value={formData.assignedPrinter}
                  onChange={e => setFormData({ ...formData, assignedPrinter: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-xl outline-none bg-white"
                >
                  {devices.map(dev => (
                    <option key={dev.id} value={dev.name}>{dev.name} ({dev.ipAddress || 'LAN'})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button onClick={() => setShowLabelModal(false)} className="px-4 py-2 text-slate-600 font-bold text-sm">Cancel</button>
              <button onClick={handleSaveLabel} className="px-5 py-2 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700">Save</button>
            </div>
          </div>
        </div>
      )}

      {showDevicesModal && (
        <PrinterDevicesModal
          devices={devices}
          onClose={() => setShowDevicesModal(false)}
          onAddDevice={handleAddDevice}
          onDeleteDevice={handleDeleteDevice}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Printer Labels & Routing</h1>
          <p className="text-slate-500 text-xs font-medium mt-0.5">Route item categories to physical kitchen and bar printers</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setShowDevicesModal(true)} className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl">
            <Server size={18} /> Manage Printers
          </button>
          <button onClick={handleOpenAddLabel} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-bold text-sm rounded-xl hover:bg-indigo-700">
            <Plus size={18} /> Add Label
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative max-w-md">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search printer labels or assigned devices..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="p-4">Label Name</th>
              <th className="p-4">Assigned Printer</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {filteredLabels.map(label => (
              <tr key={label.id} className="hover:bg-slate-50">
                <td className="p-4 font-bold text-slate-900 flex items-center gap-2">
                  <Tag size={16} className="text-indigo-600" /> {label.name}
                </td>
                <td className="p-4 flex items-center gap-2">
                  <Printer size={16} className="text-slate-400" /> {label.assignedPrinter}
                </td>
                <td className="p-4">
                  <button onClick={() => toggleLabelStatus(label.id)} className={`w-10 h-5 rounded-full relative transition-all ${label.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${label.isActive ? 'translate-x-5' : ''}`} />
                  </button>
                </td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenEditLabel(label)} className="p-1.5 text-slate-400 hover:text-indigo-600"><Edit2 size={16} /></button>
                    <button onClick={() => setDeletingLabelId(label.id)} className="p-1.5 text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PrinterLabels;
