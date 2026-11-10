import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Department, LogCategory, LogSeverity, PatientVitals } from '../types/hospital';
import { 
  X, 
  Activity, 
  Pill, 
  ClipboardList, 
  ArrowRightLeft, 
  AlertTriangle, 
  Siren, 
  Check, 
  Heart,
  Thermometer,
  ShieldAlert
} from 'lucide-react';

interface QuickLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPatientId?: string | null;
}

export const QuickLogModal: React.FC<QuickLogModalProps> = ({
  isOpen,
  onClose,
  initialPatientId
}) => {
  const { patients, currentUser, addLog, triggerEmergencyAlert } = useHospital();

  const [activeTab, setActiveTab] = useState<'vitals' | 'medication' | 'sbar' | 'bed' | 'incident' | 'code'>('vitals');

  // Common fields
  const [selectedPatientId, setSelectedPatientId] = useState<string>(
    initialPatientId || (patients[0]?.id || '')
  );

  // Vitals form state
  const selectedPatient = patients.find(p => p.id === selectedPatientId);
  const [hr, setHr] = useState<number>(selectedPatient?.latestVitals?.heartRate || 75);
  const [bpSys, setBpSys] = useState<number>(selectedPatient?.latestVitals?.bloodPressureSys || 120);
  const [bpDia, setBpDia] = useState<number>(selectedPatient?.latestVitals?.bloodPressureDia || 80);
  const [spo2, setSpo2] = useState<number>(selectedPatient?.latestVitals?.oxygenSaturation || 98);
  const [temp, setTemp] = useState<number>(selectedPatient?.latestVitals?.temperature || 37.0);
  const [rr, setRr] = useState<number>(selectedPatient?.latestVitals?.respiratoryRate || 16);
  const [pain, setPain] = useState<number>(selectedPatient?.latestVitals?.painScore || 2);
  const [consciousness, setConsciousness] = useState<PatientVitals['consciousness']>(
    selectedPatient?.latestVitals?.consciousness || 'Alert'
  );
  const [vitalsNotes, setVitalsNotes] = useState('');

  // Medication form state
  const [medName, setMedName] = useState('Ceftriaxone 1g IVPB');
  const [medDosage, setMedDosage] = useState('1000 mg in 50ml NS');
  const [medRoute, setMedRoute] = useState('IV Infusion');
  const [witnessNurse, setWitnessNurse] = useState('Nurse J. Miller, RN (Dual Verified)');
  const [medNotes, setMedNotes] = useState('Infusion running over 30 mins via dedicated lumen.');

  // SBAR form state
  const [sbarSituation, setSbarSituation] = useState('');
  const [sbarBackground, setSbarBackground] = useState('');
  const [sbarAssessment, setSbarAssessment] = useState('');
  const [sbarRecommendation, setSbarRecommendation] = useState('');

  // Bed transfer state
  const [targetDept, setTargetDept] = useState<Department>('General Med-Surg');
  const [targetBed, setTargetBed] = useState('MS-312B');
  const [transferReason, setTransferReason] = useState('Step-down transfer from ICU, hemodynamic stability achieved.');

  // Incident state
  const [incidentType, setIncidentType] = useState('Patient Fall (Unassisted)');
  const [incidentSeverity, setIncidentSeverity] = useState<LogSeverity>('Urgent');
  const [incidentDetails, setIncidentDetails] = useState('');
  const [incidentAction, setIncidentAction] = useState('Immediate vitals assessed, neuro check normal, physician notified.');

  // Emergency Code state
  const [codeType, setCodeType] = useState<'Code Blue' | 'Code Red' | 'Code STEMI' | 'Sepsis Alert' | 'Trauma Level 1'>('Code Blue');
  const [codeLocation, setCodeLocation] = useState('ICU Bed 04');

  if (!isOpen) return null;

  // Submit Vitals
  const handleSubmitVitals = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const isAbnormal = hr > 110 || hr < 50 || bpSys > 150 || bpSys < 90 || spo2 < 92 || temp > 38.3;
    const severity: LogSeverity = isAbnormal ? 'Critical / STAT' : 'Routine';

    addLog({
      category: 'Vitals',
      severity,
      department: selectedPatient.department,
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      bedNumber: selectedPatient.bedNumber,
      summary: `Vitals Recorded: HR ${hr} bpm | BP ${bpSys}/${bpDia} | SpO2 ${spo2}% | Temp ${temp}°C`,
      details: vitalsNotes.trim() 
        ? `${vitalsNotes.trim()} (RR: ${rr} bpm, Pain: ${pain}/10, Consciousness: ${consciousness})`
        : `Patient ${selectedPatient.fullName} vitals logged. RR: ${rr} bpm, Pain scale: ${pain}/10, Consciousness level: ${consciousness}.`,
      metadata: {
        vitals: {
          heartRate: hr,
          bloodPressureSys: bpSys,
          bloodPressureDia: bpDia,
          oxygenSaturation: spo2,
          temperature: temp,
          respiratoryRate: rr,
          painScore: pain,
          consciousness
        }
      }
    });

    onClose();
  };

  // Submit Medication
  const handleSubmitMedication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    addLog({
      category: 'Medication (MAR)',
      severity: 'Routine',
      department: selectedPatient.department,
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      bedNumber: selectedPatient.bedNumber,
      summary: `Administered ${medName} (${medDosage}) via ${medRoute}`,
      details: `${medNotes} Dual verification logged with witness: ${witnessNurse}. Patient ID & allergies cross-checked.`,
      metadata: {
        medication: {
          drugName: medName,
          dosage: medDosage,
          route: medRoute,
          witnessNurse
        }
      }
    });

    onClose();
  };

  // Submit SBAR
  const handleSubmitSbar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sbarSituation.trim()) return;

    addLog({
      category: 'Shift Handover',
      severity: 'Routine',
      department: currentUser?.department || 'Emergency (ER)',
      patientId: selectedPatient?.id,
      patientName: selectedPatient?.fullName,
      bedNumber: selectedPatient?.bedNumber,
      summary: `SBAR Handover Log: ${sbarSituation.slice(0, 70)}...`,
      details: `[Situation]: ${sbarSituation}\n[Background]: ${sbarBackground || 'Standard clinical course'}\n[Assessment]: ${sbarAssessment || 'Monitored'}\n[Recommendation]: ${sbarRecommendation || 'Continue care plan'}`,
      metadata: {
        sbar: {
          situation: sbarSituation,
          background: sbarBackground,
          assessment: sbarAssessment,
          recommendation: sbarRecommendation
        }
      }
    });

    onClose();
  };

  // Submit Bed Transfer
  const handleSubmitBed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    const fromBed = selectedPatient.bedNumber;
    addLog({
      category: 'Bed Transfer',
      severity: 'Routine',
      department: targetDept,
      patientId: selectedPatient.id,
      patientName: selectedPatient.fullName,
      bedNumber: targetBed,
      summary: `Bed Transfer: ${selectedPatient.fullName} moved from ${fromBed} to ${targetBed}`,
      details: `Department: ${targetDept}. Reason: ${transferReason}. Nursing handover completed.`,
      metadata: {
        bedChange: {
          fromBed,
          toBed: targetBed
        }
      }
    });

    onClose();
  };

  // Submit Incident
  const handleSubmitIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incidentDetails.trim()) return;

    addLog({
      category: 'Incident / Safety',
      severity: incidentSeverity,
      department: selectedPatient?.department || currentUser?.department || 'Emergency (ER)',
      patientId: selectedPatient?.id,
      patientName: selectedPatient?.fullName,
      bedNumber: selectedPatient?.bedNumber,
      summary: `INCIDENT REPORT: ${incidentType}`,
      details: `${incidentDetails} Action Taken: ${incidentAction}. Attending Physician & Risk Management notified.`,
      metadata: {
        incident: {
          type: incidentType,
          actionTaken: incidentAction
        }
      }
    });

    onClose();
  };

  // Submit Emergency Code
  const handleSubmitCode = (e: React.FormEvent) => {
    e.preventDefault();
    triggerEmergencyAlert(codeType, codeLocation, selectedPatient?.id, selectedPatient?.fullName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Quick Hospital Action Logger</h2>
              <p className="text-xs text-slate-400">
                Logged by <span className="text-teal-300 font-semibold">{currentUser?.name || 'Staff Member'}</span> • Time: {new Date().toLocaleTimeString()}
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

        {/* Action Tabs */}
        <div className="grid grid-cols-3 sm:grid-cols-6 border-b border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-600">
          <button
            onClick={() => setActiveTab('vitals')}
            className={`py-2.5 px-2 flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'vitals' ? 'border-teal-600 text-teal-700 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Activity className="w-4 h-4 text-rose-500" />
            <span>Vitals</span>
          </button>
          <button
            onClick={() => setActiveTab('medication')}
            className={`py-2.5 px-2 flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'medication' ? 'border-teal-600 text-teal-700 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Pill className="w-4 h-4 text-blue-500" />
            <span>Meds (MAR)</span>
          </button>
          <button
            onClick={() => setActiveTab('sbar')}
            className={`py-2.5 px-2 flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'sbar' ? 'border-teal-600 text-teal-700 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4 text-indigo-500" />
            <span>Handover</span>
          </button>
          <button
            onClick={() => setActiveTab('bed')}
            className={`py-2.5 px-2 flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'bed' ? 'border-teal-600 text-teal-700 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4 text-emerald-500" />
            <span>Transfer</span>
          </button>
          <button
            onClick={() => setActiveTab('incident')}
            className={`py-2.5 px-2 flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'incident' ? 'border-teal-600 text-teal-700 bg-white' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Incident</span>
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`py-2.5 px-2 flex flex-col items-center gap-1 border-b-2 transition-colors ${
              activeTab === 'code' ? 'border-rose-600 text-rose-700 bg-rose-50/50' : 'border-transparent hover:text-rose-600'
            }`}
          >
            <Siren className="w-4 h-4 text-rose-600 animate-pulse" />
            <span>Code Alert</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Patient Selector for patient-bound tabs */}
          {activeTab !== 'code' && (
            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
                  Target Inpatient (MRN)
                </label>
                <select
                  value={selectedPatientId}
                  onChange={e => setSelectedPatientId(e.target.value)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.fullName} ({p.id}) — {p.bedNumber} [{p.department}]
                    </option>
                  ))}
                </select>
              </div>

              {selectedPatient && (
                <div className="text-xs text-slate-500 space-y-0.5">
                  <div>
                    <span className="font-semibold text-slate-700">Diagnosis:</span> {selectedPatient.primaryDiagnosis}
                  </div>
                  <div>
                    <span className="font-semibold text-rose-600">Allergies:</span> {selectedPatient.allergies.join(', ') || 'NKDA'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 1: VITALS FORM */}
          {activeTab === 'vitals' && (
            <form onSubmit={handleSubmitVitals} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-rose-50/50 border border-rose-200/80 p-2.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 mb-1">
                    <Heart className="w-3.5 h-3.5 text-rose-600" /> Heart Rate (bpm)
                  </div>
                  <input
                    type="number"
                    min="30"
                    max="220"
                    required
                    value={hr}
                    onChange={e => setHr(Number(e.target.value))}
                    className="w-full text-base font-bold text-slate-900 bg-white border border-rose-200 rounded px-2 py-1"
                  />
                  <div className="text-[10px] text-rose-600/80 mt-0.5">Normal: 60-100</div>
                </div>

                <div className="bg-blue-50/50 border border-blue-200/80 p-2.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-blue-800 mb-1">
                    <Activity className="w-3.5 h-3.5 text-blue-600" /> BP (Sys / Dia)
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="50"
                      max="250"
                      required
                      value={bpSys}
                      onChange={e => setBpSys(Number(e.target.value))}
                      className="w-1/2 text-sm font-bold text-slate-900 bg-white border border-blue-200 rounded px-1.5 py-1 text-center"
                    />
                    <span className="text-slate-400">/</span>
                    <input
                      type="number"
                      min="30"
                      max="150"
                      required
                      value={bpDia}
                      onChange={e => setBpDia(Number(e.target.value))}
                      className="w-1/2 text-sm font-bold text-slate-900 bg-white border border-blue-200 rounded px-1.5 py-1 text-center"
                    />
                  </div>
                  <div className="text-[10px] text-blue-600/80 mt-0.5">Target: 120/80</div>
                </div>

                <div className="bg-teal-50/50 border border-teal-200/80 p-2.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800 mb-1">
                    <Activity className="w-3.5 h-3.5 text-teal-600" /> SpO2 (%)
                  </div>
                  <input
                    type="number"
                    min="70"
                    max="100"
                    required
                    value={spo2}
                    onChange={e => setSpo2(Number(e.target.value))}
                    className="w-full text-base font-bold text-slate-900 bg-white border border-teal-200 rounded px-2 py-1"
                  />
                  <div className="text-[10px] text-teal-600/80 mt-0.5">Target: 95-100%</div>
                </div>

                <div className="bg-amber-50/50 border border-amber-200/80 p-2.5 rounded-xl">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                    <Thermometer className="w-3.5 h-3.5 text-amber-600" /> Temp (°C)
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="34"
                    max="43"
                    required
                    value={temp}
                    onChange={e => setTemp(Number(e.target.value))}
                    className="w-full text-base font-bold text-slate-900 bg-white border border-amber-200 rounded px-2 py-1"
                  />
                  <div className="text-[10px] text-amber-600/80 mt-0.5">Norm: 36.5 - 37.5</div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Respiratory Rate (breaths/min)</label>
                  <input
                    type="number"
                    min="8"
                    max="50"
                    value={rr}
                    onChange={e => setRr(Number(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Pain Score (0 - 10)</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={pain}
                    onChange={e => setPain(Number(e.target.value))}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Consciousness / AVPU</label>
                  <select
                    value={consciousness}
                    onChange={e => setConsciousness(e.target.value as PatientVitals['consciousness'])}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Alert">Alert (A)</option>
                    <option value="Verbal">Verbal (V)</option>
                    <option value="Pain">Pain (P)</option>
                    <option value="Unresponsive">Unresponsive (U)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Observations / Nursing Notes</label>
                <textarea
                  rows={2}
                  placeholder="Optional bedside assessment observations, telemetry rhythm, or patient complaints..."
                  value={vitalsNotes}
                  onChange={e => setVitalsNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm">
                  Commit Vital Signs Log
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: MEDICATION FORM */}
          {activeTab === 'medication' && (
            <form onSubmit={handleSubmitMedication} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Medication Name</label>
                  <input
                    type="text"
                    required
                    value={medName}
                    onChange={e => setMedName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dosage</label>
                  <input
                    type="text"
                    required
                    value={medDosage}
                    onChange={e => setMedDosage(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Administration Route</label>
                  <select
                    value={medRoute}
                    onChange={e => setMedRoute(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="IV Infusion">IV Infusion (Continuous / Piggyback)</option>
                    <option value="IV Push">IV Push</option>
                    <option value="Oral (PO)">Oral (PO)</option>
                    <option value="Subcutaneous (SubQ)">Subcutaneous (SubQ)</option>
                    <option value="Intramuscular (IM)">Intramuscular (IM)</option>
                    <option value="Inhalation / Nebulizer">Inhalation / Nebulizer</option>
                    <option value="Topical / Transdermal">Topical / Transdermal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Dual-Nurse Witness Sign-off</label>
                  <input
                    type="text"
                    required
                    value={witnessNurse}
                    onChange={e => setWitnessNurse(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Administration Notes &amp; Tolerance</label>
                <textarea
                  rows={2}
                  value={medNotes}
                  onChange={e => setMedNotes(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm">
                  Record Medication Log (MAR)
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SBAR SHIFT HANDOVER */}
          {activeTab === 'sbar' && (
            <form onSubmit={handleSubmitSbar} className="space-y-3">
              <p className="text-xs text-slate-500">
                SBAR protocol ensures seamless transition of care between clinical shifts.
              </p>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  [S] Situation <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Immediate problem, census changes, or patient status..."
                  value={sbarSituation}
                  onChange={e => setSbarSituation(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">[B] Background</label>
                <textarea
                  rows={2}
                  placeholder="Relevant clinical history, allergies, surgical timeline..."
                  value={sbarBackground}
                  onChange={e => setSbarBackground(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">[A] Assessment</label>
                <textarea
                  rows={2}
                  placeholder="Clinical assessment, trends, pending lab tests, telemetry..."
                  value={sbarAssessment}
                  onChange={e => setSbarAssessment(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">[R] Recommendation</label>
                <input
                  type="text"
                  placeholder="Action items for oncoming shift, watchlists, discharge prep..."
                  value={sbarRecommendation}
                  onChange={e => setSbarRecommendation(e.target.value)}
                  className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm">
                  Publish SBAR Handover Log
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: BED TRANSFER */}
          {activeTab === 'bed' && (
            <form onSubmit={handleSubmitBed} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Department</label>
                  <select
                    value={targetDept}
                    onChange={e => setTargetDept(e.target.value as Department)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Emergency (ER)">Emergency (ER)</option>
                    <option value="Intensive Care (ICU)">Intensive Care (ICU)</option>
                    <option value="General Med-Surg">General Med-Surg</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Surgical Suite (OR)">Surgical Suite (OR)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Destination Bed Number</label>
                  <input
                    type="text"
                    required
                    value={targetBed}
                    onChange={e => setTargetBed(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Transfer Rationale</label>
                <textarea
                  rows={2}
                  required
                  value={transferReason}
                  onChange={e => setTransferReason(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm">
                  Commit Bed Relocation Log
                </button>
              </div>
            </form>
          )}

          {/* TAB 5: INCIDENT REPORT */}
          {activeTab === 'incident' && (
            <form onSubmit={handleSubmitIncident} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Category</label>
                  <select
                    value={incidentType}
                    onChange={e => setIncidentType(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Patient Fall (Unassisted)">Patient Fall (Unassisted)</option>
                    <option value="Medication Near-Miss / Error">Medication Near-Miss / Error</option>
                    <option value="Adverse Drug Reaction">Adverse Drug Reaction</option>
                    <option value="Medical Equipment Malfunction">Medical Equipment Malfunction</option>
                    <option value="Specimen Labeling Discrepancy">Specimen Labeling Discrepancy</option>
                    <option value="Unplanned Extubation / IV Infiltration">Unplanned Extubation / IV Infiltration</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Severity Rating</label>
                  <select
                    value={incidentSeverity}
                    onChange={e => setIncidentSeverity(e.target.value as LogSeverity)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Routine">Minor / Near Miss (Routine)</option>
                    <option value="Urgent">Moderate / Requires Intervention (Urgent)</option>
                    <option value="Critical / STAT">Sentinel / Critical Harm (STAT)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Incident Description</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Objective description of event, patient condition, time occurred..."
                  value={incidentDetails}
                  onChange={e => setIncidentDetails(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Immediate Corrective Action</label>
                <input
                  type="text"
                  required
                  value={incidentAction}
                  onChange={e => setIncidentAction(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm">
                  Log Safety Incident
                </button>
              </div>
            </form>
          )}

          {/* TAB 6: EMERGENCY CODE ACTIVATION */}
          {activeTab === 'code' && (
            <form onSubmit={handleSubmitCode} className="space-y-4">
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-rose-800">
                  <div className="font-bold">Hospital-Wide Emergency Broadcast Protocol</div>
                  Triggering an emergency code alerts rapid response teams, pages on-call physicians, and broadcasts to ward telemetry boards.
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Select Emergency Code</label>
                  <select
                    value={codeType}
                    onChange={e => setCodeType(e.target.value as any)}
                    className="w-full text-xs font-bold px-3 py-2 rounded-lg border border-rose-300 bg-white text-rose-700"
                  >
                    <option value="Code Blue">CODE BLUE (Cardiac / Respiratory Arrest)</option>
                    <option value="Sepsis Alert">SEPSIS ALERT (Severe Sepsis Protocol)</option>
                    <option value="Code STEMI">CODE STEMI (Acute Myocardial Infarction)</option>
                    <option value="Trauma Level 1">TRAUMA LEVEL 1 (Massive Influx / Resuscitation)</option>
                    <option value="Code Red">CODE RED (Fire / Smoke Alarm)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Location / Ward Bay</label>
                  <input
                    type="text"
                    required
                    value={codeLocation}
                    onChange={e => setCodeLocation(e.target.value)}
                    className="w-full text-xs font-semibold px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 text-xs font-medium text-slate-600">Cancel</button>
                <button type="submit" className="px-5 py-2 text-xs font-extrabold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-md shadow-rose-600/30 flex items-center gap-2">
                  <Siren className="w-4 h-4 animate-pulse" />
                  INITIATE EMERGENCY CODE
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
