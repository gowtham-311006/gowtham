/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HospitalProvider, useHospital } from './context/HospitalContext';
import { Navbar } from './components/Navbar';
import { EmergencyBanner } from './components/EmergencyBanner';
import { StatsOverview } from './components/StatsOverview';
import { PatientBoard } from './components/PatientBoard';
import { LogTable } from './components/LogTable';
import { LoginModal } from './components/LoginModal';
import { QuickLogModal } from './components/QuickLogModal';
import { DeploymentModal } from './components/DeploymentModal';
import { PrintAuditReport } from './components/PrintAuditReport';
import { SeparateLoginScreen } from './components/SeparateLoginScreen';
import { RoleActionBar } from './components/RoleActionBar';

function HospitalDashboard() {
  const { currentUser, logout } = useHospital();

  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [isPrintViewOpen, setIsPrintViewOpen] = useState(false);
  const [quickLogPatientId, setQuickLogPatientId] = useState<string | null>(null);

  const handleOpenQuickLogForPatient = (patientId: string) => {
    setQuickLogPatientId(patientId);
    setIsQuickLogOpen(true);
  };

  const handleOpenGeneralQuickLog = () => {
    setQuickLogPatientId(null);
    setIsQuickLogOpen(true);
  };

  // If not authenticated or logged out, present the dedicated Separate Logins Gateway
  if (!currentUser) {
    return <SeparateLoginScreen />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
      
      {/* Top Navbar */}
      <Navbar
        onOpenQuickLog={handleOpenGeneralQuickLog}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenDeployModal={() => setIsDeployModalOpen(true)}
        onOpenPrintView={() => setIsPrintViewOpen(true)}
      />

      {/* Emergency Alert Broadcast Banner (shows only when emergency code active) */}
      <EmergencyBanner />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Role-tailored action bar based on separate login (Doctor, Nurse, Triage, etc.) */}
        <RoleActionBar 
          onOpenQuickLog={handleOpenGeneralQuickLog}
          onOpenDeployModal={() => setIsDeployModalOpen(true)}
        />

        {/* At-a-glance ward statistics */}
        <StatsOverview />

        {/* Active Ward Inpatient & Bed Board */}
        <PatientBoard onQuickLogForPatient={handleOpenQuickLogForPatient} />

        {/* Clinical Audit Log Stream & Table */}
        <LogTable />

      </main>

      {/* Hospital Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-500 inline-block animate-pulse" />
            <span className="font-bold text-slate-800">MedLogix Hospital Logging Engine</span>
            <span>• Active Portal: <strong className="text-teal-700 capitalize">{currentUser.portalType} Workspace</strong> ({currentUser.name})</span>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <button
              onClick={() => setIsDeployModalOpen(true)}
              className="hover:text-indigo-600 transition-colors font-medium"
            >
              Deployment &amp; Docker Guide
            </button>
            <span>•</span>
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="hover:text-teal-600 transition-colors font-medium"
            >
              Switch Separate Login
            </button>
            <span>•</span>
            <button
              onClick={logout}
              className="hover:text-rose-600 transition-colors font-medium"
            >
              Sign Out to Gateway
            </button>
            <span>•</span>
            <button
              onClick={() => setIsPrintViewOpen(true)}
              className="hover:text-slate-900 transition-colors font-medium"
            >
              Print Audit Trail
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <QuickLogModal
        isOpen={isQuickLogOpen}
        onClose={() => setIsQuickLogOpen(false)}
        initialPatientId={quickLogPatientId}
      />

      <DeploymentModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
      />

      <PrintAuditReport
        isOpen={isPrintViewOpen}
        onClose={() => setIsPrintViewOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <HospitalProvider>
      <HospitalDashboard />
    </HospitalProvider>
  );
}
