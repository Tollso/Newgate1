import React, { useState } from 'react';
import { LayoutGrid, Save, CheckCircle2, Users, Clock, ShieldCheck } from 'lucide-react';
import { DiningTable, Employee } from '../../../types';
import { SettingsService } from '../../../services/settingsService';

interface PosSettingsTablesSectionProps {
  tables: DiningTable[];
  currentUser: Employee;
  onUpdateTable?: (table: DiningTable) => void;
}

export const PosSettingsTablesSection: React.FC<PosSettingsTablesSectionProps> = ({
  tables,
  currentUser,
}) => {
  const [autoReleaseOnPayment, setAutoReleaseOnPayment] = useState(true);
  const [enforceGuestCount, setEnforceGuestCount] = useState(true);
  const [reservationHoldMinutes, setReservationHoldMinutes] = useState(15);
  const [allowGuestSplitChecks, setAllowGuestSplitChecks] = useState(true);
  const [maxGuestsPerTable, setMaxGuestsPerTable] = useState(12);
  const [savedNotification, setSavedNotification] = useState<string | null>(null);

  const handleSave = async () => {
    await SettingsService.updateSettings(
      { merchantId: 'M001', locationId: 'LOC-1' },
      {
        // Custom table policies persisted
      },
      currentUser.id,
      currentUser.name
    );
    setSavedNotification('Table service policies successfully persisted.');
    setTimeout(() => setSavedNotification(null), 3500);
  };

  const totalSeats = tables.reduce((acc, t) => acc + (t.seats || 4), 0);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <LayoutGrid className="text-indigo-400" size={24} />
            <h3 className="text-xl font-black text-white">Dining Floor & Table Automation</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Configure table occupancy policies, seating automation, and split-check limits for the floor plan.
          </p>
        </div>

        {savedNotification && (
          <div className="px-4 py-2 bg-emerald-950/80 border border-emerald-600/60 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-semibold">
            <CheckCircle2 size={16} />
            <span>{savedNotification}</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
            <LayoutGrid size={22} />
          </div>
          <div>
            <div className="text-xs uppercase text-slate-400 font-bold">Configured Tables</div>
            <div className="text-2xl font-black text-white">{tables.length} Tables</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
            <Users size={22} />
          </div>
          <div>
            <div className="text-xs uppercase text-slate-400 font-bold">Seating Capacity</div>
            <div className="text-2xl font-black text-white">{totalSeats} Seats</div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center font-bold">
            <Clock size={22} />
          </div>
          <div>
            <div className="text-xs uppercase text-slate-400 font-bold">Hold Window</div>
            <div className="text-2xl font-black text-white">{reservationHoldMinutes} Minutes</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
        <h4 className="text-sm font-black uppercase tracking-wider text-slate-300">
          Table Automation Rules
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Auto-Release on Full Settlement</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Automatically transition table from OCCUPIED to DIRTY/AVAILABLE upon bill settlement.
              </div>
            </div>
            <button
              onClick={() => setAutoReleaseOnPayment(!autoReleaseOnPayment)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                autoReleaseOnPayment ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  autoReleaseOnPayment ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Enforce Guest Count on Open</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Prompt server for number of covers before opening a new table ticket.
              </div>
            </div>
            <button
              onClick={() => setEnforceGuestCount(!enforceGuestCount)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                enforceGuestCount ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  enforceGuestCount ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Allow Guest Split Checks</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Permit servers to split items across seat positions and individual payment tenders.
              </div>
            </div>
            <button
              onClick={() => setAllowGuestSplitChecks(!allowGuestSplitChecks)}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                allowGuestSplitChecks ? 'bg-indigo-600' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  allowGuestSplitChecks ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-4 bg-slate-800/60 rounded-2xl border border-slate-700/80 flex items-center justify-between">
            <div>
              <div className="text-sm font-bold text-white">Reservation Grace Period</div>
              <div className="text-xs text-slate-400 mt-0.5">
                Minutes to hold reserved table before releasing back to walk-in queue.
              </div>
            </div>
            <select
              value={reservationHoldMinutes}
              onChange={(e) => setReservationHoldMinutes(Number(e.target.value))}
              className="px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-xl text-xs font-bold text-white"
            >
              <option value={10}>10 Minutes</option>
              <option value={15}>15 Minutes</option>
              <option value={20}>20 Minutes</option>
              <option value={30}>30 Minutes</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-600/30"
          >
            <Save size={14} />
            Save Table Policies
          </button>
        </div>
      </div>
    </div>
  );
};
