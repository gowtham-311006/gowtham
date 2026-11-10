import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { StaffRole, Department } from '../types/hospital';
import { 
  X, 
  UserCheck, 
  KeyRound, 
  CreditCard, 
  ShieldCheck, 
  Stethoscope, 
  CheckCircle2, 
  Sparkles,
  Zap
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { staffList, currentUser, loginAsStaff, customLogin } = useHospital();
  
  const [activeTab, setActiveTab] = useState<'quick' | 'nfc' | 'custom'>('quick');
  const [isScanningNfc, setIsScanningNfc] = useState(false);
  const [nfcSuccess, setNfcSuccess] = useState<string | null>(null);

  // Custom login state
  const [customName, setCustomName] = useState('');
  const [customBadge, setCustomBadge] = useState('');
  const [customRole, setCustomRole] = useState<StaffRole>('Registered Nurse');
  const [customDept, setCustomDept] = useState<Department>('Emergency (ER)');

  if (!isOpen) return null;

  const handleSelectStaff = (id: string) => {
    loginAsStaff(id);
    onClose();
  };

  const handleSimulateNfcTap = (staffId: string) => {
    setIsScanningNfc(true);
    setNfcSuccess(null);
    setTimeout(() => {
      loginAsStaff(staffId);
      setIsScanningNfc(false);
      setNfcSuccess('Badge Authenticated via RFID Reader!');
      setTimeout(() => {
        onClose();
        setNfcSuccess(null);
      }, 700);
    }, 900);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim() || !customBadge.trim()) return;
    customLogin(customBadge, customName, customRole, customDept);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Hospital Staff Authentication &amp; Access Portal
              </h2>
              <p className="text-xs text-slate-400">
                Zero-friction biometric, RFID badge tap &amp; role-based clinical sign-in
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-5 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('quick')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'quick'
                ? 'border-teal-600 text-teal-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            1-Click Staff Switcher (Demo)
          </button>
          <button
            onClick={() => setActiveTab('nfc')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'nfc'
                ? 'border-teal-600 text-teal-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-blue-500" />
            Badge / RFID Tap Reader
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'custom'
                ? 'border-teal-600 text-teal-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5 text-indigo-500" />
            Custom Staff Credentials
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          
          {/* TAB 1: 6 Separate Portals Switcher */}
          {activeTab === 'quick' && (
            <div>
              <p className="text-xs text-slate-500 mb-3">
                Switch between the <strong>6 Separate Clinical Logins</strong>. Each login grants a customized clinical portal with role-specific logging tools and permissions.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {staffList.map((member) => {
                  const isCurrent = currentUser?.id === member.id;
                  const portalNameMap: Record<string, string> = {
                    'staff-01': 'Physician & Doctor Portal',
                    'staff-02': 'Nursing & MAR Portal',
                    'staff-03': 'Surgical Suite Portal',
                    'staff-04': 'Emergency Triage Portal',
                    'staff-05': 'Diagnostic Lab Portal',
                    'staff-06': 'Compliance & Admin Portal'
                  };
                  const portalTitle = portalNameMap[member.id] || `${member.role} Portal`;

                  return (
                    <button
                      key={member.id}
                      onClick={() => handleSelectStaff(member.id)}
                      className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 relative ${
                        isCurrent
                          ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/20 shadow-sm'
                          : 'border-slate-200 bg-white hover:border-teal-300 hover:bg-slate-50/80 shadow-xs'
                      }`}
                    >
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-slate-100 text-teal-800 border border-slate-200 truncate">
                            {portalTitle}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold px-1 py-0.5 rounded bg-teal-600 text-white flex items-center gap-1 shrink-0 ml-1">
                              <CheckCircle2 className="w-2.5 h-2.5" /> Active
                            </span>
                          )}
                        </div>
                        <h3 className="text-xs font-bold text-slate-900 truncate mt-1">{member.name}</h3>
                        <div className="text-[11px] font-medium text-slate-600">
                          {member.role} • {member.department.split(' ')[0]}
                        </div>
                        <div className="text-[10px] text-slate-500 flex items-center justify-between mt-1 pt-1 border-t border-slate-100">
                          <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-600">
                            Badge: {member.badgeNumber}
                          </span>
                          <span className="font-mono text-teal-700 font-bold">
                            PIN: {member.pin || '1234'}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: RFID Badge Tap */}
          {activeTab === 'nfc' && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="relative mb-4">
                <div className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all ${
                  isScanningNfc 
                    ? 'bg-blue-600 text-white animate-pulse shadow-lg shadow-blue-500/30' 
                    : nfcSuccess 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  <CreditCard className="w-12 h-12" />
                </div>
                {isScanningNfc && (
                  <div className="absolute inset-0 rounded-2xl border-2 border-blue-400 animate-ping opacity-75" />
                )}
              </div>

              <h3 className="text-sm font-bold text-slate-900">
                {isScanningNfc ? 'Reading Contactless RFID / NFC Badge...' : nfcSuccess ? nfcSuccess : 'Hospital Terminal Badge Scanner'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1 mb-6">
                Hospital staff can tap physical RFID smartcards against the bedside tablet or nurses station terminal for sub-second zero-password login.
              </p>

              <div className="w-full max-w-md bg-slate-50 border border-slate-200 rounded-xl p-4 text-left">
                <div className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                  Simulate Badge Reader Tap:
                </div>
                <div className="space-y-2">
                  {staffList.slice(0, 3).map(staff => (
                    <button
                      key={staff.id}
                      disabled={isScanningNfc}
                      onClick={() => handleSimulateNfcTap(staff.id)}
                      className="w-full text-xs font-medium bg-white hover:bg-slate-100 border border-slate-200 px-3 py-2 rounded-lg flex items-center justify-between transition-colors disabled:opacity-50"
                    >
                      <span className="font-semibold text-slate-800">{staff.name} ({staff.role})</span>
                      <span className="text-[10px] font-mono text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                        Tap {staff.badgeNumber} &rarr;
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Custom Login */}
          {activeTab === 'custom' && (
            <form onSubmit={handleCustomSubmit} className="space-y-4">
              <p className="text-xs text-slate-500">
                Register or log in as a visiting physician, resident, or registry nurse with custom credentials.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Staff Full Name &amp; Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jordan Hayes, MD"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hospital Badge / ID Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. REG-4401"
                    value={customBadge}
                    onChange={e => setCustomBadge(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Staff Role
                  </label>
                  <select
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value as StaffRole)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Doctor">Doctor (Physician)</option>
                    <option value="Surgeon">Surgeon</option>
                    <option value="Head Nurse">Head Nurse</option>
                    <option value="Registered Nurse">Registered Nurse (RN)</option>
                    <option value="Triage Officer">Triage Officer</option>
                    <option value="Lab Specialist">Lab &amp; Pathology Specialist</option>
                    <option value="Hospital Administrator">Hospital Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Department
                  </label>
                  <select
                    value={customDept}
                    onChange={e => setCustomDept(e.target.value as Department)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="Emergency (ER)">Emergency (ER)</option>
                    <option value="Intensive Care (ICU)">Intensive Care (ICU)</option>
                    <option value="General Med-Surg">General Med-Surg</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Surgical Suite (OR)">Surgical Suite (OR)</option>
                    <option value="Pathology & Lab">Pathology &amp; Lab</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
                >
                  Authenticate &amp; Initialize Session
                </button>
              </div>
            </form>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Encrypted HIPAA-ready audit log active</span>
          </div>
          <span className="font-mono text-slate-400">Terminal: MED-STATION-01</span>
        </div>

      </div>
    </div>
  );
};
