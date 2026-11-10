import React, { useEffect, useState } from 'react';
import { useHospital } from '../context/HospitalContext';
import { Siren, Users, CheckCircle, ShieldAlert, Clock } from 'lucide-react';

export const EmergencyBanner: React.FC = () => {
  const { alerts, resolveEmergencyAlert, joinAlertResponse, currentUser } = useHospital();
  const [elapsedTimes, setElapsedTimes] = useState<{ [id: string]: string }>({});

  const activeAlerts = alerts.filter(a => a.status !== 'RESOLVED');

  useEffect(() => {
    if (activeAlerts.length === 0) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const updated: { [id: string]: string } = {};

      activeAlerts.forEach(alert => {
        const start = new Date(alert.initiatedAt).getTime();
        const diffSecs = Math.max(0, Math.floor((now - start) / 1000));
        const mins = Math.floor(diffSecs / 60);
        const secs = diffSecs % 60;
        updated[alert.id] = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      });

      setElapsedTimes(updated);
    }, 1000);

    return () => clearInterval(timer);
  }, [activeAlerts]);

  if (activeAlerts.length === 0) return null;

  return (
    <div className="bg-rose-600 text-white shadow-lg border-b-2 border-rose-700 animate-in slide-in-from-top duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="space-y-2">
          {activeAlerts.map(alert => {
            const hasJoined = currentUser && alert.responders.includes(currentUser.name);

            return (
              <div 
                key={alert.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-700/60 p-3 rounded-xl border border-rose-500/50 backdrop-blur-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white text-rose-600 flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                    <Siren className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-sm uppercase tracking-wide bg-white/20 px-2 py-0.5 rounded text-white border border-white/30">
                        {alert.codeType}
                      </span>
                      <span className="font-extrabold text-sm text-rose-100">
                        {alert.location}
                      </span>
                    </div>
                    <div className="text-xs text-rose-100/90 mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      {alert.patientName && (
                        <span>Patient: <strong>{alert.patientName}</strong> ({alert.patientId})</span>
                      )}
                      <span>Initiated by: {alert.initiatedBy}</span>
                      <span className="flex items-center gap-1 font-mono font-bold bg-rose-900/40 px-1.5 py-0.5 rounded text-rose-200">
                        <Clock className="w-3 h-3" />
                        Elapsed: {elapsedTimes[alert.id] || '00:00'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                  <div className="text-[11px] text-rose-100 hidden md:flex items-center gap-1 mr-2">
                    <Users className="w-3.5 h-3.5" />
                    <span>{alert.responders.length} Responders on scene</span>
                  </div>

                  {!hasJoined && currentUser && (
                    <button
                      onClick={() => joinAlertResponse(alert.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-rose-700 hover:bg-rose-50 transition-colors shadow-sm"
                    >
                      Check In as Responder
                    </button>
                  )}

                  <button
                    onClick={() => resolveEmergencyAlert(alert.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-900/80 hover:bg-rose-950 text-rose-100 border border-rose-400/40 transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    Resolve &amp; Log Code
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
