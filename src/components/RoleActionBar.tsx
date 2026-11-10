import React from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Stethoscope, 
  Syringe, 
  Siren, 
  Scissors, 
  FlaskConical, 
  ShieldCheck, 
  PlusCircle, 
  Activity, 
  Pill, 
  ClipboardList, 
  ArrowRightLeft, 
  FileText, 
  Download,
  AlertTriangle,
  Heart
} from 'lucide-react';

interface RoleActionBarProps {
  onOpenQuickLog: () => void;
  onOpenAdmitModal?: () => void;
  onOpenDeployModal?: () => void;
}

export const RoleActionBar: React.FC<RoleActionBarProps> = ({
  onOpenQuickLog,
  onOpenDeployModal
}) => {
  const { currentUser, addLog } = useHospital();

  if (!currentUser) return null;

  const role = currentUser.portalType || 'doctor';

  const roleConfigs = {
    doctor: {
      badge: 'Physician Portal',
      badgeBg: 'bg-teal-500/10 text-teal-700 border-teal-200',
      icon: <Stethoscope className="w-5 h-5 text-teal-600" />,
      tagline: 'Attending Physician Workspace • Clinical Orders & Diagnoses',
      actions: [
        { label: '+ Log Physician Order', action: onOpenQuickLog, icon: <FileText className="w-3.5 h-3.5" /> },
        { label: '+ SBAR Shift Handover', action: onOpenQuickLog, icon: <ClipboardList className="w-3.5 h-3.5" /> },
        { 
          label: 'Rapid Ward Round Note', 
          action: () => {
            addLog({
              category: 'Clinical Note',
              severity: 'Routine',
              department: currentUser.department,
              summary: `Attending Physician Round: Dr. ${currentUser.name.split(',')[0]}`,
              details: 'Morning physician rounds completed. Patient treatment plan progressing as expected. Antibiotic coverage and fluids titrated.',
            });
          }, 
          icon: <Activity className="w-3.5 h-3.5" /> 
        }
      ]
    },
    nurse: {
      badge: 'Nursing & MAR Portal',
      badgeBg: 'bg-blue-500/10 text-blue-700 border-blue-200',
      icon: <Syringe className="w-5 h-5 text-blue-600" />,
      tagline: 'Bedside Nursing & MAR Workspace • Vitals & Medication Record',
      actions: [
        { label: '+ Record Bedside Vitals', action: onOpenQuickLog, icon: <Heart className="w-3.5 h-3.5" /> },
        { label: '+ MAR Medication Admin', action: onOpenQuickLog, icon: <Pill className="w-3.5 h-3.5" /> },
        { 
          label: 'Hourly Safety Check', 
          action: () => {
            addLog({
              category: 'Clinical Note',
              severity: 'Routine',
              department: currentUser.department,
              summary: `Hourly Patient Safety Round - ${currentUser.name}`,
              details: 'Call light within reach. Bed in lowest position with brakes locked. Telemetry leads securely attached. 4 Ps verified (Pain, Position, Potty, Possessions).',
            });
          }, 
          icon: <Activity className="w-3.5 h-3.5" /> 
        }
      ]
    },
    triage: {
      badge: 'Triage & Intake Portal',
      badgeBg: 'bg-amber-500/10 text-amber-700 border-amber-200',
      icon: <Siren className="w-5 h-5 text-amber-600" />,
      tagline: 'Emergency Triage Console • ESI Acuity Scoring & Patient Intake',
      actions: [
        { label: '+ Rapid Patient Intake', action: onOpenQuickLog, icon: <PlusCircle className="w-3.5 h-3.5" /> },
        { label: '+ Bed / Bay Transfer', action: onOpenQuickLog, icon: <ArrowRightLeft className="w-3.5 h-3.5" /> },
        { 
          label: 'Triage Census Sweep', 
          action: () => {
            addLog({
              category: 'Admission & Triage',
              severity: 'Routine',
              department: 'Emergency (ER)',
              summary: `Triage Census Sweep Logged by ${currentUser.name}`,
              details: 'Waiting room census audited. 3 patients awaiting physician evaluation. All waiting room patients reassessed; vitals stable.',
            });
          }, 
          icon: <Activity className="w-3.5 h-3.5" /> 
        }
      ]
    },
    surgeon: {
      badge: 'Surgical Suite & OR Portal',
      badgeBg: 'bg-rose-500/10 text-rose-700 border-rose-200',
      icon: <Scissors className="w-5 h-5 text-rose-600" />,
      tagline: 'Surgical & Operative Console • Post-Op Recovery & PACU Transfers',
      actions: [
        { label: '+ Operative Note Log', action: onOpenQuickLog, icon: <FileText className="w-3.5 h-3.5" /> },
        { label: '+ PACU Bed Transfer', action: onOpenQuickLog, icon: <ArrowRightLeft className="w-3.5 h-3.5" /> },
        { 
          label: 'Surgical Safety Time-Out', 
          action: () => {
            addLog({
              category: 'Clinical Note',
              severity: 'Routine',
              department: 'Surgical Suite (OR)',
              summary: `WHO Surgical Safety Time-Out Logged by ${currentUser.name}`,
              details: 'Surgical time-out verified prior to incision. Correct patient, site, procedure, and consent confirmed by entire surgical team.',
            });
          }, 
          icon: <ShieldCheck className="w-3.5 h-3.5" /> 
        }
      ]
    },
    lab: {
      badge: 'Diagnostic Lab Portal',
      badgeBg: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
      icon: <FlaskConical className="w-5 h-5 text-cyan-600" />,
      tagline: 'Pathology & Diagnostic Terminal • Critical Value Alerts',
      actions: [
        { 
          label: '+ Log Critical Lab Result', 
          action: () => {
            addLog({
              category: 'Lab Result',
              severity: 'Critical / STAT',
              department: 'Pathology & Lab',
              summary: 'STAT CRITICAL LAB ALERT: Troponin I 2.45 ng/mL & Blood Gas pH 7.24',
              details: `Critical laboratory value verified by ${currentUser.name}. Urgent telephone read-back completed with unit charge nurse. Sepsis / Cardiac protocol active.`,
            });
          }, 
          icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> 
        },
        { label: '+ Clinical Note', action: onOpenQuickLog, icon: <FileText className="w-3.5 h-3.5" /> }
      ]
    },
    admin: {
      badge: 'Compliance & Admin Portal',
      badgeBg: 'bg-purple-500/10 text-purple-700 border-purple-200',
      icon: <ShieldCheck className="w-5 h-5 text-purple-600" />,
      tagline: 'Hospital Governance & Compliance • Joint Commission Audit Ready',
      actions: [
        { label: 'Deployment & Setup Hub', action: onOpenDeployModal || onOpenQuickLog, icon: <ShieldCheck className="w-3.5 h-3.5" /> },
        { 
          label: 'Audit Trail Integrity Scan', 
          action: () => {
            addLog({
              category: 'Access & Security',
              severity: 'Security',
              department: 'General Med-Surg',
              summary: `Automated HIPAA Audit Integrity Verification: PASSED`,
              details: `All clinical records, medication logs, and user sessions verified cryptographically by ${currentUser.name}. Zero tamper anomalies detected.`,
            });
          }, 
          icon: <Activity className="w-3.5 h-3.5" /> 
        }
      ]
    }
  };

  const config = roleConfigs[role] || roleConfigs.doctor;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Left: Role identity */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
            {config.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border ${config.badgeBg}`}>
                {config.badge}
              </span>
              <span className="text-xs font-bold text-slate-800">
                {currentUser.name}
              </span>
              <span className="text-xs font-mono text-slate-400">
                ({currentUser.badgeNumber})
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {config.tagline}
            </p>
          </div>
        </div>

        {/* Right: Quick Role Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {config.actions.map((act, index) => (
            <button
              key={index}
              onClick={act.action}
              className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              {act.icon}
              <span>{act.label}</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
};
