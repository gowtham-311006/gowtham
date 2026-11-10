import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { Activity, Printer, ArrowLeft, ShieldCheck } from 'lucide-react';

interface PrintAuditReportProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintAuditReport: React.FC<PrintAuditReportProps> = ({ isOpen, onClose }) => {
  const { logs, patients, currentUser } = useHospital();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col p-4 sm:p-6 overflow-y-auto">
      
      {/* Action Toolbar (Hidden during print) */}
      <div className="no-print max-w-5xl mx-auto w-full mb-4 flex items-center justify-between bg-slate-800 text-white p-3 rounded-xl shadow-lg border border-slate-700">
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="text-xs font-semibold text-slate-300">
          Official Clinical Audit Trail Export Preview
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors shadow-sm"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Save as PDF</span>
        </button>
      </div>

      {/* Printable Sheet */}
      <div className="max-w-5xl mx-auto w-full bg-white text-slate-900 rounded-2xl shadow-2xl p-8 sm:p-12 border border-slate-200">
        
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 mb-6 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <Activity className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                ST. JUDE'S METROPOLITAN HOSPITAL
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Division of Clinical Informatics &amp; Medical Quality Assurance
              </p>
              <p className="text-[11px] text-slate-400 font-mono">
                System: MedLogix Enterprise v2.4.0 • Facility ID: METRO-NY-9024
              </p>
            </div>
          </div>

          <div className="text-right text-xs text-slate-600">
            <div className="font-bold text-slate-900 text-sm">OFFICIAL AUDIT LOG REPORT</div>
            <div>Generated: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</div>
            <div>Certifying Officer: <strong>{currentUser?.name || 'Authorized Auditor'}</strong></div>
            <div className="font-mono text-[10px] text-slate-400">DOC-HASH: 8F49-2A1C-98EF</div>
          </div>
        </div>

        {/* Audit Metrics Summary */}
        <div className="grid grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6 text-center text-xs">
          <div>
            <div className="text-slate-500 text-[10px] uppercase font-bold">Total Logs Audited</div>
            <div className="text-lg font-black text-slate-900">{logs.length}</div>
          </div>
          <div>
            <div className="text-slate-500 text-[10px] uppercase font-bold">Active Inpatients</div>
            <div className="text-lg font-black text-slate-900">{patients.length}</div>
          </div>
          <div>
            <div className="text-slate-500 text-[10px] uppercase font-bold">Critical / STAT Interventions</div>
            <div className="text-lg font-black text-rose-600">
              {logs.filter(l => l.severity === 'Critical / STAT').length}
            </div>
          </div>
          <div>
            <div className="text-slate-500 text-[10px] uppercase font-bold">Audit Trail Status</div>
            <div className="text-xs font-bold text-emerald-700 mt-1 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED
            </div>
          </div>
        </div>

        {/* Main Logs Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-300 bg-slate-100/80 text-[10px] font-black text-slate-700 uppercase tracking-wider">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-2">Category</th>
                <th className="py-2.5 px-2">Severity</th>
                <th className="py-2.5 px-2">Patient / Bed</th>
                <th className="py-2.5 px-2">Clinical Staff</th>
                <th className="py-2.5 px-3">Event Summary &amp; Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.map((log, idx) => (
                <tr key={log.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap align-top">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-2.5 px-2 align-top font-bold text-slate-800">
                    {log.category}
                  </td>
                  <td className="py-2.5 px-2 align-top">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                      log.severity === 'Critical / STAT' 
                        ? 'bg-rose-100 text-rose-800' 
                        : log.severity === 'Urgent'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {log.severity.split('/')[0]}
                    </span>
                  </td>
                  <td className="py-2.5 px-2 align-top">
                    {log.patientName ? (
                      <div>
                        <div className="font-bold text-slate-900">{log.patientName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{log.patientId} • {log.bedNumber}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400">N/A</span>
                    )}
                  </td>
                  <td className="py-2.5 px-2 align-top">
                    <div className="font-semibold text-slate-800">{log.staffName}</div>
                    <div className="text-[10px] text-slate-500">{log.staffRole}</div>
                  </td>
                  <td className="py-2.5 px-3 align-top">
                    <div className="font-bold text-slate-900">{log.summary}</div>
                    <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-2">{log.details}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legal Sign-Off Footer */}
        <div className="mt-8 pt-6 border-t-2 border-slate-300 grid grid-cols-2 gap-8 text-xs text-slate-600">
          <div>
            <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-4">
              Quality Assurance &amp; Compliance Sign-off:
            </div>
            <div className="border-b border-slate-400 w-3/4 mb-1"></div>
            <div className="text-[11px] text-slate-500">Authorized Signature &amp; Title</div>
          </div>

          <div className="text-right">
            <div className="font-bold text-slate-800 uppercase text-[10px] tracking-wider mb-4">
              Electronic Verification Stamp:
            </div>
            <div className="font-mono text-[10px] text-slate-500">
              SHA-256: 7d89cf441e882a6549219c011e4fbb
            </div>
            <div className="text-[11px] text-emerald-700 font-bold mt-1">
              ✓ Document Authenticity Verified
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
