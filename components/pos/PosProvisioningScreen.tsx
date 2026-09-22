import React, { useState, useRef, useEffect } from 'react';
import { Smartphone, QrCode, ArrowRight, ShieldCheck, RefreshCw, KeyRound, CheckCircle2, AlertCircle, Camera, Check } from 'lucide-react';
import { DeviceIdentityService } from '../../services/deviceIdentityService';
import { DeviceRecord, MerchantMode } from '../../types/device';

interface PosProvisioningScreenProps {
  merchantId?: string;
  merchantName?: string;
  merchantMode?: MerchantMode;
  onProvisioned?: (device: DeviceRecord) => void;
  onProvisionComplete?: (device: DeviceRecord) => void;
  onQuickDemoProvision?: () => void;
  onCancel?: () => void;
}

export const PosProvisioningScreen: React.FC<PosProvisioningScreenProps> = ({
  merchantId = 'M001',
  merchantName,
  merchantMode = 'RESTAURANT',
  onProvisioned,
  onProvisionComplete,
  onQuickDemoProvision,
  onCancel,
}) => {
  const isDevOrDemo = DeviceIdentityService.isDevOrDemoMode();
  const [activeTab, setActiveTab] = useState<'CODE' | 'QR'>('CODE');
  const [setupCode, setSetupCode] = useState('');
  const [qrRawInput, setQrRawInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  const notifyComplete = (device: DeviceRecord) => {
    if (onProvisioned) onProvisioned(device);
    if (onProvisionComplete) onProvisionComplete(device);
  };

  const executeProvisionWithToken = async (tokenString: string) => {
    setLoading(true);
    setError(null);
    try {
      const fingerprint = {
        manufacturer: 'Newgate Appliance Hardware',
        model: 'NG-Terminal-Pro-15',
        buildNumber: 'NG-OS-2026.9',
        firmwareVersion: '1.4.2',
        installIdentity: `inst-${Math.random().toString(36).substring(2, 8)}`,
        capabilities: {
          hasBuiltInPrinter: true,
          hasBuiltInScanner: true,
          hasCashDrawerPort: true,
          hasCustomerDisplay: true,
          hasNfcEmv: true,
          screenSizeInches: 15.6,
        },
      };

      const device = await DeviceIdentityService.redeemProvisioningToken(tokenString.trim().toUpperCase(), fingerprint);
      notifyComplete(device);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired setup token. Please check Web Admin.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!setupCode.trim()) return;
    await executeProvisionWithToken(setupCode);
  };

  const handleQrPayloadSubmit = async (payloadStr: string) => {
    if (!payloadStr.trim()) return;
    let extractedToken = payloadStr.trim();
    try {
      if (payloadStr.startsWith('{') && payloadStr.endsWith('}')) {
        const parsed = JSON.parse(payloadStr);
        if (parsed.token) {
          extractedToken = parsed.token;
        }
      }
    } catch {
      // Use raw input if not valid json
    }
    await executeProvisionWithToken(extractedToken);
  };

  // Camera start / stop effect
  useEffect(() => {
    if (activeTab === 'QR' && cameraActive) {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          mediaStreamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((_err) => {
          setCameraActive(false);
        });
    } else {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    }

    return () => {
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop());
        mediaStreamRef.current = null;
      }
    };
  }, [activeTab, cameraActive]);

  const handleAutoEnroll = async () => {
    if (!DeviceIdentityService.isDevOrDemoMode()) {
      setError('Development bypass is disabled in production. Please scan a Setup QR code or enter a Setup Code.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const modeToEnroll: MerchantMode = (merchantMode as MerchantMode) || 'RESTAURANT';
      const dev = await DeviceIdentityService.enrollDefaultDevice(modeToEnroll, merchantId);
      notifyComplete(dev);
    } catch (err: any) {
      setError(err.message || 'Quick enrollment failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-slate-100 select-none">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Terminal Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center mx-auto shadow-lg shadow-indigo-950/50">
            <Smartphone size={32} />
          </div>
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-extrabold">
              NEWGATE ANDROID APPLIANCE
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white mt-1">
              Terminal Setup
            </h1>
            <p className="text-xs text-slate-400">
              Provision this device to bind it securely to your store & location
            </p>
          </div>
        </div>

        {/* Tab switch between Setup Code and QR Code */}
        <div className="grid grid-cols-2 p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('CODE')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'CODE'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound size={15} />
            <span>Setup Code</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('QR')}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
              activeTab === 'QR'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <QrCode size={15} />
            <span>Setup QR</span>
          </button>
        </div>

        {error && (
          <div className="p-3.5 bg-rose-950/50 border border-rose-800 text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Setup Code Tab */}
        {activeTab === 'CODE' && (
          <form onSubmit={handleSubmitCode} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Enter One-Time Setup Code
              </label>
              <input
                type="text"
                value={setupCode}
                onChange={(e) => setSetupCode(e.target.value.toUpperCase())}
                placeholder="e.g. NG-AB3X9Q-1029"
                className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-center text-lg text-white font-bold tracking-widest focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none uppercase placeholder:text-slate-700"
              />
              <p className="text-[11px] text-slate-500 mt-1 text-center">
                Generated in Web Admin under <span className="text-slate-400 font-bold">Devices → Provision New Device</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !setupCode.trim()}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/50 transition-all disabled:opacity-40"
            >
              {loading ? (
                <RefreshCw size={18} className="animate-spin" />
              ) : (
                <>
                  <KeyRound size={18} />
                  <span>Pair & Provision Terminal</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Setup QR Tab */}
        {activeTab === 'QR' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-3">
              <div className="text-xs text-slate-400">
                Hold the device camera or scanner up to the provisioning QR code displayed on the Web Admin portal.
              </div>

              {cameraActive ? (
                <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden border border-slate-800">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-36 h-36 border-2 border-indigo-500 rounded-xl animate-pulse" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setCameraActive(false)}
                    className="absolute top-2 right-2 px-2 py-1 bg-slate-900/80 text-[10px] text-white rounded border border-slate-700 font-bold"
                  >
                    Close Camera
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setCameraActive(true)}
                  className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <Camera size={16} />
                  <span>Start Camera Scanner</span>
                </button>
              )}

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-2 text-[10px] uppercase font-mono text-slate-600">or paste scanned payload</span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              <textarea
                value={qrRawInput}
                onChange={(e) => setQrRawInput(e.target.value)}
                placeholder='Scan QR or paste {"action":"ENROLL","token":"..."}'
                rows={2}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-white focus:border-indigo-500 outline-none placeholder:text-slate-700 resize-none"
              />

              <button
                type="button"
                onClick={() => handleQrPayloadSubmit(qrRawInput)}
                disabled={loading || !qrRawInput.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all disabled:opacity-40"
              >
                {loading ? <RefreshCw size={15} className="animate-spin" /> : <Check size={15} />}
                <span>Redeem Scanned QR</span>
              </button>
            </div>
          </div>
        )}

        {/* Quick Demo Bypass strictly under Dev / Demo Mode Flag */}
        {isDevOrDemo && (
          <div className="pt-4 border-t border-slate-800/80 text-center space-y-2">
            <p className="text-[11px] text-amber-400 font-mono">
              [DEV / DEMO FLAG ONLY] Quick terminal provisioning bypass:
            </p>
            <button
              onClick={handleAutoEnroll}
              disabled={loading}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700/60 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck size={16} className="text-emerald-400" />
              <span>Quick-Enroll DEV-POS-01 ({merchantName || 'Store'} • {merchantMode})</span>
            </button>
          </div>
        )}

        {/* Hardware Status Tag */}
        <div className="text-center">
          <span className="text-[10px] font-mono text-slate-600">
            Runtime: Android Kotlin HAL • Security: Encrypted Attestation
          </span>
        </div>
      </div>
    </div>
  );
};
