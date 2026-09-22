import React, { useState, useEffect } from 'react';
import {
  Smartphone, QrCode, Monitor, Plus, CheckCircle2, AlertCircle, RefreshCw,
  Trash2, ShieldCheck, ShieldAlert, Cpu, Battery, Wifi, Wrench, Printer, ArrowRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { DeviceIdentityService } from '../../services/deviceIdentityService';
import { DeviceRecord, DeviceRole, MerchantMode, ProvisioningToken } from '../../types/device';

interface DeviceManagementViewProps {
  merchantId?: string;
  merchantMode?: MerchantMode;
  locationId?: string;
  onLaunchPos?: () => void;
}

export const DeviceManagementView: React.FC<DeviceManagementViewProps> = ({
  merchantId = 'M001',
  merchantMode: initialMerchantMode = 'RESTAURANT',
  locationId = 'LOC-1',
  onLaunchPos,
}) => {
  const [devices, setDevices] = useState<DeviceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewModal, setShowNewModal] = useState(false);

  // New device form - bound to merchant account mode
  const [deviceName, setDeviceName] = useState('Front Counter Terminal 1');
  const [deviceRole, setDeviceRole] = useState<DeviceRole>('REGISTER');
  const [merchantMode, setMerchantMode] = useState<MerchantMode>(initialMerchantMode);
  const [generatedToken, setGeneratedToken] = useState<ProvisioningToken | null>(null);
  const [generating, setGenerating] = useState(false);

  // Hardware diagnostics state
  const [diagnosticsRunning, setDiagnosticsRunning] = useState(false);
  const [diagnosticsResult, setDiagnosticsResult] = useState<any | null>(null);

  const isDevOrDemo = DeviceIdentityService.isDevOrDemoMode();

  useEffect(() => {
    if (initialMerchantMode) {
      setMerchantMode(initialMerchantMode);
    }
    loadDevices();
  }, [merchantId, initialMerchantMode]);

  const loadDevices = async () => {
    setLoading(true);
    try {
      const list = await DeviceIdentityService.listDevices(merchantId);
      setDevices(list);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDevQuickEnroll = async () => {
    try {
      await DeviceIdentityService.enrollDefaultDevice(merchantMode, merchantId);
      await loadDevices();
    } catch (e: any) {
      console.error(e);
      alert(e.message || 'Could not seed dev terminal.');
    }
  };

  const handleCreateToken = async () => {
    setGenerating(true);
    try {
      const token = await DeviceIdentityService.generateProvisioningToken({
        merchantId,
        locationId,
        merchantMode,
        deviceRole,
        deviceName,
      });
      setGeneratedToken(token);
      await loadDevices();
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const handleRevokeDevice = async (deviceId: string) => {
    if (!confirm(`Are you sure you want to revoke and disconnect terminal "${deviceId}"? The device will immediately drop session and require re-provisioning.`)) {
      return;
    }
    await DeviceIdentityService.revokeDevice(deviceId, 'ADMIN', 'Admin manual revocation from Web Admin');
    await loadDevices();
  };

  const handleRunDiagnostics = async () => {
    setDiagnosticsRunning(true);
    try {
      const res = await DeviceIdentityService.runHardwareDiagnostics();
      setDiagnosticsResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setDiagnosticsRunning(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-600 font-mono">
            <Smartphone size={16} />
            <span>Appliance Fleet & Device Security</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 mt-1">POS Devices & Provisioning</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage enrolled Android POS terminals, generate setup QR codes, and monitor hardware health
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setGeneratedToken(null);
              setShowNewModal(true);
            }}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
          >
            <Plus size={18} />
            <span>Provision New Device</span>
          </button>

          {onLaunchPos && (
            <button
              onClick={onLaunchPos}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <Monitor size={18} />
              <span>Launch Android POS Terminal</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Fleet Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Total Enrolled Devices</div>
          <div className="text-3xl font-black text-slate-900 mt-1">{devices.length}</div>
          <div className="text-xs text-slate-500 mt-1">Android POS Appliances</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Online Status</div>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            {devices.filter(d => !d.isRevoked && d.status === 'ONLINE').length} / {devices.length}
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Active Heartbeat
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">Security / Attestation</div>
          <div className="text-3xl font-black text-indigo-600 mt-1">Hardware L1</div>
          <div className="text-xs text-slate-500 mt-1">Bound Device Credentials</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-400">App Runtime Version</div>
          <div className="text-3xl font-black text-slate-900 mt-1">2.4.0-apk</div>
          <div className="text-xs text-slate-500 mt-1">Kotlin HAL + Capacitor Bridge</div>
        </div>
      </div>

      {/* Main Devices Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900">
            <Monitor size={18} className="text-slate-500" />
            <span>Provisioned POS Terminals</span>
          </div>
          <button
            onClick={loadDevices}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refresh List"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-3.5">Terminal Name / ID</th>
                <th className="px-6 py-3.5">Device Role</th>
                <th className="px-6 py-3.5">Hardware Model</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Last Heartbeat</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto border border-indigo-100">
                        <Smartphone size={24} />
                      </div>
                      <div className="font-bold text-slate-900 text-base">No POS Terminals Enrolled</div>
                      <p className="text-xs text-slate-500">
                        This store does not have any provisioned POS hardware yet. Use &quot;Provision New Device&quot; to generate a one-time Setup QR or Setup Code for your terminal.
                      </p>
                      <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setGeneratedToken(null);
                            setShowNewModal(true);
                          }}
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-sm"
                        >
                          <Plus size={16} />
                          <span>Generate Setup QR / Code</span>
                        </button>
                        {isDevOrDemo && (
                          <button
                            type="button"
                            onClick={handleDevQuickEnroll}
                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5 border border-slate-300"
                            title="Development only bypass"
                          >
                            <ShieldCheck size={14} className="text-emerald-600" />
                            <span>[Dev Flag] Seed DEV-POS-01</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                devices.map((device) => (
                  <tr key={device.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-900">{device.name}</div>
                      <div className="text-xs font-mono text-slate-400">{device.id}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md text-xs font-bold font-mono">
                        {device.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-800 font-medium">
                        {device.fingerprint?.model || 'Android POS Terminal'}
                      </div>
                      <div className="text-xs text-slate-400">
                        {device.fingerprint?.manufacturer || 'Newgate HAL'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {device.isRevoked ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded-md">
                          <AlertCircle size={14} /> Revoked
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-md">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" /> Online
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-500">
                      {new Date(device.lastHeartbeat).toLocaleTimeString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {!device.isRevoked && (
                        <button
                          onClick={() => handleRevokeDevice(device.id)}
                          className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 size={14} />
                          <span>Revoke</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Peripheral Diagnostics & Station Connectivity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900">Hardware & Peripheral Testing</h2>
            <p className="text-xs text-slate-500">
              Query integrated thermal receipt printers, 24V solenoid kick circuits, and 2D barcode scanners
            </p>
          </div>
          <button
            onClick={handleRunDiagnostics}
            disabled={diagnosticsRunning}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
          >
            <Wrench size={16} className={diagnosticsRunning ? 'animate-spin' : ''} />
            <span>{diagnosticsRunning ? 'Running Self-Test...' : 'Run Diagnostics'}</span>
          </button>
        </div>

        {diagnosticsResult && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
                <span>Thermal ESC/POS</span>
                {diagnosticsResult.printer.ok ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <AlertCircle size={16} className="text-amber-500" />
                )}
              </div>
              <div className="text-xs font-medium text-slate-800">{diagnosticsResult.printer.status}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
                <span>Cash Drawer Solenoid</span>
                {diagnosticsResult.cashDrawer.ok ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <AlertCircle size={16} className="text-amber-500" />
                )}
              </div>
              <div className="text-xs font-medium text-slate-800">{diagnosticsResult.cashDrawer.status}</div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="text-xs font-bold text-slate-500 flex items-center justify-between">
                <span>Card Terminal / EMV</span>
                {diagnosticsResult.cardReader.ok ? (
                  <CheckCircle2 size={16} className="text-emerald-500" />
                ) : (
                  <AlertCircle size={16} className="text-amber-500" />
                )}
              </div>
              <div className="text-xs font-medium text-slate-800">{diagnosticsResult.cardReader.status}</div>
            </div>
          </div>
        )}
      </div>

      {/* Provision New Device Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono uppercase text-indigo-400 font-bold">One-Time Setup Credential</div>
                <h3 className="text-xl font-black">Provision POS Appliance</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {!generatedToken ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Terminal Name / Station
                    </label>
                    <input
                      type="text"
                      value={deviceName}
                      onChange={(e) => setDeviceName(e.target.value)}
                      placeholder="e.g. Front Register 2, Patio Bar POS"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Device Role
                      </label>
                      <select
                        value={deviceRole}
                        onChange={(e) => setDeviceRole(e.target.value as DeviceRole)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="REGISTER">Full Register</option>
                        <option value="TABLESIDE">Tableside Tablet</option>
                        <option value="KDS">Kitchen Display (KDS)</option>
                        <option value="KIOSK">Self-Order Kiosk</option>
                        <option value="DONATION_KIOSK">Giving Kiosk</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Operating Mode
                      </label>
                      <select
                        value={merchantMode}
                        onChange={(e) => setMerchantMode(e.target.value as MerchantMode)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
                      >
                        <option value="RESTAURANT">Restaurant & Bar</option>
                        <option value="RETAIL">Retail Store</option>
                        <option value="NONPROFIT">Nonprofit / Giving</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateToken}
                    disabled={generating}
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50"
                  >
                    <QrCode size={18} />
                    <span>{generating ? 'Generating Setup Token...' : 'Generate Setup Code & QR'}</span>
                  </button>
                </>
              ) : (
                <div className="text-center space-y-4 py-2">
                  <div className="inline-block p-4 bg-white rounded-2xl border-2 border-dashed border-indigo-300 shadow-inner">
                    <QRCodeSVG
                      value={JSON.stringify({
                        token: generatedToken.token,
                        merchantId: generatedToken.merchantId,
                        locationId: generatedToken.locationId,
                        role: generatedToken.deviceRole,
                      })}
                      size={180}
                      level="H"
                    />
                  </div>

                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Terminal Setup Code
                    </div>
                    <div className="text-2xl font-black font-mono text-indigo-600 tracking-wider mt-0.5">
                      {generatedToken.token}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Scan this QR code or enter this token on the Android POS terminal setup screen.
                      Token expires in 15 minutes.
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={() => setShowNewModal(false)}
                      className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition-colors"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
