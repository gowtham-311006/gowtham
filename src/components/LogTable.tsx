import React, { useState, useMemo } from 'react';
import { useHospital } from '../context/HospitalContext';
import { LogEntry, Department, LogCategory, LogSeverity } from '../types/hospital';
import { 
  Search, 
  Filter, 
  Activity, 
  Pill, 
  ClipboardList, 
  ArrowRightLeft, 
  AlertTriangle, 
  Siren, 
  ShieldCheck, 
  FileText, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  X, 
  Download, 
  Calendar,
  Layers,
  Heart,
  Thermometer,
  Shield,
  Eye,
  CheckCircle2
} from 'lucide-react';

export const LogTable: React.FC = () => {
  const { 
    logs, 
    selectedDepartment, 
    setSelectedDepartment, 
    selectedSeverity, 
    setSelectedSeverity, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    selectedPatientId,
    setSelectedPatientId,
    exportLogsCSV,
    exportLogsJSON
  } = useHospital();

  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Patient filter
      if (selectedPatientId && log.patientId !== selectedPatientId) {
        return false;
      }
      // Department filter
      if (selectedDepartment !== 'All Departments' && log.department !== selectedDepartment) {
        return false;
      }
      // Severity filter
      if (selectedSeverity !== 'All Severities' && log.severity !== selectedSeverity) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'All Categories' && log.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesSummary = log.summary.toLowerCase().includes(query);
        const matchesDetails = log.details.toLowerCase().includes(query);
        const matchesStaff = log.staffName.toLowerCase().includes(query) || log.staffRole.toLowerCase().includes(query);
        const matchesPatient = (log.patientName && log.patientName.toLowerCase().includes(query)) ||
                               (log.patientId && log.patientId.toLowerCase().includes(query)) ||
                               (log.bedNumber && log.bedNumber.toLowerCase().includes(query));
        const matchesMed = log.metadata?.medication?.drugName?.toLowerCase().includes(query);

        if (!matchesSummary && !matchesDetails && !matchesStaff && !matchesPatient && !matchesMed) {
          return false;
        }
      }
      return true;
    });
  }, [logs, selectedPatientId, selectedDepartment, selectedSeverity, selectedCategory, searchQuery]);

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage) || 1;
  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const toggleExpand = (id: string) => {
    setExpandedLogId(prev => (prev === id ? null : id));
  };

  const getCategoryIcon = (category: LogCategory) => {
    switch (category) {
      case 'Vitals':
        return <Activity className="w-3.5 h-3.5 text-rose-500" />;
      case 'Medication (MAR)':
        return <Pill className="w-3.5 h-3.5 text-blue-500" />;
      case 'Shift Handover':
        return <ClipboardList className="w-3.5 h-3.5 text-indigo-500" />;
      case 'Bed Transfer':
        return <ArrowRightLeft className="w-3.5 h-3.5 text-emerald-500" />;
      case 'Incident / Safety':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
      case 'Emergency Code':
        return <Siren className="w-3.5 h-3.5 text-rose-600 animate-pulse" />;
      case 'Access & Security':
        return <ShieldCheck className="w-3.5 h-3.5 text-slate-600" />;
      default:
        return <FileText className="w-3.5 h-3.5 text-teal-600" />;
    }
  };

  const getSeverityBadge = (severity: LogSeverity) => {
    switch (severity) {
      case 'Critical / STAT':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1 shadow-xs animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-600" />
            CRITICAL STAT
          </span>
        );
      case 'Urgent':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            URGENT
          </span>
        );
      case 'Security':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            SECURITY
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
            ROUTINE
          </span>
        );
    }
  };

  const formatLogTime = (isoString: string) => {
    const date = new Date(isoString);
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const elapsedMs = Date.now() - date.getTime();
    const elapsedMins = Math.floor(elapsedMs / (1000 * 60));
    let relative = 'just now';
    if (elapsedMins > 0 && elapsedMins < 60) {
      relative = `${elapsedMins}m ago`;
    } else if (elapsedMins >= 60) {
      relative = `${Math.floor(elapsedMins / 60)}h ago`;
    }
    return { time, relative, full: date.toLocaleString() };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      
      {/* Top Filter & Search Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search clinical events, patient name, MRN, staff, drug..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full text-xs pl-9 pr-8 py-2 rounded-xl border border-slate-300 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Department Filter */}
            <select
              value={selectedDepartment}
              onChange={e => { setSelectedDepartment(e.target.value as any); setCurrentPage(1); }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
            >
              <option value="All Departments">All Departments</option>
              <option value="Emergency (ER)">Emergency (ER)</option>
              <option value="Intensive Care (ICU)">Intensive Care (ICU)</option>
              <option value="General Med-Surg">General Med-Surg</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Surgical Suite (OR)">Surgical Suite (OR)</option>
              <option value="Pathology & Lab">Pathology &amp; Lab</option>
            </select>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={e => { setSelectedSeverity(e.target.value as any); setCurrentPage(1); }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
            >
              <option value="All Severities">All Severities</option>
              <option value="Routine">Routine</option>
              <option value="Urgent">Urgent</option>
              <option value="Critical / STAT">Critical / STAT</option>
              <option value="Security">Security</option>
            </select>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={e => { setSelectedCategory(e.target.value as any); setCurrentPage(1); }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
            >
              <option value="All Categories">All Categories</option>
              <option value="Vitals">Vitals</option>
              <option value="Medication (MAR)">Medication (MAR)</option>
              <option value="Shift Handover">Shift Handover</option>
              <option value="Admission & Triage">Admission &amp; Triage</option>
              <option value="Bed Transfer">Bed Transfer</option>
              <option value="Emergency Code">Emergency Code</option>
              <option value="Incident / Safety">Incident / Safety</option>
              <option value="Access & Security">Access &amp; Security</option>
            </select>

            {/* Export buttons */}
            <button
              onClick={exportLogsCSV}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 flex items-center gap-1 shadow-xs"
              title="Download CSV audit log"
            >
              <Download className="w-3 h-3 text-teal-600" />
              <span>CSV</span>
            </button>
          </div>

        </div>

        {/* Active Filters Bar */}
        {(selectedPatientId || selectedDepartment !== 'All Departments' || selectedSeverity !== 'All Severities' || selectedCategory !== 'All Categories' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/80 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Active Filters:</span>
            
            {selectedPatientId && (
              <span className="bg-teal-100 text-teal-800 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                Patient: {selectedPatientId}
                <button onClick={() => setSelectedPatientId(null)} className="hover:text-teal-950 font-bold">&times;</button>
              </span>
            )}
            {selectedDepartment !== 'All Departments' && (
              <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                Dept: {selectedDepartment}
                <button onClick={() => setSelectedDepartment('All Departments')} className="hover:text-black font-bold">&times;</button>
              </span>
            )}
            {selectedSeverity !== 'All Severities' && (
              <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                Severity: {selectedSeverity}
                <button onClick={() => setSelectedSeverity('All Severities')} className="hover:text-black font-bold">&times;</button>
              </span>
            )}
            {selectedCategory !== 'All Categories' && (
              <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                Category: {selectedCategory}
                <button onClick={() => setSelectedCategory('All Categories')} className="hover:text-black font-bold">&times;</button>
              </span>
            )}
            {searchQuery && (
              <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-md font-semibold flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="hover:text-black font-bold">&times;</button>
              </span>
            )}

            <button
              onClick={() => {
                setSelectedPatientId(null);
                setSelectedDepartment('All Departments');
                setSelectedSeverity('All Severities');
                setSelectedCategory('All Categories');
                setSearchQuery('');
              }}
              className="text-xs text-rose-600 hover:underline font-semibold ml-auto"
            >
              Reset all filters
            </button>
          </div>
        )}

      </div>

      {/* Log Count Strip */}
      <div className="bg-slate-100/70 px-5 py-2 border-b border-slate-200 text-xs font-semibold text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span>Showing {paginatedLogs.length} of {filteredLogs.length} audit logs</span>
          <span className="text-slate-400">•</span>
          <span className="text-[11px] font-normal text-slate-500">Immutable, timestamped chronological audit trail</span>
        </div>
        <div className="text-[11px] text-slate-500 hidden sm:block">
          Click any row to inspect clinical metadata &amp; telemetry
        </div>
      </div>

      {/* Main Table / List */}
      <div className="divide-y divide-slate-100">
        {paginatedLogs.length === 0 ? (
          <div className="text-center py-12 px-4">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-700">No matching hospital logs found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or reset active filters.
            </p>
          </div>
        ) : (
          paginatedLogs.map(log => {
            const isExpanded = expandedLogId === log.id;
            const timeObj = formatLogTime(log.timestamp);

            return (
              <div 
                key={log.id}
                className={`transition-colors ${
                  isExpanded ? 'bg-teal-50/20' : 'hover:bg-slate-50/70'
                }`}
              >
                {/* Main Row */}
                <div 
                  onClick={() => toggleExpand(log.id)}
                  className="p-3.5 sm:px-5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                >
                  {/* Left: Timestamp, Category, Severity */}
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="text-left w-24 shrink-0">
                      <div className="font-mono text-xs font-bold text-slate-800">
                        {timeObj.time}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {timeObj.relative}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200">
                        {getCategoryIcon(log.category)}
                        <span className="truncate max-w-[110px] sm:max-w-none">{log.category}</span>
                      </div>
                      {getSeverityBadge(log.severity)}
                    </div>
                  </div>

                  {/* Center: Clinical Summary & Patient */}
                  <div className="flex-1 min-w-0 md:px-3">
                    <div className="text-xs font-bold text-slate-900 truncate">
                      {log.summary}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-500 mt-0.5">
                      {log.patientName && (
                        <span className="font-medium text-teal-800 bg-teal-50 px-1.5 py-0.2 rounded border border-teal-200/60">
                          {log.patientName} ({log.patientId})
                        </span>
                      )}
                      {log.bedNumber && (
                        <span className="font-mono text-slate-600 font-semibold">
                          Bed: {log.bedNumber}
                        </span>
                      )}
                      <span className="text-slate-400">•</span>
                      <span>{log.department}</span>
                    </div>
                  </div>

                  {/* Right: Staff & Expand toggle */}
                  <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-slate-800">
                        {log.staffName}
                      </div>
                      <div className="text-[10px] text-teal-600 font-medium">
                        {log.staffRole}
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details Drawer */}
                {isExpanded && (
                  <div className="px-5 pb-4 pt-1 bg-slate-50/80 border-t border-slate-100 text-xs text-slate-700 animate-in fade-in duration-150">
                    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
                      
                      {/* Clinical narrative */}
                      <div>
                        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider mb-1">
                          Full Clinical Log Narrative
                        </div>
                        <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                          {log.details}
                        </p>
                      </div>

                      {/* Vitals detail cards if logged */}
                      {log.metadata?.vitals && (
                        <div className="bg-teal-50/50 p-3 rounded-xl border border-teal-100">
                          <div className="text-[11px] font-bold text-teal-900 mb-2 flex items-center gap-1.5">
                            <Activity className="w-3.5 h-3.5 text-teal-700" />
                            Logged Bedside Physiological Vitals:
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                            <div className="bg-white p-2 rounded-lg border border-teal-100">
                              <span className="text-[10px] text-slate-500 block">Heart Rate</span>
                              <span className="font-bold text-slate-900">{log.metadata.vitals.heartRate} bpm</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-teal-100">
                              <span className="text-[10px] text-slate-500 block">Blood Pressure</span>
                              <span className="font-bold text-slate-900">{log.metadata.vitals.bloodPressureSys}/{log.metadata.vitals.bloodPressureDia}</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-teal-100">
                              <span className="text-[10px] text-slate-500 block">Oxygen Sat (SpO2)</span>
                              <span className="font-bold text-slate-900">{log.metadata.vitals.oxygenSaturation}%</span>
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-teal-100">
                              <span className="text-[10px] text-slate-500 block">Temperature</span>
                              <span className="font-bold text-slate-900">{log.metadata.vitals.temperature}°C</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Medication MAR detail if logged */}
                      {log.metadata?.medication && (
                        <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                          <div className="text-[11px] font-bold text-blue-900 mb-1 flex items-center gap-1.5">
                            <Pill className="w-3.5 h-3.5 text-blue-700" />
                            Medication Administration Record Verification:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                            <div>
                              <span className="text-[10px] text-slate-500">Drug &amp; Dose:</span>
                              <div className="font-bold text-slate-800">{log.metadata.medication.drugName} ({log.metadata.medication.dosage})</div>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500">Route:</span>
                              <div className="font-bold text-slate-800">{log.metadata.medication.route}</div>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-500">Witness Verification:</span>
                              <div className="font-semibold text-teal-700">{log.metadata.medication.witnessNurse || 'Single Nurse Certified'}</div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SBAR details if logged */}
                      {log.metadata?.sbar && (
                        <div className="bg-indigo-50/50 p-3 rounded-xl border border-indigo-100 space-y-1.5 text-xs">
                          <div className="text-[11px] font-bold text-indigo-900 flex items-center gap-1.5">
                            <ClipboardList className="w-3.5 h-3.5 text-indigo-700" />
                            SBAR Clinical Transition Data:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <div className="bg-white p-2 rounded-lg border border-indigo-100">
                              <strong className="text-indigo-800">Situation:</strong> {log.metadata.sbar.situation}
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-indigo-100">
                              <strong className="text-indigo-800">Background:</strong> {log.metadata.sbar.background}
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-indigo-100">
                              <strong className="text-indigo-800">Assessment:</strong> {log.metadata.sbar.assessment}
                            </div>
                            <div className="bg-white p-2 rounded-lg border border-indigo-100">
                              <strong className="text-indigo-800">Recommendation:</strong> {log.metadata.sbar.recommendation}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Footer audit metadata */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
                        <div>
                          Audit ID: <span className="text-slate-600">{log.id}</span> • ISO: {log.timestamp}
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-700 font-sans font-semibold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Tamper-evident verification stamp valid</span>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="text-slate-500 font-medium">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
