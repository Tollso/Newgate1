/**
 * DeviceProvisioningModal
 * Web Admin and Terminal appliance setup workflow.
 * Generates single-use provisioning tokens, QR representations, and runs hardware diagnostics (Sections 4 & 5).
 */

import React, { useState, useEffect } from 'react';
import { QrCode, Monitor, CheckCircle2, AlertCircle, RefreshCw, Smartphone, Wrench, Shield, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { DeviceIdentityService } from '../../services/deviceIdentityService';
import { DeviceRecord, DeviceRole, MerchantMode, ProvisioningToken } from '../../types/device';

interface DeviceProvisioningModalProps {
  isOpen: boolean;
  onClose: () => void;
  merchantId?: string;
  locationId?: string;
  initialMerchantMode?: MerchantMode;
}

export const DeviceProvisioningModal: React.FC<DeviceProvisioningModalProps> = ({
  isOpen,
  onClose,
  merchantId = 'M001',
  locationId = 'LOC-1',
  initialMerchantMode = 'RESTAURANT',
}) => {
  const [activeTab, setActiveTab] = useState<'ENROLL_DEVICE' | 'DEVICE_LIST' | 'DIAGNOSTICS'>('ENROLL_DEVICE');
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [loadingDevices, setLoadingDevices] = useState(false);

  // New device form state - pre-bound to merchant business mode
  const [deviceName, setDeviceName] = useState('Front Counter Terminal');
  const [deviceRole, setDeviceRole] = useState<DeviceRole>('REGISTER');
  const [merchantMode, setMerchantMode] = useState<MerchantMode>(initialMerchantMode);
  const [generatedToken, setGeneratedToken] = useState<ProvisioningToken | null>(null);
  const [generatingToken, setGeneratingToken] = useState(false);

  // Diagnostics state
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticResults, setDiagnosticResults] = useState<any | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (initialMerchantMode) {
        setMerchantMode(initialMerchantMode);
      }
      loadDevices();
    }
  }, [isOpen, initialMerchantMode]);

  const loadDevices = async () => {
    setLoadingDevices(true);
    try {
      const list = await DeviceIdentityService.listDevices(merchantId);
      setDevices(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDevices(false);
    }
  };

  const handleGenerateToken = async () => {
    setGeneratingToken(true);
    try {
      const token = await DeviceIdentityService.generateProvisioningToken({
        merchantId,
        locationId,
        merchantMode,
        deviceRole,
        deviceName,
      });
      setGeneratedToken(token);
      loadDevices();
    } catch (e) {
      console.error(e);
    } finally {
      setGeneratingToken(false);
    }
  };

  const handleRunDiagnostics = async () => {
    setDiagnosticsRunning(true);
    try {
      const res = await DeviceIdentityService.runHardwareDiagnostics();
      setDiagnosticResults(res);
    } catch (e) {
      console.error(e);
    } finally {
      setDiagnosticsRunning(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-600 rounded-lg">
              <Monitor size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold">Newgate Device & Appliance Provisioning</h3>
              <p className="text-xs text-slate-400">Enroll, manage, and test dedicated Android POS terminals</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-slate-50">
          <button
            onClick={() => setActiveTab('ENROLL_DEVICE')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 ${
              activeTab === 'ENROLL_DEVICE'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode size={16} /> Enroll New Appliance
          </button>
          <button
            onClick={() => setActiveTab('DEVICE_LIST')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 ${
              activeTab === 'DEVICE_LIST'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone size={16} /> Provisioned Devices ({devices.length})
          </button>
          <button
            onClick={() => setActiveTab('DIAGNOSTICS')}
            className={`py-3 px-4 text-xs font-bold border-b-2 flex items-center gap-2 ${
              activeTab === 'DIAGNOSTICS'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Wrench size={16} /> Hardware Diagnostics
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'ENROLL_DEVICE' && (
            <div className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl text-xs text-indigo-900 space-y-1">
                <p className="font-bold">Appliance-like Provisioning Workflow (Section 5):</p>
                <p>
                  1. Generate a single-use setup token. 2. Device boots directly into Newgate setup. 3. Device scans or enters token to securely bind hardware fingerprint, merchant mode, and role.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Device Name</label>
                  <input
                    type="text"
                    value={deviceName}
                    onChange={(e) => setDeviceName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g. Bar Terminal 1"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Merchant Mode</label>
                  <select
                    value={merchantMode}
                    onChange={(e) => setMerchantMode(e.target.value as MerchantMode)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="RESTAURANT">Restaurant (Dining, Tables, KDS)</option>
                    <option value="RETAIL">Retail (Scanner, Variants, Inventory)</option>
                    <option value="NONPROFIT">Nonprofit (Giving Kiosk, Donations)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Assigned Device Role</label>
                  <select
                    value={deviceRole}
                    onChange={(e) => setDeviceRole(e.target.value as DeviceRole)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="REGISTER">Register / Cashier Terminal</option>
                    <option value="KDS">Kitchen Display Screen (KDS)</option>
                    <option value="EXPO">Expo Dispatch Screen</option>
                    <option value="HOST">Host & Seating Stand</option>
                    <option value="KIOSK">Self-Service Customer Kiosk</option>
                    <option value="DONATION_KIOSK">Giving & Donation Kiosk</option>
                    <option value="HANDHELD">Handheld Server Terminal</option>
                    <option value="SCANNER">Inventory / Receiving Scanner</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={handleGenerateToken}
                    disabled={generatingToken || !deviceName}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
                  >
                    <QrCode size={16} />
                    {generatingToken ? 'Generating...' : 'Generate Setup Token'}
                  </button>
                </div>
              </div>

              {generatedToken && (
                <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 space-y-4 text-center">
                  <div className="inline-block p-4 bg-white text-slate-950 rounded-xl shadow-md">
                    <QRCodeSVG
                      value={JSON.stringify({
                        action: 'ENROLL',
                        token: generatedToken.token,
                        merchantId: generatedToken.merchantId,
                        locationId: generatedToken.locationId,
                        role: generatedToken.deviceRole,
                        mode: generatedToken.merchantMode,
                        endpoint: 'https://api.newgatepos.com/v1/provision',
                        timestamp: Date.now(),
                      })}
                      size={144}
                      level="M"
                      includeMargin={false}
                    />
                    <div className="text-[10px] font-mono font-bold tracking-tight text-slate-700 uppercase mt-2">
                      Scan with Newgate Terminal
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">
                      One-Time Provisioning Code
                    </div>
                    <div className="text-3xl font-mono font-extrabold text-indigo-400 tracking-wider">
                      {generatedToken.token}
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    Open Newgate POS setup on the new terminal. Scan this QR code or type the token above.
                    Expires in 15 minutes.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'DEVICE_LIST' && (
            <div className="space-y-4">
              {loadingDevices ? (
                <div className="text-slate-500 text-sm">Loading provisioned terminals...</div>
              ) : devices.length === 0 ? (
                <div className="text-slate-500 text-sm">No devices enrolled yet.</div>
              ) : (
                <div className="space-y-3">
                  {devices.map((d) => (
                    <div
                      key={d.id}
                      className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2.5 rounded-lg ${d.status === 'ONLINE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                          <Monitor size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-800">{d.name}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                              {d.role}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                              {d.merchantMode}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 space-x-2 mt-0.5">
                            <span>ID: {d.id}</span>
                            <span>•</span>
                            <span>Model: {d.fingerprint.model}</span>
                            <span>•</span>
                            <span>Last heartbeat: {new Date(d.lastHeartbeat).toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                          d.status === 'ONLINE' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          <span className={`w-2 h-2 rounded-full ${d.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                          {d.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'DIAGNOSTICS' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Hardware Self-Test Suite</h4>
                  <p className="text-xs text-slate-500">
                    Verify connectivity to built-in printer, barcode scanner, cash drawer, and customer display
                  </p>
                </div>
                <button
                  onClick={handleRunDiagnostics}
                  disabled={diagnosticsRunning}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={diagnosticsRunning ? 'animate-spin' : ''} />
                  {diagnosticsRunning ? 'Testing...' : 'Run Diagnostics'}
                </button>
              </div>

              {diagnosticResults && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    diagnosticResults.printer.ok
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div>
                      <span className={`text-xs font-bold block ${diagnosticResults.printer.ok ? 'text-emerald-900' : 'text-amber-900'}`}>
                        Thermal Receipt Printer
                      </span>
                      <span className={`text-[11px] ${diagnosticResults.printer.ok ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {diagnosticResults.printer.status}
                      </span>
                    </div>
                    {diagnosticResults.printer.ok ? (
                      <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle size={20} className="text-amber-600 shrink-0" />
                    )}
                  </div>

                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    diagnosticResults.scanner.ok
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div>
                      <span className={`text-xs font-bold block ${diagnosticResults.scanner.ok ? 'text-emerald-900' : 'text-amber-900'}`}>
                        Barcode Scanner (2D Wedge)
                      </span>
                      <span className={`text-[11px] ${diagnosticResults.scanner.ok ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {diagnosticResults.scanner.status}
                      </span>
                    </div>
                    {diagnosticResults.scanner.ok ? (
                      <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle size={20} className="text-amber-600 shrink-0" />
                    )}
                  </div>

                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    diagnosticResults.cashDrawer.ok
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-slate-100 border-slate-200'
                  }`}>
                    <div>
                      <span className={`text-xs font-bold block ${diagnosticResults.cashDrawer.ok ? 'text-emerald-900' : 'text-slate-800'}`}>
                        Cash Drawer Solenoid
                      </span>
                      <span className={`text-[11px] ${diagnosticResults.cashDrawer.ok ? 'text-emerald-700' : 'text-slate-600'}`}>
                        {diagnosticResults.cashDrawer.status}
                      </span>
                    </div>
                    {diagnosticResults.cashDrawer.ok ? (
                      <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle size={20} className="text-slate-400 shrink-0" />
                    )}
                  </div>

                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${
                    diagnosticResults.customerDisplay.ok
                      ? 'bg-emerald-50 border-emerald-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div>
                      <span className={`text-xs font-bold block ${diagnosticResults.customerDisplay.ok ? 'text-emerald-900' : 'text-amber-900'}`}>
                        Customer-Facing Screen (CFD)
                      </span>
                      <span className={`text-[11px] ${diagnosticResults.customerDisplay.ok ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {diagnosticResults.customerDisplay.status}
                      </span>
                    </div>
                    {diagnosticResults.customerDisplay.ok ? (
                      <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                    ) : (
                      <AlertCircle size={20} className="text-amber-600 shrink-0" />
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-lg text-xs transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
