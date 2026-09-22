import React from 'react';
import { X, Send } from 'lucide-react';

interface ReportRequestModalProps {
  showRequestModal: boolean;
  setShowRequestModal: (show: boolean) => void;
  reportType: string;
  setReportType: (type: string) => void;
  dateRange: string;
  setDateRange: (range: string) => void;
  handleSubmitRequest: (e: React.FormEvent) => void;
}

export const ReportRequestModal: React.FC<ReportRequestModalProps> = ({
  showRequestModal,
  setShowRequestModal,
  reportType,
  setReportType,
  dateRange,
  setDateRange,
  handleSubmitRequest
}) => {
  if (!showRequestModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-fade-in">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
          <h3 className="font-semibold text-slate-800">Request Custom Report</h3>
          <button onClick={() => setShowRequestModal(false)} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Report Type</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Sales">Full Sales Analysis</option>
              <option value="Item Sales">Item Level Performance</option>
              <option value="Labor">Employee Labor & Hours</option>
              <option value="Audit">System & Cashier Audit Log</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date Range</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Last 7 Days">Last 7 Days</option>
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="This Month">This Month</option>
              <option value="Last Month">Last Month</option>
              <option value="Year to Date">Year to Date</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">File Format</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="format" defaultChecked className="text-indigo-600" />
                <span className="text-sm text-slate-700">CSV (Excel)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="radio" name="format" className="text-indigo-600" />
                <span className="text-sm text-slate-700">PDF Document</span>
              </label>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => setShowRequestModal(false)}
              className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 flex items-center gap-2"
            >
              <Send size={16} /> Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
