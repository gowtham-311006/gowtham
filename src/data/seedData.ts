import { StaffMember, Patient, LogEntry, EmergencyAlert } from '../types/hospital';

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-01',
    badgeNumber: 'MD-8842',
    name: 'Dr. Gowtham Chand, MD',
    role: 'Doctor',
    portalType: 'doctor',
    pin: '8842',
    department: 'Emergency (ER)',
    avatar: 'https://images.unsplash.com/photo-1622902046580-2b47f47f5471?w=150&auto=format&fit=crop&q=80',
    email: 'gowtham.chand@stjudes-health.org',
    licenseNumber: 'MED-NY-49201',
    activeShift: 'Morning (07:00 - 15:00)',
    specialty: 'Emergency Medicine & Critical Care',
    permissions: ['Clinical Diagnoses', 'Prescription Orders', 'Discharge Authorization', 'SBAR Handover']
  },
  {
    id: 'staff-02',
    badgeNumber: 'RN-3091',
    name: 'Mark Davies, BSN, RN',
    role: 'Registered Nurse',
    portalType: 'nurse',
    pin: '3091',
    department: 'Intensive Care (ICU)',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    email: 'mark.davies@stjudes-health.org',
    licenseNumber: 'RN-90218',
    activeShift: 'Morning (07:00 - 15:00)',
    specialty: 'ICU Critical Care & Telemetry',
    permissions: ['Bedside Vitals', 'MAR Medication Admin', 'Dual Witness Sign-off', 'Shift Handover']
  },
  {
    id: 'staff-03',
    badgeNumber: 'SURG-1104',
    name: 'Dr. Elena Rostova, FACS',
    role: 'Surgeon',
    portalType: 'surgeon',
    pin: '1104',
    department: 'Surgical Suite (OR)',
    avatar: 'https://images.unsplash.com/photo-1594824813626-d62f43bb221d?w=150&auto=format&fit=crop&q=80',
    email: 'elena.rostova@stjudes-health.org',
    licenseNumber: 'SURG-88204',
    activeShift: 'Morning (07:00 - 15:00)',
    specialty: 'Trauma & General Surgery',
    permissions: ['Operative Notes', 'PACU Transfers', 'Surgical Consent', 'Stat Consults']
  },
  {
    id: 'staff-04',
    badgeNumber: 'TRI-5520',
    name: 'Alex Rivera, EMT-P',
    role: 'Triage Officer',
    portalType: 'triage',
    pin: '5520',
    department: 'Emergency (ER)',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    email: 'alex.rivera@stjudes-health.org',
    licenseNumber: 'EMT-44102',
    activeShift: 'Morning (07:00 - 15:00)',
    specialty: 'Pre-Hospital & Emergency Triage Acuity',
    permissions: ['ESI Triage Scoring', 'Patient Admission', 'Bed Allocation', 'Rapid Intake']
  },
  {
    id: 'staff-05',
    badgeNumber: 'LAB-7741',
    name: 'David Kim, MLS (ASCP)',
    role: 'Lab Specialist',
    portalType: 'lab',
    pin: '7741',
    department: 'Pathology & Lab',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
    email: 'david.kim@stjudes-health.org',
    licenseNumber: 'MLS-77319',
    activeShift: 'Morning (07:00 - 15:00)',
    specialty: 'Clinical Hematology & Toxicology',
    permissions: ['Post Lab Results', 'Critical Value Alerts', 'Specimen Verification', 'Blood Bank Dispatch']
  },
  {
    id: 'staff-06',
    badgeNumber: 'ADM-0021',
    name: 'Maria Santos, MHA',
    role: 'Hospital Administrator',
    portalType: 'admin',
    pin: '0021',
    department: 'General Med-Surg',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    email: 'maria.santos@stjudes-health.org',
    licenseNumber: 'ADM-00441',
    activeShift: 'Morning (07:00 - 15:00)',
    specialty: 'Hospital Governance & HIPAA Compliance',
    permissions: ['Full Audit Trail', 'Export Compliance CSV/JSON', 'Security Logs', 'System Reset']
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'MRN-782910',
    fullName: 'Robert Harrison',
    age: 64,
    gender: 'Male',
    department: 'Intensive Care (ICU)',
    bedNumber: 'ICU-Bed-04',
    admissionDate: '2026-11-09T18:40:00Z',
    primaryDiagnosis: 'Acute Respiratory Distress Syndrome (ARDS) secondary to Sepsis',
    attendingDoctor: 'Dr. Gowtham Chand, MD',
    allergies: ['Penicillin', 'Sulfa Drugs'],
    triageLevel: 1,
    status: 'Critical',
    latestVitals: {
      heartRate: 114,
      bloodPressureSys: 92,
      bloodPressureDia: 58,
      oxygenSaturation: 91,
      temperature: 38.6,
      respiratoryRate: 26,
      painScore: 6,
      consciousness: 'Verbal'
    }
  },
  {
    id: 'MRN-441920',
    fullName: 'Clara Evelyn Vance',
    age: 48,
    gender: 'Female',
    department: 'Cardiology',
    bedNumber: 'CARD-12B',
    admissionDate: '2026-11-08T09:15:00Z',
    primaryDiagnosis: 'Non-STEMI, Post-Percutaneous Coronary Intervention',
    attendingDoctor: 'Dr. Elena Rostova, FACS',
    allergies: ['Latex'],
    triageLevel: 2,
    status: 'Inpatient',
    latestVitals: {
      heartRate: 74,
      bloodPressureSys: 124,
      bloodPressureDia: 78,
      oxygenSaturation: 98,
      temperature: 36.9,
      respiratoryRate: 16,
      painScore: 2,
      consciousness: 'Alert'
    }
  },
  {
    id: 'MRN-902144',
    fullName: 'Mateo Morales',
    age: 29,
    gender: 'Male',
    department: 'Emergency (ER)',
    bedNumber: 'ER-Bay-02',
    admissionDate: '2026-11-10T06:20:00Z',
    primaryDiagnosis: 'Acute Right Lower Quadrant Abdominal Pain (Suspected Appendicitis)',
    attendingDoctor: 'Dr. Gowtham Chand, MD',
    allergies: ['None known'],
    triageLevel: 2,
    status: 'Observation',
    latestVitals: {
      heartRate: 88,
      bloodPressureSys: 130,
      bloodPressureDia: 82,
      oxygenSaturation: 99,
      temperature: 38.1,
      respiratoryRate: 18,
      painScore: 8,
      consciousness: 'Alert'
    }
  },
  {
    id: 'MRN-331209',
    fullName: 'Evelyn Montgomery',
    age: 72,
    gender: 'Female',
    department: 'General Med-Surg',
    bedNumber: 'MS-304A',
    admissionDate: '2026-11-06T14:00:00Z',
    primaryDiagnosis: 'Left Total Hip Arthroplasty (Post-Op Day 4), Mobility Rehab',
    attendingDoctor: 'Dr. Elena Rostova, FACS',
    allergies: ['Codeine'],
    triageLevel: 4,
    status: 'Discharge Pending',
    latestVitals: {
      heartRate: 68,
      bloodPressureSys: 118,
      bloodPressureDia: 72,
      oxygenSaturation: 97,
      temperature: 36.7,
      respiratoryRate: 14,
      painScore: 3,
      consciousness: 'Alert'
    }
  },
  {
    id: 'MRN-552011',
    fullName: 'Liam Patrick Chen',
    age: 8,
    gender: 'Male',
    department: 'Pediatrics',
    bedNumber: 'PEDS-08',
    admissionDate: '2026-11-09T22:10:00Z',
    primaryDiagnosis: 'Severe Pediatric Asthma Exacerbation, Bronchodilator Protocol',
    attendingDoctor: 'Dr. Gowtham Chand, MD',
    allergies: ['Peanuts', 'Amoxicillin'],
    triageLevel: 3,
    status: 'Inpatient',
    latestVitals: {
      heartRate: 98,
      bloodPressureSys: 104,
      bloodPressureDia: 65,
      oxygenSaturation: 96,
      temperature: 37.2,
      respiratoryRate: 22,
      painScore: 2,
      consciousness: 'Alert'
    }
  }
];

