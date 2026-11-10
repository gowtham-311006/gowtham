import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { StaffMember, PortalType } from '../types/hospital';
import { 
  Stethoscope, 
  Syringe, 
  Siren, 
  FlaskConical, 
  Scissors, 
  ShieldCheck, 
  UserCheck, 
  KeyRound, 
  CreditCard, 
  Lock, 
  ArrowRight, 
  Activity, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Zap
} from 'lucide-react';

interface PortalConfig {
  type: PortalType;
  title: string;
  role: string;
  color: string;
  badgeBg: string;
  borderColor: string;
  hoverBorder: string;
  icon: React.ReactNode;
  description: string;
  features: string[];
  staffId: string;
  badge: string;
  pin: string;
}

const PORTALS: PortalConfig[] = [
  {
    type: 'doctor',
    title: 'Physician & Doctor Portal',
    role: 'Attending Physician / MD',
    color: 'text-teal-600',
    badgeBg: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
    borderColor: 'border-teal-500/30',
    hoverBorder: 'hover:border-teal-400 hover:shadow-teal-500/10',
    icon: <Stethoscope className="w-6 h-6 text-teal-400" />,
    description: 'Physician diagnosis orders, clinical notes, SBAR handover, and patient discharge authorization.',
    features: ['Clinical Diagnoses', 'Prescription Orders', 'Discharge Authorization', 'SBAR Transition'],
    staffId: 'staff-01',
    badge: 'MD-8842',
    pin: '8842'
  },
  {
    type: 'nurse',
    title: 'Nursing & Bedside MAR Portal',
    role: 'Registered Nurse (BSN, RN)',
    color: 'text-blue-600',
    badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    borderColor: 'border-blue-500/30',
    hoverBorder: 'hover:border-blue-400 hover:shadow-blue-500/10',
    icon: <Syringe className="w-6 h-6 text-blue-400" />,
    description: 'Hourly bedside vitals recording, Medication Administration Record (MAR), and dual-nurse witness signoffs.',
    features: ['Bedside Vitals Stream', 'MAR Medication Admin', 'Dual Witness Sign-off', 'Shift Safety Rounds'],
    staffId: 'staff-02',
    badge: 'RN-3091',
    pin: '3091'
  },
  {
    type: 'triage',
    title: 'Emergency Triage & Intake Portal',
    role: 'Triage Officer / Paramedic',
    color: 'text-amber-600',
    badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    borderColor: 'border-amber-500/30',
    hoverBorder: 'hover:border-amber-400 hover:shadow-amber-500/10',
    icon: <Siren className="w-6 h-6 text-amber-400" />,
    description: 'Rapid emergency intake, ESI Level 1–5 triage acuity scoring, and instant bed/bay allocation.',
    features: ['ESI Acuity Scoring', 'Rapid Patient Intake', 'ER Bay Allocation', 'Urgent Ambulance Dispatch'],
    staffId: 'staff-04',
    badge: 'TRI-5520',
    pin: '5520'
  },
  {
    type: 'surgeon',
    title: 'Surgical Suite & OR Portal',
    role: 'Consultant Surgeon (FACS)',
    color: 'text-rose-600',
    badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    borderColor: 'border-rose-500/30',
    hoverBorder: 'hover:border-rose-400 hover:shadow-rose-500/10',
    icon: <Scissors className="w-6 h-6 text-rose-400" />,
    description: 'Operative notes, surgical case logs, PACU recovery transfers, and emergency trauma consults.',
    features: ['Operative Note Logging', 'PACU Transfers', 'Surgical Consent', 'Stat OR Activation'],
    staffId: 'staff-03',
    badge: 'SURG-1104',
    pin: '1104'
  },
  {
    type: 'lab',
    title: 'Pathology & Diagnostic Lab Portal',
    role: 'Lab Specialist / MLS',
    color: 'text-cyan-600',
    badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    borderColor: 'border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-400 hover:shadow-cyan-500/10',
    icon: <FlaskConical className="w-6 h-6 text-cyan-400" />,
    description: 'Critical lab values, blood gases, toxicology panels, and urgent physician telephone read-back alerts.',
    features: ['Post Lab Results', 'Critical Value Alerts', 'Specimen Verification', 'Blood Bank Dispatch'],
    staffId: 'staff-05',
    badge: 'LAB-7741',
    pin: '7741'
  },
  {
    type: 'admin',
    title: 'Administrator & Compliance Portal',
    role: 'Hospital Administrator (MHA)',
    color: 'text-purple-600',
    badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    borderColor: 'border-purple-500/30',
    hoverBorder: 'hover:border-purple-400 hover:shadow-purple-500/10',
    icon: <ShieldCheck className="w-6 h-6 text-purple-400" />,
    description: 'Full HIPAA audit trail inspection, user security monitoring, CSV/JSON compliance exports, and system reset.',
    features: ['Full Audit Trail', 'Export Compliance Data', 'Security Access Logs', 'Workstation Governance'],
    staffId: 'staff-06',
    badge: 'ADM-0021',
    pin: '0021'
  }
];

