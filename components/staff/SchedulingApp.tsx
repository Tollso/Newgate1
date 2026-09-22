import React, { useState } from 'react';
import { Schedule, Employee } from '../../types';
import { Calendar, Plus, RefreshCw, X, Check, Upload } from 'lucide-react';
import { calculateLaborMetrics, getLaborCostTrendNext7Days, parseSchedulesFromCSV } from './schedulingHelpers';
import { SchedulingLaborMetricsPanel } from './scheduling/SchedulingLaborMetricsPanel';
import { ScheduleShiftCard } from './scheduling/ScheduleShiftCard';
import { AddShiftModal } from './scheduling/AddShiftModal';

interface SchedulingAppProps {
  schedules: Schedule[];
  onAddSchedule?: (schedule: Schedule) => void;
  onSyncSchedules?: (schedules: Schedule[]) => void;
  employees?: Employee[];
}

const SchedulingApp: React.FC<SchedulingAppProps> = ({ 
  schedules, 
  onAddSchedule, 
  onSyncSchedules,
  employees = [] 
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [csvError, setCsvError] = useState<string | null>(null);
  const [csvSuccess, setCsvSuccess] = useState<string | null>(null);

  const metrics = calculateLaborMetrics(schedules, employees);
  const trendData = getLaborCostTrendNext7Days(schedules, employees);

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCsvError(null);
    setCsvSuccess(null);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) throw new Error("Could not read file content.");
        
        const parsedSchedules = parseSchedulesFromCSV(text, employees);
        if (parsedSchedules.length === 0) {
          throw new Error("No valid shifts found in the CSV. Make sure headers match: Employee Name, Start Time, End Time.");
        }

        onSyncSchedules?.(parsedSchedules);
        setCsvSuccess(`Successfully imported ${parsedSchedules.length} shifts!`);
        setTimeout(() => setCsvSuccess(null), 4000);
      } catch (err: any) {
        setCsvError(err.message || "An error occurred during CSV parsing.");
      }
    };
    reader.onerror = () => setCsvError("Failed to read file.");
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSync = async () => {
    if (!onSyncSchedules) return;
    setIsSyncing(true);
    setTimeout(() => {
      const externalSchedules: Schedule[] = [
        {
          id: `EXT-${Date.now()}-1`,
          employeeId: 'E-EXT-1',
          employeeName: 'Sarah External',
          shiftStart: '09:00 AM',
          shiftEnd: '05:00 PM',
          role: 'Server',
          source: 'External',
          externalId: '7S-12345'
        },
        {
          id: `EXT-${Date.now()}-2`,
          employeeId: 'E-EXT-2',
          employeeName: 'Mike External',
          shiftStart: '04:00 PM',
          shiftEnd: '10:00 PM',
          role: 'Bartender',
          source: 'External',
          externalId: '7S-67890'
        }
      ];
      onSyncSchedules(externalSchedules);
      setIsSyncing(false);
    }, 1500);
  };

  return (
    <div className="h-full bg-slate-50 flex flex-col animate-fade-in text-slate-800">
      <div className="bg-white border-b border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Calendar className="text-indigo-600" /> Staff Schedule
        </h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {onSyncSchedules && (
            <button 
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors shadow-sm"
            >
              <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Sync External'}
            </button>
          )}
          {onSyncSchedules && (
            <label className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium text-sm transition-colors cursor-pointer shadow-sm">
              <Upload size={16} />
              <span>Import CSV</span>
              <input type="file" accept=".csv" onChange={handleCsvUpload} className="hidden" />
            </label>
          )}
          {onAddSchedule && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold text-sm transition-colors shadow-sm"
            >
              <Plus size={16} />
              New Shift
            </button>
          )}
        </div>
      </div>

      <div className="p-6 overflow-y-auto flex-1">
        {csvError && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 mb-6 flex justify-between items-center text-sm text-rose-700 animate-slide-in">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-rose-600"></span>
              <span>{csvError}</span>
            </div>
            <button onClick={() => setCsvError(null)} className="text-rose-400 hover:text-rose-600">
              <X size={16} />
            </button>
          </div>
        )}
        {csvSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-6 flex justify-between items-center text-sm text-emerald-700 animate-slide-in">
            <div className="flex items-center gap-2">
              <Check size={16} className="text-emerald-600" />
              <span>{csvSuccess}</span>
            </div>
            <button onClick={() => setCsvSuccess(null)} className="text-emerald-400 hover:text-emerald-600">
              <X size={16} />
            </button>
          </div>
        )}

        <SchedulingLaborMetricsPanel metrics={metrics} trendData={trendData} />

        {schedules.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Calendar size={48} className="mx-auto mb-4 opacity-50" />
            <p>No shifts scheduled.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map(shift => (
              <ScheduleShiftCard key={shift.id} shift={shift} employees={employees} />
            ))}
          </div>
        )}
      </div>

      <AddShiftModal 
        employees={employees}
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAddSchedule={onAddSchedule}
      />
    </div>
  );
};

export default SchedulingApp;
