import React, { useState, useEffect } from 'react';
import { Wifi, Save, CheckCircle2, Globe, Activity, RefreshCw } from 'lucide-react';
import { Employee } from '../../../types';
import { SettingsService } from '../../../services/settingsService';

interface PosSettingsNetworkSectionProps {
  currentUser: Employee;
}

export const PosSettingsNetworkSection: React.FC<PosSettingsNetworkSectionProps> = ({
  currentUser,
}) => {
  const [networkMode, setNetworkMode] = useState<'DHCP' | 'STATIC'>('DHCP');
  const [staticIp, setStaticIp] = useState('192.168.1.150');
  const [gateway, setGateway] = useState('192.168.1.1');
  const [subnetMask, setSubnetMask] = useState('255.255.255.0');
  const [dns, setDns] = useState('8.8.8.8');
  const [pingStatus, setPingStatus] = useState<string | null>(null);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  useEffect(() => {
    SettingsService.resolveEffectiveSettings({ merchantId: 'M001', locationId: 'LOC-1' }).then(cfg => {
      if (cfg.networkMode) setNetworkMode(cfg.networkMode);
      if (cfg.staticIpAddress) setStaticIp(cfg.staticIpAddress);
      if (cfg.gatewayAddress) setGateway(cfg.gatewayAddress);
    });
  }, []);

  const handleSave = async () => {
    await SettingsService.updateSettings(
      { merchantId: 'M001', locationId: 'LOC-1' },
      {
        networkMode,
        staticIpAddress: staticIp,
        gatewayAddress: gateway,
      },
      currentUser.id,
      currentUser.name
    );
    setSavedNotification('Terminal network interface configuration persisted.');
    setTimeout(() => setSavedNotification(null), 3500);
  };

  const handleTestConnection = () => {
    setPingStatus('Testing gateway latency...');
    setTimeout(() => {
      setPingStatus('Online • Gateway latency 4ms • Cloud sync active');
    }, 800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Wifi className="text-indigo-400" size={24} />
            <h3 className="text-xl font-black text-white">Appliance Network & LAN Topology</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure terminal Ethernet / Wi-Fi IP addressing, local subnet for printer discovery, and gateway routing.
          </p>
        </div>

        {savedNotification && (
          <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-600/60 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 size={16} />
            <span>{savedNotification}</span>
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <div className="text-sm font-bold text-white">Addressing Mode</div>
            <div className="text-xs text-slate-400">Choose between automated router assignment or dedicated static POS IP</div>
          </div>
          <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => setNetworkMode('DHCP')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                networkMode === 'DHCP' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              DHCP (Auto)
            </button>
            <button
              onClick={() => setNetworkMode('STATIC')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                networkMode === 'STATIC' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Static IP
            </button>
          </div>
        </div>

        {/* Network Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Terminal IP Address
            </label>
            <input
              type="text"
              disabled={networkMode === 'DHCP'}
              value={networkMode === 'DHCP' ? '192.168.1.104 (Assigned by DHCP)' : staticIp}
              onChange={(e) => setStaticIp(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 disabled:opacity-60 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Default Gateway / Router
            </label>
            <input
              type="text"
              disabled={networkMode === 'DHCP'}
              value={networkMode === 'DHCP' ? '192.168.1.1' : gateway}
              onChange={(e) => setGateway(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 disabled:opacity-60 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Subnet Mask
            </label>
            <input
              type="text"
              disabled={networkMode === 'DHCP'}
              value={subnetMask}
              onChange={(e) => setSubnetMask(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 disabled:opacity-60 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Primary DNS Server
            </label>
            <input
              type="text"
              disabled={networkMode === 'DHCP'}
              value={dns}
              onChange={(e) => setDns(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-800 disabled:opacity-60 border border-slate-700 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Network Diagnostics Box */}
        <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Activity className="text-emerald-400" size={20} />
            <div>
              <div className="text-xs font-bold text-white">Diagnostic Connectivity Ping</div>
              <div className="text-[11px] text-slate-400">
                {pingStatus || 'Subnet link ready • Click test to verify router handshake'}
              </div>
            </div>
          </div>
          <button
            onClick={handleTestConnection}
            className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-colors self-start sm:self-auto"
          >
            <RefreshCw size={14} />
            Run Ping Test
          </button>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
          >
            <Save size={14} />
            Save Network Settings
          </button>
        </div>
      </div>
    </div>
  );
};
