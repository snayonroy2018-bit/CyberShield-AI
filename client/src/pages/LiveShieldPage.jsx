import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Activity, Cpu, Zap, Radio, Lock, RefreshCw, 
  CheckCircle2, AlertTriangle, Globe, Search, Mail, MessageSquare, 
  QrCode, PhoneCall, FileText, ArrowRight, Shield, ToggleLeft, ToggleRight, 
  Terminal, Server, Sliders, ChevronRight, Download
} from 'lucide-react';

const INITIAL_FIREWALL_SHIELDS = [
  { id: 'url', name: 'Zero-Day URL Typosquatting Radar', icon: Search, category: 'URL Security', enabled: true, latency: '0.4 ms', threatsBlocked: 84, color: 'text-cyan-400', border: 'border-cyan-500/30' },
  { id: 'email', name: 'Email Header & SPF/DKIM Matrix', icon: Mail, category: 'Email Security', enabled: true, latency: '0.8 ms', threatsBlocked: 42, color: 'text-blue-400', border: 'border-blue-500/30' },
  { id: 'sms', name: 'SMS Dialect NLP Classifier', icon: MessageSquare, category: 'SMS Security', enabled: true, latency: '0.2 ms', threatsBlocked: 31, color: 'text-purple-400', border: 'border-purple-500/30' },
  { id: 'qr', name: 'QR Quishing Redirect Unroller', icon: QrCode, category: 'QR Security', enabled: true, latency: '0.5 ms', threatsBlocked: 14, color: 'text-amber-400', border: 'border-amber-500/30' },
  { id: 'voice', name: 'Deepfake Voice FFT Spectrogram', icon: PhoneCall, category: 'Voice Security', enabled: true, latency: '1.1 ms', threatsBlocked: 9, color: 'text-red-400', border: 'border-red-500/30' },
  { id: 'screenshot', name: 'Screenshot OCR Brand Inspector', icon: FileText, category: 'Visual Security', enabled: true, latency: '1.4 ms', threatsBlocked: 5, color: 'text-emerald-400', border: 'border-emerald-500/30' },
  { id: 'domain', name: 'Domain WHOIS & RDAP Inspector', icon: Globe, category: 'Domain Security', enabled: true, latency: '0.6 ms', threatsBlocked: 19, color: 'text-sky-400', border: 'border-sky-500/30' },
  { id: 'chat', name: 'AI Counselor Neural Guard', icon: Cpu, category: 'AI Security', enabled: true, latency: '0.3 ms', threatsBlocked: 0, color: 'text-indigo-400', border: 'border-indigo-500/30' }
];

const RECENT_THREAT_FEEDS = [
  { id: 'TRT-9921', vector: 'URL Typosquatting', surface: 'https://amaz0n-secure-login.xyz', risk: '96% CRITICAL', ip: '185.220.101.5', status: 'CONTAINED', time: '10 seconds ago' },
  { id: 'TRT-8840', vector: 'Email Spoofing', surface: 'support@paytm-alert-bank.com', risk: '92% HIGH', ip: '103.14.26.11', status: 'DKIM REJECTED', time: '42 seconds ago' },
  { id: 'TRT-7731', vector: 'SMS Lottery Trap', surface: '+91 98765 43210 (₹10 Lakh Claim)', risk: '95% CRITICAL', ip: '45.142.120.9', status: 'CONTAINED', time: '2 mins ago' },
  { id: 'TRT-6512', vector: 'Vishing Deepfake', surface: 'SBI Branch Manager OTP Request', risk: '98% CRITICAL', ip: '194.26.29.112', status: 'AUDIO ISOLATED', time: '5 mins ago' },
  { id: 'TRT-5489', vector: 'QR Quishing Trap', surface: 'https://bit.ly/paytm-collect-gate', risk: '89% HIGH', ip: '198.51.100.42', status: 'UNROLLED & BLOCKED', time: '8 mins ago' }
];

