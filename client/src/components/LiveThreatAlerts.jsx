import React, { useEffect, useState } from 'react';
import { AlertOctagon, X, ShieldAlert } from 'lucide-react';
import { getSocket } from '../services/api';

export default function LiveThreatAlerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const socket = getSocket();

    socket.on('threat_alert', (newAlert) => {
      const id = Date.now();
      setAlerts((prev) => [{ ...newAlert, id }, ...prev.slice(0, 2)]);
      
      // Auto dismiss after 8 seconds
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
      }, 8000);
    });

    return () => {
      socket.off('threat_alert');
    };
  }, []);

  const dismissAlert = (id) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  };

  if (alerts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 space-y-3 max-w-sm w-full px-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className="glass-panel border-l-4 border-red-500 bg-[#0f172a]/95 text-slate-100 p-4 rounded-xl shadow-glow-red animate-bounce-short flex items-start justify-between space-x-3"
        >
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-red-500/20 text-red-400 mt-0.5">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 font-bold uppercase">
                  {alert.scanType || 'SCAN ALERT'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono">{alert.time}</span>
              </div>
              <h5 className="text-sm font-bold text-slate-100 mt-1">{alert.title}</h5>
              <p className="text-xs text-slate-300 font-mono mt-0.5 truncate max-w-[220px]">
                {alert.input}
              </p>
              <div className="text-[11px] font-bold text-red-400 mt-1.5 flex items-center space-x-1">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>Risk Level: {alert.riskScore}% / 100%</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => dismissAlert(alert.id)}
            className="text-slate-400 hover:text-slate-200 transition-colors p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
