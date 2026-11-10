import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { StaffMember, Patient, LogEntry, EmergencyAlert, Department, LogCategory, LogSeverity } from '../types/hospital';
import { INITIAL_STAFF, INITIAL_PATIENTS, INITIAL_LOGS, INITIAL_ALERTS } from '../data/seedData';

interface HospitalContextType {
  currentUser: StaffMember | null;
  staffList: StaffMember[];
  patients: Patient[];
  logs: LogEntry[];
  alerts: EmergencyAlert[];
  
  // Filters & Search
  selectedDepartment: Department | 'All Departments';
  setSelectedDepartment: (dept: Department | 'All Departments') => void;
  selectedSeverity: LogSeverity | 'All Severities';
  setSelectedSeverity: (sev: LogSeverity | 'All Severities') => void;
  selectedCategory: LogCategory | 'All Categories';
  setSelectedCategory: (cat: LogCategory | 'All Categories') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Selected Patient for history filter
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;

  // Live ward simulation
  isSimulating: boolean;
  setIsSimulating: (sim: boolean) => void;

  // Actions
  loginAsStaff: (staffId: string) => void;
  loginWithCredentials: (identifier: string, pin: string) => { success: boolean; message?: string };
  customLogin: (badgeNumber: string, name: string, role: StaffMember['role'], dept: Department, pin?: string) => void;
  logout: () => void;
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp' | 'staffId' | 'staffName' | 'staffRole'> & { staffId?: string; staffName?: string; staffRole?: StaffMember['role'] }) => LogEntry;
  addPatient: (patient: Patient) => void;
  updatePatient: (patientId: string, updates: Partial<Patient>) => void;
  triggerEmergencyAlert: (codeType: EmergencyAlert['codeType'], location: string, patientId?: string, patientName?: string) => void;
  resolveEmergencyAlert: (alertId: string) => void;
  joinAlertResponse: (alertId: string) => void;
  
  // Export & Deployment utils
  exportLogsJSON: () => void;
  exportLogsCSV: () => void;
  importSnapshotJSON: (fileContent: string) => boolean;
  resetToSeedData: () => void;
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'medlogix_current_user',
  STAFF: 'medlogix_staff',
  PATIENTS: 'medlogix_patients',
  LOGS: 'medlogix_logs',
  ALERTS: 'medlogix_alerts',
  SIMULATING: 'medlogix_simulating'
};

const getRolePortalType = (role: string): StaffMember['portalType'] => {
  const map: Record<string, StaffMember['portalType']> = {
    'Doctor': 'doctor',
    'Surgeon': 'surgeon',
    'Head Nurse': 'nurse',
    'Registered Nurse': 'nurse',
    'Triage Officer': 'triage',
    'Lab Specialist': 'lab',
    'Hospital Administrator': 'admin'
  };
  return map[role] || 'doctor';
};

const sanitizeStaffMember = (staff: Partial<StaffMember> & { id: string; name: string; role: any }): StaffMember => {
  const defaultStaff = INITIAL_STAFF.find(s => s.id === staff.id);
  const portalType = staff.portalType || defaultStaff?.portalType || getRolePortalType(staff.role);
  const pin = staff.pin || defaultStaff?.pin || '1234';
  const specialty = staff.specialty || defaultStaff?.specialty || `${staff.role} Specialist`;
  const permissions = staff.permissions || defaultStaff?.permissions || ['General Clinical Access'];

  return {
    id: staff.id,
    badgeNumber: staff.badgeNumber || defaultStaff?.badgeNumber || 'STAFF-001',
    name: staff.name,
    role: staff.role || 'Doctor',
    portalType,
    pin,
    department: staff.department || defaultStaff?.department || 'Emergency (ER)',
    avatar: staff.avatar || defaultStaff?.avatar || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    email: staff.email || defaultStaff?.email || 'staff@stjudes-health.org',
    licenseNumber: staff.licenseNumber || defaultStaff?.licenseNumber || 'LIC-00000',
    activeShift: staff.activeShift || defaultStaff?.activeShift || 'Morning (07:00 - 15:00)',
    specialty,
    permissions
  };
};

