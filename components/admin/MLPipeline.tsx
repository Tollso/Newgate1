
import React, { useState } from 'react';
import { MLJob, ResourceClass } from '../../types';
import { Server, Cpu, PlayCircle, Clock, CheckCircle, AlertOctagon, RefreshCw } from 'lucide-react';
import { generateMLReportAnalysis } from '../../services/geminiService';

interface MLPipelineProps {
  jobs: MLJob[];
  resources: ResourceClass[];
}

const MLPipeline: React.FC<MLPipelineProps> = ({ jobs, resources }) => {
    const [analysis, setAnalysis] = useState<string>('');
    const [analyzing, setAnalyzing] = useState(false);

    const handleAnalyze = async () => {
        setAnalyzing(true);
        const res = await generateMLReportAnalysis(jobs);
        setAnalysis(res);
        setAnalyzing(false);
    }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">ML Operations Center</h1>
          <p className="text-slate-500">Manage training pipelines and compute resources</p>
        </div>
        <button 
            onClick={handleAnalyze}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-sm transition-colors">
          <RefreshCw size={18} className={analyzing ? "animate-spin" : ""} />
          {analyzing ? "Analyzing Logs..." : "Analyze Pipeline Performance"}
        </button>
      </div>

      {analysis && (
           <div className="bg-slate-900 text-emerald-400 p-4 rounded-lg font-mono text-sm border border-emerald-900/50">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-emerald-900/50">
                    <Server size={14} />
                    <span>SYSTEM ANALYSIS REPORT</span>
                </div>
                <p>{analysis}</p>
           </div>
      )}

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {resources.map(res => (
          <div key={res.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-slate-100 rounded-lg text-slate-700">
                {res.type === 'GPU' ? <Server size={24} /> : res.type === 'TPU' ? <Cpu size={24} /> : <Server size={24} />}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-semibold ${res.availability > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                {res.availability} Available
              </span>
            </div>
            <h3 className="font-bold text-slate-800 text-lg">{res.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{res.spec}</p>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-500 h-full rounded-full" 
                style={{ width: `${Math.random() * 80 + 10}%` }}
              ></div>
            </div>
            <div className="mt-2 text-xs text-slate-400 text-right">Load</div>
          </div>
        ))}
      </div>

      {/* Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-semibold text-slate-800">Active Training Pipelines</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500">
              <th className="px-6 py-4 font-medium">Job ID</th>
              <th className="px-6 py-4 font-medium">Model Name</th>
              <th className="px-6 py-4 font-medium">Architecture</th>
              <th className="px-6 py-4 font-medium">Resource</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Accuracy</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50">
                <td className="px-6 py-4 font-mono text-slate-600">{job.id}</td>
                <td className="px-6 py-4 font-medium text-slate-900">{job.name}</td>
                <td className="px-6 py-4 text-slate-600">{job.modelType}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-medium border border-indigo-100">
                    {job.resourceClass}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    {job.status === 'Running' && <PlayCircle size={16} className="text-blue-500 animate-pulse" />}
                    {job.status === 'Completed' && <CheckCircle size={16} className="text-emerald-500" />}
                    {job.status === 'Failed' && <AlertOctagon size={16} className="text-red-500" />}
                    <span className={
                      job.status === 'Running' ? 'text-blue-700' : 
                      job.status === 'Completed' ? 'text-emerald-700' : 'text-red-700'
                    }>{job.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-mono font-medium">
                  {(job.accuracy * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MLPipeline;