import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  FileText, 
  Users, 
  Bed, 
  AlertOctagon, 
  Clock, 
  CheckCircle2,
  TrendingUp,
  Activity
} from 'lucide-react';

export const StatsOverview: React.FC = () => {
  const { logs, patients, staffList, alerts } = useHospital();

  const totalLogs = logs.length;
  const criticalLogs = logs.filter(l => l.severity === 'Critical / STAT').length;
  const occupiedBeds = patients.length;
  const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      {/* Metric 1: Total Audit Logs */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-50 text-teal-600 border border-teal-100 flex items-center justify-center shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Event Logs
          </div>
          <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            {totalLogs}
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> Live
            </span>
          </div>
        </div>
      </div>

      {/* Metric 2: Active Inpatients */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
          <Bed className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Admitted Inpatients
          </div>
          <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            {occupiedBeds} <span className="text-xs font-normal text-slate-400">/ 6 Beds Tracked</span>
          </div>
        </div>
      </div>

      {/* Metric 3: Critical Events */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
          criticalLogs > 0 || activeAlerts > 0
            ? 'bg-rose-50 text-rose-600 border-rose-200' 
            : 'bg-slate-50 text-slate-600 border-slate-200'
        }`}>
          <AlertOctagon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Critical / STAT Events
          </div>
          <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <span className={criticalLogs > 0 ? 'text-rose-600' : 'text-slate-900'}>
              {criticalLogs}
            </span>
            {activeAlerts > 0 && (
              <span className="text-[10px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded border border-rose-300 animate-pulse">
                {activeAlerts} Code Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Metric 4: Active Shift Roster */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Clinical Staff On Shift
          </div>
          <div className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            {staffList.length} <span className="text-xs font-normal text-slate-400">Active Duty</span>
          </div>
        </div>
      </div>

    </div>
  );
};
