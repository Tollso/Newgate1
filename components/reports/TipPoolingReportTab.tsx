import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { TipPoolingConfig } from '../settings/operations/TipPoolingConfig';
import { TipPoolingReportTabProps, PayrollDay, ShiftEmployee, EmployeeDetail } from './tippooling/TipPoolingTypes';
import { TipPoolingDailyShiftView } from './tippooling/TipPoolingDailyShiftView';
import { TipPoolingEmployeeDrawer } from './tippooling/TipPoolingEmployeeDrawer';
import { TipPoolingPayrollView } from './tippooling/TipPoolingPayrollView';

export const TipPoolingReportTab: React.FC<TipPoolingReportTabProps> = () => {
  const [activeSubTab, setActiveSubTab] = useState<'daily' | 'payroll' | 'policy'>('daily');
  const [selectedShift, setSelectedShift] = useState<'Lunch' | 'Dinner'>('Lunch');
  const [organizeBy, setOrganizeBy] = useState('Tips by Employee');
  const [isApproved, setIsApproved] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetail | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [payrollDays, setPayrollDays] = useState<PayrollDay[]>([
    { id: '1', date: '03/25/25 - Tuesday', employees: 8, total: 839.56, status: 'SENT TO PAYROLL', sentDate: '04/01/25' },
    { id: '2', date: '03/26/25 - Wednesday', employees: 10, total: 954.12, status: 'SENT TO PAYROLL', sentDate: '04/01/25' },
    { id: '3', date: '03/27/25 - Thursday', employees: 11, total: 1201.25, status: 'SENT TO PAYROLL', sentDate: '04/01/25' },
    { id: '4', date: '03/28/25 - Friday', employees: 12, total: 2173.53, status: 'SENT TO PAYROLL', sentDate: '04/01/25' },
    { id: '5', date: '03/29/25 - Saturday', employees: 14, total: 2461.19, status: 'SENT TO PAYROLL', sentDate: '04/01/25' },
    { id: '6', date: '03/30/25 - Sunday', employees: 9, total: 970.09, status: 'READY' },
    { id: '7', date: '03/31/25 - Monday', employees: 8, total: 742.85, status: 'READY' },
    { id: '8', date: '04/01/25 - Tuesday', employees: 1, total: 92.09, status: 'IN PROGRESS' }
  ]);

  const employeesLunch: ShiftEmployee[] = [
    { id: '1', name: 'AM BAR', job: 'Bartender', hours: 8.91, before: 175.00, after: 140.83 },
    { id: '2', name: 'Barry Busser', job: 'Busser', hours: 4.25, before: 0.00, after: 80.75 },
    { id: '3', name: 'Justin Tyme', job: 'Cook', hours: 10.55, before: 0.00, after: 166.38 },
    { id: '4', name: 'Lee VaTip', job: 'Cook', hours: 9.39, before: 0.00, after: 148.09 },
    { id: '5', name: 'Helen Hostington', job: 'Host', hours: 7.00, before: 0.00, after: 120.64 },
    { id: '6', name: 'Harry Hostington', job: 'Host', hours: 8.00, before: 0.00, after: 137.88 },
    { id: '7', name: 'Online Ordering', job: 'Online Ordering', hours: 0.00, before: 774.50, after: 0.00 },
    { id: '8', name: 'Chris P. Bacon', job: 'Runner', hours: 9.92, before: 0.00, after: 175.66 },
    { id: '9', name: 'Ben Smith', job: 'Server', hours: 7.00, before: 430.00, after: 409.28 },
  ];

  const employeesDinner: ShiftEmployee[] = [
    { id: '1', name: 'PM BAR', job: 'Bartender', hours: 7.50, before: 210.00, after: 185.20 },
    { id: '2', name: 'Barry Busser', job: 'Busser', hours: 5.00, before: 0.00, after: 95.00 },
    { id: '3', name: 'Justin Tyme', job: 'Cook', hours: 8.00, before: 0.00, after: 128.00 },
    { id: '4', name: 'Lee VaTip', job: 'Cook', hours: 8.00, before: 0.00, after: 128.00 },
    { id: '5', name: 'Helen Hostington', job: 'Host', hours: 6.00, before: 0.00, after: 102.00 },
    { id: '8', name: 'Chris P. Bacon', job: 'Runner', hours: 7.50, before: 0.00, after: 135.00 },
    { id: '9', name: 'Ben Smith', job: 'Server', hours: 8.00, before: 520.00, after: 485.40 },
  ];

  const activeEmployees = selectedShift === 'Lunch' ? employeesLunch : employeesDinner;
  const activePoolAmount = selectedShift === 'Lunch' ? 1379.51 : 1273.60;
  const activePeriod = selectedShift === 'Lunch' ? '4:00 am - 4:00 pm' : '4:00 pm - 4:00 am';

  const getEmployeeDetails = (empName: string): EmployeeDetail => {
    if (empName === 'Ben Smith') {
      return {
        name: empName, job: 'Server',
        collected: { cash: 50.00, nonCash: 380.00, total: 430.00, cashGrat: 0.00, nonCashGrat: 0.00, totalGrat: 0.00 },
        sales: { liquor: 164.00, food: 1580.24, total: 1744.24 },
        contributions: {
          total: 20.72,
          breakdown: [
            { category: 'Food', sales: 1580.24, rate: 1, amount: 15.80 },
            { category: 'Liquor', sales: 164.00, rate: 3, amount: 4.92 }
          ]
        },
        earnings: { cash: 50.00, nonCash: 359.28, cashGrat: 0.00, nonCashGrat: 0.00, total: 409.28 }
      };
    } else if (empName === 'AM BAR') {
      return {
        name: 'AM BAR', job: 'Bartender',
        collected: { cash: 30.00, nonCash: 145.00, total: 175.00, cashGrat: 0.00, nonCashGrat: 0.00, totalGrat: 0.00 },
        sales: { liquor: 480.00, food: 210.00, total: 690.00 },
        contributions: {
          total: 34.17,
          breakdown: [
            { category: 'Liquor', sales: 480.00, rate: 5, amount: 24.00 },
            { category: 'Food', sales: 210.00, rate: 3, amount: 10.17 }
          ]
        },
        earnings: { cash: 30.00, nonCash: 110.83, cashGrat: 0.00, nonCashGrat: 0.00, total: 140.83 }
      };
    }
    const poolShare = activeEmployees.find(e => e.name === empName)?.after || 0;
    return {
      name: empName, job: activeEmployees.find(e => e.name === empName)?.job || 'Support',
      collected: { cash: 0.00, nonCash: 0.00, total: 0.00, cashGrat: 0.00, nonCashGrat: 0.00, totalGrat: 0.00 },
      sales: { liquor: 0.00, food: 0.00, total: 0.00 },
      contributions: { total: 0.00, breakdown: [] },
      earnings: { cash: 0.00, nonCash: poolShare, cashGrat: 0.00, nonCashGrat: 0.00, total: poolShare }
    };
  };

  const triggerToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const handleSendToPayroll = () => {
    let count = 0;
    const updated = payrollDays.map(day => {
      if (day.status === 'READY') {
        count++;
        return { ...day, status: 'SENT TO PAYROLL', sentDate: '04/01/25' };
      }
      return day;
    });
    if (count > 0) {
      setPayrollDays(updated);
      triggerToast(`Successfully sent ${count} shifts' tips and gratuities to payroll!`);
    } else {
      alert("No additional shifts are in 'READY' state to send to payroll.");
    }
  };

  const handleSendIndividual = (id: string, date: string) => {
    const updated = payrollDays.map(day => (day.id === id ? { ...day, status: 'SENT TO PAYROLL', sentDate: '04/01/25' } : day));
    setPayrollDays(updated);
    triggerToast(`Tips for ${date} successfully sent to payroll!`);
  };

  return (
    <div className="space-y-6">
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 text-white rounded-2xl shadow-xl flex items-center gap-3 font-bold text-xs uppercase tracking-wider animate-bounce">
          <CheckCircle2 size={18} /> {successToast}
        </div>
      )}

      {/* Top Navigation Mode Toggles */}
      <div className="flex border border-slate-200 bg-white p-1 rounded-xl shadow-sm max-w-lg shrink-0">
        {(['daily', 'payroll', 'policy'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveSubTab(tab)}
            className={`flex-1 py-2 text-xs font-black uppercase tracking-wider rounded-lg transition-all ${
              activeSubTab === tab ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'daily' ? 'Daily Shift Approval' : tab === 'payroll' ? 'Tips Management (Payroll)' : 'Tip Pooling Policy'}
          </button>
        ))}
      </div>

      {activeSubTab === 'daily' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <TipPoolingDailyShiftView
              selectedShift={selectedShift}
              setSelectedShift={(s) => { setSelectedShift(s); setSelectedEmployee(null); }}
              organizeBy={organizeBy}
              setOrganizeBy={setOrganizeBy}
              isApproved={isApproved}
              activePeriod={activePeriod}
              activePoolAmount={activePoolAmount}
              activeEmployees={activeEmployees}
              selectedEmployee={selectedEmployee}
              onSelectEmployee={(name) => setSelectedEmployee(getEmployeeDetails(name))}
              onManagePolicy={() => setActiveSubTab('policy')}
              onDownload={() => alert('Tip Report downloaded successfully!')}
              onApprove={() => { setIsApproved(true); triggerToast("Today's tips have been successfully approved!"); }}
            />
          </div>
          <div className="lg:col-span-4">
            <TipPoolingEmployeeDrawer selectedEmployee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />
          </div>
        </div>
      ) : activeSubTab === 'payroll' ? (
        <TipPoolingPayrollView
          payrollDays={payrollDays}
          onDownload={() => alert('Tip Report downloaded successfully!')}
          onSendToPayroll={handleSendToPayroll}
          onSendIndividual={handleSendIndividual}
        />
      ) : (
        <div className="animate-fade-in">
          <TipPoolingConfig />
        </div>
      )}
    </div>
  );
};

export default TipPoolingReportTab;
