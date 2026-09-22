import React from 'react';
import { 
  Grid, Coffee, ClipboardList, DollarSign, RotateCcw, Package, 
  LayoutGrid, User, Clock, Calendar, ChefHat, Barcode, Eye, CreditCard,
  MonitorSmartphone, Gift
} from 'lucide-react';
import { Employee, UserRole } from '../../types';
import { PermissionService } from '../../services/permissionService';

import FloorPlanDesignerApp from '../dining/FloorPlanDesignerApp';

export type PosAppType = 'LAUNCHER' | 'REGISTER' | 'TABLE_SERVICE' | 'ORDERS' | 'TIPS' | 'REFUNDS' | 'CUSTOMERS' | 'INVENTORY_SCANNER' | 'RESERVATIONS' | 'SCHEDULING' | 'KITCHEN' | 'EXPEDITOR' | 'CLOSEOUT' | 'FLOOR_PLANNER' | 'KIOSK' | 'GIFT_CARDS';

const LAUNCHER_APP_PERMISSIONS: Record<PosAppType, string> = {
    LAUNCHER: '',
    REGISTER: 'pos.register.access',
    KIOSK: 'pos.kiosk.access',
    TABLE_SERVICE: 'pos.tables.access',
    FLOOR_PLANNER: 'pos.tables.access',
    KITCHEN: 'pos.kds.access',
    EXPEDITOR: 'pos.kds.access',
    RESERVATIONS: 'pos.reservations.access',
    CLOSEOUT: 'pos.closeout.access',
    ORDERS: 'pos.orders.access',
    INVENTORY_SCANNER: 'pos.inventory.access',
    SCHEDULING: 'pos.shifts.access',
    CUSTOMERS: 'pos.customers.access',
    TIPS: 'pos.tips.adjust',
    REFUNDS: 'pos.refunds.access',
    GIFT_CARDS: 'pos.register.access',
};

interface PosLauncherProps {
    user: Employee;
    onAppSelect: (app: PosAppType) => void;
}

const PosLauncher: React.FC<PosLauncherProps> = ({ user, onAppSelect }) => {
    const POSAppIcon = ({ title, id, icon, gradient, onClick, isNew }: { title: string, id: PosAppType, icon: React.ReactNode, gradient: string, onClick: () => void, isNew?: boolean }) => {
        const requiredPerm = LAUNCHER_APP_PERMISSIONS[id];
        const allowed = !requiredPerm || PermissionService.can(user, requiredPerm);

        if (!allowed) return null;

        return (
            <button 
                onClick={onClick}
                className="flex flex-col items-center gap-4 group w-full outline-none"
            >
                <div className="relative">
                    {isNew && (
                        <div className="absolute -top-2 -right-2 bg-emerald-500 text-[8px] text-white px-2 py-1 rounded-full font-black shadow-sm z-10 border-2 border-slate-50">
                            NEW
                        </div>
                    )}
                    <div className={`h-24 w-24 rounded-[2rem] bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-xl shadow-slate-200 group-hover:shadow-2xl group-hover:shadow-slate-300 group-hover:-translate-y-2 group-active:scale-95 group-active:translate-y-0 transition-all duration-300 ease-out`}>
                        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { size: 40 }) : icon}
                    </div>
                </div>
                <span className="font-bold text-slate-600 text-xs tracking-widest uppercase group-hover:text-indigo-600 transition-colors text-center">{title}</span>
            </button>
        );
    };

    return (
        <div className="p-12 h-full overflow-y-auto bg-slate-50 flex flex-col items-center justify-center">
            <div className="text-center mb-16">
                <p className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-3">Enterprise Terminal</p>
                <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase">OmniCommand Hub</h2>
                <div className="h-1 w-24 bg-indigo-600 mx-auto mt-6 rounded-full"></div>
            </div>
            <div className="max-w-6xl w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-y-12 gap-x-8 animate-fade-in pb-20">
                <POSAppIcon id="REGISTER" title="Register" icon={<CreditCard />} gradient="from-indigo-600 to-indigo-800" onClick={() => onAppSelect('REGISTER')} />
                <POSAppIcon id="KIOSK" title="Self Kiosk" icon={<MonitorSmartphone />} gradient="from-violet-500 to-violet-700" onClick={() => onAppSelect('KIOSK')} isNew />
                <POSAppIcon id="TABLE_SERVICE" title="Dining" icon={<Coffee />} gradient="from-orange-500 to-orange-600" onClick={() => onAppSelect('TABLE_SERVICE')} />
                <POSAppIcon id="FLOOR_PLANNER" title="Designer" icon={<LayoutGrid />} gradient="from-pink-500 to-rose-600" onClick={() => onAppSelect('FLOOR_PLANNER')} isNew />
                <POSAppIcon id="KITCHEN" title="KDS" icon={<ChefHat />} gradient="from-slate-700 to-slate-900" onClick={() => onAppSelect('KITCHEN')} />
                <POSAppIcon id="EXPEDITOR" title="Expo" icon={<Eye />} gradient="from-cyan-500 to-cyan-600" onClick={() => onAppSelect('EXPEDITOR')} isNew />
                <POSAppIcon id="RESERVATIONS" title="Guest Manager" icon={<Calendar />} gradient="from-rose-500 to-rose-600" onClick={() => onAppSelect('RESERVATIONS')} />
                <POSAppIcon id="CLOSEOUT" title="Shift End" icon={<DollarSign />} gradient="from-emerald-600 to-emerald-800" onClick={() => onAppSelect('CLOSEOUT')} isNew />
                <POSAppIcon id="ORDERS" title="History" icon={<ClipboardList />} gradient="from-slate-400 to-slate-500" onClick={() => onAppSelect('ORDERS')} />
                <POSAppIcon id="INVENTORY_SCANNER" title="Scanner" icon={<Barcode />} gradient="from-amber-500 to-amber-600" onClick={() => onAppSelect('INVENTORY_SCANNER')} isNew />
                <POSAppIcon id="SCHEDULING" title="Staff" icon={<Clock />} gradient="from-blue-400 to-blue-500" onClick={() => onAppSelect('SCHEDULING')} />
                <POSAppIcon id="CUSTOMERS" title="Loyalty" icon={<User />} gradient="from-purple-600 to-purple-800" onClick={() => onAppSelect('CUSTOMERS')} />
                <POSAppIcon id="GIFT_CARDS" title="Gift Cards" icon={<Gift />} gradient="from-fuchsia-500 to-pink-600" onClick={() => onAppSelect('GIFT_CARDS')} isNew />
            </div>
        </div>
    );
};

export default PosLauncher;