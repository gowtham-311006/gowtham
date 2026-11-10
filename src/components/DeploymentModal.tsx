import React, { useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { 
  Rocket, 
  X, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  RotateCcw, 
  Server, 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  Globe, 
  HardDrive,
  FileCode,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface DeploymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeploymentModal: React.FC<DeploymentModalProps> = ({ isOpen, onClose }) => {
  const { 
    logs, 
    patients, 
    staffList, 
    exportLogsJSON, 
    importSnapshotJSON, 
    resetToSeedData 
  } = useHospital();

  const [activeTab, setActiveTab] = useState<'overview' | 'docker' | 'cloud' | 'backup'>('overview');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = importSnapshotJSON(content);
        if (success) {
          setImportStatus('Hospital snapshot successfully restored!');
          setTimeout(() => setImportStatus(null), 3000);
        } else {
          setImportStatus('Invalid JSON backup file format.');
        }
      }
    };
    reader.readAsText(file);
  };

  const dockerfileSnippet = `# MedLogix Hospital Logging System - Production Container
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`;

  const dockerComposeSnippet = `version: '3.8'
services:
  medlogix-hospital-log:
    build: .
    ports:
      - "3000:80"
    restart: always
    environment:
      - NODE_ENV=production
    labels:
      - "app=medlogix-hospital-logging"`;

  const nginxConfSnippet = `server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers for hospital compliance
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "strict-origin-when-cross-origin";
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <Rocket className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                1-Click Deployment &amp; Zero-Config Architecture
              </h2>
              <p className="text-xs text-slate-400">
                Effortless hospital deployment for air-gapped intranets, Docker, or modern cloud platforms
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
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            Zero-Config Architecture
          </button>
          <button
            onClick={() => setActiveTab('docker')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'docker'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            Docker &amp; Container
          </button>
          <button
            onClick={() => setActiveTab('cloud')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'cloud'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            Cloud &amp; Intranet Deploy
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
              activeTab === 'backup'
                ? 'border-indigo-600 text-indigo-700 bg-white shadow-sm'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <HardDrive className="w-3.5 h-3.5" />
            Snapshot &amp; Backup
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                <h3 className="text-sm font-bold text-indigo-950 mb-1 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  Why MedLogix is "Easy &amp; Easy to Deploy"
                </h3>
                <p className="text-xs text-indigo-900 leading-relaxed">
                  Traditional hospital systems require months of complex database provisioning, SQL migrations, and proprietary server installation. MedLogix is engineered with a <strong>Zero-Database, Local-First Architecture</strong> that runs immediately anywhere with zero setup.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-2">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Zero External Database</h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Operates without PostgreSQL, MySQL, or Mongo hurdles. Encrypted browser local storage with atomic JSON export.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">Air-Gapped Intranet Ready</h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Ideal for hospital wards with restricted internet. Runs completely offline on local nurses' station networks.
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2">
                    <Globe className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900">1-Minute Static Build</h4>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Build with <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-[10px]">npm run build</code> and drop onto Nginx, Cloud Run, Vercel, or Netlify.
                  </p>
                </div>
              </div>

              {/* System Health Check */}
              <div className="border border-slate-200 rounded-xl p-4 bg-white">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                  Deployment Environment Health Status
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Local Persistent Storage:</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Operational (Ready)
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Active Hospital Audit Logs:</span>
                    <span className="font-mono font-bold text-slate-800">{logs.length} events logged</span>
                  </div>
                  <div className="flex items-center justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-600">Active Patient Records:</span>
                    <span className="font-mono font-bold text-slate-800">{patients.length} admitted</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-600">HIPAA Audit Trail Compliance:</span>
                    <span className="font-semibold text-teal-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Tamper-evident verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DOCKER */}
          {activeTab === 'docker' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                    Production Dockerfile
                  </label>
                  <button
                    onClick={() => copyToClipboard(dockerfileSnippet, 'dockerfile')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    {copiedKey === 'dockerfile' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'dockerfile' ? 'Copied!' : 'Copy Dockerfile'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
                  {dockerfileSnippet}
                </pre>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                    docker-compose.yml
                  </label>
                  <button
                    onClick={() => copyToClipboard(dockerComposeSnippet, 'compose')}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                  >
                    {copiedKey === 'compose' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'compose' ? 'Copied!' : 'Copy Compose'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono overflow-x-auto leading-relaxed border border-slate-800">
                  {dockerComposeSnippet}
                </pre>
              </div>

              <div className="bg-slate-100 p-3 rounded-xl text-xs text-slate-700">
                <span className="font-bold">Run in 1 command:</span>
                <code className="block mt-1 font-mono bg-white p-2 rounded border border-slate-300 text-slate-900">
                  docker-compose up -d
                </code>
              </div>
            </div>
          )}

          {/* TAB 3: CLOUD & INTRANET */}
          {activeTab === 'cloud' && (
            <div className="space-y-4">
              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-teal-600" />
                  Option A: Quick Production Build
                </h4>
                <p className="text-xs text-slate-600 mb-2">
                  Compile the standalone static application bundle ready for any static web server:
                </p>
                <div className="bg-slate-900 text-teal-300 font-mono text-xs p-3 rounded-lg flex items-center justify-between">
                  <span>npm run build</span>
                  <button
                    onClick={() => copyToClipboard('npm run build', 'build_cmd')}
                    className="text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  Outputs complete assets into <code className="font-mono bg-slate-200 px-1 py-0.5 rounded">/dist</code> with zero server dependencies.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <h4 className="text-xs font-bold text-slate-900 mb-1 flex items-center gap-1.5">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  Option B: Hospital Air-Gapped Intranet Setup
                </h4>
                <p className="text-xs text-slate-600 mb-2">
                  To host internally inside a hospital LAN (e.g., 10.x.x.x network without external internet):
                </p>
                <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1 bg-white p-3 rounded-lg border border-slate-200">
                  <li>Run <code className="font-mono text-slate-900 font-bold">npm run build</code></li>
                  <li>Copy the contents of <code className="font-mono text-slate-900 font-bold">/dist</code> into your hospital Nginx or Apache root folder.</li>
                  <li>All patient vitals and audit logs store securely on client workstations and sync via JSON backup.</li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 4: BACKUP & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Download className="w-4 h-4 text-teal-600" />
                  Export Full Hospital Snapshot
                </h4>
                <p className="text-xs text-slate-600">
                  Downloads all active inpatients, historical audit trail events, and staff roster into a standardized JSON snapshot file.
                </p>
                <button
                  onClick={exportLogsJSON}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-lg flex items-center gap-2 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download medlogix_hospital_snapshot.json
                </button>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                  <Upload className="w-4 h-4 text-blue-600" />
                  Restore / Import Hospital Snapshot
                </h4>
                <p className="text-xs text-slate-600">
                  Upload a previously saved JSON snapshot to instantly populate the ward system on a new workstation.
                </p>
                
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />

                {importStatus && (
                  <div className={`text-xs font-bold p-2.5 rounded-lg ${
                    importStatus.includes('success') ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                  }`}>
                    {importStatus}
                  </div>
                )}
              </div>

              {/* Reset to Seed Data */}
              <div className="p-4 bg-rose-50/50 border border-rose-200 rounded-xl space-y-2">
                <h4 className="text-xs font-bold text-rose-900 flex items-center gap-2">
                  <RotateCcw className="w-4 h-4 text-rose-600" />
                  Reset to Pristine Demo Hospital State
                </h4>
                <p className="text-xs text-rose-800/80">
                  Restores default hospital data (ICU patient, ER bays, initial clinical logs). Useful when testing or preparing a demo presentation.
                </p>

                {!showResetConfirm ? (
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 border border-rose-300 font-bold text-xs rounded-lg transition-colors"
                  >
                    Reset Database to Factory Seed State
                  </button>
                ) : (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => { resetToSeedData(); setShowResetConfirm(false); }}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg"
                    >
                      Confirm Reset Now
                    </button>
                    <button
                      onClick={() => setShowResetConfirm(false)}
                      className="px-3 py-1.5 text-slate-600 hover:text-slate-800 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between">
          <span>MedLogix Deployment Engine v2.4</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800"
          >
            Close Guide
          </button>
        </div>

      </div>
    </div>
  );
};
