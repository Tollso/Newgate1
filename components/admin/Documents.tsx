import React, { useState } from 'react';
import { Statement, ReportRequest } from '../../types';
import { MOCK_STATEMENTS, MOCK_REPORT_REQUESTS } from '../../constants';
import { FileText, Download, Clock, Plus, CheckCircle, RefreshCw, X, Archive } from 'lucide-react';
import { ReportRequestModal } from './ReportRequestModal';

interface DocumentsProps {
  statements?: Statement[];
  reports?: ReportRequest[];
  initialTab?: 'Statements' | 'Requested Reports';
}

const Documents: React.FC<DocumentsProps> = ({ 
  statements = MOCK_STATEMENTS, 
  reports = MOCK_REPORT_REQUESTS,
  initialTab = 'Statements' 
}) => {
  const [activeTab, setActiveTab] = useState<'Statements' | 'Requested Reports'>(initialTab);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [statementYear, setStatementYear] = useState(2025);
  const [statementTypeFilter, setStatementTypeFilter] = useState('All');

  const [reportType, setReportType] = useState('Sales');
  const [dateRange, setDateRange] = useState('Last 7 Days');

  const filteredStatements = statements.filter(s => {
    const matchesYear = s.year === statementYear;
    const matchesType = statementTypeFilter === 'All' || s.type === statementTypeFilter;
    return matchesYear && matchesType;
  });

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setShowRequestModal(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  return (
    <div className="space-y-6 relative">
      {showSuccess && (
        <div className="fixed top-20 right-8 z-50 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in-down">
          <CheckCircle size={20} className="text-emerald-600" />
          <div>
            <p className="font-bold text-sm">Request Submitted!</p>
            <p className="text-xs text-emerald-600">You'll be notified via email when your report is ready.</p>
          </div>
          <button onClick={() => setShowSuccess(false)} className="ml-2 text-emerald-500 hover:text-emerald-800"><X size={16} /></button>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Documents Hub</h1>
          <p className="text-slate-500">Access monthly statements and generated reports</p>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
          {['Statements', 'Requested Reports'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                activeTab === tab ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab === 'Statements' ? 'Monthly Statements' : tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'Statements' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex items-center gap-2 text-slate-500 font-medium"><Archive size={18} /> Archives:</div>
            <div className="flex gap-4">
              <select value={statementYear} onChange={(e) => setStatementYear(parseInt(e.target.value))} className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white">
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
                <option value={2023}>2023</option>
              </select>
              <select value={statementTypeFilter} onChange={(e) => setStatementTypeFilter(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-700 bg-white">
                <option value="All">All Types</option>
                <option value="Merchant Processing">Merchant Processing</option>
                <option value="Plan & Apps">Plan & Apps</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200">
              <h3 className="font-semibold text-slate-800">Statements for {statementYear}</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredStatements.length > 0 ? filteredStatements.map(stmt => (
                <div key={stmt.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg ${stmt.status === 'Estimate' ? 'bg-amber-100 text-amber-600' : 'bg-indigo-50 text-indigo-600'}`}>
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">{stmt.period}</p>
                      <p className="text-xs text-slate-500">{stmt.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="font-mono font-semibold text-slate-700">${stmt.amount?.toFixed(2) || '0.00'}</p>
                      {stmt.status === 'Estimate' && <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded uppercase font-bold tracking-wide">Estimate</span>}
                    </div>
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium"><Download size={16} /> Download</button>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center text-slate-500 italic">No statements found for this period.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Requested Reports' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="font-bold text-indigo-900">Custom Report Generator</h3>
              <p className="text-sm text-indigo-700">Need specific data? Generate a custom report and we'll email you when it's ready.</p>
            </div>
            <button onClick={() => setShowRequestModal(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 shadow-sm flex items-center gap-2">
              <Plus size={18} /> Request New Report
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200"><h3 className="font-semibold text-slate-800">Request History</h3></div>
            <div className="divide-y divide-slate-100">
              {reports.map(req => (
                <div key={req.id} className="p-4 flex items-center justify-between hover:bg-slate-50">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-100 text-slate-500 rounded-lg"><Clock size={20} /></div>
                    <div>
                      <p className="font-medium text-slate-900">{req.type}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span>Range: {req.dateRange}</span> • <span>Req: {req.requestDate}</span>
                        {req.requestedBy && <> • <span>By: {req.requestedBy}</span></>}
                      </div>
                    </div>
                  </div>
                  <div>
                    {req.status === 'Ready' && (
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"><CheckCircle size={12} /> Ready</span>
                        <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1 text-sm font-medium"><Download size={14} /> Download</button>
                      </div>
                    )}
                    {req.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        <RefreshCw size={12} className="animate-spin" /> Processing
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ReportRequestModal
        showRequestModal={showRequestModal}
        setShowRequestModal={setShowRequestModal}
        reportType={reportType}
        setReportType={setReportType}
        dateRange={dateRange}
        setDateRange={setDateRange}
        handleSubmitRequest={handleSubmitRequest}
      />
    </div>
  );
};

export default Documents;