export const SeparateLoginScreen: React.FC = () => {
  const { staffList, loginAsStaff, loginWithCredentials, customLogin } = useHospital();

  const [selectedPortal, setSelectedPortal] = useState<PortalConfig>(PORTALS[0]);
  const [pinInput, setPinInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'portals' | 'custom' | 'rfid'>('portals');

  // Custom login state
  const [customBadge, setCustomBadge] = useState('');
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState<StaffMember['role']>('Doctor');
  const [customDept, setCustomDept] = useState<StaffMember['department']>('Emergency (ER)');

  // RFID simulation state
  const [isScanningRfid, setIsScanningRfid] = useState(false);
  const [rfidSuccess, setRfidSuccess] = useState<string | null>(null);

  const matchedStaff = staffList.find(s => s.id === selectedPortal.staffId) || staffList[0];

  const handleInstantSignIn = (portal: PortalConfig) => {
    loginAsStaff(portal.staffId);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const result = loginWithCredentials(matchedStaff.badgeNumber, pinInput);
    if (!result.success) {
      setErrorMessage(result.message || 'Authentication failed');
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customBadge.trim() || !customName.trim()) return;
    customLogin(customBadge, customName, customRole, customDept);
  };

  const handleSimulateRfid = (portal: PortalConfig) => {
    setIsScanningRfid(true);
    setRfidSuccess(null);
    setTimeout(() => {
      loginAsStaff(portal.staffId);
      setIsScanningRfid(false);
      setRfidSuccess(`RFID Verified: ${portal.title}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-teal-500 selection:text-slate-950">
      
      {/* Top Station Header */}
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center shadow-inner">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-white">MedLogix</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30">
                Staff Gateway
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              St. Jude's Metropolitan Hospital • Terminal Station WS-04
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/80">
            <Clock className="w-3.5 h-3.5 text-teal-400" />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 text-emerald-400 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>256-Bit SSL Workstation</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col justify-center">
        
        {/* Title & Gateway Intro */}
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Hospital Staff Login Portals
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Select your clinical department to enter a dedicated portal with role-specific logging tools, bedside MAR records, and audit capabilities.
          </p>

          {/* Login Mode Switcher */}
          <div className="inline-flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 mt-4 gap-1">
            <button
              onClick={() => setActiveTab('portals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'portals'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Separate Clinical Portals (6)</span>
            </button>
            <button
              onClick={() => setActiveTab('rfid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'rfid'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Badge / RFID Tap</span>
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'custom'
                  ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Custom Staff ID</span>
            </button>
          </div>
        </div>

        {/* TAB 1: SEPARATE CLINICAL PORTALS */}
        {activeTab === 'portals' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left 6-card selection grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {PORTALS.map(portal => {
                const isSelected = selectedPortal.type === portal.type;
                const staff = staffList.find(s => s.id === portal.staffId);

                return (
                  <div
                    key={portal.type}
                    onClick={() => { setSelectedPortal(portal); setErrorMessage(null); setPinInput(''); }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? `bg-slate-900 border-teal-500 shadow-xl shadow-teal-500/10 ring-2 ring-teal-500/30`
                        : `bg-slate-900/50 border-slate-800 ${portal.hoverBorder} hover:bg-slate-900/80`
                    }`}
                  >
                    <div>
                      {/* Top icon and badge */}
                      <div className="flex items-center justify-between mb-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${portal.badgeBg}`}>
                          {portal.icon}
                        </div>
                        <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {portal.badge}
                        </span>
                      </div>

                      {/* Portal title & role */}
                      <h3 className="font-bold text-sm text-white">
                        {portal.title}
                      </h3>
                      <div className="text-xs text-teal-400 font-medium mt-0.5">
                        {staff?.name || portal.role}
                      </div>

                      <p className="text-[11px] text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {portal.description}
                      </p>

                      {/* Capabilities pill tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {portal.features.slice(0, 2).map((feat, i) => (
                          <span key={i} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/60">
                            ✓ {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick 1-Click Access Button on each card */}
                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">
                        PIN: <strong className="text-slate-400">{portal.pin}</strong>
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInstantSignIn(portal);
                        }}
                        className="text-xs font-bold text-teal-300 hover:text-white bg-teal-500/20 hover:bg-teal-500 px-3 py-1.5 rounded-lg border border-teal-500/40 hover:text-slate-950 transition-all flex items-center gap-1 shadow-xs"
                      >
                        <span>Instant Sign In</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Right: Selected Portal Authentication Terminal */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex items-center gap-3 pb-4 border-b border-slate-800">
                <img
                  src={matchedStaff.avatar}
                  alt={matchedStaff.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-teal-500/40 shadow-md"
                />
                <div>
                  <span className="text-[10px] font-bold tracking-widest text-teal-400 uppercase">
                    {selectedPortal.title}
                  </span>
                  <h3 className="text-base font-bold text-white">{matchedStaff.name}</h3>
                  <div className="text-xs text-slate-400">{matchedStaff.department} • Badge <span className="font-mono text-slate-200">{matchedStaff.badgeNumber}</span></div>
                </div>
              </div>

              {/* Special Permissions Box */}
              <div className="py-4">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Authorized Clinical Permissions:
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {selectedPortal.features.map((feat, idx) => (
                    <div key={idx} className="bg-slate-800/80 p-2 rounded-lg border border-slate-700/70 text-slate-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form 1: PIN Verification */}
              <form onSubmit={handlePinSubmit} className="space-y-4 pt-2 border-t border-slate-800">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-teal-400" />
                      Security PIN Entry
                    </label>
                    <span className="text-[11px] text-teal-400 font-mono">
                      (Demo PIN: <strong>{selectedPortal.pin}</strong> or <strong>1234</strong>)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      maxLength={6}
                      placeholder="Enter 4-digit PIN..."
                      value={pinInput}
                      onChange={e => setPinInput(e.target.value)}
                      className="flex-1 bg-slate-800 border border-slate-700 text-white font-mono text-center tracking-widest text-base py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-500/20"
                    >
                      Verify PIN &rarr;
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="flex items-center gap-1.5 text-xs text-rose-400 mt-2 bg-rose-950/40 p-2 rounded-lg border border-rose-800/50">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}
                </div>

                {/* 1-Click bypass button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => handleInstantSignIn(selectedPortal)}
                    className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Enter {selectedPortal.title} (1-Click Instant Login)</span>
                  </button>
                </div>
              </form>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Shift: {matchedStaff.activeShift.split(' ')[0]}</span>
                <span className="font-mono">License: {matchedStaff.licenseNumber}</span>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: RFID BADGE TAP */}
        {activeTab === 'rfid' && (
          <div className="max-w-xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-2xl">
            <div className="relative inline-block mb-4">
              <div className={`w-24 h-24 rounded-3xl flex items-center justify-center transition-all ${
                isScanningRfid
                  ? 'bg-blue-600 text-white animate-pulse shadow-lg shadow-blue-500/40 ring-4 ring-blue-500/20'
                  : rfidSuccess
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-teal-400 border border-slate-700'
              }`}>
                <CreditCard className="w-12 h-12" />
              </div>
            </div>

            <h3 className="text-lg font-bold text-white">
              {isScanningRfid ? 'Scanning Hospital Contactless Badge...' : rfidSuccess ? rfidSuccess : 'Contactless RFID Smartcard Reader'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto mb-6">
              Hold physical hospital RFID badge near terminal reader. Simulates contactless near-field badge authentication.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {PORTALS.map(portal => (
                <button
                  key={portal.type}
                  disabled={isScanningRfid}
                  onClick={() => handleSimulateRfid(portal)}
                  className="p-3 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-between transition-colors disabled:opacity-50"
                >
                  <div className="overflow-hidden mr-2">
                    <div className="text-xs font-bold text-white truncate">{portal.title}</div>
                    <div className="text-[10px] text-teal-400 font-mono">{portal.badge}</div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-1 rounded bg-teal-500/20 text-teal-300 shrink-0">
                    Tap &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOM CREDENTIALS */}
        {activeTab === 'custom' && (
          <div className="max-w-xl mx-auto w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
              <KeyRound className="w-5 h-5 text-teal-400" />
              Register or Log In with Custom Staff Credentials
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Visiting physicians, registry nurses, and consulting surgeons can sign in with custom credentials.
            </p>

            <form onSubmit={handleCustomSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Full Staff Name &amp; Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Jordan Hayes, MD"
                    value={customName}
                    onChange={e => setCustomName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Hospital Badge / ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VIS-9021"
                    value={customBadge}
                    onChange={e => setCustomBadge(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Role</label>
                  <select
                    value={customRole}
                    onChange={e => setCustomRole(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Doctor">Doctor (Physician)</option>
                    <option value="Surgeon">Surgeon</option>
                    <option value="Registered Nurse">Registered Nurse (RN)</option>
                    <option value="Head Nurse">Head Nurse</option>
                    <option value="Triage Officer">Triage Officer</option>
                    <option value="Lab Specialist">Lab Specialist</option>
                    <option value="Hospital Administrator">Hospital Administrator</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Assigned Department</label>
                  <select
                    value={customDept}
                    onChange={e => setCustomDept(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
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

              <button
                type="submit"
                className="w-full py-3 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl shadow-md transition-all mt-2"
              >
                Authenticate &amp; Launch Custom Workstation
              </button>
            </form>
          </div>
        )}

      </main>

      {/* Footer info */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 px-6 py-4 text-center text-xs text-slate-500">
        MedLogix Enterprise Hospital Logging System • Joint Commission &amp; HIPAA Security Rule Compliant
      </footer>

    </div>
  );
};