export default function LiveShieldPage({ user }) {
  const navigate = useNavigate();
  const [shields, setShields] = useState(INITIAL_FIREWALL_SHIELDS);
  const [empPulseActive, setEmpPulseActive] = useState(false);
  const [empPulseCount, setEmpPulseCount] = useState(185);
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'stream' | 'telemetry' | 'helpline'
  
  const [logs, setLogs] = useState([
    'CYBERSHIELD LIVE SHIELD: Real-time defense matrix initialized.',
    'FIREWALL ENGINE: 8 Microservices active with 0.4ms average latency.',
    'NATIONAL HELPLINE 1930: Direct sync active (National Cyber Crime Reporting Portal).'
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      const ping = (Math.random() * 0.3 + 0.2).toFixed(2);
      const fps = Math.floor(59.7 + Math.random() * 0.5);
      setLogs(prev => [
        `LIVE SHIELD TELEMETRY: [Ping: ${ping}ms | Sampling: 60Hz | Frame: ${fps} FPS | Zero Packets Dropped]`,
        ...prev.slice(0, 5)
      ]);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const toggleShield = (id) => {
    setShields(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.enabled;
        setLogs(l => [
          `⚠️ FIREWALL RULE MODIFIED: ${s.name} set to ${nextState ? 'ENABLED (ACTIVE)' : 'DISABLED (BYPASSED)'}`,
          ...l
        ]);
        return { ...s, enabled: nextState };
      }
      return s;
    }));
  };

  const triggerEmpPulse = () => {
    setEmpPulseActive(true);
    setTimeout(() => {
      setEmpPulseCount(prev => prev + 3);
      setEmpPulseActive(false);
      setLogs(l => [
        '⚡ EMP CONTAINMENT WAVE BROADCASTED: 3 pending threat vectors zeroed out.',
        '✅ SHIELD MATRIX RECALIBRATED: 100% Protection Enforced.',
        ...l
      ]);
    }, 1200);
  };

  const activeShieldsCount = shields.filter(s => s.enabled).length;

  return (
    <div className="space-y-8 pb-16 font-mono">
      
      {/* PAGE HEADER BANNER */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.2)] relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
              <ShieldCheck className="w-9 h-9 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                  LIVE SHIELD COMMAND CENTER
                </span>
                <span className="text-[10px] text-emerald-400 font-bold animate-ping">
                  ● {activeShieldsCount}/8 SHIELDS ENFORCED
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 mt-1">
                Real-Time Cyber Shield Defense Matrix
              </h1>
            </div>
          </div>

          <button
            onClick={triggerEmpPulse}
            disabled={empPulseActive}
            className="w-full md:w-auto px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-black font-extrabold text-xs transition-all shadow-[0_0_30px_rgba(16,185,129,0.4)] flex items-center justify-center space-x-2 hover:scale-105 cursor-pointer"
          >
            <Zap className={`w-4 h-4 ${empPulseActive ? 'animate-bounce text-yellow-300' : ''}`} />
            <span>{empPulseActive ? 'Broadcasting EMP Wave...' : 'Trigger EMP Containment Pulse'}</span>
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          Dedicated autonomous firewall command console. Toggles real-time zero-day protection modules, monitors live threat interceptions, and verifies 1930 Cyber Helpline reporting protocols.
        </p>

        {/* TOP STAT METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-[#060c17] border border-emerald-500/30 text-center space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">Shield Integrity</div>
            <div className="text-emerald-400 font-bold text-base flex items-center justify-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>100% MAXIMUM</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#060c17] border border-purple-500/30 text-center space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">Threats Intercepted</div>
            <div className="text-purple-400 font-bold text-base">{empPulseCount} BLOCKED</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#060c17] border border-cyan-500/30 text-center space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">Detection Latency</div>
            <div className="text-cyan-400 font-bold text-base">&lt; 0.4 ms</div>
          </div>

          <div className="p-4 rounded-2xl bg-[#060c17] border border-sky-500/30 text-center space-y-1">
            <div className="text-[10px] text-slate-400 uppercase">1930 Helpline Sync</div>
            <div className="text-sky-300 font-bold text-base flex items-center justify-center space-x-1">
              <CheckCircle2 className="w-4 h-4 text-sky-400" />
              <span>CONNECTED</span>
            </div>
          </div>
        </div>
      </div>

      {/* TAB NAVIGATION BAR */}
      <div className="flex rounded-2xl bg-[#030712] border border-slate-800 p-1.5 justify-between gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'rules'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-neon'
              : 'text-slate-400 hover:text-emerald-300'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>8 Live Firewall Modules</span>
        </button>

        <button
          onClick={() => setActiveTab('stream')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'stream'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-neon'
              : 'text-slate-400 hover:text-purple-300'
          }`}
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Live Threat Interceptions</span>
        </button>

        <button
          onClick={() => setActiveTab('telemetry')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'telemetry'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-neon'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Socket Telemetry Logs</span>
        </button>

        <button
          onClick={() => setActiveTab('helpline')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'helpline'
              ? 'bg-red-500/20 text-red-300 border border-red-500/40 shadow-neon'
              : 'text-slate-400 hover:text-red-300'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Helpline 1930 Integration</span>
        </button>
      </div>

      {/* TAB 1: 8 LIVE FIREWALL MODULE TOGGLES */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-300 px-1">
            <span className="font-bold flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Real-Time Autonomous Firewall Shield Configuration</span>
            </span>
            <span className="text-emerald-400">Click any switch to enable/disable rule</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {shields.map((shield) => {
              const IconComponent = shield.icon;
              return (
                <div
                  key={shield.id}
                  className={`glass-panel p-5 rounded-2xl border ${shield.border} flex items-center justify-between transition-all card-3d-emerald cursor-pointer`}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-2xl bg-slate-900 ${shield.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-slate-100">{shield.name}</div>
                      <div className="text-xs text-slate-400 flex items-center space-x-2">
                        <span>{shield.category}</span>
                        <span>•</span>
                        <span>Latency: {shield.latency}</span>
                      </div>
                      <div className="text-[10px] text-cyan-400 font-bold">
                        {shield.threatsBlocked} Threats Neutralized Today
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleShield(shield.id)}
                    className="p-2 cursor-pointer transition-transform hover:scale-110"
                    title={shield.enabled ? "Disable Shield Rule" : "Enable Shield Rule"}
                  >
                    {shield.enabled ? (
                      <ToggleRight className="w-9 h-9 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-9 h-9 text-slate-600" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: LIVE THREAT INTERCEPTIONS STREAM TABLE */}
      {activeTab === 'stream' && (
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
            <span className="text-purple-300 font-bold text-sm flex items-center space-x-2">
              <Radio className="w-4 h-4 text-purple-400 animate-pulse" />
              <span>Real-Time Intercepted Attack Vector Stream</span>
            </span>
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-purple-400 hover:underline flex items-center space-x-1"
            >
              <span>View Full Scan History</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl bg-[#030712] border border-slate-800">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#080d1a] border-b border-slate-800 text-slate-400 font-bold">
                  <th className="p-3.5">Threat ID</th>
                  <th className="p-3.5">Attack Vector</th>
                  <th className="p-3.5">Target Surface</th>
                  <th className="p-3.5">Risk Score</th>
                  <th className="p-3.5">Origin IP</th>
                  <th className="p-3.5">Firewall Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {RECENT_THREAT_FEEDS.map((item) => (
                  <tr key={item.id} className="hover:bg-purple-950/20 transition-colors">
                    <td className="p-3.5 text-purple-400 font-bold">{item.id}</td>
                    <td className="p-3.5 text-slate-200">{item.vector}</td>
                    <td className="p-3.5 text-cyan-300 font-semibold truncate max-w-xs">{item.surface}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold">
                        {item.risk}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-400">{item.ip}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: SOCKET TELEMETRY LOGS */}
      {activeTab === 'telemetry' && (
        <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 space-y-4">
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
            <span className="text-cyan-400 font-bold text-sm flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Real-Time TCP/UDP Socket Telemetry Ticker</span>
            </span>
            <span className="text-[10px] text-emerald-400 font-bold animate-ping">
              ● 60Hz SAMPLING LOOP
            </span>
          </div>

          <div className="h-64 overflow-y-auto bg-[#030712] p-4 rounded-2xl border border-slate-800 text-xs space-y-2 font-mono text-cyan-300">
            {logs.map((log, index) => (
              <div key={index} className="flex items-start space-x-2 leading-relaxed">
                <span className="text-slate-500">&gt;</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: HELPLINE 1930 INTEGRATION */}
      {activeTab === 'helpline' && (
        <div className="glass-panel p-6 rounded-3xl border border-red-500/30 space-y-5">
          <div className="flex items-center space-x-3 border-b border-red-500/20 pb-3">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            <div>
              <h3 className="text-lg font-bold text-slate-100">National Cyber Crime Reporting Portal (1930) Direct Sync</h3>
              <p className="text-xs text-slate-400">Automated incident sync for financial fraud, UPI scams, and identity theft.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#060c17] border border-red-500/30 space-y-2">
              <div className="text-xs text-slate-400">CYBER HELPLINE HOTLINE</div>
              <div className="text-xl font-bold text-red-400">Toll Free: 1930</div>
              <p className="text-[10px] text-slate-500">Government of India National Cyber Crime Portal</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#060c17] border border-cyan-500/30 space-y-2">
              <div className="text-xs text-slate-400">AUTOMATED AUDIT REPORT</div>
              <div className="text-xl font-bold text-cyan-300">Instant PDF Download</div>
              <p className="text-[10px] text-slate-500">Includes XAI proof, SSL certificate chain & WHOIS trace</p>
            </div>

            <div className="p-4 rounded-2xl bg-[#060c17] border border-emerald-500/30 space-y-2">
              <div className="text-xs text-slate-400">ONE-CLICK REPORTING</div>
              <button
                onClick={() => navigate('/report-incident')}
                className="w-full py-2 px-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-300 hover:bg-red-500/30 font-bold text-xs transition-colors cursor-pointer mt-1"
              >
                File Fraud Incident Report ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QUICK PAGE NAVIGATION FOOTER STRIP */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-100">Need to execute an AI Threat Scan?</h4>
          <p className="text-xs text-slate-400">Jump directly to the 8 AI Scanner Modules Suite or review threat history.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/scanners')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs shadow-neon hover:scale-105 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <span>Launch AI Scanners (8)</span>
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 font-semibold text-xs transition-colors cursor-pointer"
          >
            Dashboard
          </button>
        </div>
      </div>

    </div>
  );
}
