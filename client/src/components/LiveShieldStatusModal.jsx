import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, ShieldCheck, Activity, Cpu, Zap, Radio, Lock, RefreshCw, 
  CheckCircle2, ChevronRight, Server, Globe, Search, Mail, 
  MessageSquare, QrCode, PhoneCall, FileText, ArrowRight, Sliders, AlertTriangle
} from 'lucide-react';

const MODULES_STATUS = [
  { id: 'url', name: 'URL & Typosquatting Radar', icon: Search, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10', latency: '0.4 ms', status: 'ACTIVE', threatsBlocked: 84 },
  { id: 'email', name: 'Email Header & SPF/DKIM Matrix', icon: Mail, color: 'text-blue-400', border: 'border-blue-500/30', bg: 'bg-blue-500/10', latency: '0.8 ms', status: 'ACTIVE', threatsBlocked: 42 },
  { id: 'sms', name: 'SMS Dialect NLP Classifier', icon: MessageSquare, color: 'text-purple-400', border: 'border-purple-500/30', bg: 'bg-purple-500/10', latency: '0.2 ms', status: 'MONITORING', threatsBlocked: 31 },
  { id: 'qr', name: 'QR Quishing Unroll Engine', icon: QrCode, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10', latency: '0.5 ms', status: 'DECRYPTED', threatsBlocked: 14 },
  { id: 'voice', name: 'Deepfake Voice FFT Spectrogram', icon: PhoneCall, color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10', latency: '1.1 ms', status: 'ACTIVE', threatsBlocked: 9 },
  { id: 'screenshot', name: 'Screenshot OCR Brand Inspector', icon: FileText, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10', latency: '1.4 ms', status: 'READY', threatsBlocked: 5 },
  { id: 'domain', name: 'Domain WHOIS & RDAP Inspector', icon: Globe, color: 'text-sky-400', border: 'border-sky-500/30', bg: 'bg-sky-500/10', latency: '0.6 ms', status: 'SYNCED', threatsBlocked: 19 },
  { id: 'chat', name: 'AI Counselor Neural Assistant', icon: Cpu, color: 'text-indigo-400', border: 'border-indigo-500/30', bg: 'bg-indigo-500/10', latency: '0.3 ms', status: 'LOADED', threatsBlocked: 0 }
];

const MOCK_INTERCEPTED_THREATS = [
  { id: 'TRT-9041', vector: 'URL Typosquatting', target: 'amaz0n-secure-verify.xyz', risk: '96% CRITICAL', ip: '185.220.101.5', action: 'BLOCKED & ISOLATED' },
  { id: 'TRT-8820', vector: 'Email Spoofing', target: 'support@paytm-alert-bank.com', risk: '92% HIGH', ip: '103.14.26.11', action: 'DKIM REJECTED' },
  { id: 'TRT-7712', vector: 'SMS Lottery Trap', target: '+91 98765 43210 (₹10 Lakh Claim)', risk: '95% CRITICAL', ip: '45.142.120.9', action: 'CONTAINED' },
  { id: 'TRT-6549', vector: 'Vishing Deepfake', target: 'SBI Branch Manager OTP Request', risk: '98% CRITICAL', ip: '194.26.29.112', action: 'AUDIO ISOLATED' },
  { id: 'TRT-5410', vector: 'QR Code Quishing', target: 'https://bit.ly/paytm-collect-gate', risk: '89% HIGH', ip: '198.51.100.42', action: 'UNROLLED & BLOCKED' }
];

export default function LiveShieldStatusModal({ isOpen, onClose, user }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('modules'); // 'modules' | 'feed' | 'telemetry' | 'cipher'
  const [recalibrating, setRecalibrating] = useState(false);
  const [shieldLogs, setShieldLogs] = useState([
    'LIVE SHIELD KERNEL: Socket listener bound to Port 5000 & Port 8000.',
    'FIREWALL RULESET: 50,000+ Scammer VPAs & Typosquatting signatures enforced.',
    'CYBER HELPLINE 1930: Direct sync active (National Cyber Crime Portal).'
  ]);

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        const ping = (Math.random() * 0.3 + 0.2).toFixed(2);
        const fps = Math.floor(59.7 + Math.random() * 0.5);
        setShieldLogs(prev => [
          `SHIELD HEARTBEAT: [Sampling: 60Hz | Frame: ${fps} FPS | Ping: ${ping}ms | Zero Dropped]`,
          ...prev.slice(0, 5)
        ]);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRecalibrateShield = () => {
    setRecalibrating(true);
    setTimeout(() => {
      setRecalibrating(false);
      setShieldLogs(prev => [
        '✅ SHIELD RECALIBRATED: Zero-day threat vector signatures zeroed out.',
        '🛡️ FIREWALL STATUS: 100% MAXIMUM PROTECTION ENFORCED.',
        ...prev
      ]);
    }, 1200);
  };

  const handleNavigatePage = (path, stateObj) => {
    onClose();
    if (user) {
      navigate(path, { state: stateObj });
    } else {
      navigate('/login', { state: { msg: 'Please sign in to access live protection tools.', ...stateObj } });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-mono text-slate-100 animate-fade-in">
      <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-emerald-500/40 p-6 md:p-8 shadow-[0_0_60px_rgba(16,185,129,0.25)] space-y-6 my-auto max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  REAL-TIME CYBER DEFENSE
                </span>
                <span className="text-[10px] text-emerald-400 font-bold animate-ping">
                  ● SHIELD 100% ACTIVE
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-100 mt-1">
                CyberShield AI Live Shield Status & Control Matrix
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-2xl border border-transparent hover:border-emerald-500/30 transition-all cursor-pointer"
            title="Close Live Shield Window"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 4 Quick Telemetry Stat Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-2xl bg-[#060c17] border border-emerald-500/30 text-center space-y-0.5">
            <div className="text-[10px] text-slate-400">SHIELD HEALTH</div>
            <div className="text-emerald-400 font-bold text-sm flex items-center justify-center space-x-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>100% ACTIVE</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#060c17] border border-purple-500/30 text-center space-y-0.5">
            <div className="text-[10px] text-slate-400">THREATS INTERCEPTED</div>
            <div className="text-purple-400 font-bold text-sm">185 BLOCKED</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#060c17] border border-cyan-500/30 text-center space-y-0.5">
            <div className="text-[10px] text-slate-400">NEURAL RESPONSE</div>
            <div className="text-cyan-400 font-bold text-sm">&lt; 0.4 ms</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#060c17] border border-sky-500/30 text-center space-y-0.5">
            <div className="text-[10px] text-slate-400">AI MODELS</div>
            <div className="text-sky-300 font-bold text-sm">BERT + NLP</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex rounded-2xl bg-[#030712] border border-slate-800 p-1.5 justify-between gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('modules')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'modules'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-neon'
                : 'text-slate-400 hover:text-emerald-300'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>8 Active Modules</span>
          </button>

          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'feed'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-neon'
                : 'text-slate-400 hover:text-purple-300'
            }`}
          >
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>Live Threat Feed</span>
          </button>

          <button
            onClick={() => setActiveTab('telemetry')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'telemetry'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Socket Telemetry</span>
          </button>

          <button
            onClick={() => setActiveTab('cipher')}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'cipher'
                ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-neon'
                : 'text-slate-400 hover:text-sky-300'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>AES-256 Cipher</span>
          </button>
        </div>

        {/* TAB 1: 8 ACTIVE MODULES GRID */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
            {MODULES_STATUS.map((mod) => {
              const IconComp = mod.icon;
              return (
                <div
                  key={mod.id}
                  onClick={() => handleNavigatePage('/scanners', { prefillType: mod.id })}
                  className={`p-3.5 rounded-2xl bg-[#030712] border ${mod.border} hover:scale-[1.02] cursor-pointer transition-all flex items-center justify-between group`}
                  title={`Click to open ${mod.name}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-xl ${mod.bg} ${mod.color}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                        {mod.name}
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                        <span>Latency: {mod.latency}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">● {mod.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 block">
                      {mod.threatsBlocked} Blocked
                    </span>
                    <span className="text-[9px] text-cyan-400 group-hover:underline mt-1 block">
                      Open Scanner ➔
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: LIVE THREAT INTERCEPTED FEED */}
        {activeTab === 'feed' && (
          <div className="rounded-2xl bg-[#030712] border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#080d1a] border-b border-slate-800 text-slate-400 font-bold sticky top-0 z-10">
                    <th className="p-3">Threat ID</th>
                    <th className="p-3">Attack Vector</th>
                    <th className="p-3">Target Surface</th>
                    <th className="p-3">Risk Level</th>
                    <th className="p-3">Origin IP</th>
                    <th className="p-3">Firewall Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {MOCK_INTERCEPTED_THREATS.map((item) => (
                    <tr 
                      key={item.id}
                      onClick={() => handleNavigatePage('/history')}
                      className="hover:bg-purple-950/20 transition-colors cursor-pointer"
                      title="Click to view full threat audit log"
                    >
                      <td className="p-3 text-purple-400 font-bold flex items-center space-x-1.5">
                        <Radio className="w-3 h-3 text-purple-400 animate-pulse" />
                        <span>{item.id}</span>
                      </td>
                      <td className="p-3 text-slate-200">{item.vector}</td>
                      <td className="p-3 text-cyan-300 font-semibold truncate max-w-xs">{item.target}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                          {item.risk}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{item.ip}</td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                          {item.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SOCKET TELEMETRY & LOG STREAM */}
        {activeTab === 'telemetry' && (
          <div className="p-4 rounded-2xl bg-[#030712] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-cyan-400 font-bold flex items-center space-x-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Live Socket Telemetry & microservice Log Stream</span>
              </span>
              <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                ● REALTIME TELEMETRY 60Hz
              </span>
            </div>
            <div className="space-y-2 text-xs font-mono text-cyan-300 max-h-48 overflow-y-auto">
              {shieldLogs.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-2 leading-relaxed">
                  <span className="text-slate-500">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: AES-256 CIPHER SECURITY PROTOCOL */}
        {activeTab === 'cipher' && (
          <div className="p-5 rounded-2xl bg-[#030712] border border-sky-500/30 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-sky-300 font-bold flex items-center space-x-2">
                <Lock className="w-4 h-4 text-sky-400" />
                <span>Cryptographic Protocol & GCM Tag Authorization</span>
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                AES-256-GCM VERIFIED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">ENCRYPTION ALGORITHM</div>
                <div className="text-slate-100 font-bold">AES-256-GCM authenticated cipher</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">TLS PROTOCOL VERSION</div>
                <div className="text-slate-100 font-bold">TLS 1.3 / Perfect Forward Secrecy</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">CYBER CRIME HELPLINE SYNC</div>
                <div className="text-emerald-400 font-bold">National Helpline 1930 Active</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="text-slate-400 text-[10px]">XAI EXPLAINABILITY SCORE</div>
                <div className="text-cyan-400 font-bold">99.4% Explainable AI Verified</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-4">
          <button
            onClick={handleRecalibrateShield}
            disabled={recalibrating}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_20px_rgba(16,185,129,0.25)]"
          >
            <RefreshCw className={`w-4 h-4 ${recalibrating ? 'animate-spin' : ''}`} />
            <span>{recalibrating ? 'Recalibrating Shield Ruleset...' : 'Trigger EMP Shield Containment Pulse'}</span>
          </button>

          <div className="flex flex-wrap items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => handleNavigatePage('/scanners')}
              className="px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              Open AI Scanners
            </button>
            <button
              onClick={() => handleNavigatePage('/dashboard')}
              className="px-4 py-2.5 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-300 hover:bg-blue-500/30 text-xs font-bold transition-all cursor-pointer"
            >
              Telemetry Dashboard
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 text-xs font-bold transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
