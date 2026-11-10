import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Patient, Department } from '../types/hospital';
import { 
  Bed, 
  Heart, 
  Activity, 
  Thermometer, 
  Plus, 
  Filter, 
  UserPlus, 
  FileText, 
  AlertCircle, 
  Clock,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface PatientBoardProps {
  onQuickLogForPatient: (patientId: string) => void;
}

export const PatientBoard: React.FC<PatientBoardProps> = ({ onQuickLogForPatient }) => {
  const { 
    patients, 
    selectedPatientId, 
    setSelectedPatientId, 
    addPatient, 
    currentUser 
  } = useHospital();

  const [showAdmitModal, setShowAdmitModal] = useState(false);

  // New patient state
  const [name, setName] = useState('');
  const [age, setAge] = useState<number>(45);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [dept, setDept] = useState<Department>('Emergency (ER)');
  const [bedNumber, setBedNumber] = useState('ER-Bay-05');
  const [diagnosis, setDiagnosis] = useState('');
  const [triage, setTriage] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [allergiesText, setAllergiesText] = useState('None known');

  const handleAdmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !diagnosis.trim()) return;

    const newPatient: Patient = {
      id: `MRN-${Math.floor(100000 + Math.random() * 900000)}`,
      fullName: name.trim(),
      age,
      gender,
      department: dept,
      bedNumber,
      admissionDate: new Date().toISOString(),
      primaryDiagnosis: diagnosis.trim(),
      attendingDoctor: currentUser?.name || 'Dr. Gowtham Chand, MD',
      allergies: allergiesText.split(',').map(s => s.trim()).filter(Boolean),
      triageLevel: triage,
      status: triage <= 2 ? 'Observation' : 'Inpatient',
      latestVitals: {
        heartRate: 76,
        bloodPressureSys: 122,
        bloodPressureDia: 78,
        oxygenSaturation: 98,
        temperature: 37.0,
        respiratoryRate: 16,
        painScore: 2,
        consciousness: 'Alert'
      }
    };

    addPatient(newPatient);
    setShowAdmitModal(false);
    setName('');
    setDiagnosis('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 mb-6">
      
      {/* Board Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Bed className="w-5 h-5 text-teal-600" />
              Active Ward Inpatients &amp; Bed Occupancy
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-600">
              {patients.length} Occupied Beds
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time patient telemetry, ESI triage status, and direct clinical log filtering
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedPatientId && (
            <button
              onClick={() => setSelectedPatientId(null)}
              className="text-xs px-3 py-1.5 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 font-semibold hover:bg-teal-100 transition-colors flex items-center gap-1.5"
            >
              <span>Showing: {selectedPatientId}</span>
              <span className="font-bold">&times; Clear</span>
            </button>
          )}

          <button
            onClick={() => setShowAdmitModal(true)}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <UserPlus className="w-3.5 h-3.5 text-teal-400" />
            <span>Admit New Patient</span>
          </button>
        </div>
      </div>

      {/* Patients Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map(patient => {
          const isSelected = selectedPatientId === patient.id;
          const vitals = patient.latestVitals;
          
          // Triage badge styles
          const triageColors = {
            1: 'bg-rose-600 text-white border-rose-700',
            2: 'bg-orange-500 text-white border-orange-600',
            3: 'bg-amber-500 text-white border-amber-600',
            4: 'bg-emerald-600 text-white border-emerald-700',
            5: 'bg-blue-600 text-white border-blue-700'
          }[patient.triageLevel];

          return (
            <div
              key={patient.id}
              className={`rounded-xl border p-4 transition-all relative flex flex-col justify-between ${
                isSelected 
                  ? 'border-teal-500 bg-teal-50/40 ring-2 ring-teal-500/20 shadow-md' 
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-xs bg-white'
              }`}
            >
              {/* Top: Bed & Triage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-900 text-teal-300">
                      {patient.bedNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      {patient.department.split(' ')[0]}
                    </span>
                  </div>

                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${triageColors}`}>
                    ESI {patient.triageLevel}
                  </span>
                </div>

                {/* Name & MRN */}
                <div className="mb-2">
                  <h3 className="font-bold text-sm text-slate-900 flex items-center justify-between">
                    <span>{patient.fullName}</span>
                    <span className="text-[11px] font-normal text-slate-500">
                      {patient.age}y • {patient.gender}
                    </span>
                  </h3>
                  <div className="font-mono text-[11px] text-teal-700 font-semibold">
                    {patient.id}
                  </div>
                </div>

                {/* Diagnosis */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-slate-50 p-2 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700">Diagnosis:</span> {patient.primaryDiagnosis}
                </p>

                {/* Vitals summary bar */}
                {vitals && (
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-100/70 p-2 rounded-lg text-center mb-3 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-center gap-0.5">
                        <Heart className="w-2.5 h-2.5 text-rose-500" /> HR
                      </div>
                      <div className={`font-bold ${vitals.heartRate > 105 ? 'text-rose-600 font-extrabold' : 'text-slate-800'}`}>
                        {vitals.heartRate} <span className="text-[9px] font-normal text-slate-500">bpm</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-center gap-0.5">
                        <Activity className="w-2.5 h-2.5 text-blue-500" /> BP
                      </div>
                      <div className="font-bold text-slate-800">
                        {vitals.bloodPressureSys}/{vitals.bloodPressureDia}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-500 flex items-center justify-center gap-0.5">
                        <Activity className="w-2.5 h-2.5 text-teal-500" /> SpO2
                      </div>
                      <div className={`font-bold ${vitals.oxygenSaturation < 93 ? 'text-rose-600 font-extrabold' : 'text-slate-800'}`}>
                        {vitals.oxygenSaturation}%
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedPatientId(isSelected ? null : patient.id)}
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
                    isSelected
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Filter audit log table to this patient"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Viewing Logs' : 'View Audit Logs'}</span>
                </button>

                <button
                  onClick={() => onQuickLogForPatient(patient.id)}
                  className="text-xs font-bold text-teal-700 hover:text-teal-800 hover:bg-teal-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>+ Quick Log</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Admit Patient Modal */}
      {showAdmitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6">
            <h3 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-teal-600" />
              Admit New Patient to Ward
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Registers inpatient record and logs clinical admission event to audit trail.
            </p>

            <form onSubmit={handleAdmit} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Samuel J. Reed"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    required
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Department</label>
                  <select
                    value={dept}
                    onChange={e => setDept(e.target.value as any)}
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Bed Number</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ICU-02"
                    value={bedNumber}
                    onChange={e => setBedNumber(e.target.value)}
                    className="w-full text-xs font-mono px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Admitting Diagnosis</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acute Cholecystitis, pending ultrasound"
                  value={diagnosis}
                  onChange={e => setDiagnosis(e.target.value)}
                  className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">ESI Triage Acuity (1-5)</label>
                  <select
                    value={triage}
                    onChange={e => setTriage(Number(e.target.value) as any)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 bg-white font-semibold"
                  >
                    <option value={1}>Level 1 - Resuscitation (STAT)</option>
                    <option value={2}>Level 2 - Emergent</option>
                    <option value={3}>Level 3 - Urgent</option>
                    <option value={4}>Level 4 - Less Urgent</option>
                    <option value={5}>Level 5 - Non-urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Allergies (comma-separated)</label>
                  <input
                    type="text"
                    value={allergiesText}
                    onChange={e => setAllergiesText(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAdmitModal(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm"
                >
                  Confirm &amp; Log Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
