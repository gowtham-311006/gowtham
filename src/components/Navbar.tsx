import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Activity, 
  Shield, 
  PlusCircle, 
  Radio, 
  Rocket, 
  Printer, 
  UserCheck, 
  ChevronDown, 
  LogOut, 
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';

interface NavbarProps {
  onOpenQuickLog: () => void;
  onOpenLoginModal: () => void;
  onOpenDeployModal: () => void;
  onOpenPrintView: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenQuickLog,
  onOpenLoginModal,
  onOpenDeployModal,
  onOpenPrintView
}) => {
  const { 
    currentUser, 
    logout, 
    alerts, 
    isSimulating, 
    setIsSimulating,
    exportLogsCSV,
    exportLogsJSON
  } = useHospital();

  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const activeAlertsCount = alerts.filter(a => a.status !== 'RESOLVED').length;

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-md select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand & Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
                  MedLogix
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold bg-teal-500/20 text-teal-300 border border-teal-400/30">
                    Clinical Log v2.4
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                St. Jude's Metropolitan Hospital • Zero-Config Logging Hub
              </p>
            </div>
          </div>

          {/* Center-Right: Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Live Ward Telemetry Sim toggle */}
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              title={isSimulating ? "Live Ward Telemetry Simulator active" : "Simulator paused"}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
                isSimulating 
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/80' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Radio className={`w-3.5 h-3.5 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
              <span className="hidden md:inline">Live Telemetry:</span>
              <span className="font-semibold">{isSimulating ? 'ON' : 'OFF'}</span>
            </button>

            {/* Easy Deploy & Config Hub Button */}
            <button
              onClick={onOpenDeployModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/40 transition-colors shadow-sm"
              title="Easy Deployment Guide, Docker & Database Tools"
            >
              <Rocket className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">1-Click Deploy &amp; Config</span>
            </button>

            {/* Quick Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
                title="Export Hospital Logs"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                <span className="hidden lg:inline">Export</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showExportMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowExportMenu(false)} />
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 py-1 text-xs">
                    <button
                      onClick={() => { exportLogsCSV(); setShowExportMenu(false); }}
                      className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5 text-teal-400" />
                      Export Audit Trail (CSV)
                    </button>
                    <button
                      onClick={() => { exportLogsJSON(); setShowExportMenu(false); }}
                      className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700 flex items-center gap-2"
                    >
                      <Shield className="w-3.5 h-3.5 text-indigo-400" />
                      Database Snapshot (JSON)
                    </button>
                    <button
                      onClick={() => { onOpenPrintView(); setShowExportMenu(false); }}
                      className="w-full text-left px-3 py-2 text-slate-200 hover:bg-slate-700 flex items-center gap-2 border-t border-slate-700"
                    >
                      <Printer className="w-3.5 h-3.5 text-amber-400" />
                      Print Compliance Report
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Quick Log Action CTA */}
            <button
              onClick={onOpenQuickLog}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-teal-500 hover:bg-teal-400 text-slate-950 transition-all shadow-md shadow-teal-500/20 active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Log Event</span>
            </button>

            {/* User Profile / Switch Staff / Separate Logins */}
            <div className="flex items-center gap-2">
              {currentUser ? (
                <>
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors"
                    >
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-7 h-7 rounded-lg object-cover border border-slate-600"
                      />
                      <div className="text-left hidden md:block">
                        <div className="text-xs font-semibold text-white leading-tight flex items-center gap-1.5">
                          <span>{currentUser.name}</span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30">
                            {currentUser.portalType || 'portal'}
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 leading-none mt-0.5">
                          {currentUser.role} • {currentUser.badgeNumber}
                        </div>
                      </div>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {showUserMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                        <div className="absolute right-0 mt-2 w-64 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 p-3">
                          <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
                            <img
                              src={currentUser.avatar}
                              alt={currentUser.name}
                              className="w-10 h-10 rounded-xl object-cover border border-teal-500/50"
                            />
                            <div className="overflow-hidden">
                              <div className="font-bold text-sm text-white truncate">{currentUser.name}</div>
                              <div className="text-xs text-teal-400 font-medium">{currentUser.role}</div>
                              <div className="text-[11px] text-slate-400">{currentUser.department}</div>
                            </div>
                          </div>

                          <div className="py-2.5 space-y-1 text-xs text-slate-300">
                            <div className="flex justify-between">
                              <span className="text-slate-400">Badge ID:</span>
                              <span className="font-mono font-semibold text-slate-200">{currentUser.badgeNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Portal:</span>
                              <span className="font-semibold text-teal-300 capitalize">{currentUser.portalType} Workspace</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">License:</span>
                              <span className="font-mono text-slate-300">{currentUser.licenseNumber}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">Active Shift:</span>
                              <span className="text-slate-200">{currentUser.activeShift.split(' ')[0]}</span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-700 space-y-1">
                            <button
                              onClick={() => { setShowUserMenu(false); onOpenLoginModal(); }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-teal-300 hover:bg-slate-700 font-medium flex items-center gap-2"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              Switch Separate Login Portal
                            </button>
                            <button
                              onClick={() => { setShowUserMenu(false); logout(); }}
                              className="w-full text-left px-2.5 py-1.5 rounded-lg text-xs text-rose-300 hover:bg-slate-700 font-medium flex items-center gap-2"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              Log Out to Login Gateway
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  <button
                    onClick={logout}
                    title="Log out and return to Separate Logins Portal"
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={onOpenLoginModal}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 border border-slate-700 text-white hover:bg-slate-700 transition-colors"
                >
                  <UserCheck className="w-3.5 h-3.5 text-teal-400" />
                  <span>Select Login Portal</span>
                </button>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
