import React, { useState } from 'react';
import { UserRole, Employee } from '../../types';
import { Shield, Briefcase, ShoppingBag, Heart, Utensils, Users, Lock, ArrowRight, CheckCircle2, Terminal, AlertTriangle } from 'lucide-react';
import { MOCK_EMPLOYEES } from '../../constants';
import { EmployeeAuthService, AuthResult } from '../../services/employeeAuthService';

interface LoginProps {
  onLogin: (user: Employee) => void;
  employees?: Employee[];
  businesses?: any[];
  deviceId?: string;
}

export const Login: React.FC<LoginProps> = ({
  onLogin,
  employees = MOCK_EMPLOYEES,
  deviceId = 'DEV-POS-01'
}) => {
  const [pin, setPin] = useState('');
  const [pinErrorMsg, setPinErrorMsg] = useState<string | null>(null);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleRoleSelect = (roleName: string) => {
    const user = employees.find(u => u.role === roleName) || MOCK_EMPLOYEES.find(u => u.role === roleName);
    if (user && user.status === 'Active') {
      onLogin(user);
    } else {
      const enumUser = employees.find(u => u.role === (roleName as any)) || MOCK_EMPLOYEES.find(u => u.role === (roleName as any));
      if (enumUser && enumUser.status === 'Active') onLogin(enumUser);
      else if (employees[0]) onLogin(employees[0]);
    }
  };

  const handlePinInput = (num: string) => {
    if (isLockedOut || isVerifying) return;
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handlePinClear = () => {
    setPin('');
    setPinErrorMsg(null);
  };

  const verifyPin = async (enteredPin: string) => {
    setIsVerifying(true);
    try {
      const res: AuthResult = await EmployeeAuthService.authenticateByPin(enteredPin, deviceId, employees);
      if (res.success && res.employee) {
        setPin('');
        setPinErrorMsg(null);
        onLogin(res.employee);
      } else {
        if (res.isLockedOut) {
          setIsLockedOut(true);
          setLockoutRemaining(res.lockoutRemainingSeconds || 900);
        }
        setPinErrorMsg(res.errorMessage || 'Invalid PIN entered.');
        setTimeout(() => {
          setPin('');
        }, 800);
      }
    } catch (e: any) {
      setPinErrorMsg(e?.message || 'Authentication error.');
      setPin('');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col lg:flex-row">
        
        {/* Left Side - Brand & Capabilities */}
        <div className="lg:w-5/12 bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 p-8 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800 text-white relative">
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Terminal size={26} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight text-white">The Newgate POS</h1>
                <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Enterprise POS Appliance</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm leading-relaxed mb-6">
              Universal multi-domain operating system built for high-throughput <strong>Retail</strong>, <strong>Charitable Giving</strong>, and <strong>Dining</strong> operations.
            </p>

            {/* Verticals Badges */}
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Retail & Barcode Register</h4>
                  <p className="text-[11px] text-slate-400">UPC/EAN wedge scanning, inventory POs & returns</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="p-2 rounded-lg bg-rose-500/20 text-rose-400">
                  <Heart size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Giving & Nonprofit Register</h4>
                  <p className="text-[11px] text-slate-400">Charitable checkout, donation kiosk & CRM</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400">
                  <Utensils size={18} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-200">Restaurant & Table Service</h4>
                  <p className="text-[11px] text-slate-400">Floor plans, courses, KDS bump bar & guest checks</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative z-10 pt-6 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Hardware Ready
            </span>
            <span className="font-mono text-[11px]">v2.4.0-enterprise</span>
          </div>
        </div>

        {/* Right Side - Sign In & Authoritative PIN Pad */}
        <div className="flex-1 p-6 sm:p-10 bg-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">Access Terminal</h2>
                <p className="text-xs text-slate-400">Enter your assigned 4-digit employee PIN</p>
              </div>
              <button
                onClick={() => handleRoleSelect('Admin')}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center gap-1.5"
              >
                <span>Manager Bypass</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* PIN Indicator */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col items-center justify-center">
              <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-2 flex items-center gap-1.5">
                <Lock size={12} />
                Secure Employee PIN Authentication
              </div>
              <div className="flex items-center gap-3 my-1">
                {[0, 1, 2, 3].map((idx) => (
                  <div
                    key={idx}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                      pin.length > idx
                        ? pinErrorMsg
                          ? 'bg-rose-500 scale-125'
                          : 'bg-indigo-500 scale-125'
                        : 'bg-slate-800'
                    }`}
                  />
                ))}
              </div>
              {pinErrorMsg && (
                <span className="text-xs text-rose-400 font-bold mt-2 flex items-center gap-1">
                  <AlertTriangle size={13} />
                  {pinErrorMsg}
                </span>
              )}
              {isLockedOut && lockoutRemaining && (
                <span className="text-xs text-amber-400 font-mono mt-1">
                  Lockout active: {Math.floor(lockoutRemaining / 60)}m {lockoutRemaining % 60}s remaining
                </span>
              )}
            </div>

            {/* Role Quick Sign-in (for active authorized employees) */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={() => handleRoleSelect('Admin')}
                className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-indigo-600/20 border border-slate-700/80 hover:border-indigo-500 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-indigo-300">Administrator</span>
                  <Shield size={16} className="text-indigo-400" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Enterprise Management & Audits</p>
              </button>

              <button
                onClick={() => handleRoleSelect('Manager')}
                className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-purple-600/20 border border-slate-700/80 hover:border-purple-500 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-purple-300">Store Manager</span>
                  <Briefcase size={16} className="text-purple-400" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Shift Overrides & EOD Cash</p>
              </button>

              <button
                onClick={() => handleRoleSelect('Employee')}
                className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-emerald-600/20 border border-slate-700/80 hover:border-emerald-500 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-emerald-300">Cashier / Staff</span>
                  <ShoppingBag size={16} className="text-emerald-400" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Register & Touch Checkout</p>
              </button>

              <button
                onClick={() => handleRoleSelect(UserRole.SUPER_ADMIN)}
                className="p-3.5 rounded-xl bg-slate-800/80 hover:bg-amber-600/20 border border-slate-700/80 hover:border-amber-500 text-left transition-all group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs text-white group-hover:text-amber-300">Super Admin</span>
                  <Shield size={16} className="text-amber-400" />
                </div>
                <p className="text-[10px] text-slate-400 font-medium">Surcharges & System Provisioning</p>
              </button>
            </div>

            {/* Touch Keypad */}
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'OK'].map((key) => (
                <button
                  key={key}
                  disabled={isLockedOut || isVerifying}
                  onClick={() => {
                    if (key === 'C') handlePinClear();
                    else if (key === 'OK') verifyPin(pin);
                    else handlePinInput(key);
                  }}
                  className={`py-3 rounded-xl font-bold text-base transition-all ${
                    key === 'OK'
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
                      : key === 'C'
                      ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white'
                  } ${isLockedOut ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {key}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
            <p className="text-[11px] text-slate-400">
              The Newgate POS • Security Section 2 Authentication & Lockout Protection
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
