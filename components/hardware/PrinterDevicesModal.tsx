import React, { useState } from 'react';
import { PrinterDevice } from '../../types';
import { X, Plus, Server, Trash2 } from 'lucide-react';

interface PrinterDevicesModalProps {
  devices: PrinterDevice[];
  onClose: () => void;
  onAddDevice: (name: string, ip: string) => void;
  onDeleteDevice: (id: string) => void;
}

export const PrinterDevicesModal: React.FC<PrinterDevicesModalProps> = ({
  devices,
  onClose,
  onAddDevice,
  onDeleteDevice
}) => {
  const [deviceName, setDeviceName] = useState('');
  const [deviceIp, setDeviceIp] = useState('');

  const handleAdd = () => {
    if (!deviceName.trim()) return;
    onAddDevice(deviceName.trim(), deviceIp.trim());
    setDeviceName('');
    setDeviceIp('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-100 flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
          <div className="flex items-center gap-2">
            <Server size={20} className="text-indigo-600" />
            <h3 className="font-bold text-lg text-slate-800">Printer Devices (LAN Hardware)</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto">
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Add Network Printer Hardware</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input 
                type="text" 
                placeholder="Printer Name (e.g. Prep 2)" 
                value={deviceName}
                onChange={e => setDeviceName(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
              />
              <input 
                type="text" 
                placeholder="IP Address (e.g. 192.168.1.150)" 
                value={deviceIp}
                onChange={e => setDeviceIp(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-mono"
              />
            </div>
            <button 
              onClick={handleAdd}
              className="w-full py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus size={16} /> Register Printer Device
            </button>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Network Printers</h4>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {devices.map(dev => (
                <div key={dev.id} className="p-3.5 flex justify-between items-center hover:bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{dev.name}</p>
                      <p className="text-xs font-mono text-slate-400">{dev.ipAddress}</p>
                    </div>
                  </div>
                  <button onClick={() => onDeleteDevice(dev.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg">
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button onClick={onClose} className="px-5 py-2 bg-slate-800 text-white font-bold text-xs rounded-xl hover:bg-slate-900">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
