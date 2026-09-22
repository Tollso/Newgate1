import React from 'react';
import { Schedule, Employee } from '../../../types';
import { Clock, MapPin, Globe } from 'lucide-react';
import { getShiftDurationInHours, getHourlyRateForShift } from '../schedulingHelpers';

interface ScheduleShiftCardProps {
  shift: Schedule;
  employees: Employee[];
}

export const ScheduleShiftCard: React.FC<ScheduleShiftCardProps> = ({ shift, employees }) => {
  const shiftHours = getShiftDurationInHours(shift.shiftStart, shift.shiftEnd);
  const shiftRate = getHourlyRateForShift(shift, employees);
  const shiftCost = shiftHours * shiftRate;

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className={`h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg ${
          shift.source === 'External' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
        }`}>
          {shift.employeeName.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900">{shift.employeeName}</h3>
            {shift.source === 'External' && (
              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded flex items-center gap-1">
                <Globe size={10} /> Synced
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">{shift.role}</p>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>{shiftHours.toFixed(1)} hrs</span>
            <span>•</span>
            <span>${shiftRate.toFixed(2)}/hr</span>
            <span>•</span>
            <span className="font-semibold text-indigo-600">Cost: ${shiftCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
          <Clock size={14} /> {shift.shiftStart} - {shift.shiftEnd}
        </div>
        {shift.assignedSection && (
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <MapPin size={12} /> {shift.assignedSection}
          </div>
        )}
      </div>
    </div>
  );
};
