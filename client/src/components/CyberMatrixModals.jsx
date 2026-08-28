import React, { useState, useEffect } from 'react';
import { 
  X, Box, Cpu, Activity, RefreshCw, Zap, Orbit, Compass, Radio, 
  CheckCircle2, AlertTriangle, Search, ChevronRight, Eye, Play, 
  Pause, Layers, Target, ShieldCheck, ArrowUpRight, Sliders
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// 35 Mock Threat Beacons Data
const INITIAL_BEACONS = Array.from({ length: 35 }, (_, i) => {
  const categories = [
    { type: 'URL Phishing', surface: `amaz0n-secure-verify-${i+1}.xyz`, risk: 90 + (i % 9), level: 'CRITICAL' },
    { type: 'Email Fraud', surface: `support@paytm-alert-${i+1}.com`, risk: 85 + (i % 12), level: 'HIGH' },
    { type: 'SMS Lottery Trap', surface: `+91 98765 ${10000 + i*137} (Claim ₹10 Lakhs)`, risk: 94 + (i % 5), level: 'CRITICAL' },
    { type: 'QR Payment Trap', surface: `https://paytm-payment-gate-${i+1}.online`, risk: 88 + (i % 10), level: 'HIGH' },
    { type: 'Voice Vishing', surface: `Impersonating SBI Manager - OTP Request`, risk: 96 + (i % 4), level: 'CRITICAL' }
  ];
  const item = categories[i % categories.length];
  return {
    id: `BCN-${String(i + 1).padStart(2, '0')}`,
    type: item.type,
    surface: item.surface,
    riskScore: item.risk,
    riskLevel: item.level,
    radius: Math.floor(110 + (i * 7.5) % 180),
    ping: Math.floor(12 + (i * 3.7) % 45),
    status: i % 7 === 0 ? 'CONTAINED' : i % 5 === 0 ? 'ISOLATED' : 'ACTIVE ORBIT'
  };
});

export default function CyberMatrixModals({ activeModal, onClose, user, onRecalibrateMatrix }) {
  const navigate = useNavigate();

  // State for Modal 1: Projection
  const [fov, setFov] = useState(280);
  const [shaderMode, setShaderMode] = useState('Quantum Neon');
  const [recalibrating, setRecalibrating] = useState(false);
  const [projectionLogs, setProjectionLogs] = useState([
    'SYSTEM: Spatial Hologram Matrix Engine operational.',
    'PROJECTION: X, Y, Z orthogonal coordinate planes active.',
    'GEOMETRY: 8 Vertex Nodes & 12 Wireframe Vectors synchronized at 60 FPS.'
  ]);

  // State for Modal 2: Beacons
  const [beaconsFilter, setBeaconsFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [beaconList, setBeaconList] = useState(INITIAL_BEACONS);
  const [pulseActive, setPulseActive] = useState(false);
  const [selectedBeacon, setSelectedBeacon] = useState(null);

  // State for Modal 3: Tilt Response
  const [tiltSens, setTiltSens] = useState(2.0);
  const [damping, setDamping] = useState('Smooth Physics');
  const [simPos, setSimPos] = useState({ x: 0, y: 0 });

  // Auto-update logs for Projection
  useEffect(() => {
    if (activeModal === 'projection') {
      const interval = setInterval(() => {
        const randX = (Math.random() * 200 - 100).toFixed(3);
        const randY = (Math.random() * 200 - 100).toFixed(3);
        const randZ = (Math.random() * 200 - 100).toFixed(3);
        setProjectionLogs(prev => [
          `VECTOR DATA: Delta [X: ${randX} | Y: ${randY} | Z: ${randZ}] - Render Normal OK`,
          ...prev.slice(0, 4)
        ]);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [activeModal]);

  if (!activeModal) return null;

  const handleNavigateScanners = (prefillType = 'url', prefillInput = '') => {
    onClose();
    const type = typeof prefillType === 'string' ? prefillType : 'url';
    const input = typeof prefillInput === 'string' ? prefillInput : '';
    if (user) {
      navigate('/scanners', { state: { prefillType: type, prefillInput: input } });
    } else {
      navigate('/login', { state: { prefillType: type, prefillInput: input } });
    }
  };

  const triggerRecalibrate = () => {
    setRecalibrating(true);
    if (onRecalibrateMatrix) onRecalibrateMatrix();
    setTimeout(() => {
      setRecalibrating(false);
      setProjectionLogs(prev => [
        '✅ RECALIBRATION COMPLETE: X-Y-Z Axes zero-point aligned.',
        ...prev
      ]);
    }, 1200);
  };

  const triggerNeutralizationPulse = () => {
    setPulseActive(true);
    setTimeout(() => {
      setBeaconList(prev => prev.map(b => b.riskScore > 90 ? { ...b, status: 'CONTAINED' } : b));
      setPulseActive(false);
    }, 1500);
  };

  // Filtered beacons
  const filteredBeacons = beaconList.filter(b => {
    const matchesFilter = 
      beaconsFilter === 'ALL' ? true :
      beaconsFilter === 'CRITICAL' ? b.riskScore >= 92 :
      beaconsFilter === 'URL' ? b.type.includes('URL') :
      beaconsFilter === 'EMAIL' ? b.type.includes('Email') :
      beaconsFilter === 'SMS' ? b.type.includes('SMS') : true;

    const matchesSearch = 
      b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.surface.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.type.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto font-mono text-slate-100">
      
      {/* ========================================================= */}
      {/* MODAL 1: 3D MATRIX PROJECTION */}
      {/* ========================================================= */}
      {activeModal === 'projection' && (
        <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-cyan-500/40 p-6 md:p-8 shadow-[0_0_60px_rgba(0,240,255,0.25)] space-y-6 my-auto max-h-[90vh] overflow-y-auto animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
                <Box className="w-7 h-7 animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                    SPATIAL MATRIX CONTROLLER
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                    ● X, Y, Z ACTIVE
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-100 mt-1">
                  3D Holographic Matrix Projection Telemetry
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

          {/* Real-time 3D Axes Spatial Coordinate Telemetry */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* X-AXIS */}
            <div className="p-4 rounded-2xl bg-[#060c17] border border-cyan-500/30 space-y-2 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs text-cyan-400 font-bold">X-AXIS (Payload Vector)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300">ORBITING</span>
              </div>
              <div className="text-2xl font-bold text-slate-100 font-mono tracking-wider">
                +142.859°
              </div>
              <p className="text-[11px] text-slate-400">
                Continuous horizontal rotational sweep at 0.015 rad/s.
              </p>
              <div className="w-full bg-cyan-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-cyan-400 h-full rounded-full animate-pulse" style={{ width: '78%' }}></div>
              </div>
            </div>

            {/* Y-AXIS */}
            <div className="p-4 rounded-2xl bg-[#060c17] border border-purple-500/30 space-y-2 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs text-purple-400 font-bold">Y-AXIS (Risk Density)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300">LOCKED</span>
              </div>
              <div className="text-2xl font-bold text-slate-100 font-mono tracking-wider">
                -89.412°
              </div>
              <p className="text-[11px] text-slate-400">
                Vertical pitch elevation & heuristic risk map layer.
              </p>
              <div className="w-full bg-purple-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-purple-400 h-full rounded-full animate-pulse" style={{ width: '64%' }}></div>
              </div>
            </div>

            {/* Z-AXIS */}
            <div className="p-4 rounded-2xl bg-[#060c17] border border-emerald-500/30 space-y-2 relative overflow-hidden group">
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-400 font-bold">Z-AXIS (Depth Focal)</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">STABLE</span>
              </div>
              <div className="text-2xl font-bold text-slate-100 font-mono tracking-wider">
                +{fov}px
              </div>
              <p className="text-[11px] text-slate-400">
                Focal perspective field-of-view depth projection plane.
              </p>
              <div className="w-full bg-emerald-950 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full rounded-full animate-pulse" style={{ width: '92%' }}></div>
              </div>
            </div>

          </div>

          {/* Interactive Matrix Projection Controls */}
          <div className="p-5 rounded-2xl bg-[#060c17]/80 border border-cyan-500/20 space-y-4">
            <h3 className="text-sm font-bold text-cyan-400 flex items-center space-x-2">
              <Sliders className="w-4 h-4" />
              <span>Interactive Hologram Render Settings</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Field of View Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Field of View Depth (FOV):</span>
                  <span className="text-cyan-400 font-bold">{fov} px</span>
                </div>
                <input
                  type="range"
                  min="180"
                  max="450"
                  value={fov}
                  onChange={(e) => setFov(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>180px (Narrow)</span>
                  <span>280px (Standard)</span>
                  <span>450px (Wide Spatial)</span>
                </div>
              </div>

              {/* Holographic Render Engine Selector */}
              <div className="space-y-2">
                <span className="text-xs text-slate-300">Hologram Shader Quality:</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Quantum Neon', 'Cyber Matrix', 'Wireframe Pure'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setShaderMode(mode)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        shaderMode === mode
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                          : 'bg-[#030712] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Matrix Telemetry Log Feed */}
          <div className="p-4 rounded-2xl bg-[#030712] border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
              <span className="text-slate-400 flex items-center space-x-2">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                <span>Live Matrix Projection Telemetry Log Stream</span>
              </span>
              <span className="text-[10px] text-slate-500">REALTIME TELEMETRY</span>
            </div>
            <div className="space-y-1.5 text-[11px] font-mono text-cyan-300 max-h-28 overflow-y-auto">
              {projectionLogs.map((log, idx) => (
                <div key={idx} className="flex items-start space-x-2">
                  <span className="text-slate-500">&gt;</span>
                  <span>{log}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-4">
            <button
              onClick={triggerRecalibrate}
              disabled={recalibrating}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${recalibrating ? 'animate-spin' : ''}`} />
              <span>{recalibrating ? 'Recalibrating Spatial Grid...' : 'Recalibrate X-Y-Z Matrix'}</span>
            </button>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Close Window
              </button>
              <button
                onClick={handleNavigateScanners}
                className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs transition-all shadow-[0_0_25px_rgba(0,240,255,0.4)] flex items-center space-x-2 cursor-pointer"
              >
                <span>Launch Threat Scanners</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: THREAT PARTICLE ORBIT (35 BEACONS) */}
      {/* ========================================================= */}
      {activeModal === 'beacons' && (
        <div className="relative w-full max-w-5xl glass-panel rounded-3xl border border-purple-500/40 p-6 md:p-8 shadow-[0_0_60px_rgba(168,85,247,0.25)] space-y-6 my-auto max-h-[90vh] overflow-y-auto animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-purple-500/20 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                <Orbit className="w-7 h-7 animate-spin" style={{ animationDuration: '12s' }} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/40">
                    THREAT ORBITAL MATRIX
                  </span>
                  <span className="text-[10px] text-purple-400 font-bold animate-pulse">
                    ● 35 BEACONS IN FIELD
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-100 mt-1">
                  35 Orbital Threat Particle Beacons Explorer
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-2xl border border-transparent hover:border-purple-500/30 transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Quick Metrics & Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#060c17] border border-purple-500/20 space-y-1">
              <span className="text-[11px] text-slate-400">Total Active Beacons:</span>
              <div className="text-2xl font-bold text-purple-400">35 Beacons</div>
              <span className="text-[10px] text-slate-500">Orbiting Shield Radius</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#060c17] border border-red-500/20 space-y-1">
              <span className="text-[11px] text-slate-400">Critical Threats (&gt;90%):</span>
              <div className="text-2xl font-bold text-red-400">18 Nodes</div>
              <span className="text-[10px] text-red-400/80">Immediate Neutralization Required</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#060c17] border border-cyan-500/20 space-y-1">
              <span className="text-[11px] text-slate-400">Avg Orbit Latency:</span>
              <div className="text-2xl font-bold text-cyan-400">18.4 ms</div>
              <span className="text-[10px] text-cyan-400/80">Realtime Signal Pulse</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#060c17] border border-emerald-500/20 space-y-1">
              <span className="text-[11px] text-slate-400">Shield Isolation Status:</span>
              <div className="text-2xl font-bold text-emerald-400">100% Locked</div>
              <span className="text-[10px] text-emerald-400/80">Zero Breach</span>
            </div>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[#060c17] border border-purple-500/20">
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {[
                { label: 'All (35)', val: 'ALL' },
                { label: 'Critical (>92%)', val: 'CRITICAL' },
                { label: 'Phishing URLs', val: 'URL' },
                { label: 'Spoofed Emails', val: 'EMAIL' },
                { label: 'SMS Traps', val: 'SMS' }
              ].map(tab => (
                <button
                  key={tab.val}
                  onClick={() => setBeaconsFilter(tab.val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                    beaconsFilter === tab.val
                      ? 'bg-purple-500/30 border-purple-400 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.3)]'
                      : 'bg-[#030712] border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-purple-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search beacon or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#030712] border border-purple-500/30 text-xs text-slate-100 placeholder-slate-500 focus:border-purple-400 outline-none"
              />
            </div>
          </div>

          {/* 35 Beacons Data List / Grid Table */}
          <div className="rounded-2xl bg-[#030712] border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto max-h-64 overflow-y-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#080d1a] border-b border-slate-800 text-slate-400 font-bold sticky top-0 z-10">
                    <th className="p-3">Beacon ID</th>
                    <th className="p-3">Attack Surface Target</th>
                    <th className="p-3">Threat Vector</th>
                    <th className="p-3">Risk Score</th>
                    <th className="p-3">Orbit Radius</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredBeacons.map((beacon) => (
                    <tr
                      key={beacon.id}
                      onClick={() => setSelectedBeacon(beacon)}
                      className={`hover:bg-purple-950/20 transition-colors cursor-pointer ${
                        selectedBeacon?.id === beacon.id ? 'bg-purple-900/30' : ''
                      }`}
                    >
                      <td className="p-3 font-mono font-bold text-purple-400 flex items-center space-x-2">
                        <Radio className="w-3.5 h-3.5 animate-pulse text-purple-400" />
                        <span>{beacon.id}</span>
                      </td>
                      <td className="p-3 text-slate-200 truncate max-w-xs font-mono">
                        {beacon.surface}
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                          {beacon.type}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded font-bold text-[11px] ${
                          beacon.riskScore > 90
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}>
                          {beacon.riskScore}%
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">
                        {beacon.radius} AU
                      </td>
                      <td className="p-3">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          beacon.status === 'CONTAINED'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        }`}>
                          {beacon.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Neutralization & Orbit Pulse Action */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-4">
            <button
              onClick={triggerNeutralizationPulse}
              disabled={pulseActive}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-purple-600/30 border border-purple-500/50 text-purple-200 hover:bg-purple-600/50 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              <Zap className={`w-4 h-4 ${pulseActive ? 'animate-bounce text-yellow-400' : ''}`} />
              <span>{pulseActive ? 'Broadcasting EMP Containment Wave...' : 'Trigger EMP Shield Containment Pulse'}</span>
            </button>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Close Window
              </button>
              <button
                onClick={() => handleNavigateScanners(selectedBeacon?.type.toLowerCase().includes('email') ? 'email' : selectedBeacon?.type.toLowerCase().includes('sms') ? 'sms' : 'url', selectedBeacon?.surface || '')}
                className="px-6 py-3 rounded-2xl bg-purple-500 hover:bg-purple-400 text-black font-bold text-xs transition-all shadow-[0_0_25px_rgba(168,85,247,0.4)] flex items-center space-x-2 cursor-pointer"
              >
                <span>{selectedBeacon ? `Scan Target (${selectedBeacon.id})` : 'Scan Active Threat Surfaces'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: 3D TILT RESPONSE (LIVE TRACKING) */}
      {/* ========================================================= */}
      {activeModal === 'tilt' && (
        <div className="relative w-full max-w-4xl glass-panel rounded-3xl border border-emerald-500/40 p-6 md:p-8 shadow-[0_0_60px_rgba(16,185,129,0.25)] space-y-6 my-auto max-h-[90vh] overflow-y-auto animate-fade-in">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-4">
            <div className="flex items-center space-x-3">
              <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <Compass className="w-7 h-7 animate-spin" style={{ animationDuration: '15s' }} />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                    PERSPECTIVE GYRO MATRIX
                  </span>
                  <span className="text-[10px] text-emerald-400 font-bold animate-pulse">
                    ● LIVE GYRO TRACKING
                  </span>
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-slate-100 mt-1">
                  3D Tilt Response & Motion Sensor Tracking Telemetry
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-2xl border border-transparent hover:border-emerald-500/30 transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Interactive Gyro Motion Simulator Pad */}
          <div className="p-5 rounded-2xl bg-[#060c17] border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
                <Compass className="w-4 h-4" />
                <span>Interactive 3D Perspective Tilt Simulator (Move Mouse Inside Box)</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                SENSOR LATENCY: 0.4 ms
              </span>
            </div>

            <div
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 45;
                const y = ((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 45;
                setSimPos({ x: Math.round(x), y: Math.round(y) });
              }}
              onMouseLeave={() => setSimPos({ x: 0, y: 0 })}
              className="h-44 rounded-2xl bg-[#030712] border-2 border-dashed border-emerald-500/30 flex items-center justify-center relative overflow-hidden cursor-crosshair group hover:border-emerald-400/80 transition-all"
            >
              {/* Target Horizon Crosshair */}
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
                <div className="w-full h-px bg-emerald-400"></div>
                <div className="h-full w-px bg-emerald-400 absolute"></div>
              </div>

              {/* Dynamic Rotated Hologram Perspective Box */}
              <div
                className="w-32 h-20 rounded-xl bg-emerald-500/10 border border-emerald-400 flex flex-col items-center justify-center transition-transform duration-100 shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                style={{
                  transform: `rotateX(${-simPos.y * (tiltSens / 2)}deg) rotateY(${simPos.x * (tiltSens / 2)}deg) perspective(300px)`
                }}
              >
                <Box className="w-8 h-8 text-emerald-300 animate-pulse" />
                <span className="text-[9px] font-bold text-emerald-400 mt-1">3D MATRIX SHIELD</span>
              </div>

              <div className="absolute bottom-2 left-3 text-[10px] text-slate-400 font-mono">
                Pitch (X): <span className="text-emerald-400 font-bold">{simPos.y}°</span> | Roll (Y): <span className="text-emerald-400 font-bold">{simPos.x}°</span>
              </div>
            </div>
          </div>

          {/* Real-time Angle & Sensor Diagnostics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#060c17] border border-emerald-500/20 space-y-1">
              <span className="text-[11px] text-slate-400">Gyroscope Horizon Lock:</span>
              <div className="text-xl font-bold text-emerald-400">ACTIVE - ZERO DRIFT</div>
              <span className="text-[10px] text-slate-500">Auto-Center Damping Engaged</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#060c17] border border-cyan-500/20 space-y-1">
              <span className="text-[11px] text-slate-400">Tracking Sensitivity:</span>
              <div className="text-xl font-bold text-cyan-400">{tiltSens}x Multiplier</div>
              <span className="text-[10px] text-slate-500">Adjustable Response Curve</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#060c17] border border-purple-500/20 space-y-1">
              <span className="text-[11px] text-slate-400">Sensor Damping Mode:</span>
              <div className="text-xl font-bold text-purple-400">{damping}</div>
              <span className="text-[10px] text-slate-500">Jitter Filtered</span>
            </div>
          </div>

          {/* Sensor Adjustment Controls */}
          <div className="p-5 rounded-2xl bg-[#060c17]/80 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-200">Gyroscope & Perspective Sensitivity Tuning</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300">Tilt Tracking Sensitivity:</span>
                  <span className="text-emerald-400 font-bold">{tiltSens}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.5"
                  value={tiltSens}
                  onChange={(e) => setTiltSens(Number(e.target.value))}
                  className="w-full accent-emerald-400 cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <span className="text-xs text-slate-300">Physics Damping Preset:</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Instant', 'Smooth Physics', 'Heavy Inertia'].map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setDamping(preset)}
                      className={`px-2 py-2 rounded-xl text-[11px] font-bold transition-all border cursor-pointer ${
                        damping === preset
                          ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'bg-[#030712] border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800 pt-4">
            <button
              onClick={() => setSimPos({ x: 0, y: 0 })}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Reset Horizon to Zero (0.0°)</span>
            </button>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <button
                onClick={onClose}
                className="px-5 py-3 rounded-2xl bg-slate-800/80 border border-slate-700 text-slate-300 hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
              >
                Close Window
              </button>
              <button
                onClick={handleNavigateScanners}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-xs transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center space-x-2 cursor-pointer"
              >
                <span>Launch Threat Scanners</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
