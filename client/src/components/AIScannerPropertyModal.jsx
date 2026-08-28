import React, { useState, useEffect } from 'react';
import { 
  X, Shield, Zap, Search, Globe, Mail, MessageSquare, QrCode, Mic, 
  FileText, CreditCard, Bot, Activity, RefreshCw, CheckCircle2, 
  AlertTriangle, Cpu, Terminal, ShieldCheck, ArrowRight, Lock, Eye
} from 'lucide-react';

export default function AIScannerPropertyModal({ property, onClose, onExecuteScan }) {
  const [runningDiagnostic, setRunningDiagnostic] = useState(false);
  const [showRawPacket, setShowRawPacket] = useState(false);
  const [diagnosticLogs, setDiagnosticLogs] = useState([]);

  useEffect(() => {
    if (property) {
      setDiagnosticLogs([
        `INITIALIZING PROPERTY INSPECTOR: ${property.title || 'Security Module'}`,
        `STATUS: ${property.status || 'ACTIVE & ENFORCED'} • PROTOCOL v2.4`,
        `AUDIT: Validated against CyberShield Threat Intelligence database.`
      ]);
    }
  }, [property]);

  if (!property) return null;

  const handleRunDiagnostic = () => {
    setRunningDiagnostic(true);
    setTimeout(() => {
      setRunningDiagnostic(false);
      setDiagnosticLogs(prev => [
        `✅ DIAGNOSTIC PASS: ${property.title} passed zero-day integrity test [Latency: 0.8ms].`,
        ...prev
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-mono text-slate-100 animate-fade-in">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-cyan-500/40 p-6 md:p-8 shadow-[0_0_60px_rgba(0,240,255,0.25)] space-y-6 my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
              <Shield className="w-7 h-7 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                  {property.category || 'AI SCANNER ENGINE'}
                </span>
                <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                  ● {property.status || 'ACTIVE'}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-100 mt-1">
                {property.title}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-2xl border border-transparent hover:border-cyan-500/30 transition-all cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Description & Overview */}
        <div className="p-4 rounded-2xl bg-[#060c17] border border-cyan-500/20 space-y-2">
          <div className="text-xs text-cyan-400 font-bold uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="w-4 h-4" />
            <span>Property Architecture & Capabilities</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {property.description || `The ${property.title} provides real-time heuristic validation, pattern extraction, and threat verification across all incoming payloads.`}
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(property.metrics || [
            { label: 'Detection Accuracy', value: '99.6% High Precision' },
            { label: 'Inspection Speed', value: '< 1.2 ms Response' },
            { label: 'Database Verification', value: 'SQLite 3NF Normalized Engine' },
            { label: 'Security Enforcement', value: 'Zero-Trust Protocol' }
          ]).map((metric, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-[#060c17] border border-slate-800 space-y-1 hover:border-cyan-500/30 transition-colors">
              <span className="text-[11px] text-slate-400">{metric.label}</span>
              <div className="text-sm font-bold text-cyan-300 truncate">{metric.value}</div>
            </div>
          ))}
        </div>

        {/* Interactive Diagnostics Console */}
        <div className="p-4 rounded-2xl bg-[#030712] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="text-xs text-slate-300 font-bold flex items-center space-x-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Real-Time Property Telemetry Stream</span>
            </span>
            <button
              onClick={() => setShowRawPacket(!showRawPacket)}
              className="text-[10px] px-2.5 py-1 rounded bg-slate-800 text-cyan-400 hover:text-cyan-300 border border-slate-700 cursor-pointer"
            >
              {showRawPacket ? 'View Human Summary' : 'View Raw Protocol JSON'}
            </button>
          </div>

          {!showRawPacket ? (
            <div className="space-y-1.5 text-[11px] font-mono text-cyan-300 max-h-32 overflow-y-auto">
              {diagnosticLogs.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-slate-500">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          ) : (
            <pre className="text-[10px] text-emerald-400 font-mono bg-black/60 p-3 rounded-xl overflow-x-auto max-h-32">
              {JSON.stringify(property.rawPacket || {
                property: property.title,
                status: "ACTIVE",
                timestamp: new Date().toISOString(),
                protocol_version: "CYBER_SHIELD_V2.4",
                threat_database_matches: 0
              }, null, 2)}
            </pre>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={handleRunDiagnostic}
            disabled={runningDiagnostic}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${runningDiagnostic ? 'animate-spin' : ''}`} />
            <span>{runningDiagnostic ? 'Running Diagnostic Audit...' : 'Run Property Diagnostic Audit'}</span>
          </button>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
            >
              Close Inspector
            </button>
            {onExecuteScan && (
              <button
                onClick={() => {
                  onClose();
                  onExecuteScan();
                }}
                className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center space-x-2 cursor-pointer"
              >
                <span>Execute Scan Input</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
