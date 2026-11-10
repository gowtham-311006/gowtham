export type StaffRole = 
  | 'Doctor' 
  | 'Head Nurse' 
  | 'Registered Nurse' 
  | 'Triage Officer' 
  | 'Lab Specialist' 
  | 'Hospital Administrator' 
  | 'Surgeon';

export type Department = 
  | 'Emergency (ER)' 
  | 'Intensive Care (ICU)' 
  | 'General Med-Surg' 
  | 'Pediatrics' 
  | 'Cardiology' 
  | 'Surgical Suite (OR)' 
  | 'Pathology & Lab';

export type LogCategory = 
  | 'Vitals' 
  | 'Medication (MAR)' 
  | 'Admission & Triage' 
  | 'Bed Transfer' 
  | 'Shift Handover' 
  | 'Emergency Code' 
  | 'Clinical Note' 
  | 'Lab Result' 
  | 'Incident / Safety' 
  | 'Access & Security';

export type LogSeverity = 'Routine' | 'Urgent' | 'Critical / STAT' | 'Security';

export type ShiftType = 'Morning (07:00 - 15:00)' | 'Evening (15:00 - 23:00)' | 'Night (23:00 - 07:00)';

export type PortalType = 'doctor' | 'nurse' | 'surgeon' | 'triage' | 'lab' | 'admin';

export interface StaffMember {
  id: string;
  badgeNumber: string;
  name: string;
  role: StaffRole;
  portalType: PortalType;
  pin: string;
  department: Department;
  avatar: string;
  email: string;
  licenseNumber: string;
  activeShift: ShiftType;
  specialty?: string;
  permissions?: string[];
}

export interface PatientVitals {
  heartRate: number; // bpm
  bloodPressureSys: number; // mmHg
  bloodPressureDia: number; // mmHg
  oxygenSaturation: number; // %
  temperature: number; // °C
  respiratoryRate: number; // breaths/min
  painScore: number; // 0-10
  consciousness: 'Alert' | 'Verbal' | 'Pain' | 'Unresponsive';
}

export interface Patient {
  id: string; // MRN (Medical Record Number)
  fullName: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  department: Department;
  bedNumber: string;
  admissionDate: string;
  primaryDiagnosis: string;
  attendingDoctor: string;
  allergies: string[];
  triageLevel: 1 | 2 | 3 | 4 | 5; // 1 = Resuscitation, 5 = Non-urgent
  status: 'Inpatient' | 'Observation' | 'Critical' | 'Discharge Pending';
  latestVitals?: PatientVitals;
}

export interface LogEntry {
  id: string;
  timestamp: string; // ISO String
  category: LogCategory;
  severity: LogSeverity;
  staffId: string;
  staffName: string;
  staffRole: StaffRole;
  department: Department;
  patientId?: string; // MRN
  patientName?: string;
  bedNumber?: string;
  summary: string;
  details: string;
  metadata?: {
    vitals?: Partial<PatientVitals>;
    medication?: {
      drugName: string;
      dosage: string;
      route: string;
      witnessNurse?: string;
    };
    incident?: {
      type: string;
      actionTaken: string;
    };
    emergencyCode?: {
      codeType: string;
      location: string;
      resolvedAt?: string;
    };
    sbar?: {
      situation: string;
      background: string;
      assessment: string;
      recommendation: string;
    };
    bedChange?: {
      fromBed: string;
      toBed: string;
    };
  };
}

export interface EmergencyAlert {
  id: string;
  codeType: 'Code Blue' | 'Code Red' | 'Code STEMI' | 'Sepsis Alert' | 'Trauma Level 1';
  location: string;
  patientId?: string;
  patientName?: string;
  initiatedAt: string;
  initiatedBy: string;
  status: 'ACTIVE' | 'RESPONDING' | 'RESOLVED';
  responders: string[];
}