export const INITIAL_LOGS: LogEntry[] = [
  {
    id: 'log-101',
    timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
    category: 'Vitals',
    severity: 'Critical / STAT',
    staffId: 'staff-02',
    staffName: 'Mark Davies, BSN, RN',
    staffRole: 'Registered Nurse',
    department: 'Intensive Care (ICU)',
    patientId: 'MRN-782910',
    patientName: 'Robert Harrison',
    bedNumber: 'ICU-Bed-04',
    summary: 'Stat vital signs recorded: O2 dropped to 91%, Tachycardia noted (114 bpm)',
    details: 'Patient shows tachypnea with increased work of breathing. Titrated high-flow nasal cannula from 35L to 45L at 60% FiO2. Alerted Attending Physician Dr. Gowtham Chand.',
    metadata: {
      vitals: {
        heartRate: 114,
        bloodPressureSys: 92,
        bloodPressureDia: 58,
        oxygenSaturation: 91,
        temperature: 38.6,
        respiratoryRate: 26,
        painScore: 6,
        consciousness: 'Verbal'
      }
    }
  },
  {
    id: 'log-102',
    timestamp: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    category: 'Medication (MAR)',
    severity: 'Urgent',
    staffId: 'staff-02',
    staffName: 'Mark Davies, BSN, RN',
    staffRole: 'Registered Nurse',
    department: 'Intensive Care (ICU)',
    patientId: 'MRN-782910',
    patientName: 'Robert Harrison',
    bedNumber: 'ICU-Bed-04',
    summary: 'Administered IV Norepinephrine infusion titration & Cefepime 2g IVPB',
    details: 'Dual nurse barcode verification performed with RN J. Miller. IV site right subclavian triple-lumen patent, no erythema or extravasation.',
    metadata: {
      medication: {
        drugName: 'Norepinephrine & Cefepime 2g',
        dosage: '0.08 mcg/kg/min titrating',
        route: 'Intravenous Central Line',
        witnessNurse: 'Nurse J. Miller, RN (Dual Verified)'
      }
    }
  },
  {
    id: 'log-103',
    timestamp: new Date(Date.now() - 1000 * 60 * 48).toISOString(),
    category: 'Admission & Triage',
    severity: 'Urgent',
    staffId: 'staff-04',
    staffName: 'Alex Rivera, EMT-P',
    staffRole: 'Triage Officer',
    department: 'Emergency (ER)',
    patientId: 'MRN-902144',
    patientName: 'Mateo Morales',
    bedNumber: 'ER-Bay-02',
    summary: 'Triage ESI Level 2 Intake - Severe RLQ rebound tenderness',
    details: 'Walk-in arrival escorted by triage. Onset acute pain 4 hours prior. Rebound tenderness positive at McBurney point. Stat abdominal ultrasound ordered.',
    metadata: {
      incident: {
        type: 'Urgent Surgical Triage Intake',
        actionTaken: 'NPO protocol initiated, IV access 18G left forearm, Labs drawn'
      }
    }
  },
  {
    id: 'log-104',
    timestamp: new Date(Date.now() - 1000 * 60 * 75).toISOString(),
    category: 'Lab Result',
    severity: 'Critical / STAT',
    staffId: 'staff-05',
    staffName: 'David Kim, MLS (ASCP)',
    staffRole: 'Lab Specialist',
    department: 'Pathology & Lab',
    patientId: 'MRN-782910',
    patientName: 'Robert Harrison',
    summary: 'CRITICAL LAB ALERT: Serum Lactate 4.2 mmol/L & WBC 18,400',
    details: 'Critical value telephone read-back completed with ICU Charge Nurse Mark Davies at 06:42 AM. Sepsis protocol second bolus recommended per institutional guidelines.',
  },
  {
    id: 'log-105',
    timestamp: new Date(Date.now() - 1000 * 60 * 110).toISOString(),
    category: 'Shift Handover',
    severity: 'Routine',
    staffId: 'staff-01',
    staffName: 'Dr. Gowtham Chand, MD',
    staffRole: 'Doctor',
    department: 'Emergency (ER)',
    summary: 'SBAR Morning Shift Handover: Night to Day Staff Transition',
    details: 'Night shift Census: 28 patients. 4 awaiting ICU beds, 2 scheduled for emergency OR. Overnight critical event: successfully converted SVT in Bed 6.',
    metadata: {
      sbar: {
        situation: 'Morning shift turnover, ER census 28 patients with 4 boarding for ICU.',
        background: 'Overnight surge managed. Blood bank reserves at 95% capacity.',
        assessment: 'Bay 02 (Morales) awaiting surgeon consult. ICU bed shortage imminent.',
        recommendation: 'Prioritize Bed 4 transfer to Step-down to liberate ICU ventilator bed.'
      }
    }
  },
  {
    id: 'log-106',
    timestamp: new Date(Date.now() - 1000 * 60 * 140).toISOString(),
    category: 'Bed Transfer',
    severity: 'Routine',
    staffId: 'staff-06',
    staffName: 'Maria Santos, MHA',
    staffRole: 'Hospital Administrator',
    department: 'General Med-Surg',
    patientId: 'MRN-331209',
    patientName: 'Evelyn Montgomery',
    summary: 'Bed Transfer Logged: Moved from PACU-03 to Med-Surg MS-304A',
    details: 'Post-anesthesia discharge criteria met. Vital signs stable, telemetry discontinued, transfer handover completed with floor nurse.',
    metadata: {
      bedChange: {
        fromBed: 'PACU-03',
        toBed: 'MS-304A'
      }
    }
  },
  {
    id: 'log-107',
    timestamp: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    category: 'Access & Security',
    severity: 'Security',
    staffId: 'staff-01',
    staffName: 'Dr. Gowtham Chand, MD',
    staffRole: 'Doctor',
    department: 'Emergency (ER)',
    summary: 'Staff Badge RFID Tap Authentication: Dr. Gowtham Chand, MD (Badge MD-8842)',
    details: 'Authenticated terminal: ER-STATION-01. IP: 10.14.88.12. Session validated under 2FA Biometric bypass rule.',
  }
];

export const INITIAL_ALERTS: EmergencyAlert[] = [
  {
    id: 'alert-01',
    codeType: 'Sepsis Alert',
    location: 'Intensive Care (ICU) - Bed 04',
    patientId: 'MRN-782910',
    patientName: 'Robert Harrison',
    initiatedAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    initiatedBy: 'Mark Davies, BSN, RN',
    status: 'RESPONDING',
    responders: ['Dr. Gowtham Chand, MD', 'Mark Davies, BSN, RN', 'David Kim, MLS']
  }
];