export const HospitalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial state with local storage fallback
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.STAFF);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map(sanitizeStaffMember);
        }
      }
      return INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  const [currentUser, setCurrentUser] = useState<StaffMember | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.id) {
          return sanitizeStaffMember(parsed);
        }
      }
      return null; // Prompt separate login selection on first arrival
    } catch {
      return null;
    }
  });

  const [patients, setPatients] = useState<Patient[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.PATIENTS);
      return stored ? JSON.parse(stored) : INITIAL_PATIENTS;
    } catch {
      return INITIAL_PATIENTS;
    }
  });

  const [logs, setLogs] = useState<LogEntry[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.LOGS);
      return stored ? JSON.parse(stored) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  });

  const [alerts, setAlerts] = useState<EmergencyAlert[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.ALERTS);
      return stored ? JSON.parse(stored) : INITIAL_ALERTS;
    } catch {
      return INITIAL_ALERTS;
    }
  });

  // Filters
  const [selectedDepartment, setSelectedDepartment] = useState<Department | 'All Departments'>('All Departments');
  const [selectedSeverity, setSelectedSeverity] = useState<LogSeverity | 'All Severities'>('All Severities');
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | 'All Categories'>('All Categories');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(true);

  // Sync state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
      localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staffList));
      localStorage.setItem(STORAGE_KEYS.PATIENTS, JSON.stringify(patients));
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
      localStorage.setItem(STORAGE_KEYS.ALERTS, JSON.stringify(alerts));
    } catch (e) {
      console.warn('LocalStorage save failed', e);
    }
  }, [currentUser, staffList, patients, logs, alerts]);

  // Login handler
  const loginAsStaff = useCallback((staffId: string) => {
    const rawMember = staffList.find(s => s.id === staffId);
    if (rawMember) {
      const member = sanitizeStaffMember(rawMember);
      setCurrentUser(member);
      // Auto-log the authentication event
      const portalLabel = (member.portalType || getRolePortalType(member.role) || 'clinical').toUpperCase();
      const authLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: 'Access & Security',
        severity: 'Security',
        staffId: member.id,
        staffName: member.name,
        staffRole: member.role,
        department: member.department,
        summary: `Staff login: ${member.name} (${member.badgeNumber})`,
        details: `Authenticated portal [${portalLabel} PORTAL] with role [${member.role}] in [${member.department}]. Active shift: ${member.activeShift}. Session token created.`,
      };
      setLogs(prev => [authLog, ...prev]);
    }
  }, [staffList]);

  // Login with credentials (Badge or Email + PIN)
  const loginWithCredentials = useCallback((identifier: string, pin: string): { success: boolean; message?: string } => {
    const cleanId = identifier.trim().toLowerCase();
    const cleanPin = pin.trim();

    const rawMember = staffList.find(s => 
      s.badgeNumber.toLowerCase() === cleanId || 
      s.email.toLowerCase() === cleanId ||
      s.id.toLowerCase() === cleanId ||
      s.name.toLowerCase().includes(cleanId)
    );

    if (!rawMember) {
      return { success: false, message: 'Invalid Staff ID, Badge, or Email address.' };
    }

    const member = sanitizeStaffMember(rawMember);

    // Default pin check: either member.pin or universal master PIN '1234'
    if (member.pin && cleanPin !== member.pin && cleanPin !== '1234') {
      return { success: false, message: `Incorrect Security PIN. (Hint: Demo PIN is ${member.pin} or 1234)` };
    }

    setCurrentUser(member);

    const portalLabel = (member.portalType || getRolePortalType(member.role) || 'clinical').toUpperCase();
    const authLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'Access & Security',
      severity: 'Security',
      staffId: member.id,
      staffName: member.name,
      staffRole: member.role,
      department: member.department,
      summary: `Credential Login: ${member.name} [${member.role}]`,
      details: `Verified PIN authentication on ${member.department} terminal. Granted access to ${portalLabel} portal.`,
    };
    setLogs(prev => [authLog, ...prev]);

    return { success: true };
  }, [staffList]);

  // Custom login
  const customLogin = useCallback((badgeNumber: string, name: string, role: StaffMember['role'], dept: Department, pin = '1234') => {
    const portalMap: Record<StaffMember['role'], StaffMember['portalType']> = {
      'Doctor': 'doctor',
      'Surgeon': 'surgeon',
      'Head Nurse': 'nurse',
      'Registered Nurse': 'nurse',
      'Triage Officer': 'triage',
      'Lab Specialist': 'lab',
      'Hospital Administrator': 'admin'
    };

    const newStaff: StaffMember = {
      id: `staff-custom-${Date.now()}`,
      badgeNumber: badgeNumber.toUpperCase(),
      name,
      role,
      portalType: portalMap[role] || 'nurse',
      pin: pin || '1234',
      department: dept,
      avatar: `https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80`,
      email: `${name.toLowerCase().replace(/[^a-z]/g, '')}@stjudes-health.org`,
      licenseNumber: `LIC-${Math.floor(10000 + Math.random() * 90000)}`,
      activeShift: 'Morning (07:00 - 15:00)',
      permissions: ['General Clinical Logging', 'Bedside Access']
    };
    setStaffList(prev => [...prev, newStaff]);
    setCurrentUser(newStaff);

    const authLog: LogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      category: 'Access & Security',
      severity: 'Security',
      staffId: newStaff.id,
      staffName: newStaff.name,
      staffRole: newStaff.role,
      department: newStaff.department,
      summary: `Custom Staff Credentials Login: ${newStaff.name} (${newStaff.badgeNumber})`,
      details: `New badge session provisioned for [${newStaff.role}] assigned to [${newStaff.department}].`,
    };
    setLogs(prev => [authLog, ...prev]);
  }, []);

  // Logout
  const logout = useCallback(() => {
    if (currentUser) {
      const logoutLog: LogEntry = {
        id: `log-${Date.now()}`,
        timestamp: new Date().toISOString(),
        category: 'Access & Security',
        severity: 'Security',
        staffId: currentUser.id,
        staffName: currentUser.name,
        staffRole: currentUser.role,
        department: currentUser.department,
        summary: `Staff session logout: ${currentUser.name} (${currentUser.badgeNumber})`,
        details: `Session securely closed. Total shift logs synchronized.`,
      };
      setLogs(prev => [logoutLog, ...prev]);
    }
    setCurrentUser(null);
  }, [currentUser]);

  // Add Log Entry
  const addLog = useCallback((entry: Omit<LogEntry, 'id' | 'timestamp' | 'staffId' | 'staffName' | 'staffRole'> & { staffId?: string; staffName?: string; staffRole?: StaffMember['role'] }): LogEntry => {
    const activeStaff = currentUser || staffList[0];
    const newLog: LogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      staffId: entry.staffId || activeStaff.id,
      staffName: entry.staffName || activeStaff.name,
      staffRole: entry.staffRole || activeStaff.role,
      department: entry.department,
      category: entry.category,
      severity: entry.severity,
      patientId: entry.patientId,
      patientName: entry.patientName,
      bedNumber: entry.bedNumber,
      summary: entry.summary,
      details: entry.details,
      metadata: entry.metadata,
    };

    setLogs(prev => [newLog, ...prev]);

    // If vitals were recorded for a patient, update patient's latest vitals
    if (entry.patientId && entry.metadata?.vitals) {
      setPatients(prev => prev.map(p => {
        if (p.id === entry.patientId) {
          return {
            ...p,
            latestVitals: {
              ...(p.latestVitals || {
                heartRate: 75,
                bloodPressureSys: 120,
                bloodPressureDia: 80,
                oxygenSaturation: 98,
                temperature: 37.0,
                respiratoryRate: 16,
                painScore: 0,
                consciousness: 'Alert'
              }),
              ...entry.metadata?.vitals
            }
          };
        }
        return p;
      }));
    }

    // If bed was changed, update patient's bed
    if (entry.patientId && entry.metadata?.bedChange) {
      const newBed = entry.metadata.bedChange.toBed;
      setPatients(prev => prev.map(p => {
        if (p.id === entry.patientId) {
          return {
            ...p,
            bedNumber: newBed,
            department: entry.department
          };
        }
        return p;
      }));
    }

    return newLog;
  }, [currentUser, staffList]);

  // Patient creation & update
  const addPatient = useCallback((newPatient: Patient) => {
    setPatients(prev => [newPatient, ...prev]);
    // Log admission
    addLog({
      category: 'Admission & Triage',
      severity: newPatient.triageLevel <= 2 ? 'Urgent' : 'Routine',
      department: newPatient.department,
      patientId: newPatient.id,
      patientName: newPatient.fullName,
      bedNumber: newPatient.bedNumber,
      summary: `Patient Admitted: ${newPatient.fullName} (Bed ${newPatient.bedNumber})`,
      details: `Admitted to ${newPatient.department} with diagnosis: ${newPatient.primaryDiagnosis}. Triage Level: ESI ${newPatient.triageLevel}. Attending: ${newPatient.attendingDoctor}.`,
      metadata: {
        vitals: newPatient.latestVitals
      }
    });
  }, [addLog]);

  const updatePatient = useCallback((patientId: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === patientId ? { ...p, ...updates } : p));
  }, []);

  // Emergency Alert trigger
  const triggerEmergencyAlert = useCallback((codeType: EmergencyAlert['codeType'], location: string, patientId?: string, patientName?: string) => {
    const alertId = `alert-${Date.now()}`;
    const initiator = currentUser ? currentUser.name : 'Emergency Protocol';
    const newAlert: EmergencyAlert = {
      id: alertId,
      codeType,
      location,
      patientId,
      patientName,
      initiatedAt: new Date().toISOString(),
      initiatedBy: initiator,
      status: 'ACTIVE',
      responders: currentUser ? [currentUser.name] : []
    };

    setAlerts(prev => [newAlert, ...prev]);

    // Auto-create Critical Log
    addLog({
      category: 'Emergency Code',
      severity: 'Critical / STAT',
      department: currentUser ? currentUser.department : 'Emergency (ER)',
      patientId,
      patientName,
      summary: `EMERGENCY ACTIVATION: [${codeType}] at ${location}`,
      details: `Hospital alert triggered by ${initiator}. Immediate response teams mobilized. Rapid response, anesthesia, and crash cart dispatched.`,
      metadata: {
        emergencyCode: {
          codeType,
          location
        }
      }
    });
  }, [currentUser, addLog]);

  // Resolve Emergency Alert
  const resolveEmergencyAlert = useCallback((alertId: string) => {
    const target = alerts.find(a => a.id === alertId);
    if (!target) return;

    setAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'RESOLVED' } : a));

    addLog({
      category: 'Emergency Code',
      severity: 'Urgent',
      department: currentUser ? currentUser.department : 'Emergency (ER)',
      patientId: target.patientId,
      patientName: target.patientName,
      summary: `RESOLVED: [${target.codeType}] at ${target.location}`,
      details: `Emergency incident marked as resolved and stabilized by ${currentUser?.name || 'Charge Physician'}. Patient transferred to post-event stabilization.`,
      metadata: {
        emergencyCode: {
          codeType: target.codeType,
          location: target.location,
          resolvedAt: new Date().toISOString()
        }
      }
    });
  }, [alerts, currentUser, addLog]);

  // Join Alert
  const joinAlertResponse = useCallback((alertId: string) => {
    if (!currentUser) return;
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId && !a.responders.includes(currentUser.name)) {
        return {
          ...a,
          status: 'RESPONDING',
          responders: [...a.responders, currentUser.name]
        };
      }
      return a;
    }));
  }, [currentUser]);

  // Export functions
  const exportLogsJSON = useCallback(() => {
    const data = {
      exportTime: new Date().toISOString(),
      hospitalName: "St. Jude's Metropolitan Hospital",
      system: 'MedLogix Hospital Logging System v2.4.0',
      totalLogs: logs.length,
      patients,
      staff: staffList,
      logs,
      alerts
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medlogix_hospital_audit_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [logs, patients, staffList, alerts]);

  const exportLogsCSV = useCallback(() => {
    const headers = ['Timestamp', 'Category', 'Severity', 'Department', 'Patient MRN', 'Patient Name', 'Bed', 'Staff Name', 'Role', 'Summary', 'Details'];
    const rows = logs.map(log => [
      `"${log.timestamp}"`,
      `"${log.category}"`,
      `"${log.severity}"`,
      `"${log.department}"`,
      `"${log.patientId || 'N/A'}"`,
      `"${log.patientName || 'N/A'}"`,
      `"${log.bedNumber || 'N/A'}"`,
      `"${log.staffName}"`,
      `"${log.staffRole}"`,
      `"${log.summary.replace(/"/g, '""')}"`,
      `"${log.details.replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medlogix_audit_trail_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [logs]);

  // Import snapshot
  const importSnapshotJSON = useCallback((fileContent: string): boolean => {
    try {
      const parsed = JSON.parse(fileContent);
      if (parsed.logs && Array.isArray(parsed.logs)) {
        setLogs(parsed.logs);
      }
      if (parsed.patients && Array.isArray(parsed.patients)) {
        setPatients(parsed.patients);
      }
      if (parsed.staff && Array.isArray(parsed.staff)) {
        setStaffList(parsed.staff);
      }
      if (parsed.alerts && Array.isArray(parsed.alerts)) {
        setAlerts(parsed.alerts);
      }
      return true;
    } catch (e) {
      console.error('Failed to parse snapshot', e);
      return false;
    }
  }, []);

  // Reset to seed data
  const resetToSeedData = useCallback(() => {
    setStaffList(INITIAL_STAFF);
    setCurrentUser(INITIAL_STAFF[0]);
    setPatients(INITIAL_PATIENTS);
    setLogs(INITIAL_LOGS);
    setAlerts(INITIAL_ALERTS);
    localStorage.clear();
  }, []);

  // Live Ward Telemetry Simulation
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      // Pick random simulated event
      const samplePatients = patients.length > 0 ? patients : INITIAL_PATIENTS;
      const targetPatient = samplePatients[Math.floor(Math.random() * samplePatients.length)];
      const sampleStaff = staffList.length > 0 ? staffList : INITIAL_STAFF;
      const randomStaff = sampleStaff[Math.floor(Math.random() * sampleStaff.length)];

      const simulationTypes = ['vitals', 'med', 'note', 'routine_check'];
      const simType = simulationTypes[Math.floor(Math.random() * simulationTypes.length)];

      if (simType === 'vitals') {
        const deltaHR = (Math.floor(Math.random() * 9) - 4);
        const deltaBP = (Math.floor(Math.random() * 7) - 3);
        const currentVitals = targetPatient.latestVitals || {
          heartRate: 78,
          bloodPressureSys: 120,
          bloodPressureDia: 78,
          oxygenSaturation: 98,
          temperature: 37.0,
          respiratoryRate: 16,
          painScore: 2,
          consciousness: 'Alert' as const
        };

        const newVitals = {
          ...currentVitals,
          heartRate: Math.max(55, Math.min(135, currentVitals.heartRate + deltaHR)),
          bloodPressureSys: Math.max(90, Math.min(160, currentVitals.bloodPressureSys + deltaBP)),
          oxygenSaturation: Math.min(100, Math.max(90, currentVitals.oxygenSaturation + (Math.random() > 0.5 ? 1 : -1)))
        };

        const isElevated = newVitals.heartRate > 105 || newVitals.oxygenSaturation < 93;

        addLog({
          category: 'Vitals',
          severity: isElevated ? 'Urgent' : 'Routine',
          department: targetPatient.department,
          patientId: targetPatient.id,
          patientName: targetPatient.fullName,
          bedNumber: targetPatient.bedNumber,
          staffId: randomStaff.id,
          staffName: randomStaff.name,
          staffRole: randomStaff.role,
          summary: `Ward telemetry auto-sync: HR ${newVitals.heartRate} bpm, SpO2 ${newVitals.oxygenSaturation}%`,
          details: `Scheduled routine telemetry sweep. Patient ${targetPatient.fullName} resting in ${targetPatient.bedNumber}. Waveform normal sinus rhythm.`,
          metadata: {
            vitals: newVitals
          }
        });
      } else if (simType === 'med') {
        const medications = [
          { drug: 'Acetaminophen 650mg PO', route: 'Oral' },
          { drug: 'Normal Saline 500mL IV Bolus', route: 'IV Infusion' },
          { drug: 'Ondansetron 4mg IV Push', route: 'IV Push' },
          { drug: 'Enoxaparin 40mg SubQ', route: 'Subcutaneous' }
        ];
        const med = medications[Math.floor(Math.random() * medications.length)];

        addLog({
          category: 'Medication (MAR)',
          severity: 'Routine',
          department: targetPatient.department,
          patientId: targetPatient.id,
          patientName: targetPatient.fullName,
          bedNumber: targetPatient.bedNumber,
          staffId: randomStaff.id,
          staffName: randomStaff.name,
          staffRole: randomStaff.role,
          summary: `Administered ${med.drug} via ${med.route}`,
          details: `Scheduled dose completed on time. Patient tolerated administration without complaints. Five patient rights verified.`,
          metadata: {
            medication: {
              drugName: med.drug,
              dosage: 'Standard',
              route: med.route
            }
          }
        });
      } else if (simType === 'note') {
        const notes = [
          'Physician round completed: Patient resting comfortably, continuing current antibiotic coverage.',
          'Nursing hourly safety round: Call bell in reach, bed in lowest position, side rails elevated.',
          'Physical therapy ambulation note: Patient ambulated 40 feet in corridor with standard walker.'
        ];
        const note = notes[Math.floor(Math.random() * notes.length)];

        addLog({
          category: 'Clinical Note',
          severity: 'Routine',
          department: targetPatient.department,
          patientId: targetPatient.id,
          patientName: targetPatient.fullName,
          bedNumber: targetPatient.bedNumber,
          staffId: randomStaff.id,
          staffName: randomStaff.name,
          staffRole: randomStaff.role,
          summary: `Clinical Observation: ${targetPatient.fullName}`,
          details: note
        });
      }
    }, 28000); // Trigger every 28 seconds

    return () => clearInterval(interval);
  }, [isSimulating, patients, staffList, addLog]);

  const value = useMemo(() => ({
    currentUser,
    staffList,
    patients,
    logs,
    alerts,
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
    isSimulating,
    setIsSimulating,
    loginAsStaff,
    loginWithCredentials,
    customLogin,
    logout,
    addLog,
    addPatient,
    updatePatient,
    triggerEmergencyAlert,
    resolveEmergencyAlert,
    joinAlertResponse,
    exportLogsJSON,
    exportLogsCSV,
    importSnapshotJSON,
    resetToSeedData
  }), [
    currentUser,
    staffList,
    patients,
    logs,
    alerts,
    selectedDepartment,
    selectedSeverity,
    selectedCategory,
    searchQuery,
    selectedPatientId,
    isSimulating,
    loginAsStaff,
    loginWithCredentials,
    customLogin,
    logout,
    addLog,
    addPatient,
    updatePatient,
    triggerEmergencyAlert,
    resolveEmergencyAlert,
    joinAlertResponse,
    exportLogsJSON,
    exportLogsCSV,
    importSnapshotJSON,
    resetToSeedData
  ]);

  return (
    <HospitalContext.Provider value={value}>
      {children}
    </HospitalContext.Provider>
  );
};

export const useHospital = () => {
  const context = useContext(HospitalContext);
  if (!context) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
};
